# ⚡ Quick Start - Deploy to Live (5 Minutes)

## 🎯 Goal: Deploy Sunshine Realtors to production using FREE services

---

## Step 1: Create Accounts (2 minutes)

### 1.1 Supabase (Database)
1. Visit: https://supabase.com
2. Click **"Start your project"** → Sign up
3. Click **"New Project"**
4. Fill:
   - Name: `sunshine-realtors`
   - Password: **SAVE THIS PASSWORD!**
   - Region: Choose closest
5. Click **"Create new project"**
6. Wait 2 minutes for setup
7. Go to **Settings** → **Database** → Copy **Connection string (URI)**

### 1.2 Upstash (Redis Cache)
1. Visit: https://upstash.com
2. Sign up for free
3. Click **"Create Database"**
4. Name: `sunshine-redis`
5. Type: **Regional** (choose closest region)
6. Click **"Create"**
7. Copy **Redis URL** (looks like `redis://default:xxx@xxx.upstash.io:6379`)

### 1.3 Firebase (Hosting)
1. Visit: https://console.firebase.google.com
2. Click **"Add project"**
3. Name: `sunshine-realtors`
4. Click **"Create project"**
5. Copy **Project ID** (shown on project page)

---

## Step 2: Configure Project (2 minutes)

### 2.1 Generate Secrets
```bash
cd sunshine-realtors-website
node scripts/generate-secrets.js
```

Copy the output secrets.

### 2.2 Create `.env.local`
Create file `.env.local` in project root:

```env
DATABASE_URL="postgresql://postgres:[YOUR-SUPABASE-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
REDIS_URL="redis://default:[TOKEN]@[REGION].upstash.io:6379"
JWT_SECRET="[PASTE-GENERATED-SECRET-1]"
JWT_REFRESH_SECRET="[PASTE-GENERATED-SECRET-2]"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"
NEXT_PUBLIC_API_URL="/api"
NEXT_PUBLIC_APP_URL="https://[YOUR-FIREBASE-PROJECT-ID].web.app"
APP_ENV="production"
```

**Replace:**
- `[YOUR-SUPABASE-PASSWORD]` - Password from Supabase
- `[PROJECT-REF]` - From Supabase connection string
- `[TOKEN]` - From Upstash Redis URL
- `[REGION]` - From Upstash Redis URL
- `[PASTE-GENERATED-SECRET-1]` and `[PASTE-GENERATED-SECRET-2]` - From step 2.1
- `[YOUR-FIREBASE-PROJECT-ID]` - From Firebase project

### 2.3 Update Firebase Config
Edit `.firebaserc`:
```json
{
  "projects": {
    "default": "[YOUR-FIREBASE-PROJECT-ID]"
  }
}
```

---

## Step 3: Setup Database (1 minute)

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push database schema
npm run db:push
```

✅ Check Supabase dashboard → Table Editor to verify tables created.

---

## Step 4: Deploy (2 minutes)

### 4.1 Install Firebase CLI & Login
```bash
npm install -g firebase-tools
firebase login
```

### 4.2 Initialize Firebase Hosting
```bash
firebase init hosting
```

**Select:**
- ✅ Use existing project → Select your Firebase project
- ✅ Public directory: `out`
- ✅ Single-page app: **Yes**
- ✅ Automatic builds: **No**
- ✅ Overwrite index.html: **No**

### 4.3 Build & Deploy
```bash
npm run build
firebase deploy --only hosting
```

---

## 🎉 Done! Your Site is Live!

Visit: `https://[YOUR-PROJECT-ID].web.app`

---

## ⚠️ Important Note: API Routes

Since we're using static export, API routes (`/api/*`) won't work with Firebase Hosting. 

### Solution Options:

**Option 1: Use Vercel (Recommended - Also FREE)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```
- API routes work automatically
- FREE tier: 100GB bandwidth/month
- Better for Next.js apps

**Option 2: Deploy API Separately**
- Deploy API to Railway/Render/Fly.io (all have free tiers)
- Update `NEXT_PUBLIC_API_URL` to point to your API server

**Option 3: Use Firebase Functions** (Paid after free tier)

---

## 🔧 Troubleshooting

### Database Connection Failed?
- Check Supabase connection string is correct
- Verify password in connection string
- Check if database is paused (unpause in Supabase dashboard)

### Redis Connection Failed?
- Verify Redis URL from Upstash
- Check region matches

### Build Failed?
```bash
# Clear cache and rebuild
rm -rf .next out node_modules/.cache
npm install
npm run build
```

### Deployment Failed?
- Check Firebase login: `firebase login`
- Verify project ID: `firebase projects:list`
- Check `firebase.json` configuration

---

## 📊 Monitor Your Deployment

- **Firebase Console:** https://console.firebase.google.com
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Upstash Dashboard:** https://console.upstash.com

---

## 💰 Cost: $0/month

All services offer generous free tiers perfect for testing with 100 users!

---

**Total Time: ~5 minutes** ⚡
**Total Cost: $0** ✅
**Your Site: LIVE** 🚀



