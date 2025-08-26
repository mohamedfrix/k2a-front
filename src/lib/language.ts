export type Language = 'en' | 'fr' | 'ar';

// Dynamic translations interface - allows any nested structure
export type Translations = Record<string, any>;

// Helper type for translation key paths (dot notation)
export type TranslationKey = string;

export const SUPPORTED_LANGUAGES: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
};

export const DEFAULT_LANGUAGE: Language = 'en';
export const LANGUAGE_COOKIE_NAME = 'preferred-language';

// RTL languages
export const RTL_LANGUAGES: Language[] = ['ar'];

// Utility functions
export function isRTL(language: Language): boolean {
  return RTL_LANGUAGES.includes(language);
}

export function getTextDirection(language: Language): 'ltr' | 'rtl' {
  return isRTL(language) ? 'rtl' : 'ltr';
}
