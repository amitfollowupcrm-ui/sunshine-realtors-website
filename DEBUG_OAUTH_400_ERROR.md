# 🔍 Debugging Google OAuth 400 Error

## **The Error:**
Google is returning: **"400. That's an error. The server cannot process the request because it is malformed."**

This usually means:
1. ❌ **Redirect URI is NOT added** in Google Cloud Console
2. ❌ **Redirect URI is incorrect** (typo or wrong URL)
3. ❌ **OAuth consent screen not configured** properly

---

## **✅ Step 1: Verify Redirect URI is Added**

### **Check in Google Cloud Console:**

1. Go to: https://console.cloud.google.com/apis/credentials?project=rms-infratech
2. Click on: **"rms infratech"** (Web application client)
3. Scroll to: **"Authorized redirect URIs"**
4. **Verify you see:**
   ```
   https://sunshine-realtors-website.vercel.app/api/auth/google-callback
   ```

### **If it's NOT there:**
- Click **"+ ADD URI"**
- Paste: `https://sunshine-realtors-website.vercel.app/api/auth/google-callback`
- Click **"SAVE"**

### **If it IS there but has a typo:**
- Click the **pencil/edit icon** next to the URI
- Make sure it's EXACTLY: `https://sunshine-realtors-website.vercel.app/api/auth/google-callback`
- No trailing slashes, no spaces, exact match!

---

## **✅ Step 2: Verify OAuth Consent Screen**

1. Go to: https://console.cloud.google.com/apis/credentials/consent?project=rms-infratech
2. Make sure:
   - **User Type:** External (or Internal if using Google Workspace)
   - **App name:** Something like "Sunshine Realtors"
   - **User support email:** Your email
   - **Authorized domains:** (can be empty for testing)
   - **Save and Continue** through all steps
   - At the end, make sure it says **"Published"** or **"In production"**

---

## **✅ Step 3: Check Client ID Matches**

**In Google Cloud Console:**
- Client ID: `728883357446-vpfeok83pfgh75gh9ve27ss2rokrgrhc.apps.googleusercontent.com`

**On Vercel:**
- Should match exactly (I've already set this)

---

## **🔧 Step 4: Test the Redirect URI Directly**

1. Go to: https://sunshine-realtors-website.vercel.app/api/auth/google
2. This should redirect you to Google
3. After Google login, it should redirect back to `/api/auth/google-callback`

If step 3 fails, Google is rejecting the redirect URI.

---

## **⚠️ Common Issues:**

1. **Trailing slash:** 
   - ❌ `https://sunshine-realtors-website.vercel.app/api/auth/google-callback/`
   - ✅ `https://sunshine-realtors-website.vercel.app/api/auth/google-callback`

2. **HTTP vs HTTPS:**
   - ❌ `http://sunshine-realtors-website.vercel.app/api/auth/google-callback`
   - ✅ `https://sunshine-realtors-website.vercel.app/api/auth/google-callback`

3. **Wrong path:**
   - ❌ `/api/auth/google` (wrong - this is the initiator, not the callback)
   - ✅ `/api/auth/google-callback`

---

## **🎯 Quick Fix:**

**Please verify:**
1. Go to the "rms infratech" client
2. Check the "Authorized redirect URIs" section
3. Tell me:
   - Is `https://sunshine-realtors-website.vercel.app/api/auth/google-callback` listed?
   - If yes, is it EXACTLY that (no extra spaces, slashes, or characters)?
   - If no, add it and save!

Then try again! 🚀


