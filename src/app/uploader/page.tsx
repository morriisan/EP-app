"use client";

import {UploadDropzone } from "@/utils/uploadthing";
import{MediaGallery} from "@/components/media/MediaGallery";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <UploadDropzone
        endpoint="imageUploader"
        
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />

      <MediaGallery isAdmin={true}/>
    </main>
  );
}
