"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";
import { Check } from "lucide-react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";

interface Collection {
  id: string;
  name: string;
}

interface CollectionManagerProps {
  mediaId: string;
  initialCollections?: { id: string; name: string; }[];
  onCollectionChange: (collections: { id: string; name: string; }[]) => void;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function CollectionManager({ mediaId, initialCollections, onCollectionChange }: CollectionManagerProps) {
  const { data: session } = useSession();
  const { data: collections = [], isLoading } = useSWR<Collection[]>('/api/collections', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds instead of 5
    revalidateOnFocus: true,
    dedupingInterval: 10000 // Cache for 10 seconds
  });
  
  // Fetch current collections for this specific media item
  const { data: mediaCollections = [] } = useSWR<{ id: string; name: string; }[]>(
    `/api/bookmarks/${mediaId}/collections`,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000 // Cache for 5 seconds to prevent duplicate requests
    }
  );
  
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    initialCollections?.map(c => c.id) || []
  );
  const [newCollectionName, setNewCollectionName] = useState("");

  // Sync selectedCollections with both initialCollections prop changes and server data
  useEffect(() => {
    if (mediaCollections.length > 0) {
      setSelectedCollections(mediaCollections.map(c => c.id));
    } else if (initialCollections) {
      setSelectedCollections(initialCollections.map(c => c.id));
    }
  }, [mediaCollections, initialCollections]);

  const createCollection = async () => {
    if (!newCollectionName.trim()) return;
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCollectionName }),
      });

      if (!response.ok) throw new Error('Failed to create collection');
      
      const newCollection = await response.json();
      
      // Optimistically update the cache with the new collection
      mutate('/api/collections', [...collections, newCollection], false);
      
      setNewCollectionName("");
      toast.success("Collection created successfully");
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error("Failed to create collection");
      
      // Revert on error
      mutate('/api/collections');
    }
  };

  const toggleCollection = async (collectionId: string) => {
    const isRemoving = selectedCollections.includes(collectionId);
    const collectionName = collections.find(c => c.id === collectionId)?.name;
    
    try {
      const endpoint = `/api/bookmarks/${mediaId}/collections/${collectionId}`;
      
      const response = await fetch(endpoint, {
        method: isRemoving ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error(isRemoving ? 'Failed to remove from collection' : 'Failed to add to collection');
      
      const updatedCollections = isRemoving
        ? selectedCollections.filter(id => id !== collectionId)
        : [...selectedCollections, collectionId];
      
      setSelectedCollections(updatedCollections);
      
      // Update parent with full collection objects
      const updatedCollectionObjects = collections?.filter(c => 
        updatedCollections.includes(c.id)
      ) || [];
      onCollectionChange(updatedCollectionObjects);

      // Refresh both the main collections and media-specific collections
      mutate(`/api/bookmarks/${mediaId}/collections`);

      toast.success(isRemoving 
        ? `Removed from ${collectionName}`
        : `Added to ${collectionName}`
      );
    } catch (error) {
      console.error('Error toggling collection:', error);
      toast.error(isRemoving 
        ? "Failed to remove from collection"
        : "Failed to add to collection"
      );
    }
  };

  if (!session) return null;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="New collection name"
        />
        <Button onClick={createCollection} disabled={isLoading}>
          Create
        </Button>
      </div>

      <div className="space-y-2">
        {collections.map((collection) => {
          const isSelected = selectedCollections.includes(collection.id);
          return (
            <Button
              key={collection.id}
              variant={isSelected ? "default" : "outline"}
              className="w-full justify-between"
              onClick={() => toggleCollection(collection.id)}
              disabled={isLoading}
            >
              {collection.name}
              {isSelected && <Check className="h-4 w-4" />}
            </Button>
          );
        })}
      </div>
    </div>
  );
} 