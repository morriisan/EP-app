"use client";

import { UploadButton } from "@/utils/uploadthing";
import { useRouter } from "next/navigation";

export function UploaderClient() {
  const router = useRouter();
  
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-4">Upload Media</h1>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          alert("Upload Completed");
          
         // Add a delay before refreshing to allow the database operation to complete
         setTimeout(() => {
            window.location.reload();
          }, 500);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
} 