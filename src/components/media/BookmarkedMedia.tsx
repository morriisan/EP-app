"use client";

import { Media } from "@/components/Interface/media";
import { MediaCard } from "@/components/media/MediaCard";
import useSWR from "swr";

interface BookmarkedMediaProps {
  initialMedia: {
    media: Media;
    collections: { id: string; name: string; }[];
  }[];
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function BookmarkedMedia({ initialMedia }: BookmarkedMediaProps) {
  // Use SWR to keep bookmarked media in sync
  const { data: bookmarkedMedia = initialMedia } = useSWR<{
    media: Media;
    collections: { id: string; name: string; }[];
  }[]>(
    '/api/bookmarks/all',
    fetcher,
    {
      fallbackData: initialMedia,
      revalidateOnFocus: false,
      dedupingInterval: 1000 // Cache for 1 second to avoid excessive requests
    }
  );

  if (bookmarkedMedia.length === 0) return <div>No bookmarked media yet</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Bookmarked Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bookmarkedMedia.map(({ media, collections }) => (
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