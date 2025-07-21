import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import FeaturedProperty from './components/FeaturedProperty';
import PropertyTable from './components/PropertyTable';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

function App() {
  const [activeArea, setActiveArea] = useState('Jupiter');
  const [marketStats, setMarketStats] = useState({});
  const [recentSales, setRecentSales] = useState([]);
  const [underContract, setUnderContract] = useState([]);
  const [activeListings, setActiveListings] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [priceChanges, setPriceChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Areas configuration
  const areas = [
    'Jupiter',
    'Juno Beach', 
    'Singer Island'
  ];

  // Fetch all data for the selected area
  const fetchData = async (area) => {
    try {
      setLoading(true);
      setError(null);
      
      const areaParam = area; // Use the area directly
      
      // Fetch all data in parallel
      const [
        statsResponse,
        salesResponse,
        contractResponse,
        listingsResponse,
        comingSoonResponse,
        priceChangesResponse
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/market/stats?area=${areaParam}`),
        fetch(`${API_BASE_URL}/market/recent-sales?area=${areaParam}&limit=50`),
        fetch(`${API_BASE_URL}/market/under-contract?area=${areaParam}&limit=50`),
        fetch(`${API_BASE_URL}/market/active-listings?area=${areaParam}&limit=50`),
        fetch(`${API_BASE_URL}/market/coming-soon?area=${areaParam}&limit=50`),
        fetch(`${API_BASE_URL}/market/price-changes?area=${areaParam}&limit=50`)
      ]);

      // Check if all requests were successful
      if (!statsResponse.ok || !salesResponse.ok || !contractResponse.ok || 
          !listingsResponse.ok || !comingSoonResponse.ok || !priceChangesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      // Parse all responses
      const stats = await statsResponse.json();
      const sales = await salesResponse.json();
      const contracts = await contractResponse.json();
      const listings = await listingsResponse.json();
      const comingSoonData = await comingSoonResponse.json();
      const priceChangesData = await priceChangesResponse.json();

      // Update state
      setMarketStats(stats);
      setRecentSales(sales);
      setUnderContract(contracts);
      setActiveListings(listings);
      setComingSoon(comingSoonData);
      setPriceChanges(priceChangesData);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load market data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or area changes
  useEffect(() => {
    fetchData(activeArea);
  }, [activeArea]);

  // Get featured property (first active listing)
  const featuredProperty = activeListings.length > 0 ? activeListings[0] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading market data...</p>
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
            onClick={() => fetchData(activeArea)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        areas={areas}
        activeArea={activeArea}
        onAreaChange={setActiveArea}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Dashboard 
          area={activeArea}
          marketStats={marketStats}
          recentSales={recentSales}
          underContract={underContract}
          activeListings={activeListings}
          comingSoon={comingSoon}
          priceChanges={priceChanges}
        />
        
        {featuredProperty && (
          <FeaturedProperty property={featuredProperty} />
        )}
        
        <div className="mt-8 space-y-8">
          <PropertyTable 
            title="Homes Sold in the Past 30 Days" 
            properties={recentSales}
            showSalePrice={true}
            area={activeArea}
          />
          
          <PropertyTable 
            title="Homes Under Contract" 
            properties={underContract}
            showContractDate={true}
            area={activeArea}
          />
          
          <PropertyTable 
            title="Active Listings" 
            properties={activeListings}
            showListPrice={true}
            area={activeArea}
          />
          
          <PropertyTable 
            title="Coming Soon Listings" 
            properties={comingSoon}
            area={activeArea}
          />
          
          <PropertyTable 
            title="Home Price Changes in the Past 30 Days" 
            properties={priceChanges}
            showPriceChange={true}
            area={activeArea}
          />
        </div>
      </main>
    </div>
  );
}

export default App; 