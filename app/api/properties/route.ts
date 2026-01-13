import { NextRequest, NextResponse } from 'next/server';
import { propertyService } from '@/lib/services/property.service';
import { getCurrentUser } from '@/lib/utils/auth';
import { propertyCreateSchema } from '@/lib/validation/property.schemas';
import { PropertyCategory, PropertyStatus } from '@/types/property.types';

// Create a new property (for SELLER role)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Allow all authenticated users to create properties
    // No role restriction - any logged-in user can post properties

    const body = await request.json();
    const validationResult = propertyCreateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const property = await propertyService.createProperty(
      validationResult.data,
      user.userId,
      user.userId // listedById
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const filters: any = {
      status: PropertyStatus.ACTIVE, // Only show active properties
    };

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

