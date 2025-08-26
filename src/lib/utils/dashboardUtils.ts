// Utility functions for dashboard calculations and formatting

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const calculatePercentageChange = (current: number, previous: number): string => {
  if (previous === 0) {
    return current > 0 ? '+100%' : '0%';
  }
  
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};

export const calculateUtilizationRate = (booked: number, total: number): number => {
  if (total === 0) return 0;
  return (booked / total) * 100;
};

export const calculateCompletionRate = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return (completed / total) * 100;
};

export const calculateAverageRevenuePerVehicle = (totalRevenue: number, totalVehicles: number): number => {
  if (totalVehicles === 0) return 0;
  return totalRevenue / totalVehicles;
};

export const getTimeIntervalText = (days: number): string => {
  switch (days) {
    case 7:
      return 'Last 7 days';
    case 30:
      return 'Last 30 days';
    case 90:
      return 'Last 90 days';
    default:
      return `Last ${days} days`;
  }
};

// Mock data for percentage changes (in a real app, you'd fetch historical data)
export const getMockPercentageChange = (metric: string): string => {
  const changes = {
    revenue: '+12.5%',
    contracts: '+8.3%',
    clients: '+15.2%',
    vehicles: '+5.7%',
    utilization: '+3.2%',
  };
  return changes[metric as keyof typeof changes] || '+0%';
};

// Generate recent activities based on available data
export const generateRecentActivities = (
  contractStats: any,
  clientStats: any,
  vehicleStats: any
) => {
  const activities = [];
  
  if (contractStats?.recentContracts) {
    activities.push({
      id: 1,
      type: 'New Contract',
      details: `${contractStats.recentContracts} new contracts created`,
      icon: 'contracts',
    });
  }
  
  if (clientStats?.recentClients) {
    activities.push({
      id: 2,
      type: 'New Client',
      details: `${clientStats.recentClients} new clients registered`,
      icon: 'clients',
    });
  }
  
  if (contractStats?.completedContracts) {
    activities.push({
      id: 3,
      type: 'Contract Completed',
      details: `${contractStats.completedContracts} contracts completed`,
      icon: 'active-contracts',
    });
  }
  
  const paidPayments = contractStats?.paymentStatusBreakdown?.find((p: { paymentStatus?: string; count?: number }) => p.paymentStatus === 'PAID');
  if (paidPayments) {
    activities.push({
      id: 4,
      type: 'Payment Received',
      details: `${paidPayments.count} payments received`,
      icon: 'revenue',
    });
  }
  
  return activities.slice(0, 4); // Return max 4 activities
}; 