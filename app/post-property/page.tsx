'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { MediaUpload } from '@/components/property/MediaUpload';
import { PropertyCategory, PropertyType, FurnishingStatus, PossessionStatus } from '@/types/property.types';

const STEPS = [
  { id: 1, title: 'Basic Information', description: 'Title, category, and type' },
  { id: 2, title: 'Location', description: 'Address and location details' },
  { id: 3, title: 'Pricing', description: 'Price and related costs' },
  { id: 4, title: 'Property Details', description: 'Size, rooms, and features' },
  { id: 5, title: 'Media', description: 'Photos and videos' },
  { id: 6, title: 'Additional Info', description: 'Amenities and other details' },
];

export default function PostPropertyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    title: '',
    description: '',
    category: PropertyCategory.BUY,
    propertyType: PropertyType.APARTMENT,
    subType: '',

    // Step 2: Location
    country: 'India',
    state: '',
    city: '',
    locality: '',
    sector: '',
    zone: '',
    pincode: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',

    // Step 3: Pricing
    price: '',
    pricePerUnit: '',
    currency: 'INR',
    negotiable: false,
    maintenanceCharges: '',
    securityDeposit: '',

    // Step 4: Property Details
    builtUpArea: '',
    carpetArea: '',
    plotArea: '',
    areaUnit: 'sqft',
    bedrooms: '',
    bathrooms: '',
    balconies: '',
    floors: '',
    floorNumber: '',
    ageOfConstruction: '',
    facing: '',
    furnishingStatus: FurnishingStatus.UNFURNISHED,
    parking: '0',
    powerBackup: false,
    waterSupply: '',

    // Step 5: Media
    primaryImageUrl: '',
    imageUrls: [] as string[],
    videoUrls: [] as string[],
    floorPlanUrls: [] as string[],
    virtualTourUrl: '',

    // Step 6: Additional
    possessionStatus: PossessionStatus.READY_TO_MOVE,
    availableFrom: '',
    constructionYear: '',
    amenities: [] as string[],
  });

  const [amenitiesList, setAmenitiesList] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/post-property');
    }
  }, [user, authLoading, router]);

  const amenitiesOptions = [
    'Gym', 'Swimming Pool', 'Park', 'Security', 'Elevator', 'Clubhouse',
    'Power Backup', 'Car Parking', 'Garden', 'Playground', 'Shopping Mall',
    'Hospital', 'School', 'Metro Station', 'Highway', 'Airport',
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setAmenitiesList((prev) => {
      if (prev.includes(amenity)) {
        return prev.filter((a) => a !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.title || formData.title.length < 10) {
          setError('Title must be at least 10 characters');
          return false;
        }
        if (!formData.description || formData.description.length < 50) {
          setError('Description must be at least 50 characters');
          return false;
        }
        break;
      case 2:
        if (!formData.state || !formData.city) {
          setError('State and city are required');
          return false;
        }
        break;
      case 3:
        if (!formData.price || parseFloat(formData.price) <= 0) {
          setError('Price is required and must be greater than 0');
          return false;
        }
        break;
      case 4:
        // Basic validation - at least one area field
        if (!formData.builtUpArea && !formData.carpetArea && !formData.plotArea) {
          setError('At least one area field is required');
          return false;
        }
        break;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');

      // Prepare data according to API schema
      const propertyData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        propertyType: formData.propertyType,
        subType: formData.subType || undefined,
        location: {
          country: formData.country,
          state: formData.state,
          city: formData.city,
          locality: formData.locality || undefined,
          sector: formData.sector || undefined,
          zone: formData.zone || undefined,
          pincode: formData.pincode || undefined,
          addressLine1: formData.addressLine1 || undefined,
          addressLine2: formData.addressLine2 || undefined,
          landmark: formData.landmark || undefined,
        },
        pricing: {
          price: parseFloat(formData.price),
          pricePerUnit: formData.pricePerUnit ? parseFloat(formData.pricePerUnit) : undefined,
          currency: formData.currency,
          negotiable: formData.negotiable,
          maintenanceCharges: formData.maintenanceCharges ? parseFloat(formData.maintenanceCharges) : undefined,
          securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : undefined,
        },
        details: {
          builtUpArea: formData.builtUpArea ? parseFloat(formData.builtUpArea) : undefined,
          carpetArea: formData.carpetArea ? parseFloat(formData.carpetArea) : undefined,
          plotArea: formData.plotArea ? parseFloat(formData.plotArea) : undefined,
          areaUnit: formData.areaUnit,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
          balconies: formData.balconies ? parseInt(formData.balconies) : undefined,
          floors: formData.floors ? parseInt(formData.floors) : undefined,
          floorNumber: formData.floorNumber ? parseInt(formData.floorNumber) : undefined,
          ageOfConstruction: formData.ageOfConstruction ? parseInt(formData.ageOfConstruction) : undefined,
          facing: formData.facing || undefined,
          furnishingStatus: formData.furnishingStatus,
          parking: parseInt(formData.parking),
          powerBackup: formData.powerBackup,
          waterSupply: formData.waterSupply || undefined,
          amenities: amenitiesList,
        },
        possessionStatus: formData.possessionStatus,
        availableFrom: formData.availableFrom || undefined,
        constructionYear: formData.constructionYear ? parseInt(formData.constructionYear) : undefined,
        media: {
          primaryImageUrl: formData.primaryImageUrl || formData.imageUrls[0] || undefined,
          imageUrls: formData.imageUrls,
          videoUrls: formData.videoUrls,
          floorPlanUrls: formData.floorPlanUrls,
          virtualTourUrl: formData.virtualTourUrl || undefined,
        },
      };

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(propertyData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create property');
      }

      // Success - redirect to dashboard (property list)
      router.push('/dashboard/properties');
    } catch (err: any) {
      setError(err.message || 'Failed to submit property. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-2">Post Your Property</h1>
          <p className="text-gray-600 mb-8">Fill in the details below to list your property</p>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        currentStep >= step.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step.id}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-sm font-medium text-gray-900">{step.title}</div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${
                        currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Form Steps */}
          <div className="mb-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., 2 BHK Apartment in Dwarka"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    placeholder="Describe your property in detail..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.values(PropertyCategory).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => handleInputChange('propertyType', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.values(PropertyType).map((type) => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Locality</label>
                    <input
                      type="text"
                      value={formData.locality}
                      onChange={(e) => handleInputChange('locality', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                    <input
                      type="text"
                      value={formData.sector}
                      onChange={(e) => handleInputChange('sector', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => handleInputChange('landmark', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Pricing */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per sqft (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.pricePerUnit}
                    onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="negotiable"
                    checked={formData.negotiable}
                    onChange={(e) => handleInputChange('negotiable', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="negotiable" className="text-sm font-medium text-gray-700">
                    Price is negotiable
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maintenance Charges (₹/month)
                    </label>
                    <input
                      type="number"
                      value={formData.maintenanceCharges}
                      onChange={(e) => handleInputChange('maintenanceCharges', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Security Deposit (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.securityDeposit}
                      onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Property Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Built-up Area
                    </label>
                    <input
                      type="number"
                      value={formData.builtUpArea}
                      onChange={(e) => handleInputChange('builtUpArea', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carpet Area
                    </label>
                    <input
                      type="number"
                      value={formData.carpetArea}
                      onChange={(e) => handleInputChange('carpetArea', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area Unit</label>
                    <select
                      value={formData.areaUnit}
                      onChange={(e) => handleInputChange('areaUnit', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="sqft">Square Feet</option>
                      <option value="sqmt">Square Meter</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parking</label>
                    <input
                      type="number"
                      value={formData.parking}
                      onChange={(e) => handleInputChange('parking', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Floor Number</label>
                    <input
                      type="number"
                      value={formData.floorNumber}
                      onChange={(e) => handleInputChange('floorNumber', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Furnishing Status
                    </label>
                    <select
                      value={formData.furnishingStatus}
                      onChange={(e) => handleInputChange('furnishingStatus', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      {Object.values(FurnishingStatus).map((status) => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facing</label>
                    <input
                      type="text"
                      value={formData.facing}
                      onChange={(e) => handleInputChange('facing', e.target.value)}
                      placeholder="e.g., North, East"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age of Construction (years)
                    </label>
                    <input
                      type="number"
                      value={formData.ageOfConstruction}
                      onChange={(e) => handleInputChange('ageOfConstruction', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="powerBackup"
                    checked={formData.powerBackup}
                    onChange={(e) => handleInputChange('powerBackup', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="powerBackup" className="text-sm font-medium text-gray-700">
                    Power Backup Available
                  </label>
                </div>
              </div>
            )}

            {/* Step 5: Media */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Property Images</h3>
                  <MediaUpload
                    type="image"
                    maxFiles={20}
                    onUploadComplete={(urls) => {
                      handleInputChange('imageUrls', urls);
                      if (urls.length > 0 && !formData.primaryImageUrl) {
                        handleInputChange('primaryImageUrl', urls[0]);
                      }
                    }}
                    existingUrls={formData.imageUrls}
                    label="Upload property images"
                  />
                  {formData.imageUrls.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Image (First image will be used as primary)
                      </label>
                      <select
                        value={formData.primaryImageUrl}
                        onChange={(e) => handleInputChange('primaryImageUrl', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        {formData.imageUrls.map((url, index) => (
                          <option key={index} value={url}>
                            Image {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Property Videos</h3>
                  <MediaUpload
                    type="video"
                    maxFiles={5}
                    onUploadComplete={(urls) => handleInputChange('videoUrls', urls)}
                    existingUrls={formData.videoUrls}
                    label="Upload property videos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Virtual Tour URL (YouTube, Vimeo, etc.)
                  </label>
                  <input
                    type="url"
                    value={formData.virtualTourUrl}
                    onChange={(e) => handleInputChange('virtualTourUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Additional Info */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Possession Status
                  </label>
                  <select
                    value={formData.possessionStatus}
                    onChange={(e) => handleInputChange('possessionStatus', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    {Object.values(PossessionStatus).map((status) => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available From
                    </label>
                    <input
                      type="date"
                      value={formData.availableFrom}
                      onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Construction Year
                    </label>
                    <input
                      type="number"
                      value={formData.constructionYear}
                      onChange={(e) => handleInputChange('constructionYear', e.target.value)}
                      min="1900"
                      max={new Date().getFullYear() + 5}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {amenitiesOptions.map((amenity) => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={amenitiesList.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < STEPS.length ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Property'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
