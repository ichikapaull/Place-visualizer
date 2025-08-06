import { supabase } from './supabase';
import type { Database } from './supabase';

type Place = Database['public']['Tables']['places']['Row'];
type TradeArea = Database['public']['Tables']['trade_areas']['Row'];
type CustomerZipcode = Database['public']['Tables']['customer_zipcodes']['Row'];

// Places API
export const placesApi = {
  // Get all places with optional filtering
  async getPlaces(filters?: {
    category?: string;
    bounds?: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
    minRating?: number;
  }): Promise<Place[]> {
    let query = supabase.from('places').select('*');

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.minRating) {
      query = query.gte('rating', filters.minRating);
    }

    if (filters?.bounds) {
      const { north, south, east, west } = filters.bounds;
      query = query
        .gte('latitude', south)
        .lte('latitude', north)
        .gte('longitude', west)
        .lte('longitude', east);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch places: ${error.message}`);
    }

    return data || [];
  },

  // Get a single place by ID
  async getPlace(id: string): Promise<Place | null> {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      throw new Error(`Failed to fetch place: ${error.message}`);
    }

    return data;
  },

  // Get "My Place" (the user's place)
  async getMyPlace(): Promise<Place | null> {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('is_my_place', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      throw new Error(`Failed to fetch my place: ${error.message}`);
    }

    return data;
  },
};

// Trade Areas API
export const tradeAreasApi = {
  // Get trade areas for a specific place
  async getTradeAreas(placeId: string): Promise<TradeArea[]> {
    const { data, error } = await supabase
      .from('trade_areas')
      .select('*')
      .eq('place_id', placeId)
      .order('percentage', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch trade areas: ${error.message}`);
    }

    return data || [];
  },

  // Get trade area by place ID and percentage
  async getTradeArea(
    placeId: string,
    percentage: 30 | 50 | 70
  ): Promise<TradeArea | null> {
    const { data, error } = await supabase
      .from('trade_areas')
      .select('*')
      .eq('place_id', placeId)
      .eq('percentage', percentage)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      throw new Error(`Failed to fetch trade area: ${error.message}`);
    }

    return data;
  },
};

// Customer Zipcodes API
export const customerZipcodesApi = {
  // Get all customer zipcodes
  async getCustomerZipcodes(): Promise<CustomerZipcode[]> {
    const { data, error } = await supabase
      .from('customer_zipcodes')
      .select('*')
      .order('customer_count', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch customer zipcodes: ${error.message}`);
    }

    return data || [];
  },

  // Get customer zipcodes within bounds
  async getCustomerZipcodesByBounds(_bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): Promise<CustomerZipcode[]> {
    // Note: This would need PostGIS functions for proper geometric bounds checking
    // For now, we'll fetch all and filter client-side if needed
    const { data, error } = await supabase
      .from('customer_zipcodes')
      .select('*')
      .order('customer_count', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch customer zipcodes: ${error.message}`);
    }

    return data || [];
  },

  // Get top customer zipcodes by count
  async getTopCustomerZipcodes(limit: number = 10): Promise<CustomerZipcode[]> {
    const { data, error } = await supabase
      .from('customer_zipcodes')
      .select('*')
      .order('customer_count', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(
        `Failed to fetch top customer zipcodes: ${error.message}`
      );
    }

    return data || [];
  },
};

// Combined API exports
export const api = {
  places: placesApi,
  tradeAreas: tradeAreasApi,
  customerZipcodes: customerZipcodesApi,
};

export default api;
