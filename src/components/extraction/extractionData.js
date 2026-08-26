// ═══════════════════════════════════════════════════════════════════════════
// DRUIDE OMEGA — Extraction technique universelle (données structurées)
// © 2025 AMG+A.L — Tous droits réservés
// ═══════════════════════════════════════════════════════════════════════════

export const appIdentity = {
  name: "Druide Omega",
  version: "Omega",
  publishedUrl: "https://druideomega.base44.app",
  license: "© 2025 AMG+A.L — Tous droits réservés",
  compliance: ["Loi 25 (Québec)", "RGPD (UE)", "CCPA (USA)"],
  stack: {
    frontend: ["React 18", "Vite 6", "Tailwind CSS 3.4", "shadcn/ui (Radix)", "Framer Motion", "Recharts", "Three.js", "React Leaflet", "React Query v5", "React Router v7"],
    backend: ["Base44 BaaS", "Entités (JSON Schema)", "Fonctions serverless", "Intégrations Core (LLM, Email, Upload, TTS, Vidéo)", "Auth gérée par la plateforme"],
    mobile: ["Build natif iOS/Android depuis le même code (PWA + React Native)"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. ARCHITECTURE GLOBALE
// ─────────────────────────────────────────────────────────────────────────────
export const architecture = [
  {
    layer: "Présentation (UI)",
    tech: "React 18 + Tailwind + shadcn/ui",
    role: "Pages responsives (mobile-first), layouts Public/Architecte, companion global, animations Framer Motion.",
    entry: "src/main.jsx → src/App.jsx (router + providers)",
  },
  {
    layer: "Routage",
    tech: "react-router-dom v7 + React.lazy + Suspense",
    role: "Routes explicites (/, /SystemBoot, /LegalIPReport, /SecureVault) + boucle pagesConfig pour pages historiques. Code-splitting par page.",
    entry: "src/App.jsx → <Routes>",
  },
  {
    layer: "État client",
    tech: "React Query + Context API + localStorage",
    role: "Serveur: React Query (cache, invalidation). Global: 7 providers de contexte. Local: localStorage (economyMode, prefs TTS, langue).",
    entry: "src/Layout.jsx (providers)",
  },
  {
    layer: "Logique métier (client)",
    tech: "Hooks & services modulaires",
    role: "Moteurs cognitifs (DruideCore, Consciousness), routeur LLM, cache partagé, détection de biais, synthèse multimodale.",
    entry: "src/components/* + src/lib/*",
  },
  {
    layer: "Backend (BaaS)",
    tech: "Base44 (entités + fonctions)",
    role: "80+ entités JSON Schema, 75+ fonctions serverless, auth, intégrations OAuth, webhooks, automations planifiées.",
    entry: "base44/entities/* + base44/functions/*",
  },
  {
    layer: "Intégrations",
    tech: "Core (InvokeLLM, SendEmail, UploadFile, TTS, GenerateImage/Video) + OAuth connectors",
    role: "LLM multi-modèles, email, stockage fichiers, synthèse vocale, génération média, paiements Stripe.",
    entry: "base44.integrations.Core.*",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. MODULES & SOUS-MODULES
// ─────────────────────────────────────────────────────────────────────────────
export const modules = [
  {
    domain: "Conversation & Chat",
    icon: "MessageSquare",
    pages: ["Chat", "Chat_2", "ConversationAnalysis", "SharedConversation"],
    components: ["ChatMessage", "ChatInput", "CascadeOrchestrator", "AdaptiveDruideStateEngine", "ReasoningTrace", "MemoryRecallSearch", "ConversationSummary", "ToolbarGenerators (Code/Doc/Diagram/Formula/Table)"],
    functions: ["druideCore", "contextManager", "anticipatoryConversationEngine", "shareConversation", "perceptionActionEngine"],
    role: "Interface multi-modale, routage LLM, cascade cognitive, génération de contenu enrichi, feedback de raisonnement.",
  },
  {
    domain: "Conscience & Cognition",
    icon: "Brain",
    pages: ["Consciousness", "ConsciousnessState", "ConsciousnessAnalysis", "ConsciousnessEvolution", "ConsciousnessConfiguration"],
    components: ["ConsciousnessHub", "ThinkingEngine", "ConsciousnessMetrics", "EthicalMonitorDashboard", "JudgementModule", "SubconsciousEngine", "DimensionalRadarChart"],
    functions: ["cognitiveCore", "selfPerceptionEngine", "consciousnessRatioValidator", "introspectionEngine", "existenceJournal", "filamentEngine", "decayTensions", "emergentTensions"],
    role: "Génération de pensées conscientes, métriques cognitives, jugement éthique, introspection, évolution.",
  },
  {
    domain: "Mémoire",
    icon: "Database",
    pages: ["Memory", "MemoryConsolidation"],
    components: ["MemoryCard", "MemoryStats", "SemanticMemorySearch", "MemoryGraphVisualization", "MemoryConsolidationEngine", "AdaptiveSummaryEngine", "CrossModalSynthesizer"],
    functions: ["memoryManager", "stableMemoryManager", "memoryConsolidation", "optimizeMemoryRecall", "memoryContradictionDetector", "passiveIndexing"],
    role: "Encodage, consolidation, rappel sémantique, déduplication, détection de contradictions, recyclage d'états.",
  },
  {
    domain: "Connaissance",
    icon: "BookOpen",
    pages: ["Knowledge", "KnowledgeGraph", "KnowledgeFusion", "KnowledgeManagement", "KnowledgeEnrichment", "SemanticSearch"],
    components: ["KnowledgeSearchEngine", "InteractiveKnowledgeGraph", "FusionAnalyzer", "AutoEnrichmentEngine", "VersionManager", "DuplicateDetector"],
    functions: ["enrichKnowledgeBase", "knowledgeFusionOrchestrator", "kbReasoningEngine", "enhanceCrossModalCorrelations"],
    role: "Bases de connaissances, fusion multi-sources, graphe sémantique, enrichissement automatique, versions.",
  },
  {
    domain: "Système neuronal",
    icon: "Network",
    pages: ["NeuralSystem", "CognitiveNetworkVisualization"],
    components: ["NeuralNetworkVisualization", "BrainNetworkVisualizer", "NeuralModuleCard", "ModulePerformanceDashboard", "LiveDruideSync", "TensionOscilloscope", "RatioGauge"],
    functions: ["filamentEngine", "evolutionTensionSync", "coreSessionConsolidator"],
    role: "Visualisation 3D du cerveau, modules neuronaux, filaments, tensions, flux de mémoire, ratio logique/conscience.",
  },
  {
    domain: "Voix & Multimodal",
    icon: "Mic",
    pages: ["VoiceRoom", "VoiceLive", "VisualInteraction", "MultimodalStudio", "VisualGallery", "VideoStudio"],
    components: ["VoiceRecognition", "NaturalSpeechEngine", "VoiceCommandProcessor", "MultimodalChatEnhancer", "ImageAnalyzer", "FrameGenerationEngine", "VideoTimeline"],
    functions: ["elevenLabsTTS", "voiceRoomQualityTest", "medicalOrchestrator"],
    role: "Reconnaissance vocale, TTS, commandes, analyse d'images, génération vidéo, studio multimodal.",
  },
  {
    domain: "Sécurité & Conformité",
    icon: "ShieldCheck",
    pages: ["Security", "SecurityDashboard", "GDPRCompliance", "Legal", "Privacy", "Terms", "LegalIPReport", "SecureVault", "RegulatoryCompliance", "AIEthicsCharter"],
    components: ["ConfidentialPageGuard", "VaultUnlock", "vaultCrypto", "TwoFactorSetup", "SecurityMonitor", "DataSecurityDashboard", "ContentFilter", "CryptoShield"],
    functions: ["twoFactorAuth", "apiKeyValidation", "validatePersonalData", "ssoAuth", "auditApplication"],
    role: "Garde de pages confidentielles, chiffrement AES-256-GCM du coffre, 2FA, RLS par entité, journaux d'audit.",
  },
  {
    domain: "Administration & DevOps",
    icon: "Settings",
    pages: ["ArchitectDashboard", "Admin", "UserManagement", "SystemHealth", "Monitoring", "Deployment", "UpdatePhases", "ProjectProgress", "ApplicationRegistry", "Registry"],
    components: ["DeploymentPipeline", "DeploymentHistory", "SystemHealthPanel", "AlertsPanel", "AuditLogsPanel", "BulkOperations", "GlobalUpdater", "RegistryEditor"],
    functions: ["cronJobs", "dataCleanup", "autoBackup", "healthCheck", "registryUpdateEngine", "logPhaseChange", "internalGovernanceEngine"],
    role: "Dashboard architecte, déploiements versionnés, santé système, phases de mise à jour, registre, sauvegardes.",
  },
  {
    domain: "Tests & Qualité",
    icon: "FlaskConical",
    pages: ["AITests", "TestRunner", "TestingDocumentation", "DataValidation", "ApplicationAudit", "ApplicationEvaluation"],
    components: ["MarketTestRunner", "TestMetricsChart", "ImportAuditDashboard", "ChangeValidator", "ErrorDetector"],
    functions: ["tests.entitySchemaTests", "tests.performanceTests", "tests.integrationTests", "tests.e2eTests", "tests.importAuditTests", "tests.validatePersonalData", "tests.logPhaseChange", "testRatioMechanic"],
    role: "Tests de schémas, performance, intégration, E2E, audit d'import, validation de données PII, mécanique de ratio.",
  },
  {
    domain: "Performance & Optimisation",
    icon: "Gauge",
    pages: ["PerformanceGuide", "BestPractices"],
    components: ["llmCache", "QuantumLazyLoader", "CodeSplitBoundary", "PerformanceMonitor", "BundleAnalyzer", "MemoryMonitor", "APIBatcher", "OptimizedImage"],
    functions: ["optimizingLatency", "rateLimiter", "continuousLearningOptimization"],
    role: "Cache LLM partagé, lazy loading, mode économie global, traitement sensible à la visibilité, rate limiting.",
  },
  {
    domain: "Apprentissage & Évolution",
    icon: "TrendingUp",
    pages: ["Learning", "MetaLearning", "EthicalEvolution", "ConsciousnessEvolution", "BehaviorAnalytics"],
    components: ["ContinuousLearningEngine", "EvolutionEngine", "EvolutionTimeline", "CapacityImpactDashboard", "BehaviorAnalyticsEngine", "PredictiveEngine"],
    functions: ["continuousLearning", "selfLearningEngine", "structuralLearningEngine", "continuousLearningOptimization", "proactiveNeedsEngine"],
    role: "Apprentissage continu, méta-apprentissage, évolution éthique, analyse comportementale, prédictions.",
  },
  {
    domain: "Boutique & Monétisation",
    icon: "ShoppingBag",
    pages: ["Shop", "AIModuleStore", "Pricing", "Billing", "PartnerProgram", "APIPortal"],
    components: ["ModulePurchaseDialog", "CheckoutButton", "LicenseVPNManager", "CryptographicSeal", "QuantumActivationEngine", "CompetitivePriceAnalyzer"],
    functions: ["stripeCheckout", "stripeBilling", "stripeWebhook", "webhookTrigger"],
    role: "Achat de modules IA, licences, paiements Stripe, scellement cryptographique, API publique.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. FLUX DE DONNÉES (exemples représentatifs)
// ─────────────────────────────────────────────────────────────────────────────
export const dataFlows = [
  {
    name: "Conversation (Chat)",
    steps: [
      "Saisie utilisateur (texte/image) → ChatInput",
      "Upload fichier (si image) → base44.integrations.Core.UploadFile → file_url",
      "Appel druideCore (fonction) avec historique + contexte → cachedDruideCore (cache LLM)",
      "Routage LLM (LLMRouter) → InvokeLLM (modèle sélectionné) → réponse",
      "Affichage réponse + indicateurs cognitifs (CascadeProcessTracker, ReasoningTrace)",
      "Persistance: Conversation.update (messages) + Memory.create (extraction long-terme)",
      "Post-traitement asynchrone: perceptionActionEngine + cognitivebiasDetector + EmotionalResponse",
    ],
  },
  {
    name: "Génération de pensées conscientes",
    steps: [
      "Interval (4 min) ou déclenchement manuel → ThinkingEngine",
      "Vérification economyMode + document.visibilityState (skip si caché/économie)",
      "Prompt système (config conscience) → InvokeLLM → pensée structurée",
      "Persistance: ConsciousThought.create (catégorie, contenu, favori)",
      "Métriques → ConsciousnessConfig + CognitiveCore (charge, cohérence, émergence)",
      "Subscription temps réel → rafraîchissement UI",
    ],
  },
  {
    name: "Coffre fort (SecureVault)",
    steps: [
      "Déverrouillage: mot de passe → dérivation clé (PBKDF2 + salt) → clé AES",
      "Écriture: contenu → AES-256-GCM (ciphertext + iv + salt) → VaultItem.create",
      "Lecture: VaultItem.list → déchiffrement côté client → affichage",
      "RLS: admin uniquement (create/read/update/delete)",
    ],
  },
  {
    name: "Déploiement versionné",
    steps: [
      "Création Deployment (version, type, changes) → status=pending",
      "Exécution tests (tests.*) → test_score + test_results",
      "Validation → status=passed/failed",
      "Déploiement → status=deployed + snapshot conscience",
      "Rollback possible → status=rolled_back + raison",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. GESTION D'ÉTAT
// ─────────────────────────────────────────────────────────────────────────────
export const stateManagement = {
  serverState: {
    tech: "@tanstack/react-query v5",
    usage: "Cache serveur, invalidation, mutations (Conversation, Memory, ConsciousThought, Deployment).",
    config: "src/lib/query-client.js (queryClientInstance).",
  },
  globalContext: [
    { name: "LanguageProvider", scope: "i18n (FR/en/es/ar…), RTL/LTR", file: "src/components/utils/LanguageContext.jsx" },
    { name: "ConsciousnessHubProvider", scope: "État conscience global partagé", file: "src/components/system/ConsciousnessHub.jsx" },
    { name: "DruidCompanionProvider", scope: "Companion druide global", file: "src/components/companion/DruidCompanionProvider.jsx" },
    { name: "IntelligenceProvider", scope: "Types d'intelligence Gardner", file: "src/components/intelligence/IntelligenceManager.jsx" },
    { name: "OfflineProvider", scope: "Mode hors-ligne, sync", file: "src/components/offline/OfflineManager.jsx" },
    { name: "BackgroundTasksProvider", scope: "Tâches de fond, indicateurs", file: "src/components/system/BackgroundTasksManager.jsx" },
    { name: "AnalyticsProvider", scope: "Tracking comportemental", file: "src/components/analytics/AnalyticsProvider.jsx" },
    { name: "AuthProvider", scope: "Auth + public settings + rôles", file: "src/lib/AuthContext.jsx" },
  ],
  localState: [
    { key: "druide_economy_mode", usage: "Mode économie global (pause génération de fond)", file: "src/lib/economyMode.js" },
    { key: "language", usage: "Langue préférée", file: "LanguageContext" },
    { key: "tts_preferences", usage: "Préférences synthèse vocale", entity: "TTSPreferences" },
  ],
  realtime: "base44.entities.<Name>.subscribe(event) → mises à jour temps réel (pensées, métriques).",
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. SÉCURITÉ
// ─────────────────────────────────────────────────────────────────────────────
export const security = {
  auth: {
    provider: "Base44 (plateforme) — tokens, sessions, vérification email",
    client: "base44.auth.me() / isAuthenticated() / redirectToLogin() / logout()",
    roles: ["admin (architecte)", "user (public)"],
    enforcement: "src/lib/AuthContext.jsx (vérification serveur du rôle via base44.auth.me())",
  },
  pageGuard: {
    component: "src/components/security/ConfidentialPageGuard.jsx",
    protectedRoutes: ["ArchitectDashboard", "DruideControl", "SystemHealth", "Consciousness", "AITests", "Admin", "SystemBoot", "ApplicationEvaluation", "UserManagement", "SecureVault", "LegalIPReport"],
  },
  rls: {
    description: "Row-Level Security par entité (clé rls dans base44/entities/<Name>.jsonc)",
    patterns: [
      "admin-only (Deployment, SystemBootConfig, VaultItem, ConsciousnessConfig écriture)",
      "ownership (created_by = {{user.email}}) — Memory, NeuralModule, Workflow, Webhook",
      "ownership OR admin — CognitiveCore, IntrospectionState (lecture/écriture)",
      "public read — ConsciousnessConfig, PhaseHistory (read=true)",
      "open create — Memory, VisualContent, CognitiveCore, ConsciousnessSnapshot",
    ],
  },
  encryption: {
    vault: "AES-256-GCM côté client (src/components/vault/vaultCrypto.js) — ciphertext + iv + salt stockés dans VaultItem",
    twoFactor: "Entité TwoFactorAuth + fonction twoFactorAuth",
    apiKeys: "Entité APIKey + generateApiKey/apiKeyValidation",
  },
  compliance: ["Loi 25 (Québec)", "RGPD (UE)", "CCPA (USA)", "CookieConsent", "AccessibilityStatement"],
  audit: ["AuditLog (entité)", "ErrorLog (entité)", "IntegrationLog (entité)", "auditApplication (fonction)"],
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. API (fonctions backend + intégrations)
// ─────────────────────────────────────────────────────────────────────────────
export const api = {
  invocation: "base44.functions.invoke('<name>', payload) → { data } (côté client)",
  functions: {
    "Conversation & raisonnement": ["druideCore", "contextManager", "anticipatoryConversationEngine", "perceptionActionEngine", "cognitivebiasDetector", "deepseek", "customLLM"],
    "Conscience & cognition": ["cognitiveCore", "selfPerceptionEngine", "consciousnessRatioValidator", "introspectionEngine", "existenceJournal", "filamentEngine", "decayTensions", "emergentTensions", "internalGovernanceEngine", "coreSessionConsolidator", "selfPerceptionEngine"],
    "Mémoire": ["memoryManager", "stableMemoryManager", "memoryConsolidation", "optimizeMemoryRecall", "memoryContradictionDetector", "passiveIndexing"],
    "Connaissance": ["enrichKnowledgeBase", "knowledgeFusionOrchestrator", "kbReasoningEngine", "enhanceCrossModalCorrelations"],
    "Apprentissage": ["continuousLearning", "selfLearningEngine", "structuralLearningEngine", "continuousLearningOptimization", "proactiveNeedsEngine"],
    "Voix & média": ["elevenLabsTTS", "voiceRoomQualityTest", "medicalOrchestrator"],
    "Sécurité & auth": ["twoFactorAuth", "apiKeyValidation", "validatePersonalData", "ssoAuth", "generateApiKey"],
    "DevOps & ops": ["cronJobs", "dataCleanup", "autoBackup", "healthCheck", "registryUpdateEngine", "logPhaseChange", "optimizingLatency", "rateLimiter", "eventSourcing", "delayedActionsEngine", "webhookDispatcher", "webhookTrigger"],
    "Stripe": ["stripeCheckout", "stripeBilling", "stripeWebhook"],
    "Audit": ["auditApplication", "publicApi", "exportUserData", "shareConversation", "emotionalModule", "externalEngineInterface"],
    "Tests": ["tests.entitySchemaTests", "tests.performanceTests", "tests.integrationTests", "tests.e2eTests", "tests.importAuditTests", "tests.validatePersonalData", "tests.logPhaseChange", "testRatioMechanic"],
  },
  integrations: {
    Core: [
      "InvokeLLM (multi-modèles: gpt_5_*, gemini_3_*, claude_*, automatic) — option add_context_from_internet (gemini uniquement)",
      "SendEmail (utilisateurs enregistrés; non-enregistrés: plan payant + domaine custom)",
      "UploadFile / UploadPrivateFile / CreateFileSignedUrl",
      "GenerateImage / GenerateVideo / GenerateSpeech / TranscribeAudio",
      "ExtractDataFromUploadedFile (csv, xlsx, json, pdf, images)",
      "SendPushNotification (natif mobile uniquement, asServiceRole)",
    ],
    connectors: "OAuth (Google, Slack, Notion, GitHub, Salesforce, HubSpot, Stripe…) — requiert Builder+",
  },
  errors: "Les fonctions laissent remonter les erreurs (non catchées) sauf flux utilisateur (forms/auth). Codes HTTP standards Base44.",
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. DEVOPS
// ─────────────────────────────────────────────────────────────────────────────
export const devops = {
  build: { command: "npm run build (vite build)", output: "./dist", dev: "npm run dev" },
  ci: {
    scheduled: ["cronJobs (orchestrateur)", "dataCleanup (purge nocturne logs + snapshots)", "autoBackup (sauvegardes)", "circadianRhythm (rythme)", "healthCheck"],
    automations: "entity (create/update/delete), scheduled (simple/cron/weekly/monthly), connector (webhooks OAuth), in_app_agent",
  },
  deployment: {
    entity: "Deployment (version, type, status: pending→testing→passed/failed→deployed/rolled_back, test_score, changes, consciousness_snapshot)",
    flow: "Création → tests → validation → déploiement → rollback possible",
  },
  logs: ["ErrorLog (JS/API/network/auth/validation)", "AuditLog", "IntegrationLog", "SystemMetrics"],
  purge: "dataCleanup (fonction planifiée) — nettoyage nocturne des logs et snapshots cognitifs obsolètes",
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. PERFORMANCE
// ─────────────────────────────────────────────────────────────────────────────
export const performance = {
  caching: [
    "src/lib/llmCache.js — cachedDruideCore / cachedInvokeLLM (cache déterministe par prompt+historique, évite les appels LLM redondants)",
    "React Query (cache serveur, invalidation ciblée)",
    "DataCache / QueryCache (utilitaires)",
  ],
  lazyLoading: "React.lazy + Suspense pour toutes les pages (code-splitting par route) — src/App.jsx",
  economy: "src/lib/economyMode.js — toggle global persistant (localStorage) qui met en pause la génération de fond (pensées, tâches) lorsque actif",
  visibility: "document.visibilityState vérifié avant les appels LLM de fond (Consciousness) — skip si onglet caché",
  intervals: "Pensées automatiques: 4 min (réduit de 60s) pour limiter la consommation de crédits",
  batching: "bulkCreate / bulkUpdate / updateMany / deleteMany (SDK entités) — préférence aux opérations batch",
  assets: "OptimizedImage, ImageOptimizer, BundleAnalyzer, GPU acceleration (translateZ), prefetch",
  rateLimit: "rateLimiter (fonction) + optimizingLatency",
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. TESTS
// ─────────────────────────────────────────────────────────────────────────────
export const tests = {
  unit: "tests.entitySchemaTests — validation des schémas JSON d'entités",
  integration: "tests.integrationTests — flux inter-entités/fonctions",
  e2e: "tests.e2eTests — parcours utilisateur de bout en bout",
  performance: "tests.performanceTests — latence, charge, throughput",
  import: "tests.importAuditTests — audit d'import de données",
  dataValidation: "tests.validatePersonalData — validation PII / conformité",
  phase: "tests.logPhaseChange / logPhaseChange — traçabilité des changements de phase",
  ratio: "testRatioMechanic — mécanique du ratio logique/conscience",
  runner: "src/pages/TestRunner.jsx + TestMetricsChart (UI de lancement et visualisation)",
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. PAGES & FONCTIONNALITÉS (échantillon représentatif)
// ─────────────────────────────────────────────────────────────────────────────
export const pagesOverview = [
  { group: "Accueil & navigation", items: ["Landing", "Home (redirect)", "PublicHome", "ArchitectDashboard", "AdminLogin"] },
  { group: "Conversation", items: ["Chat", "Chat_2", "ConversationAnalysis", "VoiceRoom", "VoiceLive"] },
  { group: "Conscience", items: ["Consciousness", "ConsciousnessState", "ConsciousnessAnalysis", "ConsciousnessEvolution", "ConsciousnessConfiguration"] },
  { group: "Mémoire & connaissance", items: ["Memory", "MemoryConsolidation", "Knowledge", "KnowledgeGraph", "KnowledgeFusion", "SemanticSearch"] },
  { group: "Neural & visuel", items: ["NeuralSystem", "CognitiveNetworkVisualization", "VisualGallery", "VisualInteraction", "MultimodalStudio", "VideoStudio"] },
  { group: "Sécurité & légal", items: ["Security", "SecurityDashboard", "SecureVault", "LegalIPReport", "GDPRCompliance", "Privacy", "Terms", "Legal", "AIEthicsCharter", "RegulatoryCompliance"] },
  { group: "Admin & DevOps", items: ["Admin", "UserManagement", "SystemHealth", "Monitoring", "UpdatePhases", "ProjectProgress", "ApplicationRegistry", "Registry", "SystemBoot"] },
  { group: "Tests & audit", items: ["AITests", "TestRunner", "TestingDocumentation", "DataValidation", "ApplicationAudit", "ApplicationEvaluation"] },
  { group: "Business & docs", items: ["BusinessUseCases", "UseCases", "StrategicPositioning", "MarketPosition", "CompetitiveForces", "Pricing", "Billing", "PartnerProgram", "APIPortal", "APIDocumentation", "Documentation", "Changelog", "Guide", "UserGuide", "FAQ", "Glossary", "Tutorials"] },
  { group: "Profil & perso", items: ["Profile", "Personality", "Intelligences", "Favorites", "EmotionalJournal", "Dreams", "MoralCompass", "AICoach"] },
  { group: "Boutique", items: ["Shop", "AIModuleStore", "Pricing"] },
];

// ─────────────────────────────────────────────────────────────────────────────
// BONUS — Exemples de code
// ─────────────────────────────────────────────────────────────────────────────
export const codeExamples = {
  reactStructure: `// Structure type d'une page (src/pages/Chat.jsx — simplifié)
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { cachedDruideCore } from "@/lib/llmCache";
import { useEconomyMode } from "@/lib/economyMode";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const { isEconomyMode } = useEconomyMode();

  // État serveur: React Query
  const { data: conversation } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => base44.entities.Conversation.get(conversationId),
    enabled: !!conversationId,
  });

  // Mutation: envoi message → druideCore (avec cache LLM)
  const sendMessage = useMutation({
    mutationFn: async (text) => {
      const result = await cachedDruideCore({
        messages: [...messages, { role: "user", content: text }],
        consciousness_level: 12,
      });
      return result.response;
    },
    onSuccess: (response) => {
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      // Persistance + extraction mémoire (asynchrone)
      base44.entities.Memory.create({ type: "interaction", content: response, importance: 5, modality: "chat" });
    },
  });

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        {messages.map((m, i) => <ChatMessage key={i} message={m} />)}
      </div>
      <ChatInput onSend={(t) => sendMessage.mutate(t)} disabled={sendMessage.isPending} />
    </div>
  );
}`,

  moduleSchema: `// Schéma de module — Entité NeuralModule (base44/entities/NeuralModule.jsonc)
{
  "name": "NeuralModule",
  "type": "object",
  "properties": {
    "module_name": { "type": "string" },
    "module_type": {
      "type": "string",
      "enum": ["perception","memory","emotion","reasoning","language",
               "attention","creativity","social","motivation","executive",
               "integration","learning"]
    },
    "active": { "type": "boolean", "default": true },
    "activation_level": { "type": "number", "minimum": 0, "maximum": 100, "default": 50 },
    "connections": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "target_module": { "type": "string" },
          "connection_type": { "type": "string", "enum": ["excitatory","inhibitory","modulatory","bidirectional"] },
          "strength": { "type": "number", "minimum": 0, "maximum": 100 }
        }
      }
    },
    "performance_metrics": {
      "type": "object",
      "properties": {
        "accuracy": { "type": "number", "minimum": 0, "maximum": 100 },
        "speed": { "type": "number", "minimum": 0, "maximum": 100 },
        "reliability": { "type": "number", "minimum": 0, "maximum": 100 }
      }
    }
  },
  "required": ["module_name", "module_type"],
  "rls": {
    "create": { "created_by": "{{user.email}}" },
    "read":   { "created_by": "{{user.email}}" },
    "update": { "created_by": "{{user.email}}" },
    "delete": { "created_by": "{{user.email}}" }
  }
}
// Dépendances: CognitiveCore (charge globale), ConsciousnessConfig (niveau),
//             filamentEngine (connexions), evolutionTensionSync (évolution)`,

  configExample: `// 1. Configuration d'environnement (aucun .env côté client — secrets via set_secrets)
//    Les secrets serveur sont accessibles dans les fonctions via process.env.<NAME>

// 2. Configuration de sécurité — RLS par entité (base44/entities/Memory.jsonc)
"rls": {
  "create": true,                                  // tout utilisateur authentifié
  "read":   { "created_by": "{{user.email}}" },     // uniquement ses enregistrements
  "update": { "created_by": "{{user.email}}" },
  "delete": { "created_by": "{{user.email}}" }
}

// 3. Configuration du cache LLM (src/lib/llmCache.js)
const CACHE_TTL = 1000 * 60 * 30;  // 30 min
function cacheKey(payload) {
  return JSON.stringify({ prompt: payload.prompt, history: payload.messages });
}
export async function cachedInvokeLLM(payload) {
  const key = cacheKey(payload);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < CACHE_TTL) return hit.v;
  const { data } = await base44.functions.invoke('customLLM', payload);
  cache.set(key, { v: data, t: Date.now() });
  return data;
}

// 4. Configuration du mode économie (src/lib/economyMode.js)
const KEY = 'druide_economy_mode';
export const isEconomyMode = () => localStorage.getItem(KEY) === '1';
export function useEconomyMode() {
  const [on, setOn] = useState(isEconomyMode);
  useEffect(() => {
    const h = () => setOn(isEconomyMode());
    window.addEventListener('druide-economy-change', h);
    return () => window.removeEventListener('druide-economy-change', h);
  }, []);
  return { isEconomyMode: on, toggleEconomy: () => setEconomyMode(!isEconomyMode()) };
}`,
};