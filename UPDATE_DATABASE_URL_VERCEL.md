# 🔧 How to Update DATABASE_URL on Vercel with Connection Pooler

## 📋 **Step-by-Step Guide**

### **Step 1: Get Connection Pooler URL from Supabase**

1. **Go to Supabase Dashboard:**
   - Open: https://supabase.com/dashboard
   - Sign in to your account

2. **Select Your Project:**
   - Click on project: `cgodlegdxrwhpjevxlel`

3. **Navigate to Database Settings:**
   - Click **"Settings"** (gear icon) in the left sidebar
   - Click **"Database"**

4. **Find Connection Pooling Section:**
   - Scroll down to **"Connection Pooling"** section
   - Look for **"Connection string"** with **"URI"** tab selected

5. **Copy the Pooler URL:**
   - It should look like:
     ```
     postgresql://postgres.cgodlegdxrwhpjevxlel:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - **IMPORTANT:** Make sure you're copying from the **"Connection Pooling"** section, NOT the direct connection
   - The URL should have `pooler.supabase.com:6543` (not `db.supabase.co:5432`)

6. **Replace Password:**
   - Replace `[YOUR-PASSWORD]` with your actual password: `@16Supabase`
   - **URL-encode special characters:**
     - `@` becomes `%40`
   - So `@16Supabase` becomes `%4016Supabase`
   - Final format: `postgresql://postgres.cgodlegdxrwhpjevxlel:%4016Supabase@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

---

### **Step 2: Update DATABASE_URL on Vercel**

#### **Option A: Using Vercel CLI (Easiest)**

1. **Open Terminal/PowerShell:**
   ```bash
   cd "D:\Devloment\RMSINFRATECH INC\sunshine-realtors-website"
   ```

2. **Remove Old DATABASE_URL:**
   ```bash
   vercel env rm DATABASE_URL production --yes
   ```

3. **Add New DATABASE_URL:**
   ```bash
   vercel env add DATABASE_URL production
   ```
   
4. **When Prompted:**
   - Paste the pooler URL you copied from Supabase
   - Make sure password is URL-encoded (`%40` instead of `@`)
   - Press Enter

5. **Verify:**
   ```bash
   vercel env ls
   ```
   - You should see `DATABASE_URL` listed

6. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

#### **Option B: Using Vercel Dashboard (Alternative)**

1. **Go to Vercel Dashboard:**
   - Open: https://vercel.com/rakeshs-projects-07a44f1a/sunshine-realtors-website

2. **Navigate to Settings:**
   - Click **"Settings"** tab
   - Click **"Environment Variables"** in the left sidebar

3. **Update DATABASE_URL:**
   - Find `DATABASE_URL` in the list
   - Click **"Edit"** (pencil icon)
   - Replace the value with the pooler URL from Supabase
   - Make sure to select **"Production"** environment
   - Click **"Save"**

4. **Redeploy:**
   - Go to **"Deployments"** tab
   - Find the latest deployment
   - Click **"⋯"** (three dots)
   - Click **"Redeploy"**

---

### **Step 3: Test the Connection**

After redeploying, test the login:

1. **Go to:** https://sunshine-realtors-website.vercel.app/admin/login
2. **Enter credentials:**
   - Email: `amitfollowupcrm@gmail.com`
   - Password: `SunshineAdmin@2024!`
3. **Click "Sign in to Admin Panel"**

---

## ⚠️ **Important Notes**

### **URL Encoding:**
- Password contains `@` which must be encoded as `%40`
- Example: `@16Supabase` → `%4016Supabase`

### **Connection Pooler vs Direct Connection:**
- **Pooler (Recommended):** `pooler.supabase.com:6543` ✅
- **Direct (Won't work):** `db.supabase.co:5432` ❌

### **Format:**
```
postgresql://postgres.[PROJECT-REF]:[URL-ENCODED-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## 🎯 **Quick Command Reference**

```bash
# 1. Remove old
vercel env rm DATABASE_URL production --yes

# 2. Add new (will prompt for value)
vercel env add DATABASE_URL production
# Paste: postgresql://postgres.cgodlegdxrwhpjevxlel:%4016Supabase@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# 3. Verify
vercel env ls

# 4. Redeploy
vercel --prod
```

---

## ✅ **After Update**

Once you've updated and redeployed, the login should work! The connection pooler is specifically designed for serverless functions like Vercel.


