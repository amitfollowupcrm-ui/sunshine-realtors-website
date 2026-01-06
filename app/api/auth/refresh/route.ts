// POST /api/auth/refresh
// Refresh access token

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { refreshTokenSchema } from '@/lib/validation/auth.schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = refreshTokenSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: validationResult.error.flatten().fieldErrors,
          },
        },
        { status: 422 }
      );
    }

    const { refreshToken } = validationResult.data;

    // Refresh token
    const result = await authService.refreshAccessToken(refreshToken);

    return NextResponse.json(
      {
        success: true,
        data: {
          token: result.token,
          expiresIn: result.expiresIn,
        },
        message: 'Token refreshed successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Refresh token error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: error.message || 'Invalid or expired refresh token',
        },
      },
      { status: 401 }
    );
  }
}

