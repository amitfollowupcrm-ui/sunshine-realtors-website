// GET /api/auth/me
// Get current authenticated user

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { authService } from '@/lib/services/auth.service';

async function handler(
  request: NextRequest,
  context: { user: any }
): Promise<NextResponse> {
  try {
    const user = await authService.getUserById(context.user.userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          permissions: user.permissions,
          profile: user.profile,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred',
        },
      },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler, { requireAuth: true });

