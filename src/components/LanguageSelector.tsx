'use client';

import { useTranslationContext } from '@/contexts/TranslationContext';
import { Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

const languageFlags: Record<string, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
};

export default function LanguageSelector() {
  const { locale, changeLocale, availableLocales } = useTranslationContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    console.log('🌍 LanguageSelector - User clicked on locale:', newLocale);
    changeLocale(newLocale as 'en' | 'es' | 'fr');
    setIsOpen(false);
  };

  console.log('🌍 LanguageSelector - Current locale:', locale, 'Available locales:', availableLocales);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="text-lg">{languageFlags[locale]}</span>
        <span className="hidden sm:inline">{languageNames[locale]}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            {availableLocales.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors ${
                  locale === lang ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{languageFlags[lang]}</span>
                <span className="font-medium">{languageNames[lang]}</span>
                {locale === lang && (
                  <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
