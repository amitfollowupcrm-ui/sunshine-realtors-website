// Property Card component

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PropertyCardProps {
  id: string;
  slug: string;
  title: string;
  city: string;
  locality?: string;
  price: number;
  pricePerUnit?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: string;
  primaryImageUrl?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  category: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  slug,
  title,
  city,
  locality,
  price,
  pricePerUnit,
  bedrooms,
  bathrooms,
  area,
  areaUnit = 'sqft',
  primaryImageUrl,
  isVerified,
  isFeatured,
  category,
}) => {
  const formatPrice = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <Link href={`/properties/${slug}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
        {/* Image */}
        <div className="relative h-48 w-full bg-gray-200">
          {primaryImageUrl ? (
            <img
              src={primaryImageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            {isVerified && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Verified
              </span>
            )}
            {isFeatured && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
          </div>

          {/* Category badge */}
          <div className="absolute top-2 right-2">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3">
            {locality ? `${locality}, ` : ''}{city}
          </p>

          {/* Price */}
          <div className="mb-3">
            <p className="text-2xl font-bold text-blue-600">{formatPrice(price)}</p>
            {pricePerUnit && (
              <p className="text-sm text-gray-500">₹{pricePerUnit.toLocaleString('en-IN')} / {areaUnit}</p>
            )}
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {bedrooms && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {bedrooms} BHK
              </span>
            )}
            {bathrooms && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                {bathrooms} Bath
              </span>
            )}
            {area && (
              <span>
                {area.toLocaleString('en-IN')} {areaUnit}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};



