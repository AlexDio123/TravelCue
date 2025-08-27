'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface TranslationContextType {
  locale: string;
  changeLocale: (locale: 'en' | 'es' | 'fr') => void;
  t: (key: string, defaultValue?: string) => string;
  availableLocales: string[];
  updateCounter: number;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const translationHook = useTranslation();

  

  return (
    <TranslationContext.Provider value={translationHook}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
}
