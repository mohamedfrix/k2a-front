'use client';

// src/components/ui/PriceCard.tsx
import React from 'react';
import { PriceCardProps } from '@/types/PriceCard';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * A card component to display car rental information.
 * Shows car name, availability, price, location, and transmission.
 */
export const PriceCard: React.FC<PriceCardProps> = ({
  carName,
  isAvailable,
  price,
  location,
  transmission,
  onClick,
}) => {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        'bg-surface border border-outline-variant rounded-md-lg p-6 transition-all duration-300 ease-in-out hover:elevation-2 cursor-pointer',
        'hover:border-primary/30'
      )}
      onClick={onClick}
    >
      {/* Car Name - Top Left */}
      <div className="mb-3">
        <h3 className="text-heading text-xl font-bold text-on-surface">
          {carName}
        </h3>
      </div>

      {/* Availability Status - Under Car Name */}
      <div className="mb-4 flex items-center">
        <div
          className={cn(
            'mr-2 h-3 w-3 rounded-full',
            {
              'bg-success': isAvailable,
              'bg-error': !isAvailable,
            }
          )}
        />
        <span
          className={cn(
            'text-sm font-medium',
            {
              'text-success': isAvailable,
              'text-error': !isAvailable,
            }
          )}
        >
          {isAvailable ? t('carCard.available') : t('carCard.unavailable')}
        </span>
      </div>

      {/* Price - Center, Orange */}
      <div className="mb-6 text-center">
        <div className="text-primary">
          <span className="text-3xl font-bold">{price}</span>
          <span className="ml-1 text-lg font-medium">{t('carCard.priceUnit')}</span>
        </div>
      </div>

      {/* Bottom Section - Location and Transmission */}
      <div className="flex items-center justify-between">
        {/* Location - Bottom Left, Orange Card */}
        <div className="rounded-md-sm bg-primary px-3 py-1">
          <span className="text-sm font-medium text-on-primary">
            {location}
          </span>
        </div>

        {/* Transmission - Bottom Right */}
        <div className="flex items-center">
          <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-outline-variant">
            <div className="h-3 w-3 rounded-full bg-on-surface-variant" />
          </div>
          <span className="text-sm text-on-surface-variant">
            {transmission}
          </span>
        </div>
      </div>
    </div>
  );
};
