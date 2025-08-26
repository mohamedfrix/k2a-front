'use client';

import React from 'react';
import Image from 'next/image';
import { AgencyCardProps } from '../../types/AgencyCard';
import { useLanguage } from '../../context/LanguageContext';

export function AgencyCard({ agency, className = '', onContactClick }: AgencyCardProps) {
  const { t, isRTL } = useLanguage();

  return (
    <div 
      className={`card bg-surface p-6 h-full flex flex-col ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 p-2">
          <Image
            src="/logo-white.svg"
            alt="K2A Logo"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-on-surface font-unbounded">
            {t('agency.title')}
          </h3>
          <p className="text-sm text-on-surface-variant mt-1">
            {t('agency.description')}
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4 flex-1">
        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <svg 
              className="w-4 h-4 text-white dark:text-gray-900" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-primary font-unbounded">
              {t('agency.address')}
            </h4>
            <p className="text-sm text-on-surface mt-1">
              {agency.address.street}
            </p>
            <p className="text-sm text-on-surface-variant">
              {agency.address.city}, {agency.address.country}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <svg 
              className="w-4 h-4 text-white dark:text-gray-900" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-primary font-unbounded">
              {t('agency.phone')}
            </h4>
            <p className="text-sm text-on-surface mt-1">
              {agency.contact.phone}
            </p>
            <p className="text-xs text-on-surface-variant">
              {t('agency.availability')}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <svg 
              className="w-4 h-4 text-white dark:text-gray-900" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-primary font-unbounded">
              {t('agency.email')}
            </h4>
            <p className="text-sm text-on-surface mt-1">
              {agency.contact.email}
            </p>
            <p className="text-xs text-on-surface-variant">
              {t('agency.responseTime')}
            </p>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="mt-6 pt-6 border-t border-outline-variant">
        <h4 className="text-sm font-medium text-on-surface mb-3 font-unbounded">
          {t('agency.businessHours')}
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">{t('agency.weekdays')}</span>
            <span className="text-on-surface">
              {agency.businessHours.weekdays.start} - {agency.businessHours.weekdays.end}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">{t('agency.saturday')}</span>
            <span className="text-on-surface">
              {agency.businessHours.saturday.start} - {agency.businessHours.saturday.end}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">{t('agency.sunday')}</span>
            <span className="text-on-surface">
              {agency.businessHours.sunday.start} - {agency.businessHours.sunday.end}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Button */}
      <button 
        onClick={onContactClick}
        className="btn-filled w-full mt-6 font-unbounded"
      >
        {t('agency.contactUs')}
      </button>
    </div>
  );
}
