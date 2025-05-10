"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";
import { Check } from "lucide-react";

interface Collection {
  id: string;
  name: string;
}

interface CollectionManagerProps {
  mediaId: string;
  initialCollections?: { id: string; name: string; }[];
  onCollectionChange: (collections: { id: string; name: string; }[]) => void;
}

export function CollectionManager({ mediaId, initialCollections, onCollectionChange }: CollectionManagerProps) {
  const { data: session } = useSession();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    initialCollections?.map(c => c.id) || []
  );
  const [newCollectionName, setNewCollectionName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      if (!response.ok) throw new Error('Failed to fetch collections');
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const createCollection = async () => {
    if (!newCollectionName.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCollectionName }),
      });

      if (!response.ok) throw new Error('Failed to create collection');
      const newCollection = await response.json();
      setCollections(prev => [...prev, newCollection]);
      setNewCollectionName("");
    } catch (error) {
      console.error('Error creating collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCollection = async (collectionId: string) => {
    setLoading(true);
    try {
      const isRemoving = selectedCollections.includes(collectionId);
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
      const updatedCollectionObjects = collections.filter(c => 
        updatedCollections.includes(c.id)
      );
      onCollectionChange(updatedCollectionObjects);
    } catch (error) {
      console.error('Error toggling collection:', error);
    } finally {
      setLoading(false);
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
        <Button onClick={createCollection} disabled={loading}>
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
              disabled={loading}
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