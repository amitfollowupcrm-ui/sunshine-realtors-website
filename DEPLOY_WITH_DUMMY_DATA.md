# Deploy Property Features with Dummy Data

## Quick Deployment Steps

### 1. Run Database Migration on Production

Since you're on Vercel, run this command to apply the migration:

```bash
cd sunshine-realtors-website
npx prisma migrate deploy
```

This will create the new tables for favorites, cart, and shortlist.

### 2. Seed Dummy Data with Images

Run the seeder script to populate properties:

```bash
node scripts/seed-dummy-properties.js
```

This will:
- Create a seller user (if not exists)
- Generate 75-125 properties across all cities
- Include high-quality compressed images from Unsplash
- Properties for Mohali, Zirakpur, Kharar, Kasauli, and Panchkula

### 3. Deploy to Vercel

The code is already pushed. Vercel will automatically deploy:

```bash
git add .
git commit -m "Add property management features with favorites, cart, and shortlist"
git push
```

Or if you want to deploy manually:

```bash
vercel --prod
```

## What's Included

### ✅ API Endpoints
- Property creation for sellers
- Property browsing for dealers/buyers
- Shortlist management for dealers
- Favorites for buyers
- Cart functionality for buyers

### ✅ Dummy Data
- **75-125 properties** across 5 cities
- **High-quality images** from Unsplash (compressed for web)
- **Mix of property types**: Apartments, Villas, Penthouses, Shops, Offices, Plots
- **For Sale and Rent** options
- **Realistic pricing** based on property type and location

### ✅ Cities Covered
1. **Mohali, Punjab** - Phases 1-5, Sectors 70, 71, 82
2. **Zirakpur, Punjab** - VIP Road, Ambala Highway, Patiala Road, Sector 20, Baltana
3. **Kharar, Punjab** - Main areas, Landran Road, Sectors 125-126
4. **Kasauli, Himachal Pradesh** - Main areas, Dharampur, Garkhal
5. **Panchkula, Haryana** - Sectors 1, 5, 7, 12, 14, 20, 21

## Images

All properties include 3-5 high-quality images from Unsplash:
- Optimized for web (800px width, 80% quality)
- Auto-format (WebP when supported)
- Property-type specific images
- Fast loading times

## Testing After Deployment

1. **Test Seller API:**
   ```bash
   POST https://sunshine-realtors-website.vercel.app/api/properties
   Authorization: Bearer <seller-token>
   ```

2. **Test Dealer Shortlist:**
   ```bash
   GET https://sunshine-realtors-website.vercel.app/api/properties/shortlist
   Authorization: Bearer <dealer-token>
   ```

3. **Test Buyer Favorites:**
   ```bash
   GET https://sunshine-realtors-website.vercel.app/api/properties/favorites
   Authorization: Bearer <buyer-token>
   ```

## Database Migration

The migration creates 3 new tables:
- `property_favorites` - User favorite properties
- `property_cart` - User cart items
- `property_shortlist` - Dealer shortlisted properties

All with proper indexes and foreign key constraints.

## Notes

- Images are loaded from Unsplash (CDN) - no storage costs
- All images are compressed and optimized
- Properties are set to ACTIVE status for immediate visibility
- Seller user email: `seller@sunshinerealtors.com` (password: `Seller123!`)

