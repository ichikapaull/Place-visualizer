-- Sample zipcode data for testing
-- Insert sample home zipcode data for my_place (Starbucks in Colorado Springs)

INSERT INTO public.home_zipcodes (
    place_id, 
    zipcode, 
    customer_count, 
    polygon
) VALUES 
-- Zipcode 80906 (highest customer density)
(
    'c660833d-77f0-4bfa-b8f9-4ac38f43ef6a',
    '80906',
    245,
    ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [-104.7450, 38.9250],
            [-104.7450, 38.9350],
            [-104.7350, 38.9350],
            [-104.7350, 38.9250],
            [-104.7450, 38.9250]
        ]]
    }')
),
-- Zipcode 80907 (medium customer density)
(
    'c660833d-77f0-4bfa-b8f9-4ac38f43ef6a',
    '80907',
    178,
    ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [-104.7350, 38.9250],
            [-104.7350, 38.9350],
            [-104.7250, 38.9350],
            [-104.7250, 38.9250],
            [-104.7350, 38.9250]
        ]]
    }')
),
-- Zipcode 80909 (lower customer density)
(
    'c660833d-77f0-4bfa-b8f9-4ac38f43ef6a',
    '80909',
    89,
    ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [-104.7550, 38.9150],
            [-104.7550, 38.9250],
            [-104.7450, 38.9250],
            [-104.7450, 38.9150],
            [-104.7550, 38.9150]
        ]]
    }')
),
-- Zipcode 80904 (medium-low customer density)
(
    'c660833d-77f0-4bfa-b8f9-4ac38f43ef6a',
    '80904',
    134,
    ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [-104.7250, 38.9250],
            [-104.7250, 38.9350],
            [-104.7150, 38.9350],
            [-104.7150, 38.9250],
            [-104.7250, 38.9250]
        ]]
    }')
),
-- Zipcode 80918 (low customer density)
(
    'c660833d-77f0-4bfa-b8f9-4ac38f43ef6a',
    '80918',
    67,
    ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [-104.7650, 38.9050],
            [-104.7650, 38.9150],
            [-104.7550, 38.9150],
            [-104.7550, 38.9050],
            [-104.7650, 38.9050]
        ]]
    }')
)
ON CONFLICT (place_id, zipcode) DO NOTHING;