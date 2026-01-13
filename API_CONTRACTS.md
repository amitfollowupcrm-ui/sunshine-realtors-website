# 🔌 Sunshine Realtors Group - API Contracts

## Overview

RESTful API specification for Sunshine Realtors Group platform. All endpoints require authentication unless specified as public.

**Base URL:** `https://api.sunshinerealtors.com/v1`

**Authentication:** Bearer Token (JWT)

---

## Authentication Endpoints

### POST /api/auth/login
Login user and receive access token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "BUYER"
    },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "expiresIn": 3600
  }
}
```

**Errors:**
- `401` - Invalid credentials
- `429` - Too many login attempts

---

### POST /api/auth/register
Register new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+91-9876543210",
  "role": "BUYER"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "...",
    "refreshToken": "..."
  },
  "message": "User registered successfully"
}
```

---

### POST /api/auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_access_token",
    "expiresIn": 3600
  }
}
```

---

### GET /api/auth/me
Get current authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "BUYER",
    "profile": { ... }
  }
}
```

---

## Property Endpoints

### GET /api/properties/search
Search and filter properties (Public).

**Query Parameters:**
```
?category=BUY&city=Delhi&priceMin=5000000&priceMax=10000000
&bedrooms=2,3&propertyType=APARTMENT&sortBy=price_asc
&page=1&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": "uuid",
        "title": "2 BHK Apartment in Dwarka",
        "slug": "2-bhk-apartment-dwarka-123",
        "category": "BUY",
        "propertyType": "APARTMENT",
        "city": "Delhi",
        "locality": "Dwarka",
        "price": 7500000,
        "pricePerUnit": 6500,
        "builtUpArea": 1155,
        "bedrooms": 2,
        "bathrooms": 2,
        "primaryImageUrl": "https://...",
        "isVerified": true,
        "viewCount": 245
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1250,
    "totalPages": 63,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### GET /api/properties/:id
Get property details (Public).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "2 BHK Apartment in Dwarka",
    "description": "...",
    "slug": "2-bhk-apartment-dwarka-123",
    "category": "BUY",
    "propertyType": "APARTMENT",
    "location": {
      "city": "Delhi",
      "locality": "Dwarka",
      "sector": "Sector 19",
      "addressLine1": "ABC Apartments",
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "pricing": {
      "price": 7500000,
      "pricePerUnit": 6500,
      "negotiable": true,
      "maintenanceCharges": 3000
    },
    "details": {
      "builtUpArea": 1155,
      "carpetArea": 950,
      "bedrooms": 2,
      "bathrooms": 2,
      "furnishingStatus": "SEMI_FURNISHED",
      "amenities": ["gym", "pool", "security"]
    },
    "media": {
      "imageUrls": ["https://..."],
      "videoUrls": [],
      "floorPlanUrls": ["https://..."]
    },
    "owner": {
      "id": "uuid",
      "fullName": "Owner Name"
    },
    "dealer": {
      "id": "uuid",
      "fullName": "Dealer Name",
      "phone": "+91-..."
    },
    "status": "ACTIVE",
    "isVerified": true,
    "viewCount": 245,
    "inquiryCount": 12,
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

---

### POST /api/properties
Create new property (Authenticated - Seller/Owner/Dealer).

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "title": "2 BHK Apartment in Dwarka",
  "description": "Spacious 2 BHK...",
  "category": "BUY",
  "propertyType": "APARTMENT",
  "location": {
    "state": "Delhi",
    "city": "Delhi",
    "locality": "Dwarka",
    "sector": "Sector 19",
    "addressLine1": "ABC Apartments",
    "pincode": "110075",
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "pricing": {
    "price": 7500000,
    "pricePerUnit": 6500,
    "negotiable": true,
    "maintenanceCharges": 3000
  },
  "details": {
    "builtUpArea": 1155,
    "bedrooms": 2,
    "bathrooms": 2,
    "furnishingStatus": "SEMI_FURNISHED",
    "amenities": ["gym", "pool"]
  },
  "media": {
    "imageUrls": ["https://..."]
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "2-bhk-apartment-dwarka-123",
    "status": "PENDING_VERIFICATION",
    ...
  },
  "message": "Property created successfully. Pending verification."
}
```

---

### PUT /api/properties/:id
Update property (Authenticated - Owner/Dealer/Admin).

**Headers:** `Authorization: Bearer <token>`

**Request:** Same as POST, with partial updates allowed.

