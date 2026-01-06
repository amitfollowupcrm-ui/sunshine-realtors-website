// POST /api/admin/properties/[id]/moderate - Moderate single property

import { NextRequest, NextResponse } from 'next/server';
import { propertyService } from '@/lib/services/property.service';
import { withAdmin } from '@/lib/middleware/auth.middleware';
import { propertyModerateSchema } from '@/lib/validation/property.schemas';

async function handler(
  request: NextRequest,
  context: { user: any },
  params: { id: string }
): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = propertyModerateSchema.safeParse(body);
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

    const { action, reason } = validationResult.data;

    // Moderate property
    const property = await propertyService.moderateProperty(
      params.id,
      action,
      reason,
      context.user.userId
    );

    return NextResponse.json(
      {
        success: true,
        data: property,
        message: `Property ${action.toLowerCase()}d successfully`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Moderate property error:', error);

    if (error.message === 'Property not found') {
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

