import { NextResponse } from "next/server";
import { collectionService } from "@/services/collectionService";
import { requireAuth } from "@/lib/auth-middleware";

// Delete a collection
export const DELETE = requireAuth(async (req: Request, session) => {
  try {
    // Extract collection ID from the URL
    const url = new URL(req.url);
    const collectionId = url.pathname.split('/').pop();
    
    if (!collectionId) {
      return new NextResponse("Collection ID is required", { status: 400 });
    }
    
    await collectionService.deleteCollection(session.user.id, collectionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting collection:', error);
    if (error instanceof Error && error.message === 'Collection not found or access denied') {
      return new NextResponse("Collection not found or access denied", { status: 404 });
    }
    return new NextResponse("Error deleting collection", { status: 500 });
  }
});

// Rename a collection
export const PATCH = requireAuth(async (req: Request, session) => {
  try {
    // Extract collection ID from the URL
    const url = new URL(req.url);
    const collectionId = url.pathname.split('/').pop();
    
    if (!collectionId) {
      return new NextResponse("Collection ID is required", { status: 400 });
    }
    
    const { name } = await req.json();
    
    if (!name) {
      return new NextResponse("Collection name is required", { status: 400 });
    }

    const collection = await collectionService.renameCollection(session.user.id, collectionId, name);
    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error renaming collection:', error);
    if (error instanceof Error && error.message === 'Collection not found or access denied') {
      return new NextResponse("Collection not found or access denied", { status: 404 });
    }
    return new NextResponse("Error renaming collection", { status: 500 });
  }
}); 