"use client";

import { Button } from "@/components/ui/button";
import { BookmarkIcon, BookmarkPlusIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { mutate } from "swr";
import { Media } from "@/components/Interface/media";

interface BookmarkButtonProps {
  mediaId: string;
  isBookmarked: boolean;
  collections?: { id: string; name: string; }[];
  onBookmarkChange: (bookmarkData: { 
    isBookmarked: boolean; 
    collections: { id: string; name: string; }[] 
  }) => void;
}

// Define types for the cache data structure
interface MediaPageData {
  media: Media[];
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
}

export function BookmarkButton({ 
  mediaId, 
  isBookmarked, 
  onBookmarkChange 
}: BookmarkButtonProps) {
  const { data: session } = useSession();

  const handleBookmark = async () => {
    if (!session) return;

    const newBookmarkState = {
      isBookmarked: !isBookmarked,
      collections: []
    };

    // Optimistically update UI
    onBookmarkChange(newBookmarkState);

    try {
      const response = await fetch('/api/bookmarks', {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId }),
      });

      if (!response.ok) throw new Error('Failed to update bookmark');
      const data = await response.json();
      
      // Only update if server response differs from optimistic update
      if (data.isBookmarked !== newBookmarkState.isBookmarked) {
        onBookmarkChange(data);
      }
      
      // Optimistically update all caches instead of invalidating
      
      // Update media gallery cache optimistically with better error handling
      mutate(
        key => typeof key === 'string' && key.includes('/api/media?page='),
        (data: MediaPageData | undefined) => {
          if (!data || !data.media || !Array.isArray(data.media)) return data;
          // Update the media item's bookmark status in this page's cache
          return {
            ...data,
            media: data.media.map((item: Media) => 
              item.id === mediaId 
                ? { ...item, isBookmarked: newBookmarkState.isBookmarked }
                : item
            )
          };
        },
        { 
          revalidate: false, // Don't revalidate, just update cache
          populateCache: true, // Ensure the cache is populated
          rollbackOnError: true // Automatically rollback on error
        }
      );

      // Update bookmarks cache
      mutate('/api/bookmarks/all');
      mutate('/api/collections');
      
      toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
    } catch (error) {
      console.error('Error updating bookmark:', error);
      // Revert optimistic update on error
      onBookmarkChange({
        isBookmarked: isBookmarked,
        collections: []
      });
      // Also revert cache changes on error
      mutate(key => typeof key === 'string' && key.includes('/api/media?page='));
      toast.error("Failed to update bookmark");
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