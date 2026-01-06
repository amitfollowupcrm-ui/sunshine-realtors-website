# 🏢 Sunshine Realtors Group - Enterprise Real Estate Marketplace

> Production-ready, enterprise-grade real estate marketplace for North India. Built to compete with 99acres, Magicbricks, and Housing.com.

## 🎯 Project Overview

**Sunshine Realtors Group** is a comprehensive real estate platform serving **Punjab, Haryana, Himachal Pradesh, Delhi NCR, Rajasthan, UP, Uttarakhand, and J&K**.

### Key Features

- ✅ **Public Marketplace** - Buy, Rent, New Launch, Commercial, Plots
- ✅ **Advanced Search** - Typo-tolerant, fast, filter-rich property search
- ✅ **Role-Based Access** - Buyers, Sellers, Tenants, Dealers, Distributors, Admin
- ✅ **Property Listings** - Full media support, moderation workflow, SEO-optimized
- ✅ **Lead Management** - Inquiry system with CRM integration
- ✅ **Dealer Network** - B2B distributor model with commission tracking
- ✅ **CRM Integration** - Real-time bidirectional sync with external CRM
- ✅ **Admin Panel** - Moderation, analytics, user management
- ✅ **SEO Optimized** - Schema markup, city/locality pages, blog support

---

## 🏗️ Architecture

- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes + NestJS (API Gateway)
- **Database:** PostgreSQL 15+ with Prisma ORM
- **Cache:** Redis (sessions, queries, rate limiting)
- **Search:** Elasticsearch (advanced property search)
- **Storage:** AWS S3 / Google Cloud Storage (media files)
- **CDN:** CloudFront / Cloud CDN
- **Authentication:** NextAuth.js + JWT
- **CRM:** REST API + Webhooks (bidirectional sync)

### Documentation

- 📘 [System Architecture](./ARCHITECTURE.md) - Complete system design
- 🗄️ [Database Schema](./DATABASE_SCHEMA.md) - PostgreSQL schema with ER diagrams
- 🔌 [API Contracts](./API_CONTRACTS.md) - REST API specification
- 🔗 [CRM Integration](./CRM_INTEGRATION.md) - CRM sync strategy

---

## 📋 Prerequisites

- **Node.js** 20+ 
- **PostgreSQL** 15+
- **Redis** 7+
- **npm** or **yarn** or **pnpm**

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
cd sunshine-realtors-website
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `NEXTAUTH_SECRET` - NextAuth secret
- `CRM_API_URL` - External CRM API URL (if using CRM)
- `AWS_S3_BUCKET` - S3 bucket for media storage

