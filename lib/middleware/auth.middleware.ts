// Authentication middleware for API routes
// Validates JWT tokens and attaches user to request

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { RBAC } from '@/lib/auth/rbac';
import { UserRole } from '@/types/user.types';

interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

export interface AuthMiddlewareOptions {
  requireAuth?: boolean;
  requireRoles?: UserRole[];
  requirePermissions?: string[];
  allowOwnResource?: boolean;
}

/**
 * Authentication middleware
 */
export async function authenticate(
  request: NextRequest,
  options: AuthMiddlewareOptions = {}
): Promise<{ user?: any; error?: NextResponse }> {
  const { requireAuth = true, requireRoles, requirePermissions } = options;

  // Get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (requireAuth) {
      return {
        error: NextResponse.json(
          { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
          { status: 401 }
        ),
      };
    }
    return {};
  }

  const token = authHeader.substring(7);

  // Validate token
  const payload = await authService.validateToken(token);
  if (!payload) {
    if (requireAuth) {
      return {
        error: NextResponse.json(
          { success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } },
          { status: 401 }
        ),
      };
    }
    return {};
  }

  // Get full user data
  const user = await authService.getUserById(payload.userId);
  if (!user || !user.isActive || user.deletedAt) {
    return {
      error: NextResponse.json(
        { success: false, error: { code: 'USER_INACTIVE', message: 'User account is inactive' } },
        { status: 403 }
      ),
    };
  }

  // Check role requirements
  if (requireRoles && requireRoles.length > 0) {
    if (!requireRoles.includes(user.role)) {
      return {
        error: NextResponse.json(
          { success: false, error: { code: 'FORBIDDEN', message: 'Insufficient role permissions' } },
          { status: 403 }
        ),
      };
    }
  }

  // Check permission requirements
  if (requirePermissions && requirePermissions.length > 0) {
    const hasPermission = RBAC.hasAnyPermission(user.role, requirePermissions);
    if (!hasPermission) {
      return {
        error: NextResponse.json(
          { success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } },
          { status: 403 }
        ),
      };
    }
  }

  return {
    user: {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    },
  };
}

/**
 * Create authenticated API route handler wrapper
 */
export function withAuth(
  handler: (req: NextRequest, context: { user: any }) => Promise<NextResponse>,
  options: AuthMiddlewareOptions = {}
) {
  return async (req: NextRequest) => {
    const { user, error } = await authenticate(req, options);
    if (error) {
      return error;
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    return handler(req, { user });
  };
}

/**
 * Create admin-only API route handler wrapper
 */
export function withAdmin(
  handler: (req: NextRequest, context: { user: any }) => Promise<NextResponse>
) {
  return withAuth(handler, {
    requireAuth: true,
    requireRoles: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.INTERNAL_OPS],
  });
}

