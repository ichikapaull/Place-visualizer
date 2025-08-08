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

    // Apply industry filter (supports single value or array)
    if (filters?.industry) {
      if (Array.isArray(filters.industry)) {
        if (filters.industry.length > 0) {
          query = query.in('sub_category', filters.industry);
        }
      } else {
        query = query.eq('sub_category', filters.industry);
      }
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

// Customer Zipcodes API (Global zipcode data - all places can access)
export const homeZipcodesApi = {
  async getHomeZipcodes(placeId: string): Promise<CustomerZipcode[]> {
    console.log('🏠 API: Fetching place-specific home zipcodes for placeId:', placeId);

    // Read home_zipcodes row for this place (pid)
    const { data: homeRows, error: homeErr } = await supabase
      .from('home_zipcodes')
      .select('pid, locations')
      .eq('pid', placeId)
      .limit(1);

    if (homeErr) {
      console.error('❌ API: Failed to fetch home_zipcodes:', homeErr);
      throw new Error(`Failed to fetch home_zipcodes: ${homeErr.message}`);
    }

    if (!homeRows || homeRows.length === 0) {
      console.log('ℹ️ API: No home_zipcodes row for place in Supabase:', placeId);
      return [];
    }

    const locations = homeRows[0].locations as unknown as Array<Record<string, string | number>>;
    if (!Array.isArray(locations) || locations.length === 0) {
      console.log('ℹ️ API: home_zipcodes.locations empty for place:', placeId);
      return [];
    }

    const zipcodeToValue = new Map<string, number>();
    for (const entry of locations) {
      const [zip, val] = Object.entries(entry)[0] || [];
      if (zip) {
        const numVal = Number(val);
        zipcodeToValue.set(zip, Number.isFinite(numVal) ? numVal : 0);
      }
    }
    const zipcodeCodes = Array.from(zipcodeToValue.keys());
    if (zipcodeCodes.length === 0) return [];

    const { data: polys, error: polyErr } = await supabase
      .from('customer_zipcodes')
      .select('id, zipcode, polygon')
      .in('zipcode', zipcodeCodes);

    if (polyErr) {
      console.error('❌ API: Failed to fetch zipcode polygons:', polyErr);
      throw new Error(`Failed to fetch zipcode polygons: ${polyErr.message}`);
    }

    const rows = (polys || []).filter(Boolean) as Array<{
      id: string;
      zipcode: string;
      polygon: GeoJSON.Geometry;
    }>;

    const values = rows.map((r) => zipcodeToValue.get(r.zipcode) ?? 0);
    const sorted = [...values].sort((a, b) => a - b);
    const qIndex = (p: number) => Math.max(0, Math.min(sorted.length - 1, Math.floor((p / 100) * (sorted.length - 1))));
    const thresholds = [sorted[qIndex(20)], sorted[qIndex(40)], sorted[qIndex(60)], sorted[qIndex(80)]];
    const toQuintile = (v: number) => {
      if (v <= thresholds[0]) return 1;
      if (v <= thresholds[1]) return 2;
      if (v <= thresholds[2]) return 3;
      if (v <= thresholds[3]) return 4;
      return 5;
    };

    const transformedData: CustomerZipcode[] = rows.map((r) => {
      const val = zipcodeToValue.get(r.zipcode) ?? 0;
      return {
        id: r.id,
        pid: placeId,
        zipcode: r.zipcode,
        customer_count: val,
        quintile: toQuintile(val),
        polygon: r.polygon,
      };
    });

    console.log('📊 API: Built place-specific zipcodes:', transformedData.length);
    return transformedData;
  },

  async checkHomeZipcodesAvailability(placeId: string): Promise<boolean> {
    console.log('🔍 API: Checking home_zipcodes availability for place:', placeId);
    
    const { data, error } = await supabase
      .from('home_zipcodes')
      .select('pid')
      .eq('pid', placeId)
      .limit(1);

    if (error) {
      console.error('❌ API: Failed to check customer zipcodes availability:', error);
      return false;
    }

    const hasData = data && data.length > 0;
    console.log('✅ API: Customer zipcodes availability (supabase):', hasData);
    return hasData;
  },
};
