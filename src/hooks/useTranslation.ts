import { useState, useEffect, useCallback } from 'react';
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';
import frTranslations from '../locales/fr.json';

export type Locale = 'en' | 'es' | 'fr';

interface TranslationData {
  [key: string]: unknown;
}

const translations: Record<Locale, TranslationData> = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
};

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('en');
  const [currentTranslations, setCurrentTranslations] = useState<TranslationData>(translations.en);
  const [updateCounter, setUpdateCounter] = useState(0);

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;

    
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
      setCurrentTranslations(translations[savedLocale]);
    } else {
      // Using default locale: en
    }
  }, []);

  const changeLocale = useCallback((newLocale: Locale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      setCurrentTranslations(translations[newLocale]);
      localStorage.setItem('locale', newLocale);
      setUpdateCounter(prev => prev + 1);
    } else {
      console.error('🌍 Translation Hook - Invalid locale:', newLocale);
    }
  }, [locale, updateCounter]);

  const getText = useCallback((key: string, defaultValue?: string): string => {
    const keys = key.split('.');
    let value: unknown = currentTranslations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        console.warn('🌍 Translation Hook - Key not found:', key, 'using default:', defaultValue || key);
        return defaultValue || key;
      }
    }
    
    const result = typeof value === 'string' ? value : defaultValue || key;
    return result;
  }, [currentTranslations, updateCounter]);



  return {
    locale,
    changeLocale,
    t: getText,
    availableLocales: Object.keys(translations) as Locale[],
    updateCounter,
  };
}
