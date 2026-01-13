// Supabase Storage utility for property photos
// Falls back to base64 if Supabase is not configured

import { supabase } from '@/lib/supabase/client';

export interface UploadPhotoOptions {
  file: File;
  propertyId?: string;
  onProgress?: (progress: number) => void;
}

export interface UploadPhotoResult {
  url: string;
  path: string;
}

/**
 * Upload property photo to Supabase Storage
 * Falls back to base64 if Supabase is not configured
 */
export async function uploadPropertyPhoto(
  options: UploadPhotoOptions
): Promise<UploadPhotoResult> {
  const { file, propertyId, onProgress } = options;

  // Validate file
  if (!file) {
    throw new Error('No file provided');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File size must be less than 10MB');
  }

  // If Supabase is not configured, use base64 fallback
  if (!supabase) {
    console.log('⚠️ Supabase not configured, using base64 fallback');
    return uploadPhotoBase64(file);
  }

  try {
    // Generate unique file path
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'jpg';
    const filePath = `property-photos/${propertyId || 'temp'}/${timestamp}-${randomString}.${extension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('property-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      // Fallback to base64
      return uploadPhotoBase64(file);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('property-photos')
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Upload error:', error);
    // Fallback to base64
    return uploadPhotoBase64(file);
  }
}

/**
 * Upload multiple photos
 */
export async function uploadPropertyPhotos(
  files: File[],
  propertyId?: string
): Promise<UploadPhotoResult[]> {
  const uploadPromises = files.map(file => uploadPropertyPhoto({ file, propertyId }));
  return Promise.all(uploadPromises);
}

/**
 * Delete photo from Supabase Storage
 */
export async function deletePropertyPhoto(path: string): Promise<void> {
  if (!supabase) {
    console.warn('Supabase not configured, cannot delete photo');
    return;
  }

  try {
    const { error } = await supabase.storage
      .from('property-photos')
      .remove([path]);

    if (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

/**
 * Fallback: Convert file to base64 data URL
 */
async function uploadPhotoBase64(file: File): Promise<UploadPhotoResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve({
        url: base64,
        path: `base64:${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      });
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
