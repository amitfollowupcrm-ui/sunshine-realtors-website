// Buy Properties Page

import React from 'react';
import { PropertyCard } from '@/components/property/PropertyCard';

export default async function BuyPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // In production, fetch from API
  // const properties = await fetchProperties({ category: 'BUY', ...searchParams });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">Properties for Sale</h1>
          <p className="text-gray-600">
            Find your perfect home from thousands of verified listings
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              
              {/* Budget Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Budget</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* BHK Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Bedrooms</label>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4, '5+'].map((bhk) => (
                    <button
                      key={bhk}
                      className="px-3 py-2 border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors"
                    >
                      {bhk} BHK
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Property Type</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>All Types</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Penthouse</option>
                  <option>Studio</option>
                </select>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">City</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>All Cities</option>
                  <option>Delhi</option>
                  <option>Gurgaon</option>
                  <option>Noida</option>
                  <option>Chandigarh</option>
                  <option>Ludhiana</option>
                </select>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Properties List */}
          <div className="lg:col-span-3">
            {/* Sort and View Options */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
              <div>
                <span className="text-gray-600">Showing results</span>
              </div>
              <select className="px-3 py-2 border rounded-lg">
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Area: High to Low</option>
              </select>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder - In production, map over properties */}
              <div className="col-span-full text-center py-12 text-gray-500">
                <p>Properties will be displayed here</p>
                <p className="text-sm mt-2">Connect to /api/properties/search?category=BUY to see properties</p>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Previous</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">2</button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">3</button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

