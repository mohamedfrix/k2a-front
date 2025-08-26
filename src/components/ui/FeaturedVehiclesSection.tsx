/**
 * Featured Vehicles Section Component
 * 
 * Displays featured vehicles with title, subtitle, compact vehicle cards and view all button
 * Features theme-aware design and multi-language support
 */

'use client';

import React from 'react';
import { VehicleCard } from './VehicleCard';
import { useLanguage } from '@/hooks/useLanguage';
import type { Vehicle } from '@/types/VehicleCard';

export interface FeaturedVehiclesSectionProps {
  className?: string;
  vehicles?: Vehicle[];
  onViewMore?: (vehicleId: string) => void;
  onBook?: (vehicleId: string) => void;
  onViewAllVehicles?: () => void;
}

export function FeaturedVehiclesSection({
  className = '',
  vehicles = [],
  onViewMore,
  onBook,
  onViewAllVehicles
}: FeaturedVehiclesSectionProps) {
  const { t, isRTL, textDirection } = useLanguage();

  // Default featured vehicles if none provided
  const defaultVehicles: Vehicle[] = [
    {
      id: 'bmw-x5-2024',
      make: 'BMW',
      model: 'X5',
      year: 2024,
      location: 'Tunis',
      pricePerDay: 180,
      currency: 'TND',
      available: true,
      featured: true,
      images: [
        {
          url: '/vehicles/bmw-x5-2024.jpg',
          alt: 'BMW X5 2024',
          isPrimary: true
        }
      ],
      specs: {
        transmission: 'automatic',
        fuelType: 'hybrid',
        year: 2024,
        seats: 5,
        doors: 4
      }
    },
    {
      id: 'mercedes-c200-2023',
      make: 'Mercedes',
      model: 'C200',
      year: 2023,
      location: 'Sousse',
      pricePerDay: 120,
      currency: 'TND',
      available: true,
      featured: true,
      images: [
        {
          url: '/vehicles/mercedes-c200-2023.jpg',
          alt: 'Mercedes C200 2023',
          isPrimary: true
        }
      ],
      specs: {
        transmission: 'automatic',
        fuelType: 'hybrid',
        year: 2023,
        seats: 5,
        doors: 4
      }
    },
    {
      id: 'audi-a4-2024',
      make: 'Audi',
      model: 'A4',
      year: 2024,
      location: 'Sfax',
      pricePerDay: 140,
      currency: 'TND',
      available: true,
      featured: true,
      images: [
        {
          url: '/vehicles/audi-a4-2024.jpg',
          alt: 'Audi A4 2024',
          isPrimary: true
        }
      ],
      specs: {
        transmission: 'automatic',
        fuelType: 'hybrid',
        year: 2024,
        seats: 5,
        doors: 4
      }
    },
    {
      id: 'toyota-corolla-2023',
      make: 'Toyota',
      model: 'Corolla',
      year: 2023,
      location: 'Monastir',
      pricePerDay: 80,
      currency: 'TND',
      available: true,
      featured: true,
      images: [
        {
          url: '/vehicles/toyota-corolla-2023.jpg',
          alt: 'Toyota Corolla 2023',
          isPrimary: true
        }
      ],
      specs: {
        transmission: 'automatic',
        fuelType: 'hybrid',
        year: 2023,
        seats: 5,
        doors: 4
      }
    }
  ];

  const featuredVehicles = vehicles.length > 0 ? vehicles : defaultVehicles;

  const handleViewMore = (vehicleId: string) => {
    console.log('View more vehicle:', vehicleId);
    if (onViewMore) {
      onViewMore(vehicleId);
    } else {
      // Default behavior: navigate to vehicle details
      window.location.href = `/vehicles/${vehicleId}`;
    }
  };

  const handleBook = (vehicleId: string) => {
    console.log('Book vehicle:', vehicleId);
    if (onBook) {
      onBook(vehicleId);
    } else {
      // Default behavior: navigate to booking page
      window.location.href = `/book/${vehicleId}`;
    }
  };

  const handleViewAllVehicles = () => {
    console.log('View all vehicles');
    if (onViewAllVehicles) {
      onViewAllVehicles();
    } else {
      // Default behavior: navigate to vehicles page
      window.location.href = '/vehicles';
    }
  };

  return (
    <section 
      className={`py-16 lg:py-24 bg-background text-on-background ${className}`}
      dir={textDirection}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            className="font-unbounded font-bold text-3xl sm:text-4xl lg:text-5xl mb-6"
            style={{ 
              color: 'rgb(241, 134, 27)', // Orange color
              direction: textDirection 
            }}
          >
            {t('bookSection.featuredVehicles')}
          </h2>
          <p 
            className="font-inter text-lg sm:text-xl max-w-4xl mx-auto leading-relaxed"
            style={{ 
              color: 'rgb(241, 134, 27)', // Orange color
              direction: textDirection,
              unicodeBidi: 'embed'
            }}
          >
            {t('bookSection.featuredVehiclesSubtitle')}
          </p>
        </div>

        {/* Featured Vehicles Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12 ${
          isRTL ? 'lg:grid-flow-col-dense' : ''
        }`}>
          {featuredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              variant="compact"
              onViewMore={handleViewMore}
              onBook={handleBook}
              className="h-full"
            />
          ))}
        </div>

        {/* View All Vehicles Button */}
        <div className="text-center">
          <button 
            onClick={handleViewAllVehicles}
            className="btn-outlined px-8 py-4 text-lg font-medium font-unbounded inline-flex items-center gap-3 hover:bg-primary hover:text-on-primary transition-all duration-300"
          >
            {t('bookSection.viewAllVehicles')}
            <svg 
              className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${
                isRTL ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}

export default FeaturedVehiclesSection;
