import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { rateLimiters } from '@/lib/middleware/rateLimit.middleware';
import { loginSchema } from '@/lib/validation/auth.schemas';

// Ensure this route runs on Node.js runtime (default, but explicit for clarity)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('=== LOGIN API CALLED ===');
    
    // Rate limiting (5 requests per 15 minutes per IP for login)
    const rateLimitResult = await rateLimiters.login(request);
    if (rateLimitResult && 'error' in rateLimitResult && rateLimitResult.error) {
      console.log('Rate limit error returned');
      return rateLimitResult.error;
    }
    if (rateLimitResult && !rateLimitResult.allowed) {
      console.log('Rate limit exceeded');
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    console.log('Request body received:', { email: body.email, hasPassword: !!body.password, passwordLength: body.password?.length });
    
    const validationResult = loginSchema.safeParse(body);
    console.log('Validation result:', validationResult.success);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validationResult.error.issues.map(e => e.message).join(', ')
        },
        { status: 400 }
      );
    }

    // Get IP address and user agent
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Login user
    console.log('Attempting login for:', validationResult.data.email);
    const authResponse = await authService.login(
      {
        email: validationResult.data.email,
        password: validationResult.data.password,
      },
      ipAddress,
      userAgent
    );
    console.log('Login successful for:', authResponse.user.email);

    // Set HTTP-only cookie for token (optional)
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
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
    });

    // Set cookies (optional - for better security)
    response.cookies.set('token', authResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: authResponse.expiresIn,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    // Return more detailed error (always show specific errors)
    const message = error.message === 'Invalid email or password' 
      ? 'Invalid email or password'
      : error.message === 'Account is deactivated'
      ? 'Account is deactivated'
      : error.message === 'Account is deleted'
      ? 'Account is deleted'
      : error.message === 'Database connection failed. Please try again.'
      ? 'Database connection failed. Please try again.'
      : error.message || 'Login failed. Please try again.';

    return NextResponse.json(
      { 
        success: false, 
        error: message,
        // Include details in production for debugging
        ...(error.message && { details: error.message })
      },
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

