# 🌐 Browser Instructions - Add Redirect URI

Since the Google Cloud Console page is loading slowly in the automated browser, here are **clear manual instructions**:

---

## 📋 **Step-by-Step (Do This in Your Browser)**

### **Step 1: Open Google Cloud Console**
1. Open your browser
2. Go to: **https://console.cloud.google.com/apis/credentials?project=rms-infratech**
3. Sign in if needed

### **Step 2: Find Your OAuth Client**
1. On the Credentials page, look for **"OAuth 2.0 Client IDs"** section
2. Find the client with ID: `728883357446-kkoulhvkq6ei9h9c03n6a9iq6rs9a2nb`
3. **Click on it** (or click the edit/pencil icon)

### **Step 3: Add Redirect URI**
1. Scroll down to **"Authorized redirect URIs"** section
2. Click **"+ ADD URI"** button
3. **Paste this EXACT URI:**
   ```
   https://sunshine-realtors-website.vercel.app/api/auth/google
   ```
4. Make sure:
   - ✅ Starts with `https://`
   - ✅ No trailing slash
   - ✅ Exact spelling

### **Step 4: Save**
1. Scroll to bottom
2. Click **"SAVE"** button
3. Wait for confirmation

### **Step 5: Test**
1. Wait 1-2 minutes
2. Go to: https://sunshine-realtors-website.vercel.app/login
3. Click "Google" button
4. Should work! ✅

---

## 📋 **Quick Copy-Paste**

**Redirect URI to add:**
```
https://sunshine-realtors-website.vercel.app/api/auth/google
```

---

**Once you add this URI in Google Cloud Console, Google OAuth will work!**


