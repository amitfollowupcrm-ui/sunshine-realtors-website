'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

interface BuyerActionsProps {
  propertyId: string;
  isFavorite?: boolean;
  isInCart?: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
  onCartChange?: (isInCart: boolean) => void;
}

export const BuyerActions: React.FC<BuyerActionsProps> = ({
  propertyId,
  isFavorite = false,
  isInCart = false,
  onFavoriteChange,
  onCartChange,
}) => {
  const { user } = useAuth();
  const [favorite, setFavorite] = useState(isFavorite);
  const [inCart, setInCart] = useState(isInCart);
  const [loading, setLoading] = useState(false);

  const handleFavorite = async () => {
    if (!user || user.role !== 'BUYER') {
      alert('Please login as a buyer to add favorites');
      return;
    }

    setLoading(true);
    try {
      const method = favorite ? 'DELETE' : 'POST';
      const response = await fetch(`/api/properties/favorites${favorite ? `/${propertyId}` : ''}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: favorite ? undefined : JSON.stringify({ propertyId }),
      });

      if (response.ok) {
        const newFavoriteState = !favorite;
        setFavorite(newFavoriteState);
        onFavoriteChange?.(newFavoriteState);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user || user.role !== 'BUYER') {
      alert('Please login as a buyer to add to cart');
      return;
    }

    setLoading(true);
    try {
      const method = inCart ? 'DELETE' : 'POST';
      const response = await fetch(`/api/properties/cart${inCart ? `/${propertyId}` : ''}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: inCart ? undefined : JSON.stringify({ propertyId, inquiryType: 'BUY' }),
      });

      if (response.ok) {
        const newCartState = !inCart;
        setInCart(newCartState);
        onCartChange?.(newCartState);
      }
    } catch (error) {
      console.error('Error toggling cart:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'BUYER') {
    return null;
  }

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={handleFavorite}
        disabled={loading}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          favorite
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>{favorite ? '❤️' : '🤍'}</span>
        <span>{favorite ? 'Favorited' : 'Favorite'}</span>
      </button>
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          inCart
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>{inCart ? '🛒 ✓' : '🛒'}</span>
        <span>{inCart ? 'In Cart' : 'Add to Cart'}</span>
      </button>
    </div>
  );
};


