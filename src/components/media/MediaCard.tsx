import Image from "next/image";
import { Media } from "@/components/Interface/media";
import { useState, useEffect } from "react";
import { BookmarkButton } from "./BookmarkButton";
import { CollectionManager } from "./CollectionManager";
import { Button } from "@/components/ui/button";
import { FolderPlusIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface MediaCardProps {
  media: Media;
  onEdit?: (media: Media) => void;
  onDelete?: (mediaId: string) => void;
  onTagSelect: (tagName: string) => void;
  isAdmin?: boolean;
  initialIsBookmarked?: boolean;
}

export function MediaCard({ 
  media, 
  onEdit,
  onDelete,
  onTagSelect,
  isAdmin = false,
  initialIsBookmarked = false
}: MediaCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [showCollections, setShowCollections] = useState(false);
  const { data: session } = useSession();

  // Add this useEffect to check bookmark status when component mounts
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!session) return;
      
      try {
        const response = await fetch(`/api/bookmarks?mediaId=${media.id}`);
        if (response.ok) {
          const data = await response.json();
          setIsBookmarked(data.isBookmarked);
        }
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };
    
    checkBookmarkStatus();
  }, [media.id, session]);


  const handleBookmarkChange = async () => {
    try {
      const newStatus = !isBookmarked;
      
      console.log('bookmarking!')

      
      const response = await fetch('/api/bookmarks', {
        method: newStatus ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId: media.id }),

      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`Failed to update bookmark: ${errorText}`);
      }
      
      setIsBookmarked(newStatus);
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  return (
    <div className="relative group">
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="relative aspect-square">
          <Image
            src={media.url}
            alt={media.title || "Uploaded media"}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex flex-wrap gap-1">
              {media.tags.map((tag) => (
                <button
                  key={tag.id}
                  className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm hover:bg-black/70 transition-colors"
                  onClick={() => onTagSelect(tag.name)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="p-4">
            <h3 className="font-semibold truncate">{media.title || "Untitled"}</h3>
            
            {onEdit && onDelete && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onEdit(media)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(media.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute top-2 right-2 flex gap-2">
        <BookmarkButton
          mediaId={media.id}
          isBookmarked={isBookmarked}
          onBookmarkChange={handleBookmarkChange}
        />
        {isBookmarked && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCollections(!showCollections)}
          >
            <FolderPlusIcon />
          </Button>
        )}
      </div>

      {showCollections && (
        <div className="absolute top-12 right-2 bg-white p-4 rounded-lg shadow-lg z-10">
          <CollectionManager
            mediaId={media.id}
            onCollectionChange={() => setShowCollections(false)}
          />
        </div>
      )}
    </div>
  );
} 