# 🏗️ Sunshine Realtors Group - Enterprise Architecture

## Executive Summary

Sunshine Realtors Group is a production-ready, enterprise-grade real estate marketplace designed to compete with 99acres, Magicbricks, and Housing.com. Built for scale, performance, security, and seamless CRM integration.

---

## 🎯 System Overview

### Business Goals
- **Scale:** 20,000-30,000 daily active users, 5,000+ peak concurrency
- **Performance:** <300ms API response time, 95+ Lighthouse score
- **SEO:** First-page rankings for property searches in North India
- **CRM Integration:** Real-time bidirectional sync with existing CRM
- **Market Coverage:** Punjab, Haryana, Himachal Pradesh, Delhi NCR, Rajasthan, UP, Uttarakhand, J&K

---

## 🏛️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CDN Layer                                │
│              (Cloudflare / AWS CloudFront)                       │
│              Static Assets, Images, Media                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Load Balancer                                 │
│              (NGINX / AWS ALB)                                   │
│              SSL Termination, Rate Limiting                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│   Next.js App  │  │   Next.js App   │  │   Next.js App  │
│   (Instance 1) │  │   (Instance 2)  │  │   (Instance N) │
│                │  │                 │  │                │
│  • SSR/SSG     │  │  • SSR/SSG      │  │  • SSR/SSG     │
│  • API Routes  │  │  • API Routes   │  │  • API Routes  │
│  • Server Ctx  │  │  • Server Ctx   │  │  • Server Ctx  │
└───────┬────────┘  └────────┬────────┘  └───────┬────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  API Gateway   │  │   Background    │  │   Webhook      │
│  (NestJS)      │  │   Jobs (Bull)   │  │   Handler      │
│                │  │                 │  │                │
│  • Auth        │  │  • Search Index │  │  • CRM Sync    │
│  • Business    │  │  • Notifications│  │  • Events      │
│  • Search      │  │  • Reports      │  │  • Webhooks    │
└───────┬────────┘  └────────┬────────┘  └───────┬────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  PostgreSQL    │  │      Redis      │  │  Elasticsearch │
│  (Primary DB)  │  │   (Cache/Session│  │   (Search)     │
│                │  │    Queue/Rate)  │  │                │
│  • Users       │  │  • Session Store│  │  • Property    │
│  • Properties  │  │  • Query Cache  │  │    Search      │
│  • Transactions│  │  • Rate Limits  │  │  • Analytics   │
│  • CRM Sync    │  │  • Job Queue    │  │                │
└────────────────┘  └─────────────────┘  └────────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│   S3 / GCS     │  │   External      │  │   Monitoring   │
│   (Media)      │  │   CRM System    │  │   (DataDog)    │
│                │  │                 │  │                │
│  • Images      │  │  • REST API     │  │  • Logs        │
│  • Videos      │  │  • Webhooks     │  │  • Metrics     │
│  • Documents   │  │  • Auth Token   │  │  • Alerts      │
└────────────────┘  └─────────────────┘  └────────────────┘
```

---

## 📊 Data Flow Architecture

### User Request Flow
1. **CDN** → Static assets (JS, CSS, images) served from edge
2. **Load Balancer** → Routes to healthy Next.js instance
3. **Next.js** → Server-side rendering or API route execution
4. **API Gateway** → Business logic, authentication, authorization
5. **Database** → PostgreSQL for transactional data
6. **Cache** → Redis for frequently accessed data
7. **Search** → Elasticsearch for complex property queries

### CRM Integration Flow
1. **Property Created/Updated** → Event triggered
2. **Webhook Queue** → Background job enqueued
3. **CRM API Call** → REST API to external CRM
4. **Retry Logic** → Exponential backoff on failure
5. **Sync Status** → Tracked in `crm_sync_logs` table
6. **Bidirectional** → CRM can also push updates via webhook endpoint

---

## 🔐 Security Architecture

### Authentication & Authorization
- **JWT Tokens** (access + refresh token pattern)
- **NextAuth.js** for OAuth providers (Google, Facebook)
- **Role-Based Access Control (RBAC)** with permissions matrix
- **Session Management** via Redis
- **MFA Support** for admin/dealer accounts

### Data Protection
- **HTTPS Only** (TLS 1.3)
- **Input Validation** (Zod schemas)
- **SQL Injection Prevention** (Parameterized queries via Prisma)
- **XSS Prevention** (React auto-escaping, CSP headers)
- **CSRF Protection** (SameSite cookies, CSRF tokens)
- **Rate Limiting** (Redis-based, per-IP, per-user)
- **File Upload Security** (File type validation, virus scanning, size limits)

### Audit & Compliance
- **Audit Logs** for all admin/dealer actions
- **GDPR Compliance** (data export, deletion requests)
- **PCI Compliance** (if payment processing added later)

---

## 🚀 Performance Strategy

### Caching Layers
1. **CDN Cache** → Static assets, images (1 year TTL)
2. **Redis Cache** → API responses, search results (5-60 min TTL)
3. **Next.js Cache** → ISR for property pages (revalidate: 1 hour)
4. **Database Query Cache** → Frequently accessed queries (1 hour TTL)

### Optimization Techniques
- **Image Optimization** → Next.js Image, WebP/AVIF, lazy loading
- **Code Splitting** → Route-based, component-based
- **Server Components** → Reduce client-side JS bundle
- **Database Indexing** → Optimized indexes on search columns
- **Connection Pooling** → Prisma connection pool
- **Search Indexing** → Elasticsearch with dedicated analyzer

### Performance Targets
- **API Response:** <300ms (p95)
- **Page Load:** <2s (First Contentful Paint)
- **Time to Interactive:** <3.5s
- **Lighthouse Score:** 95+ (Performance, SEO, Accessibility)

---

## 🔗 CRM Integration Architecture

### Integration Pattern: Event-Driven + REST

```
┌──────────────────────────────────────────────────────────────┐
│                    Sunshine Platform                         │
│                                                              │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │   Property   │───▶  │  Event Bus   │───▶  │  Webhook  │ │
│  │   Service    │      │   (Redis)    │      │  Handler  │ │
│  └──────────────┘      └──────────────┘      └─────┬─────┘ │
│                                                     │       │
│  ┌──────────────┐      ┌──────────────┐            │       │
│  │     Lead     │───▶  │  Event Bus   │────────────┘       │
│  │   Service    │      │   (Redis)    │                    │
│  └──────────────┘      └──────────────┘                    │
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │   CRM Sync   │◀───  │   Retry      │                    │
│  │   Service    │      │   Queue      │                    │
│  └──────┬───────┘      └──────────────┘                    │
│         │                                                   │
└─────────┼───────────────────────────────────────────────────┘
          │
          │ REST API / Webhook
          │
