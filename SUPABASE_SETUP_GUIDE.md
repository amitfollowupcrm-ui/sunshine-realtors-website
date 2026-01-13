# 🚀 Supabase Setup Guide - Step by Step

This guide will walk you through setting up Supabase for property photo storage.

## Step 1: Create Supabase Account & Project

1. **Go to Supabase**: Visit https://supabase.com
2. **Sign Up/Login**: 
   - Click "Start your project" or "Sign In"
   - Sign up with GitHub, Google, or email
3. **Create New Project**:
   - Click "New Project"
   - **Organization**: Select or create an organization
   - **Project Name**: `sunshine-realtors` (or your preferred name)
   - **Database Password**: Create a strong password (save this securely!)
   - **Region**: Choose the closest region to your users (e.g., `Southeast Asia (Mumbai)` for India)
   - Click "Create new project"
   - ⏳ Wait 2-3 minutes for project to be created

## Step 2: Get Your Supabase Credentials

1. **Go to Project Settings**:
   - In your Supabase dashboard, click the ⚙️ **Settings** icon (bottom left)
   - Click **API** in the sidebar

2. **Copy Credentials**:
   - **Project URL**: Copy the "Project URL" (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key**: Copy the "anon public" key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role key** (optional): Copy the "service_role" key (keep this secret!)

## Step 3: Create Storage Bucket

1. **Go to Storage**:
   - In the left sidebar, click **Storage**

2. **Create New Bucket**:
   - Click **"New bucket"** button
   - **Bucket name**: `property-photos` (must match exactly)
   - **Public bucket**: ✅ Check this box (to allow public access to photos)
   - Click **"Create bucket"**

3. **Configure Bucket Policies** (if Public bucket was checked, policies are auto-created):
   - If you made it private, go to **Storage** → **Policies**
   - Click on `property-photos` bucket
   - Create policies as needed (public bucket should work automatically)

## Step 4: Set Environment Variables

### Option A: Local Development (.env.local)

1. **Create/Edit `.env.local` file** in the `sunshine-realtors-website` folder:
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   
   # Optional: For server-side operations
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

2. **Replace the values**:
   - Replace `your-project-id.supabase.co` with your actual Project URL
   - Replace `your-anon-key-here` with your actual anon public key
   - Replace `your-service-role-key-here` with your service_role key (optional)

### Option B: Vercel (for Production)

We'll set these up during Vercel deployment (Step 6)

## Step 5: Test the Configuration

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Test Photo Upload**:
   - Navigate to `http://localhost:3000/dashboard/properties`
   - Click "+ Add Property"
   - Try uploading a photo
   - Check the browser console for any errors
   - Check Supabase Storage dashboard to see if the photo was uploaded

## Step 6: Verify in Supabase Dashboard

1. **Check Storage**:
   - Go to **Storage** → **property-photos** in Supabase dashboard
   - You should see uploaded photos in folders like `property-photos/temp/` or `property-photos/{propertyId}/`

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Project URL copied
- [ ] anon public key copied
- [ ] Storage bucket `property-photos` created
- [ ] Bucket is set to Public
- [ ] Environment variables set in `.env.local`
- [ ] Development server running
- [ ] Photo upload tested successfully

## 🔒 Security Notes

- **anon/public key**: Safe to expose in client-side code (has Row Level Security)
- **service_role key**: Keep secret! Never commit to git. Only use server-side.
- **Public bucket**: Photos will be publicly accessible. Consider private bucket + signed URLs for sensitive data.

## 🆘 Troubleshooting

### "Supabase not configured" warning
- Check that environment variables are set correctly
- Restart the development server after adding env variables
- Check `.env.local` file exists in the correct location

### Photos not uploading
- Check browser console for errors
- Verify bucket name is exactly `property-photos`
- Verify bucket is set to Public
- Check network tab for failed requests

### Photos uploading but not displaying
- Check that bucket is Public
- Verify the photo URL is accessible
- Check browser console for CORS errors

## Next Steps

Once Supabase is configured, proceed to:
- ✅ Test the photo upload functionality
- ✅ Deploy to Vercel (set environment variables there too)
- ✅ Monitor storage usage in Supabase dashboard
