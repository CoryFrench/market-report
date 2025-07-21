import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import FeaturedProperty from './components/FeaturedProperty';
import PropertyTable from './components/PropertyTable';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ? process.env.REACT_APP_API_BASE_URL + '/api' : 'http://localhost:3001/api';

function App() {
  const [activeCity, setActiveCity] = useState('Jupiter');
  const [cities, setCities] = useState([]);
  const [marketStats, setMarketStats] = useState({});
  const [recentSales, setRecentSales] = useState([]);
  const [underContract, setUnderContract] = useState([]);
  const [activeListings, setActiveListings] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [priceChanges, setPriceChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch available cities from the API
  const fetchCities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cities`);
      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }
      const citiesData = await response.json();
      
      // Extract city names from the response
      const cityNames = citiesData.map(city => city.name);
      setCities(cityNames);
      
      // Set default city if not already set or if current city is not in the list
      if (!activeCity || !cityNames.includes(activeCity)) {
        if (cityNames.length > 0) {
          setActiveCity(cityNames[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      // Fallback to hardcoded cities if API fails
      const fallbackCities = ['Jupiter', 'Juno Beach', 'Singer Island', 'Palm Beach Shores'];
      setCities(fallbackCities);
      if (!activeCity || !fallbackCities.includes(activeCity)) {
        setActiveCity(fallbackCities[0]);
      }
    }
  };

  // Fetch all data for the selected city
  const fetchData = async (city) => {
    try {
      setLoading(true);
      setError(null);
      
      const cityParam = city; // Use the city directly
      
      // Fetch all data in parallel
      const [
        statsResponse,
        salesResponse,
        contractResponse,
        listingsResponse,
        comingSoonResponse,
        priceChangesResponse
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/market/stats?city=${cityParam}`),
        fetch(`${API_BASE_URL}/market/recent-sales?city=${cityParam}&limit=50`),
        fetch(`${API_BASE_URL}/market/under-contract?city=${cityParam}&limit=50`),
        fetch(`${API_BASE_URL}/market/active-listings?city=${cityParam}&limit=50`),
        fetch(`${API_BASE_URL}/market/coming-soon?city=${cityParam}&limit=50`),
        fetch(`${API_BASE_URL}/market/price-changes?city=${cityParam}&limit=50`)
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

  // Initial load - fetch cities first, then data
  useEffect(() => {
    fetchCities();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch data when activeCity changes (but only if we have cities loaded)
  useEffect(() => {
    if (activeCity && cities.length > 0) {
      fetchData(activeCity);
    }
  }, [activeCity, cities]);

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
            onClick={() => fetchData(activeCity)}
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
        cities={cities}
        activeCity={activeCity}
        onCityChange={setActiveCity}
      />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Dashboard 
          area={activeCity}
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
        
        <div className="mt-4 sm:mt-8 space-y-4 sm:space-y-8">
          <PropertyTable 
            title="Homes Sold in the Past 30 Days" 
            properties={recentSales}
            showSalePrice={true}
            area={activeCity}
          />
          
          <PropertyTable 
            title="Homes Under Contract" 
            properties={underContract}
            showContractDate={true}
            area={activeCity}
          />
          
          <PropertyTable 
            title="Active Listings" 
            properties={activeListings}
            showListPrice={true}
            area={activeCity}
          />
          
          <PropertyTable 
            title="Coming Soon Listings" 
            properties={comingSoon}
            area={activeCity}
          />
          
          <PropertyTable 
            title="Home Price Changes in the Past 30 Days" 
            properties={priceChanges}
            showPriceChange={true}
            area={activeCity}
          />
        </div>
      </main>
    </div>
  );
}

export default App; 