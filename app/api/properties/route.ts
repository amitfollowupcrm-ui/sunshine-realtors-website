// POST /api/properties - Create new property

import { NextRequest, NextResponse } from 'next/server';
import { propertyService } from '@/lib/services/property.service';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { propertyCreateSchema } from '@/lib/validation/property.schemas';
import { RBAC } from '@/lib/auth/rbac';
import { UserRole } from '@/types/user.types';

async function handler(
  request: NextRequest,
  context: { user: any }
): Promise<NextResponse> {
  try {
    // Check permission
    if (!RBAC.hasPermission(context.user.role, 'properties:create')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Insufficient permissions to create property',
          },
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = propertyCreateSchema.safeParse(body);
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

    // Create property
    const property = await propertyService.createProperty(
      validationResult.data,
      context.user.userId,
      context.user.userId // listedById same as owner for now
    );

    return NextResponse.json(
      {
        success: true,
        data: property,
        message: 'Property created successfully. Pending verification.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create property error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating property',
        },
      },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler, {
  requireAuth: true,
  requirePermissions: ['properties:create'],
});

