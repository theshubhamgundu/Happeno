-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Merchants Table
CREATE TABLE merchants (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  business_name TEXT NOT NULL,
  business_address TEXT NOT NULL,
  location GEOMETRY(Point, 4326) NOT NULL,
  category TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offers Table
CREATE TABLE offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  discount_details TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  radius_km FLOAT NOT NULL,
  price_paid INTEGER NOT NULL,
  status TEXT DEFAULT 'active', -- active, paused, ended, expired
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Merchants (Users)
CREATE TABLE saved_merchants (
  user_id UUID NOT NULL, -- auth.users id
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, merchant_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles (Minimal for User App)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  fcm_token TEXT,
  nearby_alerts BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Merchants: Anyone can read approved merchants
CREATE POLICY "Anyone can read approved merchants" ON merchants 
FOR SELECT USING (is_approved = TRUE);

-- Merchants: Own profile management
CREATE POLICY "Merchants can manage own profile" ON merchants 
FOR ALL USING (auth.uid() = id);

-- Offers: Anyone can read active offers within their radius (logic handled in app but RLS allows read)
CREATE POLICY "Anyone can read active offers" ON offers 
FOR SELECT USING (status = 'active' AND end_time > NOW());

-- Offers: Merchants can manage own offers
CREATE POLICY "Merchants can manage own offers" ON offers 
FOR ALL USING (merchant_id = auth.uid());

-- Profiles: Users manage own
CREATE POLICY "Users can manage own profile" ON profiles 
FOR ALL USING (auth.uid() = id);

-- Index for spatial queries
CREATE INDEX merchants_location_idx ON merchants USING GIST (location);

-- Function for nearby offers
CREATE OR REPLACE FUNCTION get_nearby_offers(user_lat FLOAT, user_lng FLOAT)
RETURNS TABLE (
  offer_id UUID,
  merchant_name TEXT,
  title TEXT,
  description TEXT,
  discount_details TEXT,
  end_time TIMESTAMP WITH TIME ZONE,
  distance_meters FLOAT,
  merchant_lat FLOAT,
  merchant_lng FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    m.business_name,
    o.title,
    o.description,
    o.discount_details,
    o.end_time,
    ST_Distance(m.location, ST_SetSRID(ST_Point(user_lng, user_lat), 4326), TRUE) as distance_meters,
    ST_Y(m.location::geometry) as merchant_lat,
    ST_X(m.location::geometry) as merchant_lng
  FROM offers o
  JOIN merchants m ON o.merchant_id = m.id
  WHERE o.status = 'active' 
    AND o.end_time > NOW()
    AND ST_DWithin(m.location, ST_SetSRID(ST_Point(user_lng, user_lat), 4326), o.radius_km * 1000, TRUE)
  ORDER BY distance_meters ASC, o.end_time ASC;
END;
$$ LANGUAGE plpgsql;
