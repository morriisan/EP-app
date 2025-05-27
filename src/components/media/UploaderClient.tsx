"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import { mutate } from "swr";
import { toast } from "sonner";

export function UploaderClient() {
  return (
    <div className="mb-8">
      <UploadDropzone
        endpoint="imageUploader"
        className="bg-theme-section-primary"
        onClientUploadComplete={() => {
          toast.success("Upload completed successfully");
          
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
          toast.error(`Upload failed: ${error.message}`);
        }}
      />
    </div>
  );
} 