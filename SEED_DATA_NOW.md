# 🌱 Seed Dummy Data - Quick Guide

## Step 2: Seed Properties with Images

Since Step 1 (SQL) is ✅ **WORKING**, now seed the data!

### Option 1: Run with Connection String (Fastest)

Copy your pooler connection string from Vercel/Supabase and run:

```bash
cd sunshine-realtors-website

node scripts/seed-with-connection.js "postgresql://postgres.cgodlegdxrwhpjevxlel:Supabasesecure16@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### Option 2: Set DATABASE_URL in .env.local

1. Create/update `.env.local`:
```
DATABASE_URL="postgresql://postgres.cgodlegdxrwhpjevxlel:Supabasesecure16@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

2. Run:
```bash
node scripts/seed-dummy-properties.js
```

### Option 3: Pull from Vercel

```bash
vercel env pull .env.local
node scripts/seed-dummy-properties.js
```

## ✅ Expected Output

```
🌱 Starting property seeding...
📡 Using connection: postgresql://postgres.cgodlegdxrwhpjevxlel:****@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true

Creating seller user...
✅ Seller user created
Generating 20 properties for Mohali, Punjab...
Generating 22 properties for Zirakpur, Punjab...
...

📦 Creating 100 properties...
  ✅ Created 10/100 properties
  ✅ Created 20/100 properties
  ...
  ✅ Created 100/100 properties

🎉 Property seeding completed!

📊 Summary:
   - Total properties: 100
   - Cities: Mohali, Zirakpur, Kharar, Kasauli, Panchkula
   - Seller: seller@sunshinerealtors.com
```

## 🧪 Test After Seeding

Visit:
```
https://sunshine-realtors-website.vercel.app/api/properties
```

You should see properties with images!

**Try Option 1 (it's the fastest)!** ⚡



