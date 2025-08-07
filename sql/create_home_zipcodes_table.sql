-- Home Zipcodes table for customer residence density analysis
-- This table stores zipcode polygons with customer counts for each place

CREATE TABLE IF NOT EXISTS public.home_zipcodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
    zipcode TEXT NOT NULL,
    customer_count INTEGER NOT NULL CHECK (customer_count >= 0),
    polygon GEOMETRY(Polygon, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_home_zipcodes_place_id ON public.home_zipcodes(place_id);
CREATE INDEX IF NOT EXISTS idx_home_zipcodes_zipcode ON public.home_zipcodes(zipcode);
CREATE INDEX IF NOT EXISTS idx_home_zipcodes_geom ON public.home_zipcodes USING GIST(polygon);

-- Enable Row Level Security
ALTER TABLE public.home_zipcodes ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (matching other tables)
CREATE POLICY "Allow public read access" ON public.home_zipcodes
    FOR SELECT USING (true);

-- Comments for documentation
COMMENT ON TABLE public.home_zipcodes IS 'Customer residence density by zipcode for each place';
COMMENT ON COLUMN public.home_zipcodes.place_id IS 'Reference to the place/business';
COMMENT ON COLUMN public.home_zipcodes.zipcode IS 'ZIP/postal code identifier';
COMMENT ON COLUMN public.home_zipcodes.customer_count IS 'Number of customers residing in this zipcode';
COMMENT ON COLUMN public.home_zipcodes.polygon IS 'GeoJSON polygon boundary of the zipcode area (WGS84)';