'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  CarCarousel, 
  CarSpecsCard, 
  PriceCard, 
  PageNavbar, 
  Footer 
} from '@/components/ui';
import Calendar from '@/components/car_page/Calendar';
import PriceCalc from '@/components/ui/PriceCalc';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicVehicleById, getVehicleRecommendations } from '@/lib/api/publicVehicles';
import { getVehicleCalendar } from '@/lib/api/publicContracts';
import normalizeVehicleForUI from '@/lib/normalizeVehicle';
import type { Vehicle } from '@/types/VehicleCard';
import type { CarSpecifications, CarEquipmentItem } from '@/types/CarSpecsCard';
import type { CarRentalData, AccessoryOption, RentalBooking } from '@/types/PriceCalc';
import { getSafeImageUrl } from '@/lib/image-utils';

// Fallback vehicle data if API fails
const fallbackVehicle: Vehicle = {
  id: "bmw-x3-2024",
  make: "BMW",
  model: "X3",
  year: 2024,
  location: "Tizi Ouzou",
  pricePerDay: 12000,
  currency: "DA",
  available: true,
  featured: true,
  images: [
    {
      url: "/vehicles/bmw-x3-main.jpg",
      alt: "BMW X3 2024 - Vue principale",
      isPrimary: true
    },
    {
      url: "/vehicles/bmw-x3-interior.jpg", 
      alt: "BMW X3 2024 - Intérieur",
      isPrimary: false
    },
    {
      url: "/vehicles/bmw-x3-side.jpg",
      alt: "BMW X3 2024 - Vue de profil",
      isPrimary: false
    },
    {
      url: "/vehicles/bmw-x3-rear.jpg",
      alt: "BMW X3 2024 - Vue arrière", 
      isPrimary: false
    }
  ],
  specs: {
    transmission: "automatic",
    fuelType: "hybrid",
    year: 2024,
    seats: 5,
    doors: 5
  }
};


