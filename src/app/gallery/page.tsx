import { MediaGalleryServer } from "@/components/media/MediaGalleryServer";
import { Suspense } from "react";

export default function MediaPage() {
  return (
    <main className="container mx-auto py-8">
      <Suspense fallback={<div>Loading gallery...</div>}>
        <MediaGalleryServer />
      </Suspense>
    </main>
  );
}