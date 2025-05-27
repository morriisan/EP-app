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
    <div className="container mx-auto py-12 px-2">
      
        <h1 className="text-4xl md:text-5xl text-center font-light tracking-wider text-theme-primary mb-8">
          {isAdmin ? "Media Management" : "Gallery"}
        </h1>
        <p className="text-lg text-theme-accent-primary text-center mb-12 font-light">
          Browse our gallery of magical moments and inspiring events
        </p>

        <MediaGalleryClient 
          initialMedia={media} 
          initialTags={allTags}
          initialSelectedTags={selectedTagsParam}
          isAdmin={isAdmin}
        />
      
    </div>
  );
}