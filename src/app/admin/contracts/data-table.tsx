'use client';

import React from 'react';
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/context/AuthContext';
import { Contract, ContractStatus, PaymentStatus } from '@/types/Contract';
import { AdminVehicle } from '@/types/AdminVehicle';
import { Client } from '@/types/Client';
import { updateContractStatus, updateContractPaymentStatus } from '@/lib/api/contracts';
import { format } from 'date-fns';

interface ContractDataTableProps {
  contracts: Contract[];
  vehicles: AdminVehicle[];
  clients: Client[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onPageChange: (page: number) => void;
  onContractSelect: (contract: Contract) => void;
  onContractUpdate: (contract: Contract) => void;
  isLoading: boolean;
}

export function ContractDataTable({
  contracts,
  vehicles,
  clients,
  pagination,
  sortBy,
  sortOrder,
  onSort,
  onPageChange,
  onContractSelect,
  onContractUpdate,
  isLoading,
}: ContractDataTableProps) {
  const { t } = useLanguage();
  const { getAccessToken } = useAuth();

  // Defensive pagination default in case parent passes undefined
  const safePagination = pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 };

  // Helper functions
  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.year})` : 'Unknown Vehicle';
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.prenom} ${client.nom}` : 'Unknown Client';
  };

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case ContractStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case ContractStatus.ACTIVE:
        return 'bg-green-100 text-green-800 border-green-200';
      case ContractStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case ContractStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case PaymentStatus.PARTIAL:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case PaymentStatus.PAID:
        return 'bg-green-100 text-green-800 border-green-200';
      case PaymentStatus.REFUNDED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.PENDING:
        return <Clock className="h-3 w-3" />;
      case ContractStatus.CONFIRMED:
      case ContractStatus.ACTIVE:
        return <CheckCircle className="h-3 w-3" />;
      case ContractStatus.COMPLETED:
        return <CheckCircle className="h-3 w-3" />;
      case ContractStatus.CANCELLED:
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const calculateDuration = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      onSort(column, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(column, 'asc');
    }
  };

  const handleStatusUpdate = async (contractId: string, newStatus: ContractStatus) => {
    const token = getAccessToken();
    if (!token) {
      alert('User not authenticated. Please log in again.');
      return;
    }
    try {
      const updatedContract = await updateContractStatus(contractId, newStatus, token);
      if (updatedContract) {
        onContractUpdate(updatedContract);
        console.log(`Contract status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error('Failed to update contract status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update contract status';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handlePaymentStatusUpdate = async (contractId: string, newPaymentStatus: PaymentStatus) => {
    const token = getAccessToken();
    if (!token) {
      alert('User not authenticated. Please log in again.');
      return;
    }
    try {
      const updatedContract = await updateContractPaymentStatus(contractId, newPaymentStatus, token);
      if (updatedContract) {
        onContractUpdate(updatedContract);
        console.log(`Payment status updated to ${newPaymentStatus}`);
      }
    } catch (err) {
      console.error('Failed to update payment status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment status';
      alert(`Error: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading contracts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contracts</CardTitle>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No contracts found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('id')}
                    >
                      Contract ID
                      {sortBy === 'id' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('startDate')}
                    >
                      Start Date
                      {sortBy === 'startDate' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('endDate')}
                    >
                      End Date
                      {sortBy === 'endDate' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('totalPrice')}
                    >
                      Total Price
                      {sortBy === 'totalPrice' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">
                        {contract.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {getVehicleName(contract.vehicleId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {getClientName(contract.clientId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(contract.startDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(contract.endDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {calculateDuration(contract.startDate, contract.endDate)} days
                      </TableCell>
                      <TableCell className="font-medium">
                        {(contract.totalPrice ?? 0).toLocaleString()} DA
                      </TableCell>
                      <TableCell>
                        <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(contract.status)}`}>
                          {getStatusIcon(contract.status)}
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`flex items-center gap-1 w-fit ${getPaymentStatusColor(contract.paymentStatus)}`}>
                          <DollarSign className="h-3 w-3" />
                          {contract.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onContractSelect(contract)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            
                            {contract.status === ContractStatus.PENDING && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(contract.id, ContractStatus.CONFIRMED)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Confirm
                              </DropdownMenuItem>
                            )}
                            
                            {contract.status === ContractStatus.CONFIRMED && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(contract.id, ContractStatus.ACTIVE)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Start Rental
                              </DropdownMenuItem>
                            )}
                            
                            {contract.status === ContractStatus.ACTIVE && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(contract.id, ContractStatus.COMPLETED)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Complete
                              </DropdownMenuItem>
                            )}
                            
                            {contract.paymentStatus === PaymentStatus.PENDING && (
                              <DropdownMenuItem 
                                onClick={() => handlePaymentStatusUpdate(contract.id, PaymentStatus.PARTIAL)}
                              >
                                <DollarSign className="mr-2 h-4 w-4" />
                                Mark Deposit Paid
                              </DropdownMenuItem>
                            )}
                            
                            {contract.paymentStatus === PaymentStatus.PARTIAL && (
                              <DropdownMenuItem 
                                onClick={() => handlePaymentStatusUpdate(contract.id, PaymentStatus.PAID)}
                              >
                                <DollarSign className="mr-2 h-4 w-4" />
                                Mark Fully Paid
                              </DropdownMenuItem>
                            )}
                            
                            {(contract.status === ContractStatus.PENDING || contract.status === ContractStatus.CONFIRMED) && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(contract.id, ContractStatus.CANCELLED)}
                                className="text-red-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {safePagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} contracts
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => onPageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 