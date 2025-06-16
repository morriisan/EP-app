"use client";
import Image from "next/image";
import { Media } from "@/components/Interface/media";
import { useState, useEffect} from "react";
import { BookmarkButton } from "./BookmarkButton";
import { CollectionManager } from "./CollectionManager";
import { Button } from "@/components/ui/button";
import { FolderPlusIcon } from "lucide-react";

import { mutate } from "swr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { TagManager } from "./TagManager";

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
  const [showCollections, setShowCollections] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(media.isBookmarked ?? initialIsBookmarked);
  const [collections, setCollections] = useState(initialCollections);

  // Update bookmark state when media prop changes
  useEffect(() => {
    setIsBookmarked(media.isBookmarked ?? initialIsBookmarked);
  }, [media.isBookmarked, initialIsBookmarked]);

  const handleBookmarkChange = (bookmarkData: { isBookmarked: boolean; collections: { id: string; name: string; }[] }) => {
    setIsBookmarked(bookmarkData.isBookmarked);
    setCollections(bookmarkData.collections);
    // Invalidate collections cache
    mutate('/api/collections');
  };

  const handleCollectionChange = (updatedCollections: { id: string; name: string; }[]) => {
    setCollections(updatedCollections);
    // Invalidate collections cache
    mutate('/api/collections');
  };

  return (
    <div 
      className="relative group"
    >
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="relative aspect-square cursor-pointer" onClick={() => setShowFullImage(true)}>
          <Image
            src={media.url}
            alt={media.title || "Uploaded media"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, (max-width: 1024px) 512px, 640px"
            quality={75}
            placeholder="blur"
            blurDataURL={media.blurDataURL || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjNmNGY2Ii8+Cjwvc3ZnPgo="}
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
            onCollectionChange={handleCollectionChange}
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
            width={800}
            height={600}
            className="max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain"
            placeholder="blur"
            blurDataURL={media.blurDataURL || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjNmNGY2Ii8+Cjwvc3ZnPgo="}
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