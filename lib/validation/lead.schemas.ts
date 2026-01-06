// Lead validation schemas using Zod

import { z } from 'zod';
import { LeadSource, LeadStatus, InquiryType } from '@/types/property.types';

export const leadCreateSchema = z.object({
  source: z.nativeEnum(LeadSource),
  propertyId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  alternatePhone: z.string().optional(),
  inquiryType: z.nativeEnum(InquiryType).optional(),
  budgetMin: z.number().nonnegative().optional(),
  budgetMax: z.number().nonnegative().optional(),
  preferredLocation: z.array(z.string()).optional(),
  preferredPropertyType: z.string().optional(),
  message: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  referrerUrl: z.string().url().optional(),
});

export const leadUpdateSchema = z.object({
  status: z.nativeEnum(LeadStatus).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignedToId: z.string().uuid().optional(),
  notes: z.string().optional(),
  lastContactedAt: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
  nextFollowupAt: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
});

export const leadAssignSchema = z.object({
  dealerId: z.string().uuid(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

export const leadFilterSchema = z.object({
  status: z.array(z.nativeEnum(LeadStatus)).optional(),
  assignedToId: z.string().uuid().optional(),
  propertyId: z.string().uuid().optional(),
  source: z.array(z.nativeEnum(LeadSource)).optional(),
  priority: z.array(z.enum(['low', 'medium', 'high', 'urgent'])).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;
export type LeadAssignInput = z.infer<typeof leadAssignSchema>;
export type LeadFilterInput = z.infer<typeof leadFilterSchema>;

