'use client';

import React from 'react';
import { FilterDropdownProps } from '@/types/FilterComponents';

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-on-surface">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-surface-variant border border-outline-variant rounded-md-sm px-4 py-3 pr-10 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-on-surface-variant pointer-events-none" />
      </div>
    </div>
  );
};
