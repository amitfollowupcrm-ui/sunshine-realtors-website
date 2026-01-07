# 🔧 Fix Connection Pooler Region

## ⚠️ **Current Issue**

The connection pooler URL is giving "Tenant or user not found" error. This means:
- ✅ The pooler URL format is correct
- ✅ Password is correct: `Supabasesecure16`
- ❌ The **REGION** might be wrong

## 🔍 **How to Find the Correct Region**

### **Option 1: Check Your Supabase Dashboard**

1. Go to: https://supabase.com/dashboard/project/cgodlegdxrwhpjevxlel
2. Click **"Connect"** button (top right)
3. Select **"Connection Pooling"** tab
4. Look at the connection string - it will show the **exact region**

### **Option 2: Check the URL Structure**

The connection string should show the region. Common regions:
- `aws-0-ap-south-1` (Asia Pacific - Mumbai) - **Currently trying this**
- `aws-0-ap-southeast-1` (Asia Pacific - Singapore)
- `aws-0-us-east-1` (US East)
- `aws-0-us-west-1` (US West)
- `aws-0-eu-west-1` (Europe - Ireland)
- `aws-0-eu-central-1` (Europe - Frankfurt)

### **Option 3: Copy Exact URL from Supabase**

1. In Supabase dashboard
2. Go to **Settings → Database → Connection Pooling**
3. Click on **"Show connection string"** or similar button
4. Copy the **complete URL** exactly as shown
5. It should have the correct region already

---

## ✅ **Once You Have the Correct Region**

The URL format will be:
```
postgresql://postgres.cgodlegdxrwhpjevxlel:Supabasesecure16@aws-0-[CORRECT-REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Just replace `[CORRECT-REGION]` with the actual region from your dashboard!**

---

## 🚀 **Quick Update Command**

Once you know the correct region, run:

```bash
vercel env rm DATABASE_URL production --yes
vercel env add DATABASE_URL production
# Paste the complete URL with correct region
vercel --prod
```

---

**The region is usually visible in the connection string provided by Supabase dashboard!**


