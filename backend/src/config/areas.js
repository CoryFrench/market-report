// Area Profile Configuration
// This defines all supported area profiles and how to filter data for each

const AREA_PROFILES = {
  // City-based profiles (updated to match available database cities)
  'boca-raton': {
    name: 'Boca Raton',
    description: 'Boca Raton area properties and market data',
    type: 'city',
    filters: {
      city: 'Boca Raton'
    }
  },
  'west-palm-beach': {
    name: 'West Palm Beach', 
    description: 'West Palm Beach area properties and market data',
    type: 'city',
    filters: {
      city: 'West Palm Beach'
    }
  },
  'boynton-beach': {
    name: 'Boynton Beach',
    description: 'Boynton Beach area properties and market data', 
    type: 'city',
    filters: {
      city: 'Boynton Beach'
    }
  },
  'delray-beach': {
    name: 'Delray Beach',
    description: 'Delray Beach area properties and market data',
    type: 'city', 
    filters: {
      city: 'Delray Beach'
    }
  },
  'port-saint-lucie': {
    name: 'Port Saint Lucie',
    description: 'Port Saint Lucie area properties and market data',
    type: 'city', 
    filters: {
      city: 'Port Saint Lucie'
    }
  },

  // Keep legacy Jupiter areas for backwards compatibility (but they'll return no data)
  'jupiter': {
    name: 'Jupiter',
    description: 'Jupiter area properties and market data (no data available)',
    type: 'city',
    filters: {
      city: 'Jupiter'
    }
  },
  'juno-beach': {
    name: 'Juno Beach', 
    description: 'Juno Beach area properties and market data (no data available)',
    type: 'city',
    filters: {
      city: 'Juno Beach'
    }
  },
  'singer-island': {
    name: 'Singer Island',
    description: 'Singer Island area properties and market data (no data available)', 
    type: 'city',
    filters: {
      city: 'Singer Island'
    }
  },
  'palm-beach-shores': {
    name: 'Palm Beach Shores',
    description: 'Palm Beach Shores area properties and market data (no data available)',
    type: 'city', 
    filters: {
      city: 'Palm Beach Shores'
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

  // Lifestyle-based profiles (updated to use available cities)
  'boca-raton-waterfront': {
    name: 'Boca Raton Waterfront Properties',
    description: 'Waterfront homes and condos in Boca Raton',
    type: 'lifestyle',
    filters: {
      city: 'Boca Raton',
      waterfront: true
    }
  },
  'boca-raton-luxury': {
    name: 'Boca Raton Luxury Properties', 
    description: 'High-end properties in Boca Raton over $2M',
    type: 'lifestyle',
    filters: {
      city: 'Boca Raton',
      minPrice: 2000000
    }
  },
  'west-palm-beach-luxury': {
    name: 'West Palm Beach Luxury Properties',
    description: 'Luxury properties in West Palm Beach over $3M',
    type: 'lifestyle', 
    filters: {
      city: 'West Palm Beach',
      minPrice: 3000000
    }
  },

  // Zone-based profiles
  'center-street-canals': {
    name: 'Center Street Canals',
    description: 'Exclusive waterfront properties in the Center Street Canals zone',
    type: 'zone',
    filters: {
      zone_name: 'Center Street Canals'
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