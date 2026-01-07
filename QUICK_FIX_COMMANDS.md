# ⚡ Quick Fix - Copy & Paste These Commands

## 🚀 **Fastest Way to Update DATABASE_URL**

### **Step 1: Get Pooler URL from Supabase**

1. Go to: https://supabase.com/dashboard/project/cgodlegdxrwhpjevxlel/settings/database
2. Scroll to **"Connection Pooling"**
3. Click **"URI"** tab
4. Copy the connection string

**It should look like:**
```
postgresql://postgres.cgodlegdxrwhpjevxlel:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Replace `[PASSWORD]` with URL-encoded password:**
- Password: `@16Supabase`
- URL-encoded: `%4016Supabase`

**Final URL:**
```
postgresql://postgres.cgodlegdxrwhpjevxlel:%4016Supabase@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

### **Step 2: Run These Commands**

**Copy and paste each command one by one:**

```bash
# Navigate to project
cd "D:\Devloment\RMSINFRATECH INC\sunshine-realtors-website"

# Remove old DATABASE_URL
vercel env rm DATABASE_URL production --yes

# Add new DATABASE_URL (will prompt for value - paste the pooler URL)
vercel env add DATABASE_URL production

# Verify it's set
vercel env ls

# Redeploy
vercel --prod
```

---

### **Step 3: When Prompted**

When you run `vercel env add DATABASE_URL production`, it will ask:

```
? What's the value of DATABASE_URL?
```

**Paste this (with your actual pooler URL from Supabase):**
```
postgresql://postgres.cgodlegdxrwhpjevxlel:%4016Supabase@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Note:** Make sure to use the actual pooler URL from your Supabase dashboard (region might be different).

---

## ✅ **Done!**

After redeploying, test login at:
https://sunshine-realtors-website.vercel.app/admin/login

---

## 🔍 **If You Don't Have Pooler URL**

1. Go to Supabase Dashboard
2. Settings → Database → Connection Pooling
3. If you don't see it, you may need to enable Connection Pooling first
4. Or contact Supabase support to enable it


