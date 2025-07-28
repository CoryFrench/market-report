import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AreaProfile from './components/AreaProfile';
import AreaNotFound from './components/AreaNotFound';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ? process.env.REACT_APP_API_BASE_URL + '/api' : '/area-profile/api';

function App() {
  return (
    <Router basename="/area-profile">
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Default route - redirect to Jupiter as fallback */}
          <Route path="/" element={<Navigate to="/city/jupiter" replace />} />
          
          {/* Structured area profile routes with type prefixes */}
          <Route path="/city/:areaId" element={<AreaProfile apiBaseUrl={API_BASE_URL} />} />
          <Route path="/development/:areaId" element={<AreaProfile apiBaseUrl={API_BASE_URL} />} />
          <Route path="/subdivision/:areaId" element={<AreaProfile apiBaseUrl={API_BASE_URL} />} />
          <Route path="/zone/:areaId" element={<AreaProfile apiBaseUrl={API_BASE_URL} />} />
          <Route path="/region/:areaId" element={<AreaProfile apiBaseUrl={API_BASE_URL} />} />
          <Route path="/lifestyle/:areaId" element={<AreaProfile apiBaseUrl={API_BASE_URL} />} />
          
          {/* Legacy direct area ID routes - redirect to proper structured URLs */}
          <Route path="/jupiter" element={<Navigate to="/city/jupiter" replace />} />
          <Route path="/juno-beach" element={<Navigate to="/city/juno-beach" replace />} />
          <Route path="/singer-island" element={<Navigate to="/city/singer-island" replace />} />
          <Route path="/palm-beach-shores" element={<Navigate to="/city/palm-beach-shores" replace />} />
          <Route path="/admirals-cove" element={<Navigate to="/development/admirals-cove" replace />} />
          <Route path="/alicante" element={<Navigate to="/development/alicante" replace />} />
          <Route path="/harbour-ridge-yacht-club" element={<Navigate to="/development/harbour-ridge-yacht-club" replace />} />
          <Route path="/jupiter-yacht-club" element={<Navigate to="/development/jupiter-yacht-club" replace />} />
          <Route path="/jupiter-waterfront" element={<Navigate to="/lifestyle/jupiter-waterfront" replace />} />
          <Route path="/jupiter-luxury" element={<Navigate to="/lifestyle/jupiter-luxury" replace />} />
          <Route path="/singer-island-luxury" element={<Navigate to="/lifestyle/singer-island-luxury" replace />} />
          <Route path="/center-street-canals" element={<Navigate to="/zone/center-street-canals" replace />} />
          
          {/* 404 for invalid areas */}
          <Route path="*" element={<AreaNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 