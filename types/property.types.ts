// Property-related TypeScript types

export enum PropertyCategory {
  BUY = 'BUY',
  RENT = 'RENT',
  NEW_LAUNCH = 'NEW_LAUNCH',
  COMMERCIAL = 'COMMERCIAL',
  PLOTS = 'PLOTS',
}

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA',
  PENTHOUSE = 'PENTHOUSE',
  STUDIO = 'STUDIO',
  SHOP = 'SHOP',
  OFFICE = 'OFFICE',
  WAREHOUSE = 'WAREHOUSE',
  SHOWROOM = 'SHOWROOM',
  PLOT = 'PLOT',
  FARMLAND = 'FARMLAND',
  FARMHOUSE = 'FARMHOUSE',
  MIXED_USE = 'MIXED_USE',
}

export enum PropertyStatus {
  DRAFT = 'DRAFT',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
}

export enum FurnishingStatus {
  UNFURNISHED = 'UNFURNISHED',
  SEMI_FURNISHED = 'SEMI_FURNISHED',
  FULLY_FURNISHED = 'FULLY_FURNISHED',
}

export enum PossessionStatus {
  READY_TO_MOVE = 'READY_TO_MOVE',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  RESALE = 'RESALE',
}

export enum LeadSource {
  PROPERTY_INQUIRY = 'PROPERTY_INQUIRY',
  CONTACT_FORM = 'CONTACT_FORM',
  PHONE_CALL = 'PHONE_CALL',
  WALK_IN = 'WALK_IN',
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  ADVERTISEMENT = 'ADVERTISEMENT',
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  VIEWING_SCHEDULED = 'VIEWING_SCHEDULED',
  VIEWED = 'VIEWED',
  NEGOTIATING = 'NEGOTIATING',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
  CLOSED = 'CLOSED',
}

export enum InquiryType {
  BUY = 'BUY',
  RENT = 'RENT',
  SELL = 'SELL',
  INVEST = 'INVEST',
}

export interface PropertyLocation {
  country: string;
  state: string;
  city: string;
  locality?: string;
  sector?: string;
  zone?: string;
  pincode?: string;
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyPricing {
  price: number;
  pricePerUnit?: number;
  currency?: string;
  negotiable?: boolean;
  maintenanceCharges?: number;
  securityDeposit?: number;
}

export interface PropertyDetails {
  builtUpArea?: number;
  carpetArea?: number;
  plotArea?: number;
  areaUnit?: 'sqft' | 'sqmt';
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  floors?: number;
  floorNumber?: number;
  ageOfConstruction?: number;
  facing?: string;
  furnishingStatus?: FurnishingStatus;
  parking?: number;
  powerBackup?: boolean;
  waterSupply?: 'municipal' | 'borewell' | 'both';
  amenities?: string[];
}

export interface PropertyMedia {
  primaryImageUrl?: string;
  imageUrls?: string[];
  videoUrls?: string[];
  floorPlanUrls?: string[];
  virtualTourUrl?: string;
}

export interface PropertySEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  slug: string;
}

export interface Property {
  id: string;
  ownerId: string;
  listedById?: string;
  dealerId?: string;
  title: string;
  description: string;
  slug: string;
  category: PropertyCategory;
  propertyType: PropertyType;
  subType?: string;
  location: PropertyLocation;
  pricing: PropertyPricing;
  details: PropertyDetails;
  possessionStatus?: PossessionStatus;
  availableFrom?: Date;
  constructionYear?: number;
  media: PropertyMedia;
  status: PropertyStatus;
  isVerified: boolean;
  isFeatured: boolean;
  isPremium: boolean;
  verificationDate?: Date;
  verifiedById?: string;
  seo: PropertySEO;
  expiresAt?: Date;
  autoRenew?: boolean;
  viewCount: number;
  inquiryCount: number;
  favoriteCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PropertySearchFilters {
  category?: PropertyCategory[];
  propertyType?: PropertyType[];
  city?: string[];
  locality?: string[];
  state?: string[];
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number[];
  bathrooms?: number[];
  furnishingStatus?: FurnishingStatus[];
  possessionStatus?: PossessionStatus[];
  amenities?: string[];
  isVerified?: boolean;
  isFeatured?: boolean;
  areaMin?: number;
  areaMax?: number;
  ownerId?: string; // Filter by property owner
  status?: PropertyStatus[]; // Filter by status (optional, defaults to ACTIVE)
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'relevance';
  page?: number;
  limit?: number;
}

export interface PropertySearchResult {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PropertyCreateInput {
  title: string;
  description: string;
  category: PropertyCategory;
  propertyType: PropertyType;
  subType?: string;
  location: PropertyLocation;
  pricing: PropertyPricing;
  details: PropertyDetails;
  possessionStatus?: PossessionStatus;
  availableFrom?: Date;
  constructionYear?: number;
  media: PropertyMedia;
  seo?: Partial<PropertySEO>;
  expiresAt?: Date;
  autoRenew?: boolean;
}

export interface PropertyUpdateInput extends Partial<PropertyCreateInput> {
  id: string;
}


