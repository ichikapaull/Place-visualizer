// Sample data generator for testing place visualization
import type { Place } from '../types';

// Colorado area coordinates for realistic data
const COLORADO_BOUNDS = {
  minLat: 37.0,    // Southern Colorado
  maxLat: 41.0,    // Northern Colorado  
  minLng: -109.0,  // Western Colorado
  maxLng: -102.0   // Eastern Colorado
};

const CATEGORIES = [
  'Restaurant',
  'Coffee Shop',
  'Retail',
  'Hotel',
  'Gas Station',
  'Pharmacy',
  'Bank',
  'Grocery Store',
  'Fast Food',
  'Shopping Mall'
];

const PLACE_NAMES = [
  'Downtown Market',
  'Rocky Mountain Cafe',
  'Mile High Restaurant',
  'Boulder District Store',
  'Colorado Springs Shop',
  'Denver Express',
  'Aspen View Hotel',
  'Vail Mountain Deli',
  'Fort Collins Bakery',
  'Colorado Peaks Boutique',
  'Front Range Gallery',
  'Denver Tech Pizzeria',
  'Golden Market',
  'Aurora Hub',
  'Lakewood Cafe',
  'Westminster Park Store',
  'Thornton District Restaurant',
  'Arvada Mountain Bistro',
  'Pueblo Valley Lounge',
  'Colorado Springs Bank'
];

export function generateSamplePlaces(count: number = 100): Place[] {
  const places: Place[] = [];
  
  for (let i = 0; i < count; i++) {
    const lat = COLORADO_BOUNDS.minLat + Math.random() * (COLORADO_BOUNDS.maxLat - COLORADO_BOUNDS.minLat);
    const lng = COLORADO_BOUNDS.minLng + Math.random() * (COLORADO_BOUNDS.maxLng - COLORADO_BOUNDS.minLng);
    
    places.push({
      id: `place_${i + 1}`,
      name: PLACE_NAMES[Math.floor(Math.random() * PLACE_NAMES.length)] + ` #${i + 1}`,
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      latitude: lat,
      longitude: lng,
      address: `${Math.floor(Math.random() * 9999) + 1} Sample St, Colorado, CO`,
      rating: Math.round((3 + Math.random() * 2) * 10) / 10, // Rating between 3.0 and 5.0
      total_rating: Math.floor(Math.random() * 500) + 10,
      description: `A wonderful place in Colorado offering great service and experience.`,
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  return places;
}

// Generate a specific "My Place" that will be highlighted
export function getMyPlaceSample(): Place {
  return {
    id: 'my_place_123',
    name: 'My Amazing Restaurant',
    category: 'Restaurant',
    latitude: 39.7392, // Denver, Colorado
    longitude: -104.9903,
    address: '123 Main St, Denver, CO 80202',
    rating: 4.8,
    total_rating: 1250,
    description: 'This is my special place in Denver that should be highlighted on the map.',
    created_at: new Date().toISOString()
  };
}
