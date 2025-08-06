import { createClient } from '@supabase/supabase-js';
import type { Geometry } from 'geojson';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types will be generated later with Supabase CLI
export type Database = {
  public: {
    Tables: {
      places: {
        Row: {
          id: string;
          name: string;
          category: string;
          latitude: number;
          longitude: number;
          rating?: number;
          address?: string;
          customer_count?: number;
          is_my_place?: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          latitude: number;
          longitude: number;
          rating?: number;
          address?: string;
          customer_count?: number;
          is_my_place?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          latitude?: number;
          longitude?: number;
          rating?: number;
          address?: string;
          customer_count?: number;
          is_my_place?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      trade_areas: {
        Row: {
          id: string;
          place_id: string;
          geometry: Geometry; // GeoJSON
          percentage: 30 | 50 | 70;
          created_at: string;
        };
        Insert: {
          id?: string;
          place_id: string;
          geometry: Geometry; // GeoJSON
          percentage: 30 | 50 | 70;
          created_at?: string;
        };
        Update: {
          id?: string;
          place_id?: string;
          geometry?: Geometry; // GeoJSON
          percentage?: 30 | 50 | 70;
          created_at?: string;
        };
      };
      customer_zipcodes: {
        Row: {
          id: string;
          zipcode: string;
          geometry: Geometry; // GeoJSON
          customer_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          zipcode: string;
          geometry: Geometry; // GeoJSON
          customer_count: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          zipcode?: string;
          geometry?: Geometry; // GeoJSON
          customer_count?: number;
          created_at?: string;
        };
      };
    };
  };
};

export default supabase;
