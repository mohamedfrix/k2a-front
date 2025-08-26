// API utilities for vehicle operations

import { CreateVehicleForm, AdminVehicle } from '@/types/AdminVehicle';
import { AuthError } from '@/types/Auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  details?: any;
}

// Helper function to get auth headers with token
const getAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function to handle API responses
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  const data: ApiResponse<T> = await response.json();
  
  if (!response.ok || !data.success) {
    if (response.status === 401) {
      throw new AuthError('Session expirée. Veuillez vous reconnecter.', 401);
    }
    throw new Error(data.message || 'Une erreur est survenue');
  }
  
  return data.data as T;
};

// Create a new vehicle
export const createVehicle = async (vehicleData: CreateVehicleForm, token: string): Promise<AdminVehicle> => {
  console.log("createVehicle called with data:", vehicleData);
  console.log("API_BASE_URL:", API_BASE_URL);
  
  const headers = getAuthHeaders(token);
  console.log("Headers:", headers);
  
  console.log("Making fetch request...");
  const response = await fetch(`${API_BASE_URL}/vehicles`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(vehicleData),
  });

  console.log("Response status:", response.status);
  console.log("Response headers:", response.headers);
  
  return handleApiResponse<AdminVehicle>(response);
};

// Upload images for a vehicle
export const uploadVehicleImages = async (vehicleId: string, images: File[], token: string): Promise<any> => {
  console.log("uploadVehicleImages called with:", vehicleId, images.length, "images");
  
  const formData = new FormData();
  images.forEach((image, index) => {
    formData.append(`images`, image);
  });

  const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/images`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return handleApiResponse(response);
};

// Get all vehicles with optional filters
export const getVehicles = async (token: string, filters?: Record<string, any>): Promise<{
  vehicles: AdminVehicle[];
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
    headers: getAuthHeaders(token),
  });

  const apiResponse = await handleApiResponse<{
    data: AdminVehicle[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(response);

  // Transform the backend response to match frontend expectations
  return {
    vehicles: apiResponse.data,
    total: apiResponse.pagination.total,
    page: apiResponse.pagination.page,
    limit: apiResponse.pagination.limit
  };
};

// Get vehicle by ID
export const getVehicleById = async (id: string): Promise<AdminVehicle> => {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleApiResponse<AdminVehicle>(response);
};

// Update an existing vehicle
export const updateVehicle = async (id: string, vehicleData: Partial<CreateVehicleForm>, token: string): Promise<AdminVehicle> => {
  console.log("updateVehicle called with id:", id, "data:", vehicleData);
  
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(vehicleData),
  });

  console.log("updateVehicle response status:", response.status);
  return handleApiResponse(response);
};

// Delete vehicle (soft delete)
// Delete a vehicle
export const deleteVehicle = async (id: string, token: string): Promise<void> => {
  console.log("deleteVehicle called with id:", id);
  
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  console.log("deleteVehicle response status:", response.status);
  await handleApiResponse(response);
};

// Update vehicle availability
export const updateVehicleAvailability = async (id: string, availability: boolean): Promise<AdminVehicle> => {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}/availability`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ availability }),
  });

  return handleApiResponse<AdminVehicle>(response);
};

// Update vehicle featured status
export const updateVehicleFeaturedStatus = async (id: string, featured: boolean): Promise<AdminVehicle> => {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}/featured`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ featured }),
  });

  return handleApiResponse<AdminVehicle>(response);
};

// Get vehicle statistics
export const getVehicleStats = async (token: string): Promise<{
  totalVehicles: number;
  availableVehicles: number;
  bookedVehicles: number;
  maintenanceVehicles: number;
  categoryBreakdown: Array<{ category: string; count: number }>;
  rentalServiceBreakdown: Array<{ serviceType: string; count: number }>;
  featuredVehicles: number;
}> => {
  const response = await fetch(`${API_BASE_URL}/vehicles/admin/stats`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleApiResponse(response);
};

// Error types for better error handling
export class VehicleApiError extends Error {
  constructor(message: string, public statusCode?: number, public details?: any) {
    super(message);
    this.name = 'VehicleApiError';
  }
}

// Helper function to create vehicle with images in one transaction
export const createVehicleWithImages = async (
  vehicleData: CreateVehicleForm, 
  images: File[],
  token: string
): Promise<{ vehicle: AdminVehicle; imageUploadResult?: any }> => {
  console.log("createVehicleWithImages called");
  console.log("Vehicle data:", vehicleData);
  console.log("Images:", images);
  
  try {
    console.log("Step 1: Creating vehicle...");
    // First, create the vehicle
    const vehicle = await createVehicle(vehicleData, token);
    console.log("Vehicle created successfully:", vehicle);
    
    // Then, upload images if any
    let imageUploadResult;
    if (images.length > 0) {
      try {
        console.log("Step 2: Uploading images...");
        imageUploadResult = await uploadVehicleImages(vehicle.id, images, token);
        console.log("Images uploaded successfully:", imageUploadResult);
      } catch (imageError) {
        console.warn('Vehicle created but image upload failed:', imageError);
        // Don't throw error for image upload failure as vehicle is already created
      }
    }
    
    console.log("createVehicleWithImages completed successfully");
    return { vehicle, imageUploadResult };
  } catch (error) {
    console.error("Error in createVehicleWithImages:", error);
    if (error instanceof Error) {
      throw new VehicleApiError(error.message);
    }
    throw new VehicleApiError('Une erreur inattendue est survenue');
  }
};