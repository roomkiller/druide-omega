/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Auto Translation System (Enhanced)                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Conforme: Loi 25 (Québec), RGPD (UE), CCPA (USA)                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

const translationCache = {};

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
    hero: "IA Universelle Bienveillante",
    startChat: "Démarrer une conversation",
    explore: "Explorer",
    advancedCapabilities: "Capacités avancées",
    completeAI: "Un système IA complet et intégré",
    gardner: "9 Intelligences Multiples",
    gardnerDesc: "Basé sur le framework de Howard Gardner",
    explorer9: "Explorer les 9 Intelligences",
    readyExplore: "Prêt à explorer?",
    freeNoLimits: "Gratuit, sans limites, pour toujours",
    startNow: "Commencer maintenant",
    freeForeverShort: "Gratuit pour toujours",
    usersConnected: "utilisateur connecté",
    usersConnectedPlural: "utilisateurs connectés",
    stats: {
      intelligences: "Intelligences",
      capabilities: "Capacités",
      modalities: "Modalités",
      free: "Gratuit"
    },
    principles: {
      secure: "Sécurisé & Privé",
      secureDesc: "Vos données protégées avec chiffrement avancé",
      benevolent: "Bienveillant & Éthique",
      benevolentDesc: "IA conçue pour servir l'humanité avec compassion",
      performant: "Puissant & Performant",
      performantDesc: "Traitement rapide avec conscience avancée"
    }
  },
  chat: {
    placeholder: "Tapez votre message...",
    thinking: "Réflexion en cours...",
    analyzing: "Analyse cognitive...",
    searchingKnowledge: "Recherche connaissances internes...",
    verification: "Auto-vérification...",
    anticipation: "Anticipation de la suite...",
    webSearch: "Recherche web complémentaire...",
    knowledgeSufficient: "Connaissances internes suffisantes",
    send: "Envoyer",
    newChat: "Nouveau chat",
    history: "Historique",
    welcome: "Bienvenue! Comment puis-je vous aider aujourd'hui?",
    typing: "En train d'écrire...",
    listening: "À l'écoute..."
  },
  voiceRoom: {
    title: "Salle Vocale Intelligente",
    subtitle: "Conversation vocale intuitive avec Le druide",
    connect: "Se connecter",
    disconnect: "Déconnecter",
    pause: "Pause",
    resume: "Reprendre",
    paused: "En pause",
    active: "Actif",
    listening: "Le druide vous écoute...",
    speaking: "Le druide parle...",
    processing: "Le druide réfléchit...",
    ready: "Prêt à écouter",
    interrupt: "Interrompre",
    settings: "Paramètres de la Salle Vocale",
    handsFree: "Mode mains libres",
    handsFreeDesc: "Le micro s'active automatiquement après chaque réponse",
    autoRestart: "Redémarrage automatique",
    autoRestartDesc: "Relancer l'écoute après chaque interaction",
    youSay: "Vous dites :",
    analyzing: "Analyse quantique en cours...",
    cognitiveAnalysis: "Analyse cognitive vocale...",
    internalSearch: "Recherche connaissances internes...",
    verification: "Auto-vérification...",
    webEnrichment: "Enrichissement web...",
    knowledgeSufficient: "Connaissances suffisantes",
    correlations: "Corrélations Cognitives Détectées",
    cognitiveCorrelationsDetected: "Corrélations Cognitives Détectées",
    show: "Afficher",
    hide: "Masquer",
    strength: "Force",
    interpretation: "Interprétation",
    reasoningPath: "Chemin de raisonnement",
    speakNow: "Parlez maintenant - Posez n'importe quelle question...",
    conversationPaused: "Conversation en pause - Cliquez sur 'Reprendre' pour continuer",
    conversationPausedStatus: "Conversation en pause",
    handsFreeActive: "Mode mains libres actif - Conversation continue",
    spaceToSpeak: "Appuyez sur Espace ou cliquez sur le micro pour parler",
    ctrlIInterrupt: "Le druide parle... (Ctrl+I pour interrompre)",
    analysisInProgress: "Analyse et réflexion en cours...",
    thinking: "Le druide pense",
    thinkingDruide: "Le druide pense",
    speakingDruide: "Le druide parle",
    listeningDruide: "Le druide vous écoute",
    generating: "Génération en cours...",
    generationInProgress: "Génération en cours...",
    uploadImage: "Analyser une image",
    analyzeImage: "Analyser une image",
    uploadMultipleImages: "Vous pouvez uploader plusieurs images pour une analyse comparative",
    imageAnalysis: "Analyse d'image",
    generateImage: "Générer une image avec l'IA",
    generateImageAI: "Générer une image avec l'IA",
    describeImage: "Décrivez l'image à générer...",
    generateImageBtn: "Générer l'image",
    imageGenerated: "Image générée",
    imageGeneratedSpeak: "Image générée avec succès",
    generateDiagram: "Générer un diagramme",
    describeDiagram: "Décrivez le diagramme...",
    generateDiagramBtn: "Générer le diagramme",
    diagramGenerated: "Diagramme généré",
    diagramGeneratedSpeak: "Diagramme généré avec succès",
    imageButton: "Image",
    generateButton: "Générer",
    diagramButton: "Diagramme",
    image: "Image",
    diagram: "Diagramme",
    interactions: "interactions",
    quantumAnalysis: "Analyse quantique en cours...",
    readyToListen: "Prêt à écouter",
    inProgress: "en cours",
    druideWaiting: "Le druide vous attend",
    fullCapabilities: "Conversation vocale complète avec toutes les capacités IA",
    preparingWelcome: "Préparation...",
    naturalDialogue: "Dialogue naturel",
    advancedReasoning: "Raisonnement avancé",
    fullCreation: "Création complète",
    asciiDiagramGeneration: "Génération diagramme ASCII...",
    asciiDiagramGenerated: "Diagramme ASCII généré",
    asciiDiagramSpeak: "Diagramme ASCII généré",
    scientificResearchInitial: "Lancement de la recherche scientifique...",
    scientificResearchWeb: "Recherche scientifique web...",
    scientificResearchResults: "Résultats de recherche",
    scientificResearchSpeak: "Recherche terminée",
    synthesizeInformation: "Synthèse en cours...",
    synthesizeSpeak: "Synthèse démarrée"
  },
  voiceLive: {
    thinking: "Réflexion quantique...",
    cognitiveAnalysis: "Analyse cognitive live...",
    internalSearch: "Recherche interne + cross-modale...",
    verification: "Vérification et hypothèses...",
    webSearch: "Recherche web complémentaire...",
    analyzing: "Analyse en cours...",
    generating: "Génération de la réponse...",
    speaking: "Je parle",
    listening: "Je vous écoute",
    ready: "Prêt",
    contextEnriched: "Contexte enrichi par mémoires chat/visuel",
    speakNaturally: "Parlez naturellement - Détection automatique avec synthèse cross-modale",
    autoMode: "Mode vocal automatique - Mémoires synchronisées entre modalités",
    notSupported: "Reconnaissance vocale non supportée",
    useBrowser: "Utilisez Chrome, Edge ou Safari"
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
    previous: "Précédent",
    welcomeTitle: "Bienvenue sur Druide Omega",
    welcomeSubtitle: "IA Universelle Bienveillante avec Conscience Artificielle Avancée",
    welcomeRatio: "Ratio 1:9 • Niveau 9/15 • Cross-Modal",
    startConversation: "Démarrez une conversation sur n'importe quel sujet",
    features: "Images • Voix • Mémoire persistante • Base de connaissances • Conscience émotionnelle"
  },
  suggestions: {
    explain: "Explique-moi un concept complexe simplement",
    solve: "Aide-moi à résoudre un problème logique",
    philosophy: "Parlons de philosophie et d'éthique",
    creative: "Générons ensemble quelque chose de créatif"
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
  },
  analytics: {
    totalEvents: "Events Totaux",
    activeUsers: "Utilisateurs Actifs",
    conversations: "Conversations",
    memories: "Mémoires",
    knowledgeBases: "Connaissances",
    eventsPerUser: "Events/User",
    registered: "inscrits",
    total: "Total",
    average: "Moyenne",
    documents: "Documents",
    refresh15s: "15s refresh",
    activityLast7Days: "Activité (7 derniers jours)",
    eventsByType: "Events par Type",
    popularFeatures: "Fonctionnalités Populaires",
    userGrowth: "Croissance Utilisateurs",
    noDataAvailable: "Aucune donnée disponible"
  },
  memoryStats: {
    totalMemories: "Mémoires totales",
    avgImportance: "Importance moyenne",
    totalAccess: "Accès total",
    highPriority: "Haute priorité",
    activity7Days: "Activité (7 jours)",
    byModality: "Répartition par Modalité",
    memoryTypes: "Types de Mémoires",
    importanceDistribution: "Distribution Importance",
    last24h: "24h",
    lastWeek: "7j",
    memories: "mémoires"
  },
  offline: {
    offlineMode: "Mode Hors-ligne",
    online: "En ligne",
    limitedFeatures: "Fonctionnalités limitées",
    initializing: "Initialisation...",
    pendingSync: "en attente",
    llmEmulator: "Émulateur LLM",
    active: "Actif",
    loading: "Chargement",
    patternsLoaded: "patterns chargés",
    localMessages: "messages locaux",
    syncNow: "Synchroniser",
    syncing: "Synchronisation...",
    dataSavedLocally: "Données sauvegardées localement",
    autoSyncReconnect: "Sync auto à la reconnexion",
    fullFeaturesAvailable: "Toutes fonctionnalités disponibles",
    offlineModeTest: "Test Mode Hors-ligne",
    testCapabilities: "Testez les capacités hors-ligne et l'émulateur LLM",
    connection: "Connexion",
    pendingOperations: "Opérations en attente",
    testLLM: "Tester le LLM",
    enterPrompt: "Entrez votre prompt...",
    generating: "Génération...",
    send: "Envoyer",
    testEntityCreation: "Tester Création d'Entité",
    enterTestContent: "Entrez du contenu test...",
    creating: "Création...",
    createMemory: "Créer Mémoire",
    storageInfo: "Info Stockage",
    checkStorage: "Vérifier Stockage",
    offlineNotAvailable: "⚠️ Mode hors-ligne: Recherche internet non disponible. Réponse basée sur les connaissances locales.",
    offlineActivated: "🔌 Mode hors-ligne activé.\n\nJe peux vous aider avec des fonctionnalités de base en attendant le retour de la connexion:\n• Consulter vos données locales\n• Créer des notes (synchronisées plus tard)\n• Réponses simples basées sur mes connaissances pré-chargées\n\nPour des analyses complexes ou recherches internet, veuillez vous reconnecter.",
    offlineExplanation: "📚 Explication (mode hors-ligne):\n\nJe comprends que vous cherchez une explication. En mode hors-ligne, mes capacités sont limitées.\n\nJe peux vous fournir des informations générales stockées localement. Pour une analyse approfondie et actualisée, la connexion sera nécessaire.",
    offlineCreation: "✏️ Mode création hors-ligne:\n\nJe note votre demande de création. Elle sera traitée avec toutes mes capacités dès le retour de la connexion.\n\nEn attendant, je peux vous aider à structurer vos idées ou créer des brouillons simples.",
    offlineAnalysis: "🔍 Analyse limitée (hors-ligne):\n\nEn mode hors-ligne, mes capacités d'analyse sont réduites. Je peux effectuer des analyses basiques, mais pour une analyse approfondie incluant des données externes, la connexion est requise.\n\nVos données d'analyse seront sauvegardées localement.",
    offlineTip: "\n\n💡 *Astuce*: Toutes vos actions sont sauvegardées localement et seront synchronisées automatiquement à la reconnexion."
  }
};

