'use client';

import React from 'react';
import { FilterDropdown } from './FilterDropdown';
import { RangeSlider } from './RangeSlider';
import { FilterActions } from './FilterActions';
import { SearchFilterProps, DropdownOption } from '@/types/FilterComponents';
import { useLanguage } from '@/hooks/useLanguage';

export const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  className = ''
}) => {
  const { t } = useLanguage();

  const handleClearFilters = () => {
    onFiltersChange({
      vehicleType: '',
      rentalServices: '',
      priceRange: [0, 50000],
      brand: '',
      sortBy: ''
    });
  };

  const vehicleTypeOptions: DropdownOption[] = [
    { value: 'car', label: t('filters.vehicleTypes.car') },
    { value: 'suv', label: t('filters.vehicleTypes.suv') },
    { value: 'truck', label: t('filters.vehicleTypes.truck') },
    { value: 'van', label: t('filters.vehicleTypes.van') },
    { value: 'motorcycle', label: t('filters.vehicleTypes.motorcycle') }
  ];

  const rentalServiceOptions: DropdownOption[] = [
    { value: 'self-drive', label: t('filters.services.selfDrive') },
    { value: 'with-driver', label: t('filters.services.withDriver') },
    { value: 'long-term', label: t('filters.services.longTerm') },
    { value: 'short-term', label: t('filters.services.shortTerm') }
  ];

  const brandOptions: DropdownOption[] = [
    { value: 'bmw', label: 'BMW' },
    { value: 'mercedes', label: 'Mercedes-Benz' },
    { value: 'audi', label: 'Audi' },
    { value: 'range rover', label: 'Range Rover' },
    { value: 'toyota', label: 'Toyota' },
    { value: 'hyundai', label: 'Hyundai' },
    { value: 'renault', label: 'Renault' },
    { value: 'peugeot', label: 'Peugeot' },
    { value: 'volkswagen', label: 'Volkswagen' },
    { value: 'ford', label: 'Ford' },
    { value: 'nissan', label: 'Nissan' }
  ];

  const sortOptions: DropdownOption[] = [
    { value: 'price-low-high', label: t('filters.sort.priceLowHigh') },
    { value: 'price-high-low', label: t('filters.sort.priceHighLow') },
    { value: 'name-a-z', label: t('filters.sort.nameAZ') },
    { value: 'name-z-a', label: t('filters.sort.nameZA') },
    { value: 'year-new-old', label: t('filters.sort.yearNewOld') },
    { value: 'year-old-new', label: t('filters.sort.yearOldNew') }
  ];

  const formatPrice = (value: number) => `${value.toLocaleString()} DA`;

  return (
    <div className={`bg-surface rounded-md-lg p-6 elevation-2 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-on-surface font-unbounded">
          {t('filters.title')}
        </h2>
      </div>

      {/* Filter sections */}
      <div className="space-y-6">
        {/* Vehicle Type */}
        <FilterDropdown
          label={t('filters.vehicleType')}
          placeholder={t('filters.placeholders.selectType')}
          options={vehicleTypeOptions}
          value={filters.vehicleType}
          onChange={(value) => onFiltersChange({ ...filters, vehicleType: value })}
        />

        {/* Rental Services */}
        <FilterDropdown
          label={t('filters.rentalServices')}
          placeholder={t('filters.placeholders.chooseService')}
          options={rentalServiceOptions}
          value={filters.rentalServices}
          onChange={(value) => onFiltersChange({ ...filters, rentalServices: value })}
        />

        {/* Price Range */}
        <RangeSlider
          min={0}
          max={50000}
          value={filters.priceRange}
          onChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
          label={t('filters.priceRange')}
          formatValue={formatPrice}
          step={500}
        />

        {/* Brand */}
        <FilterDropdown
          label={t('filters.brand')}
          placeholder={t('filters.placeholders.selectBrand')}
          options={brandOptions}
          value={filters.brand}
          onChange={(value) => onFiltersChange({ ...filters, brand: value })}
        />

        {/* Sort By */}
        <FilterDropdown
          label={t('filters.sortBy')}
          placeholder={t('filters.placeholders.chooseOption')}
          options={sortOptions}
          value={filters.sortBy}
          onChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-8">
        <FilterActions
          onClear={handleClearFilters}
          onApply={onApplyFilters}
          clearLabel={t('filters.actions.clear')}
          applyLabel={t('filters.actions.apply')}
        />
      </div>
    </div>
  );
};
