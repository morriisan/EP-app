"use client";

import { Media } from "@/components/Interface/media";
import { useState } from "react";

interface MediaEditFormProps {
  media: Media;
  onSave: (mediaId: string, title: string, tags: string[]) => Promise<void>;
  onCancel: () => void;
}

export function MediaEditForm({ media, onSave, onCancel }: MediaEditFormProps) {
  const [title, setTitle] = useState(media.title || "");
  const [tagInput, setTagInput] = useState(media.tags.map(t => t.name).join(", "));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagInput.split(",").map(tag => tag.trim()).filter(Boolean);
    await onSave(media.id, title, tags);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Edit Media</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1">Tags (comma-separated)</label>
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
  );
} 