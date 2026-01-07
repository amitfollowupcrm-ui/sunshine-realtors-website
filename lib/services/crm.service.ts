// CRM Integration Service
// Handles bidirectional sync with external CRM system

import { prisma } from '@/config/database';
import { crmConfig, crmEvents, type CRMEvent } from '@/config/crm';
import { cache, CacheKeys } from '@/config/redis';
import type {
  CRMSyncLog,
  CRMSyncStatus,
  CRMSyncEvent,
  CRMEntityType,
  CRMLeadPayload,
  CRMPropertyPayload,
  CRMContactPayload,
  CRMDealerPayload,
  CRMSyncResponse,
  CRMSyncOptions,
} from '@/types/crm.types';
import { CRMSyncDirection } from '@/types/crm.types';

class CRMService {
  private async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    payload?: any
  ): Promise<Response> {
    if (!crmConfig.enabled) {
      throw new Error('CRM integration is not enabled');
    }

    const url = `${crmConfig.apiUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${crmConfig.apiKey}`,
      'X-API-Secret': crmConfig.apiSecret,
    };

    const options: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(crmConfig.timeout || 30000),
    };

    if (payload && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(payload);
    }

    return fetch(url, options);
  }

  async syncLead(
    leadId: string,
    direction: CRMSyncDirection = CRMSyncDirection.OUTBOUND,
    options?: CRMSyncOptions
  ): Promise<CRMSyncResponse> {
    try {
      // Get lead data
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        include: {
          property: {
            select: { id: true, title: true, city: true, price: true },
          },
        },
      });

      if (!lead) {
        throw new Error('Lead not found');
      }

      // Check if already synced
      if (lead.crmSyncStatus === 'SYNCED' && lead.crmLeadId && !options?.force) {
        return {
          success: true,
          externalId: lead.crmLeadId,
          message: 'Lead already synced',
        };
      }

      // Prepare payload
      const payload: CRMLeadPayload = {
        name: lead.name,
        email: lead.email || undefined,
        phone: lead.phone,
        source: lead.source,
        propertyId: lead.propertyId || undefined,
        status: lead.status,
        priority: lead.priority,
        assignedTo: lead.assignedToId || undefined,
        budgetMin: lead.budgetMin ? Number(lead.budgetMin) : undefined,
        budgetMax: lead.budgetMax ? Number(lead.budgetMax) : undefined,
        preferredLocation: lead.preferredLocation,
        preferredPropertyType: lead.preferredPropertyType || undefined,
        notes: lead.notes || undefined,
        utmSource: lead.utmSource || undefined,
        utmMedium: lead.utmMedium || undefined,
        utmCampaign: lead.utmCampaign || undefined,
        metadata: {
          internalLeadId: lead.id,
          property: lead.property ? {
            id: lead.property.id,
            title: lead.property.title,
            city: lead.property.city,
            price: Number(lead.property.price),
          } : undefined,
        },
      };

      // Create sync log
      const syncLog = await prisma.cRMSyncLog.create({
        data: {
          entityType: 'LEAD',
          entityId: leadId,
          syncDirection: direction,
          syncEvent: lead.crmLeadId ? 'UPDATED' : 'CREATED',
          payload: payload as any,
          status: 'PENDING',
        },
      });

      try {
        // Make API call
        const endpoint = lead.crmLeadId
          ? `/leads/${lead.crmLeadId}`
          : '/leads';
        const method = lead.crmLeadId ? 'PUT' : 'POST';

        const response = await this.makeRequest(endpoint, method, payload);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`CRM API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();

        // Update sync log
        await prisma.cRMSyncLog.update({
          where: { id: syncLog.id },
          data: {
            status: 'SYNCED',
            httpStatusCode: response.status,
            externalId: result.id || result.externalId || lead.crmLeadId,
            syncedAt: new Date(),
          },
        });

        // Update lead
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            crmLeadId: result.id || result.externalId || lead.crmLeadId,
            crmSyncStatus: 'SYNCED',
            crmSyncedAt: new Date(),
            crmSyncError: null,
          },
        });

        return {
          success: true,
          externalId: result.id || result.externalId,
          message: 'Lead synced successfully',
        };
      } catch (error: any) {
        // Update sync log with error
        await prisma.cRMSyncLog.update({
          where: { id: syncLog.id },
          data: {
            status: 'FAILED',
            errorMessage: error.message,
            httpStatusCode: error.status || 500,
            retryCount: syncLog.retryCount + 1,
          },
        });

        // Update lead
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            crmSyncStatus: 'FAILED',
            crmSyncError: error.message,
          },
        });

        // Retry logic
        if (
          options?.retryOnFailure !== false &&
          syncLog.retryCount < (options?.maxRetries || crmConfig.retryAttempts || 3)
        ) {
          // Schedule retry (would integrate with job queue in production)
          await this.scheduleRetry(syncLog.id, options?.delay || crmConfig.retryDelay || 1000);
          return {
            success: false,
            error: error.message,
            message: 'Sync failed, retry scheduled',
          };
        }

        throw error;
      }
    } catch (error: any) {
      console.error('CRM sync error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async syncProperty(
    propertyId: string,
    direction: CRMSyncDirection = CRMSyncDirection.OUTBOUND,
    options?: CRMSyncOptions
  ): Promise<CRMSyncResponse> {
    // Similar implementation for property sync
    // Would fetch property, prepare payload, make API call, update sync log
    throw new Error('Property sync not yet implemented');
  }

  async handleInboundWebhook(
    event: CRMEvent,
    payload: any,
    secret: string
  ): Promise<{ success: boolean; message: string }> {
    // Verify webhook secret
    if (secret !== crmConfig.webhookSecret) {
      throw new Error('Invalid webhook secret');
    }

    try {
      switch (event) {
        case crmEvents.LEAD_UPDATED:
          await this.handleLeadUpdate(payload);
          break;
        case crmEvents.LEAD_STATUS_CHANGED:
          await this.handleLeadStatusChange(payload);
          break;
        default:
          console.warn(`Unhandled webhook event: ${event}`);
      }

      return { success: true, message: 'Webhook processed' };
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }

  private async handleLeadUpdate(payload: any): Promise<void> {
    // Find lead by external ID
    const lead = await prisma.lead.findFirst({
      where: { crmLeadId: payload.externalId },
    });

    if (!lead) {
      console.warn(`Lead not found for external ID: ${payload.externalId}`);
      return;
    }

    // Update lead with CRM data
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: payload.status || lead.status,
        priority: payload.priority || lead.priority,
        notes: payload.notes || lead.notes,
        lastContactedAt: payload.lastContactedAt
          ? new Date(payload.lastContactedAt)
          : lead.lastContactedAt,
        nextFollowupAt: payload.nextFollowupAt
          ? new Date(payload.nextFollowupAt)
          : lead.nextFollowupAt,
      },
    });

    // Log sync
    await prisma.cRMSyncLog.create({
      data: {
        entityType: 'LEAD',
        entityId: lead.id,
        syncDirection: 'INBOUND',
        syncEvent: 'UPDATED',
        payload: payload,
        status: 'SYNCED',
        externalId: payload.externalId,
        syncedAt: new Date(),
      },
    });
  }

  private async handleLeadStatusChange(payload: any): Promise<void> {
    await this.handleLeadUpdate({
      ...payload,
      status: payload.newStatus,
    });
  }

  private async scheduleRetry(
    syncLogId: string,
    delayMs: number
  ): Promise<void> {
    // In production, this would enqueue a job using BullMQ or similar
    // For now, just log it
    console.log(`Scheduling retry for sync log ${syncLogId} in ${delayMs}ms`);
    // TODO: Integrate with job queue
  }

  async getFailedSyncs(
    limit: number = 50
  ): Promise<CRMSyncLog[]> {
    return prisma.cRMSyncLog.findMany({
      where: {
        status: 'FAILED',
        retryCount: { lt: crmConfig.retryAttempts || 3 },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }) as Promise<CRMSyncLog[]>;
  }

  async retryFailedSyncs(): Promise<{ success: number; failed: number }> {
    const failedSyncs = await this.getFailedSyncs(100);
    let success = 0;
    let failed = 0;

    for (const syncLog of failedSyncs) {
      try {
        if (syncLog.entityType === 'LEAD') {
          const result = await this.syncLead(
            syncLog.entityId,
            syncLog.syncDirection as CRMSyncDirection,
            { retryOnFailure: false }
          );
          if (result.success) {
            success++;
          } else {
            failed++;
          }
        }
      } catch (error) {
        failed++;
        console.error(`Retry failed for sync log ${syncLog.id}:`, error);
      }
    }

    return { success, failed };
  }
}

export const crmService = new CRMService();


