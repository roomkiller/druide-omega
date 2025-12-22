/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Language Context with Auto Translation                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  FR_CA_TRANSLATIONS, 
  translateToLanguage, 
  loadCachedTranslations,
  preloadAllTranslations 
} from './AutoTranslation';

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

  const [translations, setTranslations] = useState(FR_CA_TRANSLATIONS);
  const [loading, setLoading] = useState(false);

  // Charger les traductions quand la langue change
  useEffect(() => {
    let isMounted = true;
    
    async function loadTranslations() {
      if (language === 'fr') {
        if (isMounted) {
          setTranslations(FR_CA_TRANSLATIONS);
          setLoading(false);
        }
        return;
      }

      // Essayer de charger depuis le cache d'abord
      const cached = loadCachedTranslations(language);
      if (cached) {
        if (isMounted) {
          setTranslations(cached);
          setLoading(false);
        }
        return;
      }

      // Sinon, traduire automatiquement
      if (isMounted) {
        setLoading(true);
      }
      
      try {
        const translated = await translateToLanguage(language);
        if (isMounted) {
          setTranslations(translated);
        }
      } catch (error) {
        console.error('Translation loading error:', error);
        if (isMounted) {
          setTranslations(FR_CA_TRANSLATIONS); // Fallback
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTranslations();
    
    return () => {
      isMounted = false;
    };
  }, [language]);

  // Pré-charger les traductions au démarrage
  useEffect(() => {
    preloadAllTranslations().catch(console.error);
  }, []);

  // Sauvegarder la langue sélectionnée
  useEffect(() => {
    try {
      localStorage.setItem('druide_omega_language', language);
    } catch (error) {
      console.warn('Could not save language preference:', error);
    }
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback vers français si clé manquante
        let fallback = FR_CA_TRANSLATIONS;
        for (const fk of keys) {
          fallback = fallback?.[fk];
        }
        return fallback || key;
      }
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  // Fallback si contexte non disponible
  if (!context) {
    console.warn('useLanguage used outside LanguageProvider, using fallback');
    return {
      language: 'fr',
      setLanguage: () => {},
      t: (key) => {
        const keys = key.split('.');
        let value = FR_CA_TRANSLATIONS;
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