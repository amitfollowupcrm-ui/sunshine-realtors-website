# 🚢 Deployment Strategy - Sunshine Realtors Group

## Overview

Production deployment strategy for enterprise-scale real estate marketplace.

---

## 🏗️ Infrastructure Architecture

### Production Stack

```
┌─────────────────────────────────────────────────────────┐
│                    CDN Layer                            │
│              CloudFront / Cloud CDN                     │
│              • Static Assets                            │
│              • Images (S3/Cloud Storage)                │
│              • Edge Caching                             │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│               Load Balancer                             │
│              AWS ALB / Cloud Load Balancing             │
│              • SSL Termination                          │
│              • Health Checks                            │
│              • Request Routing                          │
└────────────────────┬────────────────────────────────────┘
                     │
     ┌───────────────┼───────────────┐
     │               │               │
┌────▼────┐    ┌────▼────┐    ┌────▼────┐
│ App     │    │ App     │    │ App     │
│ Instance│    │ Instance│    │ Instance│
│ (ECS)   │    │ (ECS)   │    │ (ECS)   │
└────┬────┘    └────┬────┘    └────┬────┘
     │               │               │
     └───────────────┼───────────────┘
                     │
     ┌───────────────┼───────────────┐
     │               │               │
┌────▼────┐    ┌────▼────┐    ┌────▼────┐
│PostgreSQL│    │  Redis  │    │Elasticsearch│
│ (RDS)   │    │(ElastiCache)│   │ (Service)  │
│ Multi-AZ│    │  Cluster  │    │            │
└─────────┘    └───────────┘    └────────────┘
```

---

## 🛠️ Deployment Options

### Option 1: Vercel (Recommended for Quick Start)

**Pros:**
- Zero-config Next.js deployment
- Automatic SSL
- Edge network
- Preview deployments

**Cons:**
- Limited backend customization
- Serverless function limits

**Steps:**

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Configure environment variables in Vercel dashboard

4. Connect database (external PostgreSQL)

---

### Option 2: AWS (Production-Grade)

#### A. ECS Fargate Setup

**Infrastructure:**

- **Compute:** ECS Fargate (auto-scaling, 3-10 tasks)
- **Database:** RDS PostgreSQL (Multi-AZ, automated backups)
- **Cache:** ElastiCache Redis (Cluster mode)
- **Storage:** S3 (media files) + CloudFront CDN
- **Search:** Elasticsearch Service (optional)
- **Monitoring:** CloudWatch + DataDog

**Deployment Steps:**

1. **Build Docker Image:**
   ```bash
   docker build -t sunshine-realtors:latest .
   ```

2. **Push to ECR:**
   ```bash
   aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com
   docker tag sunshine-realtors:latest <account-id>.dkr.ecr.ap-south-1.amazonaws.com/sunshine-realtors:latest
   docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/sunshine-realtors:latest
   ```

3. **ECS Task Definition:**
   ```json
   {
     "family": "sunshine-realtors",
     "containerDefinitions": [{
       "name": "app",
       "image": "<account-id>.dkr.ecr.ap-south-1.amazonaws.com/sunshine-realtors:latest",
       "portMappings": [{ "containerPort": 3000 }],
       "environment": [
         { "name": "NODE_ENV", "value": "production" },
         { "name": "DATABASE_URL", "value": "..." },
         { "name": "REDIS_URL", "value": "..." }
       ],
       "memory": 1024,
       "cpu": 512
     }]
   }
   ```

4. **ECS Service:**
   - Min tasks: 3
   - Max tasks: 10
   - Target CPU: 70%
   - Target Memory: 80%

5. **Application Load Balancer:**
   - Listener: HTTPS (443)
   - Target Group: ECS service
   - Health Check: `/api/health`

6. **Auto Scaling:**
   ```yaml
   Scaling Policy:
     Metric: CPUUtilization
     Target: 70%
     Min: 3
     Max: 10
   ```

---

#### B. EC2 Setup (Alternative)

**Infrastructure:**

- **EC2 Instances:** t3.large or t3.xlarge (3+ instances)
- **Auto Scaling Group:** Based on CPU/memory
- **Load Balancer:** Application Load Balancer
- **Database:** RDS PostgreSQL
- **Cache:** ElastiCache Redis

**Deployment Steps:**

1. **Launch EC2 Instances:**
   - AMI: Amazon Linux 2
   - Instance Type: t3.large
   - Security Group: Allow 80, 443, 22
   - User Data: Install Node.js, PM2, Nginx

2. **Install Dependencies:**
   ```bash
   # On each EC2 instance
   sudo yum update -y
   sudo yum install nodejs npm nginx -y
   npm install -g pm2
   ```

3. **Deploy Application:**
   ```bash
   git clone <repo>
   cd sunshine-realtors-website
   npm install
   npm run build
   pm2 start npm --name "sunshine-realtors" -- start
   pm2 save
   pm2 startup
   ```

