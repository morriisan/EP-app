"use client";

import { Button } from "@/components/ui/button";
import { BookmarkIcon, BookmarkPlusIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

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
      
      // Update final state with real data from server (if needed)
      onBookmarkChange(data);
      toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
    } catch (error) {
      console.error('Error updating bookmark:', error);
      // Revert optimistic update on error
      onBookmarkChange({
        isBookmarked: isBookmarked,
        collections: []
      });
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