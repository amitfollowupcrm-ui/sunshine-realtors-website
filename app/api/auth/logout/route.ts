// POST /api/auth/logout
// User logout endpoint

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { authService } from '@/lib/services/auth.service';

async function handler(
  request: NextRequest,
  context: { user: any }
): Promise<NextResponse> {
  try {
    // Get token from header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await authService.logout(token);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during logout',
        },
      },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler, { requireAuth: true });

