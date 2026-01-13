'use client';

import React from 'react';
import { BuyerActions } from './BuyerActions';

interface BuyerActionsClientProps {
  propertyId: string;
  isFavorite?: boolean;
  isInCart?: boolean;
}

export const BuyerActionsClient: React.FC<BuyerActionsClientProps> = ({
  propertyId,
  isFavorite = false,
  isInCart = false,
}) => {
  return <BuyerActions propertyId={propertyId} isFavorite={isFavorite} isInCart={isInCart} />;
};



