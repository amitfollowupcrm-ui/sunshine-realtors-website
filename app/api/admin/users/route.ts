// Admin Users API - Get all users, Create user
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import { authService } from '@/lib/services/auth.service';
import { UserRole } from '@/types/user.types';
import bcrypt from 'bcryptjs';

// GET - List all users (paginated)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin role
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (role) {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          phone: true,
          fullName: true,
          role: true,
          isVerified: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          avatarUrl: true,
          // Exclude passwordHash from response
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin role
    const body = await request.json();
    const {
      email,
      password,
      fullName,
      phone,
      role = 'BUYER',
      isVerified = false,
      isActive = true,
    } = body;

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email or phone already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone: phone || null,
        role: role as UserRole,
        isVerified,
        isActive,
        emailVerifiedAt: isVerified ? new Date() : null,
        permissions: [],
      },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        role: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        // Exclude passwordHash
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: user,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create user error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'User with this email or phone already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

