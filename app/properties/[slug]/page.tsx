// Property Detail Page

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { BuyerActionsClient } from '@/components/property/BuyerActionsClient';
import { InquiryForm } from '@/components/property/InquiryForm';
import { propertyService } from '@/lib/services/property.service';
import { notFound } from 'next/navigation';

interface PropertyDetailPageProps {
  params: {
    slug: string;
  };
}

// Required for static export
export async function generateStaticParams() {
  // Return at least one placeholder for static export
  // In production, you'd fetch all property slugs from your database
  return [{ slug: 'sample-property' }];
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  // Fetch property by slug
  const property = await propertyService.getPropertyBySlug(params.slug);

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Property Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/buy" className="hover:text-blue-600">Buy</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Property Details</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="relative h-96 bg-gray-200 rounded-t-lg overflow-hidden">
                {property.primaryImageUrl ? (
                  <Image
                    src={property.primaryImageUrl}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                )}
                {/* Image thumbnails will go here */}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <p className="text-gray-600 text-lg">
                    {property.locality ? `${property.locality}, ` : ''}
                    {property.city}, {property.state}
                  </p>
                </div>
                <div className="flex gap-2">
                  {property.isVerified && (
                    <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                      Verified
                    </span>
                  )}
                  {/* Buyer Actions will be rendered client-side */}
                  <BuyerActionsClient propertyId={property.id} />
                  <button className="p-2 border rounded-lg hover:bg-gray-50">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="border-b pb-6 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-600">
                    ₹{Number(property.price).toLocaleString('en-IN')}
                  </span>
                  {property.pricePerUnit && (
                    <span className="text-gray-500">
                      (₹{Number(property.pricePerUnit).toLocaleString('en-IN')}/sqft)
                    </span>
                  )}
                </div>
                {property.negotiable && (
                  <p className="text-sm text-gray-600 mt-1">Price is negotiable</p>
                )}
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.bedrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                )}
                {property.builtUpArea && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Number(property.builtUpArea).toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-gray-600">Sqft</div>
                  </div>
                )}
                {property.floorNumber && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{property.floorNumber}</div>
                    <div className="text-sm text-gray-600">Floor</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-3">Property Details</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Property Type</dt>
                      <dd className="font-medium">{property.propertyType}</dd>
                    </div>
                    {property.furnishingStatus && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Furnishing</dt>
                        <dd className="font-medium">{property.furnishingStatus.replace('_', ' ')}</dd>
                      </div>
                    )}
                    {property.builtUpArea && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Built-up Area</dt>
                        <dd className="font-medium">
                          {Number(property.builtUpArea).toLocaleString('en-IN')} {property.areaUnit || 'sqft'}
                        </dd>
                      </div>
                    )}
                    {property.carpetArea && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Carpet Area</dt>
                        <dd className="font-medium">
                          {Number(property.carpetArea).toLocaleString('en-IN')} {property.areaUnit || 'sqft'}
                        </dd>
                      </div>
                    )}
                    {property.facing && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Facing</dt>
                        <dd className="font-medium">{property.facing}</dd>
                      </div>
                    )}
                    {property.ageOfConstruction !== null && property.ageOfConstruction !== undefined && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Age of Construction</dt>
                        <dd className="font-medium">{property.ageOfConstruction} years</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Additional Details</h3>
                  <dl className="space-y-2">
                    {property.parking !== null && property.parking !== undefined && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Parking</dt>
                        <dd className="font-medium">{property.parking} {property.parking === 1 ? 'Space' : 'Spaces'}</dd>
                      </div>
                    )}
                    {property.powerBackup !== null && property.powerBackup !== undefined && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Power Backup</dt>
                        <dd className="font-medium">{property.powerBackup ? 'Yes' : 'No'}</dd>
                      </div>
                    )}
                    {property.waterSupply && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Water Supply</dt>
                        <dd className="font-medium">{property.waterSupply}</dd>
                      </div>
                    )}
                    {property.maintenanceCharges && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Maintenance</dt>
                        <dd className="font-medium">
                          ₹{Number(property.maintenanceCharges).toLocaleString('en-IN')}/month
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity) => (
                      <span key={amenity} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Location</h3>
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map will be displayed here</p>
                </div>
                <p className="mt-2 text-gray-600">
                  {property.addressLine1 && `${property.addressLine1}, `}
                  {property.locality && `${property.locality}, `}
                  {property.city}, {property.state}
                  {property.pincode && ` ${property.pincode}`}
                </p>
              </div>
            </div>

            {/* Similar Properties */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Similar Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Similar properties will be displayed here */}
                <div className="text-center py-8 text-gray-500 text-sm">
                  Similar properties will be shown here
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20 mb-6">
              <h3 className="text-lg font-semibold mb-4">Contact Owner</h3>
              <InquiryForm propertyId={property.id} propertyTitle={property.title} />
            </div>

            {/* Owner Info */}
            {property.owner && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Owner Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{property.owner.fullName}</p>
                  </div>
                  {property.owner.phone && (
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{property.owner.phone}</p>
                    </div>
                  )}
                  {property.owner.email && (
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{property.owner.email}</p>
                    </div>
                  )}
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



