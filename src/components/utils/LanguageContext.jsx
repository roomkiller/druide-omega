/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Language Context (Fixed)                                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation } from './translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'fr';
    
    try {
      const saved = localStorage.getItem('druide_omega_language');
      if (saved) return saved;
      
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs = ['fr', 'en', 'es', 'de', 'zh'];
      return supportedLangs.includes(browserLang) ? browserLang : 'fr';
    } catch (error) {
      return 'fr';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('druide_omega_language', language);
    } catch (error) {
      console.warn('Could not save language preference:', error);
    }
  }, [language]);

  const t = (key) => getTranslation(language, key);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  // Fallback if context is not available
  if (!context) {
    console.warn('useLanguage used outside LanguageProvider, using fallback');
    return {
      language: 'fr',
      setLanguage: () => {},
      t: (key) => getTranslation('fr', key)
    };
  }
  
  return context;
};