// Re-export everything from supabase API
export * from './supabase';

// Main API object that aggregates all API modules
import { placesApi } from './supabase';
import { tradeAreasApi } from './supabase';
import { homeZipcodesApi } from './supabase';

export const api = {
  places: placesApi,
  tradeAreas: tradeAreasApi,
  homeZipcodes: homeZipcodesApi,
};
