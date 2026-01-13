// Property Service
// Handles property CRUD operations, moderation, and listing management

import { prisma } from '@/config/database';
import { cache, CacheKeys } from '@/config/redis';
import { crmService } from './crm.service';
import { transformPrismaPropertyToProperty } from '@/lib/utils/property.transform';
import type {
  Property,
  PropertyCreateInput,
  PropertyUpdateInput,
  PropertySearchFilters,
  PropertySearchResult,
  PropertyCategory,
  PropertyStatus,
} from '@/types/property.types';

class PropertyService {
  /**
   * Generate SEO-friendly slug from title
   */
  private generateSlug(title: string, id?: string): string {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .substring(0, 100);

    return id ? `${baseSlug}-${id.substring(0, 8)}` : baseSlug;
  }

  /**
   * Create new property
   */
  async createProperty(
    input: PropertyCreateInput,
    ownerId: string,
    listedById?: string
  ): Promise<Property> {
    // Generate slug
    const slug = this.generateSlug(input.title);

    // Create property
    const property = await prisma.property.create({
      data: {
        ownerId,
        listedById,
        title: input.title,
        description: input.description,
        slug,
        category: input.category,
        propertyType: input.propertyType,
        subType: input.subType,
        country: input.location.country || 'India',
        state: input.location.state,
        city: input.location.city,
        locality: input.location.locality,
        sector: input.location.sector,
        zone: input.location.zone,
        pincode: input.location.pincode,
        addressLine1: input.location.addressLine1,
        addressLine2: input.location.addressLine2,
        landmark: input.location.landmark,
        latitude: input.location.latitude ? Number(input.location.latitude) : null,
        longitude: input.location.longitude ? Number(input.location.longitude) : null,
        price: input.pricing.price,
        pricePerUnit: input.pricing.pricePerUnit,
        currency: input.pricing.currency || 'INR',
        negotiable: input.pricing.negotiable || false,
        maintenanceCharges: input.pricing.maintenanceCharges,
        securityDeposit: input.pricing.securityDeposit,
        builtUpArea: input.details.builtUpArea,
        carpetArea: input.details.carpetArea,
        plotArea: input.details.plotArea,
        areaUnit: input.details.areaUnit || 'sqft',
        bedrooms: input.details.bedrooms,
        bathrooms: input.details.bathrooms,
        balconies: input.details.balconies,
        floors: input.details.floors,
        floorNumber: input.details.floorNumber,
        ageOfConstruction: input.details.ageOfConstruction,
        facing: input.details.facing,
        furnishingStatus: input.details.furnishingStatus,
        parking: input.details.parking || 0,
        powerBackup: input.details.powerBackup || false,
        waterSupply: input.details.waterSupply,
        amenities: input.details.amenities || [],
        possessionStatus: input.possessionStatus,
        availableFrom: input.availableFrom,
        constructionYear: input.constructionYear,
        primaryImageUrl: input.media.primaryImageUrl,
        imageUrls: input.media.imageUrls || [],
        videoUrls: input.media.videoUrls || [],
        floorPlanUrls: input.media.floorPlanUrls || [],
        virtualTourUrl: input.media.virtualTourUrl,
        status: 'PENDING_VERIFICATION',
        isVerified: false,
        metaTitle: input.seo?.metaTitle || input.title,
        metaDescription: input.seo?.metaDescription || input.description.substring(0, 160),
        keywords: input.seo?.keywords || [],
        expiresAt: input.expiresAt,
        autoRenew: input.autoRenew || false,
      },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        dealer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        images: true,
      },
    });

    // Clear search cache
    await cache.delPattern('property:search:*');

    // Trigger CRM sync (async, don't wait)
    if (property.dealerId) {
      crmService.syncProperty(property.id).catch(console.error);
    }

