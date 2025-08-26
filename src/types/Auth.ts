/**
 * Authentication Types for Frontend
 * Matches backend API response structure
 */

export interface AdminProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: string; // ISO string from API
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  admin: AdminProfile;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface AuthContextType {
  // State
  user: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  
  // Utilities
  getAccessToken: () => string | null;
  isTokenExpired: () => boolean;
}

export class AuthError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'AuthError';
  }
}