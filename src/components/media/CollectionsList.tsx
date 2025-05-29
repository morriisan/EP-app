"use client";

import { Collection } from "@/components/Interface/media";
import { Button } from "@/components/ui/button";
import { MediaCard } from "./MediaCard";
import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CollectionsListProps {
  initialCollections: Collection[];
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function CollectionsList({ initialCollections }: CollectionsListProps) {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  // Use SWR to keep collections in sync
  const { data: collections = initialCollections } = useSWR<Collection[]>(
    '/api/collections',
    fetcher,
    {
      fallbackData: initialCollections,
      revalidateOnFocus: false,
      dedupingInterval: 5000 // Cache for 5 seconds
    }
  );

  // Select the first collection by default 
  useEffect(() => {
    if (collections.length > 0 && !selectedCollection) {
      setSelectedCollection(collections[0]);
    }
    // If currently selected collection was deleted, select first available
    if (selectedCollection && !collections.find(c => c.id === selectedCollection.id)) {
      setSelectedCollection(collections[0] || null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collections]);

  const handleRename = async (collectionId: string, newName: string) => {
    if (!newName.trim()) return;
    
    try {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) throw new Error('Failed to rename collection');

      // Optimistically update the cache
      mutate('/api/collections', 
        collections.map(c => 
          c.id === collectionId ? { ...c, name: newName } : c
        ), 
        false
      );
      
      // Update selected collection if it's the one being renamed
      if (selectedCollection?.id === collectionId) {
        setSelectedCollection({ ...selectedCollection, name: newName });
      }

      setEditingId(null);
      toast.success("Collection renamed successfully");
    } catch (error) {
      console.error('Error renaming collection:', error);
      toast.error("Failed to rename collection");
      mutate('/api/collections'); // Revert on error
    }
  };

  const handleDelete = async (collectionId: string) => {
    if (!confirm("Are you sure you want to delete this collection? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete collection');

      // Optimistically update the cache
      const updatedCollections = collections.filter(c => c.id !== collectionId);
      mutate('/api/collections', updatedCollections, false);
      
      // If the deleted collection was selected, select the first available
      if (selectedCollection?.id === collectionId) {
        setSelectedCollection(updatedCollections[0] || null);
      }

      toast.success("Collection deleted successfully");
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error("Failed to delete collection");
      mutate('/api/collections'); // Revert on error
    }
  };

  const startEditing = (collection: Collection) => {
    setEditingId(collection.id);
    setEditingName(collection.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  const confirmRename = (collectionId: string) => {
    handleRename(collectionId, editingName);
  };

  if (collections.length === 0) return <div>No collections yet</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Collections</h2>
      
      <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        {collections.map((collection) => (
          <div key={collection.id} className="flex items-center gap-1 p-2 border rounded-lg">
            {editingId === collection.id ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmRename(collection.id);
                    if (e.key === 'Escape') cancelEditing();
                  }}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => confirmRename(collection.id)}
                  className="h-8 w-8 p-0"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={cancelEditing}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant={selectedCollection?.id === collection.id ? "default" : "outline"}
                  onClick={() => setSelectedCollection(collection)}
                  className="flex-1 justify-start"
                >
                  {collection.name}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => startEditing(collection)}
                  className="h-8 w-8 p-0"
                  title="Rename collection"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(collection.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  title="Delete collection"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      {selectedCollection && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{selectedCollection.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedCollection.bookmarks.map((bookmark) => (
              <MediaCard
                key={bookmark.media.id}
                media={bookmark.media}
                onTagSelect={() => {}}
                initialIsBookmarked={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 