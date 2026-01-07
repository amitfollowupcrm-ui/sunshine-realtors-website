import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/middleware/auth.middleware';

/**
 * Get current authenticated user from request
 */
export async function getCurrentUser(request: NextRequest) {
  const { user, error } = await authenticate(request, { requireAuth: false });
  if (error || !user) {
    return null;
  }
  return user;
}


