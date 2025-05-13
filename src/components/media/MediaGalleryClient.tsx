"use client";

import { useState } from "react";
import { Media, Tag } from "@/components/Interface/media";
import { MediaCard } from "./MediaCard";
import { MediaEditForm } from "./MediaEditForm";
import { TagFilter } from "./TagFilter";
import { UploaderClient } from "./UploaderClient";
import useSWR, { mutate } from "swr";

interface MediaGalleryClientProps {
  initialMedia: Media[];
  initialTags: Tag[];
  initialSelectedTags: string[];
  isAdmin: boolean;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function MediaGalleryClient({ 
  initialMedia, 
  initialTags,
  initialSelectedTags,
  isAdmin 
}: MediaGalleryClientProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);

  const queryParams = selectedTags.length > 0 ? `?tags=${selectedTags.join(',')}` : '';
  const { data: media = initialMedia, error: mediaError } = useSWR(`/api/media${queryParams}`, fetcher);
  const { data: allTags = initialTags, error: tagsError } = useSWR('/api/media?type=tags', fetcher);

  const handleTagSelect = async (tagName: string) => {
    const newSelectedTags = selectedTags.includes(tagName)
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName];
    
    setSelectedTags(newSelectedTags);
  };

  const handleUpdate = async (mediaId: string, title: string, tags: string[]) => {
    try {
      const response = await fetch(`/api/media?id=${mediaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tags }),
      });

      if (!response.ok) throw new Error("Failed to update media");
      
      // Mutate both media and tags data
      await Promise.all([
        mutate(`/api/media${queryParams}`),
        mutate('/api/media?type=tags')
      ]);
      
      setSelectedMedia(null);
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Failed to update media");
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      const response = await fetch(`/api/media?id=${mediaId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete media");
      
      // Mutate both media and tags data
      await Promise.all([
        mutate(`/api/media${queryParams}`),
        mutate('/api/media?type=tags')
      ]);
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Failed to delete media");
    }
  };

  if (mediaError || tagsError) return <div>Error loading data</div>;

  return (
    <>
      {isAdmin && <UploaderClient />}
      <TagFilter
        tags={allTags}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
      />

      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 ">
        {media.map((item: Media) => (
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