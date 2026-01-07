import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { rateLimiters } from '@/lib/middleware/rateLimit.middleware';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (100 requests per 15 minutes per IP)
    const rateLimitResult = await rateLimiters.public(request);
    if (rateLimitResult && 'error' in rateLimitResult && rateLimitResult.error) {
      return rateLimitResult.error;
    }
    if (rateLimitResult && !rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Get refresh token from body
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Refresh tokens
    const authResponse = await authService.refreshAccessToken(refreshToken);

    return NextResponse.json({
      success: true,
      token: authResponse.token,
      expiresIn: authResponse.expiresIn,
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Invalid or expired refresh token' },
      { status: 401 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}

