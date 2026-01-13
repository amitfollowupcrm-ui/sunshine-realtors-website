'use client';

import React, { useState, useRef, useEffect } from 'react';
import { uploadPropertyPhoto } from '@/lib/utils/supabase-storage';

interface PropertyPhotoUploadProps {
  propertyId?: string;
  onUploadComplete: (photoUrls: string[]) => void;
  onUploadError?: (error: string) => void;
  maxPhotos?: number;
  disabled?: boolean;
  existingPhotos?: string[];
}

export const PropertyPhotoUpload: React.FC<PropertyPhotoUploadProps> = ({
  propertyId,
  onUploadComplete,
  onUploadError,
  maxPhotos = 10,
  disabled = false,
  existingPhotos = []
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(existingPhotos);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update uploaded photos when existingPhotos prop changes
  useEffect(() => {
    setUploadedPhotos(existingPhotos);
  }, [existingPhotos]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file types
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        onUploadError?.('Please select only image files (JPG, PNG, GIF, etc.)');
        return false;
      }
      
      if (!isValidSize) {
        onUploadError?.('File size must be less than 10MB');
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Check total photo limit
    const totalPhotos = uploadedPhotos.length + selectedFiles.length + validFiles.length;
    if (totalPhotos > maxPhotos) {
      onUploadError?.(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadPhotos = async () => {
    if (selectedFiles.length === 0) {
      onUploadComplete(uploadedPhotos);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];
      const totalFiles = selectedFiles.length;

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        try {
          const result = await uploadPropertyPhoto({
            file,
            propertyId,
            onProgress: (progress) => {
              const overallProgress = ((i / totalFiles) * 100) + (progress / totalFiles);
              setUploadProgress(overallProgress);
            }
          });
          uploadedUrls.push(result.url);
        } catch (error) {
          console.error(`Error uploading file ${i + 1}:`, error);
          onUploadError?.(`Failed to upload photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      const allPhotos = [...uploadedPhotos, ...uploadedUrls];
      setUploadedPhotos(allPhotos);
      setSelectedFiles([]);
      setPreviewUrls([]);
      setUploadProgress(0);
      
      onUploadComplete(allPhotos);
    } catch (error) {
      console.error('Error uploading photos:', error);
      onUploadError?.(`Failed to upload photos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = (photoUrl: string) => {
    const updatedPhotos = uploadedPhotos.filter(url => url !== photoUrl);
    setUploadedPhotos(updatedPhotos);
    onUploadComplete(updatedPhotos);
  };

  const handleUploadClick = async () => {
    await uploadPhotos();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Photos ({uploadedPhotos.length + selectedFiles.length}/{maxPhotos})
        </label>
        
        {/* Existing Photos */}
        {uploadedPhotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {uploadedPhotos.map((photoUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={photoUrl}
                  alt={`Property photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                {!disabled && (
                  <button
                    onClick={() => deletePhoto(photoUrl)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Preview Selected Files */}
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {previewUrls.map((previewUrl, index) => (
              <div key={index} className="relative">
                <img
                  src={previewUrl}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 opacity-50"
                />
                <button
                  onClick={() => removeSelectedFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  title="Remove"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded">Pending</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">Uploading... {Math.round(uploadProgress)}%</p>
          </div>
        )}

        {/* File Input */}
        {!disabled && (uploadedPhotos.length + selectedFiles.length) < maxPhotos && (
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              disabled={uploading}
            >
              <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Photos
            </button>
            {selectedFiles.length > 0 && (
              <button
                type="button"
                onClick={handleUploadClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Photo(s)`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
