"use client";

import { useState } from "react";
import { Media, Tag } from "@/components/Interface/media";
import { MediaCard } from "./MediaCard";
import { MediaEditForm } from "./MediaEditForm";
import { TagFilter } from "./TagFilter";

interface MediaGalleryClientProps {
  initialMedia: Media[];
  initialTags: Tag[];
  initialSelectedTags: string[];
  isAdmin: boolean;
}

export function MediaGalleryClient({ 
  initialMedia, 
  initialTags,
  initialSelectedTags,
  isAdmin 
}: MediaGalleryClientProps) {
  const [media, setMedia] = useState<Media[]>(initialMedia);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);
  const [allTags, setAllTags] = useState<Tag[]>(initialTags);
  const [error, setError] = useState<string | null>(null);

  const handleTagSelect = async (tagName: string) => {
    const newSelectedTags = selectedTags.includes(tagName)
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName];
    
    setSelectedTags(newSelectedTags);
    
    try {
      // Fetch media with updated tag filtering
      const queryParams = newSelectedTags.length > 0 
        ? `?tags=${newSelectedTags.join(',')}` 
        : '';
      const response = await fetch(`/api/media${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch media");
      const data = await response.json();
      setMedia(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch media");
    }
  };

  const handleUpdate = async (mediaId: string, title: string, tags: string[]) => {
    try {
      const response = await fetch(`/api/media?id=${mediaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tags }),
      });

      if (!response.ok) throw new Error("Failed to update media");
      
      // Fetch updated media and tags
      const [mediaResponse, tagsResponse] = await Promise.all([
        fetch(`/api/media${selectedTags.length > 0 ? `?tags=${selectedTags.join(',')}` : ''}`),
        fetch('/api/media?type=tags')
      ]);
      
      if (!mediaResponse.ok || !tagsResponse.ok) throw new Error("Failed to refresh data");
      
      const mediaData = await mediaResponse.json();
      const tagsData = await tagsResponse.json();
      
      setMedia(mediaData);
      setAllTags(tagsData);
      setSelectedMedia(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update media");
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      const response = await fetch(`/api/media?id=${mediaId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete media");
      
      // Remove deleted media from state
      setMedia(prev => prev.filter(item => item.id !== mediaId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete media");
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <TagFilter
        tags={allTags}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <MediaCard
            key={item.id}
            media={item}
            onEdit={isAdmin ? setSelectedMedia : undefined}
            onDelete={isAdmin ? handleDelete : undefined}
            onTagSelect={handleTagSelect}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {/* Edit modal only available in admin view */}
      {isAdmin && selectedMedia && (
        <MediaEditForm
          media={selectedMedia}
          onSave={handleUpdate}
          onCancel={() => setSelectedMedia(null)}
        />
      )}
    </>
  );
} 