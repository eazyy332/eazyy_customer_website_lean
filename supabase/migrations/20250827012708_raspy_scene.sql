/*
  # Remove facility availability time check

  1. Function Updates
    - Update `assign_nearest_facility` function to remove delivery time availability check
    - Allow orders to be assigned to facilities regardless of operating hours
    
  2. Changes Made
    - Remove the facility availability validation that was causing "No facility available for the specified delivery time" error
    - Keep distance-based facility assignment but remove time constraints
*/

CREATE OR REPLACE FUNCTION assign_nearest_facility()
RETURNS TRIGGER AS $$
DECLARE
    nearest_facility_id UUID;
    order_lat NUMERIC;
    order_lng NUMERIC;
BEGIN
    -- Skip if facility is already assigned
    IF NEW.facility_id IS NOT NULL THEN
        RETURN NEW;
    END IF;

    -- Extract coordinates from the order
    order_lat := NEW.latitude::NUMERIC;
    order_lng := NEW.longitude::NUMERIC;

    -- Find the nearest active facility based on distance only
    SELECT f.id INTO nearest_facility_id
    FROM facilities f
    WHERE f.status = true
    ORDER BY (
        6371 * acos(
            cos(radians(order_lat)) * 
            cos(radians(f.latitude::NUMERIC)) * 
            cos(radians(f.longitude::NUMERIC) - radians(order_lng)) + 
            sin(radians(order_lat)) * 
            sin(radians(f.latitude::NUMERIC))
        )
    ) ASC
    LIMIT 1;

    -- Assign the nearest facility if found
    IF nearest_facility_id IS NOT NULL THEN
        NEW.facility_id := nearest_facility_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;