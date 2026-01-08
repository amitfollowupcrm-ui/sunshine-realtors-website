// Utility functions to transform Prisma property models to Property type and vice versa

import type { Property } from '@/types/property.types';

/**
 * Transform Prisma property model (flat structure) to Property type (nested structure)
 * Note: This doesn't include relations like owner, dealer, etc. - add those separately if needed
 */
export function transformPrismaPropertyToProperty(prismaProperty: any): Property & { owner?: any; dealer?: any; listedBy?: any } {
  return {
    id: prismaProperty.id,
    ownerId: prismaProperty.ownerId,
    listedById: prismaProperty.listedById || undefined,
    dealerId: prismaProperty.dealerId || undefined,
    title: prismaProperty.title,
    description: prismaProperty.description,
    slug: prismaProperty.slug,
    category: prismaProperty.category,
    propertyType: prismaProperty.propertyType,
    subType: prismaProperty.subType || undefined,
    location: {
      country: prismaProperty.country || 'India',
      state: prismaProperty.state,
      city: prismaProperty.city,
      locality: prismaProperty.locality || undefined,
      sector: prismaProperty.sector || undefined,
      zone: prismaProperty.zone || undefined,
      pincode: prismaProperty.pincode || undefined,
      addressLine1: prismaProperty.addressLine1 || undefined,
      addressLine2: prismaProperty.addressLine2 || undefined,
      landmark: prismaProperty.landmark || undefined,
      latitude: prismaProperty.latitude ? Number(prismaProperty.latitude) : undefined,
      longitude: prismaProperty.longitude ? Number(prismaProperty.longitude) : undefined,
    },
    pricing: {
      price: Number(prismaProperty.price),
      pricePerUnit: prismaProperty.pricePerUnit ? Number(prismaProperty.pricePerUnit) : undefined,
      currency: prismaProperty.currency || 'INR',
      negotiable: prismaProperty.negotiable || false,
      maintenanceCharges: prismaProperty.maintenanceCharges ? Number(prismaProperty.maintenanceCharges) : undefined,
      securityDeposit: prismaProperty.securityDeposit ? Number(prismaProperty.securityDeposit) : undefined,
    },
    details: {
      builtUpArea: prismaProperty.builtUpArea ? Number(prismaProperty.builtUpArea) : undefined,
      carpetArea: prismaProperty.carpetArea ? Number(prismaProperty.carpetArea) : undefined,
      plotArea: prismaProperty.plotArea ? Number(prismaProperty.plotArea) : undefined,
      areaUnit: prismaProperty.areaUnit || 'sqft',
      bedrooms: prismaProperty.bedrooms || undefined,
      bathrooms: prismaProperty.bathrooms || undefined,
      balconies: prismaProperty.balconies || undefined,
      floors: prismaProperty.floors || undefined,
      floorNumber: prismaProperty.floorNumber || undefined,
      ageOfConstruction: prismaProperty.ageOfConstruction || undefined,
      facing: prismaProperty.facing || undefined,
      furnishingStatus: prismaProperty.furnishingStatus || undefined,
      parking: prismaProperty.parking || 0,
      powerBackup: prismaProperty.powerBackup || false,
      waterSupply: prismaProperty.waterSupply || undefined,
      amenities: prismaProperty.amenities || [],
    },
    possessionStatus: prismaProperty.possessionStatus || undefined,
    availableFrom: prismaProperty.availableFrom || undefined,
    constructionYear: prismaProperty.constructionYear || undefined,
    media: {
      primaryImageUrl: prismaProperty.primaryImageUrl || undefined,
      imageUrls: prismaProperty.imageUrls || [],
      videoUrls: prismaProperty.videoUrls || [],
      floorPlanUrls: prismaProperty.floorPlanUrls || [],
      virtualTourUrl: prismaProperty.virtualTourUrl || undefined,
    },
    status: prismaProperty.status,
    isVerified: prismaProperty.isVerified || false,
    isFeatured: prismaProperty.isFeatured || false,
    isPremium: prismaProperty.isPremium || false,
    verificationDate: prismaProperty.verificationDate || undefined,
    verifiedById: prismaProperty.verifiedById || undefined,
    seo: {
      metaTitle: prismaProperty.metaTitle || prismaProperty.title,
      metaDescription: prismaProperty.metaDescription || prismaProperty.description.substring(0, 160),
      keywords: prismaProperty.keywords || [],
      slug: prismaProperty.slug,
    },
    expiresAt: prismaProperty.expiresAt || undefined,
    autoRenew: prismaProperty.autoRenew || false,
    viewCount: prismaProperty.viewCount || 0,
    inquiryCount: prismaProperty.inquiryCount || 0,
    favoriteCount: prismaProperty.favoriteCount || 0,
    createdAt: prismaProperty.createdAt,
    updatedAt: prismaProperty.updatedAt,
    deletedAt: prismaProperty.deletedAt || undefined,
    // Preserve relations if they exist
    ...(prismaProperty.owner && { owner: prismaProperty.owner }),
    ...(prismaProperty.dealer && { dealer: prismaProperty.dealer }),
    ...(prismaProperty.listedBy && { listedBy: prismaProperty.listedBy }),
  } as Property & { owner?: any; dealer?: any; listedBy?: any };
}

/**
 * Transform Property type to flat structure for PropertyCardClient component
 */
export function transformPropertyForCard(property: Property | any): {
  id: string;
  title: string;
  slug: string;
  primaryImageUrl?: string;
  locality?: string;
  city?: string;
  state?: string;
  price: number;
  bedrooms?: number;
  builtUpArea?: number;
} {
  // Handle both Property type (nested) and Prisma model (flat)
  if (property.location && property.pricing && property.details) {
    // Already in Property type format (nested)
    return {
      id: property.id,
      title: property.title,
      slug: property.slug,
      primaryImageUrl: property.media?.primaryImageUrl,
      locality: property.location.locality,
      city: property.location.city,
      state: property.location.state,
      price: property.pricing.price,
      bedrooms: property.details.bedrooms,
      builtUpArea: property.details.builtUpArea ? Number(property.details.builtUpArea) : undefined,
    };
  } else {
    // Prisma model format (flat)
    return {
      id: property.id,
      title: property.title,
      slug: property.slug,
      primaryImageUrl: property.primaryImageUrl,
      locality: property.locality,
      city: property.city,
      state: property.state,
      price: Number(property.price),
      bedrooms: property.bedrooms,
      builtUpArea: property.builtUpArea ? Number(property.builtUpArea) : undefined,
    };
  }
}

