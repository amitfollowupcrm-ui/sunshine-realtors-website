// Commercial Properties Page

import React from 'react';

export default function CommercialPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">Commercial Properties</h1>
          <p className="text-gray-600">
            Find shops, offices, warehouses, and commercial spaces
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">
            Commercial properties page structure ready
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Similar to buy page, fetch from /api/properties/search?category=COMMERCIAL
          </p>
        </div>
      </div>
    </div>
  );
}





