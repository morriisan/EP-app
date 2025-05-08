"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, BookmarkPlusIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface BookmarkButtonProps {
  mediaId: string;
  isBookmarked: boolean;
  onBookmarkChange: () => void;
}

export function BookmarkButton({ mediaId, isBookmarked, onBookmarkChange }: BookmarkButtonProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const response = await fetch('/api/bookmarks', {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId }),
      });

      if (!response.ok) throw new Error('Failed to update bookmark');
      onBookmarkChange();
    } catch (error) {
      console.error('Error updating bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleBookmark}
      disabled={loading}
      className={isBookmarked ? "text-yellow-500" : ""}
    >
      {isBookmarked ? <BookmarkIcon /> : <BookmarkPlusIcon />}
    </Button>
  );
} 