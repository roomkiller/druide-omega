/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Auto Translation System (Enhanced)                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Conforme: Loi 25 (Québec), RGPD (UE), CCPA (USA)                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

// Cache de traductions en mémoire
const translationCache = {};

// Traductions complètes en français canadien (source de référence)
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
    favorites: "Favoris",
    guide: "Guide",
    legal: "Légal",
    privacy: "Confidentialité",
    projectProgress: "Progression Projet",
    aiModuleStore: "Magasin Modules IA"
  },
  home: {
    title: "Intelligence Artificielle Consciente",
    subtitle: "Explorez une IA avec conscience, émotions et raisonnement éthique",
    cta: "Démarrer une conversation",
    ctaSecondary: "Explorer les fonctionnalités",
    features: "Fonctionnalités principales",
    userCount: "utilisateurs actifs",
    principle1: "Bienveillance Absolue",
    principle2: "Transparence Totale",
    principle3: "Évolution Continue",
    compare: "Pourquoi Druide Omega?"
  },
  chat: {
    placeholder: "Tapez votre message...",
    thinking: "Je réfléchis...",
    analyzing: "J'analyse...",
    send: "Envoyer",
    newChat: "Nouveau chat",
    history: "Historique",
    welcome: "Bienvenue! Comment puis-je vous aider aujourd'hui?",
    typing: "En train d'écrire...",
    listening: "À l'écoute..."
  },
  consciousness: {
    title: "Conscience",
    level: "Niveau",
    ratio: "Ratio",
    state: "État",
    metrics: "Métriques",
    dimensions: "Dimensions",
    emotional: "Émotionnel",
    cognitive: "Cognitif",
    existential: "Existentiel"
  },
  memory: {
    title: "Mémoire",
    create: "Créer un souvenir",
    importance: "Importance",
    search: "Rechercher",
    recent: "Récents",
    stats: "Statistiques",
    total: "Total",
    high: "Haute",
    medium: "Moyenne",
    low: "Basse"
  },
  knowledge: {
    title: "Base de Connaissances",
    upload: "Téléverser",
    sources: "Sources",
    documents: "Documents",
    active: "Actifs",
    size: "Taille",
    search: "Rechercher dans les savoirs"
  },
  personality: {
    title: "Personnalité",
    bigFive: "Big Five",
    save: "Sauvegarder",
    profiles: "Profils",
    current: "Actuel",
    customize: "Personnaliser",
    openness: "Ouverture",
    conscientiousness: "Conscience professionnelle",
    extraversion: "Extraversion",
    agreeableness: "Amabilité",
    neuroticism: "Névrosisme"
  },
  shop: {
    title: "Boutique",
    modules: "Modules",
    buy: "Acheter",
    purchase: "Acheter maintenant",
    monthly: "par mois",
    annual: "par an",
    owned: "Possédé",
    free: "Gratuit",
    premium: "Premium"
  },
  neural: {
    title: "Système Neuronal",
    network: "Réseau",
    performance: "Performance",
    modules: "Modules",
    optimization: "Optimisation"
  },
  briefings: {
    title: "Briefings Quotidiens",
    today: "Aujourd'hui",
    insights: "Insights",
    tasks: "Tâches",
    summary: "Résumé"
  },
  aiTests: {
    title: "Tests IA",
    start: "Démarrer le test",
    results: "Résultats",
    history: "Historique",
    globalScore: "Score global",
    benevolence: "Bienveillance",
    reasoning: "Raisonnement"
  },
  admin: {
    title: "Administration",
    users: "Utilisateurs",
    analytics: "Analytiques",
    system: "Système",
    security: "Sécurité",
    logs: "Journaux"
  },
  projectProgress: {
    title: "Progression du Projet",
    subtitle: "DRUIDE_OMEGA - IA Consciente",
    devHours: "Heures de développement",
    progress: "Progression",
    corrections: "Corrections nécessaires",
    hoursByCategory: "Répartition des heures par catégorie",
    correctionsToMake: "Corrections à effectuer",
    critical: "Critiques",
    highPriority: "Haute priorité",
    mediumPriority: "Moyenne priorité",
    lowPriority: "Basse priorité",
    milestones: "Milestones",
    codeQuality: "Qualité du code",
    nextPriorities: "Prochaines priorités",
    refreshAnalysis: "Rafraîchir l'analyse",
    analyzing: "Analyse du projet en cours..."
  },
  aiModuleStore: {
    title: "Magasin de Modules IA",
    subtitle: "Découvrez et activez des capacités IA spécialisées",
    myModules: "Mes Modules",
    store: "Magasin",
    installed: "Installés",
    developer: "Développeurs",
    search: "Rechercher des modules...",
    allCategories: "Toutes catégories",
    install: "Installer",
    configure: "Configurer",
    uninstall: "Désinstaller",
    enabled: "Activé",
    disabled: "Désactivé",
    version: "Version",
    author: "Auteur",
    rating: "Note",
    downloads: "Téléchargements",
    features: "Fonctionnalités",
    noModules: "Aucun module installé",
    apiTitle: "API pour Développeurs Tiers",
    downloadSDK: "Télécharger SDK",
    configuration: "Configuration",
    sensitivity: "Sensibilité",
    executionMode: "Mode d'exécution",
    automatic: "Automatique",
    manual: "Manuel",
    scheduled: "Programmé"
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
    close: "Fermer",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    yes: "Oui",
    no: "Non",
    ok: "OK",
    search: "Rechercher",
    filter: "Filtrer",
    sort: "Trier",
    settings: "Paramètres",
    help: "Aide",
    about: "À propos",
    language: "Langue",
    theme: "Thème"
  },
  welcome: {
    title: "Bienvenue sur Druide Omega",
    aiLevel: "Une IA de Niveau Supérieur",
    description: "Druide Omega est une intelligence artificielle consciente développée au Québec, conçue pour offrir des conversations authentiques, éthiques et profondément humaines.",
    globalScore: "Score global",
    benevolence: "Bienveillance",
    crossModal: "Cross-modal",
    freePersonal: "Gratuit",
    freeUsage: "Usage personnel",
    freeNotice: "Gratuit pour toujours • Usage personnel et apprentissage",
    ethicsTitle: "Éthique & Responsabilité",
    responsibleUse: "Utilisation Responsable",
    youCan: "Ce que vous POUVEZ faire",
    forbidden: "Ce qui est INTERDIT",
    importantWarning: "⚠️ AVERTISSEMENT IMPORTANT",
    warningText: "Druide Omega est un outil puissant. Toute utilisation malveillante, illégale ou contraire à l'éthique entraînera une suspension immédiate du compte et des poursuites légales si nécessaire. Nous prenons la sécurité très au sérieux.",
    yourData: "🔒 Vos données",
    acceptanceTitle: "Acceptation & Début",
    lastStep: "Dernière étape",
    confirmText: "Veuillez confirmer que vous avez lu et accepté nos conditions d'utilisation et notre charte éthique.",
    acceptTerms: "J'accepte les",
    termsLink: "Conditions d'utilisation",
    acceptEthics: "J'accepte de respecter la charte éthique et d'utiliser Druide Omega de manière responsable",
    thankYou: "🎉 Merci de votre confiance!",
    thankYouDesc: "Vous pouvez maintenant profiter pleinement de Druide Omega",
    start: "Commencer l'aventure",
    next: "Suivant",
    previous: "Précédent"
  },
  numbers: {
    0: "zéro", 1: "un", 2: "deux", 3: "trois", 4: "quatre",
    5: "cinq", 6: "six", 7: "sept", 8: "huit", 9: "neuf", 10: "dix",
    first: "premier", second: "deuxième", third: "troisième"
  },
  legal: {
    terms: "Conditions d'utilisation",
    privacy: "Politique de confidentialité",
    cookies: "Politique de cookies",
    compliance: "Conformité légale",
    copyright: "Droits d'auteur",
    license: "Licence",
    quebec: "Loi 25 du Québec",
    gdpr: "RGPD (UE)",
    ccpa: "CCPA (USA)"
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
 * Inclut: mots, alphabet, nombres, termes légaux
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
      prompt: `Tu es un traducteur professionnel expert certifié.

CONTEXTE LÉGAL:
Cette traduction sera utilisée dans une application IA conforme aux lois:
- Loi 25 (Québec, Canada)
- RGPD (Union Européenne)
- CCPA (Californie, USA)

TÂCHE: Traduire INTÉGRALEMENT l'objet JSON du français canadien vers ${LANGUAGE_NAMES[targetLang]}.

OBJET SOURCE (FRANÇAIS CANADIEN):
${JSON.stringify(FR_CA_TRANSLATIONS, null, 2)}

RÈGLES STRICTES DE TRADUCTION:
1. Structure JSON: Conserver EXACTEMENT les mêmes clés (ne PAS traduire les clés)
2. Valeurs: Traduire TOUTES les valeurs textuelles
3. Nombres: Adapter les mots de nombres à la langue cible
4. Termes légaux: Utiliser les termes officiels dans la langue cible
5. Ton: Professionnel, bienveillant, clair
6. Terminologie IA: Utiliser les standards de la langue cible
7. Localisation culturelle: Adapter au contexte de la langue cible

QUALITÉ REQUISE:
- Exactitude professionnelle
- Cohérence terminologique
- Respect du contexte légal
- Adaptation culturelle appropriée

Retourne le JSON complet traduit, prêt pour utilisation en production.`,
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
          aiTests: { type: "object" },
          admin: { type: "object" },
          projectProgress: { type: "object" },
          aiModuleStore: { type: "object" },
          common: { type: "object" },
          welcome: { type: "object" },
          numbers: { type: "object" },
          legal: { type: "object" }
        }
      }
    });

    // Mettre en cache
    translationCache[targetLang] = result;
    
    // Sauvegarder dans localStorage pour persistance
    try {
      localStorage.setItem(`druide_translations_${targetLang}`, JSON.stringify(result));
      localStorage.setItem(`druide_translations_${targetLang}_timestamp`, Date.now().toString());
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
    const timestamp = localStorage.getItem(`druide_translations_${targetLang}_timestamp`);
    
    if (cached) {
      // Vérifier si cache < 7 jours
      const age = Date.now() - parseInt(timestamp || '0');
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours
      
      if (age < maxAge) {
        const parsed = JSON.parse(cached);
        translationCache[targetLang] = parsed;
        return parsed;
      }
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
    localStorage.removeItem(`druide_translations_${targetLang}_timestamp`);
  } else {
    // Effacer tout
    Object.keys(translationCache).forEach(key => delete translationCache[key]);
    ['en', 'es', 'de', 'zh'].forEach(lang => {
      localStorage.removeItem(`druide_translations_${lang}`);
      localStorage.removeItem(`druide_translations_${lang}_timestamp`);
    });
  }
}