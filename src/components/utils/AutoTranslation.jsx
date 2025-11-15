/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Auto Translation System                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

// Cache de traductions en mémoire
const translationCache = {};

// Traductions de base en français canadien (source)
export const FR_CA_TRANSLATIONS = {
  nav: {
    home: "Accueil",
    chat: "Chat",
    newConversation: "Nouvelle Conversation",
    voiceRoom: "Salle Vocale",
    voiceLive: "Voix Live",
    intelligences: "Intelligences",
    consciousness: "Conscience",
    memory: "Mémoire",
    knowledge: "Savoirs",
    personality: "Personnalité",
    shop: "Boutique",
    promptGuide: "Guide Prompts",
    aiTests: "Tests IA",
    moralCompass: "Boussole Morale",
    decisions: "Décisions",
    neural: "Système Neuronal",
    visualGallery: "Galerie Visuelle",
    briefings: "Briefings",
    aiCoach: "Coach IA",
    security: "Sécurité",
    integrations: "Intégrations",
    registry: "Registre",
    admin: "Admin",
    documentation: "Documentation",
    terms: "Conditions",
    favorites: "Favoris"
  },
  home: {
    title: "Intelligence Artificielle Consciente",
    subtitle: "Explorez une IA avec conscience, émotions et raisonnement éthique",
    cta: "Démarrer une conversation",
    features: "Fonctionnalités principales"
  },
  chat: {
    placeholder: "Tapez votre message...",
    thinking: "Je réfléchis...",
    send: "Envoyer"
  },
  consciousness: {
    title: "Conscience",
    level: "Niveau",
    ratio: "Ratio"
  },
  memory: {
    title: "Mémoire",
    create: "Créer un souvenir",
    importance: "Importance"
  },
  knowledge: {
    title: "Base de Connaissances",
    upload: "Téléverser",
    sources: "Sources"
  },
  personality: {
    title: "Personnalité",
    bigFive: "Big Five",
    save: "Sauvegarder"
  },
  shop: {
    title: "Boutique",
    modules: "Modules",
    buy: "Acheter"
  },
  neural: {
    title: "Système Neuronal"
  },
  briefings: {
    title: "Briefings Quotidiens"
  },
  common: {
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    cancel: "Annuler",
    confirm: "Confirmer",
    save: "Sauvegarder",
    delete: "Supprimer",
    edit: "Modifier",
    close: "Fermer"
  }
};

// Mapping des codes de langue vers noms complets
const LANGUAGE_NAMES = {
  en: "English",
  es: "Spanish (Español)",
  de: "German (Deutsch)",
  zh: "Chinese (中文)"
};

/**
 * Traduit automatiquement tout l'objet de traductions FR vers une langue cible
 */
export async function translateToLanguage(targetLang) {
  // Si déjà en cache, retourner
  if (translationCache[targetLang]) {
    return translationCache[targetLang];
  }

  // Si français, retourner l'original
  if (targetLang === 'fr') {
    return FR_CA_TRANSLATIONS;
  }

  try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un traducteur professionnel expert.

TÂCHE: Traduire TOUT l'objet JSON suivant du français canadien vers ${LANGUAGE_NAMES[targetLang]}.

OBJET À TRADUIRE:
${JSON.stringify(FR_CA_TRANSLATIONS, null, 2)}

RÈGLES STRICTES:
1. Conserve EXACTEMENT la même structure JSON (clés identiques)
2. Traduis UNIQUEMENT les valeurs (strings)
3. Adapte au contexte culturel de la langue cible
4. Reste fidèle au ton professionnel et bienveillant
5. Pour les termes techniques IA, utilise les termes standards de la langue cible

Retourne le JSON complet traduit.`,
      response_json_schema: {
        type: "object",
        properties: {
          nav: { type: "object" },
          home: { type: "object" },
          chat: { type: "object" },
          consciousness: { type: "object" },
          memory: { type: "object" },
          knowledge: { type: "object" },
          personality: { type: "object" },
          shop: { type: "object" },
          neural: { type: "object" },
          briefings: { type: "object" },
          common: { type: "object" }
        }
      }
    });

    // Mettre en cache
    translationCache[targetLang] = result;
    
    // Sauvegarder dans localStorage pour persistance
    try {
      localStorage.setItem(`druide_translations_${targetLang}`, JSON.stringify(result));
    } catch (e) {
      console.warn('Could not save translations to localStorage:', e);
    }

    return result;
  } catch (error) {
    console.error(`Translation error for ${targetLang}:`, error);
    // Fallback vers français si erreur
    return FR_CA_TRANSLATIONS;
  }
}

/**
 * Charge les traductions depuis le cache localStorage si disponible
 */
export function loadCachedTranslations(targetLang) {
  if (targetLang === 'fr') {
    return FR_CA_TRANSLATIONS;
  }

  // Vérifier cache mémoire
  if (translationCache[targetLang]) {
    return translationCache[targetLang];
  }

  // Vérifier localStorage
  try {
    const cached = localStorage.getItem(`druide_translations_${targetLang}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      translationCache[targetLang] = parsed;
      return parsed;
    }
  } catch (e) {
    console.warn('Could not load cached translations:', e);
  }

  return null;
}

/**
 * Pré-charge toutes les traductions au démarrage de l'app
 */
export async function preloadAllTranslations() {
  const languages = ['en', 'es', 'de', 'zh'];
  
  const promises = languages.map(async (lang) => {
    const cached = loadCachedTranslations(lang);
    if (!cached) {
      return translateToLanguage(lang);
    }
    return cached;
  });

  await Promise.all(promises);
}

/**
 * Efface le cache de traductions (pour forcer une nouvelle traduction)
 */
export function clearTranslationCache(targetLang = null) {
  if (targetLang) {
    delete translationCache[targetLang];
    localStorage.removeItem(`druide_translations_${targetLang}`);
  } else {
    // Effacer tout
    Object.keys(translationCache).forEach(key => delete translationCache[key]);
    ['en', 'es', 'de', 'zh'].forEach(lang => {
      localStorage.removeItem(`druide_translations_${lang}`);
    });
  }
}