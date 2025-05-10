"use client";

import { Collection } from "@/components/Interface/media";
import { Button } from "@/components/ui/button";
import { MediaCard } from "./MediaCard";
import { useState, useEffect } from "react";

interface CollectionsListProps {
  initialCollections: Collection[];
}

export function CollectionsList({ initialCollections }: CollectionsListProps) {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  // Select the first collection by default 
  useEffect(() => {
    if (initialCollections.length > 0 && !selectedCollection) {
      setSelectedCollection(initialCollections[0]);
    }
  //  only run when initialCollections changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCollections]);

  if (initialCollections.length === 0) return <div>No collections yet</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Collections</h2>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {initialCollections.map((collection) => (
          <Button
            key={collection.id}
            variant={selectedCollection?.id === collection.id ? "default" : "outline"}
            onClick={() => setSelectedCollection(collection)}
          >
            {collection.name}
          </Button>
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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 