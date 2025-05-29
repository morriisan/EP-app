import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { bookmarkService } from "@/services/bookmarkService";

// Get all bookmarked media for the current user
export const GET = requireAuth(async (req: Request, session) => {
  try {
    const bookmarkedMedia = await bookmarkService.getAllBookmarkedMedia(session.user.id);
    return NextResponse.json(bookmarkedMedia);
  } catch (error) {
    console.error("Error fetching bookmarked media:", error);
    return NextResponse.json(
      { error: "Error fetching bookmarked media" },
      { status: 500 }
    );
  }
}); 