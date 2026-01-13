# 🔧 Supabase Connection Fix for Vercel

## ❌ **Current Issue**

The database connection is failing on Vercel with:
```
Can't reach database server at `db.cgodlegdxrwhpjevxlel.supabase.co:5432`
```

## ✅ **Solution: Get Correct Connection String from Supabase**

### **Step 1: Get Connection String from Supabase Dashboard**

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **Connection string** section
5. Select **URI** tab (not Session mode or Transaction mode)
6. Copy the **Connection string**

It should look like:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

OR for direct connection:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### **Step 2: Set on Vercel**

**Option A: Using Vercel Dashboard**
1. Go to: https://vercel.com/rakeshs-projects-07a44f1a/sunshine-realtors-website/settings/environment-variables
2. Add `DATABASE_URL` with the connection string from Supabase
3. Select **Production** environment
4. Save
5. Redeploy

**Option B: Using CLI**
```bash
vercel env add DATABASE_URL production
# Paste the connection string when prompted
```

### **Step 3: Important Notes**

1. **Password Encoding:** If your password has special characters like `@`, `#`, etc., they need to be URL-encoded:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `&` becomes `%26`

2. **Connection Pooler:** For serverless functions (Vercel), use the **Connection Pooler** URL (port 6543) instead of direct connection (port 5432)

3. **IP Restrictions:** Check Supabase Settings → Database → Connection Pooling to ensure there are no IP restrictions blocking Vercel

---

## 🔍 **Current Connection String Format**

Your current password is: `@16Supabase`

If using direct connection, it should be:
```
postgresql://postgres:%4016Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres
```

If using pooler (recommended for Vercel):
```
postgresql://postgres.cgodlegdxrwhpjevxlel:%4016Supabase@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

---

## ✅ **After Setting Correct Connection String**

1. Redeploy: `vercel --prod`
2. Test login again
3. Check Vercel logs if still failing

---

*Get the exact connection string from your Supabase dashboard for best results!*



