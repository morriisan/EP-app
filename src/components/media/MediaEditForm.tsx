"use client";

import { Media } from "@/components/Interface/media";
import { useState } from "react";
import { TagManager } from "./TagManager";
import { Button } from "@/components/ui/button";

interface MediaEditFormProps {
  media: Media;
  onSave: (mediaId: string, title: string, tags: string[]) => Promise<void>;
  onCancel: () => void;
}

export function MediaEditForm({ media, onSave, onCancel }: MediaEditFormProps) {
  const [title, setTitle] = useState(media.title || "");
  const [tagInput, setTagInput] = useState(media.tags.map(t => t.name).join(", "));
  const [showTagManager, setShowTagManager] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagInput.split(",").map(tag => tag.trim()).filter(Boolean);
    await onSave(media.id, title, tags);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
        <div className="bg-theme-accent-secondary rounded-lg p-6 max-w-lg w-full">
          <h2 className="text-xl font-bold mb-4 text-theme-primary">Edit Media</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-theme-default">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-theme-default">Tags (comma-separated)</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTagManager(true)}
                  className="text-xs"
                >
                  Manage Tags
                </Button>
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tag Manager Modal */}
      {showTagManager && (
        <TagManager onClose={() => setShowTagManager(false)} />
      )}
    </>
  );
} 