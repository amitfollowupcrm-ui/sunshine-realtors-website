# 🔗 CRM Integration Setup Guide

## Overview
This guide explains how to connect the Sunshine Realtors Website users to the Property Consultant CRM.

## ✅ Step 1: API Endpoint Created

**Endpoint**: `GET /api/users/with-stats`

**URL**: `https://sunshine-realtors-website.vercel.app/api/users/with-stats`

**Authentication**: 
- Admin users (ADMIN/SUPER_ADMIN role), OR
- API key in header: `x-api-key: YOUR_API_KEY`

**Response Format**:
```json
{
  "success": true,
  "users": [
    {
      "id": "user-id",
      "email": "user@example.com",
      "fullName": "User Name",
      "phone": "+1234567890",
      "role": "BUYER",
      "category": "BUYER",
      "isActive": true,
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLoginAt": "2024-01-15T00:00:00Z",
      "statistics": {
        "propertiesViewed": 0,
        "propertiesUploaded": 5,
        "propertiesAddedToCart": 3,
        "propertiesInFavorites": 8,
        "propertiesInShortlist": 2,
        "propertiesPurchased": 1,
        "propertiesOwned": 0
      }
    }
  ],
  "total": 1
}
```

## 📋 Next Steps

### Step 2: Configure API Key (Optional but Recommended)

**In Website (.env.local)**:
```env
CRM_API_KEY=your-secret-api-key-here-make-it-secure
```

**Add to Vercel Environment Variables**:
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Add: `CRM_API_KEY` = `your-secret-api-key`

### Step 3: Update CRM Integration Service

The CRM needs a service to fetch users from the website API. This will be implemented in the CRM codebase.

### Step 4: Update CRM User Management Component

The AdminUsers component in the CRM needs to:
1. Fetch users from website API
2. Display them in a separate section/tab
3. Show statistics for each user

## 🔒 Security

- Use API key for authentication
- Keep API key secret
- Consider rate limiting
- Monitor API usage

## 📊 Statistics Included

- **propertiesViewed**: Properties viewed by user (requires view tracking - currently 0)
- **propertiesUploaded**: Properties listed/uploaded by user
- **propertiesAddedToCart**: Properties currently in cart
- **propertiesInFavorites**: Properties in favorites
- **propertiesInShortlist**: Properties in shortlist
- **propertiesPurchased**: Properties purchased (status SOLD/RENTED)
- **propertiesOwned**: Properties owned by user

## 🚀 Testing

Test the endpoint:
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  https://sunshine-realtors-website.vercel.app/api/users/with-stats
```

Or with API key:
```bash
curl -H "x-api-key: YOUR_API_KEY" \
  https://sunshine-realtors-website.vercel.app/api/users/with-stats
```
