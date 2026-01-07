import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import { getCurrentUser } from '@/lib/utils/auth';

// Remove from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const favorite = await prisma.propertyFavorite.findUnique({
      where: { id: params.id },
    });

    if (!favorite) {
      return NextResponse.json(
        { success: false, error: 'Favorite not found' },
        { status: 404 }
      );
    }

    if (favorite.userId !== user.id && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to delete this favorite' },
        { status: 403 }
      );
    }

    const propertyId = favorite.propertyId;

    await prisma.propertyFavorite.delete({
      where: { id: params.id },
    });

    // Update favorite count
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        favoriteCount: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error: any) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to remove from favorites',
      },
      { status: 500 }
    );
  }
}