export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { t, isRTL, textDirection } = useLanguage();
  const [showPriceCalc, setShowPriceCalc] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<any[]>([]);
  
  const vehicleId = (params?.id as string) || '';

  // Fetch vehicle data from backend
  useEffect(() => {
    const fetchVehicle = async () => {
      if (!vehicleId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch vehicle data
        const vehicleData = await getPublicVehicleById(vehicleId);
        setVehicle(vehicleData);
        
        // Fetch calendar data for current month
        const currentDate = new Date();
        const calendarData = await getVehicleCalendar(
          vehicleId,
          currentDate.getFullYear(),
          currentDate.getMonth() + 1
        );
        setCalendarData(calendarData);
        
      } catch (err) {
        console.error('Error fetching vehicle:', err);
        setError(err instanceof Error ? err.message : 'Failed to load vehicle');
        // Use fallback data
        setVehicle(fallbackVehicle);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  const handleGoBack = () => {
    router.push('/vehicles');
  };

  const handleCustomPrice = () => {
    setShowPriceCalc(true);
  };

  const handleClosePriceCalc = () => {
    setShowPriceCalc(false);
  };

  const handleBookingChange = (booking: RentalBooking) => {
    console.log('Booking changed:', booking);
  };

  const handleBookingSubmit = (booking: RentalBooking) => {
    console.log('Booking submitted:', booking);
    // Handle booking submission here
    setShowPriceCalc(false);
    // You could navigate to a confirmation page or show a success message
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir={textDirection}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-on-surface-variant">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir={textDirection}>
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <button
            onClick={() => router.push('/vehicles')}
            className="btn-filled"
          >
            {t('common.goBack')}
          </button>
        </div>
      </div>
    );
  }

  // Use fallback vehicle if no vehicle data
  const currentVehicle = vehicle || fallbackVehicle;

  // Convert vehicle images to carousel format  
  const carouselImages = currentVehicle.images.map(img => typeof img.url === 'string' ? img.url : img.url.src);

  // Prepare specifications and equipment using a normalizer that understands both
  // top-level vehicle fields and nested `specs` objects.
  const { specifications, equipements } = normalizeVehicleForUI(currentVehicle as any);
  // Debug: log normalized output for troubleshooting during development
  // (left intentionally as console.debug for dev builds only)
  console.debug('Normalized vehicle specifications:', { specifications, equipements, raw: currentVehicle });

  // Prepare car data for PriceCalc
  const carRentalData: CarRentalData = {
    id: currentVehicle.id,
    make: currentVehicle.make,
    model: currentVehicle.model,
    year: currentVehicle.year,
    dailyRate: currentVehicle.pricePerDay,
    currency: currentVehicle.currency,
    image: typeof currentVehicle.images[0]?.url === 'string' ? getSafeImageUrl(currentVehicle.images[0].url) : 
           currentVehicle.images[0]?.url ? getSafeImageUrl(currentVehicle.images[0].url.src) : undefined,
    description: `${currentVehicle.make} ${currentVehicle.model} ${currentVehicle.year} - Premium vehicle rental`
  };

  // Sample accessories for PriceCalc
  const accessories: AccessoryOption[] = [
    {
      id: 'gps',
      name: 'GPS Navigation',
      price: 500,
      currency: 'DA',
      description: 'Built-in GPS navigation system'
    },
    {
      id: 'child-seat',
      name: 'Child Seat',
      price: 300,
      currency: 'DA',
      description: 'Safety child seat'
    },
    {
      id: 'insurance',
      name: 'Full Insurance',
      price: 1200,
      currency: 'DA',
      description: 'Comprehensive insurance coverage'
    },
    {
      id: 'driver',
      name: 'Professional Driver',
      price: 2500,
      currency: 'DA',
      description: 'Experienced professional driver'
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir={textDirection}>
      {/* Page Navbar */}
      <PageNavbar activeNavItem="vehicles" />
      
      {/* Header with Back Button */}
      <header className="bg-surface border-b border-outline-variant py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className={`flex items-center justify-center w-10 h-10 rounded-full bg-surface-variant hover:bg-primary-container transition-colors duration-200 text-primary hover:text-primary`}
              aria-label={t('common.goBack')}
            >
              <ArrowLeft 
                className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} 
              />
            </button>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="font-unbounded font-bold text-2xl sm:text-3xl text-on-surface">
                  {currentVehicle.make} {currentVehicle.model} {currentVehicle.year}
                </h1>
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {currentVehicle.pricePerDay.toLocaleString()} {currentVehicle.currency}/jour
                </div>
              </div>
              <p className={`mt-1 font-medium ${currentVehicle.available ? 'text-success' : 'text-error'}`}>
                {currentVehicle.available ? '✓ ' : '✗ '}{t('vehicleDetails.availableIn')} {currentVehicle.location}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Two Column Layout */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 ${isRTL ? 'lg:grid-flow-col-dense' : ''}`}>
          
          {/* Left Column - Car Carousel */}
          <div className={`${isRTL ? 'lg:order-2' : 'lg:order-1'}`}>
            <section>
              <h2 className="font-unbounded font-semibold text-xl text-on-surface mb-4">
                {t('vehicleDetails.gallery')}
              </h2>
              <CarCarousel images={carouselImages} />
            </section>
          </div>

          {/* Right Column - Calendar and Button */}
          <div className={`space-y-8 ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}>
            {/* Calendar */}
            <section>
              <h2 className="font-unbounded font-semibold text-xl text-on-surface mb-4">
                {t('vehicleDetails.selectDate')}
              </h2>
              <Calendar 
                vehicleId={vehicleId}
                calendarData={calendarData}
                onCalendarDataChange={setCalendarData}
              />
            </section>

            {/* Custom Price Button */}
            <section>
              <button
                onClick={handleCustomPrice}
                className="w-full btn-filled text-lg py-4 font-unbounded"
              >
                {t('vehicleDetails.calculateCustomPrice')}
              </button>
            </section>
          </div>
        </div>

        {/* Full Width Specifications Section */}
        <section>
          <h2 className="font-unbounded font-semibold text-xl text-on-surface mb-4">
            {t('vehicleDetails.specifications')}
          </h2>
          <CarSpecsCard 
            specifications={specifications}
            equipements={equipements}
          />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Price Calculator Modal */}
      <AnimatePresence>
        {showPriceCalc && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClosePriceCalc}
          >
            <motion.div
              className="bg-surface rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative border border-outline-variant"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              dir={textDirection}
            >
              {/* Close Button */}
              <button
                onClick={handleClosePriceCalc}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-surface-variant hover:bg-outline-variant text-on-surface-variant hover:text-on-surface transition-all duration-200"
                aria-label={t('common.close')}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <div className="p-6">
                <PriceCalc
                  car={carRentalData}
                  accessories={accessories}
                  onBookingChange={handleBookingChange}
                  onSubmit={handleBookingSubmit}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
