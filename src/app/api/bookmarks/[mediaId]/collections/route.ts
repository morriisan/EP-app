import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";

// Get all collections that contain this media item
export const GET = requireAuth(async (req: Request, session) => {
  try {
    // Extract media ID from the URL
    const url = new URL(req.url);
    const mediaId = url.pathname.split('/')[3]; // /api/bookmarks/[mediaId]/collections
    
    if (!mediaId) {
      return new NextResponse("Media ID is required", { status: 400 });
    }

    // Find the bookmark for this user and media
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_mediaId: {
          userId: session.user.id,
          mediaId: mediaId
        }
      },
      select: {
        collections: {
          select: {
            collection: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!bookmark) {
      // If no bookmark exists, return empty array
      return NextResponse.json([]);
    }

    // Extract collection info from the bookmark
    const collections = bookmark.collections.map(bc => bc.collection);
    
    return NextResponse.json(collections);
  } catch (error) {
    console.error('Error fetching media collections:', error);
    return new NextResponse("Error fetching collections", { status: 500 });
  }
}); 