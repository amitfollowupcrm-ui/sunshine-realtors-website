// Lead Service
// Handles lead/inquiry management, assignment, and CRM sync

import { prisma } from '@/config/database';
import { cache, CacheKeys } from '@/config/redis';
import { crmService } from './crm.service';
import type {
  LeadStatus,
  LeadSource,
  InquiryType,
} from '@/types/property.types';

interface LeadCreateInput {
  source: LeadSource;
  propertyId?: string;
  projectId?: string;
  name: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  inquiryType?: InquiryType;
  budgetMin?: number;
  budgetMax?: number;
  preferredLocation?: string[];
  preferredPropertyType?: string;
  message?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrerUrl?: string;
}

interface LeadUpdateInput {
  status?: LeadStatus;
  priority?: string;
  assignedToId?: string;
  notes?: string;
  lastContactedAt?: Date;
  nextFollowupAt?: Date;
}

interface LeadFilter {
  status?: LeadStatus[];
  assignedToId?: string;
  propertyId?: string;
  source?: LeadSource[];
  priority?: string[];
  page?: number;
  limit?: number;
}

class LeadService {
  /**
   * Create new lead/inquiry
   */
  async createLead(input: LeadCreateInput): Promise<any> {
    // Create lead
    const lead = await prisma.lead.create({
      data: {
        source: input.source,
        propertyId: input.propertyId,
        projectId: input.projectId,
        name: input.name,
        email: input.email,
        phone: input.phone,
        alternatePhone: input.alternatePhone,
        inquiryType: input.inquiryType,
        budgetMin: input.budgetMin,
        budgetMax: input.budgetMax,
        preferredLocation: input.preferredLocation || [],
        preferredPropertyType: input.preferredPropertyType,
        notes: input.message,
        status: 'NEW',
        priority: 'medium',
        utmSource: input.utmSource,
        utmMedium: input.utmMedium,
        utmCampaign: input.utmCampaign,
        referrerUrl: input.referrerUrl,
        crmSyncStatus: 'PENDING',
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            price: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
    });

    // Auto-assign to dealer if property has dealer
    if (lead.propertyId && lead.property) {
      const property = await prisma.property.findUnique({
        where: { id: lead.propertyId },
        select: { dealerId: true },
      });

      if (property?.dealerId) {
        await this.assignLead(lead.id, property.dealerId);
      }
    }

    // Increment inquiry count on property if applicable
    if (lead.propertyId) {
      await prisma.property.update({
        where: { id: lead.propertyId },
        data: {
          inquiryCount: { increment: 1 },
        },
      }).catch(console.error);
    }

    // Trigger CRM sync (async)
    crmService.syncLead(lead.id).catch((error) => {
      console.error('CRM sync error for lead:', lead.id, error);
    });

    return lead;
  }

  /**
   * Get lead by ID
   */
  async getLeadById(leadId: string): Promise<any | null> {
    // Check cache
    const cached = await cache.get<any>(CacheKeys.lead(leadId));
    if (cached) {
      return cached;
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            city: true,
            price: true,
            primaryImageUrl: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (lead) {
      // Cache for 5 minutes
      await cache.set(CacheKeys.lead(leadId), lead, 300);
      return lead;
    }

    return null;
  }

  /**
   * Get leads with filters
   */
  async getLeads(filters: LeadFilter): Promise<{
    leads: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      status,
      assignedToId,
      propertyId,
      source,
      priority,
      page = 1,
      limit = 20,
    } = filters;

    // Build where clause
    const where: any = {};

    if (status && status.length > 0) {
      where.status = { in: status };
    }

    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    if (propertyId) {
      where.propertyId = propertyId;
    }

    if (source && source.length > 0) {
      where.source = { in: source };
    }

    if (priority && priority.length > 0) {
      where.priority = { in: priority };
    }

    // Execute query
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              slug: true,
              city: true,
              price: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    return {
      leads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update lead
   */
  async updateLead(
    leadId: string,
    input: LeadUpdateInput,
    userId: string,
    userRole: string
  ): Promise<any> {
    // Check permissions
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Check if user can update (assigned dealer, admin, or owner of related property)
    const canUpdate =
      lead.assignedToId === userId ||
      userRole === 'ADMIN' ||
      userRole === 'SUPER_ADMIN' ||
      userRole === 'INTERNAL_SALES';

    if (!canUpdate && lead.propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: lead.propertyId },
        select: { ownerId: true },
      });
      if (property?.ownerId === userId) {
        // Property owner can update
      } else {
        throw new Error('Insufficient permissions to update this lead');
      }
    }

    // Track status change for CRM sync
    const statusChanged = input.status && input.status !== lead.status;

    // Update lead
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: input.status,
        priority: input.priority,
        assignedToId: input.assignedToId,
        notes: input.notes,
        lastContactedAt: input.lastContactedAt || (statusChanged ? new Date() : undefined),
        nextFollowupAt: input.nextFollowupAt,
      },
      include: {
        property: true,
        assignedTo: true,
      },
    });

    // Clear cache
    await cache.del(CacheKeys.lead(leadId));

    // Add activity log
    if (input.status || input.notes) {
      await this.addActivity(leadId, userId, {
        activityType: input.status ? 'status_change' : 'note',
        title: input.status ? `Status changed to ${input.status}` : 'Note added',
        description: input.notes,
        metadata: {
          oldStatus: lead.status,
          newStatus: input.status,
        },
      });
    }

    // Trigger CRM sync if status changed
    if (statusChanged) {
      crmService.syncLead(leadId).catch(console.error);
    }

    return updatedLead;
  }

  /**
   * Assign lead to dealer
   */
  async assignLead(
    leadId: string,
    dealerId: string,
    priority: string = 'medium'
  ): Promise<any> {
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        assignedToId: dealerId,
        assignedAt: new Date(),
        priority,
      },
      include: {
        assignedTo: true,
      },
    });

    // Clear cache
    await cache.del(CacheKeys.lead(leadId));

    // Add activity
    await this.addActivity(leadId, dealerId, {
      activityType: 'assignment',
      title: 'Lead assigned',
      description: `Assigned to ${lead.assignedTo?.fullName || 'dealer'}`,
    });

    // Trigger CRM sync
    crmService.syncLead(leadId).catch(console.error);

    return lead;
  }

  /**
   * Add activity to lead
   */
  async addActivity(
    leadId: string,
    userId: string | undefined,
    activity: {
      activityType: string;
      title: string;
      description?: string;
      metadata?: any;
    }
  ): Promise<void> {
    await prisma.leadActivity.create({
      data: {
        leadId,
        userId: userId || null,
        activityType: activity.activityType,
        title: activity.title,
        description: activity.description,
        metadata: activity.metadata || {},
      },
    });
  }

  /**
   * Get leads needing follow-up
   */
  async getLeadsNeedingFollowup(dealerId?: string): Promise<any[]> {
    const where: any = {
      nextFollowupAt: {
        lte: new Date(),
      },
      status: {
        notIn: ['CLOSED', 'CONVERTED', 'LOST'],
      },
    };

    if (dealerId) {
      where.assignedToId = dealerId;
    }

    return prisma.lead.findMany({
      where,
      orderBy: { nextFollowupAt: 'asc' },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            city: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  }

  /**
   * Get lead statistics
   */
  async getLeadStats(userId?: string, role?: string): Promise<{
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
    conversionRate: number;
  }> {
    const where: any = {};

    // Filter by assigned dealer if not admin
    if (userId && role !== 'ADMIN' && role !== 'SUPER_ADMIN' && role !== 'INTERNAL_SALES') {
      where.assignedToId = userId;
    }

    const [total, newLeads, contacted, qualified, converted] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.count({ where: { ...where, status: 'NEW' } }),
      prisma.lead.count({ where: { ...where, status: 'CONTACTED' } }),
      prisma.lead.count({ where: { ...where, status: 'QUALIFIED' } }),
      prisma.lead.count({ where: { ...where, status: 'CONVERTED' } }),
    ]);

    return {
      total,
      new: newLeads,
      contacted,
      qualified,
      converted,
      conversionRate: total > 0 ? (converted / total) * 100 : 0,
    };
  }
}

export const leadService = new LeadService();



