// User-related TypeScript types

export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  TENANT = 'TENANT',
  OWNER = 'OWNER',
  DEALER = 'DEALER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  INTERNAL_SALES = 'INTERNAL_SALES',
  INTERNAL_MARKETING = 'INTERNAL_MARKETING',
  INTERNAL_OPS = 'INTERNAL_OPS',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum DealerType {
  INDIVIDUAL = 'INDIVIDUAL',
  AGENCY = 'AGENCY',
  DISTRIBUTOR = 'DISTRIBUTOR',
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  permissions: string[];
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  companyName?: string;
  licenseNumber?: string;
  experienceYears?: number;
  specialization?: string[];
  city?: string;
  state?: string;
  pincode?: string;
  address?: string;
  preferredContactMethod?: 'email' | 'phone' | 'whatsapp';
  notificationPreferences?: Record<string, any>;
  dealerType?: DealerType;
  parentDistributorId?: string;
  commissionRate?: number;
  territoryCity?: string[];
  territoryZones?: string[];
  rating: number;
  totalReviews: number;
  totalPropertiesSold: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  email: string;
  phone?: string;
  password: string;
  fullName: string;
  role: UserRole;
  profile?: Partial<UserProfile>;
}

export interface UserUpdateInput {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  profile?: Partial<UserProfile>;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface RolePermissions {
  [key: string]: string[];
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.BUYER]: [
    'properties:read',
    'properties:search',
    'leads:create',
    'favorites:manage',
  ],
  [UserRole.SELLER]: [
    'properties:read',
    'properties:create',
    'properties:update:own',
    'properties:delete:own',
    'leads:read:own',
  ],
  [UserRole.TENANT]: [
    'properties:read',
    'properties:search',
    'leads:create',
    'favorites:manage',
  ],
  [UserRole.OWNER]: [
    'properties:read',
    'properties:create',
    'properties:update:own',
    'properties:delete:own',
    'leads:read:own',
  ],
  [UserRole.DEALER]: [
    'properties:read',
    'properties:create',
    'properties:update:assigned',
    'leads:read:assigned',
    'leads:update:assigned',
    'analytics:read:own',
  ],
  [UserRole.DISTRIBUTOR]: [
    'properties:read',
    'properties:create',
    'properties:update:assigned',
    'leads:read:assigned',
    'leads:update:assigned',
    'dealers:read',
    'dealers:assign',
    'analytics:read:territory',
  ],
  [UserRole.INTERNAL_SALES]: [
    'properties:read',
    'leads:read',
    'leads:update',
    'leads:assign',
    'analytics:read',
  ],
  [UserRole.INTERNAL_MARKETING]: [
    'properties:read',
    'leads:read',
    'analytics:read',
    'content:manage',
  ],
  [UserRole.INTERNAL_OPS]: [
    'properties:read',
    'properties:moderate',
    'users:read',
    'audit:read',
  ],
  [UserRole.ADMIN]: [
    'properties:*',
    'users:*',
    'leads:*',
    'analytics:*',
    'settings:*',
  ],
  [UserRole.SUPER_ADMIN]: ['*'],
};





