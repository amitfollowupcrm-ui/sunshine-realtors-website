# 📊 Sunshine Realtors Group - Database Schema

## Overview

PostgreSQL database schema designed for scale, performance, and data integrity. All tables include audit fields (`created_at`, `updated_at`, `deleted_at` for soft deletes).

---

## Core Tables

### 1. Users & Authentication

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  
  -- Role & Permissions
  role VARCHAR(50) NOT NULL, -- 'buyer', 'seller', 'tenant', 'owner', 'dealer', 'distributor', 'internal_sales', 'internal_marketing', 'internal_ops', 'admin'
  permissions JSONB DEFAULT '[]'::jsonb,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  last_login_at TIMESTAMPTZ,
  email_verified_at TIMESTAMPTZ,
  phone_verified_at TIMESTAMPTZ,
  
  -- Soft Delete
  deleted_at TIMESTAMPTZ,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_users_email (email),
  INDEX idx_users_phone (phone),
  INDEX idx_users_role (role),
  INDEX idx_users_active (is_active, deleted_at)
);
```

#### `user_profiles`
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Profile Data
  bio TEXT,
  company_name VARCHAR(255),
  license_number VARCHAR(100), -- For dealers
  experience_years INTEGER,
  specialization TEXT[], -- ['residential', 'commercial', 'plots']
  
  -- Location
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  address TEXT,
  
  -- Contact Preferences
  preferred_contact_method VARCHAR(50), -- 'email', 'phone', 'whatsapp'
  notification_preferences JSONB DEFAULT '{}'::jsonb,
  
  -- Dealer/Distributor Specific
  dealer_type VARCHAR(50), -- 'individual', 'agency', 'distributor'
  parent_distributor_id UUID REFERENCES users(id), -- For dealer hierarchy
  commission_rate DECIMAL(5,2), -- Percentage
  territory_city VARCHAR(100)[], -- Cities dealer can operate in
  territory_zones VARCHAR(100)[], -- Specific zones
  
  -- Social Proof
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  total_properties_sold INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id),
  INDEX idx_user_profiles_city (city),
  INDEX idx_user_profiles_dealer_type (dealer_type),
  INDEX idx_user_profiles_parent_distributor (parent_distributor_id)
);
```

