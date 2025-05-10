"use client";

import { UploadButton } from "@/utils/uploadthing";


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