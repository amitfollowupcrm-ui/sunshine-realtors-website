import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import { getCurrentUser } from '@/lib/utils/auth';

// Remove from cart
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

    const cartItem = await prisma.propertyCart.findUnique({
      where: { id: params.id },
    });

    if (!cartItem) {
      return NextResponse.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      );
    }

    if (cartItem.userId !== user.id && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to delete this cart item' },
        { status: 403 }
      );
    }

    await prisma.propertyCart.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Removed from cart',
    });
  } catch (error: any) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to remove from cart',
      },
      { status: 500 }
    );
  }
}

