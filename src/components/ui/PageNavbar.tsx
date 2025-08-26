/**
 * Page-level Navbar Component
 * 
 * A sticky navbar that can be used at the page level, outside of the HeroSection
 * Features scroll detection and dynamic background changes
 */

'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { scrollToSection } from '@/lib/utils';
import type { NavbarLink } from '@/types/Navbar';

interface PageNavbarProps {
  activeNavItem?: string;
  className?: string;
}

export function PageNavbar({ 
  activeNavItem = 'home',
  className = ''
}: PageNavbarProps) {
  // Navigation links with updated targets
  const navLinks: NavbarLink[] = [
    { id: 'home', label: 'navigation.home', href: '/', isActive: activeNavItem === 'home' },
    { id: 'vehicles', label: 'navigation.vehicles', href: '/vehicles', isActive: activeNavItem === 'vehicles' },
    { id: 'services', label: 'navigation.services', href: '/#services', isActive: activeNavItem === 'services' },
    { id: 'findUs', label: 'navigation.findUs', href: '/#find-us', isActive: activeNavItem === 'findUs' },
    { id: 'contact', label: 'navigation.contact', href: '/#footer', isActive: activeNavItem === 'contact' },
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
    } else if (link.href.includes('#')) {
      // Navigate to home page and then scroll to section
      const [path, hash] = link.href.split('#');
      if (window.location.pathname === path || (path === '/' && window.location.pathname === '/')) {
        // Already on the target page, just scroll
        scrollToSection(hash);
      } else {
        // Navigate to page and scroll after navigation
        window.location.href = link.href;
      }
    } else {
      // Regular page navigation
      window.location.href = link.href;
    }
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <Navbar
      logoAlt="K2A Car Rental Logo"
      companyName="K2A"
      links={navLinks}
      onLogoClick={handleLogoClick}
      onLinkClick={handleNavLinkClick}
      className={`bg-transparent ${className}`}
    />
  );
}
