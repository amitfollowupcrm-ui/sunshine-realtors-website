'use client';

import React from 'react';
import Link from 'next/link';
import { BuyerActions } from './BuyerActions';

interface PropertyCardClientProps {
  property: {
    id: string;
    title: string;
    slug: string;
    primaryImageUrl?: string;
    locality?: string;
    city?: string;
    state?: string;
    price: number;
    bedrooms?: number;
    builtUpArea?: number;
  };
}

export const PropertyCardClient: React.FC<PropertyCardClientProps> = ({ property }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
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
          <p className="text-sm text-gray-500 mb-3">{property.builtUpArea} sqft</p>
        )}
        <BuyerActions propertyId={property.id} />
        <Link
          href={`/properties/${property.slug}`}
          className="mt-3 block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

