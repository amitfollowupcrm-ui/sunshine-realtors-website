import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import { getCurrentUser } from '@/lib/utils/auth';

// Add property to favorites (for BUYER/TENANT role)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { propertyId, notes } = body;

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Create favorite
    const favorite = await prisma.propertyFavorite.upsert({
      where: {
        userId_propertyId: {
          userId: user.userId,
          propertyId: propertyId,
        },
      },
      update: {
        notes,
      },
      create: {
        userId: user.userId,
        propertyId,
        notes,
      },
      include: {
        property: true,
      },
    });

    // Update favorite count
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        favoriteCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      favorite,
    });
  } catch (error: any) {
    // If it's a unique constraint error, it's already in favorites
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: true,
        message: 'Property already in favorites',
      });
    }

    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to add to favorites',
      },
      { status: 500 }
    );
  }
}

// Get user's favorites
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const favorites = await prisma.propertyFavorite.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        property: {
          include: {
            owner: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      favorites,
      count: favorites.length,
    });
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch favorites',
      },
      { status: 500 }
    );
  }
}

