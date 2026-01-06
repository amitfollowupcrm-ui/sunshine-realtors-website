// GET /api/properties/[id] - Get property details
// PUT /api/properties/[id] - Update property
// DELETE /api/properties/[id] - Delete property

import { NextRequest, NextResponse } from 'next/server';
import { propertyService } from '@/lib/services/property.service';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { propertyUpdateSchema, propertyModerateSchema } from '@/lib/validation/property.schemas';

// GET property by ID (Public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await propertyService.getPropertyById(params.id);

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Property not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: property,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get property error:', error);
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

// UPDATE property (Authenticated)
async function updateHandler(
  request: NextRequest,
  context: { user: any },
  params: { id: string }
): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = propertyUpdateSchema.safeParse(body);
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

    // Update property
    const property = await propertyService.updateProperty(
      params.id,
      validationResult.data,
      context.user.userId,
      context.user.role
    );

    return NextResponse.json(
      {
        success: true,
        data: property,
        message: 'Property updated successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update property error:', error);

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

// DELETE property (Authenticated)
async function deleteHandler(
  request: NextRequest,
  context: { user: any },
  params: { id: string }
): Promise<NextResponse> {
  try {
    await propertyService.deleteProperty(
      params.id,
      context.user.userId,
      context.user.role
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Property deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete property error:', error);

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

export const PUT = (req: NextRequest, context: { params: { id: string } }) =>
  withAuth((r, ctx) => updateHandler(r, ctx, context.params))(req);

export const DELETE = (req: NextRequest, context: { params: { id: string } }) =>
  withAuth((r, ctx) => deleteHandler(r, ctx, context.params))(req);

