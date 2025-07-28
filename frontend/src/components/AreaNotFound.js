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
          <p className="text-sm text-gray-500">
            Area profiles are dynamically generated from our database. Please check the URL format and try again.
          </p>
          <div className="text-sm text-gray-400">
            Expected format: /area-profile/type/area-name (e.g., /area-profile/city/jupiter, /area-profile/region/river)
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaNotFound; 