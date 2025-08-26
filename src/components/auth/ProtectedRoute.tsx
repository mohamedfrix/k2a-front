"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * Wraps admin routes to ensure only authenticated users can access them
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('🚫 Unauthenticated access attempt to:', pathname);
      
      // Store intended path for redirect after login
      if (pathname !== '/login') {
        sessionStorage.setItem('intendedPath', pathname);
      }
      
      // Redirect to login
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Vérification de l'authentification...</p>
          </div>
        </div>
      )
    );
  }

  // Show unauthorized message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Accès non autorisé</h1>
          <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à cette page.</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // Check if admin account is active
  if (user && !user.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Compte désactivé</h1>
          <p className="text-gray-600 mb-4">
            Votre compte administrateur a été désactivé. 
            Veuillez contacter l'administrateur système.
          </p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  // Render protected content for authenticated users
  return <>{children}</>;
}

/**
 * Higher-order component for protecting routes
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactNode;
    redirectTo?: string;
  }
) {
  const WrappedComponent = (props: P) => {
    return (
      <ProtectedRoute fallback={options?.fallback}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Hook to check if user has specific permissions (for future use)
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated || !user) return false;
    
    // For now, all authenticated admins have all permissions
    // This can be extended later with role-based permissions
    return user.isActive;
  };

  const isAdmin = (): boolean => {
    return isAuthenticated && user?.isActive === true;
  };

  return {
    hasPermission,
    isAdmin,
    user,
    isAuthenticated,
  };
}