// Mock data matching the structure from the HTML reports
// This will be replaced with real database queries later

const mockProperties = {
  // Recently Sold Properties (Past 30 Days)
  recentSales: [
    {
      id: 1,
      mlsId: 'RX-11067574',
      address: '1100 E Indiantown Road #314',
      subdivision: 'PARK PLAZA APTS CONDO',
      bedrooms: 2,
      bathrooms: 2.0,
      hasPool: false,
      livingArea: 934,
      yearBuilt: 1973,
      waterfront: false,
      listPrice: 279900,
      soldPrice: 275000,
      soldDate: '2025-07-10',
      daysOnMarket: 15,
      priceReduction: 4900
    },
    {
      id: 2,
      mlsId: 'RX-11063622',
      address: '1605 S Us Highway 1 #5c',
      subdivision: 'SEA LOFTERS CONDO',
      bedrooms: 1,
      bathrooms: 1.0,
      hasPool: false,
      livingArea: 740,
      yearBuilt: 1980,
      waterfront: false,
      listPrice: 298000,
      soldPrice: 275000,
      soldDate: '2025-07-08',
      daysOnMarket: 22,
      priceReduction: 23000
    },
    {
      id: 3,
      mlsId: 'RX-11070069',
      address: '500 Uno Lago Drive #204',
      subdivision: 'OCEAN TRACE CONDO',
      bedrooms: 2,
      bathrooms: 2.0,
      hasPool: false,
      livingArea: 1192,
      yearBuilt: 1996,
      waterfront: false,
      listPrice: 365000,
      soldPrice: 340000,
      soldDate: '2025-07-05',
      daysOnMarket: 18,
      priceReduction: 25000
    }
  ],

  // Properties Under Contract
  underContract: [
    {
      id: 4,
      mlsId: 'A11734631',
      address: '1605 S Us Highway 1 M1 #106',
      subdivision: 'JUPITER OCEAN AND RACQUET',
      bedrooms: 1,
      bathrooms: 1.1,
      hasPool: false,
      livingArea: 720,
      yearBuilt: 1976,
      waterfront: false,
      listPrice: 245000,
      contractDate: '2025-07-14',
      daysOnMarket: 8
    },
    {
      id: 5,
      mlsId: 'RX-11104225',
      address: '1142 Keystone Drive #c',
      subdivision: 'KEYSTONE CONDO',
      bedrooms: 2,
      bathrooms: 2.0,
      hasPool: false,
      livingArea: 1178,
      yearBuilt: 1989,
      waterfront: false,
      listPrice: 279000,
      contractDate: '2025-07-12',
      daysOnMarket: 12
    }
  ],

  // Coming Soon Listings
  comingSoon: [
    {
      id: 6,
      mlsId: 'RX-11106014',
      address: '2535 25th Court',
      subdivision: 'River',
      bedrooms: 3,
      bathrooms: 2.0,
      hasPool: true,
      livingArea: 1850,
      yearBuilt: 1995,
      waterfront: true,
      estimatedListPrice: 750000,
      comingSoonDate: '2025-07-20'
    }
  ],

  // Active Listings
  activeListings: [
    {
      id: 7,
      mlsId: 'RX-11060284',
      address: '1210 Dolphin Road',
      subdivision: 'PALM BEACH ISLES',
      bedrooms: 3,
      bathrooms: 2.0,
      hasPool: false,
      livingArea: 1780,
      yearBuilt: 1968,
      waterfront: false,
      listPrice: 1100000,
      listDate: '2025-06-15',
      daysOnMarket: 30
    },
    {
      id: 8,
      mlsId: 'RX-11093347',
      address: '1131 Surf Rd',
      subdivision: 'YACHT HARBOR ESTATES',
      bedrooms: 2,
      bathrooms: 2.0,
      hasPool: true,
      livingArea: 1550,
      yearBuilt: 1953,
      waterfront: false,
      listPrice: 1139000,
      listDate: '2025-06-01',
      daysOnMarket: 45
    }
  ],

  // Price Changes (Past 30 Days)
  priceChanges: [
    {
      id: 9,
      mlsId: 'RX-11093347',
      address: '1131 Surf Rd',
      subdivision: 'YACHT HARBOR ESTATES',
      bedrooms: 2,
      bathrooms: 2.0,
      hasPool: true,
      livingArea: 1550,
      yearBuilt: 1953,
      waterfront: false,
      currentPrice: 1139000,
      previousPrice: 1150000,
      priceChange: -11000,
      changeDate: '2025-07-01',
      changeType: 'reduction'
    },
    {
      id: 10,
      mlsId: 'RX-11099490',
      address: '1130 Island Road',
      subdivision: 'PALM BEACH SHORES',
      bedrooms: 3,
      bathrooms: 2.0,
      hasPool: true,
      livingArea: 1724,
      yearBuilt: 1963,
      waterfront: false,
      currentPrice: 1199000,
      previousPrice: 1225000,
      priceChange: -26000,
      changeDate: '2025-07-03',
      changeType: 'reduction'
    }
  ]
};

// Market statistics
const mockMarketStats = {
  totalActiveListing: 156,
  totalSalesLast30Days: 28,
  averageDaysOnMarket: 22,
  averageSalePrice: 487500,
  inventoryLevel: 'normal', // low, normal, high
  marketVelocity: 'moderate', // slow, moderate, fast
  lastUpdated: new Date().toISOString()
};

// Market areas
const mockMarketAreas = [
  { id: 1, name: 'Jupiter', region: 'Jupiter' },
  { id: 2, name: 'Juno Beach', region: 'Juno Beach' },
  { id: 3, name: 'Singer Island', region: 'Singer Island' },
  { id: 4, name: 'Palm Beach Shores', region: 'Palm Beach Shores' }
];

module.exports = {
  mockProperties,
  mockMarketStats,
  mockMarketAreas
}; 