import { Metadata } from 'next';
import { Language } from './language';
import { translate } from './translations';

export interface LocalizedMetadata {
  title: string;
  description: string;
  keywords?: string;
}

export interface PageMetadataConfig {
  pageName: keyof typeof PAGE_CONFIGS;
  language: Language;
  additionalKeywords?: string[];
}

// Configuration for different pages
const PAGE_CONFIGS = {
  vehicles: 'vehicles',
  home: 'home', 
  about: 'about',
  contact: 'contact'
} as const;

/**
 * Generate localized metadata for a specific page
 */
export function generatePageMetadata(config: PageMetadataConfig): Metadata {
  const { pageName, language, additionalKeywords = [] } = config;
  
  const title = translate(language, `metadata.pages.${pageName}.title`);
  const description = translate(language, `metadata.pages.${pageName}.description`);
  const keywords = translate(language, `metadata.pages.${pageName}.keywords`);
  
  // Combine base keywords with additional ones
  const allKeywords = additionalKeywords.length > 0 
    ? `${keywords}, ${additionalKeywords.join(', ')}`
    : keywords;

  const metadata: Metadata = {
    title,
    description,
    keywords: allKeywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: getOpenGraphLocale(language),
      siteName: translate(language, 'metadata.site.title'),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  // Add language alternates only if we have a proper site URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    metadata.alternates = {
      canonical: `${siteUrl}/${language === 'en' ? '' : language}${getPagePath(pageName)}`,
      languages: {
        'en': `${siteUrl}${getPagePath(pageName)}`,
        'fr': `${siteUrl}/fr${getPagePath(pageName)}`,
        'ar': `${siteUrl}/ar${getPagePath(pageName)}`,
        'x-default': `${siteUrl}${getPagePath(pageName)}`,
      },
    };
  }

  return metadata;
}

/**
 * Generate metadata for the site (used in layout)
 */
export function generateSiteMetadata(language: Language): Metadata {
  const title = translate(language, 'metadata.site.title');
  const description = translate(language, 'metadata.site.description');

  const metadata: Metadata = {
    title: {
      default: title,
      template: `%s | ${translate(language, 'metadata.site.title')}`,
    },
    description,
    keywords: 'car rental, vehicle rental, K2A, Algeria, Tizi Ouzou, BMW, Mercedes, Audi',
    authors: [{ name: 'K2A Car Rental' }],
    creator: 'K2A Car Rental',
    publisher: 'K2A Car Rental',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: '/logo-black.svg', type: 'image/svg+xml' },
        { url: '/favicon.svg', type: 'image/svg+xml' }
      ],
      shortcut: '/logo-black.svg',
      apple: '/logo-black.svg',
    },
    openGraph: {
      type: 'website',
      locale: getOpenGraphLocale(language),
      url: '/',
      title,
      description,
      siteName: title,
      images: [
        {
          url: '/logo-black.svg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@k2arental',
      images: ['/logo-black.svg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  // Add metadataBase and verification only if we have environment variables
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    metadata.metadataBase = new URL(siteUrl);
  }

  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;
  if (googleVerification) {
    metadata.verification = {
      google: googleVerification,
    };
  }

  return metadata;
}

/**
 * Get OpenGraph locale format from language code
 */
function getOpenGraphLocale(language: Language): string {
  const localeMap: Record<Language, string> = {
    'en': 'en_US',
    'fr': 'fr_FR',
    'ar': 'ar_DZ', // Arabic - Algeria
  };
  return localeMap[language] || 'en_US';
}

/**
 * Get the path for a specific page
 */
function getPagePath(pageName: string): string {
  const pathMap: Record<string, string> = {
    home: '',
    vehicles: '/vehicles',
    about: '/about',
    contact: '/contact',
  };
  return pathMap[pageName] || '';
}

/**
 * Generate JSON-LD structured data for better SEO
 */
export function generateStructuredData(language: Language, pageName?: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://k2a-rental.com';
  
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'K2A Car Rental',
    description: translate(language, 'metadata.site.description'),
    url: siteUrl,
    logo: `${siteUrl}/logo-black.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+213-xxx-xxxx', // Replace with actual phone
      contactType: 'customer service',
      availableLanguage: ['English', 'French', 'Arabic'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Your Street Address', // Replace with actual address
      addressLocality: 'Tizi Ouzou',
      addressCountry: 'DZ',
    },
    sameAs: [
      // Add social media URLs when available
    ],
  };

  if (pageName === 'vehicles') {
    return [
      organizationData,
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: translate(language, 'metadata.pages.vehicles.title'),
        description: translate(language, 'metadata.pages.vehicles.description'),
        url: `${siteUrl}/vehicles`,
        isPartOf: {
          '@type': 'WebSite',
          name: translate(language, 'metadata.site.title'),
          url: siteUrl,
        },
        about: {
          '@type': 'Service',
          name: 'Car Rental Service',
          provider: organizationData,
        },
      },
    ];
  }

  return [organizationData];
}
