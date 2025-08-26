'use client';

import React from 'react';
import Image from 'next/image';
import { ServiceCardProps } from '../../types/ServiceCard';
import { useLanguage } from '../../context/LanguageContext';

export function ServiceCard({ 
  feature, 
  className = '', 
  variant = 'default',
  onExplore,
  onGetInfo 
}: ServiceCardProps) {
  const { t, isRTL } = useLanguage();

  const cardClasses = variant === 'highlighted' 
    ? 'card-elevated bg-primary-container' 
    : 'card bg-surface';

  const textClasses = variant === 'highlighted'
    ? 'text-on-primary-container'
    : 'text-on-surface';

  const descriptionClasses = variant === 'highlighted'
    ? 'text-on-primary-container opacity-80'
    : 'text-on-surface-variant';

  // Get service image based on icon type
  const getServiceImage = () => {
    let imagePath = '';
    
    switch (feature.icon) {
      case 'events':
        imagePath = '/icon-events.png';
        break;
      case 'contract':
        imagePath = '/contract-icon.png';
        break;
      case 'short-term':
        imagePath = '/short-term-icon.png';
        break;
      default:
        imagePath = '/icon-events.png'; // fallback
    }
    
    return (
      <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
        <Image
          src={imagePath}
          alt={t(feature.titleKey)}
          width={64}
          height={64}
          className="object-contain"
        />
      </div>
    );
  };

  return (
    <div 
      className={`${cardClasses} p-6 h-full flex flex-col text-center ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header Section */}
      <div className="flex flex-col items-center mb-6">
        {getServiceImage()}
        
        <h3 className={`text-xl font-bold mb-4 font-unbounded ${textClasses}`}>
          {t(feature.titleKey)}
        </h3>
        
        <p className={`text-sm leading-relaxed ${descriptionClasses}`}>
          {t(feature.descriptionKey)}
        </p>
      </div>

      {/* Action Buttons */}
      {/* <div className="flex flex-col gap-3 mt-auto">
        <button 
          onClick={onExplore}
          className={`btn-filled w-full text-sm font-medium ${
            variant === 'highlighted' 
              ? 'bg-on-primary-container text-primary-container hover:bg-on-primary-container/90' 
              : ''
          }`}
        >
          {t('services.explore')}
        </button>
        <button 
          onClick={onGetInfo}
          className={`btn-outlined w-full text-sm font-medium ${
            variant === 'highlighted'
              ? 'border-on-primary-container text-on-primary-container hover:bg-on-primary-container hover:text-primary-container'
              : ''
          }`}
        >
          {t('services.getInfo')}
        </button>
      </div> */}
    
    </div>
  );
}
