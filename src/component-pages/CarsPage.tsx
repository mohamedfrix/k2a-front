'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { HeroSection, SearchFilter, CarGrid, Pagination, Footer, PageNavbar } from "@/components/ui";
import { useLanguage } from '@/hooks/useLanguage';
import { getPublicVehicles } from '@/lib/api/publicVehicles';
import type { HeroContent, CarFilterData } from '@/types';
import type { Vehicle } from '@/types/VehicleCard';
import type { SearchFilterState } from '@/types/FilterComponents';

// Initial filter state
const initialFilters: SearchFilterState = {
  vehicleType: '',
  rentalServices: '',
  priceRange: [0, 50000] as [number, number],
  brand: '',
  sortBy: ''
};

const ITEMS_PER_PAGE = 12;

function CarsPage() {
    const { t, isRTL, textDirection } = useLanguage();
    
    // State management
    const [filters, setFilters] = useState<SearchFilterState>(initialFilters);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [totalVehicles, setTotalVehicles] = useState(0);
    const [error, setError] = useState<string | null>(null);
    
    // Hero section content - fully internationalized for cars page
    const heroContent: HeroContent = {
      title: t('cars.title'),
      slogan: t('cars.subtitle'),
      primaryButton: {
        text: t('hero.primaryButton'),
        href: "/booking",
        ariaLabel: t('hero.primaryButton')
      },
      secondaryButton: {
        text: t('hero.secondaryButton'),
        href: "/services",
        ariaLabel: t('hero.secondaryButton')
      }
    };

    // Fetch vehicles from backend
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Prepare API filters
                const apiFilters: any = {
                    page: currentPage,
                    limit: ITEMS_PER_PAGE
                };
                
                // Map frontend filters to API filters
                if (filters.vehicleType) {
                    apiFilters.category = filters.vehicleType;
                }
                if (filters.rentalServices) {
                    apiFilters.rentalService = filters.rentalServices;
                }
                if (filters.brand) {
                    apiFilters.search = filters.brand;
                }
                
                const result = await getPublicVehicles(apiFilters);
                setVehicles(result.vehicles);
                setTotalVehicles(result.total);
            } catch (err) {
                console.error('Error fetching vehicles:', err);
                setError(err instanceof Error ? err.message : 'Failed to load vehicles');
                // Fallback to sample data if API fails
                setVehicles([
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
                            fuelType: "petrol",
                            year: 2023,
                            seats: 5,
                            doors: 4
                        },
                        available: true,
                        featured: true
                    }
                ]);
                setTotalVehicles(2);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, [filters, currentPage]);

    // Client-side filtering for price range (since API doesn't support it yet)
    const filteredVehicles = useMemo(() => {
        return vehicles.filter(vehicle => {
            // Price range filter
            if (vehicle.pricePerDay < filters.priceRange[0] || vehicle.pricePerDay > filters.priceRange[1]) {
                return false;
            }
            return true;
        });
    }, [vehicles, filters.priceRange]);

    // Client-side sorting
    const sortedVehicles = useMemo(() => {
        const sorted = [...filteredVehicles];
        sorted.sort((a, b) => {
            switch (filters.sortBy) {
                case 'price-low-high':
                    return a.pricePerDay - b.pricePerDay;
                case 'price-high-low':
                    return b.pricePerDay - a.pricePerDay;
                case 'year-new-old':
                    return b.year - a.year;
                case 'year-old-new':
                    return a.year - b.year;
                case 'name-z-a':
                    return `${b.make} ${b.model}`.localeCompare(`${a.make} ${a.model}`);
                case 'name-a-z':
                default:
                    return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
            }
        });
        return sorted;
    }, [filteredVehicles, filters.sortBy]);

    // Pagination
    const totalPages = Math.ceil(totalVehicles / ITEMS_PER_PAGE);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters.vehicleType, filters.rentalServices, filters.brand]);

    // Event handlers
    const handleFiltersChange = (newFilters: SearchFilterState) => {
        setFilters(newFilters);
    };

    const handleApplyFilters = () => {
        // Filters are applied automatically via useEffect
        // Scroll to results
        const resultsSection = document.querySelector('[data-results-section]');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        console.log('Applied filters:', {
            ...filters,
            resultsCount: sortedVehicles.length
        });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewMore = (vehicleId: string) => {
        console.log('View more vehicle:', vehicleId);
        window.location.href = `/vehicles/${vehicleId}`;
    };

    const handleBook = (vehicleId: string) => {
        console.log('Book vehicle:', vehicleId);
        window.location.href = `/booking?vehicle=${vehicleId}`;
    };

    const handleCarFilter = (filterData: CarFilterData) => {
        console.log('Car filter submitted:', filterData);
        
        const searchParams = new URLSearchParams({
            pickup_location: filterData.pickupLocation,
            dropoff_location: filterData.dropoffLocation,
            pickup_date: filterData.pickupDate,
            pickup_time: filterData.pickupTime,
            dropoff_date: filterData.dropoffDate,
            dropoff_time: filterData.dropoffTime,
        });
        
        window.location.href = `/search?${searchParams.toString()}`;
    };

    return (
        <>
            {/* Page-level Navbar - Sticky across all sections */}
            <PageNavbar activeNavItem="vehicles" />
            
            {/* Hero Section - Same as Home but with vehicles content and no car/container */}
            <HeroSection
                content={heroContent}
                onCarFilter={handleCarFilter}
                carImage="/hero-section-car.png"
                carImageAlt="K2A Vehicle Fleet"
                showNavbar={false}
                minimal={true}
                activeNavItem="vehicles"
            />
            
            {/* Vehicles Section */}
            <section className="py-20 bg-background" dir={textDirection}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* Sidebar Filter - Position changes based on RTL */}
                        <div className={`lg:w-80 flex-shrink-0 ${isRTL ? 'lg:order-2' : 'lg:order-1'}`}>
                            <SearchFilter
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                onApplyFilters={handleApplyFilters}
                            />
                        </div>

                        {/* Main Content - Position changes based on RTL */}
                        <div className={`flex-1 ${isRTL ? 'lg:order-1' : 'lg:order-2'}`} data-results-section>
                            {/* Results Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                                <div>
                                    <h2 className="font-unbounded font-semibold text-lg text-on-surface mb-2">
                                        {t('cars.results.title')}
                                    </h2>
                                    <p className="text-on-surface-variant">
                                        {t('cars.results.showing')} {sortedVehicles.length} {t('cars.results.of')} {totalVehicles} {t('cars.results.vehicles')}
                                    </p>
                                </div>

                                {/* Sort Dropdown */}
                                <div className="mt-4 sm:mt-0">
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => handleFiltersChange({ ...filters, sortBy: e.target.value })}
                                        className="input-outlined text-sm min-w-[200px]"
                                    >
                                        <option value="name-a-z">{t('filters.sort.nameAZ')}</option>
                                        <option value="name-z-a">{t('filters.sort.nameZA')}</option>
                                        <option value="price-low-high">{t('filters.sort.priceLowHigh')}</option>
                                        <option value="price-high-low">{t('filters.sort.priceHighLow')}</option>
                                        <option value="year-new-old">{t('filters.sort.yearNewOld')}</option>
                                        <option value="year-old-new">{t('filters.sort.yearOldNew')}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Car Grid */}
                            <CarGrid
                                vehicles={sortedVehicles}
                                loading={loading}
                                onViewMore={handleViewMore}
                                onBook={handleBook}
                                className="mb-12"
                            />

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    className="mb-12"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </>
    );
}

export { CarsPage };
export default CarsPage;
