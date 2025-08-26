/**
 * Car Filter Component
 * 
 * Sidebar filter component for the cars page
 * Provides comprehensive filtering options for vehicle search
 */

'use client';

import React, { useState } from 'react';
import { FilterSection } from './FilterSection';
import { useLanguage } from '@/hooks/useLanguage';
import type { CarFilterProps, TransmissionType, FuelType } from '@/types/CarFilter';

export function CarFilter({
  filters,
  onFiltersChange,
  onResetFilters,
  availableBrands,
  availableModels,
  priceRange,
  yearRange,
  totalResults,
  className = ''
}: CarFilterProps) {
  const { t, isRTL } = useLanguage();
  
  // Section open/close state
  const [openSections, setOpenSections] = useState({
    search: true,
    brand: true,
    specs: true,
    capacity: false,
    price: true,
    availability: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCheckboxChange = (
    field: keyof typeof filters,
    value: string,
    checked: boolean
  ) => {
    const currentValues = filters[field] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    onFiltersChange({ [field]: newValues });
  };

  const handleRangeChange = (
    field: keyof typeof filters,
    rangeType: 'min' | 'max',
    value: number
  ) => {
    const currentRange = filters[field] as { min: number; max: number };
    onFiltersChange({
      [field]: {
        ...currentRange,
        [rangeType]: value
      }
    });
  };

  const transmissionOptions: { value: TransmissionType; label: string }[] = [
    { value: 'automatic', label: t('vehicles.automatic') },
    { value: 'manual', label: t('vehicles.manual') }
  ];

  const fuelTypeOptions: { value: FuelType; label: string }[] = [
    { value: 'petrol', label: t('filters.petrol') },
    { value: 'diesel', label: t('filters.diesel') },
    { value: 'hybrid', label: t('vehicles.hybrid') },
    { value: 'electric', label: t('filters.electric') }
  ];

  return (
    <div 
      className={`bg-surface border border-outline-variant rounded-md-md h-fit sticky top-6 ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Filter Header */}
      <div className="p-6 border-b border-outline-variant">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-unbounded font-semibold text-lg text-on-surface">
            {t('filters.title')}
          </h2>
          <span className="text-sm text-on-surface-variant">
            {totalResults} {t('filters.results')}
          </span>
        </div>
        
        {/* Reset Filters Button */}
        <button
          onClick={onResetFilters}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200"
        >
          {t('filters.resetAll')}
        </button>
      </div>

      {/* Filter Content */}
      <div className="p-6 space-y-0">
        
        {/* Search Section */}
        <FilterSection
          title={t('filters.search')}
          isOpen={openSections.search}
          onToggle={() => toggleSection('search')}
        >
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
            placeholder={t('filters.searchPlaceholder')}
            className="input-outlined w-full text-sm"
          />
        </FilterSection>

        {/* Brand Section */}
        <FilterSection
          title={t('filters.brand')}
          isOpen={openSections.brand}
          onToggle={() => toggleSection('brand')}
        >
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {availableBrands.map((brand) => (
              <label
                key={brand.value}
                className="flex items-center gap-3 cursor-pointer hover:bg-surface-variant/50 p-2 rounded-md-xs transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand.value)}
                  onChange={(e) =>
                    handleCheckboxChange('brands', brand.value, e.target.checked)
                  }
                  className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-on-surface flex-1">
                  {brand.label}
                </span>
                {brand.count && (
                  <span className="text-xs text-on-surface-variant">
                    ({brand.count})
                  </span>
                )}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Specifications Section */}
        <FilterSection
          title={t('filters.specifications')}
          isOpen={openSections.specs}
          onToggle={() => toggleSection('specs')}
        >
          {/* Transmission */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-on-surface">
              {t('filters.transmission')}
            </h4>
            {transmissionOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer hover:bg-surface-variant/50 p-2 rounded-md-xs transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  checked={filters.transmission.includes(option.value)}
                  onChange={(e) =>
                    handleCheckboxChange('transmission', option.value, e.target.checked)
                  }
                  className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-on-surface">
                  {option.label}
                </span>
              </label>
            ))}
          </div>

          {/* Fuel Type */}
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium text-on-surface">
              {t('filters.fuelType')}
            </h4>
            {fuelTypeOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer hover:bg-surface-variant/50 p-2 rounded-md-xs transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  checked={filters.fuelType.includes(option.value)}
                  onChange={(e) =>
                    handleCheckboxChange('fuelType', option.value, e.target.checked)
                  }
                  className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-on-surface">
                  {option.label}
                </span>
              </label>
            ))}
          </div>

          {/* Year Range */}
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium text-on-surface">
              {t('filters.year')}
            </h4>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={yearRange.min}
                max={yearRange.max}
                value={filters.yearRange.min}
                onChange={(e) =>
                  handleRangeChange('yearRange', 'min', parseInt(e.target.value))
                }
                className="input-outlined w-20 text-sm"
                placeholder="Min"
              />
              <span className="text-on-surface-variant">-</span>
              <input
                type="number"
                min={yearRange.min}
                max={yearRange.max}
                value={filters.yearRange.max}
                onChange={(e) =>
                  handleRangeChange('yearRange', 'max', parseInt(e.target.value))
                }
                className="input-outlined w-20 text-sm"
                placeholder="Max"
              />
            </div>
          </div>
        </FilterSection>

        {/* Capacity Section */}
        <FilterSection
          title={t('filters.capacity')}
          isOpen={openSections.capacity}
          onToggle={() => toggleSection('capacity')}
        >
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={9}
              value={filters.minSeats}
              onChange={(e) => onFiltersChange({ minSeats: parseInt(e.target.value) })}
              className="input-outlined w-20 text-sm"
              placeholder="Min"
            />
            <span className="text-on-surface-variant">-</span>
            <input
              type="number"
              min={1}
              max={9}
              value={filters.maxSeats}
              onChange={(e) => onFiltersChange({ maxSeats: parseInt(e.target.value) })}
              className="input-outlined w-20 text-sm"
              placeholder="Max"
            />
          </div>
        </FilterSection>

        {/* Price Section */}
        <FilterSection
          title={t('filters.price')}
          isOpen={openSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.priceRange.min}
                onChange={(e) =>
                  handleRangeChange('priceRange', 'min', parseInt(e.target.value))
                }
                className="input-outlined flex-1 text-sm"
                placeholder="Min"
              />
              <span className="text-on-surface-variant">-</span>
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.priceRange.max}
                onChange={(e) =>
                  handleRangeChange('priceRange', 'max', parseInt(e.target.value))
                }
                className="input-outlined flex-1 text-sm"
                placeholder="Max"
              />
            </div>
            <div className="text-xs text-on-surface-variant">
              {t('filters.pricePerDay')}
            </div>
          </div>
        </FilterSection>

        {/* Availability Section */}
        <FilterSection
          title={t('filters.availability')}
          isOpen={openSections.availability}
          onToggle={() => toggleSection('availability')}
        >
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.availableOnly}
                onChange={(e) => onFiltersChange({ availableOnly: e.target.checked })}
                className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-sm text-on-surface">
                {t('filters.availableOnly')}
              </span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.featuredOnly}
                onChange={(e) => onFiltersChange({ featuredOnly: e.target.checked })}
                className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-sm text-on-surface">
                {t('filters.featuredOnly')}
              </span>
            </label>
          </div>
        </FilterSection>

      </div>
    </div>
  );
}

export default CarFilter;
