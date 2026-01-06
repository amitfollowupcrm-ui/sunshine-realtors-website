// Authentication Service
// Handles user authentication, JWT tokens, password management

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
  private readonly JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.JWT_REFRESH_EXPIRES_IN,
    });
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
    const user = await prisma.user.create({
      data: {
        email: input.email,
        phone: input.phone,
        passwordHash,
        fullName: input.fullName,
        role: input.role,
        permissions: ROLE_PERMISSIONS[input.role] || [],
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

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    // Store refresh token in database
    await prisma.userSession.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(token),
        refreshTokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: user as User,
      token,
      refreshToken,
      expiresIn: 3600, // 1 hour in seconds
    };
  }

  async login(input: UserLoginInput, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { profile: true },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.passwordHash) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    if (user.deletedAt) {
      throw new Error('Account is deleted');
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    // Store session in database
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

    // Cache session in Redis
    await redis.set(
      CacheKeys.userSession(token),
      JSON.stringify({
        userId: user.id,
        role: user.role,
        expiresAt: Date.now() + 3600 * 1000,
      }),
      'EX',
      3600 // 1 hour
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: user as User,
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
      role: user.role,
    };

    const token = this.generateAccessToken(tokenPayload);

    // Update session
    await prisma.userSession.update({
      where: { id: session.id },
      data: {
        tokenHash: this.hashToken(token),
      },
    });

    // Cache in Redis
    await redis.set(
      CacheKeys.userSession(token),
      JSON.stringify({
        userId: user.id,
        role: user.role,
        expiresAt: Date.now() + 3600 * 1000,
      }),
      'EX',
      3600
    );

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

      // Delete from Redis cache
      await redis.del(CacheKeys.userSession(token));
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    // Try cache first
    const cached = await redis.get(CacheKeys.user(userId));
    if (cached) {
      return JSON.parse(cached);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (user) {
      // Cache for 1 hour
      await redis.set(CacheKeys.user(userId), JSON.stringify(user), 'EX', 3600);
      return user as User;
    }

    return null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    return user as User | null;
  }

  async validateToken(token: string): Promise<TokenPayload | null> {
    try {
      // Check Redis cache first
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

