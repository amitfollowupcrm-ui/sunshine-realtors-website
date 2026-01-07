// Cart Page - Buyer's Cart Properties

import React from 'react';
import { PropertyCardClient } from '@/components/property/PropertyCardClient';

async function fetchCart() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://sunshine-realtors-website.vercel.app';
    const response = await fetch(`${baseUrl}/api/properties/cart`, {
      cache: 'no-store',
      // Note: In production, this should include authentication headers
    });

    if (!response.ok) {
      console.error('Failed to fetch cart:', response.statusText);
      return { cart: [] };
    }

    const data = await response.json();
    return data.success ? data : { cart: [] };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return { cart: [] };
  }
}

export default async function CartPage() {
  const { cart = [] } = await fetchCart();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">My Cart</h1>
          <p className="text-gray-600">
            Properties you're interested in buying or renting
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cart.length > 0 ? (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-600">
                    You have {cart.length} {cart.length === 1 ? 'property' : 'properties'} in your cart
                  </span>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Send Inquiry
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cart.map((item: any) => (
                <div key={item.id}>
                  <PropertyCardClient
                    property={{
                      id: item.property.id,
                      title: item.property.title,
                      slug: item.property.slug,
                      primaryImageUrl: item.property.primaryImageUrl,
                      locality: item.property.locality,
                      city: item.property.city,
                      state: item.property.state,
                      price: item.property.price,
                      bedrooms: item.property.bedrooms,
                      builtUpArea: item.property.builtUpArea,
                    }}
                  />
                  {item.inquiryType && (
                    <div className="mt-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                      Inquiry Type: {item.inquiryType}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-white rounded-lg shadow">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-4">
                Add properties to your cart to inquire about them!
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


