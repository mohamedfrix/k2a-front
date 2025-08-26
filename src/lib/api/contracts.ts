// API utilities for contract operations

import { 
  Contract, 
  CreateContractRequest, 
  UpdateContractRequest,
  ContractQuery,
  ContractsResponse,
  ContractStats,
  VehicleCalendarData
} from '@/types/Contract';
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

// Normalize backend contract shape to frontend-friendly shape
const normalizeContract = (raw: any): Contract => {
  if (!raw) return raw;
  const normalized: any = { ...raw };
  // totalAmount (backend) -> totalPrice (frontend)
  if (raw.totalAmount !== undefined && normalized.totalPrice === undefined) {
    normalized.totalPrice = raw.totalAmount;
  }
  // accessories: backend might return [{ name, price, quantity }] while frontend expects { accessoryName, accessoryPrice }
  if (Array.isArray(raw.accessories)) {
    normalized.accessories = raw.accessories.map((a: any) => ({
      id: a.id,
      contractId: a.contractId || a.contract_id,
      accessoryName: a.name ?? a.accessoryName,
      accessoryPrice: a.price ?? a.accessoryPrice,
      quantity: a.quantity ?? 1,
    }));
  }

  return normalized as Contract;
};

// Create a new contract
export const createContract = async (contractData: CreateContractRequest, token: string): Promise<Contract> => {
  console.log("createContract called with data:", contractData);
  
  const response = await fetch(`${API_BASE_URL}/contracts`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(contractData),
  });

  const data = await handleApiResponse<any>(response);
  return normalizeContract(data);
};

// Get all contracts with optional filters
export const getContracts = async (token: string, query?: ContractQuery): Promise<ContractsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
  }

  const url = `${API_BASE_URL}/contracts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  const data = await handleApiResponse<ContractsResponse>(response);
  // normalize contracts array
  if (data && Array.isArray((data as any).contracts)) {
    (data as any).contracts = (data as any).contracts.map((c: any) => normalizeContract(c));
  }
  return data;
};

// Get contract by ID
export const getContractById = async (id: string, token: string): Promise<Contract> => {
  const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  const data = await handleApiResponse<any>(response);
  return normalizeContract(data);
};

// Update an existing contract
export const updateContract = async (id: string, contractData: UpdateContractRequest, token: string): Promise<Contract> => {
  console.log("updateContract called with id:", id, "data:", contractData);
  
  const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(contractData),
  });

  const data = await handleApiResponse<any>(response);
  return normalizeContract(data);
};

// Delete contract
export const deleteContract = async (id: string, token: string): Promise<void> => {
  console.log("deleteContract called with id:", id);
  
  const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  await handleApiResponse(response);
};

// Update contract status
export const updateContractStatus = async (id: string, status: string, token: string): Promise<Contract> => {
  let endpoint: string;
  
  // Map status to correct endpoint
  switch (status) {
    case 'CONFIRMED':
      endpoint = `${API_BASE_URL}/contracts/${id}/confirm`;
      break;
    case 'ACTIVE':
      endpoint = `${API_BASE_URL}/contracts/${id}/start`;
      break;
    case 'COMPLETED':
      endpoint = `${API_BASE_URL}/contracts/${id}/complete`;
      break;
    case 'CANCELLED':
      endpoint = `${API_BASE_URL}/contracts/${id}/cancel`;
      break;
    default:
      throw new Error(`Invalid status: ${status}`);
  }

  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: getAuthHeaders(token),
  });

  const data = await handleApiResponse<any>(response);
  return normalizeContract(data);
};

// Update contract payment status
export const updateContractPaymentStatus = async (id: string, paymentStatus: string, token: string): Promise<Contract> => {
  // Calculate paid amount based on payment status
  let paidAmount: number;
  
  // First get the contract to know the total amount
  const contract = await getContractById(id, token);
  
  switch (paymentStatus) {
    case 'PENDING':
      paidAmount = 0;
      break;
    case 'PARTIAL':
      // For partial payment, we'll use the deposit amount or 50% of total
      paidAmount = contract.deposit || Math.round(contract.totalPrice * 0.5);
      break;
    case 'PAID':
      paidAmount = contract.totalPrice;
      break;
    case 'REFUNDED':
      paidAmount = 0;
      break;
    default:
      throw new Error(`Invalid payment status: ${paymentStatus}`);
  }

  const response = await fetch(`${API_BASE_URL}/contracts/${id}/payment`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ paidAmount }),
  });

  const data = await handleApiResponse<any>(response);
  return normalizeContract(data);
};

// Get contract statistics
export const getContractStats = async (token: string): Promise<ContractStats> => {
  const response = await fetch(`${API_BASE_URL}/contracts/stats`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleApiResponse<ContractStats>(response);
};

// Get vehicle calendar data
export const getVehicleCalendar = async (token: string, vehicleId?: string): Promise<VehicleCalendarData[]> => {
  const url = vehicleId 
    ? `${API_BASE_URL}/contracts/calendar/${vehicleId}`
    : `${API_BASE_URL}/contracts/calendar`;
    
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleApiResponse<VehicleCalendarData[]>(response);
};

// Check vehicle availability
export const checkVehicleAvailability = async (
  vehicleId: string, 
  startDate: string, 
  endDate: string, 
  token: string,
  excludeContractId?: string
): Promise<{ available: boolean; conflictingContracts?: any[] }> => {
  const queryParams = new URLSearchParams({
    startDate,
    endDate
  });
  
  if (excludeContractId) {
    queryParams.append('excludeContractId', excludeContractId);
  }
  
  const response = await fetch(`${API_BASE_URL}/contracts/vehicle/${vehicleId}/availability?${queryParams.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleApiResponse<{ available: boolean; conflictingContracts?: any[] }>(response);
};

