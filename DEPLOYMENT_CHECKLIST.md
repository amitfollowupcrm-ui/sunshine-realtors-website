# 🚀 Deployment Checklist - Step by Step

## ✅ Step 1: Build Issues - COMPLETED
- ✅ Fixed localStorage SSR errors
- ✅ Fixed database prerendering issues
- ✅ Build now passes successfully

## 📋 Step 2: Supabase Configuration

### A. Create Supabase Account & Project
1. Go to https://supabase.com
2. Sign up/Login
3. Click "New Project"
4. Fill in:
   - Project Name: `sunshine-realtors`
   - Database Password: (create a strong password, save it!)
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait 2-3 minutes for setup

### B. Get Credentials
1. Go to Settings → API
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

### C. Create Storage Bucket
1. Go to Storage (left sidebar)
2. Click "New bucket"
3. Name: `property-photos` (exact match)
4. Check "Public bucket"
5. Click "Create bucket"

### D. Set Environment Variables Locally
1. Open `.env.local` file (already exists)
2. Add these lines:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Replace with your actual values from Step B

## 📋 Step 3: Test Locally
1. Restart dev server: `npm run dev`
2. Go to `http://localhost:3000/dashboard/properties`
3. Click "+ Add Property"
4. Try uploading a photo
5. Verify it appears in Supabase Storage dashboard

## 📋 Step 4: Vercel Deployment

### A. Prepare Repository
1. Commit all changes:
   ```bash
   git add .
   git commit -m "Add Property CRM integration with Supabase"
   git push
   ```

### B. Connect to Vercel
1. Go to https://vercel.com
2. Sign up/Login (use GitHub if possible)
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: `sunshine-realtors-website` (if in monorepo)
   - Build Command: `npm run build`
   - Output Directory: `.next`

### C. Set Environment Variables in Vercel
1. In project settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `DATABASE_URL` = (already exists, keep it)
   - `REDIS_URL` = (already exists, keep it)
   - Any other existing env vars

### D. Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Check deployment logs for errors
4. Visit your live URL!

## ✅ Verification Steps

After deployment, verify:
- [ ] Site loads correctly
- [ ] Can login
- [ ] Can navigate to `/dashboard/properties`
- [ ] "+ Add Property" button works
- [ ] Can upload photos
- [ ] Photos appear in Supabase Storage
- [ ] Properties are created successfully

## 🆘 Troubleshooting

### Build fails on Vercel
- Check environment variables are set
- Check build logs for errors
- Ensure all dependencies are in package.json

### Photos not uploading
- Verify Supabase env vars in Vercel
- Check browser console for errors
- Verify storage bucket name is `property-photos`

### Database connection errors
- Verify DATABASE_URL is correct
- Check database credentials
- Ensure database is accessible from Vercel's IPs
