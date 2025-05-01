import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-middleware";

export const GET = requireAdmin(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    
    
    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
      select: { id: true }, //  select ID to minimize data transfer
    });
    
    
    
    return NextResponse.json({
      exists: !!existingUser,
    });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json(
      { error: "Failed to check email" },
      { status: 500 }
    );
  }
}); 