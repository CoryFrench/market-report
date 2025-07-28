import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AreaHeader from './AreaHeader';
import Dashboard from './Dashboard';
import FeaturedProperty from './FeaturedProperty';
import PropertyTable from './PropertyTable';

const AreaProfile = ({ apiBaseUrl }) => {
  const { areaId } = useParams();
  const location = useLocation();
  
  // Extract type from pathname (e.g., "/city/jupiter" -> "city")
  console.log('Current pathname:', location.pathname);
  console.log('Path split result:', location.pathname.split('/'));
  const type = location.pathname.split('/')[1];
  console.log('Extracted type:', type);
  const [areaProfile, setAreaProfile] = useState(null);
  const [activePriceRange, setActivePriceRange] = useState('1m-plus');
  const [marketStats, setMarketStats] = useState({});
  const [recentSales, setRecentSales] = useState([]);
  const [underContract, setUnderContract] = useState([]);
  const [activeListings, setActiveListings] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [priceChanges, setPriceChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convert price range to API parameters
  const getPriceRangeParams = (priceRange) => {
    switch (priceRange) {
      case 'all':
        return {};
      case 'under-500k':
        return { maxPrice: 500000 };
      case '500k-plus':
        return { minPrice: 500000 };
      case '1m-plus':
        return { minPrice: 1000000 };
      case '3m-plus':
        return { minPrice: 3000000 };
      case '5m-plus':
        return { minPrice: 5000000 };
      case '10m-plus':
        return { minPrice: 10000000 };
      default:
        return {};
    }
  };

  // Fetch area profile info
  const fetchAreaProfile = async (areaId, expectedType) => {
    try {
      console.log('fetchAreaProfile called with:', { areaId, expectedType });
      const url = expectedType 
        ? `${apiBaseUrl}/areas/${areaId}?expectedType=${expectedType}`
        : `${apiBaseUrl}/areas/${areaId}`;
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Area profile not found');
        }
        throw new Error('Failed to fetch area profile');
      }
      const profile = await response.json();
      console.log('Area profile response:', profile);
      
      // Validate that the URL type matches the actual area type
      if (expectedType && profile.type !== expectedType) {
        console.error('Type mismatch:', { areaId, expectedType, actualType: profile.type });
        throw new Error(`Invalid URL: Area "${areaId}" is of type "${profile.type}", not "${expectedType}"`);
      }
      
      setAreaProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error fetching area profile:', error);
      throw error;
    }
  };

  // Fetch all data for the area and price range
  const fetchAreaData = async (areaId, priceRange, expectedType) => {
    try {
      setLoading(true);
      setError(null);

      const priceParams = getPriceRangeParams(priceRange);

      // Build query parameters
      const buildQueryParams = (baseParams = {}) => {
        const params = new URLSearchParams({
          ...baseParams,
          ...priceParams
        });
        return params.toString();
      };

      // Fetch area profile and all data in parallel
      const [
        areaProfileData,
        statsResponse,
        salesResponse,
        contractResponse,
        listingsResponse,
        comingSoonResponse,
        priceChangesResponse
      ] = await Promise.all([
        fetchAreaProfile(areaId, expectedType),
        fetch(`${apiBaseUrl}/areas/${areaId}/stats?${buildQueryParams()}`),
        fetch(`${apiBaseUrl}/areas/${areaId}/recent-sales?${buildQueryParams({ limit: 50 })}`),
        fetch(`${apiBaseUrl}/areas/${areaId}/under-contract?${buildQueryParams({ limit: 50 })}`),
        fetch(`${apiBaseUrl}/areas/${areaId}/active-listings?${buildQueryParams({ limit: 50 })}`),
        fetch(`${apiBaseUrl}/areas/${areaId}/coming-soon?${buildQueryParams({ limit: 50 })}`),
        fetch(`${apiBaseUrl}/areas/${areaId}/price-changes?${buildQueryParams({ limit: 50 })}`)
      ]);

      // Check if all requests were successful
      const responses = [statsResponse, salesResponse, contractResponse, listingsResponse, comingSoonResponse, priceChangesResponse];
      if (responses.some(res => !res.ok)) {
        throw new Error('Failed to fetch one or more area data endpoints.');
      }

      // Parse all responses
      const [stats, sales, contracts, listings, comingSoonData, priceChangesData] = await Promise.all(responses.map(res => res.json()));

      // Update state
      setMarketStats(stats);
      setRecentSales(sales);
      setUnderContract(contracts);
      setActiveListings(listings);
      setComingSoon(comingSoonData);
      setPriceChanges(priceChangesData);

    } catch (err) {
      console.error('Error fetching area data:', err);
      setError(err.message || 'Failed to load area data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data when area URL params or price range change
  useEffect(() => {
    fetchAreaData(areaId, activePriceRange, type);
  }, [areaId, type, activePriceRange, apiBaseUrl]);

  // Get featured property (first active listing)
  const featuredProperty = activeListings.length > 0 ? activeListings[0] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading area profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchAreaData(areaId, activePriceRange, type)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!areaProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Area Not Found</div>
          <p className="text-gray-600 mb-4">The area profile "{areaId || filterValue}" does not exist or could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AreaHeader 
        areaProfile={areaProfile}
        activePriceRange={activePriceRange}
        onPriceRangeChange={setActivePriceRange}
      />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Dashboard 
          area={areaProfile.name}
          marketStats={marketStats}
          recentSales={recentSales}
          underContract={underContract}
          activeListings={activeListings}
          comingSoon={comingSoon}
          priceChanges={priceChanges}
        />
        
        {featuredProperty && (
          <FeaturedProperty property={featuredProperty} apiBaseUrl={apiBaseUrl} />
        )}
        
        <div className="mt-4 sm:mt-8 space-y-4 sm:space-y-8">
          <PropertyTable 
            title="Homes Sold in the Past 30 Days" 
            properties={recentSales}
            showSalePrice={true}
            area={areaProfile.name}
          />
          
          <PropertyTable 
            title="Homes Under Contract" 
            properties={underContract}
            showContractDate={true}
            area={areaProfile.name}
          />
          
          <PropertyTable 
            title="Active Listings" 
            properties={activeListings}
            showListPrice={true}
            area={areaProfile.name}
          />
          
          <PropertyTable 
            title="Coming Soon Listings" 
            properties={comingSoon}
            area={areaProfile.name}
          />
          
          <PropertyTable 
            title="Home Price Changes in the Past 30 Days" 
            properties={priceChanges}
            showPriceChange={true}
            area={areaProfile.name}
          />
        </div>
      </main>
    </>
  );
};

export default AreaProfile; 