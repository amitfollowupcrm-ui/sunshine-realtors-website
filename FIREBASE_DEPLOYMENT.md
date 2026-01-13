# 🔥 Firebase Hosting Deployment Guide

## ⚠️ Important Limitations

**Static Export Mode:**
- ❌ API routes (`/api/*`) will NOT work - they'll return 404
- ❌ Server Components won't work (only client components)
- ❌ Server-side rendering (SSR) is disabled
- ✅ Static pages will work fine
- ✅ Client-side rendering works

**Note:** For full functionality including API routes, consider:
1. **Vercel** (recommended) - Full Next.js support
2. **Firebase Functions + Hosting** - More complex setup
3. **Separate API backend** - Deploy API routes elsewhere

## 📋 Pre-Deployment Checklist

- [x] Database schema pushed to Supabase
- [x] Environment variables configured
- [x] Static export enabled in `next.config.js`
- [ ] Firebase project created
- [ ] Firebase CLI installed
- [ ] Firebase login completed

## 🚀 Deployment Steps

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser for authentication.

### Step 3: Initialize Firebase (if not done)

```bash
cd "D:\Devloment\RMSINFRATECH INC\sunshine-realtors-website"
firebase init hosting
```

**Select:**
- Use existing project (or create new)
- Public directory: `out`
- Single-page app: `Yes`
- Set up automatic builds: `No` (or Yes if using GitHub)

### Step 4: Build Static Export

```bash
npm run build
```

This creates the `out` directory with static files.

### Step 5: Deploy to Firebase

```bash
firebase deploy --only hosting
```

### Step 6: Access Your Site

After deployment, you'll get a URL like:
```
https://your-project-id.web.app
https://your-project-id.firebaseapp.com
```

## 🔧 Configuration Files

### `.firebaserc`
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### `firebase.json` (Already configured)
```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 🔐 Environment Variables

**Important:** Client-side environment variables must be prefixed with `NEXT_PUBLIC_`

These are already set in `next.config.js`:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`

**Server-side variables** (DATABASE_URL, JWT_SECRET, etc.) won't be available in static export mode. API calls will need to go to a separate backend.

## 🐛 Troubleshooting

### Build Errors
- Ensure all pages are statically exportable
- Remove any server-only code from pages

### 404 on API Routes
- Expected behavior in static export
- Consider using external API service or Firebase Functions

### Images Not Loading
- Check `images.unoptimized: true` in config
- Use absolute URLs for images

## 📝 Post-Deployment

1. **Update `NEXT_PUBLIC_APP_URL`** to your Firebase hosting URL
2. **Test all pages** to ensure they load correctly
3. **Set up custom domain** (optional) in Firebase Console
4. **Configure HTTPS** (automatic with Firebase)

## 🔄 Continuous Deployment

To set up automatic deployments:

1. Connect GitHub repository to Firebase
2. Enable GitHub Actions in Firebase Console
3. Push to main branch triggers auto-deploy

---

**Status:** ✅ Configured for Firebase Hosting Static Export




