'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Language, SUPPORTED_LANGUAGES, isRTL, getTextDirection } from '../lib/language';
import { setLanguageCookie } from '../lib/cookies';
import { translate, getTranslations, hasTranslation, getAllTranslationKeys } from '../lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: ReturnType<typeof getTranslations>;
  hasTranslation: (key: string) => boolean;
  getAllKeys: () => string[];
  isRTL: boolean;
  textDirection: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage: Language;
}

export function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const setLanguage = (newLanguage: Language) => {
    if (Object.keys(SUPPORTED_LANGUAGES).includes(newLanguage)) {
      setLanguageState(newLanguage);
      setLanguageCookie(newLanguage);
    }
  };

  const t = (key: string) => translate(language, key);
  const translations = getTranslations(language);
  const checkTranslation = (key: string) => hasTranslation(language, key);
  const getAllKeys = () => getAllTranslationKeys(language);
  const languageIsRTL = isRTL(language);
  const textDirection = getTextDirection(language);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      translations, 
      hasTranslation: checkTranslation,
      getAllKeys,
      isRTL: languageIsRTL,
      textDirection
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
