'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Download, Filter, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange, DateRange } from '@/components/ui/date-range-picker';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/context/AuthContext';
import { ContractDataTable } from './data-table';
import { CreateContractDialog } from './create-contract-dialog';
import {
  getContracts,
  getContractStats,
  exportContracts
} from '@/lib/api/contracts';
import {
  getVehicles
} from '@/lib/api/vehicles';
import {
  getClients,
  ClientResponse
} from '@/lib/api/clients';
import {
  Contract,
  ContractFilter,
  ContractQuery,
  ContractStatus,
  PaymentStatus,
  ContractsResponse,
  ContractStats,
} from '@/types/Contract';
import { AdminVehicle } from '@/types/AdminVehicle';
import { Client } from '@/types/Client';

export default function ContractsPage() {
  const { t } = useLanguage();
  const { getAccessToken, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // State
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [stats, setStats] = useState<ContractStats | null>(null);
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  
  // Filter state
  const [filter, setFilter] = useState<ContractFilter>({
    status: 'ALL',
    paymentStatus: 'ALL',
    dateRange: { start: null, end: null },
    vehicleId: 'ALL',
    clientId: 'ALL',
    search: '',
  });
  
  // Query state
  const [query, setQuery] = useState<ContractQuery>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Load initial data
  useEffect(() => {
    // Wait for auth initialization before fetching protected resources.
    if (authLoading) return;
    if (!isAuthenticated) {
      // No authenticated admin — stop loading and skip protected fetches.
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    Promise.all([
      fetchContracts(),
      fetchStats(),
      fetchVehicles(),
      fetchClients(),
    ]).finally(() => setIsLoading(false));
  }, [authLoading, isAuthenticated]);

  // Refetch contracts when query changes
  useEffect(() => {
    fetchContracts();
  }, [query]);

  // API functions
  const fetchContracts = async () => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No access token');
      
      setError(null);
      const response = await getContracts(token, query);
      setContracts(response.contracts);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contracts');
    }
  };

  const fetchStats = async () => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No access token');
      
      const stats = await getContractStats(token);
      setStats(stats);
    } catch (err) {
      console.error('Failed to fetch contract stats:', err);
    }
  };

  const fetchVehicles = async () => {
    try {
      const token = getAccessToken();
      console.debug('fetchVehicles token:', token);
      if (!token) throw new Error('No access token');
      
      const response = await getVehicles(token);
      setVehicles(response.vehicles);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    }
  };

  const fetchClients = async () => {
    try {
      const token = getAccessToken();
      console.debug('fetchClients token:', token);
      if (!token) throw new Error('No access token');
      
      const response = await getClients(token);
      // Transform ClientResponse to Client for contract compatibility
      const transformedClients: Client[] = response.clients.map(client => ({
        ...client,
        status: client.status === 'ACTIF' ? 'Actif' : 
                client.status === 'INACTIF' ? 'Inactif' : 'Suspendu'
      }));
      setClients(transformedClients);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
  };

  // Filter handlers
  const handleFilterChange = (key: keyof ContractFilter, value: any) => {
    const newFilter = { ...filter, [key]: value };
    setFilter(newFilter);
    
    // Convert filter to query
    const newQuery: ContractQuery = {
      ...query,
      page: 1, // Reset to first page
      status: newFilter.status !== 'ALL' ? newFilter.status as ContractStatus : undefined,
      paymentStatus: newFilter.paymentStatus !== 'ALL' ? newFilter.paymentStatus as PaymentStatus : undefined,
      vehicleId: newFilter.vehicleId !== 'ALL' ? newFilter.vehicleId : undefined,
      clientId: newFilter.clientId !== 'ALL' ? newFilter.clientId : undefined,
      search: newFilter.search || undefined,
      startDate: newFilter.dateRange.start?.toISOString(),
      endDate: newFilter.dateRange.end?.toISOString(),
    };
    
    setQuery(newQuery);
  };

  const resetFilters = () => {
    const defaultFilter: ContractFilter = {
      status: 'ALL',
      paymentStatus: 'ALL',
      dateRange: { start: null, end: null },
      vehicleId: 'ALL',
      clientId: 'ALL',
      search: '',
    };
    setFilter(defaultFilter);
    
    setQuery({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  // Table handlers
  const handleSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setQuery(prev => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder,
    }));
  };

  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }));
  };

  const handleContractSelect = (contract: Contract) => {
    setSelectedContract(contract);
    setDetailsDialogOpen(true);
  };

  const handleContractCreate = (newContract: Contract) => {
    setContracts(prev => [newContract, ...prev]);
    fetchStats(); // Refresh stats
  };

  const handleContractUpdate = (updatedContract: Contract) => {
    setContracts(prev => 
      prev.map(contract => 
        contract.id === updatedContract.id ? updatedContract : contract
      )
    );
    fetchStats(); // Refresh stats
  };

  // Export function
  const handleExport = async () => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No access token');
      
      const blob = await exportContracts(token, query);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contracts-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export contracts');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('contracts.title')}</h1>
          <p className="text-muted-foreground">{t('contracts.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            {t('common.export')}
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('contracts.createContract')}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalContracts ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats?.totalRevenue ?? 0).toLocaleString()} DA</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Average Contract Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats?.averageContractValue ?? 0).toLocaleString()} DA</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeContracts ?? 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t('common.filters')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t('common.search')}
              </label>
              <Input
                placeholder={t('contracts.searchPlaceholder')}
                value={filter.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t('contracts.status')}
              </label>
              <Select
                value={filter.status}
                onValueChange={(value: string) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t('common.all')}</SelectItem>
                  <SelectItem value="PENDING">{t('contracts.status.pending')}</SelectItem>
                  <SelectItem value="CONFIRMED">{t('contracts.status.confirmed')}</SelectItem>
                  <SelectItem value="ACTIVE">{t('contracts.status.active')}</SelectItem>
                  <SelectItem value="COMPLETED">{t('contracts.status.completed')}</SelectItem>
                  <SelectItem value="CANCELLED">{t('contracts.status.cancelled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t('contracts.paymentStatus')}
              </label>
              <Select
                value={filter.paymentStatus}
                onValueChange={(value: string) => handleFilterChange('paymentStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t('common.all')}</SelectItem>
                  <SelectItem value="PENDING">{t('contracts.paymentStatus.pending')}</SelectItem>
                  <SelectItem value="PARTIAL">{t('contracts.paymentStatus.partial')}</SelectItem>
                  <SelectItem value="PAID">{t('contracts.paymentStatus.paid')}</SelectItem>
                  <SelectItem value="REFUNDED">{t('contracts.paymentStatus.refunded')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Filter */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t('vehicles.vehicle')}
              </label>
              <Select
                value={filter.vehicleId}
                onValueChange={(value: string) => handleFilterChange('vehicleId', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t('common.all')}</SelectItem>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">
                {t('contracts.dateRange')}
              </label>
              <DatePickerWithRange
                date={filter.dateRange}
                onDateChange={(dateRange: DateRange) => handleFilterChange('dateRange', dateRange)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetFilters}>
                {t('common.reset')}
              </Button>
              <Button variant="outline" onClick={() => fetchContracts()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('common.refresh')}
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {filter.status !== 'ALL' && (
              <Badge variant="secondary">
                {t('contracts.status')}: {t(`contracts.status.${filter.status.toLowerCase()}`)}
              </Badge>
            )}
            {filter.paymentStatus !== 'ALL' && (
              <Badge variant="secondary">
                {t('contracts.paymentStatus')}: {t(`contracts.paymentStatus.${filter.paymentStatus.toLowerCase()}`)}
              </Badge>
            )}
            {filter.search && (
              <Badge variant="secondary">
                {t('common.search')}: {filter.search}
              </Badge>
            )}
            {filter.vehicleId !== 'ALL' && (
              <Badge variant="secondary">
                {t('vehicles.vehicle')}: {vehicles.find(v => v.id === filter.vehicleId)?.make} {vehicles.find(v => v.id === filter.vehicleId)?.model}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <ContractDataTable
        contracts={contracts}
        vehicles={vehicles}
        clients={clients}
        pagination={pagination}
        sortBy={query.sortBy || 'createdAt'}
        sortOrder={query.sortOrder || 'desc'}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onContractSelect={handleContractSelect}
        onContractUpdate={handleContractUpdate}
        isLoading={false}
      />

      {/* Create Contract Dialog */}
      <CreateContractDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleContractCreate}
        vehicles={vehicles}
        clients={clients}
      />

      {detailsDialogOpen && selectedContract && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Contract Details</h2>
            <div className="space-y-4">
              <div>
                <strong>ID:</strong> {selectedContract.id}
              </div>
              <div>
                <strong>Vehicle:</strong> {vehicles.find(v => v.id === selectedContract.vehicleId)?.make} {vehicles.find(v => v.id === selectedContract.vehicleId)?.model}
              </div>
              <div>
                <strong>Client:</strong> {clients.find(c => c.id === selectedContract.clientId)?.prenom} {clients.find(c => c.id === selectedContract.clientId)?.nom}
              </div>
              <div>
                <strong>Total Price:</strong> {(selectedContract.totalPrice ?? 0).toLocaleString()} DA
              </div>
              
              <div>
                <strong>Status:</strong> {selectedContract.status}
              </div>
              <div>
                <strong>Payment Status:</strong> {selectedContract.paymentStatus}
              </div>
            </div>
            <div className="mt-6">
              <Button onClick={() => setDetailsDialogOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}