4. **Nginx Configuration:**
   ```nginx
   server {
     listen 80;
     server_name api.sunshinerealtors.com;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

5. **SSL Certificate (Let's Encrypt):**
   ```bash
   sudo certbot --nginx -d api.sunshinerealtors.com
   ```

---

### Option 3: Google Cloud Platform

**Infrastructure:**

- **Compute:** Cloud Run (serverless) or GKE (Kubernetes)
- **Database:** Cloud SQL PostgreSQL
- **Cache:** Memorystore Redis
- **Storage:** Cloud Storage + Cloud CDN
- **Monitoring:** Cloud Monitoring + Logging

**Deployment Steps:**

1. **Build Container:**
   ```bash
   gcloud builds submit --tag gcr.io/<project-id>/sunshine-realtors
   ```

2. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy sunshine-realtors \
     --image gcr.io/<project-id>/sunshine-realtors \
     --platform managed \
     --region asia-south1 \
     --allow-unauthenticated \
     --memory 1Gi \
     --cpu 1 \
     --min-instances 3 \
     --max-instances 10
   ```

---

## 📦 Environment Configuration

### Production Environment Variables

```env
# Application
NODE_ENV=production
APP_URL=https://sunshinerealtors.com
APP_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/sunshine_realtors

# Redis
REDIS_URL=redis://elasticache-endpoint:6379

# JWT
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# NextAuth
NEXTAUTH_URL=https://sunshinerealtors.com
NEXTAUTH_SECRET=<strong-random-secret>

# Storage
AWS_S3_BUCKET=sunshine-realtors-media-prod
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_REGION=ap-south-1

# CDN
CDN_URL=https://cdn.sunshinerealtors.com

# CRM
CRM_ENABLED=true
CRM_API_URL=https://crm.example.com/api
CRM_API_KEY=<key>
CRM_API_SECRET=<secret>

# Monitoring
SENTRY_DSN=<sentry-dsn>
DATA_DOG_API_KEY=<key>
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to AWS ECS
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          # Build and push Docker image
          docker build -t sunshine-realtors:${{ github.sha }} .
          # Push to ECR
          # Update ECS service
```

---

## 🗄️ Database Migration Strategy

### Production Migrations

1. **Run Migrations:**
   ```bash
   npm run db:migrate
   ```

2. **Verify Migration:**
   ```bash
   npm run db:studio  # Review schema changes
   ```

3. **Rollback Plan:**
   ```bash
   # Prisma doesn't support rollback, use database backups
   # Restore from snapshot if needed
   ```

### Backup Strategy

- **Automated Backups:** RDS automated daily backups (7-day retention)
- **Point-in-Time Recovery:** Enabled
- **Manual Snapshots:** Before major migrations
- **Cross-Region Replication:** For disaster recovery

---

## 📊 Monitoring & Logging

### CloudWatch (AWS)

- **Metrics:** CPU, Memory, Request count, Error rate
- **Logs:** Application logs, access logs
- **Alarms:** High error rate, high latency, low disk space

### DataDog / New Relic

- **APM:** Application performance monitoring
- **Error Tracking:** Exception tracking
- **Real User Monitoring:** Browser performance

### Sentry

- **Error Tracking:** JavaScript errors
- **Performance Monitoring:** API latency
- **Release Tracking:** Deploy notifications

---

## 🔒 Security Checklist

- [ ] SSL/TLS certificates installed and renewed
- [ ] Environment variables secured (AWS Secrets Manager)
- [ ] Database credentials rotated regularly
- [ ] API rate limiting enabled
- [ ] WAF (Web Application Firewall) configured
- [ ] DDoS protection enabled
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] Regular security scans
- [ ] Audit logging enabled
- [ ] Backup encryption enabled

---

## 📈 Scaling Strategy

### Horizontal Scaling

- **Auto Scaling:** Based on CPU/memory metrics
- **Load Balancing:** Distribute traffic across instances
- **Database Read Replicas:** For read-heavy workloads
- **Redis Cluster:** For high availability

### Vertical Scaling

- **Instance Types:** Start with t3.large, scale to t3.xlarge
- **Database:** Scale RDS instance type as needed
- **Storage:** Auto-scaling storage

### Performance Optimization

- **CDN:** Cache static assets and images
- **Redis:** Cache API responses and search results
- **Database Indexing:** Optimize slow queries
- **Image Optimization:** WebP/AVIF formats, lazy loading

---

## 🚨 Disaster Recovery

### Backup Strategy

- **Database:** Daily automated backups + point-in-time recovery
- **Media Files:** S3 versioning enabled
- **Application:** Git repository (source of truth)

### Recovery Procedures

1. **Database Failure:**
   - Restore from latest backup
   - Point-in-time recovery if needed
   - Update connection strings

2. **Application Failure:**
   - Rollback to previous deployment
   - Restore from Git tag
   - Redeploy previous version

3. **Regional Outage:**
   - Failover to secondary region
   - Update DNS records
   - Restore from cross-region backups

---

## ✅ Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations tested in staging
- [ ] SSL certificates installed
- [ ] CDN configured and tested
- [ ] Monitoring and alerts setup
- [ ] Backup strategy verified
- [ ] Load testing completed
- [ ] Security scan passed
- [ ] Documentation updated
- [ ] Rollback plan documented

---

**Last Updated:** January 2025  
**Deployment Version:** 1.0.0





