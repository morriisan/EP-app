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
    return new NextResponse("Media ID is required", { status: 400 });
  }

  try {
    const isBookmarked = await bookmarkService.checkBookmarkStatus(session.user.id, mediaId);
    return NextResponse.json({ isBookmarked });
  } catch (error) {
    console.log("Error checking bookmark status", error);
    return new NextResponse("Error checking bookmark status", { status: 500 });
  }
}

// Create a bookmark
export const POST = requireAuth(async (req: Request, session) => {
  try {
    const { mediaId, collectionId } = await req.json();

    if (!mediaId) {
      return new NextResponse("Media ID is required", { status: 400 });
    }

    // First check if bookmark already exists
    const exists = await bookmarkService.checkBookmarkStatus(session.user.id, mediaId);
    
    if (exists) {
      // If bookmark already exists, return success
      return NextResponse.json({ message: "Bookmark already exists" }, { status: 200 });
    }
    
    // Only create if it doesn't exist
    const bookmark = await bookmarkService.createBookmark(session.user.id, mediaId, collectionId);
    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return new NextResponse("Error creating bookmark", { status: 500 });
  }
});

// Delete a bookmark
export const DELETE = requireAuth(async (req: Request, session) => {
  try {
    const { mediaId } = await req.json();
    
    if (!mediaId) {
      return new NextResponse("Media ID is required", { status: 400 });
    }
    
    // First check if bookmark exists
    const exists = await bookmarkService.checkBookmarkStatus(session.user.id, mediaId);
    
    if (!exists) {
      // If bookmark doesn't exist, return success (already deleted)
      return NextResponse.json({ message: "Bookmark already removed" }, { status: 200 });
    }
    
    // Only try to delete if it exists
    await bookmarkService.deleteBookmark(session.user.id, mediaId);
    return NextResponse.json({ message: "Bookmark removed" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return new NextResponse("Error deleting bookmark", { status: 500 });
  }
}); 