#### `user_sessions`
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  refresh_token_hash VARCHAR(255) NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_user_sessions_user_id (user_id),
  INDEX idx_user_sessions_expires (expires_at)
);
```

---

### 2. Properties

#### `properties`
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  owner_id UUID NOT NULL REFERENCES users(id),
  listed_by_id UUID REFERENCES users(id), -- Dealer who listed (if applicable)
  dealer_id UUID REFERENCES users(id), -- Assigned dealer
  
  -- Basic Info
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL, -- SEO-friendly URL
  
  -- Property Type
  category VARCHAR(50) NOT NULL, -- 'buy', 'rent', 'new-launch', 'commercial', 'plots'
  property_type VARCHAR(100) NOT NULL, -- 'apartment', 'villa', 'shop', 'office', 'warehouse', 'plot', 'farmhouse'
  sub_type VARCHAR(100), -- '1BHK', '2BHK', '3BHK', '4BHK', 'penthouse'
  
  -- Location (Normalized)
  country VARCHAR(100) DEFAULT 'India',
  state VARCHAR(100) NOT NULL, -- Punjab, Haryana, etc.
  city VARCHAR(100) NOT NULL,
  locality VARCHAR(255),
  sector VARCHAR(100),
  zone VARCHAR(100), -- For micro-market analysis
  pincode VARCHAR(10),
  
  -- Address (Full)
  address_line1 TEXT,
  address_line2 TEXT,
  landmark VARCHAR(255),
  
  -- Geo Coordinates (for map display & proximity search)
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  geo_point POINT, -- PostGIS point for spatial queries
  
  -- Pricing
  price DECIMAL(12, 2) NOT NULL,
  price_per_unit DECIMAL(10, 2), -- Per sqft/sqmt
  currency VARCHAR(3) DEFAULT 'INR',
  negotiable BOOLEAN DEFAULT false,
  maintenance_charges DECIMAL(10, 2),
  security_deposit DECIMAL(12, 2), -- For rent
  
  -- Property Details
  built_up_area DECIMAL(8, 2), -- sqft
  carpet_area DECIMAL(8, 2), -- sqft
  plot_area DECIMAL(10, 2), -- sqft (for plots/villas)
  area_unit VARCHAR(10) DEFAULT 'sqft',
  bedrooms INTEGER,
  bathrooms INTEGER,
  balconies INTEGER,
  floors INTEGER, -- Total floors in building
  floor_number INTEGER, -- Floor of this unit
  age_of_construction INTEGER, -- Years
  facing VARCHAR(50), -- 'north', 'south', 'east', 'west', 'northeast', etc.
  
  -- Amenities & Features
  furnishing_status VARCHAR(50), -- 'unfurnished', 'semi-furnished', 'fully-furnished'
  parking INTEGER DEFAULT 0,
  power_backup BOOLEAN DEFAULT false,
  water_supply VARCHAR(50), -- 'municipal', 'borewell', 'both'
  amenities TEXT[], -- ['gym', 'pool', 'clubhouse', 'security', 'park', 'elevator']
  
  -- Possession & Availability
  possession_status VARCHAR(50), -- 'ready-to-move', 'under-construction', 'resale'
  available_from DATE,
  construction_year INTEGER,
  
  -- Media
  primary_image_url TEXT,
  image_urls TEXT[], -- Array of image URLs
  video_urls TEXT[],
  floor_plan_urls TEXT[],
  virtual_tour_url TEXT,
  
  -- Status & Moderation
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending_verification', 'active', 'inactive', 'sold', 'rented', 'expired', 'rejected'
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false, -- Premium listing
  verification_date TIMESTAMPTZ,
  verified_by_id UUID REFERENCES users(id),
  
  -- SEO & Discovery
  meta_title VARCHAR(255),
  meta_description TEXT,
  keywords TEXT[],
  
  -- Expiry & Renewal
  expires_at TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT false,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  
  -- Soft Delete
  deleted_at TIMESTAMPTZ,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_properties_category (category),
  INDEX idx_properties_city (city),
  INDEX idx_properties_locality (locality),
  INDEX idx_properties_state (state),
  INDEX idx_properties_status (status),
  INDEX idx_properties_price (price),
  INDEX idx_properties_owner (owner_id),
  INDEX idx_properties_dealer (dealer_id),
  INDEX idx_properties_verified (is_verified, status),
  INDEX idx_properties_featured (is_featured, status),
  INDEX idx_properties_expires (expires_at, status),
  INDEX idx_properties_geo (geo_point), -- GIST index for spatial queries
  INDEX idx_properties_search_text (title, description) -- GIN index for full-text search
);

-- Full-text search index
CREATE INDEX idx_properties_fts ON properties 
USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));
```

#### `property_amenities`
```sql
CREATE TABLE property_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  amenity_key VARCHAR(100) NOT NULL, -- 'gym', 'pool', 'security', etc.
  amenity_value TEXT, -- Optional value
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(property_id, amenity_key),
  INDEX idx_property_amenities_property (property_id)
);
```

#### `property_images`
```sql
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  alt_text VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_property_images_property (property_id, order_index)
);
```

---

### 3. Projects & New Launches

