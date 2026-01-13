// Application constants

// Indian states covered
export const INDIAN_STATES = [
  'Punjab',
  'Haryana',
  'Himachal Pradesh',
  'Delhi',
  'Rajasthan',
  'Uttar Pradesh',
  'Uttarakhand',
  'Jammu and Kashmir',
] as const;

// Major cities in North India
export const MAJOR_CITIES = [
  // Punjab
  'Ludhiana',
  'Amritsar',
  'Jalandhar',
  'Patiala',
  'Bathinda',
  'Mohali',
  'Pathankot',
  
  // Haryana
  'Gurgaon',
  'Faridabad',
  'Panipat',
  'Ambala',
  'Karnal',
  'Hisar',
  'Rohtak',
  
  // Delhi NCR
  'New Delhi',
  'Noida',
  'Ghaziabad',
  'Faridabad',
  'Gurgaon',
  
  // Himachal Pradesh
  'Shimla',
  'Solan',
  'Dharamshala',
  'Mandi',
  
  // Rajasthan
  'Jaipur',
  'Jodhpur',
  'Udaipur',
  'Kota',
  'Ajmer',
  
  // Uttar Pradesh
  'Noida',
  'Ghaziabad',
  'Lucknow',
  'Kanpur',
  'Agra',
  'Meerut',
  
  // Uttarakhand
  'Dehradun',
  'Haridwar',
  'Rishikesh',
  'Nainital',
] as const;

// Property types
export const PROPERTY_TYPES = {
  RESIDENTIAL: [
    'APARTMENT',
    'VILLA',
    'PENTHOUSE',
    'STUDIO',
    'FARMHOUSE',
  ],
  COMMERCIAL: [
    'SHOP',
    'OFFICE',
    'WAREHOUSE',
    'SHOWROOM',
  ],
  PLOTS: [
    'PLOT',
    'FARMLAND',
  ],
} as const;

// Price ranges (in Lakhs)
export const PRICE_RANGES = [
  { label: 'Under ₹20 L', min: 0, max: 2000000 },
  { label: '₹20 L - ₹40 L', min: 2000000, max: 4000000 },
  { label: '₹40 L - ₹60 L', min: 4000000, max: 6000000 },
  { label: '₹60 L - ₹80 L', min: 6000000, max: 8000000 },
  { label: '₹80 L - ₹1 Cr', min: 8000000, max: 10000000 },
  { label: '₹1 Cr - ₹2 Cr', min: 10000000, max: 20000000 },
  { label: '₹2 Cr - ₹5 Cr', min: 20000000, max: 50000000 },
  { label: 'Above ₹5 Cr', min: 50000000, max: Infinity },
] as const;

// Bedroom options
export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, '6+'] as const;

// Furnishing status
export const FURNISHING_STATUS = [
  'UNFURNISHED',
  'SEMI_FURNISHED',
  'FULLY_FURNISHED',
] as const;

// Possession status
export const POSSESSION_STATUS = [
  'READY_TO_MOVE',
  'UNDER_CONSTRUCTION',
  'RESALE',
] as const;

// Common amenities
export const COMMON_AMENITIES = [
  'Gym',
  'Swimming Pool',
  'Park',
  'Security',
  'Elevator',
  'Power Backup',
  'Water Supply',
  'Parking',
  'Clubhouse',
  'Playground',
  'Shopping Center',
  'Hospital',
  'School',
  'Metro Connectivity',
] as const;

// Lead sources
export const LEAD_SOURCES = [
  'PROPERTY_INQUIRY',
  'CONTACT_FORM',
  'PHONE_CALL',
  'WALK_IN',
  'REFERRAL',
  'SOCIAL_MEDIA',
  'ADVERTISEMENT',
] as const;

// Lead priorities
export const LEAD_PRIORITIES = [
  'low',
  'medium',
  'high',
  'urgent',
] as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
  },
  PROPERTIES: {
    SEARCH: '/api/properties/search',
    DETAIL: '/api/properties',
    CREATE: '/api/properties',
    UPDATE: '/api/properties',
    DELETE: '/api/properties',
  },
  LEADS: {
    LIST: '/api/leads',
    DETAIL: '/api/leads',
    CREATE: '/api/leads',
    UPDATE: '/api/leads',
    ASSIGN: '/api/leads',
  },
} as const;

// Cache keys
export const CACHE_KEYS = {
  PROPERTY: (id: string) => `property:${id}`,
  PROPERTY_SEARCH: (query: string) => `property:search:${query}`,
  USER: (id: string) => `user:${id}`,
  LEAD: (id: string) => `lead:${id}`,
} as const;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// File upload limits
export const FILE_LIMITS = {
  IMAGE_MAX_SIZE_MB: 10,
  VIDEO_MAX_SIZE_MB: 50,
  DOCUMENT_MAX_SIZE_MB: 25,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD MMM YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD MMM YYYY, HH:mm',
} as const;





