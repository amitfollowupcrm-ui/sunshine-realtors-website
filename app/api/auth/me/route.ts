import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth.middleware';
import { prisma } from '@/config/database';

export async function GET(request: NextRequest) {
  try {
    // Try to authenticate, but don't require it
    const { user, error } = await authenticate(request, { requireAuth: false });

    // If no user is authenticated, return success: false (not 401) to avoid console errors
    if (!user || error) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        user: null,
      });
    }

    // Fetch full user data with profile
    const fullUser = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        profile: true,
      },
    });

    if (!fullUser) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'User not found',
        user: null,
      });
    }

    // Return user data (exclude password hash)
    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: fullUser.id,
        email: fullUser.email,
        phone: fullUser.phone,
        fullName: fullUser.fullName,
        avatarUrl: fullUser.avatarUrl,
        role: fullUser.role,
        isVerified: fullUser.isVerified,
        isActive: fullUser.isActive,
        profile: fullUser.profile,
        createdAt: fullUser.createdAt,
        updatedAt: fullUser.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        error: 'Failed to fetch user data',
        user: null,
      },
      { status: 500 }
    );
  }
}


