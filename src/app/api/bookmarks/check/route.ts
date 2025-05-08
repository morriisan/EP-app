import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { bookmarkService } from "@/services/bookmarkService";

// Get all bookmarked media
export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const bookmarkedMedia = await bookmarkService.getAllBookmarkedMedia(session.user.id);
    return NextResponse.json(bookmarkedMedia);
  } catch (error) {
    return new NextResponse("Error fetching bookmarked media", { status: 500 });
  }
} 