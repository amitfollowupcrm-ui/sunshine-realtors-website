# 🔐 How to Reset and Get Your Supabase Database Password

## ⚠️ **Important:** Supabase NEVER shows passwords after they're set!

The password is **only visible ONCE** when you:
1. First create the database, OR
2. Reset the password

After that, it's hidden forever for security.

---

## ✅ **Step-by-Step: Reset Password & Capture It**

### **Option 1: Reset via Dashboard (RECOMMENDED)**

1. **Go to:** https://supabase.com/dashboard/project/cgodlegdxrwhpjevxlel/database/settings

2. **Find the "Database password" section** (at the top)

3. **Click "Reset database password" button**

4. **⚠️ CRITICAL:** A modal will appear showing the NEW password
   - **COPY IT IMMEDIATELY** - you'll only see it once!
   - **SAVE IT** somewhere safe (like a password manager or text file)
   - The password will look something like: `ABC123xyz@456`

5. **After you've saved it:**
   - Use this **EXACT** password in the connection string
   - Replace `[YOUR-PASSWORD]` with this password

---

### **Option 2: Set a Known Password**

If you want to use a password you already know (`Supabasesecure16`):

1. **Reset the password** using Option 1
2. **When the modal shows the new password:**
   - Copy it temporarily
   - Note: You cannot set a custom password during reset - Supabase generates it randomly

3. **OR:** Use the generated password from the reset

---

## 🔧 **Once You Have the Password:**

Update the connection string:

```
postgresql://postgres.cgodlegdxrwhpjevxlel:[YOUR-NEW-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
```

**Example with password `ABC123xyz@456`:**
```
postgresql://postgres.cgodlegdxrwhpjevxlel:ABC123xyz@456@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
```

---

## ⚠️ **Common Issues:**

1. **Password has special characters:** You MUST URL-encode them
   - `@` becomes `%40`
   - `#` becomes `%23`
   - etc.

2. **Can't see password after reset:** 
   - You closed the modal too quickly
   - You need to reset again

3. **Password not working:**
   - Make sure you copied it EXACTLY (including spaces, if any)
   - Special characters must be URL-encoded in the connection string

---

## 🚀 **After You Get the Password:**

**Share it with me and I'll:**
1. URL-encode it properly
2. Update it on Vercel
3. Test the login
4. Confirm everything works

---

## 💡 **Quick Test:**

Once you have the password, you can test it locally:

```bash
node scripts/test-correct-pooler.js
```

(Update the password in the script first)

---

**Remember:** The password is shown **ONLY ONCE** during reset. Make sure to copy it immediately!


