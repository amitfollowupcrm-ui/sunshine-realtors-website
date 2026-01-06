// Rate Limiting Middleware
// Prevents API abuse with Redis-based rate limiting

import { NextRequest, NextResponse } from 'next/server';
import { redis, CacheKeys } from '@/config/redis';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
}

export interface RateLimitResult {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Rate limit middleware
 */
export async function rateLimit(
  request: NextRequest,
  options: RateLimitOptions
): Promise<{ allowed: boolean; result?: RateLimitResult; error?: NextResponse }> {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes default
    maxRequests = 100, // 100 requests default
    keyGenerator,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = options;

  // Generate rate limit key
  const key = keyGenerator
    ? keyGenerator(request)
    : generateDefaultKey(request);

  const cacheKey = CacheKeys.rateLimit(key);

  try {
    // Get current count
    const countStr = await redis.get(cacheKey);
    let count = countStr ? parseInt(countStr, 10) : 0;

    // Check if limit exceeded
    if (count >= maxRequests) {
      // Get TTL to calculate retry after
      const ttl = await redis.ttl(cacheKey);
      const reset = Date.now() + (ttl * 1000);

      return {
        allowed: false,
        result: {
          limit: maxRequests,
          remaining: 0,
          reset,
          retryAfter: ttl,
        },
        error: NextResponse.json(
          {
            success: false,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: `Too many requests. Please try again in ${Math.ceil(ttl / 60)} minutes.`,
            },
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': reset.toString(),
              'Retry-After': ttl.toString(),
            },
          }
        ),
      };
    }

    // Increment counter
    if (count === 0) {
      // First request in window
      await redis.setex(cacheKey, Math.ceil(windowMs / 1000), '1');
    } else {
      await redis.incr(cacheKey);
    }

    // Get updated count
    const newCount = count + 1;
    const ttl = await redis.ttl(cacheKey);
    const reset = Date.now() + (ttl * 1000);

    return {
      allowed: true,
      result: {
        limit: maxRequests,
        remaining: Math.max(0, maxRequests - newCount),
        reset,
      },
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // On error, allow request (fail open)
    return {
      allowed: true,
    };
  }
}

/**
 * Generate default rate limit key from request
 */
function generateDefaultKey(request: NextRequest): string {
  // Try to get user ID from auth header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // In production, decode JWT to get user ID
    // For now, use IP as fallback
  }

  // Use IP address as fallback
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    'unknown';

  const path = request.nextUrl.pathname;

  return `${ip}:${path}`;
}

/**
 * Rate limit by user ID
 */
export function rateLimitByUser(userId: string): RateLimitOptions['keyGenerator'] {
  return (req: NextRequest) => `user:${userId}`;
}

/**
 * Rate limit by IP
 */
export function rateLimitByIP(): RateLimitOptions['keyGenerator'] {
  return (req: NextRequest) => {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0] ||
      req.headers.get('x-real-ip') ||
      req.ip ||
      'unknown';
    return `ip:${ip}`;
  };
}

/**
 * Create rate-limited API route handler
 */
export function withRateLimit(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
  options: RateLimitOptions
) {
  return async (req: NextRequest, context?: any) => {
    const { allowed, error, result } = await rateLimit(req, options);

    if (!allowed && error) {
      return error;
    }

    // Add rate limit headers to response
    const response = await handler(req, context);
    if (result) {
      response.headers.set('X-RateLimit-Limit', result.limit.toString());
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      response.headers.set('X-RateLimit-Reset', result.reset.toString());
    }

    return response;
  };
}

// Pre-configured rate limiters
export const rateLimiters = {
  // Public endpoints: 100 requests per 15 minutes per IP
  public: (req: NextRequest) =>
    rateLimit(req, {
      windowMs: 15 * 60 * 1000,
      maxRequests: 100,
      keyGenerator: rateLimitByIP(),
    }),

  // Authenticated endpoints: 1000 requests per 15 minutes per user
  authenticated: (req: NextRequest, userId: string) =>
    rateLimit(req, {
      windowMs: 15 * 60 * 1000,
      maxRequests: 1000,
      keyGenerator: rateLimitByUser(userId),
    }),

  // Admin endpoints: 5000 requests per 15 minutes per user
  admin: (req: NextRequest, userId: string) =>
    rateLimit(req, {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5000,
      keyGenerator: rateLimitByUser(userId),
    }),

  // Login endpoint: 5 requests per 15 minutes per IP
  login: (req: NextRequest) =>
    rateLimit(req, {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
      keyGenerator: rateLimitByIP(),
    }),
};

