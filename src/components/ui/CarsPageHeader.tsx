/**
 * Cars Page Header Component
 * 
 * Orange header section with title, subtitle, and breadcrumbs
 * Includes wave decoration at the bottom
 */

'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { WaveDecor } from './WaveDecor';
import { useLanguage } from '@/hooks/useLanguage';
import type { CarsPageHeaderProps } from '@/types/CarsPage';
import type { NavbarLink } from '@/types/Navbar';

export function CarsPageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  className = ''
}: CarsPageHeaderProps) {
  const { t, isRTL, textDirection } = useLanguage();

  // Navigation links matching the design
  const navigationLinks: NavbarLink[] = [
    {
      id: 'home',
      label: 'navigation.home',
      href: '/',
      isActive: false
    },
    {
      id: 'vehicles',
      label: 'navigation.vehicles',
      href: '/vehicles',
      isActive: true // This page is active
    },
    {
      id: 'reservation',
      label: 'navigation.reservation',
      href: '/reservation',
      isActive: false
    },
    {
      id: 'faq',
      label: 'navigation.faq',
      href: '/faq',
      isActive: false
    }
  ];

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleLinkClick = (link: NavbarLink) => {
    window.location.href = link.href;
  };

  return (
    <section className={`relative ${className}`}>
      {/* Navigation Bar */}
      <Navbar
        logoSrc="/logo-white.svg"
        logoAlt="K2A Logo"
        companyName="K2A"
        links={navigationLinks}
        className="bg-primary border-0"
        onLogoClick={handleLogoClick}
        onLinkClick={handleLinkClick}
      />
      
      {/* Hero Section */}
      <div 
        className="relative bg-primary py-16 lg:py-20"
        dir={textDirection}
      >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="mb-8" aria-label={t('navigation.breadcrumb')}>
            <ol className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <svg
                      className={`w-4 h-4 text-on-primary/60 ${isRTL ? 'rotate-180' : ''}`}
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
                  )}
                  
                  {breadcrumb.href && !breadcrumb.isActive ? (
                    <a
                      href={breadcrumb.href}
                      className="text-on-primary/80 hover:text-on-primary transition-colors duration-200"
                    >
                      {breadcrumb.label}
                    </a>
                  ) : (
                    <span
                      className={`${
                        breadcrumb.isActive
                          ? 'text-on-primary font-medium'
                          : 'text-on-primary/60'
                      }`}
                    >
                      {breadcrumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Header Content */}
        <div className="max-w-4xl">
          <h1 
            className="font-unbounded font-bold text-4xl sm:text-5xl lg:text-6xl text-on-primary mb-6"
            style={{ direction: textDirection }}
          >
            {title}
          </h1>
          
          {subtitle && (
            <p 
              className="font-inter text-lg sm:text-xl text-on-primary/90 leading-relaxed max-w-3xl"
              style={{ 
                direction: textDirection,
                unicodeBidi: 'embed'
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

        {/* Wave Decoration */}
        <WaveDecor className="absolute bottom-0 left-0 w-full" />
      </div>
    </section>
  );
}

export default CarsPageHeader;
