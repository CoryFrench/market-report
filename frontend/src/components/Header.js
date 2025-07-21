import React from 'react';

const Header = ({ cities, activeCity, onCityChange }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              MLS Market Report
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Real-time property market data and analytics
            </p>
          </div>
          
          <div className="flex items-center justify-center sm:justify-end space-x-2">
            <span className="text-sm font-medium text-gray-700">City:</span>
            <select
              value={activeCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[180px]"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 