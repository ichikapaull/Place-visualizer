// Deno Edge Function: get-zipcodes-by-location
// POST { placeId: string, longitude: number, latitude: number }
// Returns: CustomerZipcode[]
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { placeId, longitude, latitude } = await req.json().catch(() => ({})) as {
    placeId?: string
    longitude?: number
    latitude?: number
  }

  if (!placeId || typeof longitude !== 'number' || typeof latitude !== 'number') {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

  // First try: direct relation via place_id if present
  const byPlace = await supabase
    .from('customer_zipcodes')
    .select('id, pid, zipcode, customer_count, quintile, polygon, created_at')
    .eq('place_id', placeId)
    .order('customer_count', { ascending: false })
    .limit(200)

  if (byPlace.error) {
    return new Response(JSON.stringify({ error: byPlace.error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (byPlace.data && byPlace.data.length > 0) {
    return new Response(JSON.stringify(byPlace.data), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Fallback: proximity by centroid within 100 km
  const { data, error } = await supabase.rpc('zipcodes_near_location', {
    p_lon: longitude,
    p_lat: latitude,
    p_km: 100,
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(data ?? []), {
    headers: { 'Content-Type': 'application/json' },
  })
})

