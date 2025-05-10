import { NextResponse } from "next/server";
import { collectionService } from "@/services/collectionService";
import { requireAuth } from "@/lib/auth-middleware";

// Get all collections for a user
export const GET = requireAuth(async (req: Request, session) => {
  try {
    const collections = await collectionService.getUserCollections(session.user.id);
    return NextResponse.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return new NextResponse("Error fetching collections", { status: 500 });
  }
});

// Create a new collection
export const POST = requireAuth(async (req: Request, session) => {
  try {
    const { name } = await req.json();
    
    if (!name) {
      return new NextResponse("Collection name is required", { status: 400 });
    }

    const collection = await collectionService.createCollection(session.user.id, name);
    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    return new NextResponse("Error creating collection", { status: 500 });
  }
}); 