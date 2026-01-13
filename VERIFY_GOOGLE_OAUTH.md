# 🔧 Fix Google OAuth 400 Error

## ❌ **Error**
Google is returning: "400. That's an error. The server cannot process the request because it is malformed."

## ✅ **Solution: Verify Redirect URI in Google Console**

The redirect URI in your code must **exactly match** what's configured in Google Cloud Console.

### **Step 1: Check Your Current Redirect URI**

Our code uses:
```
https://sunshine-realtors-website.vercel.app/api/auth/google
```

### **Step 2: Verify in Google Cloud Console**

1. Go to: https://console.cloud.google.com/
2. Select project: **rms-infratech**
3. Go to **APIs & Services** → **Credentials**
4. Click on your **OAuth 2.0 Client ID**:
   - `728883357446-kkoulhvkq6ei9h9c03n6a9iq6rs9a2nb.apps.googleusercontent.com`
5. Check **Authorized redirect URIs** section
6. Make sure this URI is **exactly** listed:
   ```
   https://sunshine-realtors-website.vercel.app/api/auth/google
   ```
7. If it's not there, **add it** and click **Save**

### **Step 3: Important Notes**

- ✅ URI must be **exact match** (no trailing slashes, no extra characters)
- ✅ Must use `https://` (not `http://`)
- ✅ Must match the full path `/api/auth/google`
- ✅ No typos in domain name

### **Step 4: After Adding/Verifying URI**

1. Wait 1-2 minutes for changes to propagate
2. Clear browser cache
3. Try Google login again

---

## 🔍 **Common Issues**

### Issue 1: URI Not Listed
**Solution:** Add the exact URI to "Authorized redirect URIs" in Google Console

### Issue 2: Wrong Domain
**Solution:** Make sure you're using `sunshine-realtors-website.vercel.app` (not a custom domain)

### Issue 3: HTTP vs HTTPS
**Solution:** Must use `https://` (Google requires secure connection)

---

## 📋 **Quick Checklist**

- [ ] Go to Google Cloud Console → Credentials
- [ ] Click on your OAuth Client ID
- [ ] Check "Authorized redirect URIs"
- [ ] Verify/Add: `https://sunshine-realtors-website.vercel.app/api/auth/google`
- [ ] Click Save
- [ ] Wait 1-2 minutes
- [ ] Try login again

---

**Once the redirect URI is verified, Google OAuth will work!**



