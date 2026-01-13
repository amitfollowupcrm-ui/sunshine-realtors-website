// React hooks for property operations

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Property, PropertySearchFilters, PropertySearchResult } from '@/types/property.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Fetch properties
export function useProperties(filters: PropertySearchFilters & { myProperties?: boolean }) {
  return useQuery<PropertySearchResult>({
    queryKey: ['properties', 'search', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.myProperties) {
        params.append('myProperties', 'true');
      }
      if (filters.category) {
        params.append('category', filters.category.join(','));
      }
      if (filters.propertyType) {
        params.append('propertyType', filters.propertyType.join(','));
      }
      if (filters.city) {
        params.append('city', filters.city.join(','));
      }
      if (filters.locality) {
        params.append('locality', filters.locality.join(','));
      }
      if (filters.priceMin !== undefined) {
        params.append('priceMin', filters.priceMin.toString());
      }
      if (filters.priceMax !== undefined) {
        params.append('priceMax', filters.priceMax.toString());
      }
      if (filters.bedrooms) {
        params.append('bedrooms', filters.bedrooms.join(','));
      }
      if (filters.bathrooms) {
        params.append('bathrooms', filters.bathrooms.join(','));
      }
      if (filters.sortBy) {
        params.append('sortBy', filters.sortBy);
      }
      params.append('page', (filters.page || 1).toString());
      params.append('limit', (filters.limit || 20).toString());

      const response = await fetch(`${API_BASE_URL}/properties?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch single property
export function useProperty(id: string) {
  return useQuery<Property>({
    queryKey: ['properties', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!id,
  });
}

// Create property mutation
export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyData: any) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create property');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

// Update property mutation
export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to update property');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['properties', 'search'] });
    },
  });
}





