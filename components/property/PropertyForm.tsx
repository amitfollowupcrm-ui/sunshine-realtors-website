// Property Form Component

'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useCreateProperty } from '@/lib/hooks/useProperties';

interface PropertyFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ onSuccess, onCancel }) => {
  const createProperty = useCreateProperty();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'BUY',
    propertyType: 'APARTMENT',
    state: '',
    city: '',
    locality: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createProperty.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        propertyType: formData.propertyType,
        location: {
          state: formData.state,
          city: formData.city,
          locality: formData.locality,
        },
        pricing: {
          price: parseFloat(formData.price),
        },
        details: {
          bedrooms: parseInt(formData.bedrooms) || undefined,
          bathrooms: parseInt(formData.bathrooms) || undefined,
          builtUpArea: parseFloat(formData.area) || undefined,
        },
        media: {
          imageUrls: [],
        },
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create property');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="BUY">Buy</option>
            <option value="RENT">Rent</option>
            <option value="COMMERCIAL">Commercial</option>
            <option value="PLOTS">Plots</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="State"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          required
        />
        <Input
          label="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        />
        <Input
          label="Locality"
          value={formData.locality}
          onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          label="Price (₹)"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <Input
          label="Bedrooms"
          type="number"
          value={formData.bedrooms}
          onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
        />
        <Input
          label="Bathrooms"
          type="number"
          value={formData.bathrooms}
          onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
        />
        <Input
          label="Area (sqft)"
          type="number"
          value={formData.area}
          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={createProperty.isPending}
        >
          Create Property
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};





