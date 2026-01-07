import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { authService } from '@/lib/services/auth.service';

async function handler(request: NextRequest, context: { user: any }) {
  try {
    const { user } = context;

    // Get token from header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.substring(7);

    // Logout user (invalidate session)
    if (token) {
      await authService.logout(token);
    }

    // Return success response
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    });

    // Clear cookie if exists
    response.cookies.delete('token');

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler, { requireAuth: true });

