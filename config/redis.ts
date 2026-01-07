// Redis configuration

import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Create Redis client with lazy connection (don't fail if Redis is unavailable)
export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError(err) {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
  lazyConnect: true, // Don't connect immediately
  enableOfflineQueue: false, // Don't queue commands when disconnected
});

// Try to connect, but don't fail if it doesn't work
redis.connect().catch((err) => {
  console.warn('⚠️  Redis connection failed - continuing without cache:', err.message);
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  // Only log, don't throw - allow app to continue without Redis
  console.warn('⚠️  Redis error (non-fatal):', err.message);
});

// Cache utility functions - fail gracefully if Redis is unavailable
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!redis.status || redis.status !== 'ready') {
        return null; // Redis not ready, return null (cache miss)
      }
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error: any) {
      // Silently fail - app should work without cache
      if (error.message?.includes('Connection is closed') || 
          error.message?.includes('not ready')) {
        return null;
      }
      console.warn('Cache get error (non-fatal):', error.message);
      return null;
    }
  },

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      if (!redis.status || redis.status !== 'ready') {
        return; // Redis not ready, skip caching
      }
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await redis.setex(key, ttlSeconds, serialized);
      } else {
        await redis.set(key, serialized);
      }
    } catch (error: any) {
      // Silently fail - app should work without cache
      if (!error.message?.includes('Connection is closed') && 
          !error.message?.includes('not ready')) {
        console.warn('Cache set error (non-fatal):', error.message);
      }
    }
  },

  async del(key: string): Promise<void> {
    try {
      if (!redis.status || redis.status !== 'ready') {
        return; // Redis not ready, skip
      }
      await redis.del(key);
    } catch (error: any) {
      // Silently fail
      if (!error.message?.includes('Connection is closed') && 
          !error.message?.includes('not ready')) {
        console.warn('Cache delete error (non-fatal):', error.message);
      }
    }
  },

  async delPattern(pattern: string): Promise<void> {
    try {
      if (!redis.status || redis.status !== 'ready') {
        return; // Redis not ready, skip
      }
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error: any) {
      // Silently fail
      if (!error.message?.includes('Connection is closed') && 
          !error.message?.includes('not ready')) {
        console.warn('Cache delete pattern error (non-fatal):', error.message);
      }
    }
  },
};

// Cache keys
export const CacheKeys = {
  property: (id: string) => `property:${id}`,
  propertySearch: (query: string) => `property:search:${query}`,
  user: (id: string) => `user:${id}`,
  userSession: (token: string) => `session:${token}`,
  lead: (id: string) => `lead:${id}`,
  autocomplete: (query: string) => `autocomplete:${query}`,
  rateLimit: (identifier: string) => `ratelimit:${identifier}`,
};

export default redis;



