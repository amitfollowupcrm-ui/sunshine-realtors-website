// Simplified login endpoint for testing
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('=== SIMPLE LOGIN CALLED ===');
    console.log('Email:', email);
    console.log('Has password:', !!password);
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20));

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Ensure database connection
    try {
      await prisma.$connect();
      console.log('Database connected successfully');
    } catch (connError: any) {
      console.error('Database connection failed:', connError.message);
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection failed',
          details: connError.message,
        },
        { status: 503 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      hasPassword: !!user.passwordHash,
    });

    if (!user.passwordHash) {
      console.log('No password hash');
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    console.log('Password match:', isValidPassword);

    if (!isValidPassword) {
      console.log('Password mismatch');
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated' },
        { status: 401 }
      );
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '1h' }
    );

    console.log('Login successful, token generated');

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
      },
      token,
    });

  } catch (error: any) {
    console.error('Simple login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Login failed',
      },
      { status: 500 }
    );
  }
}

