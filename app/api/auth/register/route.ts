import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { rateLimiters } from '@/lib/middleware/rateLimit.middleware';
import { registerSchema } from '@/lib/validation/auth.schemas';

// Ensure this route runs on Node.js runtime (default, but explicit for clarity)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Ensure we always return JSON, even on errors
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

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validationResult.error.issues.map(e => e.message).join(', ')
        },
        { status: 400 }
      );
    }

    // Register user
    let authResponse;
    try {
      authResponse = await authService.register(validationResult.data);
    } catch (regError: any) {
      console.error('Registration service error:', regError);
      console.error('Error details:', {
        message: regError.message,
        code: regError.code,
        stack: regError.stack,
      });
      
      // Handle specific errors with appropriate JSON responses
      if (regError.message?.includes('already exists') || regError.code === 'P2002') {
        return NextResponse.json(
          { success: false, error: 'User with this email or phone already exists' },
          { status: 409 }
        );
      }

      // Handle database connection errors
      if (regError.code === 'P1001' || regError.message?.includes('Can\'t reach database')) {
        return NextResponse.json(
          { success: false, error: 'Database connection error. Please try again later.' },
          { status: 503 }
        );
      }

      // Re-throw to be handled by outer catch
      throw regError;
    }

    // Return response
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: authResponse.user.id,
        email: authResponse.user.email,
        fullName: authResponse.user.fullName,
        role: authResponse.user.role,
        isVerified: authResponse.user.isVerified,
        isActive: authResponse.user.isActive,
      },
      token: authResponse.token,
      refreshToken: authResponse.refreshToken,
      expiresIn: authResponse.expiresIn,
    }, { status: 201 });
  } catch (error: any) {
    // Catch-all error handler - ensure we always return JSON
    console.error('Registration error:', error);
    console.error('Error stack:', error?.stack);
    console.error('Error message:', error?.message);
    console.error('Error code:', error?.code);
    
    // Handle specific errors
    if (error?.message?.includes('already exists') || error?.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'User with this email or phone already exists' },
        { status: 409 }
      );
    }

    // Handle database connection errors
    if (error?.code === 'P1001' || error?.message?.includes('Can\'t reach database')) {
      return NextResponse.json(
        { success: false, error: 'Database connection error. Please try again later.' },
        { status: 503 }
      );
    }

    // Return JSON error response (never HTML)
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error?.message || 'Registration failed. Please try again.'
      : 'Registration failed. Please try again.';

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { details: error?.stack })
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods - always return JSON
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed. Use POST to register.' },
    { status: 405 }
  );
}

// Handle other methods
export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}
