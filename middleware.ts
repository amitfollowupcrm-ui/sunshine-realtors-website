// Next.js middleware for route protection and authentication

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/buy',
  '/rent',
  '/new-launch',
  '/commercial',
  '/plots',
  '/projects',
  '/properties',
  '/api/auth/login',
  '/api/auth/register',
  '/api/properties/search',
  '/api/properties/[id]',
  '/api/search',
];

// Admin routes that require admin role
const adminRoutes = [
  '/admin',
  '/api/admin',
];

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/api/auth/me',
  '/api/auth/logout',
  '/api/properties',
  '/api/leads',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => {
    if (route.includes('[') && route.includes(']')) {
      // Dynamic route pattern matching
      const pattern = route.replace(/\[.*?\]/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(pathname);
    }
    return pathname.startsWith(route);
  });

  // Check if route is admin
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route.includes('[') && route.includes(']')) {
      const pattern = route.replace(/\[.*?\]/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(pathname);
    }
    return pathname.startsWith(route);
  });

  // Get auth token from cookies or headers
  const token = 
    request.cookies.get('auth_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check authentication
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, authentication is checked in the API route itself
  // since we need to validate the token and check role
  if (isAdminRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};





