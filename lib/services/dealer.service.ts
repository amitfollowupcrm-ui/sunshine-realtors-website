// Dealer Service
// Handles dealer performance tracking and territory management

import { prisma } from '@/config/database';

class DealerService {
  /**
   * Get dealer performance metrics
   */
  async getDealerPerformance(
    dealerId: string,
    periodStart?: Date,
    periodEnd?: Date
  ): Promise<any> {
    const start = periodStart || new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = periodEnd || new Date();

    // Get or create performance record
    let performance = await prisma.dealerPerformance.findFirst({
      where: {
        dealerId,
        periodStart: { lte: end },
        periodEnd: { gte: start },
      },
    });

    if (!performance) {
      // Calculate from actual data
      const [totalLeads, leadsContacted, leadsConverted, propertiesListed, propertiesSold] = await Promise.all([
        prisma.lead.count({
          where: {
            assignedToId: dealerId,
            createdAt: { gte: start, lte: end },
          },
        }),
        prisma.lead.count({
          where: {
            assignedToId: dealerId,
            status: { not: 'NEW' },
            createdAt: { gte: start, lte: end },
          },
        }),
        prisma.lead.count({
          where: {
            assignedToId: dealerId,
            status: 'CONVERTED',
            createdAt: { gte: start, lte: end },
          },
        }),
        prisma.property.count({
          where: {
            dealerId,
            createdAt: { gte: start, lte: end },
          },
        }),
        prisma.property.count({
          where: {
            dealerId,
            status: 'SOLD',
            updatedAt: { gte: start, lte: end },
          },
        }),
      ]);

      // Create performance record
      performance = await prisma.dealerPerformance.create({
        data: {
          dealerId,
          periodStart: start,
          periodEnd: end,
          totalLeads,
          leadsContacted,
          leadsConverted,
          propertiesListed,
          propertiesSold,
        },
      });
    }

    return performance;
  }

  /**
   * Get dealer territories
   */
  async getDealerTerritories(dealerId: string): Promise<any[]> {
    return prisma.dealerTerritory.findMany({
      where: {
        dealerId,
        isActive: true,
      },
    });
  }

  /**
   * Assign territory to dealer
   */
  async assignTerritory(
    dealerId: string,
    city: string,
    zones?: string[]
  ): Promise<any> {
    // Check if territory already exists
    const existing = await prisma.dealerTerritory.findFirst({
      where: {
        dealerId,
        city,
        isActive: true,
      },
    });

    if (existing) {
      // Update existing
      return prisma.dealerTerritory.update({
        where: { id: existing.id },
        data: {
          zones: zones || [],
        },
      });
    }

    // Create new
    return prisma.dealerTerritory.create({
      data: {
        dealerId,
        city,
        zones: zones || [],
        isActive: true,
      },
    });
  }

  /**
   * Get top performing dealers
   */
  async getTopDealers(limit: number = 10, periodDays: number = 30): Promise<any[]> {
    const start = new Date();
    start.setDate(start.getDate() - periodDays);

    const performances = await prisma.dealerPerformance.findMany({
      where: {
        periodEnd: { gte: start },
      },
      include: {
        dealer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profile: true,
          },
        },
      },
      orderBy: [
        { leadsConverted: 'desc' },
        { propertiesSold: 'desc' },
      ],
      take: limit,
    });

    return performances;
  }
}

export const dealerService = new DealerService();

