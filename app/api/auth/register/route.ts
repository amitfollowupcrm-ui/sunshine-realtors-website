// POST /api/auth/register
// User registration endpoint

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { registerSchema } from '@/lib/validation/auth.schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = registerSchema.safeParse(body);
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

    const input = validationResult.data;

    // Register user
    const authResponse = await authService.register({
      email: input.email,
      password: input.password,
      fullName: input.fullName,
      phone: input.phone,
      role: input.role,
      profile: input.profile,
    });

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
        message: 'User registered successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.message.includes('already exists')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: error.message,
          },
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during registration',
        },
      },
      { status: 500 }
    );
  }
}

