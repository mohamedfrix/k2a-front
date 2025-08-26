/**
 * Pagination Component
 * 
 * Provides navigation controls for paginated content
 * Used in the cars grid for page navigation
 */

'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import type { PaginationProps } from '@/types/CarsPage';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = 5,
  className = ''
}: PaginationProps) {
  const { t, isRTL } = useLanguage();

  if (totalPages <= 1) return null;

  const getVisiblePageNumbers = () => {
    const delta = Math.floor(showPageNumbers / 2);
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePageNumbers();

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav 
      className={`flex items-center justify-center ${className}`}
      aria-label={t('pagination.navigation')}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center gap-1">
        
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md-sm transition-all duration-200 ${
            currentPage === 1
              ? 'text-on-surface-variant cursor-not-allowed'
              : 'text-on-surface hover:bg-surface-variant hover:text-primary'
          }`}
          aria-label={t('pagination.previous')}
        >
          <svg
            className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t('pagination.previous')}
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`dots-${index}`}
                  className="px-3 py-2 text-on-surface-variant"
                >
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
                className={`min-w-[40px] h-10 px-3 py-2 text-sm font-medium rounded-md-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface hover:bg-surface-variant hover:text-primary'
                }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`${t('pagination.page')} ${pageNumber}`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md-sm transition-all duration-200 ${
            currentPage === totalPages
              ? 'text-on-surface-variant cursor-not-allowed'
              : 'text-on-surface hover:bg-surface-variant hover:text-primary'
          }`}
          aria-label={t('pagination.next')}
        >
          {t('pagination.next')}
          <svg
            className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

      </div>

      {/* Page Info */}
      <div className="hidden sm:block ml-8 text-sm text-on-surface-variant">
        {t('pagination.showing')} {currentPage} {t('pagination.of')} {totalPages}
      </div>
    </nav>
  );
}

export default Pagination;
