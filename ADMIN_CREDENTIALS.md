# 🔐 Admin Credentials & Access Guide

## 📋 Table of Contents
1. [Creating Super Admin User](#creating-super-admin-user)
2. [User Signup Process](#user-signup-process)
3. [Database Admin URLs](#database-admin-urls)
4. [API Endpoints](#api-endpoints)
5. [Backend Access](#backend-access)

---

## 1. 🛠️ Creating Super Admin User

### Option A: Create via API (Recommended)

**Endpoint:** `POST /api/auth/register`

**Request:**
```bash
curl -X POST https://sunshine-realtors-website.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sunshinerealtors.com",
    "password": "YourSecurePassword123!",
    "fullName": "Super Admin",
    "role": "SUPER_ADMIN",
    "phone": "+91-9876543210"
  }'
```

**Note:** You may need to manually update the role to `SUPER_ADMIN` in the database after creation.

---

### Option B: Create Directly in Database (Supabase)

**1. Go to Supabase Dashboard:**
- URL: https://supabase.com/dashboard
- Login with your Supabase account

**2. Navigate to SQL Editor:**
- Click on "SQL Editor" in the left sidebar
- Click "New Query"

**3. Run this SQL:**

```sql
-- First, hash the password (use bcrypt)
-- Password: Admin123! -> Hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5Gy5KxwF8z8xO

-- Insert Super Admin User
INSERT INTO users (
  id,
  email,
  password_hash,
  full_name,
  role,
  is_verified,
  is_active,
  email_verified_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@sunshinerealtors.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5Gy5KxwF8z8xO', -- Admin123!
  'Super Admin',
  'SUPER_ADMIN',
  true,
  true,
  NOW(),
  NOW(),
  NOW()
);
```

**Default Credentials:**
- **Email:** `admin@sunshinerealtors.com`
- **Password:** `Admin123!`

⚠️ **IMPORTANT:** Change the password immediately after first login!

---

### Option C: Create via Prisma Script

Create a script `scripts/create-admin.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@sunshinerealtors.com';
  const password = 'Admin123!';
  const fullName = 'Super Admin';

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: 'SUPER_ADMIN',
        isVerified: true,
        isActive: true,
        emailVerifiedAt: new Date(),
      },
    });

    console.log('✅ Super Admin created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`ID: ${admin.id}`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('❌ Admin user already exists');
    } else {
      console.error('Error:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
```

**Run:**
```bash
cd sunshine-realtors-website
node scripts/create-admin.js
```

---

## 2. 📝 User Signup Process

### For Regular Users

**Signup URL:** https://sunshine-realtors-website.vercel.app/register

**Signup Flow:**

1. **User visits:** `/register`
2. **Fills form:**
   - Full Name
   - Email
   - Phone (optional)
   - Password
   - Role selection (BUYER, SELLER, TENANT, OWNER, DEALER)
3. **Submits form**
4. **API Endpoint:** `POST /api/auth/register`
5. **Account Status:**
   - Role: Based on selection (defaults to BUYER)
   - Status: `isActive: true` (immediately active)
   - Verification: `isVerified: false` (may require email verification)

### Signup API Endpoint

**URL:** `POST https://sunshine-realtors-website.vercel.app/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "John Doe",
  "phone": "+91-9876543210",
  "role": "BUYER"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "BUYER",
    "isVerified": false,
    "isActive": true
  },
  "token": "jwt-token-here"
}
```

### Available Roles:
- `BUYER` - Property buyers
- `SELLER` - Property sellers
- `TENANT` - Rent seekers
- `OWNER` - Property owners
- `DEALER` - Real estate dealers
- `DISTRIBUTOR` - Distributors
- `INTERNAL_SALES` - Internal sales team
- `INTERNAL_MARKETING` - Internal marketing team
- `INTERNAL_OPS` - Internal operations
- `ADMIN` - Administrators
- `SUPER_ADMIN` - Super administrators

---

## 3. 🗄️ Database Admin URLs

### Supabase Dashboard (PostgreSQL)

**Main Dashboard:**
https://supabase.com/dashboard/project/cgodlegdxrwhpjevxlel

**Direct Links:**

1. **SQL Editor:**
   https://supabase.com/dashboard/project/cgodlegdxrwhpjevxlel/sql/new

2. **Table Editor:**
   https://supabase.com/dashboard/project/cgodlegdxrwhpjevxlel/editor

3. **Database Connection String:**
   ```
   postgresql://postgres:@16Supabase@db.cgodlegdxrwhpjevxlel.supabase.co:5432/postgres
   ```

4. **Database Settings:**
   https://supabase.com/dashboard/project/cgodlegdxrwhpjevxlel/settings/database

5. **API Settings:**
   https://supabase.com/dashboard/project/cgodlegdxrwhpjevxlel/settings/api

### View Database Tables:

**Users Table:**
https://supabase.com/dashboard/project/cgodlegdxrwhpjevxlel/editor/table/users

**Properties Table:**
https://supabase.com/dashboard/project/cgodlegdxrwhpjevxlel/editor/table/properties

**Leads Table:**
https://supabase.com/dashboard/project/cgodlegdxrwhpjevxlel/editor/table/leads

**All Tables:**
https://supabase.com/dashboard/project/cgodlegdxrwhpjevxlel/editor

---

### Upstash Dashboard (Redis Cache)

**Main Dashboard:**
https://console.upstash.com/

**Direct Links:**

1. **Redis Databases:**
   https://console.upstash.com/redis

2. **Connection Details:**
   - **URL:** `outgoing-mole-27515.upstash.io:6379`
   - **Password:** `AWt7AAIncDI3ZTg5ODZkNDFhMjg0NjQwODBiMDQ5NWIzYjAzYzY2NnAyMjc1MTU`
   - **Full URL:** `rediss://default:AWt7AAIncDI3ZTg5ODZkNDFhMjg0NjQwODBiMDQ5NWIzYjAzYzY2NnAyMjc1MTU@outgoing-mole-27515.upstash.io:6379`

3. **Monitoring:**
   https://console.upstash.com/redis/monitor

---

## 4. 🔌 API Endpoints

### Base URL:
```
https://sunshine-realtors-website.vercel.app/api
```

### Authentication Endpoints:

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "BUYER"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

#### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refresh-token>"
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>
```

---

### Properties Endpoints:

```
GET    /api/properties              # List properties
GET    /api/properties/[id]         # Get property details
POST   /api/properties              # Create property (authenticated)
PUT    /api/properties/[id]         # Update property (owner/dealer/admin)
DELETE /api/properties/[id]         # Delete property (owner/admin)
GET    /api/properties/search       # Search properties
```

---

### Leads Endpoints:

```
GET    /api/leads                   # List leads (dealer/admin)
GET    /api/leads/[id]              # Get lead details
POST   /api/leads                   # Create lead
PUT    /api/leads/[id]              # Update lead
POST   /api/leads/[id]/assign       # Assign lead (admin)
```

---

### Admin Endpoints (Require ADMIN/SUPER_ADMIN role):

```
GET    /api/admin/properties/moderation    # Moderation queue
POST   /api/admin/properties/[id]/moderate # Moderate property
GET    /api/admin/analytics                # Analytics data
```

---

## 5. 🚀 Backend Access

### Vercel Dashboard:
https://vercel.com/rakeshs-projects-07a44f1a/sunshine-realtors-website

### View Logs:
```bash
vercel logs https://sunshine-realtors-website.vercel.app
```

### Environment Variables:
```bash
cd sunshine-realtors-website
vercel env ls
```

### Redeploy:
```bash
vercel --prod
```

---

## 🔑 Quick Reference

### Default Super Admin Credentials:
- **Email:** `admin@sunshinerealtors.com`
- **Password:** `Admin123!`
- **Login URL:** https://sunshine-realtors-website.vercel.app/login
- **Admin Dashboard:** https://sunshine-realtors-website.vercel.app/admin

### User Signup URL:
https://sunshine-realtors-website.vercel.app/register

### Database Access:
- **Supabase:** https://supabase.com/dashboard/project/cgodlegdxrwhpjevxlel
- **Upstash:** https://console.upstash.com/

### API Base URL:
https://sunshine-realtors-website.vercel.app/api

---

## ⚠️ Security Notes

1. **Change default password immediately after first login**
2. **Use strong passwords** (min 12 characters, mix of letters, numbers, symbols)
3. **Enable 2FA** for admin accounts (if available)
4. **Keep database credentials secure** - never commit to git
5. **Rotate JWT secrets** periodically in production
6. **Monitor access logs** regularly

---

*Last Updated: $(Get-Date)*


