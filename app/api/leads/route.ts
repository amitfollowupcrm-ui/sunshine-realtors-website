import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import { getCurrentUser } from '@/lib/utils/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/leads - Get leads (authenticated users only)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const assignedToId = searchParams.get('assignedToId');
    const propertyId = searchParams.get('propertyId');

    // Build where clause
    const where: any = {};

    // Filter by status if provided
    if (status) {
      const statusArray = status.split(',').map(s => s.trim());
      where.status = { in: statusArray };
    }

    // Filter by assigned user if provided
    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    // Filter by property if provided
    if (propertyId) {
      where.propertyId = propertyId;
    }

    // For non-admin users, only show their assigned leads
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      where.assignedToId = user.userId;
    }

    // Fetch leads with pagination
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          assignedTo: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              slug: true,
              city: true,
              state: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        leads,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch leads',
      },
      { status: 500 }
    );
  }
}
