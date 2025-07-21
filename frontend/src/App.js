import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AreaProfile from './components/AreaProfile';
import AreaNotFound from './components/AreaNotFound';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ? process.env.REACT_APP_API_BASE_URL + '/api' : 'http://localhost:3001/api';

function App() {
  return (
    <Router basename="/area-profile">
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Default route - redirect to Jupiter as fallback */}
          <Route path="/" element={<Navigate to="/jupiter" replace />} />
          
          {/* Area profile routes */}
          <Route path="/:areaId" element={<AreaProfile apiBaseUrl={API_BASE_URL} />} />
          
          {/* 404 for invalid areas */}
          <Route path="*" element={<AreaNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 