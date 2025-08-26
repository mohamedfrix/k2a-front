'use client';

import React from 'react';
import { ReviewCardProps } from '../../types/ReviewCard';
import { useLanguage } from '../../context/LanguageContext';

export function ReviewCard({ review, className = '', showDate = false }: ReviewCardProps) {
  const { t, isRTL } = useLanguage();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-warning' : 'text-outline-variant'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div 
      className={`card bg-surface p-6 h-full flex flex-col ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Customer Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-surface-variant rounded-full flex items-center justify-center flex-shrink-0">
          <svg 
            className="w-6 h-6 text-on-surface-variant" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-on-surface font-unbounded truncate">
            {review.customerName}
          </h3>
          <span className="text-xs text-primary font-medium uppercase tracking-wide">
            {t('reviews.client')}
          </span>
        </div>
      </div>

      {/* Review Text - Flexible height */}
      <blockquote className="text-on-surface text-sm leading-relaxed mb-6 flex-1">
        <div className="line-clamp-4">
          {review.reviewText}
        </div>
      </blockquote>

      {/* Rating and Date - Fixed at bottom */}
      <div className="space-y-3">
        {/* Rating */}
        {/* <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderStars(review.rating)}
          </div>
          <span className="text-sm text-on-surface-variant">
            {review.rating}/5
          </span>
        </div> */}

        {/* Date and Verification - Separate row */}
        <div className="flex items-center justify-between">
          {showDate && review.date && (
            <span className="text-xs text-on-surface-variant">
              {review.date.toLocaleDateString()}
            </span>
          )}
          
          {/* {review.verified && (
            <div className="flex items-center gap-1">
              <svg 
                className="w-4 h-4 text-success" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-success">Verified</span>
            </div>
          )} */}
          
          {!showDate && !review.verified && (
            <div></div> // Spacer to maintain layout
          )}
        </div>
      </div>
    </div>
  );
}
