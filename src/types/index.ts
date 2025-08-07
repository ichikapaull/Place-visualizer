// API Data Types
export interface Place {
  id: string;
  name: string;
  category: string;
  latitude: string | number;
  longitude: string | number;
  address?: string;
  rating?: string | number;
  total_rating?: string | number;
  description?: string;
  created_at?: string;
}

export interface TradeArea {
  id: string;
  place_id: string;
  percentage: 30 | 50 | 70;
  geometry: GeoJSON.Geometry;
  customer_count?: string | number;
  revenue?: string | number;
  created_at?: string;
}

export interface CustomerZipcode {
  id: string;
  zipcode: string;
  geometry: GeoJSON.Geometry;
  customer_count: string | number;
  total_spend: string | number;
  average_spend: string | number;
  longitude?: string | number;
  latitude?: string | number;
  created_at?: string;
}

// Filter types
export interface PlaceFilters {
  category?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  minRating?: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Map types
export interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

export interface MapLayer {
  id: string;
  type: string;
  data: any[];
  properties?: Record<string, any>;
}
