# Database Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# PostgreSQL Database Configuration
PG_HOST=localhost
PG_PORT=5432
PG_USER=your_username
PG_PASSWORD=your_password
PG_DATABASE=your_database_name

# Optional: Enable SSL for database connection
# PG_SSL=true

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

## Database Schema

The application expects:
- **Schema**: `mls`
- **Table**: `beaches_residential`

This table should contain your MLS data with the standard MLS fields including:
- `status` (Active, Closed, Active Under Contract, Pending, Coming Soon)
- `city` (Jupiter, Juno Beach, Singer Island, Palm Beach Shores)
- `list_price`, `sold_price`, `total_bedrooms`, `baths_total`
- `private_pool`, `waterfront`, `sqft_living`, `year_built`
- `listing_date`, `sold_date`, `under_contract_date`
- And many more MLS standard fields

## Area Filtering

The application maps frontend area names to database city names:
- `jupiter` → `Jupiter`
- `juno-beach` → `Juno Beach`
- `singer-island` → `Singer Island`
- `palm-beach-shores` → `Palm Beach Shores`

## Features

- **Real-time Updates**: WebSocket connections monitor for:
  - Market statistics changes (every 30 seconds)
  - New listings (every 2 minutes)
  - Price changes (every 5 minutes)

- **API Endpoints**:
  - `/api/market/stats` - Market statistics
  - `/api/market/recent-sales` - Recent sales (last 30 days)
  - `/api/market/under-contract` - Under contract properties
  - `/api/market/active-listings` - Active listings
  - `/api/market/price-changes` - Price changes (last 30 days)
  - `/api/properties/:id` - Individual property details
  - `/api/properties/search` - Property search with filters 