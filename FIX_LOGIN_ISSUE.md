# 🔧 Fix Login Issue - Database Connection

## Problem
Login is failing with 401 error on production. Password is correct but authentication fails.

## Likely Cause
Database connection issue on Vercel - the `DATABASE_URL` environment variable might not be set correctly.

## Solution

### Step 1: Check Vercel Environment Variables

Run this command to check if DATABASE_URL is set:

```bash
cd sunshine-realtors-website
vercel env ls
```

### Step 2: Set DATABASE_URL on Vercel

If DATABASE_URL is missing or incorrect, set it:

```bash
vercel env add DATABASE_URL production
```

When prompted, enter your Supabase connection string:

**Option 1: Direct Connection (for testing):**
```
postgresql://postgres:@16Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres
```

**Option 2: Connection Pooler (Recommended for production):**
```
postgresql://postgres.cgodlegdxrwhpjevxlel:@16Supabase@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Step 3: Verify Other Required Environment Variables

Make sure these are also set on Vercel:

```bash
vercel env add JWT_SECRET production
vercel env add JWT_REFRESH_SECRET production
vercel env add JWT_EXPIRES_IN production
vercel env add JWT_REFRESH_EXPIRES_IN production
```

### Step 4: Redeploy

After setting environment variables, redeploy:

```bash
vercel --prod
```

## Quick Fix Script

I've updated the login error handling to show more specific error messages. The next deployment will reveal the actual error.

## Test After Fix

1. Go to: `https://sunshine-realtors-website.vercel.app/admin/login`
2. Login with:
   - Email: `amitfollowupcrm@gmail.com`
   - Password: `SunshineAdmin@2024!`
3. Check browser console for detailed error if it still fails

## If Still Failing

Check Vercel logs for detailed error:

```bash
vercel logs https://sunshine-realtors-website.vercel.app --follow
```

Look for database connection errors or authentication errors.


