# 🔍 How to Get Supabase Database Connection String

## From Your Dashboard:

I can see your project:
- **Project URL:** `https://cgodlegdxrwhpjevxlel.supabase.co`
- **Project ID:** `cgodlegdxrwhpjevxlel`

---

## 📋 Steps to Get Database Connection String:

### Step 1: Go to Settings
1. In your Supabase dashboard (where you are now)
2. Look at the **left sidebar**
3. Click on **"Settings"** (gear icon at the bottom)

### Step 2: Go to Database Section
1. In Settings, you'll see multiple sections
2. Click on **"Database"** in the left menu

### Step 3: Find Connection String
1. Scroll down to find **"Connection string"** section
2. You'll see different connection methods:
   - **URI** (this is what we need!)
   - **JDBC**
   - **Golang**
   - etc.

### Step 4: Copy the URI
1. Find the **"URI"** tab
2. You'll see a connection string like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
3. **Important:** Replace `[YOUR-PASSWORD]` with the password you set when creating the project
4. **Copy the entire connection string**

---

## 🎯 Alternative: Direct Link

**You can also go directly to:**
```
https://supabase.com/dashboard/project/cgodlegdxrwhpjevxlel/settings/database
```

---

## 📝 What You'll See:

The connection string will look like one of these:

**Format 1 (Connection Pooling - Recommended):**
```
postgresql://postgres.cgodlegdxrwhpjevxlel:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**Format 2 (Direct Connection):**
```
postgresql://postgres:YOUR_PASSWORD@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres
```

**Replace `YOUR_PASSWORD` with the password you created when setting up the project!**

---

## ✅ Once You Have It:

**Paste it here like:**
```
DATABASE_URL: postgresql://postgres...
```

**I'll add it to your `.env.local` file!** 🚀

---

## 🔑 Don't Remember Your Password?

If you forgot your database password:
1. Go to: Settings → Database
2. Look for **"Database password"** section
3. Click **"Reset database password"**
4. Set a new password
5. Use the new password in the connection string

---

**Follow these steps and paste the connection string here!** 📋

