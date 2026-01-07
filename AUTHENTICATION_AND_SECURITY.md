# 🔐 Authentication & Security - Complete Guide

## 📍 **Where User Credentials Are Stored**

### **Database: Supabase PostgreSQL**
All user data, including credentials, are stored in your **Supabase PostgreSQL database** using Prisma ORM.

**Database Location:**
- **Host:** `db.cgodlegdxrwhpjevxlel.supabase.co:5432`
- **Database:** `postgres`
- **Provider:** Supabase (PostgreSQL)

---

## 🔒 **Security Measures**

### **1. Password Hashing (bcrypt)**
- ✅ **Passwords are NEVER stored in plain text**
- ✅ Uses **bcrypt** with **12 rounds** of hashing (very secure)
- ✅ Each password gets a unique salt automatically
- ✅ **One-way hashing** - passwords cannot be reversed

**Code Example:**
```typescript
// Password is hashed before storing
const passwordHash = await bcrypt.hash(password, 12); // 12 rounds = very secure

// Password is verified using bcrypt
const isValid = await bcrypt.compare(plainPassword, storedHash);
```

### **2. Database Schema**
Users are stored in the `users` table with:
- ✅ `email` - Unique identifier
- ✅ `passwordHash` - Hashed password (never plain text)
- ✅ `phone` - Optional, unique if provided
- ✅ `role` - User role (BUYER, SELLER, ADMIN, etc.)
- ✅ `isVerified` - Email verification status
- ✅ `isActive` - Account active status

**Important Fields:**
```sql
passwordHash      String?  -- Hashed password (bcrypt)
email             String   @unique
phone             String?  @unique
isVerified        Boolean  @default(false)
isActive          Boolean  @default(true)
deletedAt         DateTime? -- Soft delete
```

### **3. JWT Token Authentication**
- ✅ **JWT tokens** for secure authentication
- ✅ **Access tokens** expire in 1 hour
- ✅ **Refresh tokens** expire in 7 days
- ✅ Tokens are **signed with secret keys**
- ✅ Tokens stored in **HTTP-only cookies** (more secure)

**Token Structure:**
```typescript
{
  userId: string,
  email: string,
  role: UserRole
}
```

### **4. Session Management**
- ✅ User sessions tracked in `UserSession` table
- ✅ Tracks IP address and user agent
- ✅ Session expiry times enforced
- ✅ Refresh token rotation support

### **5. Rate Limiting**
- ✅ **Rate limiting** on login endpoints
- ✅ **5 login attempts per 15 minutes** per IP
- ✅ **100 registration attempts per 15 minutes** per IP
- ✅ Prevents brute force attacks

### **6. Input Validation**
- ✅ **Zod schema validation** for all inputs
- ✅ Email format validation
- ✅ Password strength requirements
- ✅ Phone number validation
- ✅ Prevents SQL injection and XSS attacks

### **7. Database Security**
- ✅ **Connection pooling** via Supabase
- ✅ **Encrypted connections** (SSL/TLS)
- ✅ **Prepared statements** via Prisma (prevents SQL injection)
- ✅ **Parameterized queries** (safe from injection)

---

## 📊 **Data Storage Details**

### **What's Stored in Database:**

#### **Users Table (`users`):**
```
✅ email - User's email (unique, indexed)
✅ passwordHash - Hashed password using bcrypt
✅ phone - Optional phone number (unique if provided)
✅ fullName - User's full name
✅ role - User role (BUYER, SELLER, ADMIN, etc.)
✅ isVerified - Email verification status
✅ isActive - Account active/inactive status
✅ createdAt - Account creation timestamp
✅ lastLoginAt - Last login timestamp
✅ deletedAt - Soft delete timestamp
```

#### **User Sessions Table (`user_sessions`):**
```
✅ userId - Link to user
✅ tokenHash - Hashed access token
✅ refreshTokenHash - Hashed refresh token
✅ ipAddress - Login IP address
✅ userAgent - Browser/device info
✅ expiresAt - Session expiration time
```

---

## 🛡️ **Security Best Practices Implemented**

### **✅ Password Security:**
1. **Never stored in plain text** - Always hashed
2. **bcrypt with 12 rounds** - Industry standard
3. **Unique salt per password** - Even same passwords look different
4. **Password verification** - Only compares hashes, never stores plain text

### **✅ Authentication Security:**
1. **JWT tokens** - Secure, stateless authentication
2. **Token expiration** - Access tokens expire quickly (1 hour)
3. **Refresh tokens** - Longer-lived but can be revoked
4. **HTTP-only cookies** - Prevents XSS attacks
5. **Secure cookies in production** - HTTPS only

### **✅ API Security:**
1. **Rate limiting** - Prevents abuse
2. **Input validation** - Prevents malicious data
3. **Error handling** - Doesn't leak sensitive info
4. **CORS protection** - Only allowed origins

### **✅ Database Security:**
1. **Encrypted connections** - SSL/TLS
2. **Prepared statements** - SQL injection prevention
3. **Connection pooling** - Efficient and secure
4. **Indexed queries** - Fast and secure lookups

---

## 📋 **User Registration Flow**

1. User submits email/password
2. **Validation** - Email format, password strength
3. **Check uniqueness** - Email/phone not already exists
4. **Hash password** - bcrypt with 12 rounds
5. **Store in database** - Only hash stored, never plain text
6. **Generate tokens** - JWT access & refresh tokens
7. **Create session** - Store session in database
8. **Return tokens** - Send to client (HTTP-only cookies)

---

## 🔐 **Login Flow**

1. User submits email/password
2. **Rate limiting** - Check if too many attempts
3. **Find user** - Lookup by email in database
4. **Verify password** - Compare hash using bcrypt
5. **Check account status** - Active, verified, not deleted
6. **Generate tokens** - New JWT tokens
7. **Update session** - Store in database
8. **Return tokens** - Send to client

---

## 🔍 **How to Verify Security**

### **Check Password Hashing:**
- Passwords in database will look like: `$2a$12$xyz...` (bcrypt hash)
- Never plain text like: `password123`

### **Check Database Connection:**
- Connection string uses SSL/TLS
- Connection pooler for security

### **Check Environment Variables:**
- `JWT_SECRET` - Long, random string (not default)
- `JWT_REFRESH_SECRET` - Different from JWT_SECRET
- `DATABASE_URL` - Encrypted connection string

---

## ✅ **Security Checklist**

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT tokens for authentication
- ✅ Rate limiting on auth endpoints
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ XSS prevention (input sanitization)
- ✅ HTTPS in production
- ✅ HTTP-only cookies
- ✅ Session management
- ✅ Account status checks (active, verified)
- ✅ Soft deletes (not permanent)
- ✅ Audit logs (tracking changes)

---

## 🎯 **Summary**

**Where credentials are stored:**
- ✅ **Supabase PostgreSQL database** (encrypted, secure)
- ✅ **Passwords:** Hashed with bcrypt (never plain text)
- ✅ **Sessions:** Stored in database with IP/device tracking

**Security measures:**
- ✅ Industry-standard password hashing
- ✅ JWT token authentication
- ✅ Rate limiting
- ✅ Input validation
- ✅ Encrypted database connections
- ✅ Session management
- ✅ Multiple layers of protection

**Your data is secure!** 🔒

---

## 📞 **Admin Access**

For super admin access:
- **Email:** `amitfollowupcrm@gmail.com`
- **Password:** Check `ADMIN_CREDENTIALS.md` or `LIVE_CREDENTIALS.md`

Admin credentials are stored in the same secure database with the same security measures.


