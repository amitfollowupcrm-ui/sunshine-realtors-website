# ✅ Final OAuth Setup Steps

## **Client ID Received:**
```
728883357446-vpfeok83pfgh75gh9ve27ss2rokrgrhc.apps.googleusercontent.com
```

---

## **✅ What You Need to Do:**

### **Step 1: Add Redirect URI to the Client**

1. Go to: https://console.cloud.google.com/apis/credentials?project=rms-infratech
2. Click on **"rms infratech"** (the Web application client)
3. Scroll down to **"Authorized redirect URIs"**
4. Click **"+ ADD URI"**
5. Add: `https://sunshine-realtors-website.vercel.app/api/auth/google-callback`
6. Click **"SAVE"**

### **Step 2: Get the Client Secret**

On the same page (after clicking "rms infratech"):
- Look for **"Client secrets"** section
- You should see a secret (masked like `*******`)
- If you don't see it, you might need to:
  - Click **"+ Add secret"** to create a new one
  - Or it might be hidden (Google hides secrets for security)

**Send me the Client Secret** (it starts with `GOCSPX-`)

---

## **After You Share the Client Secret:**

I'll update Vercel with:
- ✅ Client ID: `728883357446-vpfeok83pfgh75gh9ve27ss2rokrgrhc.apps.googleusercontent.com`
- ⏳ Client Secret: (waiting for you)

Then Google login will work! 🎉

---

**Note:** If you can't see the Client Secret, you might need to create a new one or use the existing "Sunshine Realtors" Desktop client's secret (though Desktop clients don't use redirect URIs the same way).


