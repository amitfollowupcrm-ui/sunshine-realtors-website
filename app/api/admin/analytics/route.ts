// GET /api/admin/analytics - Get analytics data

import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/middleware/auth.middleware';
import { prisma } from '@/config/database';

async function handler(
  request: NextRequest,
  context: { user: any }
): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate') 
      ? new Date(searchParams.get('startDate')!) 
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const endDate = searchParams.get('endDate') 
      ? new Date(searchParams.get('endDate')!) 
      : new Date();
    const city = searchParams.get('city');

    // Traffic metrics
    const [totalProperties, activeProperties, verifiedProperties] = await Promise.all([
      prisma.property.count({
        where: {
          deletedAt: null,
        },
      }),
      prisma.property.count({
        where: {
          status: 'ACTIVE',
          deletedAt: null,
        },
      }),
      prisma.property.count({
        where: {
          isVerified: true,
          status: 'ACTIVE',
          deletedAt: null,
        },
      }),
    ]);

    // Lead metrics
    const [totalLeads, leadsInPeriod, convertedLeads] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      prisma.lead.count({
        where: {
          status: 'CONVERTED',
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
    ]);

    // User metrics
    const [totalUsers, activeUsers, dealers] = await Promise.all([
      prisma.user.count({
        where: { deletedAt: null },
      }),
      prisma.user.count({
        where: {
          isActive: true,
          deletedAt: null,
        },
      }),
      prisma.user.count({
        where: {
          role: { in: ['DEALER', 'DISTRIBUTOR'] },
          deletedAt: null,
        },
      }),
    ]);

    // Property views (if tracking available)
    const totalViews = await prisma.propertyView.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    // City-wise breakdown (if city filter applied)
    let cityBreakdown = null;
    if (city) {
      const cityProperties = await prisma.property.groupBy({
        by: ['city'],
        where: {
          status: 'ACTIVE',
          deletedAt: null,
        },
        _count: true,
      });

      cityBreakdown = cityProperties;
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          traffic: {
            totalProperties,
            activeProperties,
            verifiedProperties,
            totalViews,
          },
          conversions: {
            totalLeads,
            leadsInPeriod,
            convertedLeads,
            conversionRate: leadsInPeriod > 0 ? (convertedLeads / leadsInPeriod) * 100 : 0,
          },
          users: {
            totalUsers,
            activeUsers,
            dealers,
          },
          properties: {
            totalListed: totalProperties,
            active: activeProperties,
            verified: verifiedProperties,
          },
          ...(cityBreakdown && { cityBreakdown }),
          period: {
            start: startDate,
            end: endDate,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred',
        },
      },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(handler);

