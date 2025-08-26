/**
 * Footer Component Types
 * 
 * This file defines the TypeScript interfaces for the Footer component.
 * Following Material Design 3 principles and K2A brand guidelines.
 */

/**
 * Social media link configuration
 */
export interface SocialLink {
  /** Platform name (e.g., 'facebook', 'twitter', 'instagram', 'linkedin') */
  platform: string;
  /** URL to the social media profile */
  url: string;
  /** Icon component or icon name */
  icon: string;
  /** Accessible label for screen readers */
  ariaLabel: string;
}

/**
 * Footer navigation link
 */
export interface FooterLink {
  /** Display text for the link */
  label: string;
  /** URL or path the link points to */
  href: string;
  /** Whether the link opens in a new tab */
  external?: boolean;
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

/**
 * Footer section configuration
 */
export interface FooterSection {
  /** Section title */
  title: string;
  /** Array of links in this section */
  links: FooterLink[];
}

/**
 * Company contact information
 */
export interface ContactInfo {
  /** Company address */
  address: string;
  /** Contact phone number */
  phone: string;
  /** Contact email address */
  email: string;
  /** Business hours */
  hours?: string;
}

/**
 * Props for the Footer component
 */
export interface FooterProps {
  /** Company logo source */
  logoSrc?: string;
  /** Company name */
  companyName?: string;
  /** Brief company description */
  description?: string;
  /** Footer navigation sections */
  sections?: FooterSection[];
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Contact information */
  contactInfo?: ContactInfo;
  /** Copyright text */
  copyrightText?: string;
  /** Additional CSS classes */
  className?: string;
}
