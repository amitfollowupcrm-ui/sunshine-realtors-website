import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import { getCurrentUser } from '@/lib/utils/auth';

// GET /api/users/with-stats - Get users with their website statistics
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin (or allow with API key for CRM integration)
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      // Check for API key in header for CRM integration
      const apiKey = request.headers.get('x-api-key');
      if (apiKey !== process.env.CRM_API_KEY) {
        return NextResponse.json(
          { success: false, error: 'Forbidden - Admin access or valid API key required' },
          { status: 403 }
        );
      }
    }

    const { searchParams } = new URL(request.url);
    const roleParam = searchParams.get('role');

    // Build where clause
    const where: any = {
      isActive: true,
      deletedAt: null,
    };

    // Filter by role if provided
    if (roleParam) {
      const roles = roleParam.split(',').map((r) => r.trim());
      where.role = { in: roles };
    }

    // Fetch users with statistics
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        lastLoginAt: true,
        // Count relations for statistics
        _count: {
          select: {
            propertiesOwned: true,
            propertiesListed: true,
            favorites: true,
            cartItems: true,
            shortlists: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get additional statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Count properties viewed
        const propertiesViewed = await prisma.propertyView.count({
          where: {
            userId: user.id,
          },
        });

        // Count properties in cart (active items)
        const cartCount = user._count.cartItems;

        // Count favorites
        const favoritesCount = user._count.favorites;

        // Count shortlists
        const shortlistsCount = user._count.shortlists;

        // Count properties uploaded/listed
        const propertiesListedCount = user._count.propertiesListed;

        // Count properties owned
        const propertiesOwnedCount = user._count.propertiesOwned;

        // Get purchased properties (properties with status SOLD/RENTED owned by user)
        // This is a simplified approach - adjust based on your business logic
        const purchasedProperties = await prisma.property.count({
          where: {
            ownerId: user.id,
            status: {
              in: ['SOLD', 'RENTED'],
            },
          },
        });

        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          role: user.role,
          category: user.role, // Role serves as category
          isActive: user.isActive,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          statistics: {
            propertiesViewed: propertiesViewed,
            propertiesUploaded: propertiesListedCount,
            propertiesAddedToCart: cartCount,
            propertiesInFavorites: favoritesCount,
            propertiesInShortlist: shortlistsCount,
            propertiesPurchased: purchasedProperties,
            propertiesOwned: propertiesOwnedCount,
          },
        };
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithStats,
      total: usersWithStats.length,
    });
  } catch (error: any) {
    console.error('Error fetching users with stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch users with statistics',
      },
      { status: 500 }
    );
  }
}
