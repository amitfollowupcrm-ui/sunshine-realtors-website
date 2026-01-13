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
    // headersList.get() returns string | null, so we use nullish coalescing
    const authHeader = headersList.get('authorization');
    let token: string | undefined = authHeader?.replace('Bearer ', '');
    
    // If no token in header, try to get from cookies
    // cookieStore.get().value returns string | undefined
    // Use nullish coalescing (??) to avoid introducing null
    // This ensures token type remains strictly string | undefined
    if (!token) {
      token = cookieStore.get('token')?.value 
           ?? cookieStore.get('auth_token')?.value;
      // token is now string | undefined (never null)
    }
    
    // Check if token exists (undefined check)
    if (!token) {
      return null;
    }
    
    // At this point, token is guaranteed to be string (not undefined)
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
