// Google OAuth callback handler (alternative approach)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://sunshine-realtors-website.vercel.app'}/login?error=oauth_cancelled`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://sunshine-realtors-website.vercel.app'}/login?error=no_code`
    );
  }

  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://sunshine-realtors-website.vercel.app'}/api/auth/google-callback`;
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim(); // Trim any whitespace/newlines
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim(); // Trim any whitespace/newlines

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials not configured');
    }

    // Exchange code for token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const googleUser = await userResponse.json();

    // Check if user exists in database, create if not
    const { prisma } = await import('@/config/database');
    
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      // Create user from Google account
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          fullName: googleUser.name || googleUser.email.split('@')[0],
          avatarUrl: googleUser.picture,
          role: 'BUYER',
          isVerified: true,
          isActive: true,
          emailVerifiedAt: new Date(),
          permissions: [],
        },
      });
    }

    // Generate JWT token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const { default: jwt } = await import('jsonwebtoken');
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'default-secret', {
      expiresIn: '1h',
    });

    // Redirect to dashboard with token
    const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'https://sunshine-realtors-website.vercel.app');
    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('google', 'true');

    const response = NextResponse.redirect(redirectUrl.toString());
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600,
    });

    return response;
  } catch (error: any) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://sunshine-realtors-website.vercel.app'}/login?error=oauth_failed`
    );
  }
}

