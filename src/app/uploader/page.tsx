import { MediaGalleryServer } from "@/components/media/MediaGalleryServer";



export default async function UploaderPage() {
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MediaGalleryServer isAdmin={true} />
    </main>
  );
}
