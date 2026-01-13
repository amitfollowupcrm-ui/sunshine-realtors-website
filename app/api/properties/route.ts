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

    const property = await propertyService.createProperty(
      validationResult.data,
      user.id, // ownerId - user from authService has 'id' field
      user.id  // listedById
    );

    return NextResponse.json({
      success: true,
      property,
    });
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create property',
      },
      { status: 500 }
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
    const myProperties = searchParams.get('myProperties') === 'true'; // Filter for user's own properties
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const filters: any = {};

    // Filter by user's properties if requested
    if (myProperties && user) {
      filters.ownerId = user.userId;
      // Show all statuses for user's own properties (don't set status filter)
    } else {
      // Only show ACTIVE properties for public browsing
      filters.status = [PropertyStatus.ACTIVE];
    }

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

