# 🔧 Login/Registration Fix Guide

## 🐛 Issue Identified

**Error**: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

**Problem**: The API endpoint `/api/auth/register` is returning HTML (homepage) instead of JSON response. This happens when:
1. API route is not recognized by Next.js routing
2. Database connection fails and Next.js returns an HTML error page
3. The route is being redirected or intercepted incorrectly

## 🔍 Root Cause

When accessing `https://sunshinerealtorsgroup.com/api/auth/register` directly in browser, it shows the homepage instead of a JSON error. This suggests:

1. **API routes are not being recognized** - Next.js is treating `/api/auth/register` as a regular page route
2. **Possible database connection issues** - If the database connection fails during API execution, Next.js might return an HTML error page
3. **Vercel deployment configuration** - API routes might not be properly configured in production

## ✅ Solutions

### Solution 1: Check Database Connection

The API route requires a database connection. If the database is not accessible, the route will fail.

**Check**:
- Database URL in environment variables
- Database is accessible from Vercel
- Prisma client is properly generated

### Solution 2: Verify API Route Exports

Ensure the route file exports the correct HTTP methods:

```typescript
// app/api/auth/register/route.ts
export async function POST(request: NextRequest) {
  // ... registration logic
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}
```

### Solution 3: Check Vercel Deployment

1. **Verify API routes are deployed**:
   - Go to Vercel dashboard
   - Check deployment logs
   - Verify `app/api` directory is included in build

2. **Check Environment Variables**:
   - Database URL is set in Vercel
   - JWT secrets are configured
   - All required environment variables are present

3. **Check Build Logs**:
   - Look for errors during build
   - Verify Prisma client generation succeeded
   - Check for any API route compilation errors

### Solution 4: Test API Route Directly

Test the API route using curl or Postman:

```bash
# Test registration endpoint
curl -X POST https://sunshinerealtorsgroup.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "fullName": "Test User"
  }'
```

Expected: JSON response (success or error)
If HTML is returned: API route is not working

## 🔧 Quick Fixes

### Fix 1: Add Error Handling for HTML Responses

Update `useAuth.ts` to handle HTML responses:

```typescript
const register = async (userData: {...}) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response:', text.substring(0, 200));
    throw new Error('Server error: API endpoint returned invalid response');
  }

  // ... rest of the code
};
```

### Fix 2: Verify Route File Structure

Ensure the route file is in the correct location:
```
app/
  api/
    auth/
      register/
        route.ts  ← Must be named route.ts
```

### Fix 3: Check Middleware

The middleware might be interfering with API routes. Check `middleware.ts`:

- Ensure `/api/auth/register` is in `publicRoutes`
- Middleware should not redirect API routes

## 🧪 Testing Steps

1. **Test locally**:
   ```bash
   npm run dev
   # Try registering from http://localhost:3000/register
   ```

2. **Test API directly**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test1234","fullName":"Test"}'
   ```

3. **Check browser network tab**:
   - Open DevTools → Network
   - Try to register
   - Check the `/api/auth/register` request
   - Verify response is JSON, not HTML

4. **Check server logs**:
   - Look for errors in Vercel logs
   - Check for database connection errors
   - Verify API route is being hit

## 📋 Checklist

- [ ] Database connection is working
- [ ] Environment variables are set in Vercel
- [ ] API route file exists at correct path
- [ ] Route exports POST method correctly
- [ ] Middleware allows `/api/auth/register`
- [ ] Build completes without errors
- [ ] API route returns JSON (not HTML)
- [ ] Error handling is in place

## 🚨 Common Issues

1. **Database Connection**: If database is not accessible, API will fail
2. **Missing Environment Variables**: JWT secrets, database URL must be set
3. **Build Errors**: API routes won't work if build fails
4. **Middleware Interference**: Middleware redirecting API routes
5. **Route Not Found**: File path or naming incorrect

## 📝 Next Steps

1. Check Vercel deployment logs for errors
2. Verify database connection is working
3. Test API endpoint directly with curl/Postman
4. Check browser network tab for actual API response
5. Review Vercel environment variables
6. Verify Prisma client is generated correctly