┌─────────▼───────────────────────────────────────────────────┐
│                  External CRM System                         │
│                                                              │
│  • Lead Management                                          │
│  • Sales Pipeline                                           │
│  • Agent Assignment                                         │
│  • Marketing Attribution                                    │
│  • Partner Tracking                                         │
└──────────────────────────────────────────────────────────────┘
```

### Sync Events
- **Property Created** → Create lead in CRM
- **Property Updated** → Update lead status
- **Inquiry Generated** → Create inquiry in CRM
- **Contact Form Submitted** → Create contact in CRM
- **Dealer Activity** → Update dealer metrics in CRM
- **Property Verified** → Mark lead as verified in CRM

### Data Mapping
- **Property** ↔ **Lead** (Property details → Lead details)
- **User (Buyer)** ↔ **Contact** (User profile → Contact profile)
- **Inquiry** ↔ **Activity** (Inquiry → CRM activity log)
- **Dealer** ↔ **Partner** (Dealer account → Partner account)

---

## 📁 Scalable Folder Structure

```
sunshine-realtors-website/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (login, register)
│   ├── (public)/                 # Public marketplace
│   │   ├── buy/
│   │   ├── rent/
│   │   ├── new-launch/
│   │   ├── commercial/
│   │   ├── plots/
│   │   ├── projects/
│   │   └── insights/
│   ├── (dashboard)/              # Protected routes
│   │   ├── dashboard/
│   │   ├── properties/
│   │   ├── leads/
│   │   └── analytics/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── properties/
│   │   ├── search/
│   │   ├── leads/
│   │   ├── crm/
│   │   └── webhooks/
│   └── admin/                    # Admin panel
│
├── components/                   # React components
│   ├── ui/                       # Reusable UI primitives
│   ├── property/                 # Property-specific
│   ├── search/                   # Search & filters
│   ├── dashboard/                # Dashboard components
│   ├── admin/                    # Admin components
│   └── layout/                   # Layout components
│
├── lib/                          # Core libraries
│   ├── db/                       # Database (Prisma)
│   ├── redis/                    # Redis client
│   ├── elasticsearch/            # Search client
│   ├── services/                 # Business logic
│   │   ├── property.service.ts
│   │   ├── search.service.ts
│   │   ├── lead.service.ts
│   │   ├── crm.service.ts
│   │   └── dealer.service.ts
│   ├── auth/                     # Authentication
│   ├── validation/               # Zod schemas
│   └── utils/                    # Utilities
│
├── types/                        # TypeScript types
│   ├── property.types.ts
│   ├── user.types.ts
│   ├── crm.types.ts
│   └── api.types.ts
│
├── prisma/                       # Database schema
│   ├── schema.prisma
│   └── migrations/
│
├── config/                       # Configuration
│   ├── database.ts
│   ├── redis.ts
│   ├── elasticsearch.ts
│   └── crm.ts
│
├── hooks/                        # React hooks
│   ├── useProperty.ts
│   ├── useSearch.ts
│   └── useAuth.ts
│
├── middleware.ts                 # Next.js middleware
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔄 Deployment Architecture

