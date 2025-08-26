/**
 * Hero Section Types
 * 
 * TypeScript interfaces for the hero section components following K2A design system
 */

export interface HeroContent {
  title: string;
  slogan: string;
  primaryButton: {
    text: string;
    href: string;
    ariaLabel?: string;
  };
  secondaryButton: {
    text: string;
    href: string;
    ariaLabel?: string;
  };
}

export interface CarFilterData {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
}

export interface CarFilterProps {
  onFilter: (filterData: CarFilterData) => void;
  initialData?: Partial<CarFilterData>;
  className?: string;
}

export interface HeroSectionProps {
  content: HeroContent;
  carImage?: string;
  carImageAlt?: string;
  onCarFilter?: (filterData: CarFilterData) => void;
  className?: string;
  showNavbar?: boolean;
  minimal?: boolean; // New prop to show only navbar and background
  activeNavItem?: string; // ID of the active navigation item
}

export interface LocationOption {
  id: string;
  name: string;
  city: string;
  address: string;
}

export interface TimeOption {
  value: string;
  label: string;
}
