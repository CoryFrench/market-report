const { Pool } = require('pg');

class DatabaseService {
  constructor() {
    this.pool = new Pool({
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      ssl: process.env.PG_SSL ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async query(text, params) {
    try {
      const result = await this.pool.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Helper function to safely cast text dates to dates
  castDate(fieldName) {
    return `CASE WHEN ${fieldName} IS NOT NULL AND ${fieldName} != '' THEN ${fieldName}::date ELSE NULL END`;
  }

  // Helper function to safely cast text timestamps to timestamps
  castTimestamp(fieldName) {
    return `CASE WHEN ${fieldName} IS NOT NULL AND ${fieldName} != '' THEN ${fieldName}::timestamp ELSE NULL END`;
  }

  // Get the base query for most recent records per listing_id
  getBaseQuery() {
    return `
      WITH latest_listings AS (
        SELECT *,
               ROW_NUMBER() OVER (
                 PARTITION BY listing_id 
                 ORDER BY timestamp DESC
               ) as rn
        FROM mls.beaches_residential
        WHERE listing_id IS NOT NULL
      )
      SELECT * FROM latest_listings WHERE rn = 1
    `;
  }

  // Calculate days on market properly
  calculateDaysOnMarket(row) {
    // If we have a calculated value from the query, use it
    if (row.calculated_days_on_market !== undefined) {
      return parseInt(row.calculated_days_on_market) || 0;
    }
    
    // Otherwise calculate it based on status and dates
    const listingDate = row.listing_date;
    const soldDate = row.sold_date;
    const contractDate = row.under_contract_date;
    const status = row.status;
    
    if (!listingDate || listingDate === '') return 0;
    
    try {
      const listDate = new Date(listingDate);
      const today = new Date();
      
      if (status === 'Closed' && soldDate && soldDate !== '') {
        const soldDateObj = new Date(soldDate);
        return Math.floor((soldDateObj - listDate) / (1000 * 60 * 60 * 24));
      } else if (status === 'Active Under Contract' || status === 'Pending') {
        if (contractDate && contractDate !== '') {
          const contractDateObj = new Date(contractDate);
          return Math.floor((contractDateObj - listDate) / (1000 * 60 * 60 * 24));
        }
      }
      
      // For active listings or fallback
      return Math.floor((today - listDate) / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error('Error calculating days on market:', error);
      return parseInt(row.days_on_market) || 0;
    }
  }

  // Map MLS data to our application format
  mapProperty(row) {
    // Construct address with unit number if available
    let address = `${row.street_number || ''} ${row.street_name || ''}`.trim();
    if (row.unit_number && row.unit_number !== '') {
      address += ` #${row.unit_number}`;
    }

    return {
      id: row.listing_id,
      mlsId: row.mls_identifier,
      address: address,
      city: row.city,
      subdivision: row.subdivision,
      bedrooms: parseInt(row.total_bedrooms) || 0,
      bathrooms: parseFloat(row.baths_total) || 0,
      halfBaths: parseFloat(row.baths_half) || 0,
      hasPool: row.private_pool === 'Yes',
      livingArea: parseInt(row.sqft_living) || 0,
      totalArea: parseInt(row.sqft_total) || 0,
      lotSize: parseInt(row.lot_sqft) || 0,
      yearBuilt: parseInt(row.year_built) || 0,
      waterfront: row.waterfront === 'Yes',
      waterfrontage: row.waterfrontage,
      listPrice: parseFloat(row.list_price) || 0,
      soldPrice: parseFloat(row.sold_price) || 0,
      originalPrice: parseFloat(row.original_list_price) || 0,
      priorPrice: parseFloat(row.prior_list_price) || 0,
      listingDate: row.listing_date,
      soldDate: row.sold_date,
      contractDate: row.under_contract_date,
      statusChangeDate: row.status_change_date,
      daysOnMarket: this.calculateDaysOnMarket(row),
      cumulativeDom: parseInt(row.cumulative_dom) || 0,
      status: row.status,
      propertyType: row.property_type,
      construction: row.construction,
      parking: row.parking,
      garageSpaces: parseInt(row.garage_spaces) || 0,
      description: row.public_remarks,
      interiorFeatures: row.interior_features,
      exteriorFeatures: row.exterior_features,
      heating: row.heating,
      cooling: row.cooling,
      flooring: row.flooring,
      view: row.view,
      gatedCommunity: row.gated_community === 'Yes',
      hoa: parseFloat(row.hoa_poa_coa_monthly) || 0,
      taxes: parseFloat(row.taxes) || 0,
      taxYear: parseInt(row.tax_year) || 0,
      zoning: row.zoning,
      parcelId: row.parcel_id,
      mlsNumber: row.mls_identifier,
      listingAgent: row.listingmembername,
      listingOffice: row.listingofficename,
      latitude: parseFloat(row.geo_lat) || 0,
      longitude: parseFloat(row.geo_lon) || 0,
      lastUpdated: row.timestamp
    };
  }

  // Get active listings
  async getActiveListings(area = null, limit = 50) {
    let whereClause = "AND status = 'Active'";
    let params = [];

    if (area && area !== 'all') {
      const cityFilter = this.getAreaFilter(area);
      whereClause += ` AND city = $1`;
      params.push(cityFilter);
    }

    const query = `
      WITH latest_listings AS (
        SELECT *,
               ROW_NUMBER() OVER (
                 PARTITION BY listing_id 
                 ORDER BY timestamp DESC
               ) as rn
        FROM mls.beaches_residential
        WHERE listing_id IS NOT NULL
      )
      SELECT * FROM latest_listings 
      WHERE rn = 1 ${whereClause}
      ORDER BY ${this.castDate('listing_date')} DESC NULLS LAST
      LIMIT $${params.length + 1}
    `;
    params.push(limit);

    const result = await this.query(query, params);
    return result.rows.map(row => this.mapProperty(row));
  }

  // Get recent sales (last 30 days)
  async getRecentSales(area = null, limit = 50) {
    let whereClause = `AND status = 'Closed' AND ${this.castDate('sold_date')} >= CURRENT_DATE - INTERVAL '30 days'`;
    let params = [];

    if (area && area !== 'all') {
      const cityFilter = this.getAreaFilter(area);
      whereClause += ` AND city = $1`;
      params.push(cityFilter);
    }

    const query = `
      WITH latest_listings AS (
        SELECT *,
               ROW_NUMBER() OVER (
                 PARTITION BY listing_id 
                 ORDER BY timestamp DESC
               ) as rn
        FROM mls.beaches_residential
        WHERE listing_id IS NOT NULL
      )
      SELECT * FROM latest_listings 
      WHERE rn = 1 ${whereClause}
      ORDER BY ${this.castDate('sold_date')} DESC NULLS LAST
      LIMIT $${params.length + 1}
    `;
    params.push(limit);

    const result = await this.query(query, params);
    return result.rows.map(row => this.mapProperty(row));
  }

  // Get under contract properties
  async getUnderContract(area = null, limit = 50) {
    let whereClause = "AND status IN ('Active Under Contract', 'Pending')";
    let params = [];

    if (area && area !== 'all') {
      const cityFilter = this.getAreaFilter(area);
      whereClause += ` AND city = $1`;
      params.push(cityFilter);
    }

    const query = `
      WITH latest_listings AS (
        SELECT *,
               ROW_NUMBER() OVER (
                 PARTITION BY listing_id 
                 ORDER BY timestamp DESC
               ) as rn
        FROM mls.beaches_residential
        WHERE listing_id IS NOT NULL
      )
      SELECT * FROM latest_listings 
      WHERE rn = 1 ${whereClause}
      ORDER BY ${this.castDate('under_contract_date')} DESC NULLS LAST
      LIMIT $${params.length + 1}
    `;
    params.push(limit);

    const result = await this.query(query, params);
    return result.rows.map(row => this.mapProperty(row));
  }

  // Get coming soon properties
  async getComingSoon(area = null, limit = 50) {
    let whereClause = "AND status = 'Coming Soon'";
    let params = [];

    if (area && area !== 'all') {
      const cityFilter = this.getAreaFilter(area);
      whereClause += ` AND city = $1`;
      params.push(cityFilter);
    }

    const query = `
      WITH latest_listings AS (
        SELECT *,
               ROW_NUMBER() OVER (
                 PARTITION BY listing_id 
                 ORDER BY timestamp DESC
               ) as rn
        FROM mls.beaches_residential
        WHERE listing_id IS NOT NULL
      )
      SELECT * FROM latest_listings 
      WHERE rn = 1 ${whereClause}
      ORDER BY ${this.castDate('listing_date')} DESC NULLS LAST
      LIMIT $${params.length + 1}
    `;
    params.push(limit);

    const result = await this.query(query, params);
    return result.rows.map(row => this.mapProperty(row));
  }

  // Get price changes (last 30 days)
  async getPriceChanges(area = null, limit = 50) {
    let whereClause = `
      AND status = 'Active' 
      AND ${this.castTimestamp('price_change_timestamp')} >= CURRENT_DATE - INTERVAL '30 days'
      AND prior_list_price IS NOT NULL 
      AND prior_list_price != ''
      AND prior_list_price != list_price
    `;
    let params = [];

    if (area && area !== 'all') {
      const cityFilter = this.getAreaFilter(area);
      whereClause += ` AND city = $1`;
      params.push(cityFilter);
    }

    const query = `
      WITH latest_listings AS (
        SELECT *,
               ROW_NUMBER() OVER (
                 PARTITION BY listing_id 
                 ORDER BY timestamp DESC
               ) as rn
        FROM mls.beaches_residential
        WHERE listing_id IS NOT NULL
      )
      SELECT *, 
             prior_list_price as previousPrice, 
             list_price as currentPrice
      FROM latest_listings 
      WHERE rn = 1 ${whereClause}
      ORDER BY ${this.castTimestamp('price_change_timestamp')} DESC NULLS LAST
      LIMIT $${params.length + 1}
    `;
    params.push(limit);

    const result = await this.query(query, params);
    return result.rows.map(row => {
      const property = this.mapProperty(row);
      // Override with price change specific values
      property.previousPrice = parseFloat(row.previousprice) || 0;
      property.currentPrice = parseFloat(row.currentprice) || 0;
      property.priceChange = property.currentPrice - property.previousPrice;
      property.priceChangePercent = property.previousPrice > 0 ? 
        ((property.currentPrice - property.previousPrice) / property.previousPrice * 100).toFixed(1) : 0;
      return property;
    });
  }

  // Get market statistics
  async getMarketStats(area = null) {
    let whereClause = "";
    let params = [];

    if (area && area !== 'all') {
      const cityFilter = this.getAreaFilter(area);
      whereClause = "AND city = $1";
      params.push(cityFilter);
    }

    const query = `
      WITH latest_listings AS (
        SELECT *,
               ROW_NUMBER() OVER (
                 PARTITION BY listing_id 
                 ORDER BY timestamp DESC
               ) as rn
        FROM mls.beaches_residential
        WHERE listing_id IS NOT NULL
      ),
      calculated_stats AS (
        SELECT *,
               CASE 
                 WHEN status = 'Closed' AND sold_date IS NOT NULL AND sold_date != '' AND listing_date IS NOT NULL AND listing_date != ''
                 THEN sold_date::date - listing_date::date
                 WHEN status IN ('Active Under Contract', 'Pending') AND under_contract_date IS NOT NULL AND under_contract_date != '' AND listing_date IS NOT NULL AND listing_date != ''
                 THEN under_contract_date::date - listing_date::date
                 WHEN status = 'Active' AND listing_date IS NOT NULL AND listing_date != ''
                 THEN CURRENT_DATE - listing_date::date
                 ELSE NULL
               END as calculated_days_on_market
        FROM latest_listings 
        WHERE rn = 1 ${whereClause}
      )
      SELECT 
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_listings,
        COUNT(CASE WHEN status = 'Closed' AND ${this.castDate('sold_date')} >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as sales_last_30_days,
        COUNT(CASE WHEN status IN ('Active Under Contract', 'Pending') THEN 1 END) as under_contract,
        COUNT(CASE WHEN status = 'Coming Soon' THEN 1 END) as coming_soon,
        COUNT(CASE WHEN status = 'Active' AND ${this.castTimestamp('price_change_timestamp')} >= CURRENT_DATE - INTERVAL '30 days' AND prior_list_price IS NOT NULL AND prior_list_price != '' AND prior_list_price != list_price THEN 1 END) as price_changes_last_30_days,
        AVG(CASE WHEN status = 'Active' AND calculated_days_on_market > 0 THEN calculated_days_on_market END) as avg_days_on_market,
        AVG(CASE WHEN status = 'Closed' AND ${this.castDate('sold_date')} >= CURRENT_DATE - INTERVAL '30 days' AND sold_price IS NOT NULL AND sold_price != '' THEN sold_price::numeric END) as avg_sold_price,
        AVG(CASE WHEN status = 'Active' AND list_price IS NOT NULL AND list_price != '' THEN list_price::numeric END) as avg_list_price,
        MIN(CASE WHEN status = 'Active' AND list_price IS NOT NULL AND list_price != '' THEN list_price::numeric END) as min_list_price,
        MAX(CASE WHEN status = 'Active' AND list_price IS NOT NULL AND list_price != '' THEN list_price::numeric END) as max_list_price
      FROM calculated_stats
    `;

    const result = await this.query(query, params);
    const stats = result.rows[0];

    return {
      totalActiveListing: parseInt(stats.active_listings) || 0,
      totalSalesLast30Days: parseInt(stats.sales_last_30_days) || 0,
      totalUnderContract: parseInt(stats.under_contract) || 0,
      totalComingSoon: parseInt(stats.coming_soon) || 0,
      totalPriceChangesLast30Days: parseInt(stats.price_changes_last_30_days) || 0,
      averageDaysOnMarket: Math.round(parseFloat(stats.avg_days_on_market) || 0),
      averageSoldPrice: Math.round(parseFloat(stats.avg_sold_price) || 0),
      averageListPrice: Math.round(parseFloat(stats.avg_list_price) || 0),
      minListPrice: Math.round(parseFloat(stats.min_list_price) || 0),
      maxListPrice: Math.round(parseFloat(stats.max_list_price) || 0),
      lastUpdated: new Date().toISOString()
    };
  }

  // Map frontend area names to database city names
  getAreaFilter(area) {
    const areaMap = {
      'jupiter': 'Jupiter',
      'juno-beach': 'Juno Beach',
      'singer-island': 'Singer Island',
      'palm-beach-shores': 'Palm Beach Shores',
      'Jupiter': 'Jupiter',
      'Juno Beach': 'Juno Beach',
      'Singer Island': 'Singer Island',
      'Palm Beach Shores': 'Palm Beach Shores'
    };
    return areaMap[area] || area;
  }

  // Get property by ID
  async getPropertyById(id) {
    const query = `
      WITH latest_listings AS (
        SELECT *,
               ROW_NUMBER() OVER (
                 PARTITION BY listing_id 
                 ORDER BY timestamp DESC
               ) as rn
        FROM mls.beaches_residential
        WHERE listing_id IS NOT NULL
      )
      SELECT * FROM latest_listings 
      WHERE rn = 1 AND listing_id = $1
      LIMIT 1
    `;
    
    const result = await this.query(query, [id]);
    return result.rows.length > 0 ? this.mapProperty(result.rows[0]) : null;
  }

  // Search properties
  async searchProperties(searchParams) {
    const {
      area,
      minPrice,
      maxPrice,
      minBeds,
      maxBeds,
      minBaths,
      maxBaths,
      hasPool,
      waterfront,
      status = 'Active',
      limit = 50
    } = searchParams;

    let whereClause = `AND status = $1`;
    let params = [status];
    let paramCount = 1;

    if (area && area !== 'all') {
      paramCount++;
      whereClause += ` AND city = $${paramCount}`;
      params.push(this.getAreaFilter(area));
    }

    if (minPrice) {
      paramCount++;
      whereClause += ` AND list_price IS NOT NULL AND list_price != '' AND list_price::numeric >= $${paramCount}`;
      params.push(minPrice);
    }

    if (maxPrice) {
      paramCount++;
      whereClause += ` AND list_price IS NOT NULL AND list_price != '' AND list_price::numeric <= $${paramCount}`;
      params.push(maxPrice);
    }

    if (minBeds) {
      paramCount++;
      whereClause += ` AND total_bedrooms IS NOT NULL AND total_bedrooms != '' AND total_bedrooms::integer >= $${paramCount}`;
      params.push(minBeds);
    }

    if (maxBeds) {
      paramCount++;
      whereClause += ` AND total_bedrooms IS NOT NULL AND total_bedrooms != '' AND total_bedrooms::integer <= $${paramCount}`;
      params.push(maxBeds);
    }

    if (minBaths) {
      paramCount++;
      whereClause += ` AND baths_total IS NOT NULL AND baths_total != '' AND baths_total::numeric >= $${paramCount}`;
      params.push(minBaths);
    }

    if (maxBaths) {
      paramCount++;
      whereClause += ` AND baths_total IS NOT NULL AND baths_total != '' AND baths_total::numeric <= $${paramCount}`;
      params.push(maxBaths);
    }

    if (hasPool) {
      paramCount++;
      whereClause += ` AND private_pool = $${paramCount}`;
      params.push('Yes');
    }

    if (waterfront) {
      paramCount++;
      whereClause += ` AND waterfront = $${paramCount}`;
      params.push('Yes');
    }

    paramCount++;
    const query = `
      WITH latest_listings AS (
        SELECT *,
               ROW_NUMBER() OVER (
                 PARTITION BY listing_id 
                 ORDER BY timestamp DESC
               ) as rn
        FROM mls.beaches_residential
        WHERE listing_id IS NOT NULL
      )
      SELECT * FROM latest_listings 
      WHERE rn = 1 ${whereClause}
      ORDER BY ${this.castDate('listing_date')} DESC NULLS LAST
      LIMIT $${paramCount}
    `;
    params.push(limit);

    const result = await this.query(query, params);
    return result.rows.map(row => this.mapProperty(row));
  }

  // Close database connection
  async close() {
    await this.pool.end();
  }
}

module.exports = DatabaseService; 