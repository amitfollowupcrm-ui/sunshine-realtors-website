// Property validation schemas using Zod

import { z } from 'zod';
import { PropertyCategory, PropertyType, FurnishingStatus, PossessionStatus } from '@/types/property.types';

export const propertyCreateSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(500),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category: z.nativeEnum(PropertyCategory),
  propertyType: z.nativeEnum(PropertyType),
  subType: z.string().optional(),
  location: z.object({
    country: z.string().default('India'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    locality: z.string().optional(),
    sector: z.string().optional(),
    zone: z.string().optional(),
    pincode: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  pricing: z.object({
    price: z.number().positive('Price must be positive'),
    pricePerUnit: z.number().positive().optional(),
    currency: z.string().default('INR'),
    negotiable: z.boolean().default(false),
    maintenanceCharges: z.number().nonnegative().optional(),
    securityDeposit: z.number().nonnegative().optional(),
  }),
  details: z.object({
    builtUpArea: z.number().positive().optional(),
    carpetArea: z.number().positive().optional(),
    plotArea: z.number().positive().optional(),
    areaUnit: z.enum(['sqft', 'sqmt']).default('sqft'),
    bedrooms: z.number().int().nonnegative().optional(),
    bathrooms: z.number().int().nonnegative().optional(),
    balconies: z.number().int().nonnegative().optional(),
    floors: z.number().int().positive().optional(),
    floorNumber: z.number().int().nonnegative().optional(),
    ageOfConstruction: z.number().int().nonnegative().optional(),
    facing: z.string().optional(),
    furnishingStatus: z.nativeEnum(FurnishingStatus).optional(),
    parking: z.number().int().nonnegative().default(0),
    powerBackup: z.boolean().default(false),
    waterSupply: z.enum(['municipal', 'borewell', 'both']).optional(),
    amenities: z.array(z.string()).default([]),
  }),
  possessionStatus: z.nativeEnum(PossessionStatus).optional(),
  availableFrom: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
  constructionYear: z.number().int().min(1900).max(new Date().getFullYear() + 5).optional(),
  media: z.object({
    primaryImageUrl: z.string().url().optional(),
    imageUrls: z.array(z.string().url()).default([]),
    videoUrls: z.array(z.string().url()).default([]),
    floorPlanUrls: z.array(z.string().url()).default([]),
    virtualTourUrl: z.string().url().optional(),
  }),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).default([]),
  }).optional(),
  expiresAt: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
  autoRenew: z.boolean().default(false),
});

export const propertyUpdateSchema = propertyCreateSchema.partial();

export const propertySearchSchema = z.object({
  category: z.array(z.nativeEnum(PropertyCategory)).optional(),
  propertyType: z.array(z.nativeEnum(PropertyType)).optional(),
  city: z.array(z.string()).optional(),
  locality: z.array(z.string()).optional(),
  state: z.array(z.string()).optional(),
  priceMin: z.number().nonnegative().optional(),
  priceMax: z.number().nonnegative().optional(),
  bedrooms: z.array(z.number().int()).optional(),
  bathrooms: z.array(z.number().int()).optional(),
  furnishingStatus: z.array(z.nativeEnum(FurnishingStatus)).optional(),
  possessionStatus: z.array(z.nativeEnum(PossessionStatus)).optional(),
  amenities: z.array(z.string()).optional(),
  isVerified: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  areaMin: z.number().nonnegative().optional(),
  areaMax: z.number().nonnegative().optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'oldest', 'relevance']).default('newest'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  q: z.string().optional(), // Search query
});

export const propertyModerateSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  reason: z.string().optional(),
});

export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>;
export type PropertyUpdateInput = z.infer<typeof propertyUpdateSchema>;
export type PropertySearchInput = z.infer<typeof propertySearchSchema>;
export type PropertyModerateInput = z.infer<typeof propertyModerateSchema>;

