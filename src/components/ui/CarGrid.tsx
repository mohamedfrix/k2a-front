/**
 * Car Grid Component
 * 
 * Responsive grid layout for displaying vehicle cards
 * Adapts to screen size with appropriate column counts
 */

'use client';

import React from 'react';
import { VehicleCard } from './VehicleCard';
import { useLanguage } from '@/hooks/useLanguage';
import type { CarGridProps } from '@/types/CarsPage';

export function CarGrid({
  vehicles,
  loading = false,
  onViewMore,
  onBook,
  className = ''
}: CarGridProps) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className={`grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 ${className}`}>
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="bg-surface border border-outline-variant rounded-md-md overflow-hidden animate-pulse"
          >
            {/* Image Skeleton */}
            <div className="aspect-[4/3] bg-surface-variant"></div>
            
            <div className="p-4 sm:p-5">
              {/* Title Skeleton */}
              <div className="h-5 bg-surface-variant rounded mb-2"></div>
              <div className="h-4 bg-surface-variant rounded w-3/4 mb-3"></div>
              
              {/* Specs Skeleton */}
              <div className="flex gap-2 sm:gap-3 mb-4 flex-wrap">
                <div className="h-4 bg-surface-variant rounded w-16"></div>
                <div className="h-4 bg-surface-variant rounded w-16"></div>
                <div className="h-4 bg-surface-variant rounded w-16"></div>
              </div>
              
              {/* Price Skeleton */}
              <div className="h-6 bg-surface-variant rounded w-32 mb-4"></div>
              
              {/* Buttons Skeleton */}
              <div className="flex gap-2">
                <div className="h-8 bg-surface-variant rounded flex-1"></div>
                <div className="h-8 bg-surface-variant rounded flex-1"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className={`text-center py-12 sm:py-16 px-4 ${className}`}>
        <div className="max-w-md mx-auto">
          {/* No Results Icon */}
          <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-surface-variant rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 sm:w-12 sm:h-12 text-on-surface-variant"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.25 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zm6.75-2.25a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v8.25zm2.25-4.5a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v3.75z"
              />
            </svg>
          </div>
          
          <h3 className="font-unbounded font-semibold text-lg sm:text-xl text-on-surface mb-2">
            {t('cars.noResults.title')}
          </h3>
          <p className="text-sm sm:text-base text-on-surface-variant mb-4 sm:mb-6">
            {t('cars.noResults.message')}
          </p>
          
          <button
            onClick={() => window.location.reload()}
            className="btn-outlined px-4 py-2 text-sm sm:text-base"
          >
            {t('cars.noResults.reset')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 ${className}`}>
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onViewMore={() => onViewMore(vehicle.id)}
          onBook={() => onBook(vehicle.id)}
          className="w-full"
        />
      ))}
    </div>
  );
}

export default CarGrid;
