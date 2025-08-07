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

  async getCompetitors(filters?: PlaceFilters): Promise<Place[]> {
    let query = supabase
      .from('competitors')
      .select('*');

    // Apply industry filter
    if (filters?.industry) {
      query = query.eq('sub_category', filters.industry);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch competitors: ${error.message}`);
    }

    // Transform competitors data to Place format
    const competitors: Place[] = data?.map((item: Record<string, unknown>) => ({
      id: String(item.pid),
      name: String(item.name),
      category: 'Competitor',
      latitude: Number(item.latitude),
      longitude: Number(item.longitude),
      address: String(item.street_address), // Using street_address from competitors table
      sub_category: String(item.sub_category),
      rating: 4.0,
      total_rating: 100
    })) || [];

    return competitors;
  },

  async getIndustries(): Promise<string[]> {
    const { data, error } = await supabase
      .from('competitors')
      .select('sub_category')
      .not('sub_category', 'is', null);

    if (error) {
      throw new Error(`Failed to fetch industries: ${error.message}`);
    }

    // Get unique industries
    const industries = [...new Set(data?.map((item: Record<string, unknown>) => item.sub_category).filter(Boolean))] as string[];
    return industries.sort();
  },

  async getMyPlace(): Promise<Place | null> {
    const { data, error } = await supabase
      .from('my_place')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch my place: ${error.message}`);
    }

    // Transform my_place data to Place format
    return {
      id: data.id,
      name: data.name || 'My Place',
      category: 'My Place',
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      address: data.street_address || data.address, // Try street_address first, fallback to address
      sub_category: data.sub_category,
      rating: 5.0,
      total_rating: 200
    };
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
    console.log('🔍 API: Fetching trade areas for placeId:', placeId);
    
    const { data, error } = await supabase
      .from('trade_areas')
      .select('id, pid, trade_area, polygon, created_at')
      .eq('pid', placeId)
      .order('trade_area', { ascending: true });

    if (error) {
      console.error('❌ API: Failed to fetch trade areas:', error);
      throw new Error(`Failed to fetch trade areas: ${error.message}`);
    }

    console.log('✅ API: Raw trade areas data:', data);

    // Transform the data to match our interface
    const transformedData = (data || []).map((item: {
      id: string;
      pid: string;
      trade_area: number;
      polygon: GeoJSON.Geometry;
      created_at: string;
    }) => ({
      id: item.id,
      place_id: item.pid,
      percentage: item.trade_area as 30 | 50 | 70,
      geometry: item.polygon,
      customer_count: 0, // Default since not in DB
      revenue: 0, // Default since not in DB
      created_at: item.created_at
    }));

    console.log('📊 API: Transformed trade areas:', transformedData);
    return transformedData;
  },

  async getTradeArea(placeId: string, percentage: 30 | 50 | 70): Promise<TradeArea | null> {
    console.log(`🔍 API: Fetching ${percentage}% trade area for placeId:`, placeId);
    
    const { data, error } = await supabase
      .from('trade_areas')
      .select('id, pid, trade_area, polygon, created_at')
      .eq('pid', placeId)
      .eq('trade_area', percentage)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`ℹ️ API: No ${percentage}% trade area found for place ${placeId}`);
        return null;
      }
      throw new Error(`Failed to fetch trade area: ${error.message}`);
    }

    if (!data) return null;

    console.log(`✅ API: Found ${percentage}% trade area for place ${placeId}`);

    // Transform the data to match our interface
    return {
      id: data.id,
      place_id: data.pid,
      percentage: data.trade_area as 30 | 50 | 70,
      geometry: data.polygon,
      customer_count: 0,
      revenue: 0,
      created_at: data.created_at
    };
  },
};

// Home Zipcodes API (Customer residence density)
export const homeZipcodesApi = {
  async getHomeZipcodes(placeId: string): Promise<CustomerZipcode[]> {
    console.log('🏠 API: Fetching home zipcodes for placeId:', placeId);
    
    const { data, error } = await supabase
      .from('home_zipcodes')
      .select('id, place_id, zipcode, customer_count, locations, created_at')
      .eq('place_id', placeId)
      .order('customer_count', { ascending: false });

    if (error) {
      console.error('❌ API: Failed to fetch home zipcodes:', error);
      throw new Error(`Failed to fetch home zipcodes: ${error.message}`);
    }

    console.log('✅ API: Raw home zipcodes data:', data);

    // Transform the data to match our interface
    const transformedData = (data || []).map((item: {
      id: string;
      place_id: string;
      zipcode: string;
      customer_count: number;
      locations: unknown; // JSONB can be string or object
      created_at: string;
    }) => {
      // Handle JSONB locations field
      let locations: GeoJSON.Geometry;
      
      if (typeof item.locations === 'string') {
        try {
          locations = JSON.parse(item.locations);
        } catch (e) {
          console.warn(`⚠️ Failed to parse locations for zipcode ${item.zipcode}:`, e);
          // Fallback to empty polygon
          locations = { type: 'Polygon', coordinates: [] };
        }
      } else if (typeof item.locations === 'object' && item.locations !== null) {
        locations = item.locations as GeoJSON.Geometry;
      } else {
        console.warn(`⚠️ Invalid locations data for zipcode ${item.zipcode}:`, item.locations);
        locations = { type: 'Polygon', coordinates: [] };
      }

      return {
        id: item.id,
        place_id: item.place_id,
        zipcode: item.zipcode,
        customer_count: item.customer_count,
        locations: locations,
        created_at: item.created_at
      };
    });

    console.log('📊 API: Transformed home zipcodes:', transformedData);
    return transformedData;
  },

  async checkHomeZipcodesAvailability(placeId: string): Promise<boolean> {
    console.log('🔍 API: Checking home zipcodes availability for placeId:', placeId);
    
    const { data, error } = await supabase
      .from('home_zipcodes')
      .select('id')
      .eq('place_id', placeId)
      .limit(1);

    if (error) {
      console.error('❌ API: Failed to check home zipcodes availability:', error);
      return false;
    }

    const hasData = data && data.length > 0;
    console.log('✅ API: Home zipcodes availability for', placeId, ':', hasData);
    return hasData;
  },
};
