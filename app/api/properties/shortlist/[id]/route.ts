import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import { getCurrentUser } from '@/lib/utils/auth';

// Remove from shortlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const shortlist = await prisma.propertyShortlist.findUnique({
      where: { id },
    });

    if (!shortlist) {
      return NextResponse.json(
        { success: false, error: 'Shortlist item not found' },
        { status: 404 }
      );
    }

    if (shortlist.dealerId !== user.id && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to delete this shortlist' },
        { status: 403 }
      );
    }

    await prisma.propertyShortlist.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Removed from shortlist',
    });
  } catch (error: any) {
    console.error('Error removing from shortlist:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to remove from shortlist',
      },
      { status: 500 }
    );
  }
}

