'use client';

import React from 'react';
import Image from 'next/image';
import { VehicleCardProps } from '../../types/VehicleCard';
import { useLanguage } from '../../context/LanguageContext';
import { getSafeImageUrl } from '../../lib/image-utils';

export function VehicleCard({ 
  vehicle, 
  className = '', 
  variant = 'detailed',
  onViewMore,
  onBook 
}: VehicleCardProps) {
  const { t, isRTL } = useLanguage();

  const primaryImage = vehicle.images.find(img => img.isPrimary) || vehicle.images[0];

  const getTransmissionText = (transmission: string) => {
    return t(`vehicles.${transmission}`);
  };

  const formatPrice = (price: number, currency: string) => {
    // Format the price with proper thousand separators
    const formattedNumber = new Intl.NumberFormat('en-US').format(price);
    return `${formattedNumber} ${currency}`;
  };

  if (variant === 'compact') {
    return (
      <div 
        className={`card bg-surface overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Image Section */}
        <div className="relative h-48 sm:h-52 bg-surface-variant flex-shrink-0 overflow-hidden">
        {primaryImage && (
          (() => {
            // Safely extract a string URL from primaryImage.url which can be
            // either a string or a StaticImageData-like object. If the value
            // is missing, pass an empty string to getSafeImageUrl so it returns
            // the placeholder.
            const rawUrl = typeof primaryImage.url === 'string'
              ? primaryImage.url
              : primaryImage.url?.src ?? '';

            return (
              <Image
                src={getSafeImageUrl(rawUrl)}
                alt={primaryImage.alt}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/carLogin.png'; // fallback image
                }}
              />
            );
          })()
        )}          {/* Featured Badge */}
          {vehicle.featured && (
            <div className="absolute top-3 right-3 bg-warning text-on-warning px-2 py-1 rounded-md text-xs font-medium shadow-md">
              ⭐ {t('vehicles.featured')}
            </div>
          )}
          
          {/* Availability Status */}
          <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-medium shadow-md ${
            vehicle.available 
              ? 'bg-success text-on-success' 
              : 'bg-error text-on-error'
          }`}>
            {vehicle.available ? `✓ ${t('vehicles.available')}` : `✗ ${t('vehicles.notAvailable')}`}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col">
          {/* Vehicle Info */}
          <div className="mb-3">
            <h3 className="font-bold text-on-surface font-unbounded text-lg sm:text-xl mb-1 line-clamp-1">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-on-surface-variant">
              📍 {vehicle.location} • {vehicle.year}
            </p>
          </div>

          {/* Specs Row */}
          <div className="flex items-center gap-3 sm:gap-4 mb-4 text-xs sm:text-sm flex-wrap">
            {/* Transmission */}
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-on-surface-variant truncate">
                {getTransmissionText(vehicle.specs.transmission)}
              </span>
            </div>
            
            {/* Seats if available */}
            {vehicle.specs.seats && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-on-surface-variant">
                  {vehicle.specs.seats} places
                </span>
              </div>
            )}

            {/* Fuel Type */}
            {vehicle.specs.fuelType && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span className="text-on-surface-variant capitalize truncate">
                  {vehicle.specs.fuelType}
                </span>
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-end justify-between mb-3">
              <div className="flex-1">
                <div className="text-xs text-on-surface-variant mb-1">
                  {t('vehicles.startingFrom')}
                </div>
                <div className="text-lg sm:text-xl font-bold text-primary">
                  {formatPrice(vehicle.pricePerDay, vehicle.currency)}
                  <span className="text-xs sm:text-sm font-normal text-on-surface-variant ml-1">
                    /{t('vehicles.perDay')}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="flex">
              <button 
                onClick={() => onViewMore?.(vehicle.id)}
                className={`w-full text-xs sm:text-sm ${
                  vehicle.available 
                    ? 'btn-filled' 
                    : 'btn-outlined'
                }`}
              >
                {t('vehicles.viewMore')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`card bg-surface overflow-hidden w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Image */}
      <div className="relative h-48 sm:h-56 bg-surface-variant overflow-hidden">
        {primaryImage && (
          (() => {
            const rawUrl = typeof primaryImage.url === 'string'
              ? primaryImage.url
              : primaryImage.url?.src ?? '';

            return (
              <Image
                src={getSafeImageUrl(rawUrl)}
                alt={primaryImage.alt}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 640px) 100vw, 400px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/carLogin.png'; // fallback image
                }}
              />
            );
          })()
        )}
        {vehicle.featured && (
          <div className="absolute top-3 left-3 bg-primary text-on-primary px-3 py-1 rounded-md text-sm font-medium shadow-md">
            Featured
          </div>
        )}
        {!vehicle.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium">Not Available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <h3 className="text-xl font-semibold text-on-surface font-unbounded mb-2 line-clamp-1">
          {vehicle.make} {vehicle.model}
        </h3>
        
        <p className="text-sm text-on-surface-variant mb-4 flex items-center gap-1">
          📍 {vehicle.location} • {vehicle.year}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-on-surface-variant flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-on-surface-variant">
              {getTransmissionText(vehicle.specs.transmission)}
            </span>
          </div>
          
          {vehicle.specs.seats && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-on-surface-variant flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-on-surface-variant">
                {vehicle.specs.seats} places
              </span>
            </div>
          )}

          {vehicle.specs.fuelType && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-on-surface-variant flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="text-sm text-on-surface-variant capitalize">
                {vehicle.specs.fuelType}
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-6">
          <span className="text-sm text-on-surface-variant">
            {t('vehicles.startingFrom')}
          </span>
          <div className="text-2xl font-bold text-primary">
            {formatPrice(vehicle.pricePerDay, vehicle.currency)}
            <span className="text-base font-normal text-on-surface-variant">
              /{t('vehicles.perDay')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex">
          <button 
            onClick={() => onViewMore?.(vehicle.id)}
            className={`w-full text-sm ${
              vehicle.available 
                ? 'btn-filled' 
                : 'btn-outlined'
            }`}
          >
            {t('vehicles.viewMore')}
          </button>
        </div>
      </div>
    </div>
  );
}
