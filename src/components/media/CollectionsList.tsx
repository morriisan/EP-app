"use client";

import { Collection } from "@/components/Interface/media";
import { Button } from "@/components/ui/button";
import { MediaCard } from "./MediaCard";
import { useState, useEffect } from "react";
import useSWR from "swr";

interface CollectionsListProps {
  initialCollections: Collection[];
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function CollectionsList({ initialCollections }: CollectionsListProps) {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collections]);

  if (collections.length === 0) return <div>No collections yet</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Collections</h2>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {collections.map((collection) => (
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
                initialIsBookmarked={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 