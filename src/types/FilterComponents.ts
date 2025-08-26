export interface DropdownOption {
  value: string;
  label: string;
}

export interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  label: string;
  formatValue?: (value: number) => string;
  step?: number;
}

export interface FilterDropdownProps {
  label: string;
  placeholder: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export interface FilterActionsProps {
  onClear: () => void;
  onApply: () => void;
  clearLabel: string;
  applyLabel: string;
}

export interface SearchFilterState {
  vehicleType: string;
  rentalServices: string;
  priceRange: [number, number];
  brand: string;
  sortBy: string;
}

export interface SearchFilterProps {
  filters: SearchFilterState;
  onFiltersChange: (filters: SearchFilterState) => void;
  onApplyFilters: () => void;
  className?: string;
}
