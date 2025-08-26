/**
 * Cars Page Types
 * 
 * Defines types specific to the cars listing page
 */

import { Vehicle } from './VehicleCard';
import { CarFilterState } from './CarFilter';

export interface CarsPageProps {
  initialVehicles?: Vehicle[];
  className?: string;
}

export interface CarGridProps {
  vehicles: Vehicle[];
  loading?: boolean;
  onViewMore: (vehicleId: string) => void;
  onBook: (vehicleId: string) => void;
  className?: string;
}

export interface CarGridItemProps {
  vehicle: Vehicle;
  onViewMore: (vehicleId: string) => void;
  onBook: (vehicleId: string) => void;
  className?: string;
}

export interface CarsPageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface CarSearchResultsProps {
  vehicles: Vehicle[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: CarFilterState;
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: Partial<CarFilterState>) => void;
  onViewMore: (vehicleId: string) => void;
  onBook: (vehicleId: string) => void;
  loading?: boolean;
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: number;
  className?: string;
}

export interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export interface WaveDecorProps {
  className?: string;
  color?: string;
}
