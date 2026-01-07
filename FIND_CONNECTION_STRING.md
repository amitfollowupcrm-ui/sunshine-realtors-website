# 🔍 How to Find Connection Pooling Connection String in Supabase

## 📋 **Steps to Find Connection Pooling URL**

Based on your screenshot, I can see the "Connection pooling configuration" section. Here's how to find the connection string:

### **Option 1: Check "Connection Info" or "Connection String" Tab**

1. **On the Database Settings page**, look for:
   - A tab/section called **"Connection Info"** or **"Connection string"**
   - Or click on **"Connect"** button at the top right
   - Or look for a section showing **"Connection pooling"** with connection strings

2. **Look for tabs/options like:**
   - **"URI"** tab
   - **"Connection Pooling"** section
   - **"Connection string"** dropdown

### **Option 2: Try the Settings → API Page**

1. Go to: **Settings → API** (instead of Database)
2. Look for **"Connection String"** section
3. There might be a **"Connection Pooling"** option there

### **Option 3: Use Direct Connection (Which We Know Works)**

Since the direct connection works from your local machine, let's use that format but ensure proper encoding:

**Direct Connection URL (with URL-encoded password):**
```
postgresql://postgres:%4016Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres
```

This should work even from Vercel if Supabase allows it from their IPs.

---

## ✅ **Quick Solution**

Let's try using the direct connection URL first (which we know works locally):

```bash
vercel env rm DATABASE_URL production --yes
vercel env add DATABASE_URL production
# When prompted, paste:
postgresql://postgres:%4016Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres
vercel --prod
```

If this doesn't work from Vercel, then we definitely need the pooler URL.

---

## 🔍 **Where to Find Pooler URL (Alternative Method)**

1. **Click "Connect" button** (top right of Supabase dashboard)
2. **Select "Connection Pooling"** tab
3. **Copy the URI** shown there

Or:

1. Go to **Project Settings → Database**
2. Scroll to find **"Connection string"** section
3. Look for **"Connection Pooling"** option
4. Copy the **URI** format connection string

---

## 💡 **If You Can't Find Pooler URL**

The pooler might not be enabled or visible. In that case:
- Use the direct connection URL above
- Or contact Supabase support to enable connection pooling
- Or check if there's a "Connection Info" button/link in the Connection pooling configuration section


