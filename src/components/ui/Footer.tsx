/**
 * Footer Component
 * 
 * A comprehensive footer component following K2A design with dark theme,
 * decorative wave, and integrated contact form.
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FooterProps, ContactInfo } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSwitcher } from './language-switcher';

/**
 * Social media icons as SVG components for better performance
 */
const SocialIcons = {
  facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12.017 0C8.396 0 7.989.013 6.768.072 5.548.131 4.718.276 3.978.525c-.763.297-1.411.69-2.056 1.336C1.276 2.507.884 3.155.587 3.918.338 4.658.193 5.488.134 6.708.075 7.929.062 8.336.062 11.957c0 3.621.013 4.028.072 5.249.059 1.22.204 2.05.453 2.79.297.763.69 1.411 1.336 2.056.645.646 1.293 1.039 2.056 1.336.74.249 1.57.394 2.79.453 1.221.059 1.628.072 5.249.072 3.621 0 4.028-.013 5.249-.072 1.22-.059 2.05-.204 2.79-.453.763-.297 1.411-.69 2.056-1.336.646-.645 1.039-1.293 1.336-2.056.249-.74.394-1.57.453-2.79.059-1.221.072-1.628.072-5.249 0-3.621-.013-4.028-.072-5.249-.059-1.22-.204-2.05-.453-2.79-.297-.763-.69-1.411-1.336-2.056C19.49 1.276 18.842.884 18.079.587c-.74-.249-1.57-.394-2.79-.453C14.068.013 13.661 0 12.017 0zm0 2.16c3.557 0 3.981.013 5.386.072 1.301.059 2.009.273 2.477.453.623.243 1.067.533 1.534 1 .467.467.757.911 1 1.534.18.468.394 1.176.453 2.477.059 1.405.072 1.829.072 5.386 0 3.557-.013 3.981-.072 5.386-.059 1.301-.273 2.009-.453 2.477-.243.623-.533 1.067-1 1.534-.467.467-.911.757-1.534 1-.468.18-1.176.394-2.477.453-1.405.059-1.829.072-5.386.072-3.557 0-3.981-.013-5.386-.072-1.301-.059-2.009-.273-2.477-.453-.623-.243-1.067-.533-1.534-1-.467-.467-.757-.911-1-1.534-.18-.468-.394-1.176-.453-2.477-.059-1.405-.072-1.829-.072-5.386 0-3.557.013-3.981.072-5.386.059-1.301.273-2.009.453-2.477.243-.623.533-1.067 1-1.534.467-.467.911-.757 1.534-1 .468-.18 1.176-.394 2.477-.453 1.405-.059 1.829-.072 5.386-.072z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M12.017 5.84a6.117 6.117 0 1 0 0 12.234 6.117 6.117 0 0 0 0-12.234zm0 10.084a3.967 3.967 0 1 1 0-7.934 3.967 3.967 0 0 1 0 7.934z" clipRule="evenodd" />
      <circle cx="18.406" cy="5.594" r="1.44" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" />
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
    </svg>
  ),
};

/**
 * Footer Component
 */
