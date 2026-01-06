# 🚀 Live Deployment Guide - Sunshine Realtors Group

## Free Stack Deployment
- **Frontend:** Firebase Hosting (FREE)
- **Database:** Supabase PostgreSQL (FREE)
- **Cache:** Upstash Redis (FREE)

---

## 📋 Prerequisites Checklist

- [ ] Node.js 20+ installed
- [ ] Firebase account (free)
- [ ] Supabase account (free)
- [ ] Upstash account (free)
- [ ] Git repository (optional but recommended)

---

## Step 1: Setup Supabase PostgreSQL (Database)

### 1.1 Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for free account
3. Click "New Project"
4. Fill in:
   - **Project Name:** `sunshine-realtors`
   - **Database Password:** (generate strong password, SAVE IT!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free

### 1.2 Get Database Connection String
1. Go to **Project Settings** → **Database**
2. Under **Connection string**, copy the **URI** connection string
3. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
4. Save this for later!

### 1.3 Setup Database Schema
1. Go to **SQL Editor** in Supabase dashboard
2. We'll use Prisma migrations (see Step 3.2)

---

## Step 2: Setup Upstash Redis (Cache)

### 2.1 Create Upstash Account
1. Go to [https://upstash.com](https://upstash.com)
2. Sign up for free account
3. Click **"Create Database"**

### 2.2 Create Redis Database
1. **Name:** `sunshine-realtors-redis`
2. **Type:** Regional (choose closest region)
3. **Plan:** Free (10K commands/day)
4. Click **"Create"**

### 2.3 Get Redis Connection Details
1. After creation, click on your database
2. Copy the **Redis URL** (looks like: `redis://default:xxxxx@xxxxx.upstash.io:6379`)
3. Save this for later!

---

## Step 3: Setup Firebase Hosting

### 3.1 Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 3.2 Login to Firebase
```bash
firebase login
```
This will open browser for authentication.

### 3.3 Create Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. **Project name:** `sunshine-realtors`
4. **Google Analytics:** Optional (can disable)
5. Click **"Create project"**

### 3.4 Initialize Firebase in Project
```bash
cd sunshine-realtors-website
firebase init hosting
```

**Select options:**
- ✅ Use an existing project → Select your Firebase project
- ✅ Public directory: `out` (Next.js export directory)
- ✅ Single-page app: **Yes**
- ✅ Set up automatic builds: **No** (for now)
- ✅ Overwrite index.html: **No**

### 3.5 Update Firebase Project ID
Edit `.firebaserc`:
```json
{
  "projects": {
    "default": "your-actual-firebase-project-id"
  }
}
```

---

## Step 4: Configure Environment Variables

### 4.1 Create `.env.local` file
Create `.env.local` in project root:

```env
# Database - Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Redis - Upstash
REDIS_URL="redis://default:[YOUR-TOKEN]@xxxxx.upstash.io:6379"

# JWT Secrets (generate random strings)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-this-in-production"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# Next.js
NEXT_PUBLIC_API_URL="/api"
NEXT_PUBLIC_APP_URL="https://your-project-id.web.app"

# App Environment
APP_ENV="production"
```

### 4.2 Generate JWT Secrets
```bash
# Generate random secrets (run these commands)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Replace `JWT_SECRET` and `JWT_REFRESH_SECRET` with generated values.

---

## Step 5: Setup Database Schema

### 5.1 Install Dependencies
```bash
npm install
```

### 5.2 Generate Prisma Client
```bash
npm run db:generate
```

### 5.3 Push Database Schema
```bash
npm run db:push
```

Or use migrations:
```bash
npm run db:migrate
```

This will create all tables in your Supabase database.

### 5.4 Verify Database
Go to Supabase → **Table Editor** and verify tables are created.

---

## Step 6: Test Locally

### 6.1 Test Database Connection
```bash
npm run dev
```

Visit `http://localhost:3000` and check console for connection errors.

### 6.2 Test Redis Connection
Check if Redis is working by testing a route that uses cache.

---

## Step 7: Build for Production

### 7.1 Update Next.js Config
The `next.config.js` is already configured for static export.

### 7.2 Build the Project
```bash
npm run build
```

This creates `out/` directory with static files.

### 7.3 Test Build Locally (Optional)
```bash
npx serve out
```

Visit `http://localhost:3000` to test static build.

---

## Step 8: Deploy to Firebase Hosting

### 8.1 Deploy
```bash
firebase deploy --only hosting
```

### 8.2 Your Site is Live! 🎉
Your site will be available at:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

---

## Step 9: Setup Custom Domain (Optional)

1. Go to Firebase Console → **Hosting**
2. Click **"Add custom domain"**
3. Follow instructions to verify domain
4. Update DNS records as instructed

---

## Step 10: Create API Routes (Important!)

### ⚠️ Static Export Limitation

Since we're using static export (`output: 'export'`), API routes won't work in Firebase Hosting. You have two options:

### Option A: Use Vercel for API Routes (Recommended)
1. Deploy to Vercel (also free)
2. Use Vercel for API routes (`/api/*`)
3. Use Firebase for frontend static hosting

### Option B: Use Firebase Functions (Paid after free tier)
1. Setup Firebase Functions
2. Deploy API routes as functions
3. Cost: $0-5/month for low usage

### Option C: Separate Backend Server
Deploy API separately to:
- Railway (free tier)
- Render (free tier)
- Fly.io (free tier)

---

## 🔧 Troubleshooting

### Database Connection Issues
- Check Supabase connection string
- Verify password is correct
- Check if database is paused (Supabase pauses after inactivity)
- Use connection pooling: add `?pgbouncer=true` to connection string

### Redis Connection Issues
- Verify Redis URL from Upstash dashboard
- Check if database is active
- Verify region matches

### Build Errors
- Clear `.next` folder: `rm -rf .next out`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 20+)

### Deployment Errors
- Check Firebase CLI is logged in: `firebase login`
- Verify project ID in `.firebaserc`
- Check `firebase.json` configuration

---

## 📊 Monitoring

### Firebase Hosting
- Go to Firebase Console → Hosting
- View traffic, errors, and performance

### Supabase
- Go to Supabase Dashboard
- Monitor database usage, queries, and storage

### Upstash
- Go to Upstash Dashboard
- Monitor command usage and limits

---

## 🔐 Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable Supabase Row Level Security (RLS)
- [ ] Set up Supabase API keys properly
- [ ] Configure CORS correctly
- [ ] Use environment variables (never commit secrets)
- [ ] Enable HTTPS (automatic with Firebase)

---

## 💰 Cost Monitoring

### Free Tier Limits

**Firebase Hosting:**
- 10 GB storage
- 360 MB/day bandwidth
- ✅ Generous for 100 users

**Supabase:**
- 500 MB database storage
- 2 GB bandwidth
- ✅ Good for testing

**Upstash:**
- 10K commands/day
- ✅ Sufficient for 100 users

**Monitor Usage:**
- Check dashboards regularly
- Set up alerts if possible
- Upgrade before hitting limits

---

## 🚀 Next Steps After Deployment

1. **Create Admin User**
   - Use Supabase SQL Editor to insert admin user
   - Or create via API after deployment

2. **Test All Features**
   - User registration/login
   - Property listings
   - Search functionality
   - Admin panel

3. **Setup Monitoring**
   - Firebase Analytics
   - Error tracking
   - Performance monitoring

4. **SEO Setup**
   - Verify meta tags
   - Submit sitemap
   - Setup Google Search Console

---

## 📝 Quick Reference

### Important URLs
- **Firebase Console:** https://console.firebase.google.com
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Upstash Dashboard:** https://console.upstash.com

### Common Commands
```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting

# Database
npm run db:push          # Push schema
npm run db:studio        # Open Prisma Studio
npm run db:migrate       # Run migrations

# Development
npm run dev              # Start dev server
```

---

## 🎉 Congratulations!

Your Sunshine Realtors Group platform is now live! 🚀

**Your live URL:** `https://your-project-id.web.app`

**Total Cost:** $0/month (for 100 users)

---

**Need Help?** Check the documentation or Firebase/Supabase support.

---

**Last Updated:** January 2025

