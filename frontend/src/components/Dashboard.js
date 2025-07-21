import React from 'react';

const Dashboard = ({ area, marketStats, recentSales, underContract, activeListings, comingSoon, priceChanges }) => {
  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return num.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Market Overview - {area}
        </h2>
        <p className="text-sm text-gray-600">
          Current market statistics and trends
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Active Listings</h3>
          <p className="text-2xl font-bold text-blue-900">{formatNumber(marketStats.totalActiveListing || 0)}</p>
          <p className="text-xs text-blue-600 mt-1">Currently available</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 mb-2">Recent Sales</h3>
          <p className="text-2xl font-bold text-green-900">{formatNumber(marketStats.totalSalesLast30Days || 0)}</p>
          <p className="text-xs text-green-600 mt-1">Sold in past 30 days</p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-orange-800 mb-2">Under Contract</h3>
          <p className="text-2xl font-bold text-orange-900">{formatNumber(marketStats.totalUnderContract || 0)}</p>
          <p className="text-xs text-orange-600 mt-1">Pending sales</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800 mb-2">Coming Soon</h3>
          <p className="text-2xl font-bold text-purple-900">{formatNumber(marketStats.totalComingSoon || 0)}</p>
          <p className="text-xs text-purple-600 mt-1">Future listings</p>
        </div>
      </div>
      
      {marketStats && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-800 mb-2">Average List Price</h3>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(marketStats.averageListPrice)}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-800 mb-2">Average Sold Price</h3>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(marketStats.averageSoldPrice)}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-800 mb-2">Avg. Days on Market</h3>
            <p className="text-xl font-bold text-gray-900">{marketStats.averageDaysOnMarket || 'N/A'}</p>
          </div>
        </div>
      )}
      
      {marketStats.totalPriceChangesLast30Days > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Price Changes in the Past 30 Days</h3>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">{marketStats.totalPriceChangesLast30Days || 0}</span> properties have had price changes in the past 30 days
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 