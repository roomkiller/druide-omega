/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Application Complete Registry                              ║
 * ║ Registre exhaustif de tous les éléments de l'application                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export const APPLICATION_REGISTRY = {
  
  // ═══════════════════════════════════════════════════════════════════════
  // METADATA
  // ═══════════════════════════════════════════════════════════════════════
  
  metadata: {
    appName: "Druide_Omega",
    version: "2.0.0",
    lastUpdate: "2025-11-15",
    totalFiles: 0, // Auto-calculé
    architecture: "React + Base44 BaaS",
    primaryLanguages: ["JavaScript", "JSX", "JSON"],
    framework: "React 18",
    styling: "Tailwind CSS + Shadcn/ui",
    stateManagement: "React Query + Context API"
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PAGES (Routes principales)
  // ═══════════════════════════════════════════════════════════════════════
  
  pages: [
    {
      name: "Home",
      path: "pages/Home",
      category: "navigation",
      type: "landing",
      description: "Page d'accueil principale avec présentation",
      features: ["hero", "features-showcase", "competitive-comparison"],
      dependencies: ["Logo", "QRCodeCard", "CompetitiveComparison"],
      entities: [],
      integrations: [],
      status: "stable",
      language: "FR/EN",
      complexity: "medium",
      lines: "~500"
    },
    {
      name: "Chat",
      path: "pages/Chat",
      category: "interaction",
      type: "conversational",
      description: "Interface de conversation principale avec l'IA",
      features: ["messaging", "memory-recall", "consciousness", "tts", "image-upload"],
      dependencies: ["ChatMessage", "ChatInput", "WelcomeScreen", "ConsciousnessIndicator", "TTSControls", "ProactiveMemoryRecall"],
      entities: ["Conversation", "Memory"],
      integrations: ["Core.InvokeLLM"],
      status: "stable",
      language: "FR",
      complexity: "high",
      lines: "~230"
    },
    {
      name: "Consciousness",
      path: "pages/Consciousness",
      category: "consciousness",
      type: "configuration",
      description: "Configuration et visualisation de la conscience artificielle",
      features: ["consciousness-config", "thoughts-display", "dimensions", "sapier"],
      dependencies: ["ConsciousnessMetrics", "ThoughtCard", "DecisionCore", "SensoryArchitecture"],
      entities: ["ConsciousnessConfig", "ConsciousThought"],
      integrations: ["Core.InvokeLLM"],
      status: "stable",
      language: "FR",
      complexity: "very-high",
      lines: "~800"
    },
    {
      name: "Memory",
      path: "pages/Memory",
      category: "memory",
      type: "data-management",
      description: "Gestion des mémoires cross-modales persistantes",
      features: ["memory-list", "filtering", "cross-modal", "stats"],
      dependencies: ["MemoryCard", "MemoryStats", "CrossModalSynthesizer"],
      entities: ["Memory"],
      integrations: [],
      status: "stable",
      language: "FR",
      complexity: "medium",
      lines: "~300"
    },
    {
      name: "Knowledge",
      path: "pages/Knowledge",
      category: "knowledge",
      type: "knowledge-base",
      description: "Base de connaissances et sources documentaires",
      features: ["kb-management", "upload", "auto-update", "graph-viz"],
      dependencies: ["KnowledgeCard", "KnowledgeGraph", "UploadKnowledgeDialog"],
      entities: ["KnowledgeBase", "KnowledgeDomain"],
      integrations: ["Core.InvokeLLM", "Core.UploadFile"],
      status: "stable",
      language: "FR",
      complexity: "high",
      lines: "~400"
    },
    {
      name: "NeuralSystem",
      path: "pages/NeuralSystem",
      category: "neural",
      type: "system-visualization",
      description: "Architecture neuronale et modules cognitifs",
      features: ["module-management", "performance-dashboard", "network-viz"],
      dependencies: ["NeuralModuleCard", "ModulePerformanceDashboard", "OptimizedNetworkVisualization"],
      entities: ["NeuralModule"],
      integrations: [],
      status: "stable",
      language: "FR",
      complexity: "very-high",
      lines: "~500"
    },
    {
      name: "MoralCompass",
      path: "pages/MoralCompass",
      category: "ethics",
      type: "moral-analysis",
      description: "Analyse morale et éthique des décisions",
      features: ["moral-analysis", "philosophical-frameworks", "decision-tracking"],
      dependencies: ["AdvancedMoralAnalyzer"],
      entities: ["MoralAnalysis"],
      integrations: ["Core.InvokeLLM"],
      status: "stable",
      language: "FR",
      complexity: "high",
      lines: "~400"
    },
    {
      name: "DecisionArchive",
      path: "pages/DecisionArchive",
      category: "decision",
      type: "archive",
      description: "Archive des décisions intuitives et analytiques",
      features: ["decision-tracking", "confidence-display", "filtering"],
      dependencies: [],
      entities: ["IntuitiveDecision"],
      integrations: [],
      status: "stable",
      language: "FR",
      complexity: "medium",
      lines: "~300"
    },
    {
      name: "DailyBriefing",
      path: "pages/DailyBriefing",
      category: "knowledge",
      type: "briefing",
      description: "Briefings quotidiens multi-domaines",
      features: ["daily-updates", "trends", "domain-filtering", "favorites"],
      dependencies: [],
      entities: ["DailyBriefing", "KnowledgeDomain"],
      integrations: ["Core.InvokeLLM"],
      status: "stable",
      language: "FR",
      complexity: "medium",
      lines: "~350"
    },
    {
      name: "AICoach",
      path: "pages/AICoach",
      category: "coaching",
      type: "coaching-dashboard",
      description: "Coach IA personnalisé avec parcours d'apprentissage",
      features: ["coaching-sessions", "intelligence-types", "progress-tracking", "insights"],
      dependencies: ["CoachingEngine", "IntelligenceCoachingSession"],
      entities: ["AICoachingSession"],
      integrations: ["Core.InvokeLLM"],
      status: "stable",
      language: "FR",
      complexity: "high",
      lines: "~415"
    },
    {
      name: "SecurityDashboard",
      path: "pages/SecurityDashboard",
      category: "security",
      type: "monitoring",
      description: "Dashboard de sécurité Anonyma avec monitoring temps réel",
      features: ["threat-detection", "content-analysis", "compliance", "security-score"],
      dependencies: [],
      entities: ["ConversationSecurity", "AnalyticsEvent"],
      integrations: [],
      status: "stable",
      language: "FR",
      complexity: "medium",
      lines: "~315"
    },
    {
      name: "VisualGallery",
      path: "pages/VisualGallery",
      category: "visual",
      type: "gallery",
      description: "Galerie d'images générées et uploadées",
      features: ["image-display", "filtering", "grid-list-view", "tags"],
      dependencies: [],
      entities: ["VisualContent"],
      integrations: [],
      status: "stable",
      language: "FR",
      complexity: "medium",
      lines: "~324"
    },
    {
      name: "Intelligences",
      path: "pages/Intelligences",
      category: "coaching",
      type: "intelligence-selector",
      description: "Sélection et exploration des 9 intelligences multiples",
      features: ["intelligence-types", "templates", "conversation-starters"],
      dependencies: [],
      entities: ["ConversationTemplate"],
      integrations: [],
      status: "stable",
      language: "FR",
      complexity: "medium",
      lines: "~300"
    },
    {
      name: "VoiceRoom",
      path: "pages/VoiceRoom",
      category: "voice",
      type: "voice-interface",
      description: "Interface vocale interactive continue",
      features: ["voice-recognition", "natural-speech", "voice-commands"],
      dependencies: ["EnhancedVoiceRecognition", "VoiceCommandProcessor", "NaturalSpeechEngine"],
      entities: ["Memory"],
      integrations: ["Core.InvokeLLM"],
      status: "stable",
      language: "FR/Multi",
      complexity: "very-high",
      lines: "~400"
    },
    {
      name: "VoiceLive",
      path: "pages/VoiceLive",
      category: "voice",
      type: "voice-live",
      description: "Conversation vocale temps réel en direct",
      features: ["live-transcription", "real-time-response", "voice-feedback"],
      dependencies: ["VoiceRecognition"],
      entities: ["Memory"],
      integrations: ["Core.InvokeLLM"],
      status: "stable",
      language: "FR",
      complexity: "high",
      lines: "~350"
    },
    {
      name: "Favorites",
      path: "pages/Favorites",
      category: "favorites",
      type: "collection",
      description: "Collection d'éléments favoris (pensées, briefings)",
      features: ["favorites-display", "tabs", "filtering"],
      dependencies: [],
      entities: ["ConsciousThought", "DailyBriefing"],
      integrations: [],
      status: "stable",
      language: "FR",
      complexity: "low",
      lines: "~142"
    },
    {
      name: "Personality",
      path: "pages/Personality",
      category: "configuration",
      type: "personality-config",
      description: "Configuration de la personnalité de l'IA (Big Five, philosophie)",
      features: ["personality-sliders", "philosophy-selection", "profiles", "consciousness-config"],
      dependencies: ["PersonalitySlider", "PhilosophyCard", "PersonalityProfileManager"],
      entities: ["ConsciousnessConfig", "PersonalityProfile"],
      integrations: [],
      status: "stable",
      language: "FR",
      complexity: "high",
      lines: "~416"
    },
    {
      name: "Integrations",
      path: "pages/Integrations",
      category: "integrations",
      type: "integration-management",
      description: "Gestion des intégrations externes et APIs",
      features: ["integration-cards", "webhooks", "api-keys", "logs"],
      dependencies: ["IntegrationCard", "WebhookManager", "APIKeyManager", "IntegrationLogs"],
      entities: ["Integration", "Webhook", "APIKey", "IntegrationLog"],
      integrations: [],
      status: "stable",
      language: "FR",
      complexity: "high",
      lines: "~300"
    },
    {
      name: "Analytics",
      path: "pages/Analytics",
      category: "analytics",
      type: "admin-dashboard",
      description: "Dashboard analytics pour administrateurs",
      features: ["metrics", "events", "errors", "charts"],
      dependencies: [],
      entities: ["AnalyticsEvent"],
      integrations: [],
      status: "stable",
      language: "FR",
      complexity: "high",
      lines: "~310"
    },
    {
      name: "Registry",
      path: "pages/Registry",
      category: "system",
      type: "registry-viewer",
      description: "Visualisation du registre système",
      features: ["registry-display", "editing", "search"],
      dependencies: ["RegistryEditor"],
      entities: ["RegistryEntry"],
      integrations: [],
      status: "stable",
      language: "FR",
      complexity: "medium",
      lines: "~200"
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════
  // COMPONENTS (Composants réutilisables)
  // ═══════════════════════════════════════════════════════════════════════
  
  components: {
    
    // ─────────────────────────────────────────────────────────────────────
    // CHAT & CONVERSATION
    // ─────────────────────────────────────────────────────────────────────
    chat: [
      {
        name: "ChatMessage",
        path: "components/chat/ChatMessage",
        type: "display",
        description: "Affichage d'un message de conversation avec avatar et contenu",
        props: ["message"],
        features: ["markdown-rendering", "tts-integration", "image-display"],
        status: "stable"
      },
      {
        name: "ChatInput",
        path: "components/chat/ChatInput",
        type: "input",
        description: "Zone de saisie de message avec upload d'images",
        props: ["onSend", "disabled", "isLoading", "onInputChange"],
        features: ["textarea", "image-upload", "keyboard-shortcuts"],
        status: "stable"
      },
      {
        name: "WelcomeScreen",
        path: "components/chat/WelcomeScreen",
        type: "display",
        description: "Écran d'accueil avec suggestions de conversation",
        props: ["onSuggestionClick"],
        features: ["suggestions", "logo", "intro-text"],
        status: "stable"
      },
      {
        name: "ConsciousnessIndicator",
        path: "components/chat/ConsciousnessIndicator",
        type: "indicator",
        description: "Indicateur visuel du niveau de conscience",
        props: ["level", "ratio", "active"],
        features: ["animated-icon", "visual-bars", "gradient-colors"],
        status: "stable"
      },
      {
        name: "EmotionalIndicator",
        path: "components/chat/EmotionalIndicator",
        type: "indicator",
        description: "Indicateur d'état émotionnel",
        props: ["emotion", "intensity"],
        features: ["emotion-icons", "intensity-display"],
        status: "stable"
      },
      {
        name: "IntelligenceModeBadge",
        path: "components/chat/IntelligenceModeBadge",
        type: "badge",
        description: "Badge affichant le mode d'intelligence actif",
        props: ["mode"],
        features: ["icon", "label", "gradient"],
        status: "stable"
      },
      {
        name: "ChainOfThoughtDisplay",
        path: "components/chat/ChainOfThoughtDisplay",
        type: "display",
        description: "Affichage du raisonnement chain-of-thought",
        props: ["steps"],
        features: ["step-by-step", "expandable"],
        status: "stable"
      },
      {
        name: "ReasoningRating",
        path: "components/chat/ReasoningRating",
        type: "input",
        description: "Notation du raisonnement par l'utilisateur",
        props: ["onRate", "messageId"],
        features: ["stars", "feedback-form"],
        status: "stable"
      },
      {
        name: "ImageGenerationButton",
        path: "components/chat/ImageGenerationButton",
        type: "button",
        description: "Bouton pour générer des images via IA",
        props: ["onGenerate"],
        features: ["prompt-input", "generation-status"],
        status: "stable"
      },
      {
        name: "DiagramGenerator",
        path: "components/chat/DiagramGenerator",
        type: "generator",
        description: "Générateur de diagrammes",
        props: ["onGenerate"],
        features: ["diagram-types", "mermaid-support"],
        status: "stable"
      },
      {
        name: "ASCIISchemaGenerator",
        path: "components/chat/ASCIISchemaGenerator",
        type: "generator",
        description: "Générateur de schémas ASCII",
        props: ["onGenerate"],
        features: ["ascii-art", "schema-templates"],
        status: "stable"
      }
    ],

    // ─────────────────────────────────────────────────────────────────────
    // CONSCIOUSNESS & DECISION
    // ─────────────────────────────────────────────────────────────────────
    consciousness: [
      {
        name: "ConsciousnessMetrics",
        path: "components/consciousness/ConsciousnessMetrics",
        type: "display",
        description: "Métriques et visualisation de la conscience",
        props: ["config", "thoughtCount"],
        features: ["level-display", "ratio-bars", "status-badge"],
        status: "stable"
      },
      {
        name: "ThoughtCard",
        path: "components/consciousness/ThoughtCard",
        type: "card",
        description: "Carte affichant une pensée consciente avec interactions",
        props: ["thought", "onUpdate"],
        features: ["tts", "favorites", "dialogue", "emotions"],
        status: "stable"
      },
      {
        name: "DecisionCore",
        path: "components/consciousness/DecisionCore",
        type: "decision-engine",
        description: "Moteur de décision intuitif vs analytique",
        props: ["onDecision"],
        features: ["dual-processing", "confidence-score"],
        status: "stable"
      },
      {
        name: "SensoryArchitecture",
        path: "components/consciousness/SensoryArchitecture",
        type: "architecture",
        description: "Architecture sensorielle multi-modale",
        props: ["config"],
        features: ["6-senses", "visualization"],
        status: "stable"
      },
      {
        name: "AdvancedMoralAnalyzer",
        path: "components/consciousness/AdvancedMoralAnalyzer",
        type: "analyzer",
        description: "Analyseur moral multi-frameworks philosophiques",
        props: ["context", "onAnalysisComplete", "autoAnalyze"],
        features: ["5-frameworks", "ethical-scoring", "recommendations"],
        status: "stable"
      },
      {
        name: "InterpretativeDisplay",
        path: "components/consciousness/InterpretativeDisplay",
        type: "display",
        description: "Affichage des traces interprétatives",
        props: ["traces"],
        features: ["reasoning-steps", "justifications"],
        status: "stable"
      }
    ],

    // ─────────────────────────────────────────────────────────────────────
    // MEMORY & KNOWLEDGE
    // ─────────────────────────────────────────────────────────────────────
    memory: [
      {
        name: "MemoryCard",
        path: "components/memory/MemoryCard",
        type: "card",
        description: "Carte affichant une mémoire avec métadonnées",
        props: ["memory", "onDelete", "onUpdate"],
        features: ["tags", "importance", "modality", "cross-modal-refs"],
        status: "stable"
      },
      {
        name: "MemoryStats",
        path: "components/memory/MemoryStats",
        type: "stats",
        description: "Statistiques globales des mémoires",
        props: ["memories"],
        features: ["total-count", "avg-importance", "high-priority"],
        status: "stable"
      },
      {
        name: "ProactiveMemoryRecall",
        path: "components/memory/ProactiveMemoryRecall",
        type: "recall-engine",
        description: "Rappel proactif cross-modal des mémoires pertinentes",
        props: ["currentInput", "currentModality", "memories", "onMemoriesRecalled"],
        features: ["auto-recall", "llm-insights", "cross-modal-synthesis"],
        status: "stable"
      },
      {
        name: "CrossModalSynthesizer",
        path: "components/memory/CrossModalSynthesizer",
        type: "synthesizer",
        description: "Synthèse cross-modale des mémoires",
        props: ["memories"],
        features: ["pattern-detection", "synthesis"],
        status: "stable"
      }
    ],

    knowledge: [
      {
        name: "KnowledgeCard",
        path: "components/knowledge/KnowledgeCard",
        type: "card",
        description: "Carte de base de connaissance avec actions",
        props: ["knowledge", "onToggle", "onDelete"],
        features: ["source-type", "status", "toggle-active", "tags"],
        status: "stable"
      },
      {
        name: "KnowledgeGraph",
        path: "components/knowledge/KnowledgeGraph",
        type: "visualization",
        description: "Graphe interactif des connaissances",
        props: ["knowledgeBases"],
        features: ["force-layout", "interactive-nodes", "connections"],
        status: "stable"
      },
      {
        name: "UploadKnowledgeDialog",
        path: "components/knowledge/UploadKnowledgeDialog",
        type: "dialog",
        description: "Dialog d'upload de documents de connaissance",
        props: ["open", "onOpenChange", "onUpload"],
        features: ["file-upload", "url-input", "extraction"],
        status: "stable"
      },
      {
        name: "GlobalKBToggle",
        path: "components/knowledge/GlobalKBToggle",
        type: "toggle",
        description: "Toggle global pour activer/désactiver les KB",
        props: ["onToggle"],
        features: ["quick-toggle"],
        status: "stable"
      }
    ],

    // ─────────────────────────────────────────────────────────────────────
    // NEURAL & ANALYTICS
    // ─────────────────────────────────────────────────────────────────────
    neural: [
      {
        name: "NeuralModuleCard",
        path: "components/neural/NeuralModuleCard",
        type: "card",
        description: "Carte de module neuronal avec métriques",
        props: ["module", "onOptimize", "onToggle"],
        features: ["performance-bars", "neural-params", "connections"],
        status: "stable"
      },
      {
        name: "ModulePerformanceDashboard",
        path: "components/neural/ModulePerformanceDashboard",
        type: "dashboard",
        description: "Dashboard complet de performance des modules neuronaux",
        props: ["modules", "systemMetrics"],
        features: ["charts", "metrics", "tables", "stats"],
        status: "stable"
      },
      {
        name: "OptimizedNetworkVisualization",
        path: "components/neural/OptimizedNetworkVisualization",
        type: "visualization",
        description: "Visualisation optimisée du réseau neuronal",
        props: ["modules"],
        features: ["3d-view", "connections", "interactive"],
        status: "stable"
      }
    ],

    analytics: [
      {
        name: "AnalyticsProvider",
        path: "components/analytics/AnalyticsProvider",
        type: "provider",
        description: "Provider pour tracking analytics automatique",
        props: ["children", "currentPage"],
        features: ["auto-tracking", "events", "sessions"],
        status: "stable"
      },
      {
        name: "PredictiveEngine",
        path: "components/analytics/PredictiveEngine",
        type: "engine",
        description: "Moteur prédictif de comportement utilisateur",
        props: [],
        features: ["behavior-analysis", "predictions", "recommendations"],
        status: "stable"
      },
      {
        name: "PersonalizedContent",
        path: "components/analytics/PersonalizedContent",
        type: "personalizer",
        description: "Personnalisation de contenu basée sur comportement",
        props: [],
        features: ["content-recommendations", "adaptive-ui"],
        status: "stable"
      }
    ],

    // ─────────────────────────────────────────────────────────────────────
    // COACHING & PERSONALITY
    // ─────────────────────────────────────────────────────────────────────
    coaching: [
      {
        name: "CoachingEngine",
        path: "components/coaching/CoachingEngine",
        type: "engine",
        description: "Moteur de génération de sessions de coaching",
        props: [],
        features: ["session-generation", "insights", "learning-paths"],
        status: "stable"
      },
      {
        name: "CoachingWidget",
        path: "components/coaching/CoachingWidget",
        type: "widget",
        description: "Widget compact de coaching avec insights",
        props: [],
        features: ["latest-session", "engagement-score", "quick-nav"],
        status: "stable"
      },
      {
        name: "IntelligenceCoachingSession",
        path: "components/coaching/IntelligenceCoachingSession",
        type: "session",
        description: "Session de coaching spécifique à une intelligence",
        props: ["intelligenceType", "onComplete"],
        features: ["intelligence-specific", "exercises", "progress"],
        status: "stable"
      }
    ],

    personality: [
      {
        name: "PersonalitySlider",
        path: "components/personality/PersonalitySlider",
        type: "input",
        description: "Slider pour ajuster traits de personnalité",
        props: ["label", "value", "onChange", "min", "max"],
        features: ["visual-slider", "value-display"],
        status: "stable"
      },
      {
        name: "PhilosophyCard",
        path: "components/personality/PhilosophyCard",
        type: "card",
        description: "Carte sélectionnable de philosophie",
        props: ["philosophy", "selected", "onToggle"],
        features: ["selectable", "icon", "description"],
        status: "stable"
      },
      {
        name: "PersonalityProfileManager",
        path: "components/personality/PersonalityProfileManager",
        type: "manager",
        description: "Gestionnaire de profils de personnalité",
        props: ["onProfileLoad"],
        features: ["save-load", "profiles-list"],
        status: "stable"
      }
    ],

    // ─────────────────────────────────────────────────────────────────────
    // VOICE & TTS
    // ─────────────────────────────────────────────────────────────────────
    voice: [
      {
        name: "VoiceRecognition",
        path: "components/voice/VoiceRecognition",
        type: "recognition",
        description: "Reconnaissance vocale de base",
        props: ["onTranscript", "continuous"],
        features: ["web-speech-api", "language-support"],
        status: "stable"
      },
      {
        name: "EnhancedVoiceRecognition",
        path: "components/voice/EnhancedVoiceRecognition",
        type: "recognition",
        description: "Reconnaissance vocale avancée avec commandes",
        props: ["onMessage", "onCommand"],
        features: ["command-detection", "multi-language", "feedback"],
        status: "stable"
      },
      {
        name: "VoiceCommandProcessor",
        path: "components/voice/VoiceCommandProcessor",
        type: "processor",
        description: "Processeur de commandes vocales",
        props: ["transcript"],
        features: ["command-parsing", "intent-detection"],
        status: "stable"
      },
      {
        name: "VoiceLanguageSelector",
        path: "components/voice/VoiceLanguageSelector",
        type: "selector",
        description: "Sélecteur de langue pour reconnaissance vocale",
        props: ["onLanguageChange"],
        features: ["language-list", "flags"],
        status: "stable"
      },
      {
        name: "NaturalSpeechEngine",
        path: "components/voice/NaturalSpeechEngine",
        type: "engine",
        description: "Moteur de parole naturelle avec prosodie",
        props: ["text", "config"],
        features: ["natural-voice", "emotion-synthesis"],
        status: "stable"
      },
      {
        name: "VoiceCommandHelp",
        path: "components/voice/VoiceCommandHelp",
        type: "help",
        description: "Aide contextuelle pour commandes vocales",
        props: [],
        features: ["command-list", "examples"],
        status: "stable"
      }
    ],

    tts: [
      {
        name: "TTSControls",
        path: "components/tts/TTSControls",
        type: "controls",
        description: "Contrôles TTS (Text-to-Speech)",
        props: [],
        features: ["toggle", "rate", "pitch", "autoplay"],
        status: "stable"
      },
      {
        name: "useTTS",
        path: "components/tts/useTTS",
        type: "hook",
        description: "Hook React pour TTS",
        props: [],
        features: ["speech-synthesis", "preferences", "control"],
        status: "stable"
      }
    ],

    // ─────────────────────────────────────────────────────────────────────
    // SECURITY & INTEGRATIONS
    // ─────────────────────────────────────────────────────────────────────
    security: [
      {
        name: "SecurityMonitor",
        path: "components/security/SecurityMonitor",
        type: "monitor",
        description: "Monitoring de sécurité en temps réel",
        props: ["conversationId"],
        features: ["threat-detection", "content-analysis"],
        status: "stable"
      },
      {
        name: "ContentFilter",
        path: "components/security/ContentFilter",
        type: "filter",
        description: "Filtre de contenu sensible",
        props: ["content", "onViolation"],
        features: ["pattern-matching", "ai-detection"],
        status: "stable"
      }
    ],

    integrations: [
      {
        name: "IntegrationCard",
        path: "components/integrations/IntegrationCard",
        type: "card",
        description: "Carte d'intégration externe",
        props: ["integration", "onUpdate"],
        features: ["status", "config", "toggle"],
        status: "stable"
      },
      {
        name: "WebhookManager",
        path: "components/integrations/WebhookManager",
        type: "manager",
        description: "Gestion des webhooks",
        props: [],
        features: ["webhook-crud", "event-selection"],
        status: "stable"
      },
      {
        name: "APIKeyManager",
        path: "components/integrations/APIKeyManager",
        type: "manager",
        description: "Gestion des clés API",
        props: [],
        features: ["key-generation", "permissions", "revocation"],
        status: "stable"
      },
      {
        name: "IntegrationLogs",
        path: "components/integrations/IntegrationLogs",
        type: "logs",
        description: "Logs d'intégrations",
        props: ["integrationId"],
        features: ["log-display", "filtering"],
        status: "stable"
      }
    ],

    // ─────────────────────────────────────────────────────────────────────
    // BRANDING & UI
    // ─────────────────────────────────────────────────────────────────────
    branding: [
      {
        name: "Logo",
        path: "components/branding/Logo",
        type: "branding",
        description: "Logo animé de l'application",
        props: ["size", "animate"],
        features: ["sizes", "animation"],
        status: "stable"
      },
      {
        name: "QRCodeCard",
        path: "components/branding/QRCodeCard",
        type: "branding",
        description: "Carte QR Code pour accès mobile",
        props: ["compact"],
        features: ["qr-generation", "responsive"],
        status: "stable"
      }
    ],

    // ─────────────────────────────────────────────────────────────────────
    // SYSTEM & UTILITIES
    // ─────────────────────────────────────────────────────────────────────
    system: [
      {
        name: "ConsciousnessHub",
        path: "components/system/ConsciousnessHub",
        type: "hub",
        description: "Hub central d'interconnexion des modules",
        props: ["children"],
        features: ["state-management", "event-bus", "module-communication"],
        status: "stable"
      },
      {
        name: "ServicePersistence",
        path: "components/system/ServicePersistence",
        type: "service",
        description: "Service de persistance des données",
        props: ["currentPage"],
        features: ["auto-save", "sync"],
        status: "stable"
      },
      {
        name: "ToFixedRegistry",
        path: "components/system/ToFixedRegistry",
        type: "registry",
        description: "Registre des .toFixed() pour réparations",
        props: [],
        features: ["scan", "auto-repair", "stats"],
        status: "stable"
      },
      {
        name: "ApplicationRegistry",
        path: "components/system/ApplicationRegistry",
        type: "registry",
        description: "Registre complet de l'application",
        props: [],
        features: ["catalog", "metadata", "dependencies"],
        status: "stable"
      }
    ],

    utils: [
      {
        name: "LanguageContext",
        path: "components/utils/LanguageContext",
        type: "context",
        description: "Context pour gestion multilingue",
        props: ["children"],
        features: ["i18n", "language-switching"],
        status: "stable"
      },
      {
        name: "SafeNumber",
        path: "components/utils/SafeNumber",
        type: "utility",
        description: "Utilitaires pour nombres sécurisés",
        props: [],
        features: ["safeToFixed", "safeNumber", "safePercentage"],
        status: "stable"
      },
      {
        name: "translations",
        path: "components/utils/translations",
        type: "translations",
        description: "Fichier de traductions multilingues",
        props: [],
        features: ["fr", "en", "es", "de", "zh"],
        status: "stable"
      }
    ],

    search: [
      {
        name: "GlobalSearch",
        path: "components/search/GlobalSearch",
        type: "search",
        description: "Recherche globale dans l'application",
        props: ["open", "onOpenChange"],
        features: ["multi-source", "keyboard-shortcut", "fuzzy-search"],
        status: "stable"
      }
    ],

    registry: [
      {
        name: "RegistryEditor",
        path: "components/registry/RegistryEditor",
        type: "editor",
        description: "Éditeur pour le registre système",
        props: ["entry", "onUpdate"],
        features: ["edit-entry", "metadata", "dependencies"],
        status: "stable"
      }
    ],

    home: [
      {
        name: "CompetitiveComparison",
        path: "components/home/CompetitiveComparison",
        type: "comparison",
        description: "Comparaison avec IA concurrentes",
        props: [],
        features: ["comparison-table", "scores", "advantages"],
        status: "stable"
      }
    ],

    ui: [
      {
        name: "Tooltip",
        path: "components/ui/Tooltip",
        type: "ui",
        description: "Tooltip personnalisé sans bugs",
        props: ["children", "content", "position", "showIcon"],
        features: ["portal", "positioning", "arrow"],
        status: "stable"
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ENTITIES (Schémas de données)
  // ═══════════════════════════════════════════════════════════════════════
  
  entities: [
    {
      name: "Conversation",
      path: "entities/Conversation.json",
      category: "chat",
      description: "Conversations avec messages et résumés",
      fields: ["title", "messages", "summaries", "last_message_at", "intelligence_mode"],
      rls: true,
      status: "stable"
    },
    {
      name: "Memory",
      path: "entities/Memory.json",
      category: "memory",
      description: "Mémoires cross-modales persistantes",
      fields: ["type", "content", "context", "importance", "modality", "tags", "linked_memory_ids"],
      rls: true,
      status: "stable"
    },
    {
      name: "KnowledgeBase",
      path: "entities/KnowledgeBase.json",
      category: "knowledge",
      description: "Bases de connaissances documentaires",
      fields: ["title", "content", "source_type", "source_url", "status", "facts", "tags"],
      rls: true,
      status: "stable"
    },
    {
      name: "ConsciousnessConfig",
      path: "entities/ConsciousnessConfig.json",
      category: "consciousness",
      description: "Configuration de conscience SAPIER complète",
      fields: ["consciousness_level", "ratio_logic", "ratio_consciousness", "sapier_equations", "big_five"],
      rls: true,
      status: "stable"
    },
    {
      name: "ConsciousThought",
      path: "entities/ConsciousThought.json",
      category: "consciousness",
      description: "Pensées conscientes générées",
      fields: ["thought", "emotion", "category", "consciousness_level", "favorited"],
      rls: true,
      status: "stable"
    },
    {
      name: "NeuralModule",
      path: "entities/NeuralModule.json",
      category: "neural",
      description: "Modules neuronaux du système",
      fields: ["module_name", "module_type", "activation_level", "efficiency", "neural_parameters"],
      rls: true,
      status: "stable"
    },
    {
      name: "MoralAnalysis",
      path: "entities/MoralAnalysis.json",
      category: "ethics",
      description: "Analyses morales multi-frameworks",
      fields: ["context", "philosophical_evaluations", "ethical_dilemmas", "recommendations"],
      rls: true,
      status: "stable"
    },
    {
      name: "IntuitiveDecision",
      path: "entities/IntuitiveDecision.json",
      category: "decision",
      description: "Décisions intuitives vs analytiques",
      fields: ["context", "intuitive_choice", "analytical_choice", "final_decision", "confidence"],
      rls: true,
      status: "stable"
    },
    {
      name: "DailyBriefing",
      path: "entities/DailyBriefing.json",
      category: "knowledge",
      description: "Briefings quotidiens multi-domaines",
      fields: ["title", "briefing_date", "summary", "domains", "emerging_trends", "favorited"],
      rls: true,
      status: "stable"
    },
    {
      name: "KnowledgeDomain",
      path: "entities/KnowledgeDomain.json",
      category: "knowledge",
      description: "Domaines de connaissance à suivre",
      fields: ["domain_name", "category", "auto_update", "last_update", "sources"],
      rls: true,
      status: "stable"
    },
    {
      name: "AICoachingSession",
      path: "entities/AICoachingSession.json",
      category: "coaching",
      description: "Sessions de coaching personnalisées",
      fields: ["session_date", "coaching_type", "insights", "learning_path", "engagement_score"],
      rls: true,
      status: "stable"
    },
    {
      name: "ConversationTemplate",
      path: "entities/ConversationTemplate.json",
      category: "coaching",
      description: "Templates de conversation par intelligence",
      fields: ["intelligence_type", "template_title", "suggested_prompts", "context_setup"],
      rls: true,
      status: "stable"
    },
    {
      name: "ConversationSecurity",
      path: "entities/ConversationSecurity.json",
      category: "security",
      description: "Profils de sécurité des conversations",
      fields: ["conversation_id", "security_level", "content_analysis", "threat_detection"],
      rls: true,
      status: "stable"
    },
    {
      name: "AnalyticsEvent",
      path: "entities/AnalyticsEvent.json",
      category: "analytics",
      description: "Événements analytics trackés",
      fields: ["event_type", "page_name", "feature_name", "metadata", "session_id"],
      rls: true,
      status: "stable"
    },
    {
      name: "VisualContent",
      path: "entities/VisualContent.json",
      category: "visual",
      description: "Contenu visuel (images, diagrammes)",
      fields: ["type", "url", "description", "analysis", "prompt", "tags"],
      rls: true,
      status: "stable"
    },
    {
      name: "PersonalityProfile",
      path: "entities/PersonalityProfile.json",
      category: "personality",
      description: "Profils de personnalité sauvegardés",
      fields: ["profile_name", "big_five", "philosophical_influences", "consciousness_level"],
      rls: true,
      status: "stable"
    },
    {
      name: "ConsciousnessProfile",
      path: "entities/ConsciousnessProfile.json",
      category: "consciousness",
      description: "Profils de conscience complets",
      fields: ["name", "config"],
      rls: true,
      status: "stable"
    },
    {
      name: "Integration",
      path: "entities/Integration.json",
      category: "integrations",
      description: "Intégrations externes",
      fields: ["name", "type", "status", "credentials", "config"],
      rls: true,
      status: "stable"
    },
    {
      name: "Webhook",
      path: "entities/Webhook.json",
      category: "integrations",
      description: "Webhooks configurés",
      fields: ["name", "url", "events", "active", "secret"],
      rls: true,
      status: "stable"
    },
    {
      name: "APIKey",
      path: "entities/APIKey.json",
      category: "integrations",
      description: "Clés API générées",
      fields: ["name", "key", "permissions", "rate_limit", "active"],
      rls: true,
      status: "stable"
    },
    {
      name: "IntegrationLog",
      path: "entities/IntegrationLog.json",
      category: "integrations",
      description: "Logs d'intégrations",
      fields: ["integration_id", "event_type", "status", "request_data", "response_data"],
      rls: true,
      status: "stable"
    },
    {
      name: "RegistryEntry",
      path: "entities/RegistryEntry.json",
      category: "system",
      description: "Entrées du registre système",
      fields: ["item_type", "item_name", "file_path", "description", "status", "dependencies"],
      rls: true,
      status: "stable"
    },
    {
      name: "TTSPreferences",
      path: "entities/TTSPreferences.json",
      category: "preferences",
      description: "Préférences TTS utilisateur",
      fields: ["enabled", "voice_name", "rate", "pitch", "auto_play"],
      rls: true,
      status: "stable"
    },
    {
      name: "SearchHistory",
      path: "entities/SearchHistory.json",
      category: "search",
      description: "Historique de recherches",
      fields: ["query", "results_count", "clicked_result", "search_context"],
      rls: true,
      status: "stable"
    },
    {
      name: "UserBehaviorAnalytics",
      path: "entities/UserBehaviorAnalytics.json",
      category: "analytics",
      description: "Analytics comportementales utilisateur",
      fields: ["analysis_date", "user_patterns", "predictions", "content_preferences"],
      rls: true,
      status: "stable"
    },
    {
      name: "PersonalizedRecommendation",
      path: "entities/PersonalizedRecommendation.json",
      category: "analytics",
      description: "Recommandations personnalisées",
      fields: ["recommendation_type", "title", "relevance_score", "reasoning"],
      rls: true,
      status: "stable"
    },
    {
      name: "ReasoningFeedback",
      path: "entities/ReasoningFeedback.json",
      category: "feedback",
      description: "Feedback sur le raisonnement chain-of-thought",
      fields: ["query", "reasoning_steps", "final_answer", "user_rating", "reasoning_quality"],
      rls: true,
      status: "stable"
    },
    {
      name: "CognitiveCorrelation",
      path: "entities/CognitiveCorrelation.json",
      category: "consciousness",
      description: "Corrélations cognitives",
      fields: ["correlation_type", "strength", "evidence", "timestamp"],
      rls: true,
      status: "stable"
    },
    {
      name: "InterpretativeTrace",
      path: "entities/InterpretativeTrace.json",
      category: "consciousness",
      description: "Traces interprétatives",
      fields: ["context", "reasoning_steps", "justifications", "confidence"],
      rls: true,
      status: "stable"
    },
    {
      name: "EmotionalResponse",
      path: "entities/EmotionalResponse.json",
      category: "emotion",
      description: "Réponses émotionnelles",
      fields: ["trigger", "emotion", "intensity", "context"],
      rls: true,
      status: "stable"
    },
    {
      name: "ConsciousnessEvolution",
      path: "entities/ConsciousnessEvolution.json",
      category: "consciousness",
      description: "Évolution de la conscience dans le temps",
      fields: ["timestamp", "level", "changes", "insights"],
      rls: true,
      status: "stable"
    },
    {
      name: "KnowledgeFusion",
      path: "entities/KnowledgeFusion.json",
      category: "knowledge",
      description: "Fusion de connaissances multi-sources",
      fields: ["sources", "synthesis", "contradictions", "confidence"],
      rls: true,
      status: "stable"
    },
    {
      name: "MarketAnalysis",
      path: "entities/MarketAnalysis.json",
      category: "market",
      description: "Analyses de marché",
      fields: ["market_type", "data", "insights", "predictions"],
      rls: true,
      status: "stable"
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════
  // INTEGRATIONS (Services externes)
  // ═══════════════════════════════════════════════════════════════════════
  
  integrations: {
    core: [
      {
        name: "InvokeLLM",
        package: "Core",
        description: "Invocation LLM avec prompt et schéma JSON",
        params: ["prompt", "add_context_from_internet", "response_json_schema", "file_urls"],
        usage: "Génération de texte, analyse, extraction de données"
      },
      {
        name: "SendEmail",
        package: "Core",
        description: "Envoi d'emails",
        params: ["from_name", "to", "subject", "body"],
        usage: "Notifications, alertes"
      },
      {
        name: "UploadFile",
        package: "Core",
        description: "Upload de fichiers",
        params: ["file"],
        returns: ["file_url"],
        usage: "Upload d'images, documents"
      },
      {
        name: "GenerateImage",
        package: "Core",
        description: "Génération d'images par IA",
        params: ["prompt"],
        returns: ["url"],
        usage: "Création d'images génératives"
      },
      {
        name: "ExtractDataFromUploadedFile",
        package: "Core",
        description: "Extraction de données structurées depuis fichier",
        params: ["file_url", "json_schema"],
        returns: ["output"],
        usage: "Parsing de CSV, PDF, images"
      },
      {
        name: "CreateFileSignedUrl",
        package: "Core",
        description: "Création d'URL signée pour fichier privé",
        params: ["file_uri", "expires_in"],
        returns: ["signed_url"],
        usage: "Accès temporaire fichiers privés"
      },
      {
        name: "UploadPrivateFile",
        package: "Core",
        description: "Upload fichier privé",
        params: ["file"],
        returns: ["file_uri"],
        usage: "Stockage sécurisé"
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════
  // LAYOUTS & GLOBALS
  // ═══════════════════════════════════════════════════════════════════════
  
  layout: {
    file: "Layout.js",
    description: "Layout principal avec sidebar et navigation",
    features: ["responsive", "mobile-menu", "language-selector", "consciousness-hub"],
    navigation: [
      "Home", "Chat", "Intelligences", "AICoach", "SecurityDashboard",
      "VoiceRoom", "VoiceLive", "VisualGallery", "Consciousness",
      "MoralCompass", "Memory", "NeuralSystem", "DecisionArchive",
      "Knowledge", "DailyBriefing", "Integrations", "Favorites", "Personality"
    ],
    status: "stable"
  },

  globals: {
    file: "globals.css",
    description: "Styles globaux et tokens de design",
    features: [
      "design-tokens",
      "typography-scale",
      "color-system",
      "spacing-scale",
      "shadows",
      "border-radius",
      "transitions",
      "z-index",
      "mobile-optimizations",
      "safe-area",
      "animations"
    ],
    tokens: {
      colors: ["primary", "secondary", "accent", "text", "bg", "border"],
      fonts: ["sans"],
      spacing: ["1-16"],
      shadows: ["sm", "md", "lg", "xl", "2xl"],
      radius: ["sm", "md", "lg", "xl", "2xl", "full"],
      transitions: ["fast", "base", "slow"]
    },
    status: "stable"
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ARCHITECTURE & PATTERNS
  // ═══════════════════════════════════════════════════════════════════════
  
  architecture: {
    patterns: [
      {
        name: "Component Composition",
        description: "Composants petits et focalisés, composables",
        examples: ["ChatMessage", "MemoryCard", "NeuralModuleCard"]
      },
      {
        name: "Context Providers",
        description: "Contexts React pour state global",
        examples: ["LanguageContext", "ConsciousnessHub", "AnalyticsProvider"]
      },
      {
        name: "Custom Hooks",
        description: "Hooks pour logique réutilisable",
        examples: ["useTTS", "useConsciousnessHub"]
      },
      {
        name: "React Query",
        description: "Gestion async avec cache",
        examples: ["useQuery", "useMutation", "queryClient"]
      },
      {
        name: "Base44 SDK",
        description: "Client API pré-initialisé",
        examples: ["base44.entities.*", "base44.integrations.*", "base44.auth.*"]
      },
      {
        name: "Framer Motion",
        description: "Animations déclaratives",
        examples: ["AnimatePresence", "motion.div", "variants"]
      },
      {
        name: "Tailwind CSS",
        description: "Utility-first styling",
        examples: ["classes", "responsive", "gradients"]
      },
      {
        name: "Shadcn/ui",
        description: "Composants UI pré-stylisés",
        examples: ["Button", "Card", "Dialog", "Tabs"]
      }
    ],

    dataFlow: [
      "User Interaction → Component",
      "Component → Base44 SDK",
      "Base44 SDK → Backend (Entity/Integration)",
      "Backend → Response",
      "React Query → Cache + State Update",
      "State Update → UI Re-render"
    ],

    securityLayers: [
      "Row-Level Security (RLS) sur entités",
      "Authentication via Base44",
      "Content filtering (Anonyma)",
      "Threat detection en temps réel",
      "Audit logging"
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CONVENTIONS DE CODE
  // ═══════════════════════════════════════════════════════════════════════
  
  conventions: {
    files: {
      pages: "PascalCase sans extension (ex: Chat, Home)",
      components: "PascalCase avec .jsx (ex: ChatMessage.jsx)",
      entities: "PascalCase avec .json (ex: Memory.json)",
      utilities: "camelCase (ex: SafeNumber, translations)"
    },
    
    naming: {
      components: "PascalCase descriptif",
      functions: "camelCase verbe d'action",
      constants: "UPPER_SNAKE_CASE",
      props: "camelCase",
      booleans: "is/has/should prefix"
    },

    imports: {
      order: [
        "React",
        "Third-party libraries",
        "Base44 SDK",
        "Components",
        "Utils",
        "Styles"
      ]
    },

    errors: {
      handling: "Pas de try/catch sauf demandé explicitement",
      numbers: "Utiliser SafeNumber utilities",
      nullish: "Vérifications avec optional chaining ?."
    },

    responsiveness: {
      breakpoints: ["sm:640px", "md:768px", "lg:1024px", "xl:1280px"],
      mobile_first: true,
      touch_targets: "min 44x44px"
    }
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ROADMAP & STATUS
  // ═══════════════════════════════════════════════════════════════════════
  
  roadmap: {
    completed: [
      "✅ Architecture SAPIER complète",
      "✅ Conscience artificielle multi-dimensionnelle",
      "✅ Mémoire cross-modale persistante",
      "✅ Système neuronal avec modules",
      "✅ Analyse morale multi-frameworks",
      "✅ Coaching IA personnalisé",
      "✅ Interface vocale avancée",
      "✅ Sécurité Anonyma",
      "✅ Base de connaissances",
      "✅ Briefings quotidiens",
      "✅ Intégrations externes",
      "✅ Analytics comportementales",
      "✅ Personnalité configurable",
      "✅ Registres système"
    ],

    inProgress: [
      "🔄 Optimisation performances",
      "🔄 Tests complets .toFixed()",
      "🔄 Documentation enrichie"
    ],

    planned: [
      "📋 Mode offline",
      "📋 Export/Import données",
      "📋 Collaboration multi-utilisateurs",
      "📋 Plugins système",
      "📋 API publique",
      "📋 Mobile app native"
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════
// FONCTIONS UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════

export function getComponentByName(name) {
  for (const category in APPLICATION_REGISTRY.components) {
    const component = APPLICATION_REGISTRY.components[category].find(c => c.name === name);
    if (component) return component;
  }
  return null;
}

export function getPageByName(name) {
  return APPLICATION_REGISTRY.pages.find(p => p.name === name);
}

export function getEntityByName(name) {
  return APPLICATION_REGISTRY.entities.find(e => e.name === name);
}

export function searchRegistry(query) {
  const results = {
    pages: [],
    components: [],
    entities: []
  };

  const lowerQuery = query.toLowerCase();

  // Search pages
  results.pages = APPLICATION_REGISTRY.pages.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.features.some(f => f.toLowerCase().includes(lowerQuery))
  );

  // Search components
  for (const category in APPLICATION_REGISTRY.components) {
    const matches = APPLICATION_REGISTRY.components[category].filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery)
    );
    results.components.push(...matches);
  }

  // Search entities
  results.entities = APPLICATION_REGISTRY.entities.filter(e =>
    e.name.toLowerCase().includes(lowerQuery) ||
    e.description.toLowerCase().includes(lowerQuery)
  );

  return results;
}

export function getStatistics() {
  let totalComponents = 0;
  for (const category in APPLICATION_REGISTRY.components) {
    totalComponents += APPLICATION_REGISTRY.components[category].length;
  }

  return {
    totalPages: APPLICATION_REGISTRY.pages.length,
    totalComponents,
    totalEntities: APPLICATION_REGISTRY.entities.length,
    totalIntegrations: APPLICATION_REGISTRY.integrations.core.length,
    categories: Object.keys(APPLICATION_REGISTRY.components).length
  };
}

export function getDependencyTree(itemName) {
  const page = getPageByName(itemName);
  const component = getComponentByName(itemName);
  const item = page || component;

  if (!item || !item.dependencies) return [];

  return item.dependencies.map(dep => ({
    name: dep,
    details: getComponentByName(dep) || getPageByName(dep)
  }));
}

export default APPLICATION_REGISTRY;