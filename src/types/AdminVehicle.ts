// Admin Vehicle Types - matching backend structure

export enum FuelType {
  GASOLINE = 'GASOLINE',
  DIESEL = 'DIESEL', 
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
  PLUGIN_HYBRID = 'PLUGIN_HYBRID'
}

export enum Transmission {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
  CVT = 'CVT'
}

export enum VehicleCategory {
  ECONOMY = 'ECONOMY',
  COMPACT = 'COMPACT', 
  MIDSIZE = 'MIDSIZE',
  FULLSIZE = 'FULLSIZE',
  LUXURY = 'LUXURY',
  SUV = 'SUV',
  VAN = 'VAN',
  TRUCK = 'TRUCK',
  CONVERTIBLE = 'CONVERTIBLE',
  SPORTS = 'SPORTS'
}

export enum RentalServiceType {
  INDIVIDUAL = 'INDIVIDUAL',
  EVENTS = 'EVENTS',
  ENTERPRISE = 'ENTERPRISE'
}

export interface AdminVehicleImage {
  id: string;
  imageUrl: string;
  alt?: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface AdminVehicleRentalService {
  id: string;
  rentalServiceType: RentalServiceType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin?: string;
  mileage?: number;
  fuelType: FuelType;
  transmission: Transmission;
  seats: number;
  doors: number;
  category: VehicleCategory;
  pricePerDay: number;
  availability: boolean;
  location: string;
  description?: string;
  features: string[];
  featured: boolean;
  engine?: string;
  power?: string;
  consumption?: string;
  acceleration?: string;
  maxSpeed?: string;
  trunkCapacity?: string;
  rating: number;
  reviewCount: number;
  images: AdminVehicleImage[];
  rentalServices: AdminVehicleRentalService[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleForm {
  // Basic Information (Required)
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  
  // Specifications (Required)
  fuelType: FuelType;
  transmission: Transmission;
  seats: number;
  doors: number;
  category: VehicleCategory;
  
  // Pricing & Location (Required)
  pricePerDay: number;
  location: string;
  
  // Rental Services (Required - at least one)
  rentalServices: RentalServiceType[];
  
  // Optional Fields
  vin?: string;
  mileage?: number;
  description?: string;
  engine?: string;
  power?: string;
  consumption?: string;
  acceleration?: string;
  maxSpeed?: string;
  trunkCapacity?: string;
  features?: string[];
  featured?: boolean;
}

// Helper functions for frontend display
export const getFuelTypeDisplayName = (fuelType: FuelType): string => {
  const mapping: Record<FuelType, string> = {
    [FuelType.GASOLINE]: 'Essence',
    [FuelType.DIESEL]: 'Diesel',
    [FuelType.ELECTRIC]: 'Électrique',
    [FuelType.HYBRID]: 'Hybride',
    [FuelType.PLUGIN_HYBRID]: 'Hybride Rechargeable'
  };
  return mapping[fuelType];
};

export const getTransmissionDisplayName = (transmission: Transmission): string => {
  const mapping: Record<Transmission, string> = {
    [Transmission.MANUAL]: 'Manuelle',
    [Transmission.AUTOMATIC]: 'Automatique',
    [Transmission.CVT]: 'CVT'
  };
  return mapping[transmission];
};

export const getCategoryDisplayName = (category: VehicleCategory): string => {
  const mapping: Record<VehicleCategory, string> = {
    [VehicleCategory.ECONOMY]: 'Économique',
    [VehicleCategory.COMPACT]: 'Compacte',
    [VehicleCategory.MIDSIZE]: 'Moyenne',
    [VehicleCategory.FULLSIZE]: 'Grande',
    [VehicleCategory.LUXURY]: 'Luxe',
    [VehicleCategory.SUV]: 'SUV',
    [VehicleCategory.VAN]: 'Fourgonnette',
    [VehicleCategory.TRUCK]: 'Camion',
    [VehicleCategory.CONVERTIBLE]: 'Cabriolet',
    [VehicleCategory.SPORTS]: 'Sport'
  };
  return mapping[category];
};

export const getRentalServiceDisplayName = (service: RentalServiceType): string => {
  const mapping: Record<RentalServiceType, string> = {
    [RentalServiceType.INDIVIDUAL]: 'Particulier',
    [RentalServiceType.EVENTS]: 'Événements',
    [RentalServiceType.ENTERPRISE]: 'Entreprise'
  };
  return mapping[service];
};