#### `projects`
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT,
  developer_name VARCHAR(255),
  developer_id UUID REFERENCES users(id), -- If developer is registered user
  
  -- Location
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  locality VARCHAR(255),
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Project Details
  project_type VARCHAR(100), -- 'apartment', 'villa', 'plot', 'commercial'
  total_units INTEGER,
  units_available INTEGER,
  price_range_min DECIMAL(12, 2),
  price_range_max DECIMAL(12, 2),
  area_range_min DECIMAL(8, 2),
  area_range_max DECIMAL(8, 2),
  
  -- Possession
  rera_registered BOOLEAN DEFAULT false,
  rera_number VARCHAR(100),
  possession_date DATE,
  launch_date DATE,
  
  -- Media
  logo_url TEXT,
  image_urls TEXT[],
  brochure_url TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'upcoming', -- 'upcoming', 'launched', 'under-construction', 'completed'
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_projects_city (city),
  INDEX idx_projects_status (status)
);
```

#### `project_units`
```sql
CREATE TABLE project_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  unit_number VARCHAR(50),
  floor_number INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area DECIMAL(8, 2),
  price DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'available', -- 'available', 'booked', 'sold'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_project_units_project (project_id, status)
);
```

---

### 4. Leads & Inquiries

#### `leads`
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Source
  source VARCHAR(50) NOT NULL, -- 'property_inquiry', 'contact_form', 'phone_call', 'walk_in', 'referral'
  property_id UUID REFERENCES properties(id),
  project_id UUID REFERENCES projects(id),
  
  -- Contact Info
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  alternate_phone VARCHAR(20),
  
  -- Lead Details
  inquiry_type VARCHAR(50), -- 'buy', 'rent', 'sell', 'invest'
  budget_min DECIMAL(12, 2),
  budget_max DECIMAL(12, 2),
  preferred_location TEXT[],
  preferred_property_type VARCHAR(100),
  
  -- Assignment
  assigned_to_id UUID REFERENCES users(id), -- Dealer/Agent
  assigned_at TIMESTAMPTZ,
  
  -- Status & Pipeline
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'viewing_scheduled', 'viewed', 'negotiating', 'converted', 'lost', 'closed'
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  
  -- Notes & Communication
  notes TEXT,
  last_contacted_at TIMESTAMPTZ,
  next_followup_at TIMESTAMPTZ,
  
  -- CRM Sync
  crm_lead_id VARCHAR(255), -- External CRM lead ID
  crm_synced_at TIMESTAMPTZ,
  crm_sync_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'synced', 'failed', 'retrying'
  crm_sync_error TEXT,
  
  -- Attribution
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  referrer_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_leads_assigned_to (assigned_to_id),
  INDEX idx_leads_status (status),
  INDEX idx_leads_property (property_id),
  INDEX idx_leads_crm_sync (crm_sync_status),
  INDEX idx_leads_phone (phone)
);
```

#### `lead_activities`
```sql
CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  
  activity_type VARCHAR(50) NOT NULL, -- 'call', 'email', 'sms', 'whatsapp', 'meeting', 'property_view', 'note', 'status_change'
  title VARCHAR(255),
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb, -- Flexible data
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_lead_activities_lead (lead_id, created_at DESC)
);
```

---

### 5. Dealer & Distributor Management

#### `dealer_performance`
```sql
CREATE TABLE dealer_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Metrics
  total_leads INTEGER DEFAULT 0,
  leads_contacted INTEGER DEFAULT 0,
  leads_converted INTEGER DEFAULT 0,
  properties_listed INTEGER DEFAULT 0,
  properties_sold INTEGER DEFAULT 0,
  total_commission DECIMAL(12, 2) DEFAULT 0,
  average_response_time INTEGER, -- Minutes
  
  -- Ratings
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(dealer_id, period_start, period_end),
  INDEX idx_dealer_performance_dealer (dealer_id, period_end DESC)
);
```

#### `dealer_territories`
```sql
CREATE TABLE dealer_territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  city VARCHAR(100) NOT NULL,
  zones VARCHAR(100)[], -- Specific zones/micro-markets
  is_active BOOLEAN DEFAULT true,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_dealer_territories_dealer (dealer_id),
  INDEX idx_dealer_territories_city (city)
);
```

---

### 6. CRM Integration

