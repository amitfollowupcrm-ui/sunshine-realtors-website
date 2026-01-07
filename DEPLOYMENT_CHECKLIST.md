# ✅ Deployment Checklist

## Pre-Deployment

### Accounts Setup
- [ ] Firebase account created
- [ ] Supabase account created
- [ ] Upstash account created
- [ ] All accounts verified

### Database Setup
- [ ] Supabase project created
- [ ] Database connection string obtained
- [ ] Database password saved securely
- [ ] Database schema pushed (`npm run db:push`)
- [ ] Tables verified in Supabase dashboard

### Redis Setup
- [ ] Upstash account created
- [ ] Redis database created
- [ ] Redis URL obtained
- [ ] Redis connection tested

### Firebase Setup
- [ ] Firebase project created
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Firebase CLI logged in (`firebase login`)
- [ ] Firebase initialized (`firebase init hosting`)
- [ ] `.firebaserc` updated with project ID
- [ ] `firebase.json` configured

### Environment Variables
- [ ] `.env.local` file created
- [ ] `DATABASE_URL` from Supabase added
- [ ] `REDIS_URL` from Upstash added
- [ ] JWT secrets generated (`npm run generate:secrets`)
- [ ] All secrets added to `.env.local`
- [ ] `.env.local` added to `.gitignore` (not committed)

### Code Preparation
- [ ] Dependencies installed (`npm install`)
- [ ] Prisma Client generated (`npm run db:generate`)
- [ ] Code tested locally (`npm run dev`)
- [ ] Build successful (`npm run build`)

## Deployment

### Build & Deploy
- [ ] Project built (`npm run build`)
- [ ] Build output verified (`out/` folder exists)
- [ ] Deployed to Firebase (`firebase deploy --only hosting`)
- [ ] Deployment successful
- [ ] Site accessible at Firebase URL

### Post-Deployment

### Verification
- [ ] Site loads correctly
- [ ] No console errors
- [ ] Database connection working
- [ ] Redis cache working
- [ ] Authentication working
- [ ] Property listings loading
- [ ] Search functionality working

### Security
- [ ] All secrets secured (not in code)
- [ ] HTTPS enabled (automatic with Firebase)
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Input validation working

### Monitoring
- [ ] Firebase Analytics setup (optional)
- [ ] Error tracking setup (optional)
- [ ] Database usage monitored
- [ ] Redis usage monitored
- [ ] Traffic monitoring active

## Optional Enhancements

### Custom Domain
- [ ] Custom domain added to Firebase
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Domain verified

### Performance
- [ ] CDN configured
- [ ] Image optimization active
- [ ] Caching headers set
- [ ] Gzip compression active

### SEO
- [ ] Meta tags verified
- [ ] Sitemap generated
- [ ] Google Search Console setup
- [ ] Robots.txt configured

---

## Quick Deployment Commands

```bash
# 1. Setup
npm install
npm run generate:secrets
# Update .env.local with secrets

# 2. Database
npm run db:generate
npm run db:push

# 3. Firebase
firebase login
firebase init hosting
# Select project, set public dir to "out"

# 4. Build & Deploy
npm run build
firebase deploy --only hosting

# Or use the shortcut:
npm run deploy
```

---

## Troubleshooting Commands

```bash
# Clear build cache
rm -rf .next out node_modules/.cache

# Reinstall dependencies
rm -rf node_modules
npm install

# Regenerate Prisma
npm run db:generate

# Test database connection
npm run db:studio

# Check Firebase status
firebase projects:list
firebase use --add
```

---

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete




