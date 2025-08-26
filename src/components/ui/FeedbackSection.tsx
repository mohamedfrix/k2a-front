/**
 * Feedback Section Component
 * 
 * Displays client testimonials with title highlighting and horizontal carousel
 * Features white background and ReviewCard components
 */

'use client';

import React, { useState } from 'react';
import { ReviewCard } from './ReviewCard';
import { useLanguage } from '@/hooks/useLanguage';
import type { CustomerReview } from '@/types/ReviewCard';
import { getPublicReviews } from '@/lib/api/reviews';

export interface FeedbackSectionProps {
  className?: string;
}

export function FeedbackSection({ className = '' }: FeedbackSectionProps) {
  const { t, isRTL, textDirection } = useLanguage();

  // Responsive items per view based on screen size
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // Mobile: 1 card
      if (window.innerWidth < 1024) return 2; // Tablet: 2 cards  
      return 3; // Desktop: 3 cards
    }
    return 3; // Default fallback
  };

  const [itemsPerView, setItemsPerView] = React.useState(3);

  React.useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [fetchedReviews, setFetchedReviews] = React.useState<CustomerReview[] | null>(null);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  // Map backend ReviewListItem -> CustomerReview
  const mapBackendToCustomerReview = (item: any): CustomerReview => {
    return {
      id: item.id,
      customerName: item.name || 'Client',
      customerType: 'client',
      rating: item.rating ?? 5,
      reviewText: item.message || '',
      date: item.createdAt ? new Date(item.createdAt) : undefined,
      verified: true,
    };
  };

  // Fetch public reviews on mount
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPublicReviews(6);
        if (!mounted) return;
        const mapped = data.map(mapBackendToCustomerReview);
        setFetchedReviews(mapped);
      } catch (err) {
        console.error('Failed to fetch public reviews', err);
        if (!mounted) return;
        setFetchError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => { mounted = false; };
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  // Recalculate maxIndex when itemsPerView or fetchedReviews changes
  // Call hooks unconditionally (even before early returns) to keep hook order stable
  const maxIndex = React.useMemo(() => {
    const len = fetchedReviews ? fetchedReviews.length : 0;
    return Math.max(0, len - itemsPerView);
  }, [fetchedReviews?.length, itemsPerView]);

  // Reset currentIndex if it exceeds maxIndex after screen resize or when reviews update
  React.useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex]);

  // If we haven't fetched yet or there are no public reviews, render nothing
  if (fetchedReviews === null) return null;
  if (fetchedReviews.length === 0) return null;

  const activeReviews = fetchedReviews;

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <section 
      className={`py-16 lg:py-24 bg-surface ${className}`}
      dir={textDirection}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            className="font-unbounded font-bold text-3xl sm:text-4xl lg:text-5xl mb-6"
            style={{ 
              direction: textDirection 
            }}
          >
            <span className="text-on-surface">{t('feedback.title.prefix')}</span>{' '}
            <span className="text-primary">{t('feedback.title.highlight')}</span>
          </h2>
          <p 
            className="font-inter text-lg sm:text-xl max-w-4xl mx-auto leading-relaxed text-on-surface-variant"
            style={{ 
              direction: textDirection,
              unicodeBidi: 'embed'
            }}
          >
            {t('feedback.subtitle')}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface elevation-2 border border-outline-variant flex items-center justify-center hover:bg-surface-variant disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
              isRTL ? 'right-2 sm:right-4' : 'left-2 sm:left-4'
            }`}
            aria-label="Previous reviews"
          >
            <svg
              className={`w-5 h-5 sm:w-6 sm:h-6 text-on-surface-variant ${isRTL ? 'rotate-180' : ''}`}
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
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className={`absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface elevation-2 border border-outline-variant flex items-center justify-center hover:bg-surface-variant disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
              isRTL ? 'left-2 sm:left-4' : 'right-2 sm:right-4'
            }`}
            aria-label="Next reviews"
          >
            <svg
              className={`w-5 h-5 sm:w-6 sm:h-6 text-on-surface-variant ${isRTL ? 'rotate-180' : ''}`}
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

          {/* Carousel Content */}
          <div className="overflow-hidden mx-4 sm:mx-8 lg:mx-16">
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-4 sm:gap-6"
              style={{ 
                transform: `translateX(${isRTL ? currentIndex * (100 / itemsPerView) : -currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {activeReviews.map((review) => (
                <div
                  key={review.id}
                  className={`flex-shrink-0 ${
                    itemsPerView === 1 ? 'w-full' :
                    itemsPerView === 2 ? 'w-[calc(50%-0.75rem)]' :
                    'w-[calc(33.333%-1rem)]'
                  }`}
                >
                  <ReviewCard
                    review={review}
                    showDate={true}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-primary'
                    : 'bg-outline-variant hover:bg-outline'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeedbackSection;
