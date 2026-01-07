// CRM Integration TypeScript types

export enum CRMSyncStatus {
  PENDING = 'PENDING',
  SYNCED = 'SYNCED',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING',
}

export enum CRMSyncDirection {
  OUTBOUND = 'OUTBOUND',
  INBOUND = 'INBOUND',
}

export enum CRMSyncEvent {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  STATUS_CHANGED = 'STATUS_CHANGED',
}

export enum CRMEntityType {
  LEAD = 'LEAD',
  PROPERTY = 'PROPERTY',
  CONTACT = 'CONTACT',
  DEALER = 'DEALER',
}

export interface CRMSyncLog {
  id: string;
  entityType: CRMEntityType;
  entityId: string;
  syncDirection: CRMSyncDirection;
  syncEvent: CRMSyncEvent;
  payload: Record<string, any>;
  status: CRMSyncStatus;
  httpStatusCode?: number;
  errorMessage?: string;
  retryCount: number;
  externalId?: string;
  crmSystem?: string;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
}

export interface CRMLeadPayload {
  externalId?: string;
  name: string;
  email?: string;
  phone: string;
  source: string;
  propertyId?: string;
  projectId?: string;
  status: string;
  priority?: string;
  assignedTo?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredLocation?: string[];
  preferredPropertyType?: string;
  notes?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  metadata?: Record<string, any>;
}

export interface CRMPropertyPayload {
  externalId?: string;
  title: string;
  description: string;
  category: string;
  propertyType: string;
  city: string;
  locality?: string;
  price: number;
  status: string;
  ownerId?: string;
  dealerId?: string;
  metadata?: Record<string, any>;
}

export interface CRMContactPayload {
  externalId?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  city?: string;
  metadata?: Record<string, any>;
}

export interface CRMDealerPayload {
  externalId?: string;
  name: string;
  email: string;
  phone?: string;
  dealerType: string;
  city?: string;
  territory?: string[];
  commissionRate?: number;
  performance?: {
    totalLeads: number;
    leadsConverted: number;
    propertiesSold: number;
    rating: number;
  };
  metadata?: Record<string, any>;
}

export interface CRMWebhookConfig {
  id: string;
  webhookUrl: string;
  secretHash: string;
  events: string[];
  isActive: boolean;
  lastTriggeredAt?: Date;
  createdAt: Date;
}

export interface CRMConfig {
  apiUrl: string;
  apiKey: string;
  apiSecret: string;
  webhookUrl?: string;
  webhookSecret?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface CRMSyncOptions {
  retryOnFailure?: boolean;
  maxRetries?: number;
  delay?: number;
  priority?: 'low' | 'medium' | 'high';
  force?: boolean;
}

export interface CRMSyncResponse {
  success: boolean;
  externalId?: string;
  message?: string;
  error?: string;
}


