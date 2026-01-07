# 📍 Add Google OAuth Redirect URI - Step by Step

## 🎯 **The Redirect URI You Need to Add:**

Copy this exact URI:
```
https://sunshine-realtors-website.vercel.app/api/auth/google
```

---

## 📋 **Step-by-Step Instructions**

### **Step 1: Open Google Cloud Console**
1. Go to: **https://console.cloud.google.com/**
2. Sign in with your Google account
3. Select project: **rms-infratech** (from dropdown at top)

---

### **Step 2: Go to Credentials**
1. In the **left sidebar**, click **"APIs & Services"**
2. Click **"Credentials"**
   - **OR** go directly: https://console.cloud.google.com/apis/credentials?project=rms-infratech

---

### **Step 3: Find Your OAuth Client**
1. Look for the section **"OAuth 2.0 Client IDs"**
2. Find the client with name that has Client ID ending in: `...rs9a2nb`
3. **Click on the client name** (or the pencil/edit icon) to open it

---

### **Step 4: Add Redirect URI**
1. Scroll down to **"Authorized redirect URIs"** section
2. You'll see a list (may be empty or have existing URIs)
3. Click the **"+ ADD URI"** button
4. A text input field will appear
5. **Paste this EXACT URI:**
   ```
   https://sunshine-realtors-website.vercel.app/api/auth/google
   ```
6. Make sure there are:
   - ✅ No spaces before or after
   - ✅ No trailing slash at the end
   - ✅ Exact spelling: `sunshine-realtors-website.vercel.app`

---

### **Step 5: Save**
1. Scroll to the bottom of the page
2. Click the blue **"SAVE"** button
3. Wait for confirmation message (usually shows "Client saved successfully")

---

### **Step 6: Wait & Test**
1. **Wait 1-2 minutes** (Google needs time to propagate changes)
2. **Clear your browser cache** (Ctrl+Shift+Delete)
3. **Go to**: https://sunshine-realtors-website.vercel.app/login
4. **Click "Google" button**
5. Should work now! ✅

---

## 🔍 **Visual Guide**

When you open your OAuth Client, you'll see something like:

```
┌─────────────────────────────────────┐
│ OAuth 2.0 Client ID                 │
├─────────────────────────────────────┤
│ Name: [Your Client Name]            │
│ Client ID: 728883357446-...rs9a2nb  │
│ Client secret: [Hidden]             │
│                                     │
│ Authorized JavaScript origins       │
│ └── (may be empty)                  │
│                                     │
│ Authorized redirect URIs  ← LOOK HERE
│ └── [+ ADD URI] ← CLICK THIS
│                                     │
│ [SAVE] button ← CLICK TO SAVE       │
└─────────────────────────────────────┘
```

---

## ✅ **What to Add (Copy This)**

```
https://sunshine-realtors-website.vercel.app/api/auth/google
```

---

## ⚠️ **Common Mistakes to Avoid**

❌ **Wrong:**
- `http://sunshine-realtors-website.vercel.app/api/auth/google` (missing 's' in https)
- `https://sunshine-realtors-website.vercel.app/api/auth/google/` (trailing slash)
- `https://sunshine-realtors-website.vercel.app/` (missing path)
- `https://sunshine-realtors-website.vercel.app/api/auth/Google` (capital G)

✅ **Correct:**
- `https://sunshine-realtors-website.vercel.app/api/auth/google` (exact match)

---

## 🚀 **Quick Summary**

1. Go to: https://console.cloud.google.com/apis/credentials?project=rms-infratech
2. Click your OAuth Client ID
3. Scroll to "Authorized redirect URIs"
4. Click "+ ADD URI"
5. Paste: `https://sunshine-realtors-website.vercel.app/api/auth/google`
6. Click "SAVE"
7. Wait 1-2 minutes
8. Test Google login!

---

**Once you add this URI and save, Google OAuth will work!**


