// POST /api/auth/login
// User login endpoint

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { loginSchema } from '@/lib/validation/auth.schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = loginSchema.safeParse(body);
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

    const { email, password } = validationResult.data;

    // Get IP and user agent for session tracking
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    // Authenticate user
    const authResponse = await authService.login(
      { email, password },
      ipAddress,
      userAgent
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: authResponse.user.id,
            email: authResponse.user.email,
            fullName: authResponse.user.fullName,
            role: authResponse.user.role,
            profile: authResponse.user.profile,
          },
          token: authResponse.token,
          refreshToken: authResponse.refreshToken,
          expiresIn: authResponse.expiresIn,
        },
        message: 'Login successful',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);

    if (error.message === 'Invalid email or password') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during login',
        },
      },
      { status: 500 }
    );
  }
}

