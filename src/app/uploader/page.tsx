import { MediaGalleryServer } from "@/components/media/MediaGalleryServer";
import { UploaderClient } from "@/components/media/UploaderClient";

export default function UploaderPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploaderClient />
      <MediaGalleryServer isAdmin={true} />
    </main>
  );
}
