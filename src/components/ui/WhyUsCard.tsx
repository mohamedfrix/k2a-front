'use client';

import React from 'react';
import { WhyUsCardProps } from '../../types/WhyUsCard';
import { useLanguage } from '../../context/LanguageContext';

export function WhyUsCard({ feature, className = '', variant = 'default' }: WhyUsCardProps) {
  const { t, isRTL } = useLanguage();

  const cardClasses = variant === 'highlighted' 
    ? 'card-elevated bg-tertiary-container' 
    : 'card bg-surface';

  const textClasses = variant === 'highlighted'
    ? 'text-on-tertiary-container'
    : 'text-on-surface';

  const descriptionClasses = variant === 'highlighted'
    ? 'text-on-tertiary-container opacity-80'
    : 'text-on-surface-variant';

  // Different icon style for WhyUs - using shield/star pattern
  const getWhyUsIcon = () => {
    const iconClass = variant === 'highlighted' 
      ? 'text-on-tertiary-container' 
      : 'text-secondary';
    
    return (
      <div className={`relative w-16 h-16 rounded-md-xl ${
        variant === 'highlighted' ? 'bg-on-tertiary-container/10' : 'bg-secondary/10'
      } flex items-center justify-center mb-4`}>
        <svg 
          className={`w-8 h-8 ${iconClass}`} 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
          variant === 'highlighted' ? 'bg-on-tertiary-container' : 'bg-success'
        } flex items-center justify-center`}>
          <svg className={`w-2.5 h-2.5 ${
            variant === 'highlighted' ? 'text-tertiary-container' : 'text-on-success'
          }`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`${cardClasses} p-6 h-full flex flex-col text-center ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Icon Section */}
      <div className="flex justify-center">
        {getWhyUsIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className={`text-lg font-bold mb-3 font-unbounded ${textClasses}`}>
          {t(feature.titleKey)}
        </h3>
        
        <p className={`text-sm leading-relaxed flex-1 ${descriptionClasses}`}>
          {t(feature.descriptionKey)}
        </p>

        {/* Stats or Badge */}
        <div className="mt-4 pt-4 border-t border-outline-variant">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md-lg ${
            variant === 'highlighted' 
              ? 'bg-on-tertiary-container/10 text-on-tertiary-container' 
              : 'bg-primary/10 text-primary'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              variant === 'highlighted' ? 'bg-on-tertiary-container' : 'bg-success'
            }`}></div>
            <span className="text-xs font-medium">
              {feature.availability || t('services.verifiedQuality')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
