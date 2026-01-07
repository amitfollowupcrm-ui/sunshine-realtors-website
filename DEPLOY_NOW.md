# 🚀 Deploy Now - Quick Guide

## One-Command Deployment (Recommended)

### Option 1: Using Script (Linux/Mac/WSL)
```bash
chmod +x scripts/deploy-and-seed.sh
./scripts/deploy-and-seed.sh
```

### Option 2: Manual Steps (Windows)

#### Step 1: Deploy Database Migration
```bash
cd sunshine-realtors-website
npx prisma migrate deploy
```

#### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

#### Step 3: Seed Dummy Data with Images
```bash
node scripts/seed-dummy-properties.js
```

## What Gets Deployed

✅ **Database Tables:**
- `property_favorites` - User favorite properties
- `property_cart` - User cart items  
- `property_shortlist` - Dealer shortlisted properties

✅ **75-125 Dummy Properties** with:
- High-quality compressed images (3-5 per property)
- All property types (Apartments, Villas, Shops, etc.)
- Realistic pricing and details
- Properties for Sale and Rent

✅ **5 Cities Covered:**
- Mohali, Punjab
- Zirakpur, Punjab
- Kharar, Punjab
- Kasauli, Himachal Pradesh
- Panchkula, Haryana

## Images Included

All properties include **ultra-high quality but compressed images** from Unsplash:
- ✅ Optimized for web (800px width, 80% quality)
- ✅ Auto WebP format when supported
- ✅ Property-type specific images
- ✅ Fast loading (CDN hosted)

## After Deployment

### Test the APIs:

1. **Browse Properties:**
   ```
   GET /api/properties
   Authorization: Bearer <token>
   ```

2. **Seller - Create Property:**
   ```
   POST /api/properties
   Authorization: Bearer <seller-token>
   ```

3. **Dealer - Shortlist:**
   ```
   POST /api/properties/shortlist
   Authorization: Bearer <dealer-token>
   ```

4. **Buyer - Add to Favorites:**
   ```
   POST /api/properties/favorites
   Authorization: Bearer <buyer-token>
   ```

## Troubleshooting

### If migration fails:
- Check your `DATABASE_URL` in `.env.local`
- Make sure you're using the pooler URL for Vercel: `postgresql://...@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

### If seeding fails:
- Ensure migration completed successfully
- Check database connection
- Verify Prisma client is generated

## Seller Account

After seeding, you'll have:
- **Email:** seller@sunshinerealtors.com
- **Password:** Seller123!

You can use this to test property creation.

---

**Ready to deploy? Run the commands above!** 🚀
