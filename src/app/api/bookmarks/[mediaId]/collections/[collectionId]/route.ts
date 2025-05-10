import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { bookmarkService } from "@/services/bookmarkService";

// Add media to collection
export const POST = requireAuth(async (req: Request, session) => {
  try {
    const mediaId = req.url.split('/bookmarks/')[1].split('/collections/')[0];
    const collectionId = req.url.split('/collections/')[1].split('/')[0];

    if (!mediaId || !collectionId) {
      return new NextResponse("Media ID and Collection ID are required", { status: 400 });
    }

    const result = await bookmarkService.addToCollection(session.user.id, mediaId, collectionId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error adding to collection:", error);
    return new NextResponse("Error adding to collection", { status: 500 });
  }
});

// Remove media from collection
export const DELETE = requireAuth(async (req: Request, session) => {
  try {
    const mediaId = req.url.split('/bookmarks/')[1].split('/collections/')[0];
    const collectionId = req.url.split('/collections/')[1].split('/')[0];

    if (!mediaId || !collectionId) {
      return new NextResponse("Media ID and Collection ID are required", { status: 400 });
    }

    const result = await bookmarkService.removeFromCollection(session.user.id, mediaId, collectionId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error removing from collection:", error);
    return new NextResponse("Error removing from collection", { status: 500 });
  }
}); 