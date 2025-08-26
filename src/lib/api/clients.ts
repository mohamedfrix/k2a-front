// API utilities for client operations

import { AuthError } from '@/types/Auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  details?: any;
}

// Frontend client interfaces (matching the backend but with string dates for forms)
export interface CreateClientForm {
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  email?: string;
  adresse: string;
  datePermis: string;
  status?: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
  numeroPermis?: string;
  lieuNaissance?: string;
  nationalite?: string;
  profession?: string;
}

export type UpdateClientForm = Partial<CreateClientForm>;

export interface ClientResponse {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  email?: string;
  adresse: string;
  datePermis: string;
  status: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
  numeroPermis?: string;
  lieuNaissance?: string;
  nationalite?: string;
  profession?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientListResponse {
  clients: ClientResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClientStatsResponse {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  suspendedClients: number;
  statusBreakdown: Array<{
    status: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
    count: number;
  }>;
  recentClients: number;
  clientsWithEmail: number;
  clientsWithoutEmail: number;
}

export interface ClientSearchResult {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  status: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
}

// Convert backend status to frontend status
export const mapBackendStatusToFrontend = (status: 'ACTIF' | 'INACTIF' | 'SUSPENDU'): "Actif" | "Inactif" | "Suspendu" => {
  const statusMap = {
    'ACTIF': 'Actif' as const,
    'INACTIF': 'Inactif' as const,
    'SUSPENDU': 'Suspendu' as const
  };
  return statusMap[status];
};

// Convert frontend status to backend status
export const mapFrontendStatusToBackend = (status: "Actif" | "Inactif" | "Suspendu"): 'ACTIF' | 'INACTIF' | 'SUSPENDU' => {
  const statusMap = {
    'Actif': 'ACTIF' as const,
    'Inactif': 'INACTIF' as const,
    'Suspendu': 'SUSPENDU' as const
  };
  return statusMap[status];
};

// Helper function to convert ISO date to YYYY-MM-DD format
const formatDateToYMD = (isoDate: string): string => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return date.toISOString().split('T')[0]; // Get just the YYYY-MM-DD part
};

// Convert backend client to frontend client
export const mapBackendClientToFrontend = (backendClient: ClientResponse): any => {
  return {
    id: backendClient.id,
    nom: backendClient.nom,
    prenom: backendClient.prenom,
    dateNaissance: formatDateToYMD(backendClient.dateNaissance),
    telephone: backendClient.telephone,
    email: backendClient.email,
    adresse: backendClient.adresse,
    datePermis: formatDateToYMD(backendClient.datePermis),
    status: mapBackendStatusToFrontend(backendClient.status),
    numeroPermis: backendClient.numeroPermis,
    lieuNaissance: backendClient.lieuNaissance,
    nationalite: backendClient.nationalite,
    profession: backendClient.profession,
    isActive: backendClient.isActive,
    createdAt: backendClient.createdAt,
    updatedAt: backendClient.updatedAt
  };
};

// Convert frontend client form to backend format
export const mapFrontendFormToBackend = (formData: any): CreateClientForm => {
  const backendData: CreateClientForm = {
    nom: formData.nom,
    prenom: formData.prenom,
    dateNaissance: formData.dateNaissance && formData.dateNaissance.includes('T') 
      ? formatDateToYMD(formData.dateNaissance) 
      : formData.dateNaissance,
    telephone: formData.telephone,
    adresse: formData.adresse,
    datePermis: formData.datePermis && formData.datePermis.includes('T') 
      ? formatDateToYMD(formData.datePermis) 
      : formData.datePermis
  };
  
  // Optional fields
  if (formData.email) {
    backendData.email = formData.email;
  }
  
  if (formData.status) {
    backendData.status = mapFrontendStatusToBackend(formData.status);
  }
  
  // Additional optional fields (only include if they have values)
  if (formData.numeroPermis) {
    backendData.numeroPermis = formData.numeroPermis;
  }
  if (formData.lieuNaissance) {
    backendData.lieuNaissance = formData.lieuNaissance;
  }
  if (formData.nationalite) {
    backendData.nationalite = formData.nationalite;
  }
  if (formData.profession) {
    backendData.profession = formData.profession;
  }
  
  return backendData;
};

// Convert frontend client update to backend format (for updates)
export const mapFrontendUpdateToBackend = (formData: any): Partial<CreateClientForm> => {
  const backendData: Partial<CreateClientForm> = {};
  
  // Only include fields that are provided
  if (formData.nom !== undefined) backendData.nom = formData.nom;
  if (formData.prenom !== undefined) backendData.prenom = formData.prenom;
  if (formData.dateNaissance !== undefined) {
    // Ensure date is in YYYY-MM-DD format
    backendData.dateNaissance = formData.dateNaissance && formData.dateNaissance.includes('T') 
      ? formatDateToYMD(formData.dateNaissance) 
      : formData.dateNaissance;
  }
  if (formData.telephone !== undefined) backendData.telephone = formData.telephone;
  if (formData.adresse !== undefined) backendData.adresse = formData.adresse;
  if (formData.datePermis !== undefined) {
    // Ensure date is in YYYY-MM-DD format
    backendData.datePermis = formData.datePermis && formData.datePermis.includes('T') 
      ? formatDateToYMD(formData.datePermis) 
      : formData.datePermis;
  }
  if (formData.email !== undefined) backendData.email = formData.email;
  
  if (formData.status !== undefined) {
    backendData.status = mapFrontendStatusToBackend(formData.status);
  }
  
  // Handle optional fields - include even if null to update database
  if (formData.numeroPermis !== undefined) backendData.numeroPermis = formData.numeroPermis;
  if (formData.lieuNaissance !== undefined) backendData.lieuNaissance = formData.lieuNaissance;
  if (formData.nationalite !== undefined) backendData.nationalite = formData.nationalite;
  if (formData.profession !== undefined) backendData.profession = formData.profession;
  
  return backendData;
};

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

// Create a new client
export const createClient = async (clientData: CreateClientForm, token: string): Promise<ClientResponse> => {
  console.log("createClient called with data:", clientData);
  console.log("API_BASE_URL:", API_BASE_URL);
  
  const headers = getAuthHeaders(token);
  console.log("Headers:", headers);
  
  console.log("Making fetch request...");
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(clientData),
  });

  console.log("Response status:", response.status);
  console.log("Response headers:", response.headers);
  
  return handleApiResponse<ClientResponse>(response);
};

