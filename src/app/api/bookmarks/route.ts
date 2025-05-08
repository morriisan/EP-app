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
    return new NextResponse("Error checking bookmark status", { status: 500 });
  }
}

// Create a bookmark
export const POST = requireAuth(async (req: Request, session) => {
  const { mediaId, collectionId } = await req.json();

  try {
    const bookmark = await bookmarkService.createBookmark(session.user.id, mediaId, collectionId);
    return NextResponse.json(bookmark);
  } catch (error) {
    return new NextResponse("Error creating bookmark", { status: 500 });
  }
});

// Delete a bookmark
export const DELETE = requireAuth(async (req: Request, session) => {
  const { mediaId } = await req.json();

  try {
    await bookmarkService.deleteBookmark(session.user.id, mediaId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Error deleting bookmark", { status: 500 });
  }
}); 