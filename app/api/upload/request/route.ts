// POST /api/upload/request - Get presigned URL for file upload

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { z } from 'zod';

const uploadRequestSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  folder: z.string().default('properties'),
  size: z.number().positive(),
});

async function handler(
  request: NextRequest,
  context: { user: any }
): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = uploadRequestSchema.safeParse(body);
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

    const { filename, contentType, folder, size } = validationResult.data;

    // Check file size
    const maxSize = contentType.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: `File size exceeds maximum allowed size`,
          },
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = filename.split('.').pop();
    const key = `${folder}/${timestamp}-${randomString}.${extension}`;

    // In production, generate presigned URL from S3/GCS
    // For now, return a placeholder structure
    const uploadUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/upload/store?key=${encodeURIComponent(key)}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          uploadUrl,
          key,
          expiresIn: 3600, // 1 hour
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Upload request error:', error);
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

export const POST = withAuth(handler, { requireAuth: true });

