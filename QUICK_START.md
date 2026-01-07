# 🚀 Quick Start Guide - Sunshine Realtors Group

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- npm/yarn/pnpm

## Installation

### 1. Install Dependencies

```bash
cd sunshine-realtors-website
npm install
```

### 2. Environment Setup

Create `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sunshine_realtors"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secrets (generate strong random strings)
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-this"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# App
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
APP_ENV="development"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Create database (if not exists)
# psql -U postgres
# CREATE DATABASE sunshine_realtors;

# Run migrations
npm run db:migrate

# (Optional) Seed database
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## First Steps

### 1. Create Admin User

After starting the app, you can create an admin user via:

**Option A: API**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sunshinerealtors.com",
    "password": "SecurePassword123!",
    "fullName": "Admin User",
    "role": "ADMIN"
  }'
```

**Option B: Database**
```sql
-- Insert admin user directly (password: Admin123!)
INSERT INTO users (id, email, password_hash, full_name, role, is_active, is_verified)
VALUES (
  gen_random_uuid(),
  'admin@sunshinerealtors.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5Gy5KxwF8z8xO', -- Admin123!
  'Admin User',
  'ADMIN',
  true,
  true
);
```

### 2. Login as Admin

1. Go to http://localhost:3000/login
2. Login with admin credentials
3. Access admin dashboard at http://localhost:3000/admin

### 3. Create Your First Property

1. Register as a seller
2. Go to Dashboard → Post Property
3. Fill in property details
4. Submit for moderation
5. Approve via Admin → Moderation

---

## Development Workflow

### Running in Development

```bash
# Start dev server (with hot reload)
npm run dev

# Start with database studio
npm run db:studio  # In another terminal
```

### Database Operations

```bash
# Generate Prisma Client after schema changes
npm run db:generate

# Create new migration
npm run db:migrate

# Reset database (WARNING: Deletes all data)
npm run db:reset

# Open Prisma Studio
npm run db:studio
```

### Building for Production

```bash
# Build Next.js app
npm run build

# Start production server
npm start

# Preview production build
npm run preview
```

---

## Common Tasks

### Adding a New API Route

1. Create file in `app/api/[route-name]/route.ts`
2. Export GET, POST, PUT, DELETE handlers
3. Use middleware for auth: `withAuth(handler)`

### Adding a New Component

1. Create component in `components/` directory
2. Use TypeScript with proper types
3. Follow existing component patterns

### Adding a New Page

1. Create file in `app/` directory
2. Export default component
3. Add to navigation if needed

---

## Testing the API

### Using cURL

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User","role":"BUYER"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Search properties (public)
curl http://localhost:3000/api/properties/search?city=Delhi&limit=10
```

### Using Postman

Import the API collection from `API_CONTRACTS.md` and test endpoints.

---

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Verify connection string in .env
# Test connection
psql $DATABASE_URL
```

### Redis Connection Issues

```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# Verify Redis URL in .env
```

### Port Already in Use

```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Prisma Issues

```bash
# Reset Prisma Client
rm -rf node_modules/.prisma
npm run db:generate
```

---

## Project Structure

```
sunshine-realtors-website/
├── app/              # Next.js pages and API routes
├── components/       # React components
├── lib/             # Core libraries and utilities
├── types/           # TypeScript types
├── prisma/          # Database schema
└── config/          # Configuration files
```

---

## Next Steps

1. ✅ Setup complete - You're ready to develop!
2. Review `ARCHITECTURE.md` for system design
3. Check `API_CONTRACTS.md` for API documentation
4. Read `DEPLOYMENT.md` for production deployment

---

## Support

- Documentation: See `/docs` folder
- API Contracts: `API_CONTRACTS.md`
- Architecture: `ARCHITECTURE.md`

---

**Happy Coding! 🚀**



