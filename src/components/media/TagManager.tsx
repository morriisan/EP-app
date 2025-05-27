"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { X } from "lucide-react";
import { TagWithCount } from "@/services/tagService";

type Tag = TagWithCount;

interface TagManagerProps {
  onClose: () => void;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function TagManager({ onClose }: TagManagerProps) {
  const [deletingTagId, setDeletingTagId] = useState<string | null>(null);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

  const { data: tags = [], error, isLoading, mutate } = useSWR<Tag[]>('/api/tags', fetcher);

  const deleteTag = async (tagId: string) => {
    setDeletingTagId(tagId);
    try {
      const response = await fetch(`/api/tags?id=${tagId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete tag');
      }

      toast.success('Tag deleted successfully');
      // Revalidate the tags data
      mutate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete tag');
    } finally {
      setDeletingTagId(null);
      setTagToDelete(null);
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
        <div className="bg-theme-section-primary rounded-lg p-6 max-w-2xl w-full">
          <div className="text-center text-red-500">
            Failed to load tags. Please try again.
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
        <div className="bg-theme-section-primary rounded-lg p-6 max-w-2xl w-full">
          <div className="text-center">Loading tags...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
        <div className="bg-theme-accent-secondary rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-theme-primary">Tag Management</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-theme-secondary hover:text-theme-primary"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="overflow-y-auto max-h-[60vh]">
            {tags.length === 0 ? (
              <div className="text-center py-8 text-theme-secondary">
                No tags found.
              </div>
            ) : (
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-3 bg-theme-hover-primary rounded-lg border border-theme-border-default"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-theme-primary">{tag.name}</span>
                      <span className="text-sm text-theme-secondary bg-theme-section-secondary px-2 py-1 rounded">
                        {tag._count.media} media item{tag._count.media !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {tag._count.media === 0 ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setTagToDelete(tag)}
                        disabled={!!deletingTagId}
                      >
                        {deletingTagId === tag.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    ) : (
                      <span className="text-sm text-theme-secondary ">
                        In use - cannot delete
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={!!tagToDelete}
        onOpenChange={(open) => !open && setTagToDelete(null)}
        onConfirm={() => tagToDelete && deleteTag(tagToDelete.id)}
        title="Delete Tag"
        description={`Are you sure you want to delete the tag "${tagToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Tag"
        variant="destructive"
      />
    </>
  );
} 