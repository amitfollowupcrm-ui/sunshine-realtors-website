import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import { getCurrentUser } from '@/lib/utils/auth';

// GET /api/users/[id] - Get user by ID (own profile or admin)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Users can only view their own profile (unless admin)
    if (currentUser.userId !== id && currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch user',
      },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user profile (own profile only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Users can only update their own profile
    if (currentUser.userId !== id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - You can only update your own profile' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { fullName, phone, avatarUrl } = body;

    // Validate input
    const updateData: any = {};
    if (fullName !== undefined) {
      if (typeof fullName !== 'string' || fullName.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: 'Full name must be a non-empty string' },
          { status: 400 }
        );
      }
      updateData.fullName = fullName.trim();
    }
    if (phone !== undefined) {
      if (phone !== null && (typeof phone !== 'string' || phone.trim().length === 0)) {
        return NextResponse.json(
          { success: false, error: 'Phone must be a valid string or null' },
          { status: 400 }
        );
      }
      updateData.phone = phone ? phone.trim() : null;
    }
    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl || null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update user',
      },
      { status: 500 }
    );
  }
}
