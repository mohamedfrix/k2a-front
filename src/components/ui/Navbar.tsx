'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-switcher';
import type { NavbarProps } from '@/types';

export function Navbar({
  logoSrc,
  logoAlt = 'Company Logo',
  companyName,
  links,
  className = '',
  onLogoClick,
  onLinkClick
}: NavbarProps) {
  const { t, isRTL } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check for special styling classes
  const isTransparent = className?.includes('bg-transparent');
  const isPrimary = className?.includes('bg-primary');
  
  // Dynamic background based on scroll and transparency
  const getNavbarBackground = () => {
    // When not scrolled and transparent, use a subtle surface background for text contrast
    if (isTransparent && !isScrolled) {
      return 'bg-surface/80 backdrop-blur-md border-b-0';
    }
    
    // When scrolled, use the orange background as originally requested
    if (isPrimary || isScrolled) {
      return 'bg-primary border-b-0';
    }
    
    return 'bg-surface/90 backdrop-blur-md border-b border-outline-variant elevation-1';
  };
  
  // Get current background type for color decisions
  const getCurrentBackground = () => {
    if (isTransparent && !isScrolled) {
      return 'transparent';
    }
    if (isPrimary || isScrolled) {
      return 'primary';
    }
    return 'surface';
  };
  
  // Determine if we should use dark content (logo/text)
  const shouldUseDarkContent = () => {
    const currentBg = getCurrentBackground();
    
    // On primary (orange) background when scrolled, use light content for contrast
    if (currentBg === 'primary') {
      return false;
    }
    
    // On surface backgrounds (both transparent and normal states), use theme-based colors
    // User's requirement: "dark in the light theme, and white when the theme is dark"
    return resolvedTheme === 'light';
  };

  // Get the appropriate logo based on theme and background
  const getLogoSrc = () => {
    if (logoSrc) {
      return logoSrc; // Use provided logo if available
    }
    // Use theme-appropriate logo
    return shouldUseDarkContent() ? '/logo-black.svg' : '/logo-white.svg';
  };
  
  // Theme-aware text colors based on background and theme
  const getTextColors = () => {
    const useDarkContent = shouldUseDarkContent();
    
    return {
      textColor: useDarkContent ? 'text-on-surface' : 'text-white',
      hoverTextColor: useDarkContent ? 'hover:text-primary' : 'hover:text-white/80',
      activeTextColor: useDarkContent ? 'text-primary font-bold' : 'text-white font-bold',
      activeBgColor: useDarkContent ? 'bg-primary-container/50' : 'bg-white/20',
      mobileButtonColor: useDarkContent ? 'text-on-surface hover:bg-surface-variant' : 'text-white hover:bg-white/20',
      focusRingColor: useDarkContent ? 'focus:ring-2 focus:ring-primary/50' : 'focus:ring-2 focus:ring-white/50'
    };
  };

  const { textColor, hoverTextColor, activeTextColor, activeBgColor, mobileButtonColor, focusRingColor } = getTextColors();

  return (
    <nav
      className={`
        sticky top-0 z-50 transition-all duration-300
        ${getNavbarBackground()}
        ${className}
      `}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Only */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={onLogoClick}
          >
            {/* Logo Container */}
            <div className="relative w-12 h-10 rounded-md-md overflow-hidden flex items-center justify-center group-hover:elevation-1 transition-all duration-300">
              <Image
                src={getLogoSrc()}
                alt={logoAlt}
                width={48}
                height={32}
                className="object-contain w-full h-full filter group-hover:brightness-110 transition-all duration-300"
                priority
              />
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1 rtl:space-x-reverse">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => onLinkClick?.(link)}
                className={`
                  relative font-unbounded font-medium text-sm px-4 py-2 rounded-md-md transition-all duration-300
                  ${textColor} ${hoverTextColor} focus:outline-none ${focusRingColor}
                  group/navlink transform hover:scale-105 active:scale-95
                  ${link.isActive 
                    ? `${activeTextColor} ${activeBgColor} font-semibold` 
                    : ''
                  }
                `}
              >
                {t(link.label)}
                {/* Enhanced active indicator */}
                {link.isActive && (
                  <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-0.5 ${shouldUseDarkContent() ? 'bg-primary' : 'bg-white'} rounded-full`} />
                )}
                {/* Hover underline effect for non-active links */}
                {!link.isActive && (
                  <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0.5 ${shouldUseDarkContent() ? 'bg-primary' : 'bg-white'} rounded-full transition-all duration-300 group-hover/navlink:w-6`} />
                )}
              </button>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher variant="navbar" className="min-w-[80px]" />
            </div>
            
            {/* Theme Toggle */}
            <ThemeToggle className="w-10 h-10" />
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded-md-md ${mobileButtonColor} focus:outline-none ${focusRingColor} transition-all duration-200`}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pt-2 pb-4 space-y-1 bg-surface border-t border-outline-variant">
          {/* Mobile Navigation Links */}
          {links.map((link, index) => (
            <button
              key={link.id}
              onClick={() => {
                onLinkClick?.(link);
                setIsMobileMenuOpen(false);
              }}
              className={`
                block w-full text-left px-4 py-3 rounded-md-md text-sm font-unbounded font-medium transition-all duration-200
                transform hover:scale-[1.02] active:scale-[0.98]
                ${link.isActive
                  ? 'text-primary bg-primary-container/50 font-semibold'
                  : 'text-on-surface hover:text-primary hover:bg-surface-variant'
                }
              `}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              <div className="flex items-center justify-between">
                <span>{t(link.label)}</span>
                {link.isActive && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
            </button>
          ))}
          
          {/* Mobile Controls Section */}
          <div className="border-t border-outline-variant mt-4 pt-4 space-y-3">
            {/* Mobile Language Switcher */}
            <div className="sm:hidden">
              <div className="flex items-center justify-between">
                <span className="text-sm font-unbounded font-medium text-on-surface">Language:</span>
                <LanguageSwitcher variant="default" className="flex-shrink-0" />
              </div>
            </div>
            
            {/* Mobile Theme Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-unbounded font-medium text-on-surface">Theme:</span>
              <ThemeToggle className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
