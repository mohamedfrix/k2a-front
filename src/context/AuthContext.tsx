"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  AuthContextType, 
  AdminProfile, 
  LoginCredentials, 
  AuthError 
} from '@/types/Auth';
import { 
  loginApi, 
  refreshTokenApi, 
  logoutApi, 
  getProfileApi, 
  isTokenExpired 
} from '@/lib/api/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication Provider Component
 * Manages authentication state and provides auth methods to the app
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = user !== null && accessToken !== null;

  /**
   * Store tokens securely
   * Access token in memory, refresh token in localStorage
   */
  const storeTokens = useCallback((tokens: { accessToken: string; refreshToken: string }) => {
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('adminToken', tokens.accessToken); // For backward compatibility
  }, []);

  /**
   * Clear all authentication data
   */
  const clearAuth = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminToken');
  }, []);

  /**
   * Get current access token
   */
  const getAccessToken = useCallback((): string | null => {
    return accessToken;
  }, [accessToken]);

  /**
   * Check if current token is expired
   */
  const isTokenExpiredCheck = useCallback((): boolean => {
    if (!accessToken) return true;
    return isTokenExpired(accessToken);
  }, [accessToken]);

  /**
   * Refresh access token using refresh token
   */
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    console.log('🔄 Attempting to refresh access token...');
    
    const currentRefreshToken = refreshToken || localStorage.getItem('refreshToken');
    
    if (!currentRefreshToken) {
      console.log('❌ No refresh token available');
      clearAuth();
      return null;
    }

    try {
      const tokens = await refreshTokenApi(currentRefreshToken);
      storeTokens(tokens);
      console.log('✅ Access token refreshed successfully');
      return tokens.accessToken;
    } catch (error) {
      console.error('❌ Failed to refresh token:', error);
      clearAuth();
      
      // Redirect to login if we're on an admin page
      if (pathname?.startsWith('/admin')) {
        router.push('/login');
      }
      
      return null;
    }
  }, [refreshToken, clearAuth, storeTokens, pathname, router]);

  /**
   * Login with credentials
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    
    try {
      console.log('🔐 Logging in user:', credentials.email);
      const authData = await loginApi(credentials);
      
      setUser(authData.admin);
      storeTokens({
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
      });
      
      console.log('✅ Login successful for:', authData.admin.email);
      
      // Redirect to admin dashboard or intended page
      const intendedPath = sessionStorage.getItem('intendedPath') || '/admin/vehicles';
      sessionStorage.removeItem('intendedPath');
      router.push(intendedPath);
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      clearAuth();
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [storeTokens, clearAuth, router]);

  /**
   * Logout user
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Call logout API if we have tokens
      if (accessToken) {
        await logoutApi(accessToken, refreshToken || undefined);
      }
    } catch (error) {
      console.warn('Logout API call failed, but continuing with local cleanup:', error);
    }
    
    clearAuth();
    router.push('/login');
    setIsLoading(false);
  }, [accessToken, refreshToken, clearAuth, router]);

  /**
   * Initialize auth state on app start
   */
  const initializeAuth = useCallback(async () => {
    console.log('🚀 Initializing auth state...');
    
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedAccessToken = localStorage.getItem('adminToken');
    
    if (!storedRefreshToken) {
      console.log('ℹ️ No stored refresh token found');
      setIsLoading(false);
      return;
    }

    try {
      // If we have a stored access token and it's not expired, use it
      if (storedAccessToken && !isTokenExpired(storedAccessToken)) {
        console.log('✅ Valid access token found, fetching profile...');
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        
        const profile = await getProfileApi(storedAccessToken);
        setUser(profile);
        console.log('✅ Auth state restored for:', profile.email);
      } else {
        console.log('🔄 Access token expired or missing, refreshing...');
        // Try to refresh the token
        const tokens = await refreshTokenApi(storedRefreshToken);
        storeTokens(tokens);
        
        const profile = await getProfileApi(tokens.accessToken);
        setUser(profile);
        console.log('✅ Auth state restored via refresh for:', profile.email);
      }
    } catch (error) {
      console.error('❌ Failed to restore auth state:', error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [storeTokens, clearAuth]);

  /**
   * Auto-refresh token when it's about to expire
   */
  const setupAutoRefresh = useCallback(() => {
    if (!accessToken || !refreshToken) return;

    const checkAndRefresh = async () => {
      if (isTokenExpired(accessToken)) {
        console.log('🔄 Access token expiring soon, auto-refreshing...');
        await refreshAccessToken();
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkAndRefresh, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [accessToken, refreshToken, refreshAccessToken]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Setup auto-refresh
  useEffect(() => {
    if (isAuthenticated) {
      return setupAutoRefresh();
    }
  }, [isAuthenticated, setupAutoRefresh]);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken: refreshAccessToken,
    getAccessToken,
    isTokenExpired: isTokenExpiredCheck,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}