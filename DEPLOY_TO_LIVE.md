# 🚀 Deploy to Live - Step by Step

## Quick Deploy Commands

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `sunshine-realtors-website`
3. **Go to Settings → Environment Variables**
4. **Ensure DATABASE_URL is set** with the pooler URL:
   ```
   postgresql://postgres.cgodlegdxrwhpjevxlel:Supabasesecure16@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

5. **Apply Database Migration**:
   - Go to **Settings → Functions**
   - Or use Vercel CLI:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

### Option 2: Via Supabase SQL Editor (Fastest)

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to SQL Editor**
4. **Copy and paste the migration SQL** from:
   `prisma/migrations/20250107_add_property_favorites_cart_shortlist/migration.sql`
5. **Click Run**

### Option 3: Seed Data After Migration

After migration is applied, seed data via Vercel CLI:

```bash
# Pull environment variables
vercel env pull .env.local

# Install dependencies if needed
npm install

# Run seeder
node scripts/seed-dummy-properties.js
```

Or use a one-liner:
```bash
vercel env pull .env.local && node scripts/seed-dummy-properties.js
```

## What Gets Deployed

✅ **Database Tables**:
- `property_favorites`
- `property_cart`
- `property_shortlist`

✅ **75-125 Properties** with:
- High-quality compressed images
- All 5 cities (Mohali, Zirakpur, Kharar, Kasauli, Panchkula)
- All property types
- For Sale & Rent

## Verification

After deployment, test:
```
GET https://sunshine-realtors-website.vercel.app/api/properties
```

You should see properties with images!

## Troubleshooting

### If migration fails:
- Use Supabase SQL Editor (Option 2) - it's the fastest
- Check DATABASE_URL in Vercel environment variables
- Ensure password is correct: `Supabasesecure16`

### If seeding fails:
- Make sure migration completed first
- Check DATABASE_URL has `?pgbouncer=true`
- Verify environment variables are loaded

---

**Recommended: Use Option 2 (Supabase SQL Editor) for fastest deployment!** ⚡



