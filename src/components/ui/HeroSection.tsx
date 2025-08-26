/**
 * Hero Section Component
 * 
 * Main landing section with orange background, car image, and floating filter panel
 * Features wave bottom design and integrated car filter functionality
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { Navbar } from './Navbar';
import { useLanguage } from '@/hooks/useLanguage';
import { scrollToSection } from '@/lib/utils';
import type { HeroSectionProps, CarFilterData, NavbarLink } from '@/types';

export function HeroSection({
  content,
  carImage = '/car-hero.jpg',
  carImageAlt = 'Voiture de location K2A',
  onCarFilter,
  showNavbar = true,
  minimal = false,
  activeNavItem = 'home',
  className = ''
}: HeroSectionProps) {
  const { t, isRTL, textDirection } = useLanguage();

  // Navigation links for the navbar
  const navLinks: NavbarLink[] = [
    { id: 'home', label: 'navigation.home', href: '/', isActive: activeNavItem === 'home' },
    { id: 'vehicles', label: 'navigation.vehicles', href: '/vehicles', isActive: activeNavItem === 'vehicles' },
    { id: 'services', label: 'navigation.services', href: '#services', isActive: activeNavItem === 'services' },
    { id: 'findUs', label: 'navigation.findUs', href: '#find-us', isActive: activeNavItem === 'findUs' },
    { id: 'contact', label: 'navigation.contact', href: '#footer', isActive: activeNavItem === 'contact' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleNavLinkClick = (link: NavbarLink) => {
    // Handle different types of navigation
    if (link.href.startsWith('#')) {
      // Scroll to section on current page
      const sectionId = link.href.substring(1);
      scrollToSection(sectionId);
    } else {
      // Regular page navigation
      window.location.href = link.href;
    }
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleCarFilter = (filterData: CarFilterData) => {
    console.log('Filter data:', filterData);
    if (onCarFilter) {
      onCarFilter(filterData);
    } else {
      // Default behavior: redirect to search results
      const searchParams = new URLSearchParams({
        pickup_location: filterData.pickupLocation,
        dropoff_location: filterData.dropoffLocation,
        pickup_date: filterData.pickupDate,
        pickup_time: filterData.pickupTime,
        dropoff_date: filterData.dropoffDate,
        dropoff_time: filterData.dropoffTime,
      });
      
      window.location.href = `/search?${searchParams.toString()}`;
    }
  };

  return (
    <section className={`relative ${minimal ? 'min-h-[40vh]' : 'min-h-screen'} bg-primary ${className}`} dir={textDirection}>
      {/* Navbar */}
      {showNavbar && (
        <Navbar
          logoSrc="/logo-white.svg"
          logoAlt="K2A Car Rental Logo"
          companyName="K2A"
          links={navLinks}
          onLogoClick={handleLogoClick}
          onLinkClick={handleNavLinkClick}
          className="bg-transparent border-b-0"
        />
      )}

      {/* Background Pattern/Texture - Optional */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-primary" />
      </div>

      {/* Minimal mode content - Title and subtitle on orange background */}
      {minimal && (
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div className="flex items-center justify-center min-h-[20vh]">
            <div className="text-center">
              <h1 className="font-unbounded font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6" style={{ direction: textDirection }}>
                {content.title}
              </h1>
              <p className="font-inter text-lg sm:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed" style={{ direction: textDirection, unicodeBidi: 'embed' }}>
                {content.slogan}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Only show main content container if not minimal */}
      {!minimal && (
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-32">
          <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
            
            {/* White Container with Rounded Edges */}
            <div className="bg-surface text-on-surface rounded-md-xl elevation-3 p-8 sm:p-12 lg:p-16 max-w-7xl w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                
                {/* Left Content - Text and Buttons */}
                <div className={`flex flex-col justify-center space-y-8 text-center lg:${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className="space-y-6">
                    <h1 className={`font-unbounded font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-on-surface leading-tight ${isRTL ? 'text-right' : 'text-left'}`} style={{ direction: textDirection }}>
                      {content.title}
                    </h1>
                    <p className={`font-inter text-base sm:text-lg lg:text-xl text-on-surface-variant max-w-2xl mx-auto lg:mx-0 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`} style={{ direction: textDirection, unicodeBidi: 'embed' }}>
                      {content.slogan}
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className={`flex flex-col sm:${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-4 justify-center lg:${isRTL ? 'justify-end' : 'justify-start'}`}>
                    <a
                      href={content.primaryButton.href}
                      aria-label={content.primaryButton.ariaLabel}
                      className="btn-filled font-unbounded text-base sm:text-lg px-8 py-4 elevation-2 hover:elevation-4 transition-all duration-300"
                    >
                      {content.primaryButton.text}
                    </a>
                    
                    <a
                      href={content.secondaryButton.href}
                      aria-label={content.secondaryButton.ariaLabel}
                      className="btn-outlined font-unbounded text-base sm:text-lg px-8 py-4 transition-all duration-300"
                    >
                      {content.secondaryButton.text}
                    </a>
                  </div>
                </div>

                {/* Right Content - Car Image */}
                <div className="relative flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-2xl">
                    <Image
                      src={carImage}
                      alt={carImageAlt}
                      width={800}
                      height={500}
                      className="w-full h-auto object-contain drop-shadow-2xl"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                    />
                    
                    {/* Floating glow effect behind car */}
                    <div className="absolute inset-0 bg-gradient-radial from-on-surface/10 to-transparent blur-3xl scale-110 -z-10" />
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Wave Bottom Design - Show for both minimal and full modes */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1200 120"
          className="w-full h-16 sm:h-20 lg:h-24"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z"
            fill="rgb(var(--md-background))"
            className="drop-shadow-lg"
            style={{ 
              transition: 'fill 0.3s ease',
              fill: 'rgb(var(--md-background))'
            }}
          />
        </svg>
      </div>
    </section>
  );
}

export default HeroSection;
