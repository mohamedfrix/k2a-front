/**
 * Find Us Section Component
 * 
 * Displays location information with AgencyCard and map placeholder
 * Features orange background and side-by-side layout
 */

'use client';

import React from 'react';
import { AgencyCard } from './AgencyCard';
import { useLanguage } from '@/hooks/useLanguage';
import type { AgencyInfo } from '@/types/AgencyCard';

export interface FindUsSectionProps {
  className?: string;
}

export function FindUsSection({ className = '' }: FindUsSectionProps) {
  const { t, isRTL, textDirection } = useLanguage();

  // Sample agency data
  const agencyData: AgencyInfo = {
    id: "k2a-main",
    name: "K2A Tizi Ouzou",
    description: "Notre agence principale vous accueille dans un cadre moderne et professionnel.",
    address: {
      street: "Rue des Martyrs, Centre Ville",
      city: "Tizi Ouzou",
      country: "Algérie"
    },
    contact: {
      phone: "+213 26 12 34 56",
      email: "contact@k2a-rental.dz",
      availability: "Disponible 24/7",
      responseTime: "Réponse sous 24h"
    },
    businessHours: {
      weekdays: { start: "08:00", end: "18:00" },
      saturday: { start: "09:00", end: "17:00" },
      sunday: { start: "10:00", end: "15:00" }
    }
  };

  const handleContactClick = () => {
    console.log('Contact clicked');
    // Add contact logic here
  };

  return (
    <section 
      id="find-us"
      className={`py-16 lg:py-24 bg-primary text-white ${className}`}
      dir={textDirection}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            className="font-unbounded font-bold text-3xl sm:text-4xl lg:text-5xl mb-6 text-white"
            style={{ 
              direction: textDirection 
            }}
          >
            {t('findUs.title')}
          </h2>
          <p 
            className="font-inter text-lg sm:text-xl max-w-4xl mx-auto leading-relaxed text-white"
            style={{ 
              direction: textDirection,
              unicodeBidi: 'embed'
            }}
          >
            {t('findUs.subtitle')}
          </p>
        </div>

        {/* Content Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${
          isRTL ? 'lg:grid-flow-col-dense' : ''
        }`}>
          
          {/* Agency Card */}
          <div className="h-full">
            <AgencyCard
              agency={agencyData}
              onContactClick={handleContactClick}
              className="h-full"
            />
          </div>

          {/* Map with real interactive embed (OpenStreetMap) */}
          <div className="h-full">
            <div className="bg-white rounded-2xl shadow-2xl p-6 h-full  flex flex-col">
              {/* Left: Icon + Text */}
              {/* <div className="w-full lg:w-1/3 p-6 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <svg 
                    className="w-10 h-10 text-orange-500" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 font-unbounded">
                  {t('findUs.mapPlaceholder.title')}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {t('findUs.mapPlaceholder.description')}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">{t('findUs.mapPlaceholder.feature1')}</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">{t('findUs.mapPlaceholder.feature2')}</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">{t('findUs.mapPlaceholder.feature3')}</span>
                  </div>
                </div>
              </div> */}

              {/* Right: Interactive map iframe (OpenStreetMap) */}
              <div className="w-full  h-full rounded-xl overflow-hidden">
                <iframe
                  title="K2A Location Map - Tizi Ouzou"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=4.0396%2C36.7039%2C4.0596%2C36.7239&layer=mapnik&marker=36.7139%2C4.0496"
                  className="w-full h-full border-0"
                  loading="lazy"
                  aria-label="Interactive map showing K2A location"
                />
                <div className="p-3 text-xs text-gray-600 text-center">
                  <a
                    href="https://www.openstreetmap.org/?mlat=36.7139&mlon=4.0496#map=15/36.7139/4.0496"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    View larger map on OpenStreetMap
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FindUsSection;