**Response (200):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Property updated successfully"
}
```

---

### DELETE /api/properties/:id
Delete property (Authenticated - Owner/Admin).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

## Lead Endpoints

### POST /api/leads
Create lead/inquiry (Public or Authenticated).

**Request:**
```json
{
  "propertyId": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "inquiryType": "BUY",
  "message": "Interested in viewing this property"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "NEW",
    "assignedTo": null,
    ...
  },
  "message": "Lead created successfully"
}
```

---

### GET /api/leads
Get leads (Authenticated - Dealer/Admin).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```
?status=NEW&assignedTo=uuid&page=1&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "leads": [ ... ]
  },
  "pagination": { ... }
}
```

---

### PUT /api/leads/:id
Update lead status (Authenticated - Dealer/Admin).

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "status": "CONTACTED",
  "notes": "Called customer, interested in viewing",
  "nextFollowupAt": "2025-01-20T10:00:00Z"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Lead updated successfully"
}
```

---

### POST /api/leads/:id/assign
Assign lead to dealer (Authenticated - Admin/Distributor).

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "dealerId": "uuid",
  "priority": "high"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Lead assigned successfully"
}
```

---

## CRM Integration Endpoints

### POST /api/crm/sync
Manually trigger CRM sync (Authenticated - Admin).

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "entityType": "LEAD",
  "entityId": "uuid",
  "force": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "syncLogId": "uuid",
    "status": "PENDING",
    "message": "Sync queued"
  }
}
```

---

### POST /api/crm/webhook
Receive webhook from external CRM (Authenticated via secret).

**Headers:** `X-CRM-Secret: <secret>`

**Request:**
```json
{
  "event": "lead.updated",
  "entityType": "LEAD",
  "entityId": "external_crm_id",
  "data": {
    "status": "CONVERTED",
    "notes": "..."
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Webhook processed"
}
```

---

### GET /api/crm/sync-logs
Get CRM sync logs (Authenticated - Admin).

**Query Parameters:**
```
?status=FAILED&entityType=LEAD&page=1&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "entityType": "LEAD",
        "entityId": "uuid",
        "status": "FAILED",
        "errorMessage": "...",
        "retryCount": 2,
        "createdAt": "..."
      }
    ]
  },
  "pagination": { ... }
}
```

---

## Search Endpoints

### GET /api/search/autocomplete
Autocomplete search (Public).

**Query Parameters:**
```
?q=delhi&type=city|locality|project
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "type": "city",
        "text": "Delhi",
        "value": "Delhi",
        "count": 1250
      },
      {
        "type": "locality",
        "text": "Dwarka, Delhi",
        "value": "Dwarka",
        "count": 342
      }
    ]
  }
}
```

---

## Dealer Endpoints

### GET /api/dealers/:id/performance
Get dealer performance metrics (Authenticated - Dealer/Admin).

**Query Parameters:**
```
?periodStart=2025-01-01&periodEnd=2025-01-31
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "dealerId": "uuid",
    "period": {
      "start": "2025-01-01",
      "end": "2025-01-31"
    },
    "metrics": {
      "totalLeads": 45,
      "leadsContacted": 42,
      "leadsConverted": 12,
      "propertiesListed": 8,
      "propertiesSold": 6,
      "totalCommission": 150000,
      "averageRating": 4.5,
      "averageResponseTime": 15
    }
  }
}
```

---

## Admin Endpoints

### GET /api/admin/properties/moderation
Get properties pending moderation (Authenticated - Admin/Internal Ops).

**Query Parameters:**
```
?status=PENDING_VERIFICATION&page=1&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "properties": [ ... ]
  },
  "pagination": { ... }
}
```

---

### POST /api/admin/properties/:id/moderate
Moderate property (Authenticated - Admin/Internal Ops).

**Request:**
```json
{
  "action": "APPROVE", // or "REJECT"
  "reason": "Property verified"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Property approved"
}
```

---

### GET /api/admin/analytics
Get analytics dashboard data (Authenticated - Admin).

**Query Parameters:**
```
?startDate=2025-01-01&endDate=2025-01-31&city=Delhi
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "traffic": {
      "totalViews": 125000,
      "uniqueVisitors": 35000,
      "pageViews": 450000
    },
    "conversions": {
      "totalLeads": 1250,
      "leadConversionRate": 3.5,
      "inquiryRate": 8.2
    },
    "properties": {
      "totalListed": 1250,
      "active": 980,
      "verified": 850
    },
    "dealers": {
      "total": 125,
      "active": 98,
      "topPerformers": [ ... ]
    }
  }
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` (422) - Input validation failed
- `UNAUTHORIZED` (401) - Authentication required
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `RATE_LIMIT_EXCEEDED` (429) - Too many requests
- `INTERNAL_ERROR` (500) - Server error

---

## Rate Limiting

- **Public endpoints:** 100 requests per 15 minutes per IP
- **Authenticated endpoints:** 1000 requests per 15 minutes per user
- **Admin endpoints:** 5000 requests per 15 minutes per user

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1641234567
```

---

**Last Updated:** January 2025
**API Version:** v1





