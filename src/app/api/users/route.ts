import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET handler for fetching all users
export async function GET() {
  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Return the users as JSON
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new user
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email } = body;

    // Validate the request body
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Create a new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    // Return the created user
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 