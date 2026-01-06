// GET /api/leads - Get leads (Authenticated)
// POST /api/leads - Create lead/inquiry (Public or Authenticated)

import { NextRequest, NextResponse } from 'next/server';
import { leadService } from '@/lib/services/lead.service';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { leadCreateSchema, leadFilterSchema } from '@/lib/validation/lead.schemas';

// POST - Create lead (Public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = leadCreateSchema.safeParse(body);
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

    // Get UTM params from query or body
    const searchParams = request.nextUrl.searchParams;
    const input = {
      ...validationResult.data,
      utmSource: validationResult.data.utmSource || searchParams.get('utm_source') || undefined,
      utmMedium: validationResult.data.utmMedium || searchParams.get('utm_medium') || undefined,
      utmCampaign: validationResult.data.utmCampaign || searchParams.get('utm_campaign') || undefined,
      referrerUrl: validationResult.data.referrerUrl || request.headers.get('referer') || undefined,
    };

    // Create lead
    const lead = await leadService.createLead(input);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: lead.id,
          status: lead.status,
          message: 'Lead created successfully. We will contact you soon.',
        },
        message: 'Inquiry submitted successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create lead error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating lead',
        },
      },
      { status: 500 }
    );
  }
}

// GET - Get leads (Authenticated)
async function getLeadsHandler(
  request: NextRequest,
  context: { user: any }
): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse filters
    const filters: any = {
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '20', 10),
    };

    if (searchParams.get('status')) {
      filters.status = searchParams.get('status')?.split(',');
    }
    if (searchParams.get('assignedToId')) {
      filters.assignedToId = searchParams.get('assignedToId');
    }
    if (searchParams.get('propertyId')) {
      filters.propertyId = searchParams.get('propertyId');
    }
    if (searchParams.get('source')) {
      filters.source = searchParams.get('source')?.split(',');
    }
    if (searchParams.get('priority')) {
      filters.priority = searchParams.get('priority')?.split(',');
    }

    // If not admin, filter by assigned dealer
    if (
      context.user.role !== 'ADMIN' &&
      context.user.role !== 'SUPER_ADMIN' &&
      context.user.role !== 'INTERNAL_SALES'
    ) {
      filters.assignedToId = context.user.userId;
    }

    // Validate filters
    const validationResult = leadFilterSchema.safeParse(filters);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid filter parameters',
            details: validationResult.error.flatten().fieldErrors,
          },
        },
        { status: 422 }
      );
    }

    // Get leads
    const result = await leadService.getLeads(validationResult.data);

    return NextResponse.json(
      {
        success: true,
        data: {
          leads: result.leads,
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
    console.error('Get leads error:', error);
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

export const GET = withAuth(getLeadsHandler, {
  requireAuth: true,
  requirePermissions: ['leads:read'],
});

