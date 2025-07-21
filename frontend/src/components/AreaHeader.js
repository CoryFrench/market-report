import React from 'react';

const AreaHeader = ({ areaProfile, activePriceRange, onPriceRangeChange }) => {
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'under-500k', label: 'Under $500K' },
    { value: '500k-plus', label: '$500K+' },
    { value: '1m-plus', label: '$1M+' },
    { value: '3m-plus', label: '$3M+' },
    { value: '5m-plus', label: '$5M+' },
    { value: '10m-plus', label: '$10M+' }
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {areaProfile.name} Area Profile
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {areaProfile.description}
            </p>
          </div>
          
          <div className="flex items-center justify-center sm:justify-end space-x-2">
            <span className="text-sm font-medium text-gray-700">Price Range:</span>
            <select
              value={activePriceRange}
              onChange={(e) => onPriceRangeChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AreaHeader; 