# 🔑 How to Use Password in Connection String

## 📋 Step-by-Step Guide:

### Step 1: Get the Connection String from Supabase

1. Go to: Settings → Database → Connection string → URI tab
2. You'll see something like:
   ```
   postgresql://postgres.cgodlegdxrwhpjevxlel:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```

### Step 2: Replace [YOUR-PASSWORD] with Your Actual Password

**The connection string has a placeholder:** `[YOUR-PASSWORD]`

**You need to replace it with the password you set when creating the Supabase project.**

**Example:**

**Original (from Supabase):**
```
postgresql://postgres.cgodlegdxrwhpjevxlel:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**After replacing with your password (example: `MyPassword123!`):**
```
postgresql://postgres.cgodlegdxrwhpjevxlel:MyPassword123!@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

### Step 3: If Your Password Has Special Characters

If your password contains special characters like `@`, `#`, `%`, etc., you need to **URL encode** them:

**Common special characters:**
- `@` becomes `%40`
- `#` becomes `%23`
- `%` becomes `%25`
- `&` becomes `%26`
- Space becomes `%20`

**Example:**
If your password is: `MyPass@123#`

The encoded version: `MyPass%40123%23`

Full connection string:
```
postgresql://postgres.cgodlegdxrwhpjevxlel:MyPass%40123%23@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

---

## 🎯 Two Options:

### Option 1: Use the Connection String As-Is (Easiest)

If Supabase shows you the connection string with `[YOUR-PASSWORD]` placeholder:

1. **Copy the entire connection string**
2. **Manually replace** `[YOUR-PASSWORD]` with your actual password
3. **Keep the rest of the string unchanged**

### Option 2: Build It Manually

If you know your password but not the full connection string:

**Format:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[HOST]:[PORT]/postgres
```

**Your project:**
- Project Ref: `cgodlegdxrwhpjevxlel`
- Host: Check in Supabase settings (usually `aws-0-[region].pooler.supabase.com`)
- Port: Usually `6543` (for connection pooling) or `5432` (direct)
- Database: `postgres`

**Example:**
```
postgresql://postgres.cgodlegdxrwhpjevxlel:YourPassword123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

---

## ✅ Quick Check:

**Your final connection string should:**
- ✅ Start with `postgresql://`
- ✅ Contain your project ref: `cgodlegdxrwhpjevxlel`
- ✅ Have your actual password (not `[YOUR-PASSWORD]`)
- ✅ End with `/postgres`

---

## 📝 What to Send Me:

**Just paste the complete connection string with your password already inserted:**

```
postgresql://postgres.cgodlegdxrwhpjevxlel:YourActualPasswordHere@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**I'll add it to your `.env.local` file!** 🚀

---

## 🔒 Security Note:

- The password in `.env.local` is safe (file is in `.gitignore`)
- Never share this publicly
- Only use it in your local `.env.local` file

---

**Copy the connection string from Supabase, replace `[YOUR-PASSWORD]` with your actual password, and paste it here!** 📋

