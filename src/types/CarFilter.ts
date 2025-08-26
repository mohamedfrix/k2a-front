/**
 * Car Filter Types
 * 
 * Defines types for filtering and searching vehicles on the cars page
 */

export type TransmissionType = 'automatic' | 'manual' | 'hybrid';
export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric';
export type SortOption = 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'name-asc' | 'name-desc';

export interface PriceRange {
  min: number;
  max: number;
}

export interface CarFilterState {
  // Search
  searchQuery: string;
  
  // Brand & Model
  brands: string[];
  models: string[];
  
  // Specifications
  transmission: TransmissionType[];
  fuelType: FuelType[];
  yearRange: {
    min: number;
    max: number;
  };
  
  // Capacity
  minSeats: number;
  maxSeats: number;
  
  // Pricing
  priceRange: PriceRange;
  
  // Availability
  availableOnly: boolean;
  featuredOnly: boolean;
  
  // Sorting
  sortBy: SortOption;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: keyof CarFilterState;
  title: string;
  type: 'checkbox' | 'radio' | 'range' | 'select' | 'toggle';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

export interface CarFilterProps {
  filters: CarFilterState;
  onFiltersChange: (filters: Partial<CarFilterState>) => void;
  onResetFilters: () => void;
  availableBrands: FilterOption[];
  availableModels: FilterOption[];
  priceRange: PriceRange;
  yearRange: { min: number; max: number };
  totalResults: number;
  className?: string;
}

export interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}
