import { MediaGalleryServer } from "@/components/media/MediaGalleryServer";
import { UploaderClient } from "@/components/media/UploaderClient";
import { requireAdmin } from "@/lib/auth-utils";

export default async function UploaderPage() {
  // This will redirect to home if not an admin
  await requireAdmin();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploaderClient />
      <MediaGalleryServer isAdmin={true} />
    </main>
  );
}
