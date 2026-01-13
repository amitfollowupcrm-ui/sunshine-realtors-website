# Supabase Setup Instructions

## Overview
This document explains how to set up Supabase for property photo storage in the Sunshine Realtors website.

## Prerequisites
1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created

## Setup Steps

### 1. Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon/public key** (for client-side usage)

### 2. Set Environment Variables

Add the following environment variables to your `.env.local` file (for local development) and Vercel (for production):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

For server-side operations (optional, for advanced features):
```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Create Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Create a bucket named: `property-photos`
4. Set it to **Public bucket** (if you want public access) OR **Private bucket** (if you want authenticated access only)
5. Click **Create bucket**

### 4. Configure Storage Policies (for Private Buckets)

If you created a private bucket, you need to set up storage policies:

1. Go to **Storage** → **Policies** for the `property-photos` bucket
2. Create a policy to allow authenticated users to upload:
   - Policy name: `Allow authenticated uploads`
   - Allowed operation: `INSERT`
   - Target roles: `authenticated`
   - USING expression: `auth.role() = 'authenticated'`
   - WITH CHECK expression: `auth.role() = 'authenticated'`

3. Create a policy to allow authenticated users to read:
   - Policy name: `Allow authenticated reads`
   - Allowed operation: `SELECT`
   - Target roles: `authenticated`, `anon` (if public access needed)
   - USING expression: `true` (or customize based on your needs)

### 5. Fallback Behavior

If Supabase is not configured (environment variables not set), the system will automatically fall back to base64 encoding for photos. This allows the application to work even without Supabase setup, though base64 storage is less efficient for large images.

## Testing

After setup, test the photo upload functionality:
1. Go to `/dashboard/properties`
2. Click "Add Property"
3. Try uploading a photo
4. Verify the photo is stored in Supabase Storage (check the Storage section in Supabase dashboard)

## Notes

- Photos are stored in the path: `property-photos/{propertyId}/{timestamp}-{random}.{extension}`
- For temporary uploads (before property creation), photos are stored in `property-photos/temp/`
- Maximum file size: 10MB per photo
- Supported formats: JPG, PNG, GIF, WebP
