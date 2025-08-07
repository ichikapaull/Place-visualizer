// Quick Supabase data test
import { supabase } from '../api/supabase.ts';

console.log('🔍 Testing Supabase connection...');

// Test my_place
supabase
  .from('my_place')
  .select('*')
  .then(({ data, error }) => {
    console.log('MY_PLACE TABLE:', { data, error });
  });

// Test competitors
supabase
  .from('competitors')
  .select('*')
  .limit(5)
  .then(({ data, error }) => {
    console.log('COMPETITORS TABLE:', { data, error });
  });

// Test home_zipcodes
supabase
  .from('home_zipcodes')
  .select('*')
  .limit(5)
  .then(({ data, error }) => {
    console.log('HOME_ZIPCODES TABLE:', { data, error });
  });

// Test trade_areas
supabase
  .from('trade_areas')
  .select('id, place_id, percentage, customer_count, revenue')
  .limit(3)
  .then(({ data, error }) => {
    console.log('TRADE_AREAS TABLE:', { data, error });
  });
