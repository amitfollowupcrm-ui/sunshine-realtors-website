# CORS Fix Instructions

## Problem
Preview deployments are making API calls to the production URL (`https://sunshine-realtors-website.vercel.app/api/...`) instead of using relative URLs, causing CORS errors.

## Root Cause
The `NEXT_PUBLIC_API_URL` environment variable is set to the production URL in Vercel, causing all deployments (including preview deployments) to call the production API.

## Solution
Remove the `NEXT_PUBLIC_API_URL` environment variable from Vercel so the code defaults to relative URLs (`/api`), which automatically use the same origin as the current page.

## Steps to Fix

### Option 1: Remove Environment Variable (Recommended)
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `NEXT_PUBLIC_API_URL`
3. Delete it (or set it to empty/blank)
4. Redeploy the application

### Option 2: Keep Relative URLs Only (Code Already Supports This)
The code already defaults to `/api` if `NEXT_PUBLIC_API_URL` is not set:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
```

## Why This Works
- Relative URLs (`/api`) automatically use the same origin as the current page
- Preview deployments will call their own API routes
- Production will call production API routes
- No CORS issues because same-origin requests don't require CORS headers
- Works for all environments (local, preview, production)

## Verification
After removing the environment variable:
1. Check that registration works on preview deployments
2. Check that login works on preview deployments
3. Verify API calls go to the same origin (check Network tab in browser DevTools)
