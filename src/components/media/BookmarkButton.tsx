"use client";

import { Button } from "@/components/ui/button";
import { BookmarkIcon, BookmarkPlusIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useSWRConfig } from "swr";

interface BookmarkButtonProps {
  mediaId: string;
  isBookmarked: boolean;
  collections?: { id: string; name: string; }[];
  onBookmarkChange: (bookmarkData: { 
    isBookmarked: boolean; 
    collections: { id: string; name: string; }[] 
  }) => void;
}

export function BookmarkButton({ 
  mediaId, 
  isBookmarked, 
  onBookmarkChange 
}: BookmarkButtonProps) {
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();

  const handleBookmark = async () => {
    if (!session) return;

    // Optimistically update UI
    onBookmarkChange({
      isBookmarked: !isBookmarked,
      collections: []
    });

    try {
      const response = await fetch('/api/bookmarks', {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId }),
      });

      if (!response.ok) throw new Error('Failed to update bookmark');
      const data = await response.json();
      
      // Update all related SWR cache entries
      await Promise.all([
        mutate(`/api/bookmarks?mediaId=${mediaId}`),
        mutate('/api/collections'),
        mutate((key) => typeof key === 'string' && key.startsWith('/api/bookmarks'))
      ]);

      onBookmarkChange(data);
    } catch (error) {
      console.error('Error updating bookmark:', error);
      // Revert optimistic update on error
      onBookmarkChange({
        isBookmarked: isBookmarked,
        collections: []
      });
    }
  };

  if (!session) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleBookmark}
      className={`bg-black/50 hover:bg-black/70 backdrop-blur-sm cursor-pointer ${
        isBookmarked ? "text-yellow-500 hover:text-yellow-500" : "text-white"
      }`}
    >
      {isBookmarked ? <BookmarkIcon /> : <BookmarkPlusIcon />}
    </Button>
  );
} 