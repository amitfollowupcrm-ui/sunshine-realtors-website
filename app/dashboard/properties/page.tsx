'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useProperties } from '@/lib/hooks/useProperties';
import Link from 'next/link';
import { AddPropertyModal } from '@/components/property/AddPropertyModal';

export default function DashboardPropertiesPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const { data: propertiesData, isLoading, error, refetch } = useProperties({
    page,
    limit: 20,
    myProperties: true, // Show only user's own properties
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const properties = propertiesData?.properties || [];
  const totalPages = propertiesData?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Properties</h1>
              <p className="text-gray-600">Manage your property listings</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsAddPropertyModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                + Add Property
              </button>
              <Link href="/post-property">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  Full Form
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  ← Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading properties. Please try again.</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first property listing.</p>
            <Link href="/post-property">
              <button className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Add Your First Property
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any) => (
              <Link key={property.id} href={`/properties/${property.slug || property.id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                  {property.media?.primaryImageUrl ? (
                    <img
                      src={property.media.primaryImageUrl}
                      alt={property.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{property.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {property.location?.locality || property.locality}, {property.location?.city || property.city}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-blue-600">
                        ₹{(property.pricing?.price || property.price || 0).toLocaleString('en-IN')}
                      </span>
                      {property.details?.bedrooms && (
                        <span className="text-sm text-gray-600">
                          {property.details.bedrooms} BHK
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        property.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        property.status === 'PENDING_VERIFICATION' ? 'bg-yellow-100 text-yellow-800' :
                        property.status === 'SOLD' || property.status === 'RENTED' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status}
                      </span>
                      {property.details?.builtUpArea && (
                        <span className="text-sm text-gray-600">
                          {property.details.builtUpArea} {property.details.areaUnit || 'sqft'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={isAddPropertyModalOpen}
        onClose={() => setIsAddPropertyModalOpen(false)}
        onSuccess={() => {
          setIsAddPropertyModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
