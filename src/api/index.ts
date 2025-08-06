// Re-export everything from supabase API
export * from './supabase';

// Main API object that aggregates all API modules
import { placesApi } from './supabase';
import { tradeAreasApi } from './supabase';
import { customerZipcodesApi } from './supabase';

export const api = {
  places: placesApi,
  tradeAreas: tradeAreasApi,
  customerZipcodes: customerZipcodesApi,
};
