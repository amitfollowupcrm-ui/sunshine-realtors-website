// React hooks for lead operations

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Fetch leads
export function useLeads(filters?: {
  status?: string[];
  assignedToId?: string;
  propertyId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const params = new URLSearchParams();

      if (filters?.status) {
        params.append('status', filters.status.join(','));
      }
      if (filters?.assignedToId) {
        params.append('assignedToId', filters.assignedToId);
      }
      if (filters?.propertyId) {
        params.append('propertyId', filters.propertyId);
      }
      params.append('page', (filters?.page || 1).toString());
      params.append('limit', (filters?.limit || 20).toString());

      const response = await fetch(`${API_BASE_URL}/leads?${params.toString()}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }

      const data = await response.json();
      return data.data;
    },
    enabled: !!localStorage.getItem('auth_token'),
  });
}

// Fetch single lead
export function useLead(id: string) {
  return useQuery({
    queryKey: ['leads', id],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lead');
      }

      const data = await response.json();
      return data.data;
    },
    enabled: !!id && !!localStorage.getItem('auth_token'),
  });
}

// Create lead mutation
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leadData: any) => {
      const response = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create lead');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

// Update lead mutation
export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to update lead');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

// Assign lead mutation
export function useAssignLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dealerId, priority }: { id: string; dealerId: string; priority?: string }) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/leads/${id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ dealerId, priority }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to assign lead');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