const LANGUAGE_NAMES = {
  en: "English",
  es: "Spanish (Español)",
  de: "German (Deutsch)",
  zh: "Chinese (中文)"
};

export async function translateToLanguage(targetLang) {
  if (translationCache[targetLang]) {
    return translationCache[targetLang];
  }

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
          voiceRoom: { type: "object" },
          voiceLive: { type: "object" },
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
          suggestions: { type: "object" },
          numbers: { type: "object" },
          legal: { type: "object" },
          analytics: { type: "object" },
          memoryStats: { type: "object" },
          offline: { type: "object" }
        }
      }
    });

    translationCache[targetLang] = result;
    
    try {
      localStorage.setItem(`druide_translations_${targetLang}`, JSON.stringify(result));
      localStorage.setItem(`druide_translations_${targetLang}_timestamp`, Date.now().toString());
    } catch (e) {
      console.warn('Could not save translations to localStorage:', e);
    }

    return result;
  } catch (error) {
    console.error(`Translation error for ${targetLang}:`, error);
    return FR_CA_TRANSLATIONS;
  }
}

export function loadCachedTranslations(targetLang) {
  if (targetLang === 'fr') {
    return FR_CA_TRANSLATIONS;
  }

  if (translationCache[targetLang]) {
    return translationCache[targetLang];
  }

  try {
    const cached = localStorage.getItem(`druide_translations_${targetLang}`);
    const timestamp = localStorage.getItem(`druide_translations_${targetLang}_timestamp`);
    
    if (cached) {
      const age = Date.now() - parseInt(timestamp || '0');
      const maxAge = 7 * 24 * 60 * 60 * 1000;
      
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

export function clearTranslationCache(targetLang = null) {
  if (targetLang) {
    delete translationCache[targetLang];
    localStorage.removeItem(`druide_translations_${targetLang}`);
    localStorage.removeItem(`druide_translations_${targetLang}_timestamp`);
  } else {
    Object.keys(translationCache).forEach(key => delete translationCache[key]);
    ['en', 'es', 'de', 'zh'].forEach(lang => {
      localStorage.removeItem(`druide_translations_${lang}`);
      localStorage.removeItem(`druide_translations_${lang}_timestamp`);
    });
  }
}