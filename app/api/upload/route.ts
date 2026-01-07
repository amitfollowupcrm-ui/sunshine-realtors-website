import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/utils/auth';

// File upload handler - converts files to base64 data URLs for storage in database
// In production, use cloud storage (S3, Cloudinary, etc.) for better performance
// For now, we'll use base64 encoding to store in database

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'properties';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'application/pdf',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Check file size (10MB for images, 50MB for videos)
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File size exceeds maximum allowed (${maxSize / 1024 / 1024}MB)` },
        { status: 400 }
      );
    }

    // Convert file to base64 data URL
    // This works on serverless environments like Vercel
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Generate unique filename for reference
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;

    // Return data URL (client can store this in database or convert to blob URL)
    // For better performance, you should upload to cloud storage and return the public URL
    return NextResponse.json({
      success: true,
      url: dataUrl, // Base64 data URL - can be stored directly in database
      filename: filename,
      size: file.size,
      type: file.type,
      // Note: For production, use cloud storage (S3, Cloudinary) and return public URL instead
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to upload file',
      },
      { status: 500 }
    );
  }
}

