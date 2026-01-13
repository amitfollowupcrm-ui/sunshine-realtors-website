'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PropertyPhotoUpload } from './PropertyPhotoUpload';
import { PropertyCategory, PropertyType } from '@/types/property.types';
import { useCreateProperty } from '@/lib/hooks/useProperties';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const createProperty = useCreateProperty();
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: '',
    state: '',
    locality: '',
    propertyType: PropertyType.APARTMENT,
    category: PropertyCategory.BUY,
    area: '',
    bedrooms: '',
    bathrooms: '',
    price: '',
    description: ''
  });
  
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        address: '',
        city: '',
        state: '',
        locality: '',
        propertyType: PropertyType.APARTMENT,
        category: PropertyCategory.BUY,
        area: '',
        bedrooms: '',
        bathrooms: '',
        price: '',
        description: ''
      });
      setPhotoUrls([]);
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare property data
      const propertyData = {
        title: formData.title || `${formData.propertyType} in ${formData.city}`,
        description: formData.description || `Beautiful ${formData.propertyType.toLowerCase()} located in ${formData.city}, ${formData.state}.`,
        category: formData.category,
        propertyType: formData.propertyType,
        location: {
          country: 'India',
          state: formData.state,
          city: formData.city,
          locality: formData.locality || undefined,
          addressLine1: formData.address
        },
        pricing: {
          price: parseFloat(formData.price),
          currency: 'INR'
        },
        details: {
          builtUpArea: formData.area ? parseFloat(formData.area) : undefined,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
          areaUnit: 'sqft' as const
        },
        media: {
          imageUrls: photoUrls,
          primaryImageUrl: photoUrls[0] || undefined
        }
      };

      await createProperty.mutateAsync(propertyData);
      
      alert('✅ Property added successfully!');
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error adding property:', error);
      alert(`❌ Failed to add property: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Property"
      size="xl"
      footer={
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Property'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              placeholder="e.g., Beautiful 3BHK Apartment"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : ''}`}
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value={PropertyCategory.BUY}>Buy</option>
              <option value={PropertyCategory.RENT}>Rent</option>
              <option value={PropertyCategory.COMMERCIAL}>Commercial</option>
              <option value={PropertyCategory.PLOTS}>Plots</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.propertyType}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
            >
              <option value={PropertyType.APARTMENT}>Apartment</option>
              <option value={PropertyType.VILLA}>Villa</option>
              <option value={PropertyType.PENTHOUSE}>Penthouse</option>
              <option value={PropertyType.STUDIO}>Studio</option>
              <option value={PropertyType.SHOP}>Shop</option>
              <option value={PropertyType.OFFICE}>Office</option>
              <option value={PropertyType.WAREHOUSE}>Warehouse</option>
              <option value={PropertyType.SHOWROOM}>Showroom</option>
              <option value={PropertyType.PLOT}>Plot</option>
              <option value={PropertyType.FARMLAND}>Farmland</option>
            </select>
          </div>

          <div>
            <Input
              label="Price (₹)"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              error={errors.price}
              placeholder="e.g., 5000000"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={errors.address}
              placeholder="Street address"
              required
            />
          </div>
          <div>
            <Input
              label="Locality"
              value={formData.locality}
              onChange={(e) => handleInputChange('locality', e.target.value)}
              placeholder="e.g., Sector 15"
            />
          </div>
          <div>
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              error={errors.city}
              placeholder="e.g., Noida"
              required
            />
          </div>
          <div>
            <Input
              label="State"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              error={errors.state}
              placeholder="e.g., Uttar Pradesh"
              required
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              label="Area (sqft)"
              type="number"
              value={formData.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              placeholder="e.g., 1200"
            />
          </div>
          <div>
            <Input
              label="Bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={(e) => handleInputChange('bedrooms', e.target.value)}
              placeholder="e.g., 3"
            />
          </div>
          <div>
            <Input
              label="Bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={(e) => handleInputChange('bathrooms', e.target.value)}
              placeholder="e.g., 2"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the property..."
          />
        </div>

        {/* Photo Upload */}
        <PropertyPhotoUpload
          onUploadComplete={setPhotoUrls}
          existingPhotos={photoUrls}
          maxPhotos={10}
        />
      </form>
    </Modal>
  );
};
