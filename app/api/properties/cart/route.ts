import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import { getCurrentUser } from '@/lib/utils/auth';

// Add property to cart (for BUYER/TENANT role)
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
    const { propertyId, inquiryType, notes } = body;

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

    // Create or update cart item
    const cartItem = await prisma.propertyCart.upsert({
      where: {
        userId_propertyId: {
          userId: user.userId,
          propertyId: propertyId,
        },
      },
      update: {
        inquiryType: inquiryType || 'BUY',
        notes,
      },
      create: {
        userId: user.userId,
        propertyId,
        inquiryType: inquiryType || 'BUY',
        notes,
      },
      include: {
        property: true,
      },
    });

    return NextResponse.json({
      success: true,
      cartItem,
    });
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to add to cart',
      },
      { status: 500 }
    );
  }
}

// Get user's cart
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const cartItems = await prisma.propertyCart.findMany({
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
      cartItems,
      count: cartItems.length,
    });
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch cart',
      },
      { status: 500 }
    );
  }
}

