// GET /api/admin/properties/moderation - Get properties pending moderation
// POST /api/admin/properties/moderation - Bulk moderate properties

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/config/database';
import { withAdmin } from '@/lib/middleware/auth.middleware';
import { propertyService } from '@/lib/services/property.service';
import { z } from 'zod';

const bulkModerateSchema = z.object({
  propertyIds: z.array(z.string().uuid()),
  action: z.enum(['APPROVE', 'REJECT']),
  reason: z.string().optional(),
});

// GET - Get moderation queue
async function getModerationQueue(
  request: NextRequest,
  context: { user: any }
): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'PENDING_VERIFICATION';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const where: any = {
      status: status as any,
      deletedAt: null,
    };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          listedBy: {
            select: {
              id: true,
              fullName: true,
            },
          },
          images: {
            take: 1,
            orderBy: { orderIndex: 'asc' },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          properties,
        },
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get moderation queue error:', error);
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

// POST - Bulk moderate properties
async function bulkModerate(
  request: NextRequest,
  context: { user: any }
): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = bulkModerateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: validationResult.error.flatten().fieldErrors,
          },
        },
        { status: 422 }
      );
    }

    const { propertyIds, action, reason } = validationResult.data;

    // Moderate each property
    const results = await Promise.allSettled(
      propertyIds.map((id) =>
        propertyService.moderateProperty(
          id,
          action,
          reason,
          context.user.userId
        )
      )
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return NextResponse.json(
      {
        success: true,
        data: {
          successful,
          failed,
          total: propertyIds.length,
        },
        message: `${successful} properties ${action.toLowerCase()}d successfully`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Bulk moderate error:', error);
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

export const GET = withAdmin(getModerationQueue);
export const POST = withAdmin(bulkModerate);

