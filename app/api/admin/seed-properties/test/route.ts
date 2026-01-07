import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import { getCurrentUser } from '@/lib/utils/auth';

// Test endpoint to check database connection and basic operations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secretKey = searchParams.get('key');
    
    if (secretKey !== 'seed2024') {
      const user = await getCurrentUser(request);
      if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        );
      }
    }

    const results: any = {
      connection: false,
      userCheck: false,
      sellerExists: false,
      propertyCreation: false,
      errors: [] as string[],
    };

    // Test 1: Database Connection
    try {
      await prisma.$connect();
      results.connection = true;
      results.message = 'Database connection successful';
    } catch (error: any) {
      results.errors.push(`Connection failed: ${error.message}`);
      return NextResponse.json({ success: false, results }, { status: 500 });
    }

    // Test 2: Check if users table exists and query it
    try {
      const userCount = await prisma.user.count();
      results.userCheck = true;
      results.userCount = userCount;
    } catch (error: any) {
      results.errors.push(`User query failed: ${error.message}`);
    }

    // Test 3: Check if seller exists
    try {
      const seller = await prisma.user.findFirst({
        where: { role: 'SELLER' },
      });
      results.sellerExists = !!seller;
      if (seller) {
        results.sellerId = seller.id;
        results.sellerEmail = seller.email;
      }
    } catch (error: any) {
      results.errors.push(`Seller check failed: ${error.message}`);
    }

    // Test 4: Try to create a simple property
    if (results.sellerExists) {
      try {
        const testProperty = await prisma.property.create({
          data: {
            title: 'Test Property - Connection Check',
            slug: `test-property-connection-${Date.now()}`,
            description: 'This is a test property to verify database connection and property creation',
            category: 'BUY',
            propertyType: 'APARTMENT',
            status: 'ACTIVE',
            price: 1000000,
            city: 'Mohali',
            state: 'Punjab',
            locality: 'Test Sector',
            bedrooms: 2,
            bathrooms: 1,
            builtUpArea: 1000,
            carpetArea: 800,
            ownerId: results.sellerId,
            listedById: results.sellerId,
            primaryImageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80&auto=format&fit=crop',
            imageUrls: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80&auto=format&fit=crop'],
            isVerified: false,
          },
        });
        results.propertyCreation = true;
        results.testPropertyId = testProperty.id;
        results.message = 'All tests passed! Database is ready for seeding.';

        // Clean up test property
        try {
          await prisma.property.delete({
            where: { id: testProperty.id },
          });
          results.testPropertyDeleted = true;
        } catch (deleteError: any) {
          results.errors.push(`Cleanup failed: ${deleteError.message}`);
        }
      } catch (error: any) {
        results.errors.push(`Property creation failed: ${error.message}`);
        results.propertyCreationError = {
          message: error.message,
          code: error.code,
          meta: error.meta,
        };
      }
    } else {
      results.errors.push('Cannot test property creation: No seller user found');
    }

    return NextResponse.json({
      success: results.connection && results.userCheck,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


