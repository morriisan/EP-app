"use client";



import { useState, useEffect } from "react";
import { Media, Tag } from "@/components/Interface/media";
import { MediaCard } from "./MediaCard";
import { MediaEditForm } from "./MediaEditForm";
import { TagFilter } from "./TagFilter";


interface MediaGalleryProps {
    isAdmin?: boolean;
  }

export function MediaGallery({ isAdmin = false }: MediaGalleryProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  //  fetch tags
  const fetchTags = async () => {
    const response = await fetch('/api/media?type=tags');
    if (!response.ok) throw new Error("Failed to fetch tags");
    const tags = await response.json();
    setAllTags(tags);
  };

  // Fetch media
  const fetchMedia = async () => {
    try {
      const queryParams = selectedTags.length > 0 
        ? `?tags=${selectedTags.join(',')}` 
        : '';
      const response = await fetch(`/api/media${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch media");
      const data = await response.json();
      setMedia(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags(); // Fetch tags once when component mounts
  }, []);

  useEffect(() => {
    fetchMedia(); // Fetch media when selected tags change
  }, [selectedTags]);

  const handleTagSelect = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleUpdate = async (mediaId: string, title: string, tags: string[]) => {
    try {
      const response = await fetch(`/api/media?id=${mediaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tags }),
      });

      if (!response.ok) throw new Error("Failed to update media");
      
      await fetchMedia();
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
      
      await fetchMedia();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete media");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isAdmin ? "Media Management" : "Gallery"}
      </h1>

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
    </div>
  );
} 