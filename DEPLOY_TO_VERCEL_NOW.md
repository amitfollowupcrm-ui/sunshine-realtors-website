# 🚀 Deploy Sunshine Realtors to Vercel - Step by Step

## ✅ Prerequisites Completed

- ✅ Database (Supabase PostgreSQL) - Connected
- ✅ Cache (Upstash Redis) - Configured  
- ✅ Schema - Synced to database
- ✅ Environment variables - Ready

## 🎯 Quick Deployment (5 minutes)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)**
   - Sign up/Login (free account works)

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your Git repository OR
   - Drag and drop the `sunshine-realtors-website` folder

3. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `sunshine-realtors-website`
   - **Build Command:** `npm run build` (auto)
   - **Output Directory:** `.next` (auto)
   - **Install Command:** `npm install` (auto)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```env
   DATABASE_URL=postgresql://postgres:@16Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres
   REDIS_URL=rediss://default:AWt7AAIncDI3ZTg5ODZkNDFhMjg0NjQwODBiMDQ5NWIzYjAzYzY2NnAyMjc1MTU@outgoing-mole-27515.upstash.io:6379
   JWT_SECRET=your-production-jwt-secret-change-this-in-production
   JWT_REFRESH_SECRET=your-production-jwt-refresh-secret-change-this-in-production
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d
   NODE_ENV=production
   ```

5. **Before Deploying - Update next.config.js**
   
   We need to temporarily remove `output: 'export'` for Vercel:
   
   ```javascript
   // Comment out this line:
   // output: 'export',
   ```

6. **Click "Deploy"**
   - Vercel will build and deploy automatically
   - Takes 2-3 minutes

7. **Get Your Live URL**
   - After deployment, you'll get: `https://your-project.vercel.app`
   - This URL works globally!

---

### Option 2: Deploy via Vercel CLI (Fastest)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to project
cd sunshine-realtors-website

# 3. Login to Vercel
vercel login

# 4. Deploy (first time - follow prompts)
vercel

# When asked:
# - Link to existing project? No
# - Project name: sunshine-realtors (or your choice)
# - Directory: ./
# - Override settings? No

# 5. Set environment variables
vercel env add DATABASE_URL
# Paste: postgresql://postgres:@16Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres

vercel env add REDIS_URL
# Paste: rediss://default:AWt7AAIncDI3ZTg5ODZkNDFhMjg0NjQwODBiMDQ5NWIzYjAzYzY2NnAyMjc1MTU@outgoing-mole-27515.upstash.io:6379

vercel env add JWT_SECRET
# Paste: your-production-jwt-secret-change-this

vercel env add JWT_REFRESH_SECRET
# Paste: your-production-jwt-refresh-secret-change-this

vercel env add JWT_EXPIRES_IN
# Paste: 24h

vercel env add JWT_REFRESH_EXPIRES_IN
# Paste: 7d

vercel env add NODE_ENV
# Paste: production

# 6. Deploy to production
vercel --prod
```

---

## ⚙️ Important: Update next.config.js First!

Before deploying, you **must** update `next.config.js`:

### Current (Firebase - Static):
```javascript
output: 'export', // ❌ Remove for Vercel
```

### For Vercel (Dynamic):
```javascript
// output: 'export', // ✅ Commented out for Vercel
```

**OR** use `next.config.vercel.js` (copy it and rename to `next.config.js`)

---

## 🎉 After Deployment

Your app will be live at:
- **Production URL:** `https://your-project.vercel.app`
- **API Routes:** `https://your-project.vercel.app/api/*`
- **Full Database Access:** ✅ Connected to Supabase
- **Redis Cache:** ✅ Connected to Upstash
- **Global CDN:** ✅ Fast loading worldwide

---

## 🔄 What Happens

1. **Frontend Pages:** All your React pages render server-side or client-side
2. **API Routes:** All `/app/api/**/route.ts` become serverless functions
3. **Database:** Prisma connects to Supabase PostgreSQL
4. **Cache:** Redis caching works via Upstash
5. **Images:** Next.js Image optimization enabled
6. **Performance:** Automatic code splitting, edge caching, etc.

---

## 🆘 Troubleshooting

### Build Fails?
- Check environment variables are set correctly
- Ensure `output: 'export'` is commented out in `next.config.js`
- Check build logs in Vercel dashboard

### Database Connection Issues?
- Verify `DATABASE_URL` is correct
- Check Supabase connection settings
- Ensure database is accessible from Vercel IPs

### API Routes Not Working?
- Verify `next.config.js` doesn't have `output: 'export'`
- Check API route files exist in `/app/api/**/route.ts`
- Check Vercel function logs

---

## 📊 Monitoring

- **Vercel Dashboard:** Real-time logs, analytics, deployments
- **Supabase Dashboard:** Database queries, connections
- **Upstash Dashboard:** Redis cache usage, performance

---

## 🎯 Next Steps After Deployment

1. ✅ Test authentication endpoints
2. ✅ Test property listings API
3. ✅ Test lead management API
4. ✅ Set up custom domain (optional)
5. ✅ Configure production JWT secrets (important!)

---

## 💰 Cost

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Serverless function execution time
- Unlimited deployments
- Perfect for 100+ users

**Scales automatically as you grow!**



