// Frontend contract types for React components and API integration

// Core Contract Types
export interface Contract {
  id: string;
  vehicleId: string;
  clientId: string;
  adminId: string;
  
  // Dates
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Pricing
  totalPrice: number;
  deposit: number;
  dailyRate: number;
  
  // Status
  status: ContractStatus;
  paymentStatus: PaymentStatus;
  
  // Optional fields
  notes?: string;
  
  // Relations
  vehicle?: Vehicle;
  client?: Client;
  admin?: Admin;
  accessories?: ContractAccessory[];
}

export interface ContractAccessory {
  id: string;
  contractId: string;
  accessoryName: string;
  accessoryPrice: number;
  quantity: number;
}

// Enums
export enum ContractStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

// Form Types
export interface CreateContractRequest {
  vehicleId: string;
  clientId: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  serviceType?: string;
  totalPrice: number;
  deposit: number;
  dailyRate: number;
  notes?: string;
  accessories?: CreateContractAccessoryRequest[];
}

export interface CreateContractAccessoryRequest {
  accessoryName: string;
  accessoryPrice: number;
  quantity: number;
}

export interface UpdateContractRequest {
  startDate?: string;
  endDate?: string;
  totalPrice?: number;
  deposit?: number;
  dailyRate?: number;
  status?: ContractStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
  accessories?: CreateContractAccessoryRequest[];
}

// Query and Filter Types
export interface ContractQuery {
  page?: number;
  limit?: number;
  vehicleId?: string;
  clientId?: string;
  status?: ContractStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: 'createdAt' | 'startDate' | 'endDate' | 'totalPrice';
  sortOrder?: 'asc' | 'desc';
}

export interface ContractFilter {
  status: ContractStatus | 'ALL';
  paymentStatus: PaymentStatus | 'ALL';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  vehicleId: string | 'ALL';
  clientId: string | 'ALL';
  search: string;
}

// API Response Types
export interface ContractsResponse {
  contracts: Contract[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ContractResponse {
  success: boolean;
  data: Contract;
  message?: string;
}

export interface ContractsListResponse {
  success: boolean;
  data: ContractsResponse;
  message?: string;
}

// Statistics Types
export interface ContractStats {
  totalContracts: number;
  activeContracts: number;
  completedContracts: number;
  cancelledContracts: number;
  pendingContracts: number;
  
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  
  serviceTypeBreakdown: Array<{
    serviceType: string;
    count: number;
    revenue: number;
  }>;
  
  statusBreakdown: Array<{
    status: string;
    count: number;
  }>;
  
  paymentStatusBreakdown: Array<{
    paymentStatus: string;
    count: number;
    amount: number;
  }>;
  
  recentContracts: number;
  averageContractValue: number;
  averageRentalDuration: number;
}

export interface ContractStatsResponse {
  success: boolean;
  data: ContractStats;
  message?: string;
}

// Calendar Types
export interface VehicleCalendarData {
  vehicleId: string;
  vehicleName: string;
  bookings: Array<{
    id: string;
    startDate: string;
    endDate: string;
    status: ContractStatus;
    clientName: string;
  }>;
  availability: Array<{
    date: string;
    available: boolean;
    reason?: string;
  }>;
}

export interface CalendarResponse {
  success: boolean;
  data: VehicleCalendarData[];
  message?: string;
}

// Table and UI Types
export interface ContractTableColumn {
  id: keyof Contract | 'actions';
  label: string;
  sortable: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface ContractTableRow extends Contract {
  clientName: string;
  vehicleName: string;
  duration: number; // days
  formattedDates: string;
  statusColor: string;
  paymentStatusColor: string;
}

// Form State Types
export interface ContractFormState {
  vehicleId: string;
  clientId: string;
  startDate: Date | null;
  endDate: Date | null;
  totalPrice: number;
  deposit: number;
  dailyRate: number;
  serviceType?: string;
  notes: string;
  accessories: CreateContractAccessoryRequest[];
  errors: Record<string, string>;
  isLoading: boolean;
}

// Dialog Types
export interface ContractDialogProps {
  open: boolean;
  onClose: () => void;
  contract?: Contract;
  mode: 'create' | 'edit' | 'view' | 'details';
  onSuccess?: (contract: Contract) => void;
}

// Hook Types
export interface UseContractsOptions {
  query?: ContractQuery;
  enabled?: boolean;
  refetchInterval?: number;
}

export interface UseContractsReturn {
  contracts: Contract[];
  pagination: ContractsResponse['pagination'];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  updateQuery: (query: Partial<ContractQuery>) => void;
}

// Action Types for reducers
export type ContractAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONTRACTS'; payload: ContractsResponse }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_CONTRACT'; payload: Contract }
  | { type: 'DELETE_CONTRACT'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<ContractFilter> }
  | { type: 'RESET_FILTER' };

// Utility Types
export type ContractStatusColors = {
  [K in ContractStatus]: {
    bg: string;
    text: string;
    border: string;
  };
};

export type PaymentStatusColors = {
  [K in PaymentStatus]: {
    bg: string;
    text: string;
    border: string;
  };
};

// Related types from other modules (re-exported for convenience)
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  fuelType: string;
  transmission: string;
  seats: number;
  doors: number;
  dailyRate: number;
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'RETIRED';
  images: string[];
  features: string[];
  description?: string;
  licensePlate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: Date;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  dateOfBirth: Date;
  emergencyContact?: string;
  emergencyPhone?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}