import Image from "next/image";
import { Media } from "@/components/Interface/media";
import { useState, useEffect, useCallback } from "react";
import { BookmarkButton } from "./BookmarkButton";
import { CollectionManager } from "./CollectionManager";
import { Button } from "@/components/ui/button";
import { FolderPlusIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useDebounceValue } from "@/hooks/useDebounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MediaCardProps {
  media: Media;
  onEdit?: (media: Media) => void;
  onDelete?: (mediaId: string) => void;
  onTagSelect: (tagName: string) => void;
  isAdmin?: boolean;
  initialIsBookmarked?: boolean;
  initialCollections?: { id: string; name: string; }[];
}

export function MediaCard({ 
  media, 
  onEdit,
  onDelete,
  onTagSelect,
  isAdmin = false,
  initialIsBookmarked = false,
  initialCollections = []
}: MediaCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [collections, setCollections] = useState(initialCollections);
  const [showCollections, setShowCollections] = useState(false);
  const { data: session } = useSession();

  // Debounce the mediaId to prevent multiple rapid requests
  const debouncedMediaId = useDebounceValue(media.id, 300);

  const checkBookmarkStatus = useCallback(async () => {
    if (!session) return;
    
    try {
      const response = await fetch(`/api/bookmarks?mediaId=${debouncedMediaId}`);
      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.isBookmarked);
        setCollections(data.collections || []);
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  }, [debouncedMediaId, session]);

  useEffect(() => {
    if (debouncedMediaId) {
      checkBookmarkStatus();
    }
  }, [debouncedMediaId, checkBookmarkStatus]);

  const handleBookmarkChange = async (bookmarkData: { isBookmarked: boolean; collections: any[] }) => {
    setIsBookmarked(bookmarkData.isBookmarked);
    setCollections(bookmarkData.collections);
  };

  return (
    <div className="relative group">
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="relative aspect-square">
          <Image
            src={media.url}
            alt={media.title || "Uploaded media"}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Tags overlay with blur effect */}
          <div className="absolute bottom-0 left-0 right-0 p-2 ">
            <div className="flex flex-wrap gap-1">
              {media.tags.map((tag) => (
                <button
                  key={tag.id}
                  className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm hover:bg-black/80 transition-colors"
                  onClick={() => onTagSelect(tag.name)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex gap-2 transition-opacity duration-200">
            <BookmarkButton
              mediaId={media.id}
              isBookmarked={isBookmarked}
              collections={collections}
              onBookmarkChange={handleBookmarkChange}
              
            />
            {isBookmarked && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCollections(true)}
                className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
              >
                <FolderPlusIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="p-4 border-t">
            <h3 className="font-semibold truncate mb-4">{media.title || "Untitled"}</h3>
            
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  onClick={() => onEdit(media)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  onClick={() => onDelete(media.id)}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={showCollections} onOpenChange={setShowCollections}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Collections</DialogTitle>
          </DialogHeader>
          <CollectionManager
            mediaId={media.id}
            initialCollections={collections}
            onCollectionChange={(updatedCollections) => {
              setCollections(updatedCollections);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 