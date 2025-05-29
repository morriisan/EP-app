import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import sharp from "sharp";

const f = createUploadthing();

// Function to generate blur placeholder
async function generateBlurPlaceholder(imageUrl: string): Promise<string> {
  try {
    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');
    
    const imageBuffer = await response.arrayBuffer();
    
    // Generate a tiny blur placeholder (10x7 pixels)
    const blurBuffer = await sharp(Buffer.from(imageBuffer))
      .resize(10, 7)
      .blur(1)
      .jpeg({ quality: 20 })
      .toBuffer();
    
    // Convert to base64 data URL
    return `data:image/jpeg;base64,${blurBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Error generating blur placeholder:', error);
    // Return a fallback blur placeholder
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjNmNGY2Ii8+Cjwvc3ZnPgo=";
  }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 12,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // If you throw, the user will not be able to upload
        try {
          const session = await auth.api.getSession({ headers: req.headers });
          if (!session || session.user.role !== "admin") throw new UploadThingError("Unauthorized_user");
            return { userId: session.user.id };
        } catch (error) {
          console.error("Error getting session:", error);
          throw new UploadThingError("Unauthorized_user");
        }
        
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
        
    })

    .onUploadComplete(async ({ metadata, file }) => {
  
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      // Generate blur placeholder
      const blurDataURL = await generateBlurPlaceholder(file.ufsUrl);

      // Create a Media record in your database
      try {
        await prisma.media.create({
          data: { 
            url: file.ufsUrl,
            fileKey: file.key,
            uploadedById: metadata.userId,
            title: file.name,
            blurDataURL: blurDataURL, // Store the generated blur placeholder
          // extend this to include tags         
        },
      });
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { 
        uploadedBy: metadata.userId,
        blurDataURL: blurDataURL // Return blur for immediate use if needed
      };

      } catch (error) {
        console.error("Error creating media record:", error);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
