const express = require('express');
const rets = require('rets-client');
const DatabaseService = require('../services/database');
const { getAreaProfile, getAllAreaProfiles, isValidAreaId, getAreaProfileWithDatabase } = require('../config/areas');

const router = express.Router();

// Initialize database service
const dbService = new DatabaseService();

// Test database connection
dbService.query('SELECT 1 as test')
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection failed:', err.message));

// ========== NEW SEMANTIC AREA PROFILE ENDPOINTS ==========

// Semantic Area Profile Market Stats
router.get('/areas/:filterType/:filterValue/stats', async (req, res) => {
  try {
    const { filterType, filterValue } = req.params;
    const { minPrice, maxPrice } = req.query;
    console.log(`[API] Fetching stats for ${filterType}=${filterValue}, minPrice=${minPrice}, maxPrice=${maxPrice}`);
    
    if (!isValidFilterType(filterType)) {
      console.warn(`[API] Invalid filter type requested: ${filterType}`);
      return res.status(400).json({ error: `Invalid filter type: ${filterType}. Valid types: city, development, zone, region, subdivision` });
    }
    
    const stats = await dbService.getMarketStatsForFilter(
      filterType,
      filterValue,
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(stats);
  } catch (error) {
    console.error('Error fetching market stats:', error);
    res.status(500).json({ error: 'Failed to fetch market stats' });
  }
});

// Semantic Area Profile Recent Sales
router.get('/areas/:filterType/:filterValue/recent-sales', async (req, res) => {
  try {
    const { filterType, filterValue } = req.params;
    const { limit = 50, minPrice, maxPrice } = req.query;
    console.log(`[API] Fetching recent sales for ${filterType}=${filterValue}, limit=${limit}, minPrice=${minPrice}, maxPrice=${maxPrice}`);
    
    if (!isValidFilterType(filterType)) {
      console.warn(`[API] Invalid filter type requested: ${filterType}`);
      return res.status(400).json({ error: `Invalid filter type: ${filterType}. Valid types: city, development, zone, region, subdivision` });
    }
    
    const sales = await dbService.getRecentSalesForFilter(
      filterType,
      filterValue,
      parseInt(limit),
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(sales);
  } catch (error) {
    console.error('Error fetching recent sales:', error);
    res.status(500).json({ error: 'Failed to fetch recent sales' });
  }
});

// Semantic Area Profile Under Contract
router.get('/areas/:filterType/:filterValue/under-contract', async (req, res) => {
  try {
    const { filterType, filterValue } = req.params;
    const { limit = 50, minPrice, maxPrice } = req.query;
    console.log(`[API] Fetching under contract for ${filterType}=${filterValue}, limit=${limit}, minPrice=${minPrice}, maxPrice=${maxPrice}`);
    
    if (!isValidFilterType(filterType)) {
      console.warn(`[API] Invalid filter type requested: ${filterType}`);
      return res.status(400).json({ error: `Invalid filter type: ${filterType}. Valid types: city, development, zone, region, subdivision` });
    }
    
    const contracts = await dbService.getUnderContractForFilter(
      filterType,
      filterValue,
      parseInt(limit),
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(contracts);
  } catch (error) {
    console.error('Error fetching under contract listings:', error);
    res.status(500).json({ error: 'Failed to fetch under contract listings' });
  }
});

// Semantic Area Profile Active Listings
router.get('/areas/:filterType/:filterValue/active-listings', async (req, res) => {
  try {
    const { filterType, filterValue } = req.params;
    const { limit = 50, minPrice, maxPrice } = req.query;
    console.log(`[API] Fetching active listings for ${filterType}=${filterValue}, limit=${limit}, minPrice=${minPrice}, maxPrice=${maxPrice}`);
    
    if (!isValidFilterType(filterType)) {
      console.warn(`[API] Invalid filter type requested: ${filterType}`);
      return res.status(400).json({ error: `Invalid filter type: ${filterType}. Valid types: city, development, zone, region, subdivision` });
    }
    
    const listings = await dbService.getActiveListingsForFilter(
      filterType,
      filterValue,
      parseInt(limit),
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(listings);
  } catch (error) {
    console.error('Error fetching active listings:', error);
    res.status(500).json({ error: 'Failed to fetch active listings' });
  }
});

// Semantic Area Profile Coming Soon
router.get('/areas/:filterType/:filterValue/coming-soon', async (req, res) => {
  try {
    const { filterType, filterValue } = req.params;
    const { limit = 50, minPrice, maxPrice } = req.query;
    console.log(`[API] Fetching coming soon for ${filterType}=${filterValue}, limit=${limit}, minPrice=${minPrice}, maxPrice=${maxPrice}`);
    
    if (!isValidFilterType(filterType)) {
      console.warn(`[API] Invalid filter type requested: ${filterType}`);
      return res.status(400).json({ error: `Invalid filter type: ${filterType}. Valid types: city, development, zone, region, subdivision` });
    }
    
    const comingSoon = await dbService.getComingSoonForFilter(
      filterType,
      filterValue,
      parseInt(limit),
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(comingSoon);
  } catch (error) {
    console.error('Error fetching coming soon listings:', error);
    res.status(500).json({ error: 'Failed to fetch coming soon listings' });
  }
});

// Semantic Area Profile Price Changes
router.get('/areas/:filterType/:filterValue/price-changes', async (req, res) => {
  try {
    const { filterType, filterValue } = req.params;
    const { limit = 50, minPrice, maxPrice } = req.query;
    console.log(`[API] Fetching price changes for ${filterType}=${filterValue}, limit=${limit}, minPrice=${minPrice}, maxPrice=${maxPrice}`);
    
    if (!isValidFilterType(filterType)) {
      console.warn(`[API] Invalid filter type requested: ${filterType}`);
      return res.status(400).json({ error: `Invalid filter type: ${filterType}. Valid types: city, development, zone, region, subdivision` });
    }
    
    const changes = await dbService.getPriceChangesForFilter(
      filterType,
      filterValue,
      parseInt(limit),
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(changes);
  } catch (error) {
    console.error('Error fetching price changes:', error);
    res.status(500).json({ error: 'Failed to fetch price changes' });
  }
});

// Get available values for a specific filter type
router.get('/areas/:filterType', async (req, res) => {
  try {
    const { filterType } = req.params;
    console.log(`[API] Fetching available values for filter type: ${filterType}`);
    
    if (!isValidFilterType(filterType)) {
      console.warn(`[API] Invalid filter type requested: ${filterType}`);
      return res.status(400).json({ error: `Invalid filter type: ${filterType}. Valid types: city, development, zone, region, subdivision` });
    }
    
    const values = await dbService.getAvailableFilterValues(filterType);
    res.json(values);
  } catch (error) {
    console.error('Error fetching filter values:', error);
    res.status(500).json({ error: 'Failed to fetch filter values' });
  }
});

// Helper function to validate filter types
function isValidFilterType(filterType) {
  const validTypes = ['city', 'development', 'zone', 'region', 'subdivision'];
  return validTypes.includes(filterType);
}

// ========== PHOTO FETCHING ENDPOINT ==========

router.get('/fetch-photo', async (req, res) => {
    const { listingId } = req.query;
    const index = req.query.index || 0; // Default to first image
    
    if (!listingId) {
        return res.status(400).json({ error: 'Listing ID is required' });
    }
    
    try {
        // RETS configuration
        const config = {
            loginUrl: 'http://retsgw.flexmls.com/rets2_3/Login',
            username: process.env.RETS_USERNAME,
            password: process.env.RETS_PASSWORD,
            version: 'RETS/1.7.2',
            userAgent: 'YourApp/1.0',
            method: 'GET'
        };
        
        // Use auto-logout client for connection management
        const client = await rets.getAutoLogoutClient(config, async (client) => {
            const response = await client.objects.getObjects(
                'Property',        // Resource type
                'HiRes',          // Object type (high resolution)
                `${listingId}:${index}`, // Resource ID with index
                {
                    alwaysGroupObjects: true,
                    location: 1       // Return URL instead of binary data
                }
            );
            
            if (response.objects && response.objects.length > 0) {
                const location = response.objects[0].headerInfo.location;
                res.json({ location });
            } else {
                res.status(404).json({ error: 'Photo not found' });
            }
        });
    } catch (error) {
        console.error('Error fetching photo:', error);
        res.status(500).json({ error: 'Failed to fetch photo' });
    }
});

// ========== LEGACY AREA PROFILE ENDPOINTS (for backwards compatibility) ==========

// Get area profile info
router.get('/areas/:areaId', async (req, res) => {
  try {
    const { areaId } = req.params;
    const { expectedType } = req.query;
    
    const areaProfile = await getAreaProfileWithDatabase(areaId, dbService, expectedType);
    
    if (!areaProfile) {
      return res.status(404).json({ error: 'Area profile not found' });
    }
    
    res.json(areaProfile);
  } catch (error) {
    console.error('Error fetching area profile:', error);
    res.status(500).json({ error: 'Failed to fetch area profile' });
  }
});

// Get all available area profiles
router.get('/areas', async (req, res) => {
  try {
    const areas = getAllAreaProfiles();
    res.json(areas);
  } catch (error) {
    console.error('Error fetching area profiles:', error);
    res.status(500).json({ error: 'Failed to fetch area profiles' });
  }
});

// Legacy Area Profile Market Stats
router.get('/areas/:areaId/stats', async (req, res) => {
  try {
    const { areaId } = req.params;
    const { minPrice, maxPrice } = req.query;
    
    if (!isValidAreaId(areaId)) {
      return res.status(404).json({ error: 'Area profile not found' });
    }
    
    const stats = await dbService.getMarketStatsForArea(
      areaId,
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(stats);
  } catch (error) {
    console.error('Error fetching area market stats:', error);
    res.status(500).json({ error: 'Failed to fetch area market stats' });
  }
});

// Area Profile Recent Sales
router.get('/areas/:areaId/recent-sales', async (req, res) => {
  try {
    const { areaId } = req.params;
    const { limit = 50, minPrice, maxPrice } = req.query;
    
    if (!isValidAreaId(areaId)) {
      return res.status(404).json({ error: 'Area profile not found' });
    }
    
    const sales = await dbService.getRecentSalesForArea(
      areaId,
      parseInt(limit),
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(sales);
  } catch (error) {
    console.error('Error fetching area recent sales:', error);
    res.status(500).json({ error: 'Failed to fetch area recent sales' });
  }
});

// Area Profile Under Contract
router.get('/areas/:areaId/under-contract', async (req, res) => {
  try {
    const { areaId } = req.params;
    const { limit = 50, minPrice, maxPrice } = req.query;
    
    if (!isValidAreaId(areaId)) {
      return res.status(404).json({ error: 'Area profile not found' });
    }
    
    const contracts = await dbService.getUnderContractForArea(
      areaId,
      parseInt(limit),
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(contracts);
  } catch (error) {
    console.error('Error fetching area under contract listings:', error);
    res.status(500).json({ error: 'Failed to fetch area under contract listings' });
  }
});

// Area Profile Active Listings
router.get('/areas/:areaId/active-listings', async (req, res) => {
  try {
    const { areaId } = req.params;
    const { limit = 50, minPrice, maxPrice } = req.query;
    
    if (!isValidAreaId(areaId)) {
      return res.status(404).json({ error: 'Area profile not found' });
    }
    
    const listings = await dbService.getActiveListingsForArea(
      areaId,
      parseInt(limit),
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(listings);
  } catch (error) {
    console.error('Error fetching area active listings:', error);
    res.status(500).json({ error: 'Failed to fetch area active listings' });
  }
});

// Area Profile Coming Soon
router.get('/areas/:areaId/coming-soon', async (req, res) => {
  try {
    const { areaId } = req.params;
    const { limit = 50, minPrice, maxPrice } = req.query;
    
    if (!isValidAreaId(areaId)) {
      return res.status(404).json({ error: 'Area profile not found' });
    }
    
    const comingSoon = await dbService.getComingSoonForArea(
      areaId,
      parseInt(limit),
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(comingSoon);
  } catch (error) {
    console.error('Error fetching area coming soon listings:', error);
    res.status(500).json({ error: 'Failed to fetch area coming soon listings' });
  }
});

// Area Profile Price Changes
router.get('/areas/:areaId/price-changes', async (req, res) => {
  try {
    const { areaId } = req.params;
    const { limit = 50, minPrice, maxPrice } = req.query;
    
    if (!isValidAreaId(areaId)) {
      return res.status(404).json({ error: 'Area profile not found' });
    }
    
    const changes = await dbService.getPriceChangesForArea(
      areaId,
      parseInt(limit),
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(changes);
  } catch (error) {
    console.error('Error fetching area price changes:', error);
    res.status(500).json({ error: 'Failed to fetch area price changes' });
  }
});

// ========== LEGACY ENDPOINTS (for backwards compatibility) ==========

// Market Stats
router.get('/market/stats', async (req, res) => {
  try {
    const { city, area, minPrice, maxPrice } = req.query; // Support both city and area for backwards compatibility
    const cityFilter = city || area;
    const stats = await dbService.getMarketStats(
      cityFilter, 
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(stats);
  } catch (error) {
    console.error('Error fetching market stats:', error);
    res.status(500).json({ error: 'Failed to fetch market stats' });
  }
});

// Recent Sales
router.get('/market/recent-sales', async (req, res) => {
  try {
    const { city, area, limit = 50, minPrice, maxPrice } = req.query; // Support both city and area for backwards compatibility
    const cityFilter = city || area;
    const sales = await dbService.getRecentSales(
      cityFilter, 
      parseInt(limit),
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(sales);
  } catch (error) {
    console.error('Error fetching recent sales:', error);
    res.status(500).json({ error: 'Failed to fetch recent sales' });
  }
});

// Under Contract
router.get('/market/under-contract', async (req, res) => {
  try {
    const { city, area, limit = 50, minPrice, maxPrice } = req.query; // Support both city and area for backwards compatibility
    const cityFilter = city || area;
    const contracts = await dbService.getUnderContract(
      cityFilter, 
      parseInt(limit),
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(contracts);
  } catch (error) {
    console.error('Error fetching under contract listings:', error);
    res.status(500).json({ error: 'Failed to fetch under contract listings' });
  }
});

// Active Listings
router.get('/market/active-listings', async (req, res) => {
  try {
    const { city, area, limit = 50, minPrice, maxPrice } = req.query; // Support both city and area for backwards compatibility
    const cityFilter = city || area;
    const listings = await dbService.getActiveListings(
      cityFilter, 
      parseInt(limit),
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(listings);
  } catch (error) {
    console.error('Error fetching active listings:', error);
    res.status(500).json({ error: 'Failed to fetch active listings' });
  }
});

// Coming Soon
router.get('/market/coming-soon', async (req, res) => {
  try {
    const { city, area, limit = 50, minPrice, maxPrice } = req.query; // Support both city and area for backwards compatibility
    const cityFilter = city || area;
    const comingSoon = await dbService.getComingSoon(
      cityFilter, 
      parseInt(limit),
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(comingSoon);
  } catch (error) {
    console.error('Error fetching coming soon listings:', error);
    res.status(500).json({ error: 'Failed to fetch coming soon listings' });
  }
});

// Price Changes
router.get('/market/price-changes', async (req, res) => {
  try {
    const { city, area, limit = 50, minPrice, maxPrice } = req.query; // Support both city and area for backwards compatibility
    const cityFilter = city || area;
    const changes = await dbService.getPriceChanges(
      cityFilter, 
      parseInt(limit),
      minPrice ? parseFloat(minPrice) : null, 
      maxPrice ? parseFloat(maxPrice) : null
    );
    res.json(changes);
  } catch (error) {
    console.error('Error fetching price changes:', error);
    res.status(500).json({ error: 'Failed to fetch price changes' });
  }
});

// Property by ID
router.get('/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const property = await dbService.getPropertyById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Property Search
router.get('/properties/search', async (req, res) => {
  try {
    const searchParams = {
      city: req.query.city || req.query.area, // Support both city and area for backwards compatibility
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
      minBeds: req.query.minBeds ? parseInt(req.query.minBeds) : undefined,
      maxBeds: req.query.maxBeds ? parseInt(req.query.maxBeds) : undefined,
      minBaths: req.query.minBaths ? parseFloat(req.query.minBaths) : undefined,
      maxBaths: req.query.maxBaths ? parseFloat(req.query.maxBaths) : undefined,
      hasPool: req.query.hasPool === 'true',
      waterfront: req.query.waterfront === 'true',
      status: req.query.status || 'Active',
      limit: req.query.limit ? parseInt(req.query.limit) : 50
    };

    const properties = await dbService.searchProperties(searchParams);
    res.json(properties);
  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({ error: 'Failed to search properties' });
  }
});

// Get Available Cities
router.get('/cities', async (req, res) => {
  try {
    const cities = await dbService.getAvailableCities();
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

module.exports = router; 