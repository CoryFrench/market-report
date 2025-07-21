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
    
    // Add year built only for larger screens
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
  const columns = getColumns();

  if (safeProperties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500 text-center py-8">No properties found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
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
                {columns.map((column) => (
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
      <p className="text-xs text-gray-500 text-center mt-4">
        *** Listings from all brokers provided by Beaches MLS. This information is believed to be accurate but is not guaranteed ***
      </p>
    </div>
  );
}

export default PropertyTable; 