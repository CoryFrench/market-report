import React from 'react';

const AreaNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl text-gray-400 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Area Profile Not Found</h1>
        <p className="text-gray-600 mb-6 max-w-md">
          The area profile you're looking for doesn't exist. Please check the URL and try again.
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Available area profiles:</p>
          <div className="text-sm text-blue-600 space-x-4">
            <a href="/area-profile/jupiter" className="hover:underline">Jupiter</a>
            <a href="/area-profile/juno-beach" className="hover:underline">Juno Beach</a>
            <a href="/area-profile/singer-island" className="hover:underline">Singer Island</a>
            <a href="/area-profile/admirals-cove" className="hover:underline">Admirals Cove</a>
            <a href="/area-profile/center-street-canals" className="hover:underline">Center Street Canals</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaNotFound; 