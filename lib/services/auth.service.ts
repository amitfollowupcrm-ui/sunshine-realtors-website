// Authentication Service
// Handles user authentication, JWT tokens, password management

import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '@/config/database';
import { redis, CacheKeys } from '@/config/redis';
import { User, UserCreateInput, UserLoginInput, UserSession } from '@/types/user.types';
import { UserRole, ROLE_PERMISSIONS } from '@/types/user.types';

interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';
  // Ensure expiresIn is always a valid string format
  private readonly JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN && typeof process.env.JWT_EXPIRES_IN === 'string') 
    ? process.env.JWT_EXPIRES_IN 
    : '1h';
  private readonly JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN && typeof process.env.JWT_REFRESH_EXPIRES_IN === 'string')
    ? process.env.JWT_REFRESH_EXPIRES_IN
    : '7d';

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateAccessToken(payload: TokenPayload): string {
    // Ensure expiresIn is always a valid string format (hours)
    const expiresIn = '1h';
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: expiresIn,
    } as SignOptions);
  }

  generateRefreshToken(payload: TokenPayload): string {
    // Ensure expiresIn is always a valid string format (days)
    const expiresIn = '7d';
    return jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: expiresIn,
    } as SignOptions);
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.JWT_REFRESH_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async register(input: UserCreateInput): Promise<AuthResponse> {
    try {
      // Ensure database connection
      await prisma.$connect();
    } catch (connError: any) {
      console.error('Database connection error during registration:', connError.message);
      throw new Error('Database connection failed. Please try again.');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: input.email },
          ...(input.phone ? [{ phone: input.phone }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new Error('User with this email or phone already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(input.password);

    // Create user
    let user;
    try {
      user = await prisma.user.create({
        data: {
          email: input.email,
          phone: input.phone || null, // Ensure null instead of undefined
          passwordHash,
          fullName: input.fullName,
          role: input.role || 'BUYER', // Default role if not provided
          permissions: ROLE_PERMISSIONS[input.role] || ROLE_PERMISSIONS['BUYER'] || [],
          isVerified: false,
          isActive: true,
          ...(input.profile && {
            profile: {
              create: input.profile,
            },
          }),
        },
        include: {
          profile: true,
        },
      });
    } catch (createError: any) {
      console.error('User creation error:', createError);
      console.error('Input data:', { email: input.email, role: input.role });
      if (createError.code === 'P2002') {
        throw new Error('User with this email or phone already exists');
      }
      throw new Error(`Failed to create user: ${createError.message}`);
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    const token = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    // Store refresh token in database
    try {
      await prisma.userSession.create({
        data: {
          userId: user.id,
          tokenHash: this.hashToken(token),
          refreshTokenHash: this.hashToken(refreshToken),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
    } catch (sessionError: any) {
      // Log but don't fail registration if session creation fails
      console.warn('Failed to create user session (non-fatal):', sessionError.message);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: user as unknown as User,
      token,
      refreshToken,
      expiresIn: 3600, // 1 hour in seconds
    };
  }

  async login(input: UserLoginInput, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    try {
      // Ensure database connection - with timeout
      await Promise.race([
        prisma.$connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 10000)
        )
      ]);
    } catch (connError: any) {
      console.error('Database connection error during login:', connError.message);
      console.error('Connection error details:', {
        code: connError.code,
        name: connError.name,
        meta: connError.meta,
      });
      throw new Error(`Database connection failed: ${connError.message}`);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { profile: true },
    });

    if (!user) {
      console.error(`Login attempt failed: User not found for email: ${input.email}`);
      throw new Error('Invalid email or password');
    }

    if (!user.passwordHash) {
      console.error(`Login attempt failed: No password hash for user: ${user.id}`);
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(input.password, user.passwordHash);
    if (!isValidPassword) {
      console.error(`Login attempt failed: Invalid password for user: ${user.email}`);
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      console.error(`Login attempt failed: Account inactive for user: ${user.email}`);
      throw new Error('Account is deactivated');
    }

    if (user.deletedAt) {
      console.error(`Login attempt failed: Account deleted for user: ${user.email}`);
      throw new Error('Account is deleted');
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    const token = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    // Store session in database (non-blocking - don't fail login if session creation fails)
    try {
      await prisma.userSession.create({
        data: {
          userId: user.id,
          tokenHash: this.hashToken(token),
          refreshTokenHash: this.hashToken(refreshToken),
          ipAddress,
          userAgent,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
    } catch (sessionError: any) {
      // Log but don't fail login if session creation fails
      console.warn('Failed to create user session (non-fatal):', sessionError.message);
    }

    // Cache session in Redis (optional - don't fail if Redis is unavailable)
    try {
      if (redis.status === 'ready') {
        await redis.set(
          CacheKeys.userSession(token),
          JSON.stringify({
            userId: user.id,
            role: user.role as UserRole,
            expiresAt: Date.now() + 3600 * 1000,
          }),
          'EX',
          3600 // 1 hour
        );
      }
    } catch (redisError: any) {
      console.warn('Failed to cache session in Redis (non-fatal):', redisError.message);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: user as unknown as User,
      token,
      refreshToken,
      expiresIn: 3600,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ token: string; expiresIn: number }> {
    // Verify refresh token
    const payload = this.verifyRefreshToken(refreshToken);

    // Check if session exists
    const session = await prisma.userSession.findFirst({
      where: {
        userId: payload.userId,
        refreshTokenHash: this.hashToken(refreshToken),
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      throw new Error('Invalid refresh token');
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.isActive || user.deletedAt) {
      throw new Error('User not found or inactive');
    }

    // Generate new access token
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    const token = this.generateAccessToken(tokenPayload);

    // Update session
    await prisma.userSession.update({
      where: { id: session.id },
      data: {
        tokenHash: this.hashToken(token),
      },
    });

    // Cache in Redis (optional)
    try {
      if (redis.status === 'ready') {
        await redis.set(
          CacheKeys.userSession(token),
          JSON.stringify({
            userId: user.id,
            role: user.role as UserRole,
            expiresAt: Date.now() + 3600 * 1000,
          }),
          'EX',
          3600
        );
      }
    } catch (redisError: any) {
      console.warn('Failed to cache session in Redis (non-fatal):', redisError.message);
    }

    return {
      token,
      expiresIn: 3600,
    };
  }

  async logout(token: string): Promise<void> {
    try {
      // Delete session from database
      const session = await prisma.userSession.findFirst({
        where: {
          tokenHash: this.hashToken(token),
        },
      });

      if (session) {
        await prisma.userSession.delete({
          where: { id: session.id },
        });
      }

      // Delete from Redis cache (optional)
      try {
        if (redis.status === 'ready') {
          await redis.del(CacheKeys.userSession(token));
        }
      } catch (redisError: any) {
        // Silently fail
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    // Try cache first (optional)
    try {
      if (redis.status === 'ready') {
        const cached = await redis.get(CacheKeys.user(userId));
        if (cached) {
          return JSON.parse(cached);
        }
      }
    } catch (redisError: any) {
      // Silently continue to DB
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (user) {
      // Cache for 1 hour (optional)
      try {
        if (redis.status === 'ready') {
          await redis.set(CacheKeys.user(userId), JSON.stringify(user), 'EX', 3600);
        }
      } catch (redisError: any) {
        // Silently fail - caching is optional
      }
      return user as unknown as User;
    }

    return null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    return user as unknown as User | null;
  }

  async validateToken(token: string): Promise<TokenPayload | null> {
    try {
      // Check Redis cache first (optional)
      try {
        if (redis.status === 'ready') {
          const cached = await redis.get(CacheKeys.userSession(token));
          if (cached) {
            const session = JSON.parse(cached);
            if (session.expiresAt > Date.now()) {
              return {
                userId: session.userId,
                email: '', // Will fetch from DB if needed
                role: session.role,
              };
            }
          }
        }
      } catch (redisError: any) {
        // Silently continue to DB validation
      }

      // Verify token
      const payload = this.verifyAccessToken(token);

      // Check if session exists in database
      const session = await prisma.userSession.findFirst({
        where: {
          userId: payload.userId,
          tokenHash: this.hashToken(token),
          expiresAt: { gt: new Date() },
        },
      });

      if (!session) {
        return null;
      }

      return payload;
    } catch (error) {
      return null;
    }
  }

  private hashToken(token: string): string {
    // Simple hash for storage (in production, use crypto.createHash)
    return Buffer.from(token).toString('base64').substring(0, 50);
  }
}

export const authService = new AuthService();


