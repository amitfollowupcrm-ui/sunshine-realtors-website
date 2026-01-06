// GET /api/leads/[id] - Get lead details
// PUT /api/leads/[id] - Update lead
// POST /api/leads/[id]/assign - Assign lead to dealer

import { NextRequest, NextResponse } from 'next/server';
import { leadService } from '@/lib/services/lead.service';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { leadUpdateSchema, leadAssignSchema } from '@/lib/validation/lead.schemas';

// GET lead by ID (Authenticated)
async function getLeadHandler(
  request: NextRequest,
  context: { user: any },
  params: { id: string }
): Promise<NextResponse> {
  try {
    const lead = await leadService.getLeadById(params.id);

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Lead not found',
          },
        },
        { status: 404 }
      );
    }

    // Check permissions
    const canView =
      lead.assignedToId === context.user.userId ||
      context.user.role === 'ADMIN' ||
      context.user.role === 'SUPER_ADMIN' ||
      context.user.role === 'INTERNAL_SALES';

    if (!canView) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Insufficient permissions to view this lead',
          },
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: lead,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get lead error:', error);
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

// PUT - Update lead (Authenticated)
async function updateLeadHandler(
  request: NextRequest,
  context: { user: any },
  params: { id: string }
): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = leadUpdateSchema.safeParse(body);
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

    // Update lead
    const lead = await leadService.updateLead(
      params.id,
      validationResult.data,
      context.user.userId,
      context.user.role
    );

    return NextResponse.json(
      {
        success: true,
        data: lead,
        message: 'Lead updated successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update lead error:', error);

    if (error.message === 'Lead not found') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        },
        { status: 404 }
      );
    }

    if (error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: error.message,
          },
        },
        { status: 403 }
      );
    }

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

export const GET = (req: NextRequest, context: { params: { id: string } }) =>
  withAuth((r, ctx) => getLeadHandler(r, ctx, context.params), {
    requireAuth: true,
    requirePermissions: ['leads:read'],
  })(req);

export const PUT = (req: NextRequest, context: { params: { id: string } }) =>
  withAuth((r, ctx) => updateLeadHandler(r, ctx, context.params), {
    requireAuth: true,
    requirePermissions: ['leads:update'],
  })(req);

