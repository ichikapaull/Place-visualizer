// Supabase Database Inspector
import { supabase } from '../api/supabase';

export const inspectDatabase = async () => {
  console.log('🔍 Inspecting Supabase database...');
  
  try {
    // Check places table
    const { data: places, error: placesError } = await supabase
      .from('places')
      .select('*')
      .limit(5);
      
    if (placesError) {
      console.error('❌ Places table error:', placesError);
    } else {
      console.log('✅ Places table:', {
        count: places?.length,
        sample: places?.[0],
        columns: places?.[0] ? Object.keys(places[0]) : []
      });
    }
    
    // Check trade_areas table
    const { data: tradeAreas, error: tradeAreasError } = await supabase
      .from('trade_areas')
      .select('*')
      .limit(5);
      
    if (tradeAreasError) {
      console.error('❌ Trade areas table error:', tradeAreasError);
    } else {
      console.log('✅ Trade areas table:', {
        count: tradeAreas?.length,
        sample: tradeAreas?.[0],
        columns: tradeAreas?.[0] ? Object.keys(tradeAreas[0]) : []
      });
    }
    
    // Check customer_zipcodes table
    const { data: customerZipcodes, error: customerZipcodesError } = await supabase
      .from('customer_zipcodes')
      .select('*')
      .limit(5);
      
    if (customerZipcodesError) {
      console.error('❌ Customer zipcodes table error:', customerZipcodesError);
    } else {
      console.log('✅ Customer zipcodes table:', {
        count: customerZipcodes?.length,
        sample: customerZipcodes?.[0],
        columns: customerZipcodes?.[0] ? Object.keys(customerZipcodes[0]) : []
      });
    }
    
    // Check competitors table (if exists)
    const { data: competitors, error: competitorsError } = await supabase
      .from('competitors')
      .select('*')
      .limit(5);
      
    if (competitorsError) {
      console.error('❌ Competitors table error:', competitorsError);
    } else {
      console.log('✅ Competitors table:', {
        count: competitors?.length,
        sample: competitors?.[0],
        columns: competitors?.[0] ? Object.keys(competitors[0]) : []
      });
    }
    
    // Get table schema info
    const { data: schema, error: schemaError } = await supabase
      .rpc('get_table_info'); // This might not exist
      
    if (!schemaError && schema) {
      console.log('📋 Database schema:', schema);
    }
    
  } catch (error) {
    console.error('💥 Database inspection failed:', error);
  }
};

// Auto-run inspection
if (typeof window !== 'undefined') {
  inspectDatabase();
}
