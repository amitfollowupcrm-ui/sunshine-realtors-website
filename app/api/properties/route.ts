import { NextRequest, NextResponse } from 'next/server';
import { propertyService } from '@/lib/services/property.service';
import { getCurrentUser } from '@/lib/utils/auth';
import { propertyCreateSchema } from '@/lib/validation/property.schemas';
import { PropertyCategory, PropertyStatus } from '@/types/property.types';

// Create a new property - ALL authenticated users can create properties
export async function POST(request: NextRequest) {
  try {
    // Get authentication token from header or cookie
    const authHeader = request.headers.get('authorization');
    let token: string | undefined;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // If no token in header, try to get from cookies
    if (!token) {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
        token = cookies['auth_token'] || cookies['token'];
      }
    }
    
    // Validate token and get user
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication token required' },
        { status: 401 }
      );
    }
    
    const { authService } = await import('@/lib/services/auth.service');
    const payload = await authService.validateToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    const user = await authService.getUserById(payload.userId);
    
    if (!user || !user.isActive || user.deletedAt) {
      return NextResponse.json(
        { success: false, error: 'User account is inactive' },
        { status: 401 }
      );
    }
    
    // ALL authenticated users can create properties - NO role restrictions

    const body = await request.json();
    const validationResult = propertyCreateSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('Validation errors:', validationResult.error.issues);
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.issues.map(issue => ({
            path: issue.path,
            message: issue.message,
            code: issue.code,
          })),
        },
        { status: 400 }
      );
    }

    console.log('[POST /api/properties] Creating property for user:', user.id);
    console.log('[POST /api/properties] User object:', JSON.stringify({ id: user.id, email: user.email, role: user.role }));
    console.log('[POST /api/properties] Property data keys:', Object.keys(validationResult.data));
    
    try {
      const property = await propertyService.createProperty(
        validationResult.data,
        user.id, // ownerId - user from authService has 'id' field
        user.id  // listedById
      );

      console.log('[POST /api/properties] Property created successfully with ID:', property.id);
      console.log('[POST /api/properties] Property ownerId:', property.ownerId);
      console.log('[POST /api/properties] Property status:', property.status);

      return NextResponse.json({
        success: true,
        property,
      });
    } catch (createError: any) {
      console.error('[POST /api/properties] Property service error:', createError);
      console.error('[POST /api/properties] Property service error message:', createError.message);
      console.error('[POST /api/properties] Property service error stack:', createError.stack);
      console.error('[POST /api/properties] Property service error code:', createError.code);
      console.error('[POST /api/properties] Property service error meta:', createError.meta);
      
      // Re-throw to be caught by outer catch block
      throw createError;
    }
  } catch (error: any) {
    console.error('[POST /api/properties] Error creating property:', error);
    console.error('[POST /api/properties] Error message:', error.message);
    console.error('[POST /api/properties] Error stack:', error.stack);
    console.error('[POST /api/properties] Error code:', error.code);
    console.error('[POST /api/properties] Error meta:', error.meta);
    
    // Return detailed error for debugging
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create property',
        details: {
          message: error.message,
          code: error.code,
          name: error.name,
          ...(error.meta && { meta: error.meta }),
        },
      },
      { status: error.code === 'P2002' ? 409 : error.code === 'P2003' ? 400 : 500 }
    );
  }
}

// Get properties (with filters for dealers/buyers) - Public access allowed
export async function GET(request: NextRequest) {
  try {
    // Allow public browsing - authentication is optional
    const user = await getCurrentUser(request);

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as PropertyCategory | null;
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const propertyType = searchParams.get('propertyType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const statusParam = searchParams.get('status'); // Status filter for admin
    const myProperties = searchParams.get('myProperties') === 'true'; // Filter for user's own properties
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const filters: any = {};

    // Check if user is admin or super admin
    const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');

    // Filter by user's properties if requested
    if (myProperties && user) {
      // getCurrentUser returns { userId: string, ... }, so use userId
      filters.ownerId = user.userId;
      // Show all statuses for user's own properties (don't set status filter)
    } else if (isAdmin && statusParam) {
      // Admin can filter by specific status
      filters.status = statusParam.split(',').map(s => s.trim()) as PropertyStatus[];
    } else if (!isAdmin) {
      // Only show ACTIVE properties for public browsing (non-admin users)
      filters.status = [PropertyStatus.ACTIVE];
    }
    // Admin/Super Admin without status filter: Show all properties (no status filter, no ownerId filter)

    if (category) filters.category = [category];
    if (city) filters.city = [city];
    if (state) filters.state = [state];
    if (propertyType) filters.propertyType = [propertyType];
    if (minPrice) filters.priceMin = parseFloat(minPrice);
    if (maxPrice) filters.priceMax = parseFloat(maxPrice);
    if (bedrooms) filters.bedrooms = [parseInt(bedrooms)];
    if (page) filters.page = page;
    if (limit) filters.limit = limit;

    // If user is a dealer, show all properties
    // If user is a buyer, show all active properties
    const result = await propertyService.searchProperties(filters);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch properties',
      },
      { status: 500 }
    );
  }
}

