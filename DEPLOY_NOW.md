# 🚀 LIVE DEPLOYMENT - Step by Step Guide

## Let's Deploy Your Site Right Now!

Follow these steps in order. I'll help you through each one.

---

## ✅ STEP 1: Check Prerequisites

**Run these commands to verify:**

```powershell
node --version    # Should be 20 or higher
npm --version     # Should be 8 or higher
```

✅ Node.js: v22.17.1 (Good!)  
✅ npm: 10.9.2 (Good!)

**Great! You're ready to proceed.**

---

## 📦 STEP 2: Install Dependencies

**Run this command:**

```powershell
cd sunshine-realtors-website
npm install
```

**Wait for it to complete** (may take 2-3 minutes)

---

## 🔐 STEP 3: Generate Secrets

**Run this command:**

```powershell
node scripts/generate-secrets.js
```

**Copy the two secrets that appear** - you'll need them soon!

---

## 🌐 STEP 4: Create Accounts (5 minutes)

### 4.1 Supabase (Database) - FREE

1. **Go to:** https://supabase.com
2. **Click:** "Start your project"
3. **Sign up** (use Google/Email)
4. **Click:** "New Project"
5. **Fill in:**
   - Name: `sunshine-realtors`
   - Database Password: **Create a strong password** (SAVE IT!)
   - Region: Choose closest (e.g., `Southeast Asia (Mumbai)`)
6. **Click:** "Create new project"
7. **Wait 1-2 minutes** for setup
8. **Go to:** Settings → Database
9. **Find:** "Connection string"
10. **Copy:** The URI connection string
    - Looks like: `postgresql://postgres.xxxx:xxxx@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`
11. **Save this URL** - we'll use it in Step 6

### 4.2 Upstash (Redis Cache) - FREE

1. **Go to:** https://upstash.com
2. **Sign up** (GitHub recommended)
3. **Click:** "Create Database"
4. **Fill in:**
   - Name: `sunshine-redis`
   - Type: **Regional**
   - Region: Choose closest
   - Plan: **Free**
5. **Click:** "Create"
6. **Copy:** The Redis URL
    - Looks like: `redis://default:xxxxx@xxxxx.upstash.io:6379`
7. **Save this URL** - we'll use it in Step 6

### 4.3 Vercel (Hosting) - FREE

1. **Go to:** https://vercel.com
2. **Sign up** (GitHub recommended - easiest)
3. **Complete signup**
4. **You're done!** We'll deploy in Step 9

---

## 📝 STEP 5: Create Environment File

**Create a file named `.env.local` in the `sunshine-realtors-website` folder**

**Copy this template and fill in your values:**

```env
DATABASE_URL="[PASTE SUPABASE URL FROM STEP 4.1]"
REDIS_URL="[PASTE UPSTASH URL FROM STEP 4.2]"
JWT_SECRET="[PASTE FIRST SECRET FROM STEP 3]"
JWT_REFRESH_SECRET="[PASTE SECOND SECRET FROM STEP 3]"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"
NEXT_PUBLIC_API_URL="/api"
NEXT_PUBLIC_APP_URL="https://sunshine-realtors.vercel.app"
APP_ENV="production"
```

**Replace all the `[PASTE ...]` parts with your actual values!**

---

## 🗄️ STEP 6: Setup Database Schema

**Run these commands:**

```powershell
cd sunshine-realtors-website
npm run db:generate
npm run db:push
```

**Wait for completion** - this creates all tables in Supabase.

**Verify:** Go to Supabase dashboard → Table Editor → You should see tables!

---

## ✅ STEP 7: Test Locally (Optional but Recommended)

**Run this command:**

```powershell
npm run dev
```

**Visit:** http://localhost:3000

**Check if:**
- ✅ Site loads
- ✅ No major errors in console
- ✅ Database connection works

**If everything looks good, press `Ctrl+C` to stop the dev server.**

---

## 🚀 STEP 8: Install Vercel CLI

**Run this command:**

```powershell
npm install -g vercel
```

**Wait for installation to complete.**

---

## 🎯 STEP 9: Deploy to Vercel - GET YOUR LIVE URL!

**Run this command:**

```powershell
cd sunshine-realtors-website
vercel login
```

**This will:**
- Open your browser
- Ask you to login to Vercel
- Complete authentication

**After login, run:**

```powershell
vercel
```

**Answer the prompts:**

1. **Set up and deploy?** → Type `Y` and press Enter
2. **Which scope?** → Select your account (use arrow keys, press Enter)
3. **Link to existing project?** → Type `N` and press Enter
4. **What's your project's name?** → Type `sunshine-realtors` (or any name) and press Enter
5. **In which directory is your code located?** → Just press Enter (default is `./`)
6. **Want to override the settings?** → Type `N` and press Enter

**Vercel will now:**
- Detect Next.js automatically
- Start building your project
- Ask for environment variables

**When asked for environment variables, enter them one by one:**

```
DATABASE_URL
[Paste your Supabase URL]
Press Enter

REDIS_URL
[Paste your Upstash URL]
Press Enter

JWT_SECRET
[Paste first secret from Step 3]
Press Enter

JWT_REFRESH_SECRET
[Paste second secret from Step 3]
Press Enter

JWT_EXPIRES_IN
1h
Press Enter

JWT_REFRESH_EXPIRES_IN
7d
Press Enter

NEXT_PUBLIC_API_URL
/api
Press Enter

APP_ENV
production
Press Enter
```

**After entering all variables, Vercel will:**
- Build your project
- Deploy it
- **Give you your LIVE URL!** 🎉

---

## 🎊 STEP 10: You're Live!

**Your site is now live at:**
- `https://sunshine-realtors.vercel.app`
- Or: `https://sunshine-realtors-[random].vercel.app`

**What you can do:**
- ✅ Visit your URL
- ✅ Share it with others
- ✅ Test all features
- ✅ Access admin panel at `/admin`

---

## 🔄 Next Deployments

**For future updates, just run:**

```powershell
vercel
```

**Or deploy from Git** (if connected):
- Push to GitHub
- Vercel auto-deploys!

---

## 🆘 Need Help?

**If something fails:**

1. **Check the error message**
2. **Verify environment variables are correct**
3. **Check database connection**
4. **Try again!**

**Common fixes:**
- Clear cache: `rm -rf .next node_modules/.cache`
- Reinstall: `rm -rf node_modules && npm install`
- Re-run: `npm run db:push`

---

## 📊 Monitor Your Site

**Check these dashboards:**

- **Vercel:** https://vercel.com/dashboard
- **Supabase:** https://supabase.com/dashboard
- **Upstash:** https://console.upstash.com

---

## ✅ Quick Checklist

- [ ] Step 1: Prerequisites checked
- [ ] Step 2: Dependencies installed
- [ ] Step 3: Secrets generated
- [ ] Step 4: Accounts created (Supabase, Upstash, Vercel)
- [ ] Step 5: `.env.local` file created
- [ ] Step 6: Database schema pushed
- [ ] Step 7: Local test passed (optional)
- [ ] Step 8: Vercel CLI installed
- [ ] Step 9: Deployed to Vercel
- [ ] Step 10: Site is LIVE! 🎉

---

**Let's start! Begin with Step 1 and work through each step.**

**Time needed: ~15-20 minutes**  
**Cost: $0 (all FREE!)**  
**Result: Live URL! 🚀**

