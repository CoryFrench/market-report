// Area Profile Configuration
// All area profiles are now dynamically generated from database queries

// Legacy function - now redirects to database lookup
async function getAreaProfile(areaId, databaseService) {
  return await getAreaProfileWithDatabase(areaId, databaseService);
}

// Dynamic area profile generation from database
function createDynamicAreaProfile(areaId, cityName) {
  // Convert area ID to display name (e.g., "west-palm-beach" -> "West Palm Beach")
  const displayName = areaId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return {
    name: displayName,
    description: `${displayName} area properties and market data`,
    type: 'city',
    filters: {
      city: cityName
    }
  };
}

// All area profiles are now dynamic - these functions are deprecated
async function getAllAreaProfiles(databaseService) {
  // This would require querying all possible areas from database
  // For now, return empty object since we're fully dynamic
  return {};
}

async function getAreaProfilesByType(type, databaseService) {
  // This would require querying database by type
  // For now, return empty object since we're fully dynamic
  return {};
}

async function isValidAreaId(areaId, databaseService) {
  const profile = await getAreaProfileWithDatabase(areaId, databaseService);
  return profile !== null;
}

// Fully dynamic area profile lookup from database
async function getAreaProfileWithDatabase(areaId, databaseService, expectedType = null) {
  // All lookups are now purely database-driven
  try {
    // Convert area ID to display name format (e.g., "bears-club" -> "Bears Club")
    const displayName = areaId.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    // If we have an expected type, try that first
    if (expectedType) {
      let result = null;
      
      switch (expectedType) {
        case 'city':
          const cityResult = await databaseService.query(
            'SELECT DISTINCT city FROM mls.beaches_residential WHERE LOWER(REPLACE(city, \' \', \'-\')) = LOWER($1) LIMIT 1',
            [areaId]
          );
          if (cityResult.rows.length > 0) {
            const actualCityName = cityResult.rows[0].city;
            result = {
              name: actualCityName,
              description: `${actualCityName} area properties and market data`,
              type: 'city',
              filters: { city: actualCityName }
            };
          }
          break;
          
        case 'development':
          const developmentResult = await databaseService.query(
            'SELECT DISTINCT development_name FROM waterfrontdata.development_data WHERE LOWER(REPLACE(development_name, \' \', \'-\')) = LOWER($1) LIMIT 1',
            [areaId]
          );
          if (developmentResult.rows.length > 0) {
            const actualDevelopmentName = developmentResult.rows[0].development_name;
            result = {
              name: actualDevelopmentName,
              description: `${actualDevelopmentName} development properties and market data`,
              type: 'development',
              filters: { development_name: actualDevelopmentName }
            };
          }
          break;
          
        case 'subdivision':
          const subdivisionResult = await databaseService.query(
            'SELECT DISTINCT subdivision_name FROM waterfrontdata.development_data WHERE LOWER(REPLACE(subdivision_name, \' \', \'-\')) = LOWER($1) LIMIT 1',
            [areaId]
          );
          if (subdivisionResult.rows.length > 0) {
            const actualSubdivisionName = subdivisionResult.rows[0].subdivision_name;
            result = {
              name: actualSubdivisionName,
              description: `${actualSubdivisionName} subdivision properties and market data`,
              type: 'subdivision',
              filters: { subdivision_name: actualSubdivisionName }
            };
          }
          break;
          
        case 'zone':
          const zoneResult = await databaseService.query(
            'SELECT DISTINCT zone_name FROM waterfrontdata.development_data WHERE LOWER(REPLACE(zone_name, \' \', \'-\')) = LOWER($1) LIMIT 1',
            [areaId]
          );
          if (zoneResult.rows.length > 0) {
            const actualZoneName = zoneResult.rows[0].zone_name;
            result = {
              name: actualZoneName,
              description: `${actualZoneName} zone properties and market data`,
              type: 'zone',
              filters: { zone_name: actualZoneName }
            };
          }
          break;
          
        case 'region':
          const regionResult = await databaseService.query(
            'SELECT DISTINCT region_name FROM waterfrontdata.development_data WHERE LOWER(REPLACE(region_name, \' \', \'-\')) = LOWER($1) LIMIT 1',
            [areaId]
          );
          if (regionResult.rows.length > 0) {
            const actualRegionName = regionResult.rows[0].region_name;
            result = {
              name: actualRegionName,
              description: `${actualRegionName} region properties and market data`,
              type: 'region',
              filters: { region_name: actualRegionName }
            };
          }
          break;
      }
      
      if (result) {
        return result;
      }
    }
    
    // If expected type lookup failed or no expected type, try all types in order
    // Try city lookup first
    const cityResult = await databaseService.query(
      'SELECT DISTINCT city FROM mls.beaches_residential WHERE LOWER(REPLACE(city, \' \', \'-\')) = LOWER($1) LIMIT 1',
      [areaId]
    );
    
    if (cityResult.rows.length > 0) {
      const actualCityName = cityResult.rows[0].city;
      return {
        name: actualCityName,
        description: `${actualCityName} area properties and market data`,
        type: 'city',
        filters: {
          city: actualCityName
        }
      };
    }
    
    // Try development lookup
    const developmentResult = await databaseService.query(
      'SELECT DISTINCT development_name FROM waterfrontdata.development_data WHERE LOWER(REPLACE(development_name, \' \', \'-\')) = LOWER($1) LIMIT 1',
      [areaId]
    );
    
    if (developmentResult.rows.length > 0) {
      const actualDevelopmentName = developmentResult.rows[0].development_name;
      return {
        name: actualDevelopmentName,
        description: `${actualDevelopmentName} development properties and market data`,
        type: 'development',
        filters: {
          development_name: actualDevelopmentName
        }
      };
    }
    
    // Try subdivision lookup
    const subdivisionResult = await databaseService.query(
      'SELECT DISTINCT subdivision_name FROM waterfrontdata.development_data WHERE LOWER(REPLACE(subdivision_name, \' \', \'-\')) = LOWER($1) LIMIT 1',
      [areaId]
    );
    
    if (subdivisionResult.rows.length > 0) {
      const actualSubdivisionName = subdivisionResult.rows[0].subdivision_name;
      return {
        name: actualSubdivisionName,
        description: `${actualSubdivisionName} subdivision properties and market data`,
        type: 'subdivision',
        filters: {
          subdivision_name: actualSubdivisionName
        }
      };
    }
    
    // Try zone lookup
    const zoneResult = await databaseService.query(
      'SELECT DISTINCT zone_name FROM waterfrontdata.development_data WHERE LOWER(REPLACE(zone_name, \' \', \'-\')) = LOWER($1) LIMIT 1',
      [areaId]
    );
    
    if (zoneResult.rows.length > 0) {
      const actualZoneName = zoneResult.rows[0].zone_name;
      return {
        name: actualZoneName,
        description: `${actualZoneName} zone properties and market data`,
        type: 'zone',
        filters: {
          zone_name: actualZoneName
        }
      };
    }
    
    // Try region lookup
    const regionResult = await databaseService.query(
      'SELECT DISTINCT region_name FROM waterfrontdata.development_data WHERE LOWER(REPLACE(region_name, \' \', \'-\')) = LOWER($1) LIMIT 1',
      [areaId]
    );
    
    if (regionResult.rows.length > 0) {
      const actualRegionName = regionResult.rows[0].region_name;
      return {
        name: actualRegionName,
        description: `${actualRegionName} region properties and market data`,
        type: 'region',
        filters: {
          region_name: actualRegionName
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error looking up area in database:', error);
    return null;
  }
}

module.exports = {
  getAreaProfile,
  getAllAreaProfiles, 
  getAreaProfilesByType,
  isValidAreaId,
  getAreaProfileWithDatabase,
  createDynamicAreaProfile
}; 