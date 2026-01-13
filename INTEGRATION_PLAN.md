# 🔗 Website-CRM Integration Plan

## Goal
Connect Sunshine Realtors Website users to the Property Consultant CRM, displaying website users in the CRM user management panel with their statistics.

## Architecture

**Website (Sunshine Realtors)**
- Database: Supabase (PostgreSQL)
- Framework: Next.js
- API: REST endpoints

**CRM (Property Consultant)**
- Database: Firebase (Firestore)
- Framework: React
- Frontend only

## Integration Approach

### 1. API Endpoint (Website) ✅
- **Endpoint**: `/api/users/with-stats`
- **Purpose**: Fetch website users with statistics
- **Authentication**: Admin access or API key
- **Returns**: Users with statistics (properties viewed, uploaded, cart, purchased, etc.)

### 2. Integration Service (CRM)
- **File**: `services/websiteIntegration.ts` (new)
- **Purpose**: Fetch users from website API
- **Authentication**: API key or token

### 3. UI Component Update (CRM)
- **File**: `components/AdminUsers.tsx` (update)
- **Purpose**: Display website users alongside CRM users
- **Features**: 
  - Tab or section for "Website Users"
  - Display user details and statistics
  - Show properties viewed, uploaded, cart, purchased

## Statistics to Display

1. **Properties Viewed**: Count of properties viewed (requires view tracking)
2. **Properties Uploaded**: Count of properties listed by user
3. **Properties in Cart**: Count of items in cart
4. **Properties in Favorites**: Count of favorited properties
5. **Properties in Shortlist**: Count of shortlisted properties
6. **Properties Purchased**: Count of purchased properties
7. **Properties Owned**: Count of properties owned

## Implementation Steps

1. ✅ Create API endpoint `/api/users/with-stats` in website
2. ⏳ Create integration service in CRM
3. ⏳ Update AdminUsers component to fetch and display website users
4. ⏳ Add authentication/API key configuration
5. ⏳ Test integration

## Authentication

For CRM to access website API:
- Option 1: API Key (simple, recommended)
- Option 2: JWT Token (more secure)
- Option 3: Public endpoint with rate limiting (not recommended)

## Environment Variables

**Website (.env.local)**:
```
CRM_API_KEY=your-secret-api-key-here
```

**CRM (Firebase Config or env)**:
```
NEXT_PUBLIC_WEBSITE_API_URL=https://sunshine-realtors-website.vercel.app/api
WEBSITE_API_KEY=your-secret-api-key-here
```
