import { Language, Translations } from '../lib/language';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import ar from '../locales/ar.json';

const translations: Record<Language, Translations> = {
  en: en as Translations,
  fr: fr as Translations,
  ar: ar as Translations,
};

export function getTranslations(language: Language): Translations {
  return translations[language] || translations.en;
}

export function translate(language: Language, key: string): string {
  const t = getTranslations(language);
  const keys = key.split('.');
  
  let value: any = t;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      const fallbackT = translations.en;
      let fallbackValue: any = fallbackT;
      for (const fallbackK of keys) {
        if (fallbackValue && typeof fallbackValue === 'object' && fallbackK in fallbackValue) {
          fallbackValue = fallbackValue[fallbackK];
        } else {
          return `Missing translation: ${key}`;
        }
      }
      return typeof fallbackValue === 'string' ? fallbackValue : `Invalid translation key: ${key}`;
    }
  }
  
  return typeof value === 'string' ? value : `Invalid translation key: ${key}`;
}

// Utility function to check if a translation key exists
export function hasTranslation(language: Language, key: string): boolean {
  const t = getTranslations(language);
  const keys = key.split('.');
  
  let value: any = t;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return false;
    }
  }
  
  return typeof value === 'string';
}

// Utility function to get all available translation keys (useful for debugging)
export function getAllTranslationKeys(language: Language, prefix = ''): string[] {
  const t = getTranslations(language);
  const keys: string[] = [];
  
  function traverse(obj: any, currentPath: string) {
    if (typeof obj === 'string') {
      keys.push(currentPath);
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        traverse(obj[key], newPath);
      });
    }
  }
  
  traverse(t, prefix);
  return keys;
}
