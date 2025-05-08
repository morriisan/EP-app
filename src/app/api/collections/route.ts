import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get all collections for a user
export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const collections = await prisma.collection.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(collections);
  } catch (error) {
    return new NextResponse("Error fetching collections", { status: 500 });
  }
}

// Create a new collection
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { name } = await req.json();

  try {
    const collection = await prisma.collection.create({
      data: {
        name,
        userId: session.user.id,
      },
    });

    return NextResponse.json(collection);
  } catch (error) {
    return new NextResponse("Error creating collection", { status: 500 });
  }
} 