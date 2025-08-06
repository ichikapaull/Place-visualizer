// Common types for the Place & Trade application

export interface Place {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  rating?: number;
  address?: string;
  customerCount?: number;
  isMyPlace?: boolean;
}

export interface TradeArea {
  placeId: string;
  geometry: GeoJSON.Polygon;
  percentage: 30 | 50 | 70; // As per requirements
  color: string;
}

export interface CustomerDensity {
  zipCode: string;
  geometry: GeoJSON.Polygon;
  customerCount: number;
  quintile: 1 | 2 | 3 | 4 | 5;
  color: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface FilterOptions {
  category?: string;
  minRating?: number;
  radius?: number; // in meters
  bounds?: MapBounds;
}

export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}
