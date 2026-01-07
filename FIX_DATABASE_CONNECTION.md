# 🔧 FIX DATABASE CONNECTION ON VERCEL

## ❌ **Issue Found**

The error shows:
```
Can't reach database server at `db.cgodlegdxrwhpjevxlel.supabase.co:5432`
```

This means the `DATABASE_URL` environment variable is either:
1. Not set on Vercel
2. Set incorrectly
3. The database server is not accessible

---

## ✅ **FIX: Set DATABASE_URL on Vercel**

### **Option 1: Using Vercel CLI (Recommended)**

Run this command in your terminal:

```bash
cd "D:\Devloment\RMSINFRATECH INC\sunshine-realtors-website"
vercel env add DATABASE_URL production
```

When prompted:
1. Paste this connection string:
```
postgresql://postgres:@16Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres
```
2. Press Enter
3. When asked "Mark as sensitive?", type `y` and press Enter

---

### **Option 2: Using Vercel Dashboard**

1. Go to: https://vercel.com/rakeshs-projects-07a44f1a/sunshine-realtors-website/settings/environment-variables
2. Click "Add New"
3. Name: `DATABASE_URL`
4. Value: `postgresql://postgres:@16Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres`
5. Environment: Select "Production"
6. Click "Save"
7. **IMPORTANT:** Redeploy your application (go to Deployments → Latest → ... → Redeploy)

---

## 🔄 **After Setting the Variable**

1. **Redeploy the application:**
```bash
vercel --prod
```

Or from Vercel Dashboard:
- Go to Deployments
- Click on latest deployment
- Click "..." → "Redeploy"

2. **Wait for deployment to complete**

3. **Try logging in again**

---

## ✅ **Verify It's Set**

Run this to check:
```bash
vercel env ls
```

You should see `DATABASE_URL` listed for Production.

---

## 🔍 **Alternative: Check Supabase Connection**

If the connection string is correct but still failing, check:

1. **Supabase Dashboard:** https://supabase.com/dashboard
2. Go to your project
3. Settings → Database
4. Check "Connection string" (URI format)
5. Make sure the password matches: `@16Supabase`

---

## 🎯 **Quick Fix Command**

Run this command and paste the connection string when prompted:

```bash
cd "D:\Devloment\RMSINFRATECH INC\sunshine-realtors-website"
echo "postgresql://postgres:@16Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres" | vercel env add DATABASE_URL production
```

---

*This will fix the database connection error!*

