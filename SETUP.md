# Market Report Service Setup Guide

## Quick Start

1. **Environment Configuration**
   ```bash
   # Copy environment template
   cp backend/.env.example backend/.env
   
   # Edit backend/.env with your database credentials
   ```

2. **Database Setup**
   ```bash
   # Create the MLS database (run once)
   psql -h 10.0.2.221 -U postgres -c "CREATE DATABASE mls_database;"
   
   # Run the schema setup
   psql -h 10.0.2.221 -U postgres -d mls_database -f database/schema.sql
   ```

3. **Build and Deploy**
   ```bash
   # From the root directory
   docker-compose up -d market-report-backend market-report-frontend
   ```

## Service Access

- **Frontend**: https://services.waterfront-ai.com/market-report
- **Backend API**: https://services.waterfront-ai.com/market-report/api/
- **Direct Backend**: http://localhost:14700 (development)
- **Direct Frontend**: http://localhost:14750 (development)

## Environment Variables

### Backend (.env)

```env
# PostgreSQL Database Configuration
PG_HOST=10.0.2.221
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=Waterfront#1
PG_DATABASE=mls_database

# Server Configuration
PORT=3001
NODE_ENV=production
CORS_ORIGINS=https://services.waterfront-ai.com,http://localhost:3000

# WebSocket Configuration (optional)
WEBSOCKET_PORT=3002
```

## Docker Configuration

### Services Created
- `market-report-backend` (Port 14700)
- `market-report-frontend` (Port 14750)

### Container Names
- `market-report-backend-app`
- `market-report-frontend-app`

## Database Schema

The service expects a PostgreSQL database with the schema defined in `database/schema.sql`. Key tables:

- `market_areas` - Geographic market areas
- `properties` - Property master data
- `listings` - Current and historical listings
- `sales` - Closed sales data
- `price_history` - Price change tracking

## API Endpoints

- `GET /api/market/stats` - Market statistics
- `GET /api/market/recent-sales` - Recent sales (30 days)
- `GET /api/market/under-contract` - Under contract properties
- `GET /api/market/active-listings` - Active listings
- `GET /api/market/price-changes` - Price changes (30 days)
- `GET /api/properties/search` - Property search with filters
- `GET /api/properties/:id` - Property details

## Development

### Local Development
```bash
cd market-report
npm run dev
```

### Testing Database Connection
```bash
cd market-report/backend
node test-db-connection.js
```

### Debug Mode
Set `NODE_ENV=development` in backend/.env for detailed logging.

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PG_* environment variables
   - Ensure PostgreSQL is running on 10.0.2.221:5432
   - Verify database exists and schema is loaded

2. **Frontend Build Fails**
   - Check Node.js version (requires 18+)
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

3. **Reverse Proxy 502 Error**
   - Check if backend containers are running
   - Verify container names match docker-compose.yml
   - Check logs: `docker logs market-report-backend-app`

### Health Checks

- Backend: `curl http://localhost:14700/health`
- Frontend: `curl http://localhost:14750/health`
- Via Proxy: `curl https://services.waterfront-ai.com/market-report/api/market/stats`

## Monitoring

The service is integrated with Uptime Kuma monitoring at `/monitoring`. Health checks run every 30 seconds.

## Production Notes

- Frontend assets are cached for 1 year
- WebSocket support enabled for real-time updates
- CORS configured for production domain
- All containers restart automatically unless stopped 