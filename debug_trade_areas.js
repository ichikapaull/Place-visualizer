const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (line.includes('=')) {
    const [key, value] = line.split('=');
    envVars[key.trim()] = value.trim();
  }
});

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);

async function analyzeProblem() {
  try {
    // Check all places
    const { data: places } = await supabase.from('places').select('id, name, latitude, longitude');
    console.log('🏢 Available Places:');
    places.forEach(place => {
      console.log(`  ID: ${place.id} - Name: ${place.name} - Coords: ${place.longitude}, ${place.latitude}`);
    });
    
    console.log('\n🎯 Trade Areas:');
    const { data: tradeAreas } = await supabase.from('trade_areas').select('pid, trade_area');
    tradeAreas.forEach(ta => {
      console.log(`  Place ID: ${ta.pid} - Percentage: ${ta.trade_area}%`);
    });
    
    // Check for orphaned trade areas
    console.log('\n❌ Orphaned Trade Areas (no matching place):');
    const placeIds = new Set(places.map(p => p.id));
    const orphaned = tradeAreas.filter(ta => !placeIds.has(ta.pid));
    orphaned.forEach(ta => {
      console.log(`  ❌ Orphaned: ${ta.pid} - Percentage: ${ta.trade_area}%`);
    });
    
    // Check valid combinations
    console.log('\n✅ Valid Trade Areas:');
    const valid = tradeAreas.filter(ta => placeIds.has(ta.pid));
    valid.forEach(ta => {
      const place = places.find(p => p.id === ta.pid);
      console.log(`  ✅ Valid: ${place.name} - Percentage: ${ta.trade_area}%`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

analyzeProblem();