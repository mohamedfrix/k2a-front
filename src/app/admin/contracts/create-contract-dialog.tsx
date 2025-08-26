'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, User, Car, Plus, X, CalendarDays } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange, DateRange } from '@/components/ui/date-range-picker';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/context/AuthContext';
import { 
  Contract, 
  CreateContractRequest, 
  CreateContractAccessoryRequest,
  ContractFormState 
} from '@/types/Contract';
import { AdminVehicle } from '@/types/AdminVehicle';
import { Client } from '@/types/Client';
import { 
  createContract, 
  checkVehicleAvailability, 
  calculateContractPrice,
  validateContractDates 
} from '@/lib/api/contracts';

interface CreateContractDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (contract: Contract) => void;
  vehicles: AdminVehicle[];
  clients: Client[];
}

export function CreateContractDialog({
  open,
  onClose,
  onSuccess,
  vehicles,
  clients
}: CreateContractDialogProps) {
  const { t } = useLanguage();
  const { getAccessToken } = useAuth();
  
  // Form state
  const [formState, setFormState] = useState<ContractFormState>({
    vehicleId: '',
    clientId: '',
    startDate: null,
    endDate: null,
    totalPrice: 0,
    deposit: 0,
    dailyRate: 0,
    serviceType: undefined,
    notes: '',
    accessories: [],
    errors: {},
    isLoading: false,
  });

  const [availabilityChecking, setAvailabilityChecking] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<{
    available: boolean;
    checked: boolean;
    conflictingContracts?: any[];
    vehicleUnavailable?: boolean;
    vehicle?: any;
  }>({
    available: false,
    checked: false,
  });


  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  // Update daily rate when vehicle changes
  useEffect(() => {
    if (formState.vehicleId) {
      const selectedVehicle = vehicles.find(v => v.id === formState.vehicleId);
      if (selectedVehicle) {
        setFormState(prev => ({
          ...prev,
          dailyRate: selectedVehicle.pricePerDay || 0
        }));
      }
    }
  }, [formState.vehicleId, vehicles]);

  // Recalculate price synchronously when relevant fields change
  useEffect(() => {
    if (formState.startDate && formState.endDate && formState.dailyRate > 0) {
      const calculation = calculateContractPrice(
        formState.dailyRate,
        formState.startDate,
        formState.endDate,
        formState.accessories
      );
      
      setFormState(prev => ({
        ...prev,
        totalPrice: calculation.totalPrice,
        deposit: Math.round(calculation.totalPrice * 0.3), // 30% deposit
      }));
    } else {
      // keep totalPrice at 0 when incomplete
      setFormState(prev => ({ ...prev, totalPrice: 0, deposit: 0 }));
    }
  }, [formState.startDate, formState.endDate, formState.dailyRate, formState.accessories]);

  // Check availability when dates and vehicle change
  useEffect(() => {
    const token = getAccessToken();
    if (formState.vehicleId && formState.startDate && formState.endDate && token) {
      checkAvailability();
    }
  }, [formState.vehicleId, formState.startDate, formState.endDate]);

  const resetForm = () => {
    setFormState({
      vehicleId: '',
      clientId: '',
      startDate: null,
      endDate: null,
      totalPrice: 0,
      deposit: 0,
      dailyRate: 0,
      notes: '',
      accessories: [],
      errors: {},
      isLoading: false,
    });
    setAvailabilityStatus({
      available: false,
      checked: false,
    });
  };

  const updateFormField = (field: keyof ContractFormState, value: any) => {
    setFormState(prev => {
      const newErrors = { ...prev.errors };
      delete newErrors[field]; // Clear error when user starts typing
      
      return {
        ...prev,
        [field]: value,
        errors: newErrors
      };
    });
  };

  const checkAvailability = async () => {
    const token = getAccessToken();
    if (!formState.vehicleId || !formState.startDate || !formState.endDate || !token) return;

    setAvailabilityChecking(true);
    try {
      const result = await checkVehicleAvailability(
        formState.vehicleId,
        formState.startDate.toISOString(),
        formState.endDate.toISOString(),
        token
      );
      
      setAvailabilityStatus({
        available: result.available,
        checked: true,
        conflictingContracts: result.conflictingContracts,
        vehicleUnavailable: (result as any).vehicleUnavailable || false,
        vehicle: (result as any).vehicle,
      });
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailabilityStatus({
        available: false,
        checked: true,
        vehicleUnavailable: false,
      });
    } finally {
      setAvailabilityChecking(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!formState.vehicleId) {
      errors.vehicleId = t('validation.required');
    }
    if (!formState.clientId) {
      errors.clientId = t('validation.required');
    }
    if (!formState.startDate) {
      errors.startDate = t('validation.required');
    }
    if (!formState.endDate) {
      errors.endDate = t('validation.required');
    }
    if (!formState.serviceType) {
      errors.serviceType = 'Service type is required';
    }

    // Date validation
    if (formState.startDate && formState.endDate) {
      const dateErrors = validateContractDates(formState.startDate, formState.endDate);
      if (dateErrors.length > 0) {
        errors.dates = dateErrors.join(', ');
      }
    }

    // Price validation
    if (formState.totalPrice <= 0) {
      errors.totalPrice = 'Total price must be greater than 0';
    }
    if (formState.deposit < 0) {
      errors.deposit = 'Deposit cannot be negative';
    }
    if (formState.deposit > formState.totalPrice) {
      errors.deposit = 'Deposit cannot exceed total price';
    }

    // Availability validation
    // Note: availabilityStatus.checked is still used to ensure availability has been checked before submit
    if (!availabilityStatus.checked) {
      // do not show a blocking error here; keep UX simple
    }
    if (availabilityStatus.checked && !availabilityStatus.available) {
      errors.availability = 'Vehicle is not available for selected dates';
    }

    // Ensure price is positive
    if (formState.totalPrice <= 0) {
      errors.totalPrice = 'Total price must be greater than 0';
    }

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = getAccessToken();
    if (!validateForm() || !token) return;

    setFormState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Map accessories to backend expected shape: { name, price, quantity }
      const accessoriesPayload = formState.accessories.length > 0 ? formState.accessories.map(acc => ({
        name: acc.accessoryName,
        price: acc.accessoryPrice,
        quantity: acc.quantity
      })) : undefined;

      const contractData: CreateContractRequest = {
        vehicleId: formState.vehicleId,
        clientId: formState.clientId,
        startDate: formState.startDate!.toISOString(),
        endDate: formState.endDate!.toISOString(),
        serviceType: formState.serviceType,
        totalPrice: formState.totalPrice,
        deposit: formState.deposit,
        dailyRate: formState.dailyRate,
        notes: formState.notes || undefined,
        // send accessories in backend-compatible shape
        accessories: accessoriesPayload as any,
      };

      const newContract = await createContract(contractData, token);
      // Backend stores/returns `totalAmount`; normalize to `totalPrice` for frontend
      const normalizedContract = { ...(newContract as any) } as Contract;
      if ((newContract as any).totalAmount !== undefined && (normalizedContract as any).totalPrice === undefined) {
        (normalizedContract as any).totalPrice = (newContract as any).totalAmount;
      }
      onSuccess(normalizedContract);
      onClose();
    } catch (error) {
      console.error('Error creating contract:', error);
      setFormState(prev => ({
        ...prev,
        errors: {
          submit: error instanceof Error ? error.message : 'Failed to create contract'
        }
      }));
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const addAccessory = () => {
    setFormState(prev => ({
      ...prev,
      accessories: [
        ...prev.accessories,
        { accessoryName: '', accessoryPrice: 0, quantity: 1 }
      ]
    }));
  };

  const updateAccessory = (index: number, field: keyof CreateContractAccessoryRequest, value: any) => {
    setFormState(prev => ({
      ...prev,
      accessories: prev.accessories.map((acc, i) => 
        i === index ? { ...acc, [field]: value } : acc
      )
    }));
  };

  const removeAccessory = (index: number) => {
    setFormState(prev => ({
      ...prev,
      accessories: prev.accessories.filter((_, i) => i !== index)
    }));
  };

  const selectedVehicle = vehicles.find(v => v.id === formState.vehicleId);
  const selectedClient = clients.find(c => c.id === formState.clientId);
  const calculation = formState.startDate && formState.endDate ? 
    calculateContractPrice(formState.dailyRate, formState.startDate, formState.endDate, formState.accessories) : null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {t('contracts.createContract')}
          </DialogTitle>
          <DialogDescription>
            Create a new rental contract with vehicle, client, and dates information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Loading hint when vehicles/clients are not yet loaded */}
          {(vehicles.length === 0 || clients.length === 0) && (
            <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md">
              Loading clients and vehicles. If this message persists, ensure you are logged in.
            </div>
          )}
          {/* Error Alert */}
          {formState.errors.submit && (
            <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
              {formState.errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Vehicle Selection */}
              <div className="space-y-2">
                <Label htmlFor="vehicle" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Vehicle *
                </Label>
                <Select
                  value={formState.vehicleId}
                  onValueChange={(value) => updateFormField('vehicleId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.pricePerDay.toLocaleString()} DA/day
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formState.errors.vehicleId && (
                  <p className="text-sm text-destructive">{formState.errors.vehicleId}</p>
                )}
              </div>

              {/* Service Type Selection (from selected vehicle rentalServices) */}
              {selectedVehicle && selectedVehicle.rentalServices && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">Service Type *</Label>
                  <Select
                    value={formState.serviceType}
                    onValueChange={(value) => updateFormField('serviceType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedVehicle.rentalServices.map(rs => (
                        <SelectItem key={rs.id} value={rs.rentalServiceType}>{rs.rentalServiceType}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formState.errors.serviceType && (
                    <p className="text-sm text-destructive">{formState.errors.serviceType}</p>
                  )}
                </div>
              )}

              {/* Client Selection */}
              <div className="space-y-2">
                <Label htmlFor="client" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Client *
                </Label>
                <Select
                  value={formState.clientId}
                  onValueChange={(value) => updateFormField('clientId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.prenom} {client.nom} - {client.email || client.telephone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formState.errors.clientId && (
                  <p className="text-sm text-destructive">{formState.errors.clientId}</p>
                )}
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Rental Period *
                </Label>
                <DatePickerWithRange
                  date={{
                    start: formState.startDate,
                    end: formState.endDate,
                  }}
                  onDateChange={(dateRange: DateRange) => {
                    // Normalize incoming dates to local date-only (midnight) to avoid timezone shifts
                    const normalize = (d: Date | null) => {
                      if (!d) return null;
                      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
                    };

                    updateFormField('startDate', normalize(dateRange.start));
                    updateFormField('endDate', normalize(dateRange.end));
                  }}
                />
                {(formState.errors.startDate || formState.errors.endDate || formState.errors.dates) && (
                  <p className="text-sm text-destructive">
                    {formState.errors.startDate || formState.errors.endDate || formState.errors.dates}
                  </p>
                )}
              </div>

              {/* Availability Status */}
              {formState.vehicleId && formState.startDate && formState.endDate && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Availability Status</span>
                  </div>
                  {availabilityChecking ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                      Checking availability...
                    </div>
                  ) : availabilityStatus.checked ? (
                    <div>
                      <div className={`flex items-center gap-2 ${availabilityStatus.available ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`h-2 w-2 rounded-full ${availabilityStatus.available ? 'bg-green-600' : 'bg-red-600'}`} />
                        {availabilityStatus.available ? 'Vehicle is available' : 'Vehicle is not available'}
                      </div>

                      {/* Vehicle-level unavailable reason */}
                      {availabilityStatus.vehicleUnavailable && (
                        <p className="text-sm text-yellow-700 mt-2">This vehicle is currently marked unavailable (maintenance or out of service).</p>
                      )}

                      {/* Conflicting contracts details */}
                      {availabilityStatus.conflictingContracts && availabilityStatus.conflictingContracts.length > 0 && (
                        <div className="mt-2 text-sm">
                          <div className="font-medium">Conflicting contracts:</div>
                          <ul className="list-disc pl-5 mt-1">
                            {availabilityStatus.conflictingContracts.map((c: any) => (
                              <li key={c.id}>{`#${c.id} — ${new Date(c.startDate).toLocaleDateString()} to ${new Date(c.endDate).toLocaleDateString()} (status: ${c.status})`}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Select vehicle and dates to check availability</div>
                  )}
                  {formState.errors.availability && (
                    <p className="text-sm text-destructive mt-1">{formState.errors.availability}</p>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any additional notes or special requirements..."
                  value={formState.notes}
                  onChange={(e) => updateFormField('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Right Column - Pricing & Accessories */}
            <div className="space-y-6">
              {/* Price Information */}
              {calculation && (
                <div className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">Price Calculation</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{calculation.totalDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Rate:</span>
                      <span>{formState.dailyRate.toLocaleString()} DA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>{calculation.basePrice.toLocaleString()} DA</span>
                    </div>
                    {calculation.accessoriesPrice > 0 && (
                        <div className="flex justify-between">
                        <span>Accessories:</span>
                        <span>{calculation.accessoriesPrice.toLocaleString()} DA</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total Price:</span>
                      <span>{calculation.totalPrice.toLocaleString()} DA</span>
                    </div>
                  </div>

                  {/* Manual Total Price Override */}
                  <div className="space-y-2">
                    <Label htmlFor="totalPrice">
                      Total Price *
                    </Label>
                    <Input
                      id="totalPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formState.totalPrice}
                      onChange={(e) => updateFormField('totalPrice', Number(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Calculated: {calculation ? calculation.totalPrice.toLocaleString() : '0'} DA (You can adjust this manually)
                    </p>
                    {/* totalPrice validation error intentionally hidden in UI per UX request; validation still runs on submit */}
                  </div>

                  {/* Custom Deposit */}
                  <div className="space-y-2">
                    <Label htmlFor="deposit">
                      Deposit Amount
                    </Label>
                    <Input
                      id="deposit"
                      type="number"
                      min="0"
                      max={formState.totalPrice}
                      value={formState.deposit}
                      onChange={(e) => updateFormField('deposit', Number(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: {Math.round(formState.totalPrice * 0.3).toLocaleString()} DA (30%)
                    </p>
                    {formState.errors.deposit && (
                      <p className="text-sm text-destructive">{formState.errors.deposit}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Accessories */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Additional Accessories</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addAccessory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Accessory
                  </Button>
                </div>

                <div className="space-y-3">
                  {formState.accessories.map((accessory, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Accessory {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAccessory(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <Input
                          placeholder="Accessory name"
                          value={accessory.accessoryName}
                          onChange={(e) => updateAccessory(index, 'accessoryName', e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            placeholder="Price per day"
                            min="0"
                            step="0.01"
                            value={accessory.accessoryPrice}
                            onChange={(e) => updateAccessory(index, 'accessoryPrice', Number(e.target.value))}
                          />
                          <Input
                            type="number"
                            placeholder="Quantity"
                            min="1"
                            value={accessory.quantity}
                            onChange={(e) => updateAccessory(index, 'quantity', Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contract Summary */}
              {selectedVehicle && selectedClient && formState.startDate && formState.endDate && (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <h4 className="font-medium">Contract Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Vehicle:</span> {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
                    </div>
                    <div>
                      <span className="font-medium">Client:</span> {selectedClient.prenom} {selectedClient.nom}
                    </div>
                    <div>
                      <span className="font-medium">Period:</span> {formState.startDate.toLocaleDateString()} - {formState.endDate.toLocaleDateString()}
                    </div>
                    {calculation && (
                      <div>
                        <span className="font-medium">Duration:</span> {calculation.totalDays} days
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex items-center gap-3">
              <Button 
                type="submit" 
                disabled={formState.isLoading || !availabilityStatus.available || formState.totalPrice <= 0}
              >
              {formState.isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Creating...
                </>
              ) : (
                'Create Contract'
              )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}