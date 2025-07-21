const express = require('express');
const DatabaseService = require('../services/database');
const { getAreaProfile, getAllAreaProfiles, isValidAreaId } = require('../config/areas');

const router = express.Router();

// Initialize database service
const dbService = new DatabaseService();

// Test database connection
dbService.query('SELECT 1 as test')
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection failed:', err.message));

// ========== AREA PROFILE ENDPOINTS ==========

// Get area profile info
router.get('/areas/:areaId', async (req, res) => {
  try {
    const { areaId } = req.params;
    const areaProfile = getAreaProfile(areaId);
    
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

// Area Profile Market Stats
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