-- Real-time MLS Database Schema
-- Based on Jupiter/Juno Beach and Singer Island market reports

-- Market Areas/Subdivisions
CREATE TABLE market_areas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL, -- 'Jupiter', 'Juno Beach', 'Singer Island', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties Master Table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    mls_id VARCHAR(50) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) DEFAULT 'FL',
    zip_code VARCHAR(10),
    market_area_id INTEGER REFERENCES market_areas(id),
    subdivision VARCHAR(255),
    
    -- Property Details
    bedrooms INTEGER,
    bathrooms DECIMAL(2,1),
    living_area INTEGER, -- square feet
    year_built INTEGER,
    has_pool BOOLEAN DEFAULT FALSE,
    waterfront BOOLEAN DEFAULT FALSE,
    
    -- Location
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Current Listings (Active, Under Contract, Coming Soon)
CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    mls_id VARCHAR(50) NOT NULL,
    
    -- Listing Details
    status VARCHAR(50) NOT NULL, -- 'active', 'under_contract', 'coming_soon', 'sold', 'withdrawn'
    list_price INTEGER NOT NULL,
    list_date DATE NOT NULL,
    
    -- Status Changes
    contract_date DATE,
    sold_date DATE,
    withdrawn_date DATE,
    
    -- Days on Market
    days_on_market INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN sold_date IS NOT NULL THEN sold_date - list_date
            WHEN contract_date IS NOT NULL THEN contract_date - list_date
            ELSE CURRENT_DATE - list_date
        END
    ) STORED,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Price History for tracking changes
CREATE TABLE price_history (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES listings(id),
    old_price INTEGER,
    new_price INTEGER NOT NULL,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    change_reason VARCHAR(100) -- 'initial_listing', 'price_reduction', 'price_increase'
);

-- Sales History
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    listing_id INTEGER REFERENCES listings(id),
    
    -- Sale Details
    sale_price INTEGER NOT NULL,
    sale_date DATE NOT NULL,
    original_list_price INTEGER,
    final_list_price INTEGER,
    
    -- Calculated Fields
    price_reduction INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN original_list_price IS NOT NULL 
            THEN original_list_price - sale_price 
            ELSE NULL 
        END
    ) STORED,
    
    days_on_market INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_properties_mls_id ON properties(mls_id);
CREATE INDEX idx_properties_market_area ON properties(market_area_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_list_date ON listings(list_date);
CREATE INDEX idx_sales_sale_date ON sales(sale_date);
CREATE INDEX idx_price_history_listing_id ON price_history(listing_id);

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON properties 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at 
    BEFORE UPDATE ON listings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 