### Infrastructure (AWS / GCP)

**Production Environment:**
- **Compute:** ECS Fargate / Cloud Run (auto-scaling)
- **Database:** RDS PostgreSQL (Multi-AZ) / Cloud SQL
- **Cache:** ElastiCache Redis / Memorystore
- **Search:** Elasticsearch Service / Cloud Search
- **Storage:** S3 / Cloud Storage (media files)
- **CDN:** CloudFront / Cloud CDN
- **Monitoring:** CloudWatch / Cloud Monitoring
- **Logs:** CloudWatch Logs / Cloud Logging

**CI/CD Pipeline:**
- **GitHub Actions** / **GitLab CI** / **CircleCI**
- Automated testing (unit, integration, E2E)
- Docker image build
- Automated deployment to staging → production
- Database migrations (Prisma)

---

## 📈 Scalability Assumptions

### Current Scale
- **Daily Active Users:** 20,000-30,000
- **Peak Concurrency:** 5,000+ users
- **Properties:** ~100,000 active listings
- **Searches:** ~50,000 searches/day

### Scaling Path
- **Phase 1:** Single region, 3-5 app instances
- **Phase 2:** Multi-region (Delhi, Mumbai), read replicas
- **Phase 3:** Database sharding by region
- **Phase 4:** Microservices extraction (search, CRM sync)

---

## 🎯 Success Metrics

### Technical KPIs
- **Uptime:** 99.9% SLA
- **API Latency:** <300ms (p95)
- **Error Rate:** <0.1%
- **Search Accuracy:** >95%

### Business KPIs
- **Property Listings:** 100K+ active
- **User Engagement:** 40%+ returning users
- **Lead Conversion:** 5%+ inquiry-to-sale
- **Dealer Satisfaction:** 4.5+ rating

---

**Last Updated:** January 2025
**Version:** 1.0.0
**Status:** Architecture Design Complete




