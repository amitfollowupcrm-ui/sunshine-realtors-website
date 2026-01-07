// Test endpoint to verify login credentials
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        email,
      }, { status: 404 });
    }

    // Check password
    if (!user.passwordHash) {
      return NextResponse.json({
        success: false,
        error: 'User has no password',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
        },
      }, { status: 400 });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    return NextResponse.json({
      success: true,
      passwordMatch,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        hasPassword: !!user.passwordHash,
      },
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}


