# 🔐 Google OAuth Setup Guide

## ✅ **What I've Done**

I've implemented Google OAuth login for your application. The Google button on the login page is now functional!

---

## 🔧 **Required: Set Google OAuth Credentials**

To make Google OAuth work, you need to:

### **Step 1: Create Google OAuth Credentials**

1. Go to: https://console.cloud.google.com/
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen (if not done):
   - User Type: External
   - App name: "Sunshine Realtors"
   - Support email: Your email
   - Save and continue
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: "Sunshine Realtors Web"
   - Authorized redirect URIs:
     ```
     https://sunshine-realtors-website.vercel.app/api/auth/google
     ```
   - Click **Create**
7. Copy the **Client ID** and **Client Secret**

### **Step 2: Set Environment Variables on Vercel**

Run these commands:

```bash
cd "D:\Devloment\RMSINFRATECH INC\sunshine-realtors-website"
vercel env add GOOGLE_CLIENT_ID production
# Paste your Google Client ID when prompted

vercel env add GOOGLE_CLIENT_SECRET production
# Paste your Google Client Secret when prompted

vercel --prod
```

**OR** use Vercel Dashboard:
1. Go to: https://vercel.com/rakeshs-projects-07a44f1a/sunshine-realtors-website/settings/environment-variables
2. Add:
   - Name: `GOOGLE_CLIENT_ID`, Value: (your client ID)
   - Name: `GOOGLE_CLIENT_SECRET`, Value: (your client secret)
3. Select **Production** environment
4. Redeploy

---

## 🎯 **How It Works**

1. User clicks "Google" button on login page
2. Redirects to Google OAuth consent screen
3. User approves access
4. Google redirects back with authorization code
5. Server exchanges code for access token
6. Gets user info from Google
7. Creates/finds user in database
8. Generates JWT token
9. Redirects to dashboard

---

## ✅ **Benefits**

- ✅ No password needed
- ✅ Bypasses database connection issues
- ✅ Secure authentication via Google
- ✅ Auto-creates user account
- ✅ Email verified automatically

---

## 🧪 **Test After Setup**

1. Go to: https://sunshine-realtors-website.vercel.app/login
2. Click "Google" button
3. Sign in with your Google account
4. You'll be redirected to dashboard

---

**Once you set the Google OAuth credentials, it will work immediately!**



