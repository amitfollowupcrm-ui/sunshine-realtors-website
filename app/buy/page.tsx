// Buy Properties Page

import React from 'react';

async function fetchProperties(filters: any = {}) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://sunshine-realtors-website.vercel.app';
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.city) params.append('city', filters.city);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    params.append('limit', (filters.limit || 20).toString());
    params.append('page', (filters.page || 1).toString());

    const response = await fetch(`${baseUrl}/api/properties?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch properties:', response.statusText);
      return { properties: [], total: 0, page: 1, limit: 20, totalPages: 0 };
    }

    const data = await response.json();
    return data.success ? data : { properties: [], total: 0, page: 1, limit: 20, totalPages: 0 };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return { properties: [], total: 0, page: 1, limit: 20, totalPages: 0 };
  }
}

export default async function BuyPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Fetch properties from API
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const filters = {
    category: 'BUY',
    city: typeof searchParams.city === 'string' ? searchParams.city : undefined,
    minPrice: typeof searchParams.minPrice === 'string' ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: typeof searchParams.maxPrice === 'string' ? parseFloat(searchParams.maxPrice) : undefined,
    bedrooms: typeof searchParams.bedrooms === 'string' ? parseInt(searchParams.bedrooms) : undefined,
    page,
    limit: 20,
  };

  const { properties = [], total = 0, totalPages = 0 } = await fetchProperties(filters);

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
                <span className="text-gray-600">
                  Showing {properties.length} of {total} properties
                </span>
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
              {properties.length > 0 ? (
                properties.map((property: any) => (
                  <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-48 bg-gray-200">
                      {property.primaryImageUrl ? (
                        <img
                          src={property.primaryImageUrl}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {property.locality || property.city}, {property.state}
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-blue-600">
                          ₹{(property.price / 100000).toFixed(2)}L
                        </span>
                        {property.bedrooms && (
                          <span className="text-gray-600">{property.bedrooms} BHK</span>
                        )}
                      </div>
                      {property.builtUpArea && (
                        <p className="text-sm text-gray-500">{property.builtUpArea} sqft</p>
                      )}
                      <a
                        href={`/properties/${property.slug}`}
                        className="mt-3 block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <p>No properties found</p>
                  <p className="text-sm mt-2">Try adjusting your filters</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  <a
                    href={`/buy?page=${Math.max(1, page - 1)}`}
                    className={`px-4 py-2 border rounded-lg hover:bg-gray-50 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Previous
                  </a>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <a
                        key={pageNum}
                        href={`/buy?page=${pageNum}`}
                        className={`px-4 py-2 border rounded-lg hover:bg-gray-50 ${page === pageNum ? 'bg-blue-600 text-white' : ''}`}
                      >
                        {pageNum}
                      </a>
                    );
                  })}
                  <a
                    href={`/buy?page=${Math.min(totalPages, page + 1)}`}
                    className={`px-4 py-2 border rounded-lg hover:bg-gray-50 ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Next
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