export const Footer: React.FC<FooterProps> = ({
  logoSrc = '/logo-white.svg',
  companyName = 'K2A',
  description = "Prenez la route en toute sérénité avec K2A.",
  sections = [],
  socialLinks = [],
  contactInfo,
  copyrightText,
  className = '',
}) => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit feedback to backend
    setSubmitError(null);
    setSubmitSuccess(false);
    setSubmitting(true);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formData.name, email: formData.email, message: formData.comment }),
    })
      .then(async (res) => {
        setSubmitting(false);
        if (!res.ok) {
          // Try parse JSON body, but handle HTML/text (Next 404 page) gracefully
          const text = await res.text().catch(() => null);
          let msg = 'Failed to submit review';
          if (text) {
            try {
              const parsed = JSON.parse(text);
              msg = parsed?.message || msg;
            } catch (e) {
              // Not JSON — could be an HTML 404 page from Next; extract a short snippet
              const snippet = text.replace(/\s+/g, ' ').slice(0, 200);
              msg = `Unexpected response from server: ${snippet}`;
            }
          }
          setSubmitError(msg);
          return;
        }

        setSubmitSuccess(true);
        setFormData({ name: '', email: '', comment: '' });
        // Auto-clear success after a short delay
        setTimeout(() => setSubmitSuccess(false), 4000);
      })
      .catch((err) => {
        setSubmitting(false);
        setSubmitError('Network error');
      });
  };

  // Default footer sections based on the design
  const defaultSections: typeof sections = [
    {
      title: 'Liens rapides',
      links: [
        { label: 'Accueil', href: '/' },
        { label: 'Nos Véhicules', href: '/vehicles' },
        { label: 'Nous Contacter', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
        { label: 'À propos de nous', href: '/about' },
      ],
    },
  ];

  // Default social links if none provided
  const defaultSocialLinks: typeof socialLinks = [
    {
      platform: 'facebook',
      url: 'https://facebook.com/k2a',
      icon: 'facebook',
      ariaLabel: 'Follow us on Facebook',
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com/k2a',
      icon: 'twitter',
      ariaLabel: 'Follow us on Twitter',
    },
    {
      platform: 'instagram',
      url: 'https://instagram.com/k2a',
      icon: 'instagram',
      ariaLabel: 'Follow us on Instagram',
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/company/k2a',
      icon: 'linkedin',
      ariaLabel: 'Follow us on LinkedIn',
    },
  ];

  // Default contact info based on the design
  const defaultContactInfo: ContactInfo = {
    address: '35 Rue de l\'Indépendance, Hydra, Alger',
    phone: '+213 550 00 00 00',
    email: 'contact@k2a-location.dz',
    hours: 'Dimanche - Jeudi : 8h30 - 17h30',
  };

  const footerSections = sections.length > 0 ? sections : defaultSections;
  const footerSocialLinks = socialLinks.length > 0 ? socialLinks : defaultSocialLinks;
  const footerContactInfo = contactInfo || defaultContactInfo;

  return (
    <footer
      id="footer"
      className={`relative text-white ${className}`}
      role="contentinfo"
      style={{ backgroundColor: '#1D1D1B' }}
    >
      {/* Decorative Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform translate-y-[-1px]">
        <svg
          className="relative block w-full h-20 sm:h-24 md:h-28 lg:h-32"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V60c240,40 360,-40 600,0c240,40 360,-40 600,0V0Z"
            fill="#1D1D1B"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-8 sm:pb-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Information */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo only - no text */}
            <div className="flex items-center mb-6">
              <Image
                src="/logo-white.svg"
                alt={`${companyName} Logo`}
                width={120}
                height={50}
                priority
              />
            </div>
            
            {/* Description */}
            <p className="text-gray-300 mb-8 text-base sm:text-lg leading-relaxed max-w-sm">
              {description}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 sm:space-x-6">
              {footerSocialLinks.map((social) => (
                <Link
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 p-2 sm:p-3 rounded-lg hover:bg-gray-800"
                  aria-label={social.ariaLabel}
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6">
                    {SocialIcons[social.icon as keyof typeof SocialIcons]}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="sm:col-span-1 lg:col-span-1">
            {/* <h3 className="font-unbounded font-semibold text-white mb-6 text-lg sm:text-xl">
              Liens rapides
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {footerSections[0]?.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-base sm:text-lg"
                    aria-label={link.ariaLabel}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul> */}
          </div>

          {/* Contact Information */}
          <div className="sm:col-span-1 lg:col-span-1">
            <h3 className="font-unbounded font-semibold text-white mb-6 text-lg sm:text-xl">
              Contact
            </h3>
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  {footerContactInfo.address}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <Link
                  href={`tel:${footerContactInfo.phone}`}
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-base sm:text-lg"
                >
                  {footerContactInfo.phone}
                </Link>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
                <Link
                  href={`mailto:${footerContactInfo.email}`}
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-base sm:text-lg"
                >
                  {footerContactInfo.email}
                </Link>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-300 text-base sm:text-lg">
                  {footerContactInfo.hours}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-unbounded font-semibold text-white mb-6 text-lg sm:text-xl">
              Envoyer des commentaires
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Prénom"
                  required
                  className="w-full px-4 py-3 sm:py-4 bg-transparent border-2 border-orange-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-300 transition-colors duration-200 text-base sm:text-lg"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 sm:py-4 bg-transparent border-2 border-orange-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-300 transition-colors duration-200 text-base sm:text-lg"
                />
              </div>
              
              <div>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  placeholder="Commentaire..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 sm:py-4 bg-transparent border-2 border-orange-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-300 transition-colors duration-200 resize-none text-base sm:text-lg"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 sm:py-4 px-6 rounded-lg transition-colors duration-200 font-unbounded text-base sm:text-lg"
                disabled={submitting}
              >
                {submitting ? 'Envoi...' : 'Envoyer'}
              </button>
            </form>
            {submitError && (
              <p className="mt-2 text-sm text-red-400">{submitError}</p>
            )}
            {submitSuccess && (
              <p className="mt-2 text-sm text-green-400">Merci — votre commentaire a été envoyé.</p>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-sm sm:text-base order-2 sm:order-1">
              © {currentYear} K2A Location. Tous droits réservés.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 order-1 sm:order-2">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <Link
                  href="/legal"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Mentions légales
                </Link>
                <Link
                  href="/cgu"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  CGU
                </Link>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm sm:text-base"
                >
                  Politique de confidentialité
                </Link>
              </div>
              
              {/* Simple Language Switcher */}
              <div className="bg-gray-800 rounded-lg border border-gray-600">
                <LanguageSwitcher variant="navbar" className="min-w-[70px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
