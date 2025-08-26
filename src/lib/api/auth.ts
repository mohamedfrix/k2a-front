/**
 * Authentication API Utilities
 * Handles all auth-related API calls to the backend
 */

import { 
  LoginCredentials, 
  AuthResponse, 
  TokenResponse, 
  AdminProfile, 
  ApiResponse,
  AuthError 
} from '@/types/Auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Handle API response and extract data
 */
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  const data: ApiResponse<T> = await response.json();
  
  if (!response.ok || !data.success) {
    throw new AuthError(data.message || 'Une erreur est survenue', response.status);
  }
  
  return data.data as T;
};

/**
 * Login with email and password
 */
export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  console.log('🔐 Attempting login for:', credentials.email);
  
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const result = await handleApiResponse<AuthResponse>(response);
  console.log('✅ Login successful for:', result.admin.email);
  
  return result;
};

/**
 * Refresh access token using refresh token
 */
export const refreshTokenApi = async (refreshToken: string): Promise<TokenResponse> => {
  console.log('🔄 Refreshing access token...');
  
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const result = await handleApiResponse<TokenResponse>(response);
  console.log('✅ Token refreshed successfully');
  
  return result;
};

/**
 * Logout and invalidate refresh token
 */
export const logoutApi = async (accessToken: string, refreshToken?: string): Promise<void> => {
  console.log('👋 Logging out...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      console.log('✅ Logout successful');
    } else {
      console.warn('⚠️ Logout request failed, but continuing with local cleanup');
    }
  } catch (error) {
    console.warn('⚠️ Logout request failed, but continuing with local cleanup:', error);
  }
};

/**
 * Get admin profile information
 */
export const getProfileApi = async (accessToken: string): Promise<AdminProfile> => {
  console.log('👤 Fetching admin profile...');
  
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const result = await handleApiResponse<AdminProfile>(response);
  console.log('✅ Profile fetched for:', result.email);
  
  return result;
};

/**
 * Check if access token is expired
 * JWT tokens contain expiration in payload
 */
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  
  try {
    // Decode JWT payload (without verification - just for expiry check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token expires within next 5 minutes (300 seconds)
    const expiresAt = payload.exp;
    const timeUntilExpiry = expiresAt - currentTime;
    
    return timeUntilExpiry <= 300; // Refresh if expires within 5 minutes
  } catch (error) {
    console.warn('Error checking token expiry:', error);
    return true; // Assume expired if we can't decode
  }
};

/**
 * Setup first admin account (only works if no admins exist)
 */
export const setupAdminApi = async (adminData: {
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
}): Promise<AdminProfile> => {
  console.log('🔧 Setting up first admin account...');
  
  const response = await fetch(`${API_BASE_URL}/auth/setup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(adminData),
  });

  const result = await handleApiResponse<AdminProfile>(response);
  console.log('✅ Admin account setup successful for:', result.email);
  
  return result;
};