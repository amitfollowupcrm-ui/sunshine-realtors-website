# 🎯 VERY SIMPLE STEPS - Create Web Application Client

## **Step-by-Step Instructions**

### **Step 1: Find the Form on the Page**

On the page that says **"Create OAuth client ID"**, scroll down until you see:
- A field labeled **"Application type"** with a dropdown
- A field labeled **"Name"** (optional)

### **Step 2: Open the Dropdown**

1. Click on the **"Application type"** dropdown
2. You should see a list like:
   - Web application
   - Android
   - Chrome Extension
   - iOS
   - TVs and Limited Input devices
   - Desktop app
   - Universal Windows Platform (UWP)

### **Step 3: Select "Web application"**

1. Click on **"Web application"** (it's the FIRST option in the list)
2. After selecting, you'll see new fields appear below:
   - **"Name"** (optional)
   - **"Authorized JavaScript origins"**
   - **"Authorized redirect URIs"**

### **Step 4: Fill in the Form**

1. **Name:** Type "Sunshine Realtors Web"
2. **Authorized redirect URIs:** 
   - Click the **"+ ADD URI"** button
   - Type or paste: `https://sunshine-realtors-website.vercel.app/api/auth/google-callback`
3. Leave other fields empty (they're optional)

### **Step 5: Create the Client**

1. Scroll down
2. Click the blue **"CREATE"** button

### **Step 6: Copy the Credentials**

After clicking CREATE, a popup will show:
- **Your Client ID** (copy this - starts with numbers)
- **Your Client Secret** (copy this - starts with "GOCSPX-")

---

## ❓ **If You Still Don't See "Web application" Option**

**Try this:**
1. Click the dropdown
2. Press the **Down Arrow** key on your keyboard to scroll through options
3. Or type "Web" to filter/search

**OR** tell me what options you DO see, and I'll help you choose the right one!

---

## 📋 **What to Send Me**

After creating the client, send me:
1. **Client ID:** (the long number)
2. **Client Secret:** (starts with GOCSPX-)

Then I'll update Vercel and Google login will work!

