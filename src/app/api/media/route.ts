import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { utapi } from "@/lib/uploadthing";

// GET: Fetch all media or filter by tags
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // If requesting tags, return all unique tags from the database
    if (searchParams.get("type") === "tags") {
      const tags = await prisma.tag.findMany({
        orderBy: {
          name: 'asc'
        }
      });
      return NextResponse.json(tags);
    }

    const mediaId = searchParams.get("id");
    const tags = searchParams.get("tags")?.split(",");

    // If mediaId is provided, fetch single media item
    if (mediaId) {
      const media = await prisma.media.findUnique({
        where: { id: mediaId },
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: true,
        },
      });

      if (!media) {
        return NextResponse.json({ error: "Media not found" }, { status: 404 });
      }

      return NextResponse.json(media);
    }

    // Otherwise, fetch all media with optional tag filtering
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const whereClause = {
      ...(tags && {
        tags: {
          some: {
            name: {
              in: tags.map(tag => tag.toLowerCase().trim()),
            },
          },
        },
      }),
    };

    const media = await prisma.media.findMany({
      where: whereClause,
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: true,
      },
      orderBy: {
        uploadedAt: "desc",
      },
      take: limit,
      skip: skip,
    });

    const totalCount = await prisma.media.count({
      where: whereClause,
    });

    return NextResponse.json({
      media,
      totalCount,
      hasMore: skip + media.length < totalCount,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

// Update media (title and tags)
export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get("id");

    if (!mediaId) {
      return NextResponse.json(
        { error: "Media ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, tags } = body;

    const media = await prisma.media.update({
      where: { id: mediaId },
      data: {
        title,
        tags: {
          set: [], // Clear existing tags
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag.toLowerCase().trim() },
            create: { name: tag.toLowerCase().trim() },
          })),
        },
      },
      include: {
        tags: true,
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Error updating media:", error);
    return NextResponse.json(
      { error: "Failed to update media" },
      { status: 500 }
    );
  }
}

// DELETE: Delete media
export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Get mediaId from request
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get("id");
    console.log(mediaId);
    // Check if mediaId is provided
    if (!mediaId) {
      return NextResponse.json(
        { error: "Media ID is required" },
        { status: 400 }
      );
    }
    // Fetch media by id
    const media = await prisma.media.findUnique({
        where: { id: mediaId },
      });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }
   
    // Delete media from UploadThing
    if (media.fileKey) {
    await utapi.deleteFiles(media.fileKey);
    }
    // Delete media from database
    await prisma.media.delete({
      where: { id: mediaId },
    });

    return NextResponse.json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    );
  }
}