#### `crm_sync_logs`
```sql
CREATE TABLE crm_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Entity Reference
  entity_type VARCHAR(50) NOT NULL, -- 'lead', 'property', 'contact', 'dealer'
  entity_id UUID NOT NULL,
  
  -- Sync Info
  sync_direction VARCHAR(20) NOT NULL, -- 'outbound', 'inbound'
  sync_event VARCHAR(100) NOT NULL, -- 'created', 'updated', 'deleted'
  payload JSONB NOT NULL, -- Data sent/received
  
  -- Status
  status VARCHAR(50) NOT NULL, -- 'pending', 'success', 'failed', 'retrying'
  http_status_code INTEGER,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- External Reference
  external_id VARCHAR(255), -- CRM's ID for this entity
  crm_system VARCHAR(50), -- Which CRM system
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ,
  
  INDEX idx_crm_sync_logs_entity (entity_type, entity_id),
  INDEX idx_crm_sync_logs_status (status, created_at),
  INDEX idx_crm_sync_logs_retry (status, retry_count)
);
```

#### `crm_webhooks`
```sql
CREATE TABLE crm_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_url TEXT NOT NULL,
  secret_hash VARCHAR(255) NOT NULL,
  events TEXT[] NOT NULL, -- Events to subscribe to
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_crm_webhooks_active (is_active)
);
```

---

### 7. Search & Analytics

#### `search_analytics`
```sql
CREATE TABLE search_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255),
  
  -- Search Query
  query_text TEXT NOT NULL,
  filters JSONB DEFAULT '{}'::jsonb,
  
  -- Results
  results_count INTEGER,
  results_shown INTEGER,
  
  -- User Action
  clicked_property_id UUID REFERENCES properties(id),
  converted BOOLEAN DEFAULT false, -- Generated lead
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  city VARCHAR(100),
  device_type VARCHAR(50), -- 'mobile', 'tablet', 'desktop'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_search_analytics_created (created_at),
  INDEX idx_search_analytics_query (query_text),
  INDEX idx_search_analytics_converted (converted)
);
```

#### `property_views`
```sql
CREATE TABLE property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255),
  
  view_type VARCHAR(50) DEFAULT 'listing', -- 'listing', 'detail', 'gallery'
  duration_seconds INTEGER,
  
  ip_address INET,
  referrer_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_property_views_property (property_id, created_at),
  INDEX idx_property_views_user (user_id)
);
```

---

### 8. Admin & Moderation

#### `moderation_queue`
```sql
CREATE TABLE moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL, -- 'property', 'user', 'project'
  entity_id UUID NOT NULL,
  
  action_type VARCHAR(50) NOT NULL, -- 'create', 'update', 'verify', 'reject'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  
  submitted_by_id UUID REFERENCES users(id),
  reviewed_by_id UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  
  reason TEXT,
  rejection_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_moderation_queue_status (status, created_at),
  INDEX idx_moderation_queue_entity (entity_type, entity_id)
);
```

#### `audit_logs`
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  
  old_values JSONB,
  new_values JSONB,
  
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_audit_logs_user (user_id, created_at DESC),
  INDEX idx_audit_logs_entity (entity_type, entity_id),
  INDEX idx_audit_logs_action (action, created_at DESC)
);
```

---

## Database Indexes Summary

### Critical Indexes for Performance
1. **Property Search:**
   - `properties`: city, category, status, price range
   - Full-text search on title/description
   - Spatial index on geo_point for proximity search

2. **User Queries:**
   - `users`: email, phone, role
   - `user_profiles`: city, dealer_type

3. **Lead Management:**
   - `leads`: assigned_to, status, property_id
   - `lead_activities`: lead_id with timestamp

4. **CRM Sync:**
   - `crm_sync_logs`: status, retry_count for failed syncs

---

## Data Relationships

```
users (1) ──< (N) properties (owner_id)
users (1) ──< (N) properties (dealer_id)
users (1) ──< (N) user_profiles
users (1) ──< (N) leads (assigned_to_id)

properties (1) ──< (N) property_images
properties (1) ──< (N) property_amenities
properties (1) ──< (N) leads
properties (1) ──< (N) property_views

projects (1) ──< (N) project_units
projects (1) ──< (N) leads

leads (1) ──< (N) lead_activities

users (1) ──< (N) dealer_performance (dealer_id)
users (1) ──< (N) dealer_territories (dealer_id)
```

---

**Last Updated:** January 2025
**Database:** PostgreSQL 15+
**ORM:** Prisma

