import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { bookmarkService } from "@/services/bookmarkService";
import { requireAuth } from "@/lib/auth-middleware";

// Check if a specific media is bookmarked
export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ isBookmarked: false })
  }

  const { searchParams } = new URL(req.url);
  const mediaId = searchParams.get("mediaId");

  if (!mediaId) {
    return NextResponse.json("Media ID is required", { status: 400 });
  }

  try {
    const isBookmarked = await bookmarkService.checkBookmarkStatus(session.user.id, mediaId);
    return NextResponse.json(isBookmarked);
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return NextResponse.json("Error checking bookmark status", { status: 500 });
  }
}

// Create a bookmark
export const POST = requireAuth(async (req: Request, session) => {
  try {
    const { mediaId, collectionId } = await req.json();
    if (!mediaId) {
      return NextResponse.json("Media ID is required", { status: 400 });
    }

    // First check if bookmark already exists
    const bookmarkStatus = await bookmarkService.checkBookmarkStatus(session.user.id, mediaId);
    
    if (bookmarkStatus.isBookmarked) {
      // If bookmark already exists, return the current status
      return NextResponse.json(bookmarkStatus);
    }
    
    // Only create if it doesn't exist
    const bookmark = await bookmarkService.createBookmark(session.user.id, mediaId, collectionId);
    return NextResponse.json({
      isBookmarked: true,
      collections: bookmark.collections.map(bc => bc.collection)
    });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json("Error creating bookmark", { status: 500 });
  }
});

// Delete a bookmark
export const DELETE = requireAuth(async (req: Request, session) => {
  try {
    const { mediaId } = await req.json();
    
    if (!mediaId) {
      return NextResponse.json("Media ID is required", { status: 400 });
    }
    
    // First check if bookmark exists
    const exists = await bookmarkService.checkBookmarkStatus(session.user.id, mediaId);
    
    if (!exists.isBookmarked) {
      // If bookmark doesn't exist, return false status
      return NextResponse.json({ 
        isBookmarked: false, 
        collections: [] 
      });
    }
    
    // Only try to delete if it exists
    await bookmarkService.deleteBookmark(session.user.id, mediaId);
    return NextResponse.json({ 
      isBookmarked: false, 
      collections: [] 
    });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json("Error deleting bookmark", { status: 500 });
  }
}); 