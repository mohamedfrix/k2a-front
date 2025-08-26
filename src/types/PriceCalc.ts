// types.ts

export interface CarRentalData {
  id: string;
  make: string;
  model: string;
  year: number;
  dailyRate: number;
  currency: string;
  image?: string;
  description?: string;
}

export interface AccessoryOption {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string;
}

export interface RentalBooking {
  car: CarRentalData;
  startDate: Date | null;
  endDate: Date | null;
  selectedAccessories: string[];
  totalDays: number;
  carTotal: number;
  accessoriesTotal: number;
  grandTotal: number;
}

export interface CarRentalFormProps {
  car: CarRentalData;
  accessories: AccessoryOption[];
  onBookingChange?: (booking: RentalBooking) => void;
  onSubmit?: (booking: RentalBooking) => void;
  className?: string;
}

export interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

export interface AccessorySelectorProps {
  accessories: AccessoryOption[];
  selectedAccessories: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  currency: string;
}

export interface PriceSummaryProps {
  carTotal: number;
  accessoriesTotal: number;
  grandTotal: number;
  currency: string;
  totalDays: number;
}