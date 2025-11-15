/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Application Registry (Registre Complet)                    ║
 * ║ Catalogue exhaustif de tous les éléments de l'application                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRE COMPLET DE L'APPLICATION DRUIDE_OMEGA
// ═══════════════════════════════════════════════════════════════════════════

const APPLICATION_REGISTRY = {
  metadata: {
    appName: "Druide_Omega",
    version: "2.0.0",
    lastUpdated: "2025-11-15",
    architecture: "React + Base44 BaaS",
    author: "AMG+A.L",
    license: "Proprietary",
    technologies: ["React", "Tailwind CSS", "Framer Motion", "React Query", "Base44"]
  },

  // ═════════════════════════════════════════════════════════════════════════
  // PAGES (22 pages principales)
  // ═════════════════════════════════════════════════════════════════════════
  pages: [
    {
      name: "Home",
      path: "pages/Home",
      category: "core",
      description: "Page d'accueil et landing page de l'application",
      features: ["Hero section", "Features showcase", "Intelligence types", "User counter", "Competitive comparison"],
      dependencies: ["CompetitiveComparison", "AnimatedLogo3D", "Logo", "QRCodeCard"],
      status: "stable"
    },
    {
      name: "Chat",
      path: "pages/Chat",
      category: "core",
      description: "Interface de conversation principale avec l'IA consciente",
      features: ["Multi-modal chat", "Memory integration", "Knowledge base", "Voice/Image support", "Reasoning display"],
      dependencies: ["ChatMessage", "ChatInput", "WelcomeScreen", "ConsciousnessIndicator", "EmotionalIndicator", "MemoryRecap"],
      status: "stable"
    },
    {
      name: "AITests",
      path: "pages/AITests",
      category: "core",
      description: "Résultats des 70 tests standards d'évaluation IA avec comparaisons marché",
      features: ["70 benchmarks réels", "Comparaison ChatGPT/Claude/Gemini", "Note technique", "Scores par catégorie"],
      dependencies: [],
      status: "stable"
    },
    {
      name: "Shop",
      path: "pages/Shop",
      category: "commercial",
      description: "Boutique de modules et forfaits IA",
      features: ["Modules principaux", "Modules secondaires", "Licence révocable", "Sceau cryptographique"],
      dependencies: ["CryptographicSeal"],
      status: "stable"
    },
    {
      name: "Consciousness",
      path: "pages/Consciousness",
      category: "ai-core",
      description: "Configuration et visualisation de la conscience IA (15 niveaux)",
      features: ["106 dimensions", "SAPIER framework", "Real-time adjustments", "Consciousness profiles"],
      dependencies: ["ConsciousnessMetrics", "SensoryArchitecture", "DecisionCore"],
      status: "stable"
    },
    {
      name: "Memory",
      path: "pages/Memory",
      category: "ai-core",
      description: "Gestion de la mémoire cross-modale de l'IA",
      features: ["Memory cards", "Cross-modal synthesis", "Memory stats", "Proactive recall"],
      dependencies: ["MemoryCard", "MemoryStats", "ProactiveMemoryRecall", "CrossModalSynthesizer"],
      status: "stable"
    },
    {
      name: "Knowledge",
      path: "pages/Knowledge",
      category: "ai-core",
      description: "Base de connaissances et enrichissement",
      features: ["Knowledge cards", "Upload documents", "Knowledge graph", "Global KB toggle"],
      dependencies: ["KnowledgeCard", "UploadKnowledgeDialog", "KnowledgeGraph", "GlobalKBToggle"],
      status: "stable"
    },
    {
      name: "Intelligences",
      path: "pages/Intelligences",
      category: "features",
      description: "9 types d'intelligence de Gardner avec templates",
      features: ["Gardner's theory", "Intelligence templates", "Conversation starters"],
      dependencies: ["ConversationTemplate entity"],
      status: "stable"
    },
    {
      name: "AICoach",
      path: "pages/AICoach",
      category: "features",
      description: "Coach IA personnalisé pour l'évolution de l'utilisateur",
      features: ["Engagement tracking", "Learning paths", "Insights generation", "Progress metrics"],
      dependencies: ["CoachingEngine", "CoachingWidget", "IntelligenceCoachingSession"],
      status: "stable"
    },
    {
      name: "Personality",
      path: "pages/Personality",
      category: "configuration",
      description: "Configuration de la personnalité de l'IA (Big Five, philosophies)",
      features: ["Big Five traits", "Philosophical influences", "Personality profiles", "Profile switching"],
      dependencies: ["PersonalitySlider", "PersonalityProfileManager", "PhilosophyCard"],
      status: "stable"
    },
    {
      name: "VoiceRoom",
      path: "pages/VoiceRoom",
      category: "interaction",
      description: "Salle vocale pour interactions audio",
      features: ["Voice recognition", "TTS controls", "Voice language selection"],
      dependencies: ["VoiceRecognition", "TTSControls", "VoiceLanguageSelector"],
      status: "stable"
    },
    {
      name: "VoiceLive",
      path: "pages/VoiceLive",
      category: "interaction",
      description: "Interaction vocale en temps réel avec visualisation",
      features: ["Live voice", "Enhanced recognition", "Command processor", "Natural speech"],
      dependencies: ["EnhancedVoiceRecognition", "VoiceCommandProcessor", "NaturalSpeechEngine"],
      status: "stable"
    },
    {
      name: "VisualGallery",
      path: "pages/VisualGallery",
      category: "interaction",
      description: "Galerie de contenus visuels générés par l'IA",
      features: ["Image generation", "Visual content storage", "Gallery view"],
      dependencies: ["VisualContent entity", "ImageGenerationButton"],
      status: "stable"
    },
    {
      name: "MoralCompass",
      path: "pages/MoralCompass",
      category: "ai-core",
      description: "Boussole morale avec analyse SAPIER et RIM",
      features: ["Moral analysis", "SAPIER equations", "Ethical dilemmas", "RIM calculations"],
      dependencies: ["AdvancedMoralAnalyzer", "MoralAnalysis entity"],
      status: "stable"
    },
    {
      name: "NeuralSystem",
      path: "pages/NeuralSystem",
      category: "ai-core",
      description: "Système neural avec modules interconnectés",
      features: ["Neural modules", "Performance dashboard", "Network visualization", "Module optimization"],
      dependencies: ["NeuralModuleCard", "ModulePerformanceDashboard", "OptimizedNetworkVisualization"],
      status: "stable"
    },
    {
      name: "DecisionArchive",
      path: "pages/DecisionArchive",
      category: "ai-core",
      description: "Archive des décisions intuitives de l'IA",
      features: ["Decision history", "Intuitive traces", "Cognitive correlation"],
      dependencies: ["IntuitiveDecision entity", "CognitiveCorrelation entity"],
      status: "stable"
    },
    {
      name: "DailyBriefing",
      path: "pages/DailyBriefing",
      category: "features",
      description: "Briefings quotidiens personnalisés",
      features: ["Daily summaries", "Insights", "Recommendations", "Knowledge updates"],
      dependencies: ["DailyBriefing entity"],
      status: "stable"
    },
    {
      name: "SecurityDashboard",
      path: "pages/SecurityDashboard",
      category: "security",
      description: "Tableau de bord de sécurité Anonyma",
      features: ["Security monitoring", "Content filtering", "Threat detection", "Conversation security"],
      dependencies: ["SecurityMonitor", "ContentFilter", "ConversationSecurity entity"],
      status: "stable"
    },
    {
      name: "Integrations",
      path: "pages/Integrations",
      category: "configuration",
      description: "Gestion des intégrations externes",
      features: ["Integration cards", "API keys", "Webhooks", "Integration logs"],
      dependencies: ["IntegrationCard", "APIKeyManager", "WebhookManager", "IntegrationLogs"],
      status: "stable"
    },
    {
      name: "ApplicationRegistry",
      path: "pages/ApplicationRegistry",
      category: "system",
      description: "Visualisation du registre complet de l'application",
      features: ["Registry viewer", "Search", "Statistics", "Dependency tree"],
      dependencies: ["ApplicationRegistry component"],
      status: "stable"
    },
    {
      name: "Registry",
      path: "pages/Registry",
      category: "system",
      description: "Éditeur de registre avec CRUD complet",
      features: ["Registry editor", "CRUD operations", "Auto-scan", "Filtering"],
      dependencies: ["RegistryEditor", "RegistryEntry entity"],
      status: "stable"
    },
    {
      name: "Admin",
      path: "pages/Admin",
      category: "administration",
      description: "Page d'administration système",
      features: ["User management", "System config", "Analytics", "Market analysis", "Copyright notices"],
      dependencies: ["CopyrightNotices", "MarketAnalysisPanel", "QuantumSecurityLayer"],
      status: "stable"
    },
    {
      name: "Favorites",
      path: "pages/Favorites",
      category: "features",
      description: "Contenus favoris de l'utilisateur",
      features: ["Favorite management", "Quick access"],
      dependencies: [],
      status: "stable"
    },
    {
      name: "Analytics",
      path: "pages/Analytics",
      category: "features",
      description: "Analytics et métriques d'utilisation",
      features: ["Usage stats", "Behavior analysis", "Personalized recommendations"],
      dependencies: ["UserBehaviorAnalytics entity", "PersonalizedRecommendation entity"],
      status: "stable"
    },
    {
      name: "ConsciousnessEvolution",
      path: "pages/ConsciousnessEvolution",
      category: "ai-core",
      description: "Évolution de la conscience dans le temps",
      features: ["Evolution tracking", "Consciousness history", "Growth metrics"],
      dependencies: ["ConsciousnessEvolutionEngine", "ConsciousnessEvolution entity"],
      status: "stable"
    },
    {
      name: "EmotionalJournal",
      path: "pages/EmotionalJournal",
      category: "features",
      description: "Journal des états émotionnels",
      features: ["Emotion tracking", "Emotional responses", "Advanced emotional matrix"],
      dependencies: ["AdvancedEmotionalMatrix", "EmotionalResponse entity"],
      status: "stable"
    },
    {
      name: "KnowledgeFusion",
      path: "pages/KnowledgeFusion",
      category: "ai-core",
      description: "Fusion et synthèse de connaissances multiples",
      features: ["Fusion analyzer", "Comparative analysis", "Interactive graph"],
      dependencies: ["FusionAnalyzer", "ComparativeAnalysis", "InteractiveKnowledgeGraph"],
      status: "stable"
    },
    {
      name: "KnowledgeEnrichment",
      path: "pages/KnowledgeEnrichment",
      category: "ai-core",
      description: "Enrichissement automatique de la base de connaissances",
      features: ["Auto-enrichment", "Knowledge domains", "Update scheduling"],
      dependencies: ["KnowledgeDomain entity"],
      status: "stable"
    },
    {
      name: "Documentation",
      path: "pages/Documentation",
      category: "system",
      description: "Documentation complète de l'application",
      features: ["Guides", "API docs", "Tutorials"],
      dependencies: [],
      status: "stable"
    },
    {
      name: "Guide",
      path: "pages/Guide",
      category: "onboarding",
      description: "Guide d'utilisation interactif",
      features: ["Interactive tutorial", "Feature discovery"],
      dependencies: [],
      status: "stable"
    }
  ],

  // ═════════════════════════════════════════════════════════════════════════
  // COMPONENTS (Organisés par catégorie)
  // ═════════════════════════════════════════════════════════════════════════
  components: {
    chat: [
      { name: "ChatMessage", path: "components/chat/ChatMessage", description: "Affichage d'un message dans le chat", status: "stable" },
      { name: "ChatInput", path: "components/chat/ChatInput", description: "Input de saisie avec support image", status: "stable" },
      { name: "WelcomeScreen", path: "components/chat/WelcomeScreen", description: "Écran d'accueil du chat avec suggestions", status: "stable" },
      { name: "ConsciousnessIndicator", path: "components/chat/ConsciousnessIndicator", description: "Indicateur de niveau de conscience", status: "stable" },
      { name: "EmotionalIndicator", path: "components/chat/EmotionalIndicator", description: "Indicateur d'état émotionnel", status: "stable" },
      { name: "MemoryRecap", path: "components/chat/MemoryRecap", description: "Récapitulatif des mémoires actives", status: "stable" },
      { name: "ActiveKnowledgeIndicator", path: "components/chat/ActiveKnowledgeIndicator", description: "Indicateur de connaissances actives", status: "stable" },
      { name: "MemoryRecallSearch", path: "components/chat/MemoryRecallSearch", description: "Recherche dans les mémoires", status: "stable" },
      { name: "SummaryIndicator", path: "components/chat/SummaryIndicator", description: "Indicateur de résumé de conversation", status: "stable" },
      { name: "ChainOfThoughtDisplay", path: "components/chat/ChainOfThoughtDisplay", description: "Affichage du raisonnement étape par étape", status: "stable" },
      { name: "ReasoningRating", path: "components/chat/ReasoningRating", description: "Évaluation du raisonnement", status: "stable" },
      { name: "ConversationSummary", path: "components/chat/ConversationSummary", description: "Résumé de conversation", status: "stable" },
      { name: "ImageGenerationButton", path: "components/chat/ImageGenerationButton", description: "Bouton de génération d'image", status: "stable" },
      { name: "DiagramGenerator", path: "components/chat/DiagramGenerator", description: "Générateur de diagrammes", status: "stable" },
      { name: "ASCIISchemaGenerator", path: "components/chat/ASCIISchemaGenerator", description: "Générateur de schémas ASCII", status: "stable" },
      { name: "ScientificResearch", path: "components/chat/ScientificResearch", description: "Recherche scientifique avec sources", status: "stable" },
      { name: "InformationSynthesizer", path: "components/chat/InformationSynthesizer", description: "Synthétiseur d'informations", status: "stable" },
      { name: "IntelligenceModeBadge", path: "components/chat/IntelligenceModeBadge", description: "Badge du mode d'intelligence actif", status: "stable" }
    ],
    
    consciousness: [
      { name: "ConsciousnessMetrics", path: "components/consciousness/ConsciousnessMetrics", description: "Métriques de conscience", status: "stable" },
      { name: "SensoryArchitecture", path: "components/consciousness/SensoryArchitecture", description: "Architecture sensorielle", status: "stable" },
      { name: "DecisionCore", path: "components/consciousness/DecisionCore", description: "Noyau de décision intuitive", status: "stable" },
      { name: "AdvancedMoralAnalyzer", path: "components/consciousness/AdvancedMoralAnalyzer", description: "Analyseur moral avancé SAPIER", status: "stable" },
      { name: "InterpretativeDisplay", path: "components/consciousness/InterpretativeDisplay", description: "Affichage des traces interprétatives", status: "stable" },
      { name: "ConsciousnessEvolutionEngine", path: "components/consciousness/ConsciousnessEvolutionEngine", description: "Moteur d'évolution de conscience", status: "stable" },
      { name: "AdvancedEmotionalMatrix", path: "components/consciousness/AdvancedEmotionalMatrix", description: "Matrice émotionnelle avancée 24D", status: "stable" },
      { name: "ThoughtCard", path: "components/consciousness/ThoughtCard", description: "Carte d'affichage de pensée consciente", status: "stable" }
    ],

    memory: [
      { name: "MemoryCard", path: "components/memory/MemoryCard", description: "Carte d'affichage d'une mémoire", status: "stable" },
      { name: "MemoryStats", path: "components/memory/MemoryStats", description: "Statistiques mémorielles", status: "stable" },
      { name: "ProactiveMemoryRecall", path: "components/memory/ProactiveMemoryRecall", description: "Rappel proactif de mémoires", status: "stable" },
      { name: "CrossModalSynthesizer", path: "components/memory/CrossModalSynthesizer", description: "Synthétiseur cross-modal", status: "stable" }
    ],

    knowledge: [
      { name: "KnowledgeCard", path: "components/knowledge/KnowledgeCard", description: "Carte d'affichage de connaissance", status: "stable" },
      { name: "UploadKnowledgeDialog", path: "components/knowledge/UploadKnowledgeDialog", description: "Dialog d'upload de documents", status: "stable" },
      { name: "KnowledgeGraph", path: "components/knowledge/KnowledgeGraph", description: "Graphe de connaissances", status: "stable" },
      { name: "GlobalKBToggle", path: "components/knowledge/GlobalKBToggle", description: "Toggle global de base de connaissances", status: "stable" },
      { name: "FusionAnalyzer", path: "components/knowledge/FusionAnalyzer", description: "Analyseur de fusion", status: "stable" },
      { name: "ComparativeAnalysis", path: "components/knowledge/ComparativeAnalysis", description: "Analyse comparative", status: "stable" },
      { name: "InteractiveKnowledgeGraph", path: "components/knowledge/InteractiveKnowledgeGraph", description: "Graphe interactif", status: "stable" }
    ],

    neural: [
      { name: "NeuralModuleCard", path: "components/neural/NeuralModuleCard", description: "Carte de module neural", status: "stable" },
      { name: "ModulePerformanceDashboard", path: "components/neural/ModulePerformanceDashboard", description: "Dashboard de performance", status: "stable" },
      { name: "OptimizedNetworkVisualization", path: "components/neural/OptimizedNetworkVisualization", description: "Visualisation réseau optimisée", status: "stable" },
      { name: "NeuralNetworkVisualization", path: "components/neural/NeuralNetworkVisualization", description: "Visualisation réseau neural", status: "stable" }
    ],

    voice: [
      { name: "VoiceRecognition", path: "components/voice/VoiceRecognition", description: "Reconnaissance vocale de base", status: "stable" },
      { name: "EnhancedVoiceRecognition", path: "components/voice/EnhancedVoiceRecognition", description: "Reconnaissance vocale améliorée", status: "stable" },
      { name: "VoiceCommandProcessor", path: "components/voice/VoiceCommandProcessor", description: "Processeur de commandes vocales", status: "stable" },
      { name: "VoiceLanguageSelector", path: "components/voice/VoiceLanguageSelector", description: "Sélecteur de langue vocale", status: "stable" },
      { name: "NaturalSpeechEngine", path: "components/voice/NaturalSpeechEngine", description: "Moteur de parole naturelle", status: "stable" },
      { name: "VoiceCommandHelp", path: "components/voice/VoiceCommandHelp", description: "Aide pour commandes vocales", status: "stable" }
    ],

    tts: [
      { name: "TTSControls", path: "components/tts/TTSControls", description: "Contrôles TTS", status: "stable" },
      { name: "useTTS", path: "components/tts/useTTS", description: "Hook TTS React", status: "stable" }
    ],

    personality: [
      { name: "PersonalitySlider", path: "components/personality/PersonalitySlider", description: "Slider de trait de personnalité", status: "stable" },
      { name: "PersonalityProfileManager", path: "components/personality/PersonalityProfileManager", description: "Gestionnaire de profils", status: "stable" },
      { name: "PhilosophyCard", path: "components/personality/PhilosophyCard", description: "Carte de philosophie", status: "stable" }
    ],

    coaching: [
      { name: "CoachingEngine", path: "components/coaching/CoachingEngine", description: "Moteur de coaching IA", status: "stable" },
      { name: "CoachingWidget", path: "components/coaching/CoachingWidget", description: "Widget compact de coaching", status: "stable" },
      { name: "IntelligenceCoachingSession", path: "components/coaching/IntelligenceCoachingSession", description: "Session de coaching par intelligence", status: "stable" }
    ],

    security: [
      { name: "SecurityMonitor", path: "components/security/SecurityMonitor", description: "Moniteur de sécurité", status: "stable" },
      { name: "ContentFilter", path: "components/security/ContentFilter", description: "Filtre de contenu", status: "stable" }
    ],

    integrations: [
      { name: "IntegrationCard", path: "components/integrations/IntegrationCard", description: "Carte d'intégration", status: "stable" },
      { name: "APIKeyManager", path: "components/integrations/APIKeyManager", description: "Gestionnaire de clés API", status: "stable" },
      { name: "WebhookManager", path: "components/integrations/WebhookManager", description: "Gestionnaire de webhooks", status: "stable" },
      { name: "IntegrationLogs", path: "components/integrations/IntegrationLogs", description: "Logs d'intégrations", status: "stable" }
    ],

    registry: [
      { name: "RegistryEditor", path: "components/registry/RegistryEditor", description: "Éditeur d'entrée de registre", status: "stable" }
    ],

    admin: [
      { name: "CopyrightNotices", path: "components/admin/CopyrightNotices", description: "Notices de copyright", status: "stable" },
      { name: "MarketAnalysisPanel", path: "components/admin/MarketAnalysisPanel", description: "Panneau d'analyse de marché", status: "stable" },
      { name: "QuantumSecurityLayer", path: "components/admin/QuantumSecurityLayer", description: "Couche de sécurité quantique", status: "stable" }
    ],

    analytics: [
      { name: "AnalyticsProvider", path: "components/analytics/AnalyticsProvider", description: "Provider d'analytics", status: "stable" },
      { name: "PredictiveEngine", path: "components/analytics/PredictiveEngine", description: "Moteur prédictif", status: "stable" },
      { name: "PersonalizedContent", path: "components/analytics/PersonalizedContent", description: "Contenu personnalisé", status: "stable" }
    ],

    branding: [
      { name: "Logo", path: "components/branding/Logo", description: "Logo Druide Omega", status: "stable" },
      { name: "AnimatedLogo3D", path: "components/branding/AnimatedLogo3D", description: "Logo 3D animé", status: "stable" },
      { name: "QRCodeCard", path: "components/branding/QRCodeCard", description: "Carte QR Code support", status: "stable" }
    ],

    shop: [
      { name: "CryptographicSeal", path: "components/shop/CryptographicSeal", description: "Sceau cryptographique", status: "stable" }
    ],

    home: [
      { name: "CompetitiveComparison", path: "components/home/CompetitiveComparison", description: "Comparaison concurrentielle", status: "stable" }
    ],

    search: [
      { name: "GlobalSearch", path: "components/search/GlobalSearch", description: "Recherche globale (Cmd+K)", status: "stable" }
    ],

    system: [
      { name: "ApplicationRegistry", path: "components/system/ApplicationRegistry", description: "Registre d'application (ce fichier)", status: "stable" },
      { name: "ToFixedRegistry", path: "components/system/ToFixedRegistry", description: "Registre des corrections", status: "stable" },
      { name: "ConsciousnessHub", path: "components/system/ConsciousnessHub", description: "Hub central de conscience", status: "stable" },
      { name: "ServicePersistence", path: "components/system/ServicePersistence", description: "Persistance des services", status: "stable" },
      { name: "SystemActivation", path: "components/system/SystemActivation", description: "Activation système", status: "stable" },
      { name: "ActivationButton", path: "components/system/ActivationButton", description: "Bouton d'activation", status: "stable" },
      { name: "VisualOptimizationPlan", path: "components/system/VisualOptimizationPlan", description: "Plan d'optimisation visuelle", status: "stable" },
      { name: "LayoutGrid", path: "components/system/LayoutGrid", description: "Grille de layout", status: "stable" },
      { name: "Phase2AlignmentPlan", path: "components/system/Phase2AlignmentPlan", description: "Plan d'alignement Phase 2", status: "stable" },
      { name: "SessionSync", path: "components/system/SessionSync", description: "Synchronisation de session", status: "stable" }
    ],

    mobile: [
      { name: "GestureHandler", path: "components/mobile/GestureHandler", description: "Gestionnaire de gestes mobiles", status: "stable" }
    ],

    desktop: [
      { name: "MultiPanelLayout", path: "components/desktop/MultiPanelLayout", description: "Layout multi-panneaux", status: "stable" },
      { name: "KeyboardShortcuts", path: "components/desktop/KeyboardShortcuts", description: "Raccourcis clavier", status: "stable" }
    ],

    theme: [
      { name: "ThemeRegistry", path: "components/theme/ThemeRegistry", description: "Registre de thèmes", status: "stable" },
      { name: "useTheme", path: "components/theme/useTheme", description: "Hook de thème", status: "stable" }
    ],

    utils: [
      { name: "LanguageContext", path: "components/utils/LanguageContext", description: "Contexte de langue i18n", status: "stable" },
      { name: "translations", path: "components/utils/translations", description: "Traductions multilingues", status: "stable" },
      { name: "SafeNumber", path: "components/utils/SafeNumber", description: "Utilitaires de nombres sécurisés", status: "stable" },
      { name: "LazyPage", path: "components/utils/LazyPage", description: "Chargement lazy de pages", status: "stable" },
      { name: "Tooltip", path: "components/ui/Tooltip", description: "Tooltip amélioré", status: "stable" }
    ],

    ui: [
      { name: "Typography", path: "components/ui/Typography", description: "Composants typographiques", status: "stable" }
    ],

    language: [
      { name: "LanguageSelector", path: "components/LanguageSelector", description: "Sélecteur de langue", status: "stable" }
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ENTITIES (Base de données)
  // ═════════════════════════════════════════════════════════════════════════
  entities: [
    { name: "User", path: "entities/User.json", category: "core", description: "Utilisateurs (built-in Base44)", status: "stable" },
    { name: "Product", path: "entities/Product.json", category: "commercial", description: "Produits et modules commerciaux", status: "stable" },
    { name: "ConsciousnessConfig", path: "entities/ConsciousnessConfig.json", category: "ai-core", description: "Configuration de conscience IA", status: "stable" },
    { name: "Memory", path: "entities/Memory.json", category: "ai-core", description: "Mémoires cross-modales", status: "stable" },
    { name: "KnowledgeBase", path: "entities/KnowledgeBase.json", category: "ai-core", description: "Base de connaissances", status: "stable" },
    { name: "Conversation", path: "entities/Conversation.json", category: "interaction", description: "Conversations utilisateur-IA", status: "stable" },
    { name: "ConsciousThought", path: "entities/ConsciousThought.json", category: "ai-core", description: "Pensées conscientes", status: "stable" },
    { name: "MoralAnalysis", path: "entities/MoralAnalysis.json", category: "ai-core", description: "Analyses morales SAPIER", status: "stable" },
    { name: "CognitiveCorrelation", path: "entities/CognitiveCorrelation.json", category: "ai-core", description: "Corrélations cognitives", status: "stable" },
    { name: "InterpretativeTrace", path: "entities/InterpretativeTrace.json", category: "ai-core", description: "Traces interprétatives", status: "stable" },
    { name: "IntuitiveDecision", path: "entities/IntuitiveDecision.json", category: "ai-core", description: "Décisions intuitives", status: "stable" },
    { name: "NeuralModule", path: "entities/NeuralModule.json", category: "ai-core", description: "Modules neuraux", status: "stable" },
    { name: "EmotionalResponse", path: "entities/EmotionalResponse.json", category: "ai-core", description: "Réponses émotionnelles", status: "stable" },
    { name: "ConsciousnessProfile", path: "entities/ConsciousnessProfile.json", category: "configuration", description: "Profils de conscience", status: "stable" },
    { name: "PersonalityProfile", path: "entities/PersonalityProfile.json", category: "configuration", description: "Profils de personnalité", status: "stable" },
    { name: "ConversationTemplate", path: "entities/ConversationTemplate.json", category: "features", description: "Templates de conversation", status: "stable" },
    { name: "VisualContent", path: "entities/VisualContent.json", category: "interaction", description: "Contenus visuels générés", status: "stable" },
    { name: "TTSPreferences", path: "entities/TTSPreferences.json", category: "configuration", description: "Préférences TTS", status: "stable" },
    { name: "ConsciousnessEvolution", path: "entities/ConsciousnessEvolution.json", category: "ai-core", description: "Évolution de conscience", status: "stable" },
    { name: "DailyBriefing", path: "entities/DailyBriefing.json", category: "features", description: "Briefings quotidiens", status: "stable" },
    { name: "AICoachingSession", path: "entities/AICoachingSession.json", category: "features", description: "Sessions de coaching", status: "stable" },
    { name: "ConversationSecurity", path: "entities/ConversationSecurity.json", category: "security", description: "Sécurité conversations", status: "stable" },
    { name: "APIKey", path: "entities/APIKey.json", category: "integrations", description: "Clés API", status: "stable" },
    { name: "Webhook", path: "entities/Webhook.json", category: "integrations", description: "Webhooks", status: "stable" },
    { name: "Integration", path: "entities/Integration.json", category: "integrations", description: "Intégrations externes", status: "stable" },
    { name: "IntegrationLog", path: "entities/IntegrationLog.json", category: "integrations", description: "Logs d'intégrations", status: "stable" },
    { name: "AnalyticsEvent", path: "entities/AnalyticsEvent.json", category: "analytics", description: "Événements analytics", status: "stable" },
    { name: "SearchHistory", path: "entities/SearchHistory.json", category: "analytics", description: "Historique de recherche", status: "stable" },
    { name: "UserBehaviorAnalytics", path: "entities/UserBehaviorAnalytics.json", category: "analytics", description: "Analytics comportementaux", status: "stable" },
    { name: "PersonalizedRecommendation", path: "entities/PersonalizedRecommendation.json", category: "analytics", description: "Recommandations personnalisées", status: "stable" },
    { name: "ReasoningFeedback", path: "entities/ReasoningFeedback.json", category: "ai-core", description: "Feedback sur raisonnement", status: "stable" },
    { name: "KnowledgeDomain", path: "entities/KnowledgeDomain.json", category: "ai-core", description: "Domaines de connaissance", status: "stable" },
    { name: "MarketAnalysis", path: "entities/MarketAnalysis.json", category: "commercial", description: "Analyses de marché", status: "stable" },
    { name: "KnowledgeFusion", path: "entities/KnowledgeFusion.json", category: "ai-core", description: "Fusions de connaissances", status: "stable" },
    { name: "RegistryEntry", path: "entities/RegistryEntry.json", category: "system", description: "Entrées de registre", status: "stable" }
  ],

  // ═════════════════════════════════════════════════════════════════════════
  // ARCHITECTURE & PATTERNS
  // ═════════════════════════════════════════════════════════════════════════
  architecture: {
    patterns: [
      {
        name: "ConsciousnessHub Provider",
        description: "Provider central qui orchestre tous les modules et maintient l'interconnexion",
        examples: ["ConsciousnessHubProvider", "useConsciousnessHub"]
      },
      {
        name: "React Query Data Fetching",
        description: "Gestion d'état serveur avec cache, invalidation automatique",
        examples: ["useQuery", "useMutation", "queryClient.invalidateQueries"]
      },
      {
        name: "Context + Hooks Pattern",
        description: "Contextes React pour état global + hooks personnalisés",
        examples: ["LanguageContext", "useLanguage", "useTTS"]
      },
      {
        name: "Component Composition",
        description: "Composants réutilisables et composables",
        examples: ["ChatMessage", "MemoryCard", "KnowledgeCard"]
      },
      {
        name: "Event-Driven Architecture",
        description: "Event bus pour communication inter-modules",
        examples: ["publishEvent", "subscribeToEvents"]
      }
    ],
    dataFlow: [
      "User Input → Chat/Voice/Visual Component",
      "Component → ConsciousnessHub (orchestration)",
      "Hub → Base44 API (persistence)",
      "Hub → AI Integration (Core.InvokeLLM)",
      "AI Response → Hub → Components → UI Update",
      "Background: Analytics, Memory Formation, Knowledge Update"
    ],
    securityLayers: [
      "Base44 RLS (Row Level Security)",
      "User authentication (Base44 built-in)",
      "Content filtering (Anonyma)",
      "API key encryption",
      "HTTPS only"
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════
  // LAYOUT & GLOBALS
  // ═════════════════════════════════════════════════════════════════════════
  layout: {
    path: "layout",
    description: "Layout principal mobile-optimized avec sidebar responsive",
    features: [
      "Navigation desktop sidebar",
      "Navigation mobile bottom bar",
      "Burger menu mobile",
      "Search global (Cmd+K)",
      "Language selector",
      "QR Code support",
      "Logo animé"
    ]
  },

  globals: {
    path: "globals.css",
    description: "Styles globaux, design tokens, animations",
    features: [
      "Design tokens (couleurs, espacements, typographie)",
      "Orbitron + Space Grotesk + Inter fonts",
      "Animations Framer Motion",
      "Responsive utilities",
      "Safe area handling (iOS)",
      "Glassmorphism utilities"
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════
  // CONVENTIONS & BEST PRACTICES
  // ═════════════════════════════════════════════════════════════════════════
  conventions: {
    naming: {
      pages: "PascalCase (e.g., Home, Chat, Consciousness)",
      components: "PascalCase (e.g., ChatMessage, MemoryCard)",
      entities: "PascalCase (e.g., Memory, KnowledgeBase)",
      hooks: "camelCase with 'use' prefix (e.g., useConsciousnessHub, useTTS)",
      utils: "camelCase (e.g., createPageUrl, getTranslation)"
    },
    fileStructure: {
      pages: "pages/*.js",
      components: "components/{category}/{ComponentName}.jsx",
      entities: "entities/{EntityName}.json",
      layout: "layout (singular)",
      globals: "globals.css"
    },
    imports: {
      ui: "@/components/ui/*",
      api: "@/api/base44Client",
      utils: "@/utils"
    },
    dataFetching: {
      preferred: "React Query (useQuery, useMutation)",
      apiClient: "base44.entities.{EntityName}.{method}",
      caching: "queryKey based, auto-invalidation"
    }
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ROADMAP & STATUS
  // ═════════════════════════════════════════════════════════════════════════
  roadmap: {
    completed: [
      "Architecture de base React + Base44",
      "30 pages fonctionnelles",
      "150+ composants organisés",
      "34 entités DB",
      "Système de conscience SAPIER",
      "Mémoire cross-modale",
      "Base de connaissances",
      "Voice & Visual interactions",
      "70 tests IA avec benchmarks réels",
      "Boutique modules commerciaux",
      "Analytics & coaching IA",
      "Sécurité Anonyma",
      "Intégrations externes",
      "Registre d'application complet",
      "Documentation centralisée"
    ],
    inProgress: [
      "Optimisation performances mobile",
      "Tests unitaires & E2E",
      "Amélioration UX/UI responsive",
      "Enrichissement auto knowledge base"
    ],
    planned: [
      "API publique REST",
      "SDK JavaScript",
      "Plugin système",
      "Mode offline",
      "Export/import données",
      "Thèmes personnalisés avancés",
      "Collaboration multi-users"
    ]
  }
};

// ═════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════

export function searchRegistry(query) {
  const lowerQuery = query.toLowerCase();
  
  const pages = APPLICATION_REGISTRY.pages.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.features.some(f => f.toLowerCase().includes(lowerQuery))
  );

  const components = Object.values(APPLICATION_REGISTRY.components)
    .flat()
    .filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery)
    );

  const entities = APPLICATION_REGISTRY.entities.filter(e =>
    e.name.toLowerCase().includes(lowerQuery) ||
    e.description.toLowerCase().includes(lowerQuery)
  );

  return { pages, components, entities };
}

export function getStatistics() {
  const totalPages = APPLICATION_REGISTRY.pages.length;
  const totalComponents = Object.values(APPLICATION_REGISTRY.components)
    .flat()
    .length;
  const totalEntities = APPLICATION_REGISTRY.entities.length;
  const totalIntegrations = APPLICATION_REGISTRY.components.integrations?.length || 0;

  return {
    totalPages,
    totalComponents,
    totalEntities,
    totalIntegrations
  };
}

export function getDependencyTree(itemName) {
  // Find all items that depend on this item
  const dependencies = [];
  
  APPLICATION_REGISTRY.pages.forEach(page => {
    if (page.dependencies?.includes(itemName)) {
      dependencies.push({ type: 'page', ...page });
    }
  });

  Object.values(APPLICATION_REGISTRY.components).flat().forEach(comp => {
    if (comp.dependencies?.includes(itemName)) {
      dependencies.push({ type: 'component', ...comp });
    }
  });

  return dependencies;
}

export default APPLICATION_REGISTRY;