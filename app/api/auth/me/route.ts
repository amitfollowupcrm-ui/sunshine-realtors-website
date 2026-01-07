import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { prisma } from '@/config/database';

async function handler(request: NextRequest, context: { user: any }) {
  try {
    const { user } = context;

    // Fetch full user data with profile
    const fullUser = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        profile: true,
      },
    });

    if (!fullUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data (exclude password hash)
    return NextResponse.json({
      success: true,
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
      { success: false, error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler, { requireAuth: true });