    // Transform Prisma model to Property type
    return transformPrismaPropertyToProperty(property);
  }

  /**
   * Update property
   */
  async updateProperty(
    propertyId: string,
    input: PropertyUpdateInput,
    userId: string,
    userRole: string
  ): Promise<Property> {
    // Check if property exists and user has permission
    const existing = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!existing) {
      throw new Error('Property not found');
    }

    // Check permissions (owner, dealer, or admin)
    const canUpdate =
      existing.ownerId === userId ||
      existing.dealerId === userId ||
      userRole === 'ADMIN' ||
      userRole === 'SUPER_ADMIN';

    if (!canUpdate) {
      throw new Error('Insufficient permissions to update this property');
    }

    // Update property
    const updateData: any = {};

    if (input.title) {
      updateData.title = input.title;
      updateData.slug = this.generateSlug(input.title, propertyId);
    }
    if (input.description) updateData.description = input.description;
    if (input.category) updateData.category = input.category;
    if (input.propertyType) updateData.propertyType = input.propertyType;
    if (input.location) {
      if (input.location.state) updateData.state = input.location.state;
      if (input.location.city) updateData.city = input.location.city;
      if (input.location.locality) updateData.locality = input.location.locality;
      if (input.location.latitude) updateData.latitude = Number(input.location.latitude);
      if (input.location.longitude) updateData.longitude = Number(input.location.longitude);
    }
    if (input.pricing) {
      if (input.pricing.price !== undefined) updateData.price = input.pricing.price;
      if (input.pricing.pricePerUnit !== undefined) updateData.pricePerUnit = input.pricing.pricePerUnit;
      if (input.pricing.negotiable !== undefined) updateData.negotiable = input.pricing.negotiable;
    }
    if (input.media) {
      if (input.media.primaryImageUrl) updateData.primaryImageUrl = input.media.primaryImageUrl;
      if (input.media.imageUrls) updateData.imageUrls = input.media.imageUrls;
    }
    if ('status' in input && input.status) {
      updateData.status = (input as any).status;
    }

    const property = await prisma.property.update({
      where: { id: propertyId },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        dealer: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        images: true,
      },
    });

    // Clear caches
    await cache.del(CacheKeys.property(propertyId));
    await cache.delPattern('property:search:*');

    // Trigger CRM sync
    if (property.dealerId) {
      crmService.syncProperty(property.id).catch(console.error);
    }

    // Transform Prisma model to Property type
    return transformPrismaPropertyToProperty(property);
  }

  /**
   * Get property by ID
   */
  async getPropertyById(propertyId: string): Promise<Property | null> {
    // Check cache
    const cached = await cache.get<Property>(CacheKeys.property(propertyId));
    if (cached) {
      return cached;
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        listedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        dealer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        images: {
          orderBy: { orderIndex: 'asc' },
        },
        amenitiesDetails: true,
      },
    });

    if (property) {
      // Transform Prisma model to Property type
      const transformedProperty = transformPrismaPropertyToProperty(property);
      // Cache for 1 hour
      await cache.set(CacheKeys.property(propertyId), transformedProperty, 3600);
      return transformedProperty;
    }

    return null;
  }

  /**
   * Get property by slug
   * Guards against undefined/empty slug to prevent Prisma errors during build
   */
  async getPropertyBySlug(slug: string): Promise<Property | null> {
    // Guard: Ensure slug is a valid non-empty string before Prisma query
    // This prevents Prisma from being called with undefined/empty values during static generation
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return null;
    }

    const property = await prisma.property.findUnique({
      where: { slug },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        dealer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        images: {
          orderBy: { orderIndex: 'asc' },
        },
        amenitiesDetails: true,
      },
    });

    if (property) {
      // Increment view count (async)
      prisma.property.update({
        where: { id: property.id },
        data: {
          viewCount: { increment: 1 },
          lastViewedAt: new Date(),
        },
      }).catch(console.error);

      // Transform Prisma model to Property type
      return transformPrismaPropertyToProperty(property);
    }

    return null;
  }

  /**
   * Search properties
   */
  async searchProperties(
    filters: PropertySearchFilters
  ): Promise<PropertySearchResult> {
    const {
      category,
      propertyType,
      city,
      locality,
      state,
      priceMin,
      priceMax,
      bedrooms,
      bathrooms,
      furnishingStatus,
      possessionStatus,
      amenities,
      isVerified,
      isFeatured,
      areaMin,
      areaMax,
      ownerId,
      status,
      sortBy = 'newest',
      page = 1,
      limit = 20,
    } = filters;

    // Generate cache key
    const cacheKey = CacheKeys.propertySearch(
      JSON.stringify(filters)
    );

    // Check cache
    const cached = await cache.get<PropertySearchResult>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build where clause
    const where: any = {
      deletedAt: null,
    };

    // Status filter: use provided status filter, or default to ACTIVE
    if (status && status.length > 0) {
      where.status = { in: status };
    } else {
      where.status = 'ACTIVE';
    }

    // Filter by owner if specified
    if (ownerId) {
      where.ownerId = ownerId;
    }

    if (category && category.length > 0) {
      where.category = { in: category };
    }

    if (propertyType && propertyType.length > 0) {
      where.propertyType = { in: propertyType };
    }

    if (city && city.length > 0) {
      where.city = { in: city };
    }

    if (locality && locality.length > 0) {
      where.locality = { in: locality };
    }

    if (state && state.length > 0) {
      where.state = { in: state };
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price.gte = priceMin;
      if (priceMax !== undefined) where.price.lte = priceMax;
    }

    if (bedrooms && bedrooms.length > 0) {
      where.bedrooms = { in: bedrooms };
    }

    if (bathrooms && bathrooms.length > 0) {
      where.bathrooms = { in: bathrooms };
    }

    if (furnishingStatus && furnishingStatus.length > 0) {
      where.furnishingStatus = { in: furnishingStatus };
    }

    if (possessionStatus && possessionStatus.length > 0) {
      where.possessionStatus = { in: possessionStatus };
    }

    if (amenities && amenities.length > 0) {
      where.amenities = { hasSome: amenities };
    }

    if (isVerified !== undefined) {
      where.isVerified = isVerified;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (areaMin !== undefined || areaMax !== undefined) {
      where.OR = [
        { builtUpArea: {} },
        { carpetArea: {} },
        { plotArea: {} },
      ];
    }

    // Build orderBy
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' };
    }

    // Execute query
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              fullName: true,
            },
          },
          images: {
            take: 1,
            orderBy: { orderIndex: 'asc' },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    // Transform all properties to Property type
    const transformedProperties = properties.map(transformPrismaPropertyToProperty);

    const result: PropertySearchResult = {
      properties: transformedProperties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, result, 300);

    return result;
  }

  /**
   * Moderate property (admin only)
   */
  async moderateProperty(
    propertyId: string,
    action: 'APPROVE' | 'REJECT',
    reason?: string,
    moderatorId?: string
  ): Promise<Property> {
    const property = await prisma.property.update({
      where: { id: propertyId },
      data: {
        status: action === 'APPROVE' ? 'ACTIVE' : 'REJECTED',
        isVerified: action === 'APPROVE',
        verificationDate: action === 'APPROVE' ? new Date() : null,
        verifiedById: action === 'APPROVE' ? moderatorId : null,
      },
    });

    // Clear caches
    await cache.del(CacheKeys.property(propertyId));
    await cache.delPattern('property:search:*');

    // Trigger CRM sync if approved
    if (action === 'APPROVE' && property.dealerId) {
      crmService.syncProperty(property.id).catch(console.error);
    }

    // Transform Prisma model to Property type
    return transformPrismaPropertyToProperty(property);
  }

  /**
   * Delete property (soft delete)
   */
  async deleteProperty(
    propertyId: string,
    userId: string,
    userRole: string
  ): Promise<void> {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new Error('Property not found');
    }

    // Check permissions
    const canDelete =
      property.ownerId === userId ||
      userRole === 'ADMIN' ||
      userRole === 'SUPER_ADMIN';

    if (!canDelete) {
      throw new Error('Insufficient permissions');
    }

    // Soft delete
    await prisma.property.update({
      where: { id: propertyId },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });

    // Clear caches
    await cache.del(CacheKeys.property(propertyId));
    await cache.delPattern('property:search:*');
  }
}

export const propertyService = new PropertyService();


