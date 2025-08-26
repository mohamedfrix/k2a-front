// Public API utilities for vehicle operations (frontend pages)

import { Vehicle } from '@/types/VehicleCard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  details?: any;
}

// Helper function to handle API responses
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  const data: ApiResponse<T> = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Une erreur est survenue');
  }
  
  return data.data as T;
};

// Transform backend vehicle data to frontend format
const transformVehicle = (backendVehicle: any): Vehicle => {
  return {
    id: backendVehicle.id,
    make: backendVehicle.make,
    model: backendVehicle.model,
    year: backendVehicle.year,
    location: backendVehicle.location || 'Tizi Ouzou',
    pricePerDay: backendVehicle.dailyRate || backendVehicle.pricePerDay,
    currency: backendVehicle.currency || 'DA',
    images: backendVehicle.images?.map((img: any) => ({
      // Backend sometimes returns `imageUrl` while other places use `url`.
      // Prefer `imageUrl` then fall back to `url` so the frontend always
      // gets a usable `url` field (string or StaticImageData).
      url: img.imageUrl ?? img.url ?? '',
      alt: img.alt || `${backendVehicle.make} ${backendVehicle.model}`,
      isPrimary: img.isPrimary || false
    })) || [],
    specs: {
      transmission: backendVehicle.transmission || 'automatic',
      fuelType: backendVehicle.fuelType || 'petrol',
      year: backendVehicle.year,
      seats: backendVehicle.seats || 5,
      doors: backendVehicle.doors || 4
    },
    available: backendVehicle.available !== false,
    featured: backendVehicle.featured || false
  ,
    // Preserve other backend-provided optional fields so normalizer can use them
    engine: backendVehicle.engine,
    power: backendVehicle.power,
    consumption: backendVehicle.consumption,
    acceleration: backendVehicle.acceleration,
    maxSpeed: backendVehicle.maxSpeed,
    trunkCapacity: backendVehicle.trunkCapacity,
    mileage: backendVehicle.mileage,
    licensePlate: backendVehicle.licensePlate,
    vin: backendVehicle.vin,
    doors: backendVehicle.doors,
    category: backendVehicle.category,
    features: backendVehicle.features,
    description: backendVehicle.description
  };
};

// Get all vehicles with optional filters
export const getPublicVehicles = async (filters?: {
  category?: string;
  rentalService?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
}): Promise<{
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
}> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
  }

  const url = `${API_BASE_URL}/vehicles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const apiResponse = await handleApiResponse<{
    data: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(response);

  return {
    vehicles: apiResponse.data.map(transformVehicle),
    total: apiResponse.pagination.total,
    page: apiResponse.pagination.page,
    limit: apiResponse.pagination.limit
  };
};

// Get featured vehicles
export const getFeaturedVehicles = async (limit: number = 4): Promise<Vehicle[]> => {
  const response = await fetch(`${API_BASE_URL}/vehicles/featured?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await handleApiResponse<any[]>(response);
  return data.map(transformVehicle);
};

// Get vehicle by ID
export const getPublicVehicleById = async (id: string): Promise<Vehicle> => {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await handleApiResponse<any>(response);
  return transformVehicle(data);
};

// Search vehicles
export const searchVehicles = async (searchTerm: string): Promise<Vehicle[]> => {
  const response = await fetch(`${API_BASE_URL}/vehicles/search?q=${encodeURIComponent(searchTerm)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await handleApiResponse<any[]>(response);
  return data.map(transformVehicle);
};

// Get vehicles by category
export const getVehiclesByCategory = async (category: string): Promise<Vehicle[]> => {
  const response = await fetch(`${API_BASE_URL}/vehicles/category/${category}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await handleApiResponse<any[]>(response);
  return data.map(transformVehicle);
};

// Get vehicles by rental service
export const getVehiclesByRentalService = async (serviceType: string): Promise<Vehicle[]> => {
  const response = await fetch(`${API_BASE_URL}/vehicles/rental-service/${serviceType}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await handleApiResponse<any[]>(response);
  return data.map(transformVehicle);
};

// Check vehicle availability
export const checkVehicleAvailability = async (
  vehicleId: string, 
  startDate: string, 
  endDate: string
): Promise<{ available: boolean; conflictingContracts?: any[] }> => {
  const queryParams = new URLSearchParams({
    startDate,
    endDate
  });
  
  const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/availability?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleApiResponse<{ available: boolean; conflictingContracts?: any[] }>(response);
};

// Get vehicle recommendations
export const getVehicleRecommendations = async (vehicleId: string, limit: number = 4): Promise<Vehicle[]> => {
  const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/recommendations?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await handleApiResponse<any[]>(response);
  return data.map(transformVehicle);
}; 