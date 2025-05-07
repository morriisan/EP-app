"use client";

import {UploadDropzone } from "@/utils/uploadthing";
import{MediaGallery} from "@/components/media/MediaGallery";
import {useState} from "react";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <UploadDropzone
        endpoint="imageUploader"
        
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          alert("Upload Completed");
          setRefreshKey((prev) => prev + 1);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />

      <MediaGallery isAdmin={true} key={refreshKey}/>
    </main>
  );
}
