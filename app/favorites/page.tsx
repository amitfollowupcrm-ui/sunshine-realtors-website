// Favorites Page - Buyer's Favorite Properties

import React from 'react';
import { PropertyCardClient } from '@/components/property/PropertyCardClient';
import { prisma } from '@/config/database';
import { getCurrentUserFromServer } from '@/lib/utils/auth';

async function fetchFavorites() {
  try {
    // Get user from server (using cookies)
    const user = await getCurrentUserFromServer();
    if (!user) {
      return { favorites: [], success: false, authenticated: false };
    }

    const favorites = await prisma.propertyFavorite.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        property: {
          include: {
            owner: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      favorites,
      count: favorites.length,
      authenticated: true,
    };
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return { favorites: [], success: false, authenticated: false };
  }
}

export default async function FavoritesPage() {
  const { favorites = [], authenticated = false } = await fetchFavorites();

  // Show login prompt if not authenticated
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-white rounded-lg shadow">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-semibold mb-2">Login Required</h2>
              <p className="text-gray-600 mb-4">
                Please login as a buyer to view your favorite properties
              </p>
              <a
                href="/login"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">My Favorite Properties</h1>
          <p className="text-gray-600">
            Properties you've saved for later
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length > 0 ? (
          <>
            <div className="mb-6">
              <span className="text-gray-600">
                You have {favorites.length} favorite {favorites.length === 1 ? 'property' : 'properties'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite: any) => (
                <PropertyCardClient
                  key={favorite.id}
                  property={{
                    id: favorite.property.id,
                    title: favorite.property.title,
                    slug: favorite.property.slug,
                    primaryImageUrl: favorite.property.primaryImageUrl,
                    locality: favorite.property.locality,
                    city: favorite.property.city,
                    state: favorite.property.state,
                    price: favorite.property.price,
                    bedrooms: favorite.property.bedrooms,
                    builtUpArea: favorite.property.builtUpArea,
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-white rounded-lg shadow">
              <div className="text-6xl mb-4">🤍</div>
              <h2 className="text-2xl font-semibold mb-2">No Favorites Yet</h2>
              <p className="text-gray-600 mb-4">
                Start exploring properties and add them to your favorites!
              </p>
              <a
                href="/buy"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Properties
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