### 3. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed database
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
sunshine-realtors-website/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (public)/          # Public marketplace
│   │   ├── buy/
│   │   ├── rent/
│   │   ├── new-launch/
│   │   ├── commercial/
│   │   └── plots/
│   ├── (dashboard)/       # Protected user dashboards
│   ├── api/               # API routes
│   └── admin/             # Admin panel
│
├── components/            # React components
│   ├── ui/               # Reusable UI primitives
│   ├── property/         # Property components
│   ├── search/           # Search & filters
│   ├── dashboard/        # Dashboard components
│   └── admin/            # Admin components
│
├── lib/                  # Core libraries
│   ├── db/              # Prisma client
│   ├── redis/           # Redis client
│   ├── services/        # Business logic
│   │   ├── property.service.ts
│   │   ├── search.service.ts
│   │   ├── lead.service.ts
│   │   └── crm.service.ts
│   ├── auth/            # Authentication
│   └── validation/      # Zod schemas
│
├── types/               # TypeScript types
├── prisma/              # Database schema
├── config/              # Configuration files
└── public/              # Static assets
```

---

## 🔐 Authentication & Authorization

### User Roles

- **BUYER** - Browse properties, create inquiries
- **SELLER** - List properties, manage listings
- **TENANT** - Browse rental properties
- **OWNER** - Manage owned properties
- **DEALER** - List properties, manage leads, commission tracking
- **DISTRIBUTOR** - Manage dealer network, territory assignment
- **INTERNAL_SALES** - Sales team access
- **INTERNAL_MARKETING** - Marketing team access
- **INTERNAL_OPS** - Operations team, moderation
- **ADMIN** - Full system access
- **SUPER_ADMIN** - Complete system control

### Role Permissions

See [user.types.ts](./types/user.types.ts) for detailed permission matrix.

---

## 🔍 Search & Filtering

### Search Features

- **Full-text search** - Property titles, descriptions
- **Autocomplete** - City, locality, project names
- **Typo tolerance** - Fuzzy matching
- **Advanced filters** - Budget, area, bedrooms, amenities, etc.
- **Location search** - City, locality, sector, zone
- **Map search** - Radius-based proximity search

### Performance

- **Redis caching** - Search results cached for 5-60 minutes
- **Database indexing** - Optimized indexes on search columns
- **Elasticsearch** - For complex full-text queries

---

## 🔗 CRM Integration

### Features

- **Real-time sync** - Bidirectional lead sync
- **Event-driven** - Property/lead events trigger sync
- **Retry logic** - Automatic retry on failures
- **Webhook support** - Receive updates from CRM
- **Status mapping** - Map internal statuses to CRM statuses

See [CRM Integration Guide](./CRM_INTEGRATION.md) for details.

---

## 📊 Admin Features

### Moderation

- Property verification workflow
- Bulk moderation actions
- Rejection reasons
- Auto-expiry handling

### Analytics

- Traffic metrics (views, visitors, page views)
- Conversion tracking (leads, inquiries, sales)
- Property analytics (views, inquiries, conversion rates)
- Dealer performance metrics
- City-wise performance
- Lead funnel analysis

### User Management

- User CRUD operations
- Role assignment
- Profile management
- Activity logs

---

## 🚢 Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Redis cluster setup
- [ ] S3/Cloud Storage configured
- [ ] CDN configured
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] Monitoring setup (DataDog/Sentry)
- [ ] Backup strategy configured
- [ ] CRM integration tested

### Deployment Options

1. **Vercel** (Recommended for Next.js)
   ```bash
   vercel deploy --prod
   ```

2. **AWS** (ECS Fargate / EC2)
   - See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide

3. **Docker**
   ```bash
   docker build -t sunshine-realtors .
   docker run -p 3000:3000 sunshine-realtors
   ```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

---

## 📈 Performance Targets

- **API Response Time:** <300ms (p95)
- **Page Load:** <2s (First Contentful Paint)
- **Search Response:** <500ms
- **Uptime:** 99.9% SLA
- **Lighthouse Score:** 95+ (Performance, SEO, Accessibility)

---

## 🔒 Security

- **JWT Authentication** - Access + refresh tokens
- **Rate Limiting** - Per-IP, per-user limits
- **Input Validation** - Zod schemas
- **SQL Injection Prevention** - Prisma parameterized queries
- **XSS Prevention** - React auto-escaping, CSP headers
- **CSRF Protection** - SameSite cookies, CSRF tokens
- **Audit Logging** - All admin actions logged

---

## 📚 API Documentation

See [API Contracts](./API_CONTRACTS.md) for complete API specification.

**Base URL:** `https://api.sunshinerealtors.com/v1`

**Authentication:** Bearer Token (JWT)

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Write tests
4. Submit PR

---

## 📝 License

Proprietary - Sunshine Realtors Group

---

## 📞 Support

For issues or questions:
- 📧 Email: dev@sunshinerealtors.com
- 📖 Documentation: See `/docs` folder
- 🐛 Issues: Internal issue tracker

---

**Built with ❤️ for Sunshine Realtors Group**

**Version:** 1.0.0  
**Last Updated:** January 2025