// Get all clients with optional filters
export const getClients = async (token: string, filters?: Record<string, any>): Promise<ClientListResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
  }

  const url = `${API_BASE_URL}/clients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleApiResponse(response);
};

// Get client by ID
export const getClientById = async (id: string, token: string): Promise<ClientResponse> => {
  const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleApiResponse<ClientResponse>(response);
};

// Update an existing client
export const updateClient = async (id: string, clientData: Partial<CreateClientForm>, token: string): Promise<ClientResponse> => {
  console.log("updateClient called with id:", id, "data:", clientData);
  
  const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(clientData),
  });

  console.log("updateClient response status:", response.status);
  return handleApiResponse(response);
};

// Delete client (soft delete)
export const deleteClient = async (id: string, token: string): Promise<void> => {
  console.log("deleteClient called with id:", id);
  
  const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  console.log("deleteClient response status:", response.status);
  await handleApiResponse(response);
};

// Update client status
export const updateClientStatus = async (id: string, status: 'ACTIF' | 'INACTIF' | 'SUSPENDU', token: string): Promise<ClientResponse> => {
  const response = await fetch(`${API_BASE_URL}/clients/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ status }),
  });

  return handleApiResponse<ClientResponse>(response);
};

// Search clients
export const searchClients = async (query: string, token: string, limit?: number): Promise<ClientSearchResult[]> => {
  const queryParams = new URLSearchParams();
  queryParams.append('query', query);
  if (limit) {
    queryParams.append('limit', limit.toString());
  }

  const response = await fetch(`${API_BASE_URL}/clients/search?${queryParams.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleApiResponse(response);
};

// Get client statistics
export const getClientStats = async (token: string): Promise<ClientStatsResponse> => {
  const response = await fetch(`${API_BASE_URL}/clients/stats`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleApiResponse(response);
};

// Bulk update client status
export const bulkUpdateClientStatus = async (
  clientIds: string[], 
  status: 'ACTIF' | 'INACTIF' | 'SUSPENDU', 
  token: string
): Promise<{ success: boolean; affectedCount: number; errors?: any[] }> => {
  const response = await fetch(`${API_BASE_URL}/clients/bulk/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ clientIds, status }),
  });

  return handleApiResponse(response);
};

// Get clients by status
export const getClientsByStatus = async (
  status: 'ACTIF' | 'INACTIF' | 'SUSPENDU', 
  token: string, 
  limit?: number
): Promise<ClientResponse[]> => {
  const queryParams = new URLSearchParams();
  if (limit) {
    queryParams.append('limit', limit.toString());
  }

  const url = `${API_BASE_URL}/clients/status/${status}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleApiResponse(response);
};

// Get recent clients
export const getRecentClients = async (token: string, limit?: number): Promise<ClientListResponse> => {
  const queryParams = new URLSearchParams();
  if (limit) {
    queryParams.append('limit', limit.toString());
  }

  const url = `${API_BASE_URL}/clients/recent${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleApiResponse(response);
};

// Validate unique email
export const validateUniqueEmail = async (email: string, token: string, excludeId?: string): Promise<{ isUnique: boolean }> => {
  const queryParams = new URLSearchParams();
  if (excludeId) {
    queryParams.append('excludeId', excludeId);
  }

  const url = `${API_BASE_URL}/clients/validate-email${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ email }),
  });

  return handleApiResponse(response);
};

// Validate unique phone
export const validateUniquePhone = async (telephone: string, token: string, excludeId?: string): Promise<{ isUnique: boolean }> => {
  const queryParams = new URLSearchParams();
  if (excludeId) {
    queryParams.append('excludeId', excludeId);
  }

  const url = `${API_BASE_URL}/clients/validate-phone${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ telephone }),
  });

  return handleApiResponse(response);
};

// Error types for better error handling
export class ClientApiError extends Error {
  constructor(message: string, public statusCode?: number, public details?: any) {
    super(message);
    this.name = 'ClientApiError';
  }
}

// Helper function to format dates for display
export const formatDateForDisplay = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('fr-FR');
  } catch (error) {
    return dateString;
  }
};

// Helper function to format dates for form inputs
export const formatDateForInput = (dateString: string): string => {
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (error) {
    return dateString;
  }
};

// Helper function to calculate age
export const calculateAge = (dateNaissance: string): number => {
  try {
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    return 0;
  }
};