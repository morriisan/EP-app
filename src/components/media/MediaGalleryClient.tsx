"use client";

import { useState } from "react";
import { Media, Tag } from "@/components/Interface/media";
import { MediaCard } from "./MediaCard";
import { MediaEditForm } from "./MediaEditForm";
import { TagFilter } from "./TagFilter";
import { UploaderClient } from "./UploaderClient";
import useSWRInfinite from "swr/infinite";
import { mutate } from "swr";
import { toast } from "sonner";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import useSWR from "swr";

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

  // SWR Infinite setup
  const getKey = (pageIndex: number, previousPageData: { hasMore: boolean; media: Media[] } | null) => {
    if (previousPageData && !previousPageData.hasMore) return null;
    const params = selectedTags.length > 0 ? `&tags=${selectedTags.join(',')}` : '';
    return `/api/media?page=${pageIndex + 1}&limit=12${params}`;
  };

  const { 
    data, 
    error: mediaError, 
    size, 
    setSize, 
    isLoading, 
    mutate: mutateInfinite
  } = useSWRInfinite(getKey, fetcher, {
    fallbackData: [{ media: initialMedia, hasMore: true, totalCount: initialMedia.length }]
  });

  // Flatten all pages into single array
  const allMedia = data ? data.flatMap(page => page.media) : [];
  const hasMore = Boolean(data && data[data.length - 1]?.hasMore);
  const isLoadingMore = Boolean(isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined'));

  // Infinite scroll hook
  const { lastElementRef } = useInfiniteScroll({
    loading: isLoadingMore,
    hasMore: hasMore,
    onLoadMore: () => setSize(size + 1),
  });

  // Tags data (separate from infinite media)
  const { data: allTags = initialTags, error: tagsError } = useSWR('/api/media?type=tags', fetcher);

  const handleTagSelect = async (tagName: string) => {
    const newSelectedTags = selectedTags.includes(tagName)
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName];
    
    setSelectedTags(newSelectedTags);
    
    // Reset pagination when filters change
    mutateInfinite();
    setSize(1);
  };

  const handleUpdate = async (mediaId: string, title: string, tags: string[]) => {
    try {
      // Optimistic update - update UI immediately
      const optimisticData = data?.map(page => ({
        ...page,
        media: page.media.map((item: Media) => 
          item.id === mediaId 
            ? { 
                ...item, 
                title, 
                tags: tags.map(tagName => ({ 
                  id: `temp-${tagName}`, // Temporary ID for optimistic update
                  name: tagName 
                }))
              }
            : item
        )
      }));
      
      // Update cache immediately (optimistic)
      mutateInfinite(optimisticData, false);
      toast.success("Media updated successfully");
      setSelectedMedia(null);

      // Sync with server in background - just make the API call, don't revalidate
      const response = await fetch(`/api/media?id=${mediaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tags }),
      });

      if (!response.ok) throw new Error("Failed to update media");
      
      // Only update tags if needed (this is a lightweight call)
      mutate('/api/media?type=tags');
      
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Failed to update media");
      toast.error("Failed to update media");
      
      // Revert optimistic update on error
      mutateInfinite();
      setSelectedMedia(null);
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      // Optimistic delete - remove from UI immediately
      const optimisticData = data?.map(page => ({
        ...page,
        media: page.media.filter((item: Media) => item.id !== mediaId)
      }));
      
      // Update cache immediately (optimistic)
      mutateInfinite(optimisticData, false);
      toast.success("Media deleted successfully");

      // Sync with server in background - just make the API call, don't revalidate
      const response = await fetch(`/api/media?id=${mediaId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete media");
      
      // Only update tags if needed (this is a lightweight call)
      mutate('/api/media?type=tags');
      
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Failed to delete media");
      toast.error("Failed to delete media");
      
      // Revert optimistic delete on error
      mutateInfinite();
    }
  };

  if (mediaError || tagsError) return <div>Error loading data</div>;

  return (
    <div className="space-y-8">
      {isAdmin && <UploaderClient />}
      <TagFilter
        tags={allTags}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        {allMedia.map((item: Media, index) => {
          // Attach ref to last item to trigger loading
          const isLastItem = index === allMedia.length - 1;
          
          return (
            <div
              key={item.id}
              ref={isLastItem ? lastElementRef : null}
            >
              <MediaCard
                media={item}
                onEdit={isAdmin ? setSelectedMedia : undefined}
                onDelete={isAdmin ? handleDelete : undefined}
                onTagSelect={handleTagSelect}
                isAdmin={isAdmin}
              />
            </div>
          );
        })}
      </div>

      {/* Loading indicator */}
      {isLoadingMore && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading more images...</span>
          </div>
        </div>
      )}

      {/* End of results */}
      {!hasMore && allMedia.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You&apos;ve reached the end!</p>
        </div>
      )}

      {/* No results */}
      {!isLoading && allMedia.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No images found</p>
        </div>
      )}

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