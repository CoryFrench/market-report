# Real-time MLS Market Reports Dashboard

A modern, real-time replacement for static HTML market reports. This application transforms traditional monthly market reports into a live, interactive dashboard with WebSocket-powered updates.

## 🚀 Features

- **Real-time Updates**: Live property data via WebSocket connections
- **Interactive Dashboard**: Modern replacement for static HTML reports
- **Market Analytics**: Live market statistics and trends
- **Property Search**: Advanced filtering and search capabilities
- **Mobile Responsive**: Works on all devices
- **Area Filtering**: Filter by specific market areas (Jupiter, Juno Beach, Singer Island, etc.)
- **Custom Alerts**: Get notified of new listings and price changes
- **Historical Data**: Track price changes and market trends

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │   Node.js API   │    │   PostgreSQL    │
│                 │    │                 │    │                 │
│  • Dashboard    │◄──►│  • REST API     │◄──►│  • Property Data│
│  • Real-time UI │    │  • WebSocket    │    │  • Market Stats │
│  • Filters      │    │  • Mock Data    │    │  • Price History│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Current State

This is a **functional skeleton** with:
- ✅ Complete project structure
- ✅ Backend API with mock data
- ✅ WebSocket real-time updates
- ✅ React frontend with responsive design
- ✅ Property tables matching original HTML format
- ✅ Market statistics dashboard
- ✅ Area filtering
- ✅ Alert system

**Next Steps**: Connect to your PostgreSQL database and MLS data source.

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd realtime-mls-reports
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `backend/.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   
   # Database (configure these)
   DATABASE_URL=postgresql://username:password@localhost:5432/mls_db
   
   # MLS API (configure these)
   MLS_API_KEY=your_mls_api_key
   MLS_API_URL=https://api.mls.com
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This starts both:
   - Backend API on http://localhost:5000
   - Frontend on http://localhost:3000

## 📊 Data Structure

The application expects data in this format (currently using mock data):

```javascript
{
  // Property structure
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
  daysOnMarket: 15
}
```

## 🔌 API Endpoints

### Market Data
- `GET /api/market/stats` - Overall market statistics
- `GET /api/market/recent-sales` - Recently sold properties
- `GET /api/market/under-contract` - Properties under contract
- `GET /api/market/active-listings` - Active listings
- `GET /api/market/price-changes` - Recent price changes

### Property Search
- `GET /api/properties/search` - Search properties with filters
- `GET /api/properties/:id` - Get specific property details

### WebSocket Events
- `market-stats` - Real-time market statistics
- `new-listing` - New property listings
- `price-change` - Price change notifications
- `alert-match` - Custom alert matches

## 🎨 Components

### Frontend Structure
```
frontend/src/
├── components/
│   ├── Dashboard.js          # Main dashboard
│   ├── PropertyTable.js      # Property data tables
│   ├── MarketStatsCard.js    # Market statistics
│   ├── Header.js             # Navigation header
│   ├── Navigation.js         # Area filtering
│   ├── FeaturedProperty.js   # Featured property display
│   ├── PropertySearch.js     # Search functionality
│   └── MarketStats.js        # Analytics page
├── App.js                    # Main application
└── index.js                  # Entry point
```

### Backend Structure
```
backend/src/
├── routes/
│   ├── market.js             # Market data routes
│   └── properties.js         # Property routes
├── data/
│   └── mockData.js           # Mock data (replace with DB)
├── services/
│   └── websocket.js          # WebSocket handling
└── server.js                 # Main server
```

## 🔄 Real-time Features

The application simulates real-time updates every:
- **30 seconds**: Market statistics updates
- **2 minutes**: New listing notifications
- **5 minutes**: Price change alerts

## 🚀 Deployment

### Environment Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Replace mock data with database connections
4. Deploy to your preferred platform (AWS, Heroku, etc.)

### Production Considerations
- Set up proper database connections
- Configure MLS API integration
- Implement proper error handling
- Add authentication if needed
- Set up monitoring and logging

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices
- Progressive Web App (PWA) ready

## 🔧 Next Steps

1. **Database Integration**
   - Connect to your PostgreSQL database
   - Replace mock data with real queries
   - Set up data migrations

2. **MLS Integration**
   - Connect to your MLS data source
   - Implement real-time data fetching
   - Set up data synchronization

3. **Advanced Features**
   - Add user authentication
   - Implement saved searches
   - Add property image galleries
   - Create email notifications

4. **Performance Optimization**
   - Add caching layers
   - Implement data pagination
   - Optimize WebSocket connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.

---

**Built with**: React, Node.js, Express, Socket.io, PostgreSQL, Tailwind CSS 