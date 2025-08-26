/**
 * Why Us Section Component
 * 
 * Displays why customers should choose K2A with title and WhyUsCard components
 * Features theme-aware design and multi-language support
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import type { WhyUsFeature } from '@/types/WhyUsCard';

export interface WhyUsSectionProps {
  className?: string;
}

export function WhyUsSection({ className = '' }: WhyUsSectionProps) {
  const { t, isRTL, textDirection } = useLanguage();

  // Why Us features data
  const whyUsFeatures: WhyUsFeature[] = [
    {
      id: "premium-service",
      icon: "/star-icon.png",
      titleKey: "whyUs.premiumService.title",
      descriptionKey: "whyUs.premiumService.description"
    },
    {
      id: "guaranteed-quality", 
      icon: "/Check-icon.png",
      titleKey: "whyUs.guaranteedQuality.title",
      descriptionKey: "whyUs.guaranteedQuality.description"
    },
    {
      id: "availability-247",
      icon: "/dispo-icon.png", 
      titleKey: "whyUs.availability247.title",
      descriptionKey: "whyUs.availability247.description"
    }
  ];

  return (
    <section 
      className={`py-16 lg:py-24 bg-background text-on-background ${className}`}
      dir={textDirection}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            className="font-unbounded font-bold text-3xl sm:text-4xl lg:text-5xl mb-6"
            style={{ 
              color: 'rgb(241, 134, 27)', // Orange color
              direction: textDirection 
            }}
          >
            {t('whyUs.title')}
          </h2>
        </div>

        {/* Why Us Cards Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 ${
          isRTL ? 'lg:grid-flow-col-dense' : ''
        }`}>
          {whyUsFeatures.map((feature) => (
            <WhyUsCard
              key={feature.id}
              feature={feature}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// WhyUsCard component with PNG image support
function WhyUsCard({ 
  feature, 
  className = '', 
  variant = 'default' 
}: {
  feature: WhyUsFeature;
  className?: string;
  variant?: 'default' | 'highlighted';
}) {
  const { t, isRTL } = useLanguage();

  return (
    <div 
      className={`bg-white dark:bg-white p-8 h-full flex flex-col text-center rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* PNG Image at Center Top */}
      <div className="flex justify-center mb-6">
        <Image
          src={feature.icon as string}
          alt={t(feature.titleKey)}
          width={64}
          height={64}
          className="object-contain"
        />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold mb-4 font-unbounded text-gray-900">
        {t(feature.titleKey)}
      </h3>
      
      {/* Subtitle/Description */}
      <p className="text-base leading-relaxed text-gray-600">
        {t(feature.descriptionKey)}
      </p>
    </div>
  );
}

export default WhyUsSection;
