// Admin Property Moderation Page

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { PropertyCard } from '@/components/property/PropertyCard';

export default function ModerationPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN' && user?.role !== 'INTERNAL_OPS')) {
      router.push('/login');
      return;
    }

    fetchModerationQueue();
  }, [isAuthenticated, user]);

  const fetchModerationQueue = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/properties/moderation?status=PENDING_VERIFICATION', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data.data?.properties || []);
      }
    } catch (error) {
      console.error('Failed to fetch moderation queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (propertyId: string, action: 'APPROVE' | 'REJECT', reason?: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/admin/properties/${propertyId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, reason }),
      });

      if (response.ok) {
        // Remove from list
        setProperties(properties.filter(p => p.id !== propertyId));
      }
    } catch (error) {
      console.error('Moderation failed:', error);
      alert('Failed to moderate property');
    }
  };

  const handleBulkModerate = async (action: 'APPROVE' | 'REJECT') => {
    if (selectedProperties.size === 0) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/properties/moderation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyIds: Array.from(selectedProperties),
          action,
        }),
      });

      if (response.ok) {
        setProperties(properties.filter(p => !selectedProperties.has(p.id)));
        setSelectedProperties(new Set());
      }
    } catch (error) {
      console.error('Bulk moderation failed:', error);
      alert('Failed to moderate properties');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Property Moderation</h1>
            <p className="text-gray-600">Review and approve properties</p>
          </div>
          {selectedProperties.size > 0 && (
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => handleBulkModerate('APPROVE')}
              >
                Approve Selected ({selectedProperties.size})
              </Button>
              <Button
                variant="danger"
                onClick={() => handleBulkModerate('REJECT')}
              >
                Reject Selected
              </Button>
            </div>
          )}
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No properties pending moderation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedProperties.has(property.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedProperties);
                      if (e.target.checked) {
                        newSelected.add(property.id);
                      } else {
                        newSelected.delete(property.id);
                      }
                      setSelectedProperties(newSelected);
                    }}
                    className="mt-2"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                    <p className="text-gray-600 mb-4">{property.locality}, {property.city}</p>
                    <p className="text-2xl font-bold text-blue-600 mb-4">₹{property.price.toLocaleString('en-IN')}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleModerate(property.id, 'APPROVE')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          const reason = prompt('Rejection reason (optional):');
                          handleModerate(property.id, 'REJECT', reason || undefined);
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/properties/${property.slug}`, '_blank')}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                  {property.primaryImageUrl && (
                    <img
                      src={property.primaryImageUrl}
                      alt={property.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




