'use client';

import React, { useState, useRef } from 'react';
import { compressImage } from '@/lib/utils/storage';

interface MediaUploadProps {
  type: 'image' | 'video';
  maxFiles?: number;
  onUploadComplete: (urls: string[]) => void;
  existingUrls?: string[];
  label?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  type,
  maxFiles = 10,
  onUploadComplete,
  existingUrls = [],
  label,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingUrls);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length === 0) return;

    // Check total file count
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file types
    const validFiles = selectedFiles.filter((file) => {
      if (type === 'image') {
        return file.type.startsWith('image/');
      } else {
        return file.type.startsWith('video/');
      }
    });

    if (validFiles.length !== selectedFiles.length) {
      alert(`Please select only ${type} files`);
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);

    // Create previews
    const newPreviews = await Promise.all(
      validFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );

    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      onUploadComplete(uploadedUrls);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const token = localStorage.getItem('auth_token');
      const uploaded: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Compress images before upload
        let fileToUpload = file;
        if (type === 'image') {
          try {
            fileToUpload = await compressImage(file);
          } catch (error) {
            console.error('Compression failed, using original:', error);
          }
        }

        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('folder', 'properties');

        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const data = await response.json();
        if (data.success) {
          uploaded.push(data.url);
        }

        setProgress(((i + 1) / files.length) * 100);
      }

      const allUrls = [...uploadedUrls, ...uploaded];
      setUploadedUrls(allUrls);
      setFiles([]);
      setPreviews([]);
      onUploadComplete(allUrls);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeUploaded = (index: number) => {
    const newUrls = uploadedUrls.filter((_, i) => i !== index);
    setUploadedUrls(newUrls);
    onUploadComplete(newUrls);
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {maxFiles > 1 && `(Max ${maxFiles})`}
        </label>
      )}

      {/* Uploaded files */}
      {uploadedUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedUrls.map((url, index) => (
            <div key={index} className="relative group">
              {type === 'image' ? (
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={url}
                  className="w-full h-32 object-cover rounded-lg"
                  controls
                />
              )}
              <button
                onClick={() => removeUploaded(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Preview files */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              {type === 'image' ? (
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={preview}
                  className="w-full h-32 object-cover rounded-lg"
                  controls
                />
              )}
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File input */}
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={type === 'image' ? 'image/*' : 'video/*'}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id={`${type}-upload`}
        />
        <label
          htmlFor={`${type}-upload`}
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add {type === 'image' ? 'Images' : 'Videos'}
        </label>

        {files.length > 0 && (
          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading ? `Uploading... ${Math.round(progress)}%` : `Upload ${files.length} ${files.length === 1 ? 'file' : 'files'}`}
          </button>
        )}
      </div>

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

