import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import { getCurrentUser } from '@/lib/utils/auth';

// Add property to shortlist (for DEALER role)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is a dealer
    if (user.role !== 'DEALER' && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only dealers can shortlist properties' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { propertyId, clientId, priority, notes } = body;

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

    // Create or update shortlist
    const shortlist = await prisma.propertyShortlist.upsert({
      where: {
        dealerId_propertyId: {
          dealerId: user.userId,
          propertyId: propertyId,
        },
      },
      update: {
        clientId,
        priority: priority || 'medium',
        notes,
      },
      create: {
        dealerId: user.userId,
        propertyId,
        clientId,
        priority: priority || 'medium',
        notes,
      },
      include: {
        property: true,
      },
    });

    return NextResponse.json({
      success: true,
      shortlist,
    });
  } catch (error: any) {
    console.error('Error adding to shortlist:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to add to shortlist',
      },
      { status: 500 }
    );
  }
}

// Get dealer's shortlist
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'DEALER' && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only dealers can view shortlist' },
        { status: 403 }
      );
    }

    const shortlists = await prisma.propertyShortlist.findMany({
      where: {
        dealerId: user.userId,
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
      shortlists,
      count: shortlists.length,
    });
  } catch (error: any) {
    console.error('Error fetching shortlist:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch shortlist',
      },
      { status: 500 }
    );
  }
}

