// API Response & Request types

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  message?: string;
  pagination?: PaginationMeta;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchQueryParams extends PaginationParams {
  q?: string;
  filters?: Record<string, any>;
}

// API Endpoints
export enum APIEndpoint {
  // Auth
  LOGIN = '/api/auth/login',
  REGISTER = '/api/auth/register',
  LOGOUT = '/api/auth/logout',
  REFRESH_TOKEN = '/api/auth/refresh',
  ME = '/api/auth/me',
  
  // Properties
  PROPERTIES = '/api/properties',
  PROPERTY_DETAIL = '/api/properties/[id]',
  PROPERTY_CREATE = '/api/properties',
  PROPERTY_UPDATE = '/api/properties/[id]',
  PROPERTY_DELETE = '/api/properties/[id]',
  PROPERTY_SEARCH = '/api/properties/search',
  
  // Leads
  LEADS = '/api/leads',
  LEAD_DETAIL = '/api/leads/[id]',
  LEAD_CREATE = '/api/leads',
  LEAD_UPDATE = '/api/leads/[id]',
  LEAD_ASSIGN = '/api/leads/[id]/assign',
  
  // CRM
  CRM_SYNC = '/api/crm/sync',
  CRM_WEBHOOK = '/api/crm/webhook',
  CRM_LEADS = '/api/crm/leads',
  
  // Users
  USERS = '/api/users',
  USER_DETAIL = '/api/users/[id]',
  USER_PROFILE = '/api/users/[id]/profile',
  
  // Dealers
  DEALERS = '/api/dealers',
  DEALER_PERFORMANCE = '/api/dealers/[id]/performance',
  DEALER_TERRITORIES = '/api/dealers/[id]/territories',
  
  // Search
  SEARCH = '/api/search',
  SEARCH_AUTOCOMPLETE = '/api/search/autocomplete',
  
  // Admin
  ADMIN_PROPERTIES = '/api/admin/properties',
  ADMIN_MODERATION = '/api/admin/moderation',
  ADMIN_ANALYTICS = '/api/admin/analytics',
}

// HTTP Status Codes
export enum HTTPStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  VALIDATION_ERROR = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

// Error Codes
export enum ErrorCode {
  // Authentication
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_FIELDS = 'MISSING_FIELDS',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Resource
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',
  
  // Permissions
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Server
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  // CRM
  CRM_SYNC_FAILED = 'CRM_SYNC_FAILED',
  CRM_NOT_CONFIGURED = 'CRM_NOT_CONFIGURED',
}





