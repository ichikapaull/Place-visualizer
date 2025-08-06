// Application constants

// Map configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [29.0174, 41.0053] as [number, number], // Istanbul
  DEFAULT_ZOOM: 10,
  MIN_ZOOM: 5,
  MAX_ZOOM: 18,
  DEFAULT_RADIUS: 1000, // meters
} as const;

// Brand colors (matching theme)
export const BRAND_COLORS = {
  DEEP_BLUE: '#0A2540',
  ACCENT_TEAL: '#00C49F',
  NEUTRAL_GRAY: '#425466',
  OFF_WHITE: '#F6F9FC',
} as const;

// Trade area percentages
export const TRADE_AREA_PERCENTAGES = [30, 50, 70] as const;

// Customer density quintiles
export const DENSITY_QUINTILES = [1, 2, 3, 4, 5] as const;

// API endpoints (will be configured later)
export const API_ENDPOINTS = {
  PLACES: '/api/places',
  TRADE_AREAS: '/api/trade-areas',
  CUSTOMER_DENSITY: '/api/customer-density',
} as const;

// Place categories
export const PLACE_CATEGORIES = [
  'Restaurant',
  'Cafe',
  'Retail',
  'Service',
  'Entertainment',
  'Health',
  'Education',
  'Other',
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];
