/**
 * Filter Section Component
 * 
 * Collapsible section component for organizing filter groups
 * Used within the CarFilter sidebar
 */

'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import type { FilterSectionProps } from '@/types/CarFilter';

export function FilterSection({ 
  title, 
  isOpen, 
  onToggle, 
  children, 
  className = '' 
}: FilterSectionProps) {
  const { isRTL, textDirection } = useLanguage();
  
  return (
    <div className={`border-b border-outline-variant last:border-b-0 ${className}`} dir={textDirection}>
      {/* Section Header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between py-4 px-0 text-${isRTL ? 'right' : 'left'} hover:bg-surface-variant/50 transition-colors duration-200`}
        aria-expanded={isOpen}
        aria-controls={`filter-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <h3 className={`font-unbounded font-medium text-sm text-on-surface ${isRTL ? 'text-right' : 'text-left'}`} style={{ direction: textDirection }}>
          {title}
        </h3>
        
        {/* Chevron Icon - rotates based on RTL */}
        <svg
          className={`w-5 h-5 text-on-surface-variant transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          } ${isRTL ? 'scale-x-[-1]' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Section Content */}
      <div
        id={`filter-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <div className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`} style={{ direction: textDirection }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default FilterSection;
