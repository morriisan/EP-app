import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { TagService } from "@/services/tagService";
import { requireAdmin } from "@/lib/auth-middleware";

// GET: Fetch all tags with usage count
export async function GET() {
  try {
    const tags = await TagService.getAllTagsWithCount();
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a tag (only if not used by any media)
export const DELETE = requireAdmin(async (request: Request) => {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get("id");

    if (!tagId) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      );
    }

    await TagService.deleteTag(tagId);
    return NextResponse.json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error deleting tag:", error);
    
    // Handle specific error messages from the service
    if (error instanceof Error) {
      if (error.message === "Tag not found") {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message.includes("Cannot delete tag")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }
    
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}); 