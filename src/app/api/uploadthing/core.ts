import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
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
  

      // Create a Media record in your database
      try {
        await prisma.media.create({
          data: { 
            url: file.ufsUrl,
            fileKey: file.key,
            uploadedById: metadata.userId,
            title: file.name,
          // extend this to include tags         
        },
      });
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { 
        uploadedBy: metadata.userId};

      } catch (error) {
        console.error("Error creating media record:", error);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
