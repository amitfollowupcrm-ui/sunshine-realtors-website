# Property Management Features Guide

This document explains the new property management features added for sellers, dealers, and buyers.

## ✅ Features Implemented

### 1. **Seller Features** (SELLER/OWNER role)
- **Add Properties**: Sellers can create and list new properties for sale or rent
- **API Endpoint**: `POST /api/properties`
- **Requirements**: User must have SELLER, OWNER, ADMIN, or SUPER_ADMIN role

### 2. **Dealer Features** (DEALER role)
- **View All Properties**: Dealers can browse all active properties
- **Shortlist Properties**: Dealers can shortlist properties for their clients
- **API Endpoints**:
  - `GET /api/properties` - List all properties
  - `POST /api/properties/shortlist` - Add to shortlist
  - `GET /api/properties/shortlist` - View shortlist
  - `DELETE /api/properties/shortlist/[id]` - Remove from shortlist

### 3. **Buyer Features** (BUYER/TENANT role)
- **Browse Properties**: View all active properties
- **Add to Favorites**: Save properties for later
- **Add to Cart**: Add properties for inquiry (buy/rent)
- **API Endpoints**:
  - `GET /api/properties` - Browse properties
  - `POST /api/properties/favorites` - Add to favorites
  - `GET /api/properties/favorites` - View favorites
  - `DELETE /api/properties/favorites/[id]` - Remove from favorites
  - `POST /api/properties/cart` - Add to cart
  - `GET /api/properties/cart` - View cart
  - `DELETE /api/properties/cart/[id]` - Remove from cart

## 🗄️ Database Changes

### New Models Added:
1. **PropertyFavorite** - Stores user's favorite properties
2. **PropertyCart** - Stores properties in user's cart
3. **PropertyShortlist** - Stores dealer's shortlisted properties

## 📍 Dummy Data

A seeder script has been created to populate properties in the following cities:

### Cities Covered:
- **Mohali, Punjab** - Sectors 70, 71, 82, Phases 1-5
- **Zirakpur, Punjab** - VIP Road, Ambala Highway, Patiala Road, Sector 20, Baltana
- **Kharar, Punjab** - Main areas, Landran Road, Sectors 125-126
- **Kasauli, Himachal Pradesh** - Main areas, Dharampur, Garkhal
- **Panchkula, Haryana** - Sectors 1, 5, 7, 12, 14, 20, 21

### Property Types Included:
- Apartments (1-5 BHK)
- Villas
- Penthouses
- Shops
- Offices
- Plots

### To Seed Dummy Data:

```bash
cd sunshine-realtors-website
node scripts/seed-dummy-properties.js
```

This will create:
- 1 seller user (seller@sunshinerealtors.com)
- 75-125 properties across all cities
- Mix of properties for sale and rent
- Various property types, sizes, and prices

## 🚀 Setup Steps

### 1. Run Database Migration

```bash
# Generate Prisma migration
npx prisma migrate dev --name add_property_favorites_cart_shortlist

# Apply migration to production database
npx prisma migrate deploy
```

### 2. Seed Dummy Data (Optional)

```bash
node scripts/seed-dummy-properties.js
```

### 3. Test the APIs

#### Seller - Create Property:
```bash
POST /api/properties
Headers: Authorization: Bearer <token>
Body: {
  "title": "3 BHK Apartment for Sale",
  "description": "Beautiful apartment...",
  "category": "BUY",
  "propertyType": "APARTMENT",
  "location": {
    "state": "Punjab",
    "city": "Mohali",
    "locality": "Phase 1"
  },
  "pricing": {
    "price": 5000000
  },
  "details": {
    "bedrooms": 3,
    "bathrooms": 2,
    "builtUpArea": 1500
  },
  "media": {}
}
```

#### Dealer - Shortlist Property:
```bash
POST /api/properties/shortlist
Headers: Authorization: Bearer <token>
Body: {
  "propertyId": "<property-id>",
  "priority": "high",
  "notes": "Good for client X"
}
```

#### Buyer - Add to Favorites:
```bash
POST /api/properties/favorites
Headers: Authorization: Bearer <token>
Body: {
  "propertyId": "<property-id>"
}
```

#### Buyer - Add to Cart:
```bash
POST /api/properties/cart
Headers: Authorization: Bearer <token>
Body: {
  "propertyId": "<property-id>",
  "inquiryType": "BUY"
}
```

## 📝 Notes

- All properties created by sellers are set to `PENDING_VERIFICATION` status initially
- Only `ACTIVE` properties are visible to dealers and buyers
- Properties can be filtered by city, state, price, bedrooms, etc.
- Favorites and cart are user-specific
- Shortlists are dealer-specific and can include client information

## 🔐 Security

- All endpoints require authentication
- Role-based access control enforced:
  - Only sellers can create properties
  - Only dealers can shortlist
  - All authenticated users can browse, favorite, and cart

## 🎯 Next Steps

1. Create frontend pages for:
   - Seller: Property creation form
   - Dealer: Property listing dashboard with shortlist functionality
   - Buyer: Property browsing with favorites and cart

2. Add pagination to property listings
3. Add search and filter UI
4. Add property detail pages


