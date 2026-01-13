# 📍 How to Add Google OAuth Redirect URI

## 🔍 **Step-by-Step Instructions**

### **Step 1: Open Google Cloud Console**

1. Go to: **https://console.cloud.google.com/**
2. Make sure you're in project: **rms-infratech**
   - If not, click the project dropdown at the top and select "rms-infratech"

---

### **Step 2: Navigate to Credentials**

1. In the left sidebar, click **"APIs & Services"**
2. Click **"Credentials"** (or go directly: https://console.cloud.google.com/apis/credentials?project=rms-infratech)

---

### **Step 3: Open Your OAuth Client**

1. Look for **"OAuth 2.0 Client IDs"** section
2. Find the client with ID: `728883357446-kkoulhvkq6ei9h9c03n6a9iq6rs9a2nb`
3. **Click on it** to open the settings

---

### **Step 4: Add Redirect URI**

1. Scroll down to **"Authorized redirect URIs"** section
2. Click **"+ ADD URI"** button
3. **Paste this exact URI**:
   ```
   https://sunshine-realtors-website.vercel.app/api/auth/google
   ```
4. **Important:** Make sure it's EXACTLY this (no trailing slash, correct spelling)

---

### **Step 5: Save**

1. Click **"SAVE"** button at the bottom
2. Wait 1-2 minutes for changes to take effect

---

## ✅ **Quick Copy-Paste**

The redirect URI you need to add:
```
https://sunshine-realtors-website.vercel.app/api/auth/google
```

---

## 🔗 **Direct Links**

### **Option 1: Direct Link to Credentials Page**
https://console.cloud.google.com/apis/credentials?project=rms-infratech

### **Option 2: Direct Link to OAuth Consent Screen**
https://console.cloud.google.com/apis/credentials/consent?project=rms-infratech

---

## 📋 **What You'll See**

After clicking on your OAuth Client ID, you'll see a page with:
- **Name**: Your OAuth client name
- **Client ID**: `728883357446-kkoulhvkq6ei9h9c03n6a9iq6rs9a2nb`
- **Client secret**: (hidden)
- **Authorized JavaScript origins**: (may be empty)
- **Authorized redirect URIs**: ← **ADD URI HERE**
  - Click "+ ADD URI"
  - Paste: `https://sunshine-realtors-website.vercel.app/api/auth/google`
  - Click "SAVE"

---

## ⚠️ **Important Notes**

1. ✅ Must use `https://` (not `http://`)
2. ✅ Must be exact match (no trailing slashes)
3. ✅ Must include full path: `/api/auth/google`
4. ✅ Wait 1-2 minutes after saving
5. ✅ Clear browser cache before testing again

---

## 🧪 **After Adding URI**

1. **Wait 1-2 minutes** (Google needs time to propagate changes)
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Go to**: https://sunshine-realtors-website.vercel.app/login
4. **Click "Google" button**
5. **Should work now!** ✅

---

*Once you add the redirect URI and save it, Google OAuth will work!*



