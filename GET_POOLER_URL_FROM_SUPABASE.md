# 🔍 How to Get Connection Pooler URL from Supabase Dashboard

## 📋 **Step-by-Step Guide**

### **Method 1: Click "Connect" Button**

1. **At the top right** of your Supabase dashboard, look for a **"Connect"** button
2. **Click "Connect"**
3. A modal/dropdown will appear showing connection options
4. Look for **"Connection Pooling"** tab or option
5. Select **"URI"** format
6. **Copy the connection string** shown there

### **Method 2: Check Connection Pooling Section**

Based on your screenshot showing "Connection pooling configuration":

1. **Scroll down** on the Database Settings page
2. Look for a section showing **connection strings** or **connection info**
3. There might be a **"Show connection string"** button or link
4. Look for tabs like: **"Direct connection"**, **"Connection Pooling"**, **"URI"**, **"Session mode"**, etc.
5. Select **"Connection Pooling"** and **"URI"** format

### **Method 3: Check Settings → API Page**

1. Go to **Settings → API** (in the left sidebar)
2. Look for **"Connection String"** section
3. There might be different options including **"Connection Pooling"**

### **Method 4: Look for Connection Info Button**

1. In the **"Connection pooling configuration"** section you can see
2. Look for a button/link that says:
   - **"Show connection string"**
   - **"Connection Info"**
   - **"Copy connection string"**
   - An icon with connection details

---

## 🎯 **What the Pooler URL Should Look Like**

When you find it, it should look like this format:

```
postgresql://postgres.cgodlegdxrwhpjevxlel:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Key differences from direct connection:**
- Username: `postgres.cgodlegdxrwhpjevxlel` (with project ref)
- Host: `aws-0-[REGION].pooler.supabase.com` (pooler, not db)
- Port: `6543` (not 5432)
- Has `?pgbouncer=true` at the end

---

## ✅ **Once You Have It**

**Replace `[PASSWORD]` with URL-encoded password:**
- Password: `@16Supabase`
- URL-encoded: `%4016Supabase`

**Then update on Vercel:**
```bash
vercel env rm DATABASE_URL production --yes
vercel env add DATABASE_URL production
# Paste the pooler URL with %4016Supabase as password
vercel --prod
```

---

## 💡 **If You Can't Find It**

1. **Try clicking the "Docs" button** next to "Connection pooling configuration" - it might have examples
2. **Contact Supabase support** - they can provide the exact connection string
3. **Check if Connection Pooling is enabled** - it might need to be activated first

---

**The connection pooler URL is required for serverless functions (Vercel) to work with Supabase!**



