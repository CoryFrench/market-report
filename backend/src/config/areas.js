// Area Profile Configuration
// This defines all supported area profiles and how to filter data for each

const AREA_PROFILES = {
  // City-based profiles
  'jupiter': {
    name: 'Jupiter',
    description: 'Jupiter area properties and market data',
    type: 'city',
    filters: {
      city: 'JUPITER'
    }
  },
  'juno-beach': {
    name: 'Juno Beach', 
    description: 'Juno Beach area properties and market data',
    type: 'city',
    filters: {
      city: 'JUNO BEACH'
    }
  },
  'singer-island': {
    name: 'Singer Island',
    description: 'Singer Island area properties and market data', 
    type: 'city',
    filters: {
      city: 'SINGER ISLAND'
    }
  },
  'palm-beach-shores': {
    name: 'Palm Beach Shores',
    description: 'Palm Beach Shores area properties and market data',
    type: 'city', 
    filters: {
      city: 'PALM BEACH SHORES'
    }
  },

  // Development-based profiles
  'admirals-cove': {
    name: 'Admirals Cove',
    description: 'Luxury waterfront community in Jupiter',
    type: 'development',
    filters: {
      development_name: 'Admirals Cove'
    }
  },
  'alicante': {
    name: 'Alicante',
    description: 'Alicante community properties',
    type: 'development', 
    filters: {
      development_name: 'Alicante'
    }
  },
  'harbour-ridge-yacht-club': {
    name: 'Harbour Ridge Yacht & Country Club',
    description: 'Exclusive yacht club community',
    type: 'development',
    filters: {
      development_name: 'Harbour Ridge Yacht & Country Club'
    }
  },
  'jupiter-yacht-club': {
    name: 'Jupiter Yacht Club',
    description: 'Premium waterfront yacht club community', 
    type: 'development',
    filters: {
      development_name: 'Jupiter Yacht Club'
    }
  },

  // Lifestyle-based profiles (combinations)
  'jupiter-waterfront': {
    name: 'Jupiter Waterfront Properties',
    description: 'Waterfront homes and condos in Jupiter',
    type: 'lifestyle',
    filters: {
      city: 'JUPITER',
      waterfront: true
    }
  },
  'jupiter-luxury': {
    name: 'Jupiter Luxury Properties', 
    description: 'High-end properties in Jupiter over $2M',
    type: 'lifestyle',
    filters: {
      city: 'JUPITER',
      minPrice: 2000000
    }
  },
  'singer-island-luxury': {
    name: 'Singer Island Luxury Properties',
    description: 'Luxury properties on Singer Island over $3M',
    type: 'lifestyle', 
    filters: {
      city: 'SINGER ISLAND',
      minPrice: 3000000
    }
  }
};

// Helper functions
function getAreaProfile(areaId) {
  return AREA_PROFILES[areaId] || null;
}

function getAllAreaProfiles() {
  return AREA_PROFILES;
}

function getAreaProfilesByType(type) {
  return Object.entries(AREA_PROFILES)
    .filter(([id, profile]) => profile.type === type)
    .reduce((result, [id, profile]) => {
      result[id] = profile;
      return result;
    }, {});
}

function isValidAreaId(areaId) {
  return areaId in AREA_PROFILES;
}

module.exports = {
  AREA_PROFILES,
  getAreaProfile,
  getAllAreaProfiles, 
  getAreaProfilesByType,
  isValidAreaId
}; 