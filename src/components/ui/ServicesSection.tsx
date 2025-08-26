/**
 * Services Section Component
 * 
 * Services section showcasing K2A car rental services with title, subtitle and service cards
 * Features orange title and subtitle with three service cards
 */

'use client';

import React from 'react';
import { ServiceCard } from './ServiceCard';
import { useLanguage } from '@/hooks/useLanguage';
import type { ServiceFeature } from '@/types/ServiceCard';

export interface ServicesSectionProps {
  className?: string;
  services?: ServiceFeature[];
}

export function ServicesSection({
  className = '',
  services = []
}: ServicesSectionProps) {
  const { t, isRTL, textDirection } = useLanguage();

  // Default services if none provided
  const defaultServices: ServiceFeature[] = [
    {
      id: 'events-weddings',
      icon: 'events',
      titleKey: 'services.eventsWeddings.title',
      descriptionKey: 'services.eventsWeddings.description'
    },
    {
      id: 'long-term-contracts',
      icon: 'contract',
      titleKey: 'services.longTermContracts.title',
      descriptionKey: 'services.longTermContracts.description'
    },
    {
      id: 'short-term-rentals',
      icon: 'short-term',
      titleKey: 'services.shortTermRentals.title',
      descriptionKey: 'services.shortTermRentals.description'
    }
  ];

  const servicesData = services.length > 0 ? services : defaultServices;

  const handleExplore = (serviceId: string) => {
    console.log('Explore service:', serviceId);
    // Navigate to service details or show more info
    window.location.href = `/services/${serviceId}`;
  };

  const handleGetInfo = (serviceId: string) => {
    console.log('Get info for service:', serviceId);
    // Show service information modal or navigate to info page
    window.location.href = `/services/${serviceId}/info`;
  };

  return (
    <section 
      id="services"
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
            {t('services.title')}
          </h2>
          <p 
            className="font-inter text-lg sm:text-xl max-w-4xl mx-auto leading-relaxed"
            style={{ 
              color: 'rgb(241, 134, 27)', // Orange color
              direction: textDirection,
              unicodeBidi: 'embed'
            }}
          >
            {t('services.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 ${
          isRTL ? 'lg:grid-flow-col-dense' : ''
        }`}>
          {servicesData.map((service) => (
            <ServiceCard
              key={service.id}
              feature={service}
              variant="default"
              onExplore={() => handleExplore(service.id)}
              onGetInfo={() => handleGetInfo(service.id)}
              className="h-full"
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default ServicesSection;
