-- RPC: zipcodes_near_location
-- Usage: select * from zipcodes_near_location(p_lon := -73.9, p_lat := 40.7, p_km := 100);

create or replace function zipcodes_near_location(p_lon double precision, p_lat double precision, p_km double precision default 100)
returns setof customer_zipcodes
language sql
stable
as $$
  select cz.*
  from customer_zipcodes cz
  where ST_DWithin(
    ST_Centroid(cz.polygon)::geography,
    ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography,
    p_km * 1000
  )
  order by cz.customer_count desc
  limit 200;
$$;

