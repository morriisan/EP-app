import { mediaService } from "@/services/mediaService";
import { MediaGalleryClient } from "@/components/media/MediaGalleryClient";

interface MediaGalleryServerProps {
  isAdmin?: boolean;
  selectedTagsParam?: string[];
}

export async function MediaGalleryServer({ 
  isAdmin = false, 
  selectedTagsParam = [] 
}: MediaGalleryServerProps) {
  // Fetch tags (server-side)
  const allTags = await mediaService.getAllTags();
  
  // Fetch media with tag filtering 
  const media = await mediaService.getAllMedia(selectedTagsParam);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isAdmin ? "Media Management" : "Gallery"}
      </h1>

      <MediaGalleryClient 
        initialMedia={media} 
        initialTags={allTags}
        initialSelectedTags={selectedTagsParam}
        isAdmin={isAdmin}
      />
    </div>
  );
}