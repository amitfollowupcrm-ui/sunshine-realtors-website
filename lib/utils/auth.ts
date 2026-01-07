import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/middleware/auth.middleware';
import { cookies, headers } from 'next/headers';
import { authService } from '@/lib/services/auth.service';

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

/**
 * Get current authenticated user from server component (using cookies)
 */
export async function getCurrentUserFromServer() {
  try {
    const cookieStore = await cookies();
    const headersList = await headers();
    
    // Try to get token from Authorization header first
    let token = headersList.get('authorization')?.replace('Bearer ', '');
    
    // If no token in header, try to get from cookies
    // Check both 'token' (from login API) and 'auth_token' (from client-side)
    if (!token) {
      token = cookieStore.get('token')?.value || 
              cookieStore.get('auth_token')?.value || 
              null;
    }
    
    if (!token) {
      return null;
    }
    
    // Validate token
    const payload = await authService.validateToken(token);
    if (!payload) {
      return null;
    }
    
    // Get full user data
    const user = await authService.getUserById(payload.userId);
    if (!user || !user.isActive || user.deletedAt) {
      return null;
    }
    
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };
  } catch (error) {
    console.error('Error getting user from server:', error);
    return null;
  }
}


