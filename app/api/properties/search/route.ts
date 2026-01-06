// GET /api/properties/search
// Search and filter properties (Public)

import { NextRequest, NextResponse } from 'next/server';
import { propertyService } from '@/lib/services/property.service';
import { propertySearchSchema } from '@/lib/validation/property.schemas';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const filters: any = {
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '20', 10),
      sortBy: searchParams.get('sortBy') || 'newest',
    };

    // Parse array parameters
    if (searchParams.get('category')) {
      filters.category = searchParams.get('category')?.split(',');
    }
    if (searchParams.get('propertyType')) {
      filters.propertyType = searchParams.get('propertyType')?.split(',');
    }
    if (searchParams.get('city')) {
      filters.city = searchParams.get('city')?.split(',');
    }
    if (searchParams.get('locality')) {
      filters.locality = searchParams.get('locality')?.split(',');
    }
    if (searchParams.get('state')) {
      filters.state = searchParams.get('state')?.split(',');
    }
    if (searchParams.get('bedrooms')) {
      filters.bedrooms = searchParams.get('bedrooms')?.split(',').map(Number);
    }
    if (searchParams.get('bathrooms')) {
      filters.bathrooms = searchParams.get('bathrooms')?.split(',').map(Number);
    }
    if (searchParams.get('furnishingStatus')) {
      filters.furnishingStatus = searchParams.get('furnishingStatus')?.split(',');
    }
    if (searchParams.get('possessionStatus')) {
      filters.possessionStatus = searchParams.get('possessionStatus')?.split(',');
    }
    if (searchParams.get('amenities')) {
      filters.amenities = searchParams.get('amenities')?.split(',');
    }
    if (searchParams.get('priceMin')) {
      filters.priceMin = parseFloat(searchParams.get('priceMin') || '0');
    }
    if (searchParams.get('priceMax')) {
      filters.priceMax = parseFloat(searchParams.get('priceMax') || '0');
    }
    if (searchParams.get('areaMin')) {
      filters.areaMin = parseFloat(searchParams.get('areaMin') || '0');
    }
    if (searchParams.get('areaMax')) {
      filters.areaMax = parseFloat(searchParams.get('areaMax') || '0');
    }
    if (searchParams.get('isVerified')) {
      filters.isVerified = searchParams.get('isVerified') === 'true';
    }
    if (searchParams.get('isFeatured')) {
      filters.isFeatured = searchParams.get('isFeatured') === 'true';
    }
    if (searchParams.get('q')) {
      filters.q = searchParams.get('q');
    }

    // Validate filters
    const validationResult = propertySearchSchema.safeParse(filters);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid search parameters',
            details: validationResult.error.flatten().fieldErrors,
          },
        },
        { status: 422 }
      );
    }

    // Search properties
    const result = await propertyService.searchProperties(validationResult.data);

    return NextResponse.json(
      {
        success: true,
        data: {
          properties: result.properties,
        },
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNext: result.page < result.totalPages,
          hasPrev: result.page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Property search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during search',
        },
      },
      { status: 500 }
    );
  }
}