// Export contracts as CSV
export const exportContracts = async (token: string, query?: ContractQuery): Promise<Blob> => {
  const queryParams = new URLSearchParams();
  
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  queryParams.append('export', 'true');

  const response = await fetch(`${API_BASE_URL}/contracts/export?${queryParams.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Failed to export contracts');
  }

  return response.blob();
};

// Extend contract
export const extendContract = async (
  id: string, 
  newEndDate: string, 
  additionalPrice: number, 
  token: string
): Promise<Contract> => {
  const response = await fetch(`${API_BASE_URL}/contracts/${id}/extend`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ newEndDate, additionalPrice }),
  });

  const data = await handleApiResponse<any>(response);
  return normalizeContract(data);
};

// Cancel contract
export const cancelContract = async (
  id: string,
  reason: string,
  token: string,
  refundAmount?: number
): Promise<Contract> => {
  const response = await fetch(`${API_BASE_URL}/contracts/${id}/cancel`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ reason, refundAmount }),
  });

  const data = await handleApiResponse<any>(response);
  return normalizeContract(data);
};

// Error types for better error handling
export class ContractApiError extends Error {
  constructor(message: string, public statusCode?: number, public details?: any) {
    super(message);
    this.name = 'ContractApiError';
  }
}

// Helper function to validate contract dates
export const validateContractDates = (startDate: Date, endDate: Date): string[] => {
  const errors: string[] = [];
  // Helper to coerce to a date-only (local) midnight timestamp
  const toLocalDateOnly = (d: any): Date | null => {
    if (!d) return null;
    const dt = d instanceof Date ? new Date(d) : new Date(String(d));
    if (isNaN(dt.getTime())) return null;
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  };

  const today = toLocalDateOnly(new Date())!;
  const start = toLocalDateOnly(startDate);
  const end = toLocalDateOnly(endDate);

  if (start === null) {
    errors.push('Invalid start date');
  } else if (start.getTime() < today.getTime()) {
    errors.push('Start date cannot be in the past');
  }
  
  if (start !== null && end !== null && end.getTime() <= start.getTime()) {
    errors.push('End date must be after start date');
  }
  
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff > 365) {
    errors.push('Contract duration cannot exceed 365 days');
  }
  
  return errors;
};

// Helper function to calculate contract price
export const calculateContractPrice = (
  dailyRate: number, 
  startDate: Date, 
  endDate: Date, 
  accessories: { accessoryPrice: number; quantity: number }[] = []
): { totalDays: number; basePrice: number; accessoriesPrice: number; totalPrice: number } => {
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const basePrice = dailyRate * totalDays;
  const accessoriesPrice = accessories.reduce((sum, acc) => sum + (acc.accessoryPrice * acc.quantity * totalDays), 0);
  const totalPrice = basePrice + accessoriesPrice;
  
  return {
    totalDays,
    basePrice,
    accessoriesPrice,
    totalPrice
  };
};