'use client';

import React from 'react';
import { AgencyCard, ServiceCard, ReviewCard, VehicleCard } from '../ui';
import { AgencyInfo } from '../../types/AgencyCard';
import { ServiceFeature } from '../../types/ServiceCard';
import { CustomerReview } from '../../types/ReviewCard';
import { Vehicle } from '../../types/VehicleCard';

export function CardExamples() {
  // Example agency data
  const exampleAgency: AgencyInfo = {
    id: 'k2a-main',
    name: 'Agence K2A',
    description: 'Notre agence principale vous accueille dans un cadre moderne et professionnel.',
    address: {
      street: 'Cité des 400 logements',
      city: 'Tizi Ouzou',
      country: 'Algérie'
    },
    contact: {
      phone: '+213 123 456 789',
      email: 'contact@k2a.dz',
      availability: 'Disponible 24h/24, 7j/7',
      responseTime: 'Réponse sous 24h'
    },
    businessHours: {
      weekdays: { start: '08:00', end: '18:00' },
      saturday: { start: '09:00', end: '17:00' },
      sunday: { start: '10:00', end: '16:00' }
    }
  };

  // Example service data
  const exampleService: ServiceFeature = {
    id: 'availability-24-7',
    icon: 'clock',
    titleKey: 'services.availability24_7.title',
    descriptionKey: 'services.availability24_7.description',
    availability: '24/7'
  };

  // Example review data
  const exampleReview: CustomerReview = {
    id: 'review-1',
    customerName: 'Amina',
    customerType: 'client',
    rating: 5,
    reviewText: 'Service exceptionnel !',
    date: new Date('2024-01-15'),
    verified: true
  };

  // Example vehicle data
  const exampleVehicle: Vehicle = {
    id: 'mercedes-c-2023',
    make: 'Mercedes',
    model: 'C-2023',
    year: 2023,
    location: 'Berline',
    pricePerDay: 15200,
    currency: 'DZD',
    images: [
      {
        url: '/api/placeholder/400/300',
        alt: 'Mercedes C-2023',
        isPrimary: true
      }
    ],
    specs: {
      transmission: 'automatic',
      fuelType: 'petrol',
      year: 2023,
      seats: 5,
      doors: 4
    },
    available: true,
    featured: true
  };

  const handleContactClick = () => {
    console.log('Contact button clicked');
  };

  const handleViewMore = (vehicleId: string) => {
    console.log('View more clicked for vehicle:', vehicleId);
  };

  const handleBook = (vehicleId: string) => {
    console.log('Book clicked for vehicle:', vehicleId);
  };

  const handleExplore = () => {
    console.log('Explore button clicked');
  };

  const handleGetInfo = () => {
    console.log('Get Info button clicked');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-on-background mb-8 font-unbounded text-center">
          Card Components Examples
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Agency Card */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-on-background font-unbounded">
              Agency Card
            </h2>
            <AgencyCard 
              agency={exampleAgency}
              onContactClick={handleContactClick}
            />
          </div>

          {/* Service Card */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-on-background font-unbounded">
              Service Card
            </h2>
            <ServiceCard 
              feature={exampleService}
              variant="highlighted"
              onExplore={handleExplore}
              onGetInfo={handleGetInfo}
            />
          </div>

          {/* Review Card */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-on-background font-unbounded">
              Review Card
            </h2>
            <ReviewCard 
              review={exampleReview}
              showDate={true}
            />
          </div>

          {/* Vehicle Card - Detailed */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-on-background font-unbounded">
              Vehicle Card (Detailed)
            </h2>
            <VehicleCard 
              vehicle={exampleVehicle}
              variant="detailed"
              onViewMore={handleViewMore}
              onBook={handleBook}
            />
          </div>
        </div>

        {/* Vehicle Card - Compact */}
        <div className="mt-16 space-y-4">
          <h2 className="text-xl font-semibold text-on-background font-unbounded">
            Vehicle Card (Compact)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <VehicleCard 
              vehicle={exampleVehicle}
              variant="compact"
              onViewMore={handleViewMore}
            />
            <VehicleCard 
              vehicle={{
                ...exampleVehicle,
                id: 'mercedes-c-2023-gray',
                available: true,
                featured: false
              }}
              variant="compact"
              onViewMore={handleViewMore}
            />
            <VehicleCard 
              vehicle={{
                ...exampleVehicle,
                id: 'mercedes-c-2023-unavailable',
                available: false,
                featured: false
              }}
              variant="compact"
              onViewMore={handleViewMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
