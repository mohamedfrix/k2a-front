import { StaticImageData } from "next/image";

export interface VehicleImage {
  url: string | StaticImageData;
  alt: string;
  isPrimary?: boolean;
}

export interface VehicleSpecs {
  transmission: 'manual' | 'automatic' | 'hybrid';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  year: number;
  seats?: number;
  doors?: number;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  location: string;
  pricePerDay: number;
  currency: string;
  images: VehicleImage[];
  specs: VehicleSpecs;
  available: boolean;
  featured?: boolean;
  // Optional backend-provided fields (preserved from API)
  engine?: string;
  power?: string;
  consumption?: string;
  acceleration?: string;
  maxSpeed?: string;
  trunkCapacity?: string;
  mileage?: number | string;
  licensePlate?: string;
  vin?: string;
  doors?: number;
  category?: string;
  features?: string[];
  description?: string;
}

export interface VehicleCardProps {
  vehicle: Vehicle;
  className?: string;
  variant?: 'compact' | 'detailed';
  onViewMore?: (vehicleId: string) => void;
  onBook?: (vehicleId: string) => void;
}
