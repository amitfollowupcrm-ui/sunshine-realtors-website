# 🚀 Deploy Sunshine Realtors to Vercel (Full Stack)

Since Firebase Hosting only supports static sites, we need to deploy the **full Next.js application** (with API routes) to **Vercel** for complete functionality.

## ✅ Current Status

- ✅ **Frontend:** Deployed to Firebase Hosting (static) - https://sunshine-realtors.web.app
- ✅ **Database:** Supabase PostgreSQL - Connected and schema synced
- ✅ **Cache:** Upstash Redis - Configured
- ⏳ **API Routes:** Need to deploy to Vercel

## 🎯 Solution: Deploy Full Stack to Vercel

Vercel supports:
- ✅ Next.js App Router
- ✅ API Routes (serverless functions)
- ✅ Server Components
- ✅ Database connections
- ✅ Environment variables
- ✅ Automatic HTTPS
- ✅ Global CDN

## 📋 Deployment Steps

### Step 1: Create Vercel Account & Project

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub, GitLab, or Bitbucket
3. Click "New Project"
4. Import your repository or upload the project

### Step 2: Configure Next.js for Vercel

The `next.config.js` needs to be updated for Vercel deployment (non-static):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'output: export' for Vercel (allows API routes)
  // output: 'export', // ❌ Comment this out
  
  images: { 
    unoptimized: false, // ✅ Vercel has image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.upstash.io',
      },
      // Add your image CDN domains
    ],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
  },
  
  reactStrictMode: true,
};

module.exports = nextConfig;
```

### Step 3: Set Environment Variables in Vercel

In Vercel Dashboard → Project Settings → Environment Variables, add:

```env
# Database
DATABASE_URL=postgresql://postgres:@16Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres

# Redis Cache
REDIS_URL=rediss://default:AWt7AAIncDI3ZTg5ODZkNDFhMjg0NjQwODBiMDQ5NWIzYjAzYzY2NnAyMjc1MTU@outgoing-mole-27515.upstash.io:6379

# JWT Secrets
JWT_SECRET=your-production-jwt-secret-change-this
JWT_REFRESH_SECRET=your-production-jwt-refresh-secret-change-this
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Application
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-project.vercel.app/api
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

### Step 4: Deploy

Vercel will automatically:
1. Detect Next.js
2. Install dependencies
3. Build the project
4. Deploy to global CDN

## 🔄 Alternative: Quick Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd sunshine-realtors-website
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: sunshine-realtors
# - Directory: ./
# - Override settings? No

# Set environment variables
vercel env add DATABASE_URL
vercel env add REDIS_URL
vercel env add JWT_SECRET
# ... add all env vars
```

## 🎉 After Deployment

You'll get:
- **Production URL:** `https://your-project.vercel.app`
- **API Routes:** `https://your-project.vercel.app/api/*`
- **Full functionality:** Database, authentication, property listings, etc.

## 📊 Benefits of Vercel

1. **Serverless API Routes:** All `/app/api/**/route.ts` files become serverless functions
2. **Auto-scaling:** Handles traffic spikes automatically
3. **Edge Network:** Global CDN for fast loading
4. **Preview Deployments:** Every commit gets a preview URL
5. **Zero Config:** Works out of the box with Next.js

## 🔗 Update Frontend API URLs

After deploying to Vercel, update your frontend components to use the Vercel API URL instead of relative paths.

## 💡 Optional: Keep Firebase for Static Assets

You can still use Firebase Hosting for static assets (images, etc.) and Vercel for the dynamic app. However, a single Vercel deployment is simpler.

