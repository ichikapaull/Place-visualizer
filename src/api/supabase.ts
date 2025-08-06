import { createClient } from '@supabase/supabase-js';
import type { Place, TradeArea, CustomerZipcode, PlaceFilters } from '../types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Places API
export const placesApi = {
  async getPlaces(filters?: PlaceFilters): Promise<Place[]> {
    let query = supabase
      .from('places')
      .select('*');

    // Apply filters
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

  async getPlace(id: string): Promise<Place | null> {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to fetch place: ${error.message}`);
    }

    return data;
  },

  async getMyPlace(): Promise<Place | null> {
    // For demo purposes, return the first place
    // In a real app, this would be based on user authentication
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch my place: ${error.message}`);
    }

    return data;
  },

  async createPlace(place: Omit<Place, 'id' | 'created_at'>): Promise<Place> {
    const { data, error } = await supabase
      .from('places')
      .insert(place)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create place: ${error.message}`);
    }

    return data;
  },

  async updatePlace(id: string, updates: Partial<Omit<Place, 'id' | 'created_at'>>): Promise<Place> {
    const { data, error } = await supabase
      .from('places')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update place: ${error.message}`);
    }

    return data;
  },

  async deletePlace(id: string): Promise<void> {
    const { error } = await supabase
      .from('places')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete place: ${error.message}`);
    }
  },
};

// Trade Areas API
export const tradeAreasApi = {
  async getTradeAreas(placeId: string): Promise<TradeArea[]> {
    const { data, error } = await supabase
      .from('trade_areas')
      .select('*')
      .eq('place_id', placeId);

    if (error) {
      throw new Error(`Failed to fetch trade areas: ${error.message}`);
    }

    return data || [];
  },

  async getTradeArea(placeId: string, percentage: 30 | 50 | 70): Promise<TradeArea | null> {
    const { data, error } = await supabase
      .from('trade_areas')
      .select('*')
      .eq('place_id', placeId)
      .eq('percentage', percentage)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch trade area: ${error.message}`);
    }

    return data;
  },
};

// Customer Zipcodes API
export const customerZipcodesApi = {
  async getCustomerZipcodes(): Promise<CustomerZipcode[]> {
    const { data, error } = await supabase
      .from('customer_zipcodes')
      .select('*');

    if (error) {
      throw new Error(`Failed to fetch customer zipcodes: ${error.message}`);
    }

    return data || [];
  },

  async getTopCustomerZipcodes(limit: number = 10): Promise<CustomerZipcode[]> {
    const { data, error } = await supabase
      .from('customer_zipcodes')
      .select('*')
      .order('customer_count', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch top customer zipcodes: ${error.message}`);
    }

    return data || [];
  },
};
