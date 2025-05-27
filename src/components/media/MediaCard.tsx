"use client";
import Image from "next/image";
import { Media } from "@/components/Interface/media";
import { useState } from "react";
import { BookmarkButton } from "./BookmarkButton";
import { CollectionManager } from "./CollectionManager";
import { Button } from "@/components/ui/button";
import { FolderPlusIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useDebounceValue } from "@/hooks/useDebounce";
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { TagManager } from "./TagManager";

interface BookmarkData {
  isBookmarked: boolean;
  collections: { id: string; name: string; }[];
}

interface MediaCardProps {
  media: Media;
  onEdit?: (media: Media) => void;
  onDelete?: (mediaId: string) => void;
  onTagSelect: (tagName: string) => void;
  isAdmin?: boolean;
  initialIsBookmarked?: boolean;
  initialCollections?: { id: string; name: string; }[];
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function MediaCard({ 
  media, 
  onEdit,
  onDelete,
  onTagSelect,
  isAdmin = false,
  initialIsBookmarked = false,
  initialCollections = []
}: MediaCardProps) {
  const [showCollections, setShowCollections] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const { data: session } = useSession();

  // Debounce the mediaId to prevent multiple rapid requests
  const debouncedMediaId = useDebounceValue(media.id, 300);

  // Use SWR for bookmark status
  const { data: bookmarkData, mutate: mutateBookmark } = useSWR<BookmarkData>(
    session && debouncedMediaId ? `/api/bookmarks?mediaId=${debouncedMediaId}` : null,
    fetcher,
    {
      fallbackData: {
        isBookmarked: initialIsBookmarked,
        collections: initialCollections
      }
    }
  );

  const isBookmarked = bookmarkData?.isBookmarked ?? initialIsBookmarked;
  const collections = bookmarkData?.collections ?? initialCollections;

  const handleBookmarkChange = async (bookmarkData: BookmarkData) => {
    mutateBookmark(bookmarkData, false); // Update local data immediately
  };

  return (
    <div className="relative group">
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="relative aspect-square cursor-pointer" onClick={() => setShowFullImage(true)}>
          <Image
            src={media.url}
            alt={media.title || "Uploaded media"}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Tags overlay with blur effect */}
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <div className="flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
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
            <div onClick={(e) => e.stopPropagation()}>
              <BookmarkButton
                mediaId={media.id}
                isBookmarked={isBookmarked}
                collections={collections}
                onBookmarkChange={handleBookmarkChange}
              />
            </div>
            {isBookmarked && (
              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCollections(true)}
                  className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                >
                  <FolderPlusIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="p-4 border-t bg-theme-accent-secondary">
            <h3 className="font-semibold truncate mb-4 text-theme-default">{media.title || "Untitled"}</h3>
            
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
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  Delete
                </Button>
              )}
                 <Button
                onClick={() => setShowTagManager(true)}
                variant="outline"
                size="sm"
                className="flex-1 "
              >
                Manage Tags
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Collections Dialog */}
      <Dialog open={showCollections} onOpenChange={setShowCollections}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Collections</DialogTitle>
          </DialogHeader>
          <CollectionManager
            mediaId={media.id}
            initialCollections={collections}
            onCollectionChange={(updatedCollections) => {
              mutateBookmark({
                isBookmarked,
                collections: updatedCollections
              }, false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Full Image Dialog */}
      <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 border-none bg-transparent shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>{media.title || "Image Preview"}</DialogTitle>
          </DialogHeader>
          <Image
            src={media.url}
            alt={media.title || "Uploaded media"}
            width={1200}
            height={800}
            className="max-w-[95vw] max-h-[95vh] min-h-[50vh] w-auto h-auto object-contain"
            priority
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={() => {
          onDelete?.(media.id);
          setShowDeleteConfirm(false);
        }}
        title="Delete Media"
        description={`Are you sure you want to delete "${media.title || 'this media'}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      {/* Tag Manager Modal */}
      {showTagManager && (
        <TagManager onClose={() => setShowTagManager(false)} />
      )}
    </div>
  );
} 