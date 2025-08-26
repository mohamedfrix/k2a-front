import { useState, useEffect } from 'react';
import { getVehicleStats } from '@/lib/api/vehicles';
import { getContractStats } from '@/lib/api/contracts';
import { getClientStats } from '@/lib/api/clients';
import { useAuth } from '@/context/AuthContext';

export interface DashboardStats {
  vehicleStats: {
    totalVehicles: number;
    availableVehicles: number;
    bookedVehicles: number;
    maintenanceVehicles: number;
    categoryBreakdown: Array<{ category: string; count: number }>;
    rentalServiceBreakdown: Array<{ serviceType: string; count: number }>;
    featuredVehicles: number;
  } | null;
  contractStats: {
    totalContracts: number;
    totalRevenue: number;
    averageContractValue: number;
    contractsByStatus: {
      pending: number;
      confirmed: number;
      active: number;
      completed: number;
      cancelled: number;
    };
    // convenience field for components
    activeContracts?: number;
    serviceTypeBreakdown: Array<{
      serviceType: string;
      count: number;
      revenue: number;
    }>;
    statusBreakdown: Array<{
      status: string;
      count: number;
    }>;
    contractsByPaymentStatus: {
      pending: number;
      depositPaid: number;
      paid: number;
      refunded: number;
    };
    monthlyRevenue: Array<{
      month: string;
      revenue: number;
      contractCount: number;
    }>;
    topVehicles: Array<{
      vehicleId: string;
      vehicleName: string;
      contractCount: number;
      totalRevenue: number;
    }>;
  } | null;
  clientStats: {
    totalClients: number;
    activeClients: number;
    inactiveClients: number;
    suspendedClients: number;
    statusBreakdown: Array<{
      status: "Actif" | "Inactif" | "Suspendu";
      count: number;
    }>;
    recentClients: number;
    clientsWithEmail: number;
    clientsWithoutEmail: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export const useDashboardStats = () => {
  const { getAccessToken } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    vehicleStats: null,
    contractStats: null,
    clientStats: null,
    loading: true,
    error: null,
  });

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      
      const token = getAccessToken();
      if (!token) {
        throw new Error('No access token available');
      }

      // Fetch all statistics in parallel
      const [vehicleStats, contractStats, clientStats] = await Promise.all([
        getVehicleStats(token),
        getContractStats(token),
        getClientStats(token),
      ]);

      // normalize client status labels to frontend language
      const normalizedClientStats = clientStats
        ? {
            ...clientStats,
            statusBreakdown: (clientStats.statusBreakdown || []).map((s: any) => ({
              status: s.status === 'ACTIF' ? 'Actif' : s.status === 'INACTIF' ? 'Inactif' : 'Suspendu',
              count: s.count,
            })) as { status: 'Actif' | 'Inactif' | 'Suspendu'; count: number }[],
          }
        : clientStats;

      setStats({
        vehicleStats,
        contractStats: {
          ...contractStats,
          activeContracts: (contractStats as any)?.contractsByStatus?.active ?? 0,
        } as any,
        clientStats: normalizedClientStats,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch statistics',
      }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refetch = () => {
    fetchStats();
  };

  return {
    ...stats,
    refetch,
  };
}; 