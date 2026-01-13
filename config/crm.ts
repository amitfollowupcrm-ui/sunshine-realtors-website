// CRM Integration configuration

export interface CRMConfig {
  apiUrl: string;
  apiKey: string;
  apiSecret: string;
  webhookUrl?: string;
  webhookSecret?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  enabled: boolean;
}

export const crmConfig: CRMConfig = {
  apiUrl: process.env.CRM_API_URL || '',
  apiKey: process.env.CRM_API_KEY || '',
  apiSecret: process.env.CRM_API_SECRET || '',
  webhookUrl: process.env.CRM_WEBHOOK_URL,
  webhookSecret: process.env.CRM_WEBHOOK_SECRET,
  timeout: parseInt(process.env.CRM_TIMEOUT || '30000', 10),
  retryAttempts: parseInt(process.env.CRM_RETRY_ATTEMPTS || '3', 10),
  retryDelay: parseInt(process.env.CRM_RETRY_DELAY || '1000', 10),
  enabled: process.env.CRM_ENABLED === 'true',
};

export const crmEvents = {
  LEAD_CREATED: 'lead.created',
  LEAD_UPDATED: 'lead.updated',
  LEAD_STATUS_CHANGED: 'lead.status_changed',
  PROPERTY_CREATED: 'property.created',
  PROPERTY_UPDATED: 'property.updated',
  PROPERTY_VERIFIED: 'property.verified',
  INQUIRY_CREATED: 'inquiry.created',
  DEALER_ASSIGNED: 'dealer.assigned',
  CONTACT_CREATED: 'contact.created',
} as const;

export type CRMEvent = typeof crmEvents[keyof typeof crmEvents];





