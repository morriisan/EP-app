"use client";

import { Media } from "@/components/Interface/media";
import { MediaCard } from "./MediaCard";

interface BookmarkedMediaProps {
  initialMedia: {
    media: Media;
    collections: { id: string; name: string; }[];
  }[];
}

export function BookmarkedMedia({ initialMedia }: BookmarkedMediaProps) {
  if (initialMedia.length === 0) return <div>No bookmarked media yet</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Bookmarked Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {initialMedia.map(({ media, collections }) => (
          <MediaCard
            key={media.id}
            media={media}
            initialIsBookmarked={true}
            initialCollections={collections}
            onTagSelect={() => {}}
          />
        ))}
      </div>
    </div>
  );
} 