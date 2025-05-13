"use client";

import { useState } from "react";
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
  const { data: collections = [], isLoading } = useSWR<Collection[]>('/api/collections', fetcher);
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    initialCollections?.map(c => c.id) || []
  );
  const [newCollectionName, setNewCollectionName] = useState("");

  const createCollection = async () => {
    if (!newCollectionName.trim()) return;
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCollectionName }),
      });

      if (!response.ok) throw new Error('Failed to create collection');
      await mutate('/api/collections'); // Revalidate collections data
      setNewCollectionName("");
      toast.success("Collection created successfully");
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error("Failed to create collection");
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