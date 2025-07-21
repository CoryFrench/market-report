import React from 'react';

function PropertyTable({ 
  title,
  properties = [], 
  showSalePrice = false,
  showContractDate = false,
  showListPrice = false,
  showPriceChange = false,
  area = 'Jupiter/Juno Beach' // Add area prop to determine base URL
}) {
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Generate property URL for active listings only
  const getPropertyUrl = (property) => {
    // Check if we have listing ID (RX-#######) for creating proper URL
    if (property.id) {
      // New format: https://waterfront-properties.com/listing/[lowercase-listing-id]
      return `https://waterfront-properties.com/listing/${property.id.toLowerCase()}`;
    }
    
    // Fallback - no URL if no listing ID
    return null;
  };

  // Check if property should have a clickable link (only active listings)
  const shouldHaveLink = (property) => {
    // Only show links for active listings, not closed/sold properties
    const status = property.status?.toLowerCase();
    return status === 'active' || status === 'coming soon' || status === 'active under contract' || status === 'pending';
  };

  // Determine columns based on the flags and area - prioritize most important columns
  const getColumns = () => {
    let baseColumns = ['address', 'subdivision', 'bedrooms', 'bathrooms'];
    
    // Add living area (always important)
    baseColumns.push('livingArea');
    
    // Add year built only for larger screens (hidden on mobile)
    baseColumns.push('yearBuilt');
    
    // Add waterfront column for Singer Island
    if (area === 'Singer Island') {
      baseColumns.push('waterfront');
    }
    
    // Add price-related columns based on flags
    if (showSalePrice) {
      baseColumns.push('listPrice', 'soldPrice');
    } else if (showContractDate) {
      baseColumns.push('listPrice');
    } else if (showListPrice) {
      baseColumns.push('listPrice');
    } else if (showPriceChange) {
      baseColumns.push('previousPrice', 'currentPrice');
    }
    
    return baseColumns;
  };

  // Get mobile-optimized columns (fewer columns for better mobile experience)
  const getMobileColumns = () => {
    let mobileColumns = ['address', 'bedrooms', 'bathrooms'];
    
    // Add price columns based on what we're showing
    if (showSalePrice) {
      mobileColumns.push('soldPrice');
    } else if (showContractDate) {
      mobileColumns.push('listPrice');
    } else if (showListPrice) {
      mobileColumns.push('listPrice');
    } else if (showPriceChange) {
      mobileColumns.push('currentPrice');
    }
    
    return mobileColumns;
  };

  // Get tablet-optimized columns (more than mobile, fewer than desktop)
  const getTabletColumns = () => {
    let tabletColumns = ['address', 'subdivision', 'bedrooms', 'bathrooms', 'livingArea'];
    
    // Add price columns based on what we're showing
    if (showSalePrice) {
      tabletColumns.push('listPrice', 'soldPrice');
    } else if (showContractDate) {
      tabletColumns.push('listPrice');
    } else if (showListPrice) {
      tabletColumns.push('listPrice');
    } else if (showPriceChange) {
      tabletColumns.push('previousPrice', 'currentPrice');
    }
    
    return tabletColumns;
  };

  const getColumnHeader = (column) => {
    const headers = {
      address: 'Address',
      subdivision: 'Subdivision',
      bedrooms: 'Beds',
      bathrooms: 'Baths',
      pool: 'Pool',
      livingArea: 'Sq Ft',
      yearBuilt: 'Year',
      waterfront: 'Water',
      listPrice: 'List Price',
      soldPrice: 'Sold Price',
      soldDate: 'Sold Date',
      contractDate: 'Contract Date',
      daysOnMarket: 'DOM',
      previousPrice: 'Prev Price',
      currentPrice: 'Current Price',
      priceChangeDate: 'Price Change Date'
    };
    return headers[column] || column;
  };

  const getCellValue = (property, column) => {
    switch (column) {
      case 'address':
        const propertyUrl = getPropertyUrl(property);
        const hasLink = shouldHaveLink(property) && propertyUrl;
        
        if (hasLink) {
          return (
            <a 
              href={propertyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
              style={{ color: '#006197' }}
            >
              {property.address || 'N/A'}
            </a>
          );
        } else {
          // No link for closed/sold properties or properties without MLS ID
          return (
            <span className="text-sm">
              {property.address || 'N/A'}
            </span>
          );
        }
      case 'subdivision':
        return (
          <span className="text-xs" title={property.subdivision}>
            {property.subdivision || 'N/A'}
          </span>
        );
      case 'bedrooms':
        return property.bedrooms || 'N/A';
      case 'bathrooms':
        return property.bathrooms || 'N/A';
      case 'pool':
        return property.hasPool ? 'Y' : 'N';
      case 'waterfront':
        return property.waterfront ? 'Y' : 'N';
      case 'livingArea':
        return property.livingArea ? property.livingArea.toLocaleString() : 'N/A';
      case 'yearBuilt':
        return property.yearBuilt || 'N/A';
      case 'listPrice':
        return (
          <span className="font-medium">
            {formatPrice(property.listPrice)}
          </span>
        );
      case 'soldPrice':
        return (
          <span className="font-medium">
            {formatPrice(property.soldPrice)}
          </span>
        );
      case 'currentPrice':
        return (
          <span className="font-medium">
            {formatPrice(property.currentPrice)}
          </span>
        );
      case 'previousPrice':
        return (
          <span className="font-medium">
            {formatPrice(property.previousPrice)}
          </span>
        );
      case 'soldDate':
        return formatDate(property.soldDate);
      case 'contractDate':
        return formatDate(property.contractDate);
      case 'priceChangeDate':
        return formatDate(property.priceChangeDate);
      case 'daysOnMarket':
        return property.daysOnMarket || 'N/A';
      default:
        return property[column] || 'N/A';
    }
  };

  // Ensure properties is always an array
  const safeProperties = Array.isArray(properties) ? properties : [];
  const desktopColumns = getColumns();
  const tabletColumns = getTabletColumns();
  const mobileColumns = getMobileColumns();

  if (safeProperties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500 text-center py-8">No properties found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{title}</h3>
      
      {/* Desktop Table - Hidden on tablet and mobile */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {desktopColumns.map((column) => (
                <th
                  key={column}
                  className={`px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column === 'address' ? 'min-w-[200px]' : ''
                  } ${
                    column === 'subdivision' ? 'min-w-[150px] max-w-[200px]' : ''
                  } ${
                    column.includes('Price') ? 'text-right min-w-[100px]' : ''
                  }`}
                >
                  {getColumnHeader(column)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {safeProperties.map((property, index) => (
              <tr key={`${property.id || 'prop'}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {desktopColumns.map((column) => (
                  <td
                    key={column}
                    className={`px-3 py-2 text-sm text-gray-900 ${
                      column === 'address' ? 'min-w-[200px]' : ''
                    } ${
                      column === 'subdivision' ? 'min-w-[150px] max-w-[200px] truncate' : ''
                    } ${
                      column.includes('Price') ? 'text-right font-medium' : ''
                    } ${
                      column === 'bedrooms' || column === 'bathrooms' || column === 'yearBuilt' || column === 'pool' || column === 'waterfront' ? 'text-center' : ''
                    }`}
                    title={column === 'subdivision' ? property.subdivision : ''}
                  >
                    {getCellValue(property, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet Table - Shown on tablet only */}
      <div className="hidden md:block xl:hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {tabletColumns.map((column) => (
                <th
                  key={column}
                  className={`px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column === 'address' ? 'min-w-[180px]' : ''
                  } ${
                    column === 'subdivision' ? 'min-w-[120px] max-w-[150px]' : ''
                  } ${
                    column.includes('Price') ? 'text-right min-w-[90px]' : ''
                  }`}
                >
                  {getColumnHeader(column)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {safeProperties.map((property, index) => (
              <tr key={`tablet-${property.id || 'prop'}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {tabletColumns.map((column) => (
                  <td
                    key={column}
                    className={`px-2 py-2 text-sm text-gray-900 ${
                      column === 'address' ? 'min-w-[180px]' : ''
                    } ${
                      column === 'subdivision' ? 'min-w-[120px] max-w-[150px] truncate' : ''
                    } ${
                      column.includes('Price') ? 'text-right font-medium' : ''
                    } ${
                      column === 'bedrooms' || column === 'bathrooms' || column === 'livingArea' ? 'text-center' : ''
                    }`}
                    title={column === 'subdivision' ? property.subdivision : ''}
                  >
                    {getCellValue(property, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Shown only on mobile */}
      <div className="md:hidden space-y-3">
        {safeProperties.map((property, index) => (
          <div key={`mobile-${property.id || 'prop'}-${index}`} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <div className="space-y-2">
              {/* Address - Always show */}
              <div className="font-medium text-sm">
                {getCellValue(property, 'address')}
              </div>
              
              {/* Subdivision - Always show if available */}
              {property.subdivision && (
                <div className="text-xs text-gray-600 truncate">
                  {property.subdivision}
                </div>
              )}
              
              {/* Property details row */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex space-x-4">
                  <span><strong>{property.bedrooms || 'N/A'}</strong> bed</span>
                  <span><strong>{property.bathrooms || 'N/A'}</strong> bath</span>
                  {property.livingArea && (
                    <span><strong>{property.livingArea.toLocaleString()}</strong> sq ft</span>
                  )}
                </div>
                
                {/* Price */}
                <div className="font-semibold text-right">
                  {showSalePrice && (
                    <div className="text-green-700">{formatPrice(property.soldPrice)}</div>
                  )}
                  {(showContractDate || showListPrice) && (
                    <div className="text-blue-700">{formatPrice(property.listPrice)}</div>
                  )}
                  {showPriceChange && (
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 line-through">
                        Was: {formatPrice(property.previousPrice)}
                      </div>
                      <div className="text-purple-700">
                        Now: {formatPrice(property.currentPrice)}
                      </div>
                      {property.previousPrice && property.currentPrice && (
                        <div className={`text-xs ${
                          property.currentPrice < property.previousPrice ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {property.currentPrice < property.previousPrice ? '↓' : '↑'} 
                          {formatPrice(Math.abs(property.currentPrice - property.previousPrice))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Additional info row for mobile */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div>
                  {property.yearBuilt && <span>Built {property.yearBuilt}</span>}
                  {property.hasPool && <span className="ml-2">• Pool</span>}
                  {property.waterfront && <span className="ml-2">• Waterfront</span>}
                </div>
                {property.daysOnMarket && (
                  <span>{property.daysOnMarket} DOM</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        *** Listings from all brokers provided by Beaches MLS. This information is believed to be accurate but is not guaranteed ***
      </p>
    </div>
  );
}

export default PropertyTable; 