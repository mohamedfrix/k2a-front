'use client';

import React, { useState, useEffect } from 'react';
import { HeroSection, ServicesSection, Footer, FeaturedVehiclesSection, WhyUsSection, FindUsSection, FeedbackSection, PageNavbar } from "@/components/ui";
import { StructuredData } from '@/components/ui/StructuredData';
import { useLanguage } from '@/hooks/useLanguage';
import { getFeaturedVehicles } from '@/lib/api/publicVehicles';
import type { HeroContent, CarFilterData } from '@/types';
import type { Vehicle } from '@/types/VehicleCard';
import OurBrochure from '@/components/ui/OurBrochure';

function LandingPage() {
    const { t } = useLanguage();
    const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Hero section content using translations
    const heroContent: HeroContent = {
      title: t('hero.title'),
      slogan: t('hero.slogan'),
      primaryButton: {
        text: t('hero.primaryButton'),
        href: "/booking",
        ariaLabel: t('hero.primaryButton')
      },
      secondaryButton: {
        text: t('hero.secondaryButton'),
        href: "/vehicles",
        ariaLabel: t('hero.secondaryButton')
      }
    };

    // Fetch featured vehicles from backend
    useEffect(() => {
        const fetchFeaturedVehicles = async () => {
            try {
                setLoading(true);
                const vehicles = await getFeaturedVehicles(4);
                setFeaturedVehicles(vehicles);
            } catch (err) {
                console.error('Error fetching featured vehicles:', err);
                setError(err instanceof Error ? err.message : 'Failed to load featured vehicles');
                // Fallback to sample data if API fails
                setFeaturedVehicles([
                    {
                        id: "1",
                        make: "BMW",
                        model: "X3",
                        year: 2023,
                        location: "Tizi Ouzou",
                        pricePerDay: 12000,
                        currency: "DA",
                        images: [{
                            url: "/vehicles/bmw-x3.jpg",
                            alt: "BMW X3",
                            isPrimary: true
                        }],
                        specs: {
                            transmission: "automatic",
                            fuelType: "hybrid",
                            year: 2023,
                            seats: 5,
                            doors: 5
                        },
                        available: true,
                        featured: true
                    },
                    {
                        id: "2",
                        make: "Mercedes",
                        model: "C-Class",
                        year: 2023,
                        location: "Tizi Ouzou",
                        pricePerDay: 9500,
                        currency: "DA",
                        images: [{
                            url: "/vehicles/mercedes-c-class.jpg",
                            alt: "Mercedes C-Class",
                            isPrimary: true
                        }],
                        specs: {
                            transmission: "automatic",
                            fuelType: "hybrid",
                            year: 2023,
                            seats: 5,
                            doors: 4
                        },
                        available: true,
                        featured: true
                    },
                    {
                        id: "3",
                        make: "Audi",
                        model: "A4",
                        year: 2023,
                        location: "Tizi Ouzou",
                        pricePerDay: 8500,
                        currency: "DA",
                        images: [{
                            url: "/vehicles/audi-a4.jpg",
                            alt: "Audi A4",
                            isPrimary: true
                        }],
                        specs: {
                            transmission: "automatic",
                            fuelType: "hybrid",
                            year: 2023,
                            seats: 5,
                            doors: 4
                        },
                        available: true,
                        featured: true
                    },
                    {
                        id: "4",
                        make: "Range Rover",
                        model: "Evoque",
                        year: 2023,
                        location: "Tizi Ouzou",
                        pricePerDay: 15000,
                        currency: "DA",
                        images: [{
                            url: "/vehicles/range-rover-evoque.jpg",
                            alt: "Range Rover Evoque",
                            isPrimary: true
                        }],
                        specs: {
                            transmission: "automatic",
                            fuelType: "hybrid",
                            year: 2023,
                            seats: 5,
                            doors: 5
                        },
                        available: true,
                        featured: true
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedVehicles();
    }, []);

    const handleCarFilter = (filterData: CarFilterData) => {
        console.log('Car filter submitted:', filterData);
        
        // Create search params for the filter
        const searchParams = new URLSearchParams({
            pickup_location: filterData.pickupLocation,
            dropoff_location: filterData.dropoffLocation,
            pickup_date: filterData.pickupDate,
            pickup_time: filterData.pickupTime,
            dropoff_date: filterData.dropoffDate,
            dropoff_time: filterData.dropoffTime,
        });
        
        // Navigate to search results (you can customize this URL)
        window.location.href = `/search?${searchParams.toString()}`;
    };

    // Featured vehicles handlers
    const handleViewMore = (vehicleId: string) => {
        console.log('View more vehicle:', vehicleId);
        window.location.href = `/vehicles/${vehicleId}`;
    };

    const handleBook = (vehicleId: string) => {
        console.log('Book vehicle:', vehicleId);
        window.location.href = `/booking?vehicle=${vehicleId}`;
    };

    const handleViewAllVehicles = () => {
        console.log('View all vehicles');
        window.location.href = '/vehicles';
    };

    return (
        <>
            {/* Structured Data for SEO */}
            <StructuredData pageName="home" />
            
            {/* Page-level Navbar - Sticky across all sections */}
            <PageNavbar activeNavItem="home" />
            
            {/* Hero Section */}
            <HeroSection
                content={heroContent}
                onCarFilter={handleCarFilter}
                carImage="/hero-section-car.png"
                carImageAlt="Voiture de location de luxe K2A"
                showNavbar={false}
            />
            
            {/* Services Section */}
            <ServicesSection />

            {/* Featured Vehicles Section */}
            {/* <FeaturedVehiclesSection
                vehicles={featuredVehicles}
                onViewMore={handleViewMore}
                onBook={handleBook}
                onViewAllVehicles={handleViewAllVehicles}
                className="py-20 bg-gray-50 dark:bg-gray-900"
            /> */}

            {/* Why Us Section */}
            <WhyUsSection />

            {/* Find Us Section */}
            <FindUsSection />

            {/* Feedback Section */}
            <FeedbackSection />

            <OurBrochure />

            {/* Footer */}
            <Footer />
        </>
    );
}

export default LandingPage;