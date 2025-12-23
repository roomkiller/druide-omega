/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Language Context (Simplified with Static Translations)     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from './translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === 'undefined') return 'fr';
    
    try {
      const saved = localStorage.getItem('druide_omega_language');
      const supportedLanguages = ['fr', 'en', 'es', 'de', 'zh', 'ar', 'pt', 'it', 'ja', 'ru', 'hi', 'ko', 'tr', 'pl', 'nl', 'sv', 'no', 'da', 'fi', 'el', 'he', 'th', 'vi', 'id', 'cs', 'ro', 'hu', 'uk'];
      
      if (saved && supportedLanguages.includes(saved)) {
        return saved;
      }
      
      const browserLang = navigator.language.split('-')[0];
      return supportedLanguages.includes(browserLang) ? browserLang : 'fr';
    } catch (error) {
      return 'fr';
    }
  });

  const setLanguage = (newLang) => {
    const supportedLanguages = ['fr', 'en', 'es', 'de', 'zh', 'ar', 'pt', 'it', 'ja', 'ru', 'hi', 'ko', 'tr', 'pl', 'nl', 'sv', 'no', 'da', 'fi', 'el', 'he', 'th', 'vi', 'id', 'cs', 'ro', 'hu', 'uk'];
    if (supportedLanguages.includes(newLang)) {
      setLanguageState(newLang);
      try {
        localStorage.setItem('druide_omega_language', newLang);
        // RTL support for Arabic and Hebrew
        if (newLang === 'ar' || newLang === 'he') {
          document.documentElement.dir = 'rtl';
        } else {
          document.documentElement.dir = 'ltr';
        }
      } catch (error) {
        console.warn('Could not save language preference:', error);
      }
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = TRANSLATIONS[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to French
        let fallback = TRANSLATIONS.fr;
        for (const fk of keys) {
          fallback = fallback?.[fk];
        }
        return fallback || key;
      }
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, loading: false }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    console.warn('useLanguage used outside LanguageProvider, using fallback');
    return {
      language: 'fr',
      setLanguage: () => {},
      t: (key) => {
        const keys = key.split('.');
        let value = TRANSLATIONS.fr;
        for (const k of keys) {
          value = value?.[k];
        }
        return value || key;
      },
      loading: false
    };
  }
  
  return context;
};