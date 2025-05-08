"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";

interface Collection {
  id: string;
  name: string;
}

interface CollectionManagerProps {
  mediaId: string;
  onCollectionChange: () => void;
}

export function CollectionManager({ mediaId, onCollectionChange }: CollectionManagerProps) {
  const { data: session } = useSession();
  const [collections, setCollections] = useState<Collection[]>([]);
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
      setNewCollectionName("");
      await fetchCollections();
    } catch (error) {
      console.error('Error creating collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCollection = async (collectionId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId, collectionId }),
      });

      if (!response.ok) throw new Error('Failed to add to collection');
      onCollectionChange();
    } catch (error) {
      console.error('Error adding to collection:', error);
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
        {collections.map((collection) => (
          <Button
            key={collection.id}
            variant="outline"
            className="w-full justify-start"
            onClick={() => addToCollection(collection.id)}
            disabled={loading}
          >
            {collection.name}
          </Button>
        ))}
      </div>
    </div>
  );
} 