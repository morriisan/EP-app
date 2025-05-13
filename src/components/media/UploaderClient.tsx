"use client";

import { UploadButton } from "@/utils/uploadthing";
import { mutate } from "swr";

export function UploaderClient() {
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
            // Mutate both media and tags data
            Promise.all([
              mutate('/api/media'), 
              mutate('/api/media?type=tags'), 
              mutate('/api/media?tags=') 
            ]);
          }, 500);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
} 