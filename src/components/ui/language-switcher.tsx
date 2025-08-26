'use client';

import { useLanguage } from '../../hooks/useLanguage';
import { Language, SUPPORTED_LANGUAGES } from '@/lib/language';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'navbar' | 'default';
}

export function LanguageSwitcher({ className = '', variant = 'default' }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  // Language code mapping for compact display
  const getLanguageCode = (lang: Language): string => {
    const codeMap: Record<Language, string> = {
      'en': 'EN',
      'fr': 'FR', 
      'ar': 'AR'
    };
    return codeMap[lang] || lang.toUpperCase();
  };

  if (variant === 'navbar') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="appearance-none bg-surface border border-outline-variant text-on-surface font-unbounded font-medium text-sm pl-7 pr-8 py-2 rounded-md-md cursor-pointer hover:bg-surface-variant hover:border-outline transition-all duration-200 focus:outline-none focus:bg-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20 min-w-[65px]"
          aria-label="Select language"
        >
          {Object.entries(SUPPORTED_LANGUAGES).map(([code]) => (
            <option key={code} value={code} className="bg-surface text-on-surface font-unbounded">
              {getLanguageCode(code as Language)}
            </option>
          ))}
        </select>
        
        {/* Enhanced dropdown arrow */}
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-on-surface-variant"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        
        {/* Language indicator globe icon */}
        <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
          <svg
            className="w-3 h-3 text-on-surface-variant"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-on-surface font-unbounded">{t('common.language')}:</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="input-outlined text-sm font-unbounded"
      >
        {Object.entries(SUPPORTED_LANGUAGES).map(([code]) => (
          <option key={code} value={code} className="font-unbounded">
            {getLanguageCode(code as Language)}
          </option>
        ))}
      </select>
    </div>
  );
}
