-- Create my_place table
CREATE TABLE IF NOT EXISTS public.my_place (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    street_address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(10),
    logo TEXT,
    longitude DECIMAL(10, 7),
    latitude DECIMAL(10, 7),
    industry VARCHAR(255),
    "isTradeAreaAvailable" BOOLEAN,
    "isHomeZipcodesAvailable" BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create competitors table  
CREATE TABLE IF NOT EXISTS public.competitors (
    pid UUID PRIMARY KEY,
    name VARCHAR(255),
    street_address VARCHAR(255),
    city VARCHAR(100),
    region VARCHAR(10),
    logo TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    sub_category VARCHAR(255),
    trade_area_activity BOOLEAN,
    home_locations_activity BOOLEAN,
    distance DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security and create policies
ALTER TABLE public.my_place ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;

-- Create policies to allow read access
CREATE POLICY "Allow public read access" ON public.my_place
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON public.competitors
    FOR SELECT USING (true);

-- Insert my_place data
INSERT INTO public.my_place (
    id, name, street_address, city, state, logo, longitude, latitude, 
    industry, "isTradeAreaAvailable", "isHomeZipcodesAvailable"
) VALUES (
    'c660833d-77f0-4bfa-b8f9-4ac38f43ef6a',
    'Starbucks',
    '7055 Austin Bluffs Pkwy',
    'Colorado Springs',
    'CO',
    NULL,
    -104.73874,
    38.932625,
    'Snack and Nonalcoholic Beverage Bars',
    true,
    true
) ON CONFLICT (id) DO NOTHING;-- Insert competitors data (first 50 records)

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'f29129fd-e459-4681-8289-f921a7289bef',
    'Thrivent',
    '7222 Commerce Center Dr',
    'Colorado Springs',
    'CO',
    NULL,
    38.936413,
    -104.81592,
    'Investment Advice',
    false,
    true,
    4.16724236765693
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '56bd74f8-d352-43be-83be-cfe2574b552b',
    'Dressbarn',
    '1770 E Woodmen Rd',
    'Colorado Springs',
    'CO',
    NULL,
    38.934093,
    -104.79423,
    'Women''s Clothing Stores',
    false,
    true,
    2.99194783690491
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'b03105d7-df87-49e3-8be2-c5ece9a2dde4',
    'T-mobile Store',
    '1850 E Woodmen Rd',
    'Colorado Springs',
    'CO',
    NULL,
    38.93374,
    -104.79114,
    'Wireless Telecommunications Carriers (except Satellite)',
    true,
    true,
    2.8247718516345555
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'c963cfa7-7d86-4ae2-9599-84ffed515369',
    'Express Employment Professionals',
    '1234 E Woodmen Rd Unit 110',
    'Colorado Springs',
    'CO',
    NULL,
    38.933514,
    -104.803024,
    'Employment Placement Agencies',
    true,
    true,
    3.464834270503418
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '6ac9c003-65ff-482a-9d31-1049e270218c',
    'Mattress Firm',
    '7130 N Academy Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.935406,
    -104.79805,
    'Furniture Stores',
    false,
    true,
    3.201937760658794
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'a822c6a0-12ca-490d-b253-a3f39eeb4af9',
    'The Tile Shop',
    '1730 E Woodmen Rd',
    'Colorado Springs',
    'CO',
    NULL,
    38.933872,
    -104.79564,
    'Flooring Contractors',
    true,
    true,
    3.0675049441392166
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '43997d00-46fe-48d8-9810-9487eea6e421',
    'Einstein Brothers',
    '1706 E Woodmen Rd',
    'Colorado Springs',
    'CO',
    NULL,
    38.932972,
    -104.79377,
    'Limited-Service Restaurants',
    true,
    true,
    2.9656829879676816
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '5caff324-d67e-47e5-9b32-ef830d77a171',
    'Sport Clips',
    '9673 Prominent Pt',
    'Colorado Springs',
    'CO',
    NULL,
    38.9713,
    -104.74218,
    'Barber Shops',
    true,
    true,
    2.6747415832380357
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'd74510e3-e2b7-4f8e-a69f-56c519db3d5f',
    'Homewood Suites by Hilton',
    '9130 Explorer Dr',
    'Colorado Springs',
    'CO',
    NULL,
    38.965557,
    -104.79296,
    'Hotels (except Casino Hotels) and Motels',
    true,
    true,
    3.700955740136731
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'bda695f4-d372-400a-b292-8630e39fbd38',
    'Walgreens',
    '4470 Royal Pine Dr',
    'Colorado Springs',
    'CO',
    NULL,
    38.96752,
    -104.74571,
    'Pharmacies and Drug Stores',
    true,
    true,
    2.4368770782162836
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '36be11cc-dc29-4fdc-8aa4-f3d6f75c0410',
    'Painting with a Twist',
    '9475 Briar Village Pt Ste 105',
    'Colorado Springs',
    'CO',
    NULL,
    38.968113,
    -104.78296,
    'Fine Arts Schools',
    true,
    true,
    3.416313616451212
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '5a7c5e92-7c7f-44db-b42e-01ceae954f0b',
    'Safeway Fuel Station',
    '1101 N Circle Dr',
    'Colorado Springs',
    'CO',
    NULL,
    38.8475,
    -104.7753,
    'Gasoline Stations with Convenience Stores',
    true,
    true,
    6.195246334853946
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '4d4ffbf1-a6d5-4cf6-8958-73f3094546cc',
    'PetSmart',
    '571 N Academy Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.84164,
    -104.75534,
    'Pet and Pet Supplies Stores',
    true,
    true,
    6.340998010870106
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '87801582-3631-4c40-869b-4a66fbe7e9b5',
    'OneMain Financial',
    '1736 W Uintah St',
    'Colorado Springs',
    'CO',
    NULL,
    38.848385,
    -104.8473,
    'Investment Advice',
    true,
    true,
    8.24902338755749
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '4c6e1a82-d17c-45cf-9272-1dd284b97c5a',
    'State Farm',
    '3608 Galley Rd Ste 200',
    'Colorado Springs',
    'CO',
    NULL,
    38.847317,
    -104.76112,
    'Insurance Agencies and Brokerages',
    true,
    true,
    6.008342031783716
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '0b007062-77ac-4425-b0e0-702c6c0c12d3',
    'Five Below',
    '859 N Academy Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.84561,
    -104.75545,
    'All Other General Merchandise Stores',
    true,
    true,
    6.07072904627719
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '4ea64e4d-2bb7-451a-907e-6e262142b513',
    'Safeway',
    '1121 N Circle Dr',
    'Colorado Springs',
    'CO',
    NULL,
    38.84837,
    -104.77226,
    'Supermarkets and Other Grocery (except Convenience) Stores',
    true,
    true,
    6.087774542162834
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'e3826935-ba30-4a44-8ddc-1c9c79a5b576',
    'Scooter’s Coffee and Yogurt',
    '1049 Space Center Dr',
    'Colorado Springs',
    'CO',
    NULL,
    38.846718,
    -104.72142,
    'Limited-Service Restaurants',
    true,
    true,
    6.0002917355376
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '396c5549-5bc4-4214-bfcd-5c72b81556a9',
    'Subway',
    '1019 Space Center Dr',
    'Colorado Springs',
    'CO',
    NULL,
    38.84665,
    -104.72249,
    'Limited-Service Restaurants',
    true,
    true,
    5.996284630435053
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '65a1af64-229b-4a1f-b321-d6e6dae807b9',
    'Graybar Colorado Springs',
    '4635 Galley Rd',
    'Colorado Springs',
    'CO',
    NULL,
    38.846687,
    -104.74128,
    'Other Electronic Parts and Equipment Merchant Wholesalers',
    true,
    true,
    5.9308627131137355
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '6b706b3b-407a-4542-ab25-64bf311b945f',
    'Crash Champions',
    '2025 Sheldon Ave',
    'Colorado Springs',
    'CO',
    NULL,
    38.841515,
    -104.85801,
    'General Automotive Repair',
    true,
    true,
    8.993372382834059
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'c9562765-2f3f-44a8-b15e-24577d78d980',
    'Taco Bell',
    '1750 N Powers Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.857693,
    -104.72081,
    'Limited-Service Restaurants',
    true,
    true,
    5.259566866830329
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'a645f0a1-ddb9-4a23-a9b2-c24a82531dd6',
    'The Men''s Wearhouse',
    '3130 New Center Pt',
    'Colorado Springs',
    'CO',
    NULL,
    38.87787,
    -104.718666,
    'Men''s Clothing Stores',
    true,
    true,
    3.929853900161591
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'da78b0f8-8765-42a9-8c86-66f4dfafe950',
    'Residence Inn by Marriott',
    '6020 S Carefree Cir',
    'Colorado Springs',
    'CO',
    NULL,
    38.87824,
    -104.715485,
    'Hotels (except Casino Hotels) and Motels',
    true,
    true,
    3.9562753933809818
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '79b9bcfe-d4a6-48a9-a8a7-cc9618c91fd2',
    'Rock Bottom Restaurant & Brewery',
    '3316 Cinema Pt',
    'Colorado Springs',
    'CO',
    NULL,
    38.88117,
    -104.71818,
    'Full-Service Restaurants',
    true,
    true,
    3.719273204201367
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '50574829-7e26-4422-b283-44cc569ecc65',
    'CPR Cell Phone Repair',
    '3440 N Academy Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.88101,
    -104.757645,
    'Computer and Office Machine Repair and Maintenance',
    true,
    true,
    3.7042834945680547
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '30cf8e23-3e31-48bb-948f-00f54b70de7f',
    'Ferrellgas',
    '8070 Industry Rd',
    'Colorado Springs',
    'CO',
    NULL,
    38.881584,
    -104.67952,
    'Fuel Dealers',
    false,
    true,
    4.7532359487134865
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '4eb70769-8374-4fd5-bf26-156976abe608',
    'Progressive',
    '3574 N Academy Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.883415,
    -104.75742,
    'Insurance Agencies and Brokerages',
    true,
    true,
    3.541495600913611
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'a0e61661-b2a3-4ac4-90e0-582186b0f5d7',
    'AT&T',
    '3244 Centennial Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.87674,
    -104.8473,
    'Wireless Telecommunications Carriers (except Satellite)',
    true,
    true,
    7.008496409042884
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '2b786926-1174-4236-96d0-21680da6de31',
    'Chase',
    '3306 Centennial Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.8788,
    -104.848145,
    'Commercial Banking',
    true,
    true,
    6.969839864605345
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '9ca604a2-b1e2-4e5e-8bad-fb76b8803e22',
    'Cheba Hut',
    '3171 N Chestnut St',
    'Colorado Springs',
    'CO',
    NULL,
    38.877804,
    -104.836235,
    'Full-Service Restaurants',
    true,
    true,
    6.475540530565569
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '93909e0d-6b67-41d3-a59c-bb176bfa8b02',
    'Pizza Hut',
    '3345 N Academy Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.88121,
    -104.75648,
    'Limited-Service Restaurants',
    true,
    true,
    3.6739952177936606
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '86173b08-16d2-4e97-8ca1-37f9aba739ab',
    'Cold Stone Creamery',
    '3235 Cinema Pt',
    'Colorado Springs',
    'CO',
    NULL,
    38.880486,
    -104.716705,
    'Snack and Nonalcoholic Beverage Bars',
    true,
    true,
    3.7884063138346797
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'ffed195f-fa5d-4d6b-b93f-e28d3cfbf017',
    'Floyd''s 99 Barbershop',
    '3377 Cinema Pt',
    'Colorado Springs',
    'CO',
    NULL,
    38.881557,
    -104.71675,
    'Barber Shops',
    true,
    true,
    3.7174595630391547
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '4badecd3-4143-48a3-8708-3fc3f4068936',
    'Hallmark Cards',
    '3356 Cinema Pt',
    'Colorado Springs',
    'CO',
    NULL,
    38.881584,
    -104.71732,
    'Gift, Novelty, and Souvenir Stores',
    true,
    true,
    3.7059881906215044
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '63220a67-fbb5-4bb5-a88c-c49d1db177ec',
    'State Farm',
    '3377 N Academy Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.88181,
    -104.75589,
    'Insurance Agencies and Brokerages',
    true,
    true,
    3.625908000242387
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'd493f563-1835-4895-b2e1-9205e488f6cd',
    'Foundation Building Materials (FBM)',
    '450 4th St',
    'Colorado Springs',
    'CO',
    NULL,
    38.87908,
    -104.814995,
    'Other Building Material Dealers',
    true,
    true,
    5.526952095133624
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '6e60a65a-56fc-4b7b-8c07-8b1444eb2f8c',
    'Red Lobster',
    '3510 New Center Pt',
    'Colorado Springs',
    'CO',
    NULL,
    38.882256,
    -104.718895,
    'Full-Service Restaurants',
    true,
    true,
    3.6361756391174644
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '5c690fa1-1c80-446a-8fd6-4ace3e18b5b3',
    'GameStop',
    '2850 S Academy Blvd Ste 150',
    'Colorado Springs',
    'CO',
    NULL,
    38.791225,
    -104.76011,
    'Hobby, Toy, and Game Stores',
    true,
    true,
    9.82371067935985
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '962dc4aa-5e39-4940-b74f-0cb8dd0758f5',
    'Public Storage',
    '3488 Astrozon Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.790207,
    -104.76455,
    'Lessors of Miniwarehouses and Self-Storage Units',
    true,
    true,
    9.924262409353636
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'ecfa0140-9bee-41b1-832d-de9a499795c9',
    'King Soopers',
    '2910 S Academy Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.790447,
    -104.76064,
    'Supermarkets and Other Grocery (except Convenience) Stores',
    true,
    true,
    9.880437328253574
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '82f3dcf6-37f1-4159-a4c1-b2eabaeb437d',
    'Starbucks',
    '2910 S Academy Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.789734,
    -104.75868,
    'Snack and Nonalcoholic Beverage Bars',
    false,
    true,
    9.917272854406463
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '6802622b-3e7f-4ed2-93af-a0a4c19c9b4a',
    'Metro by T-Mobile',
    '2710 S Academy Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.793213,
    -104.759,
    'Wireless Telecommunications Carriers (except Satellite)',
    true,
    true,
    9.680627167259166
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'cf299028-a9a1-4527-9c22-a8c61bb2bca0',
    'Point S Tire & Auto Service',
    '801 E Fillmore St',
    'Colorado Springs',
    'CO',
    NULL,
    38.873707,
    -104.81087,
    'Tire Dealers',
    false,
    false,
    5.625464332939714
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '3192dd95-5a2c-4479-984d-066e8fa3d4ad',
    'Red Star Vapor',
    '2884 N Powers Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.873398,
    -104.722115,
    'Tobacco Stores',
    true,
    true,
    4.183523797489124
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'd5c80f19-876a-4593-ad0d-d978dae1f3e0',
    'ACE Cash Express',
    '3014 N Nevada Ave',
    'Colorado Springs',
    'CO',
    NULL,
    38.874958,
    -104.820854,
    'Other Activities Related to Credit Intermediation',
    true,
    true,
    5.952167686252331
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'bc9e3b71-ae8b-405c-9618-bd4ad8c9c093',
    'Public Storage',
    '3061 Wood Ave',
    'Colorado Springs',
    'CO',
    NULL,
    38.87525,
    -104.82485,
    'Lessors of Miniwarehouses and Self-Storage Units',
    false,
    true,
    6.100988977321317
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '1f9509ec-3d58-474e-8c50-58b1ce7a7c66',
    'WinWholesale',
    '7821 Red Granite Loop',
    'Colorado Springs',
    'CO',
    NULL,
    38.875145,
    -104.679214,
    'Other Miscellaneous Durable Goods Merchant Wholesalers',
    true,
    true,
    5.101564655705407
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    'edbe964e-15ac-49ae-82ea-3f10f86799ac',
    'Sleep Number',
    '3015 New Center Pt',
    'Colorado Springs',
    'CO',
    NULL,
    38.875874,
    -104.71904,
    'Furniture Stores',
    true,
    true,
    4.057042140410193
) ON CONFLICT (pid) DO NOTHING;

INSERT INTO public.competitors (
    pid, name, street_address, city, region, logo, 
    latitude, longitude, sub_category, trade_area_activity, 
    home_locations_activity, distance
) VALUES (
    '4815e8a4-016d-4abe-9d56-819294367879',
    'Safeway',
    '2890 N Powers Blvd',
    'Colorado Springs',
    'CO',
    NULL,
    38.87389,
    -104.72243,
    'Supermarkets and Other Grocery (except Convenience) Stores',
    true,
    true,
    4.1467566011995025
) ON CONFLICT (pid) DO NOTHING;
