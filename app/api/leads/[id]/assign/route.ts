// POST /api/leads/[id]/assign - Assign lead to dealer (Admin/Distributor)

import { NextRequest, NextResponse } from 'next/server';
import { leadService } from '@/lib/services/lead.service';
import { withAdmin } from '@/lib/middleware/auth.middleware';
import { leadAssignSchema } from '@/lib/validation/lead.schemas';

async function handler(
  request: NextRequest,
  context: { user: any },
  params: { id: string }
): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = leadAssignSchema.safeParse(body);
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

    const { dealerId, priority } = validationResult.data;

    // Assign lead
    const lead = await leadService.assignLead(params.id, dealerId, priority);

    return NextResponse.json(
      {
        success: true,
        data: lead,
        message: 'Lead assigned successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Assign lead error:', error);

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

export const POST = (req: NextRequest, context: { params: { id: string } }) =>
  withAdmin((r, ctx) => handler(r, ctx, context.params))(req);

