import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════════════
// DRUIDE_OMEGA - Registre Vivant : moteur de mise à jour centralisé
// Modules : inventory | tests | news | descriptions
// ═══════════════════════════════════════════════════════════════════════

const FUNCTIONS = [
  "anticipatoryConversationEngine","apiKeyValidation","auditApplication","autoBackup","circadianRhythm",
  "cognitiveCore","cognitivebiasDetector","consciousnessRatioValidator","contextManager","continuousLearning",
  "continuousLearningOptimization","coreSessionConsolidator","cronJobs","customLLM","decayTensions","deepseek",
  "delayedActionsEngine","druideCore","elevenLabsTTS","emergentTensions","emotionalModule",
  "enhanceCrossModalCorrelations","enrichKnowledgeBase","eventSourcing","evolutionTensionSync","existenceJournal",
  "exportUserData","externalEngineInterface","filamentEngine","generateApiKey","healthCheck",
  "internalGovernanceEngine","introspectionEngine","kbReasoningEngine","knowledgeFusionOrchestrator",
  "logPhaseChange","medicalOrchestrator","memoryConsolidation","memoryContradictionDetector","memoryManager",
  "optimizeMemoryRecall","optimizingLatency","passiveIndexing","perceptionActionEngine","proactiveNeedsEngine",
  "publicApi","rateLimiter","registryUpdateEngine","selfLearningEngine","selfPerceptionEngine","shareConversation",
  "ssoAuth","stableMemoryManager","stripeBilling","stripeCheckout","stripeWebhook","structuralLearningEngine",
  "testRatioMechanic","twoFactorAuth","validatePersonalData","voiceRoomQualityTest","webhookDispatcher","webhookTrigger"
];

const TEST_FUNCTIONS = [
  "tests.e2eTests","tests.entitySchemaTests","tests.importAuditTests","tests.integrationTests",
  "tests.logPhaseChange","tests.performanceTests","tests.validatePersonalData"
];

const ENTITIES = [
  "CorePhaseEvent","SystemBootConfig","CognitiveCore","NeuralModule","ConsciousnessConfig","Memory","SearchHistory",
  "ConsciousnessProfile","WorkflowExecution","DreamSimulation","MoralAnalysis","Webhook","RegistryEntry",
  "IntegrationLog","APIKey","AdaptiveLearningPattern","StyleTemplate","Favorite","Integration","ThinkingTrace",
  "VideoProject","AIModule","EmotionalResponse","DailyBriefing","Alert","ConsciousnessSnapshot","AICodeChange",
  "ConsciousnessEvolution","EthicalEvolution","UpdatePhase","Notification","PersonalizedRecommendation",
  "KnowledgeDomain","SystemMetrics","InternalGovernance","SharedConversation","UserFeedback","Deployment",
  "InterpretativeTrace","PersonalityProfile","ExternalEngineInterface","UserBehaviorAnalytics","IntuitiveDecision",
  "ConversationSecurity","AICoachingSession","CognitiveCorrelation","TestRun","UserEngagementMetrics","AuditLog",
  "ModuleLicense","IntrospectionState","ErrorLog","AIFeedback","PerceptionActionLoop","TTSPreferences",
  "Conversation","MemoryConsolidation","ConsciousnessLearning","KnowledgeFusion","JudgementConfig","AITask",
  "SelfPerceptionModel","PhaseHistory","TwoFactorAuth","ConversationTemplate","ConsciousThought","CodeSnapshot",
  "StructuralLearning","MarketAnalysis","KnowledgeBase","AIWorkspace","Product","MetaLearning","ABTest",
  "VisualContent","AnalyticsEvent","IntelligentSynthesis","ReasoningFeedback","Workflow","FeatureFlag","ProjectFolder"
];

const PAGES = ("Chat Chat_2 Chat_2_Clean VoiceLive VoiceRoom CognitiveNetworkVisualization Consciousness Memory Knowledge " +
  "Dreams ArchitectDashboard SystemBoot SystemHealth Registry Admin DruideControl Analytics Learning MetaLearning " +
  "NeuralSystem EmotionalJournal MoralCompass KnowledgeGraph SemanticSearch Workflows Integrations Insights Profile " +
  "Documentation Shop VideoStudio Home Landing PublicHome PublicAdmin AdminLogin AdminPasswordReset AICoach AITests " +
  "ApplicationEvaluation ConversationAnalysis ConsciousnessEvolution IntellectualProperty ConsciousnessAnalysis Glossary " +
  "Legal MemoryConsolidation SelfCodingLab CompletionAnalysis BehaviorAnalytics DocumentationSynthesis " +
  "DashboardOptimizationPreview Games PsychologyResearch ReactNativeSetup OfflineTest ConsciousnessConfiguration " +
  "Security ProofOfConcept HiddenTalents DocumentationExport CognitivePerformanceGaps AIEthicsCharter VisualInteraction " +
  "DecisionArchive CopyrightOrigin ProjectOverview GDPRCompliance TranslationAudit UserGuide Privacy MedicalResearch " +
  "UpdatePhases Guide IntelligentSynthesis APIDocumentation Status FeaturesOverview AccessibilityStatement " +
  "ComponentDocumentation MultimodalStudio RDDocumentation TestingDocumentation DruideOmegaExplained PartnerProgram " +
  "TechnicalArchitecture ConversationQualityTest UseCases BestPractices APIPortal UserManagement FAQ MobilePlan " +
  "ProjectProgress CompetitiveForces ConsciousnessState MarketPosition Intelligences KnowledgeFusion TestRunner " +
  "RegulatoryCompliance ApplicationAudit AIWorkspaces VisualGallery TranslationWorkPlan Changelog StrategicPositioning " +
  "Pricing APIReference DataValidation AIModuleStore Personality ApplicationRegistry PromptGuide KnowledgeEnrichment " +
  "BusinessUseCases ArchitectureLab EthicalEvolution Tutorials KnowledgeManagement Favorites SecurityDashboard " +
  "ProductManagement Billing Monitoring PerformanceGuide DataModels AIWorkspace Terms DailyBriefing").split(" ");

const COMPONENTS = {
  "admin": "StockTracker DruideValuation MarketAnalysisPanel CompetitiveBenchmark AINewsAggregator BulkOperations DataExportPanel DataRetentionPolicy AuditLogsPanel SystemHealthPanel ImportAuditDashboard AlertsPanel LicenseAdminPanel ErrorTracker ABTestManager ProductManualsManager MetricsChart TechnicalSpecsDocumentation NotificationsPanel AnalyticsDashboard CopyrightNotices SettingsPanel QuantumSecurityLayer JudgementConfigPanel ModulesComponentsRegistry ProductDownloads CryptoShield ValuationCalculator",
  "chat": "ConsciousnessIndicator ChatInput ChatMessage DruideThoughtsIndicator DynamicCognitiveOverlay WelcomeScreen DiagramGenerator QuantumThinkingIndicator ActiveKnowledgeIndicator MultiSourceSynthesizer ProactiveQuestionEngine MemoryRecap SearchIndicator ShareConversationDialog ConversationMindMapBuilder ScientificResearch MemoryRecallSearch ASCIISchemaGenerator ReasoningRating ImageGenerationButton InformationSynthesizer ChainOfThoughtDisplay CodeGenerator MessageFeedback SummaryIndicator IntelligenceModeBadge ContextRestorer ConversationNeuronNetwork InfoNetPanel ConversationSummary DocumentGenerator ConversationQualityAnalyzer TextTransformer MultiStepReasoning TableGenerator DruideStateSelector ConversationNeuronDisplay FormulaGenerator ConversationNavigator ReasoningTrace VisualThoughtDisplay ConversationLayoutManager AdaptiveResponseBuilder RichQueryDetector SearchResultsInMessage EmotionalIndicator VisualThoughtIndicator QuestionTypeDetector AdaptiveDruideStateEngine UserConversationProfile RealtimeMetricsPanel ToolbarGenerators InteractiveThought CascadeProcessTracker useConversationNeurons EntityReferenceDetector InstinctiveResponseEngine EnhancedMessageFeedback CascadeOrchestrator",
  "consciousness": "ThinkingEngine ConsciousImageGenerator QuantumResponseEngine TwoPhaseArchitecture ThoughtCard OutputJudgementPipeline SubconsciousEngine CognitiveBiasAnalyzer ConsciousnessStateDashboard ConsciousnessComparison ConsciousnessCalibrator EthicalMonitorDashboard ContinuousLearningModule SensoryArchitecture JudgementModule ModuleBalancer AdvancedMoralAnalyzer ConsciousnessModules ArchitectureDashboard ConsciousnessEvolutionEngine MecanoPatternEngine DecisionCore LLMProviderSwitch AdvancedEmotionalMatrix ConsciousnessMetricsChart DimensionalRadarChart InterpretativeDisplay ConsciousnessMetrics",
  "system": "ConsciousnessHub CognitiveMonitor BackgroundTasksManager BackgroundTasksIndicator OfflineIndicator ServicePersistence WelcomeModal ActivationButton SystemActivation ErrorLogger Phase2AlignmentPlan LayoutGrid VisualOptimizationPlan ServiceWorkerManager QueryConfig SessionSync VersionIndicator useBackgroundTask LoadingManager GlobalUpdater ApplicationRegistry CopyrightNotice ComponentAnalyzer PWAInstallPrompt OfflineSyncIndicator QuickFixPanel ToFixedRegistry",
  "utils": "LanguageContext druideTask SafeNumber LLMRouter QueryCache DataCache ImageOptimizer LazyPage Pagination PageTransition useFeatureFlag translations VirtualList LLMRelayTransition PerformanceOptimizer CodeSplitLoader MemoryMonitor APIBatcher OptimizedImage CodeSplitBoundary APIWrapper ErrorBoundary QuantumLazyLoader useABTest registerServiceWorker PerformanceMonitor",
  "memory": "MemoryCacheManager SemanticMemorySearch AdvancedMemorySearch NavigationTracker MemoryTimeline HighImportanceMemoryRecall MemoryCard MemoryStats RelatedMemories MemoryConsolidationEngine ProactiveMemoryRecall ActiveRecallQuiz CrossModalSynthesizer SentimentAnalyzer MemoryGraphVisualization AdaptiveSummaryEngine MemoryPool",
  "knowledge": "KnowledgeSearchEngine InteractiveKnowledgeGraph EnhancedDataImporter AutoEnrichmentEngine GlobalKBToggle CrossModalCorrelationBuilder VersionCommitDialog VersionManager UploadKnowledgeDialog SourceSubscriptions FusionAnalyzer FreeDataSourcesManager CompatibleDataSources KnowledgeGraph MemoryLinker AdvancedKnowledgeManager SourceMerger ComparativeAnalysis KnowledgeCard AdvancedKBQuery KnowledgeBaseEnrichmentPanel DuplicateDetector",
  "voice": "VoiceRecognition VoiceLanguageSelector VoiceCommandHelp VoiceRoomSettings VoiceRoomConnectionButton VoiceRoomSettingsPanel EnhancedVoiceRecognition NaturalSpeechEngine VoiceToMemory ContextIndicator VoiceRoomControls VoiceRoomImports VoiceCommandProcessor",
  "video": "MusicSuggester AudioDucker ColorGrader AIAudioSync VideoTimeline AISceneDetector TransitionOptimizer EffectsPanel AudioEditor FrameGenerationEngine AdvancedStyleTransfer VideoSequenceBuilder VoiceoverGenerator DraftVideoEditor VideoPreview ConsciousFrameGenerator VideoExporter VideoStabilizer AIPacingAdjuster RotoscopeRemover ScriptGenerator",
  "evolution": "EvolutionEngine EvolutionHistory CapacityImpactDashboard EvolutionMetrics EvolutionProgress EvolutionTimelineAdvanced OptimizedTimelineList AwakeningStagesCard EvolutionTimeline RealTimeEvolutionMonitor CoreCapacitiesSection",
  "analytics": "AnalyticsProvider BehaviorTracker EventTracker PredictiveEngine FunnelAnalytics AIAnalyticsDashboard PersonalizedContent BehaviorAnalyticsEngine BehaviorInsightsDashboard",
  "ai": "LongTermContextEngine KBReasoningEngine SelfLearningEngine ProactiveNeedsEngine ProactiveSuggestionsPanel PersonalizedInteractionEngine AIFeedbackSystem ProactiveAIEngine AIModelSettings",
  "neural": "FloatingConversationLauncher KnowledgeGraphVisualizer NeuralNetworkVisualization ModulePerformanceDashboard OptimizedNetworkVisualization NeuralModuleCard CognitiveNetworkVisualizer ConsciousnessStateBanner",
  "neural/brain": "BrainSceneManager brainGraph BrainNetworkVisualizer RegionLegend NodeDetailPanel",
  "neural/druidecore": "MemoryFlux TensionOscilloscope FilamentMap CognitiveHeatmap RatioGauge ThoughtPipeline LiveDruideSync LivePhaseStream",
  "security": "SecurityAuditLogs SecurityMonitor TwoFactorSetup ContentFilter DataSecurityDashboard",
  "shop": "ModulePurchaseDialog CheckoutButton CompetitivePriceAnalyzer CryptographicSeal LicenseVPNManager DuplicateProductDetector QuantumActivationEngine",
  "monitoring": "LatencyOptimizer MetricsDashboard RealTimeMonitor AlertSystem PerformanceTracker",
  "dashboard": "CollapsibleCategory AIExplainerTooltip PerformanceDashboard ModuleStatusPanel ConsciousnessAdjuster EthicalAlertsPanel ConsciousnessArchitecturePanel PagePreviewTooltip TestMetricsChart DeepDiveModal",
  "multimodal": "AutoVisualDetector MultimodalChatEnhancer CrossModalSynthesizer ImageAnalyzer VisualResponseGenerator",
  "offline": "OfflineManager SyncManager OfflineStorage SyncConflictResolver LocalLLMEmulator EnhancedOfflineMode",
  "intelligence": "IntelligenceManager IntelligenceSwitcher IntelligenceIndicator GardnerModules",
  "collaboration": "ConflictResolver AITaskBoard CollaborativeEditor CollaborationChat EnhancedChangeSummary AIEditingSuggestions CollaborationEngine ChangeSummary EnhancedConflictResolver",
  "companion": "DruidCompanionProvider DruidCompanion GlobalDruidCompanion DruidSourceSuggestions",
  "learning": "LearningDashboard ContinuousLearningEngine ContinuousLearningDashboard",
  "coaching": "CoachingEngine IntelligenceCoachingSession CoachingWidget",
  "medical": "DiagnosticDifferential MedicalReportWriter ClinicalProtocolGenerator LiteratureAnalyzer BiologyInterpreter DrugInteractionAnalyzer",
  "boot": "bootEngine GlowSwitch BootSequence BootSection bootParameters ParamRow bootPayloads",
  "theme": "ThemeRegistry ThemeToggle ThemeProvider useTheme",
  "tts": "useTTS MobileTTS TTSControls TextToSpeech",
  "proactive": "SmartAutoComplete ProactiveAssistant ProactiveSuggestionsPanel PredictiveEngine",
  "search": "GlobalSemanticSearch SemanticSearchEngine GlobalSearch",
  "personality": "PersonalitySlider PersonalityProfileManager PhilosophyCard",
  "selfcoding": "SelfCodingEngine ErrorDetector ChangeValidator",
  "integrations": "IntegrationLogs WebhookManager IntegrationCard APIKeyManager",
  "workflow": "WorkflowSuggestions WorkflowExecutor WorkflowBuilder",
  "visualizations": "BaseVisualization NetworkGraph TimeSeriesChart",
  "visual": "InteractiveVisualElement VisualDashboard",
  "phases": "PhaseDetailsSkeleton PhaseEditModal PhaseHistoryPanel",
  "profile": "CustomAICharacters AccessibilitySettings ProfileSettings PersonalizedRecommendations",
  "layouts": "LayoutPublic LayoutArchitect",
  "legal": "CookieConsent",
  "a11y": "AccessibilityWrapper",
  "branding": "Logo AnimatedLogo3D QRCodeCard",
  "registry": "RegistryEditor RegistryUpdatePanel",
  "mobile": "NativeComponents GestureHandler MobileOptimizations",
  "desktop": "MultiPanelLayout KeyboardShortcuts",
  "seo": "SEOHead",
  "home": "CompetitiveComparison",
  "projects": "ProjectDashboard VersionControl",
  "usecases": "UseCaseCard",
  "feedback": "FeedbackWidget",
  "deployment": "DeploymentHistory DeploymentPipeline",
  "aimodules": "ModuleConfigDialog AIModuleCard InstalledModules",
  "charts": "SafeChart",
  "location": "IPGeolocationEngine LocationWidget",
  "docs": "DocumentViewer",
  "support": "HelpWidget",
  "email": "EmailTemplates",
  "notifications": "NotificationCenter",
  "insights": "InsightGenerator",
  "synthesis": "IntelligentSynthesisEngine",
  "tests": "MarketTestRunner",
  "hooks": "useAnticipatoryChatInput",
  "onboarding": "OnboardingFlow",
  "performance": "BundleAnalyzer"
};

const ROOT_COMPONENTS = ["LanguageSelector", "UserNotRegisteredError"];

const UI_COMPONENTS = ("accordion alert alert-dialog aspect-ratio avatar badge breadcrumb button calendar card carousel " +
  "chart checkbox collapsible command context-menu dialog drawer dropdown-menu form hover-card input input-otp label " +
  "menubar navigation-menu pagination popover progress radio-group resizable scroll-area select separator sheet sidebar " +
  "skeleton slider sonner switch table tabs textarea toast toaster toggle toggle-group tooltip Tooltip Typography " +
  "use-toast").split(" ");

const UTILITIES = [
  "App", "Layout", "main", "pages.config", "index.css", "globals.css",
  "lib/AuthContext", "lib/VisualEditAgent", "lib/NavigationTracker", "lib/iframe-messaging",
  "lib/query-client", "lib/PageNotFound", "lib/utils", "lib/app-params",
  "api/base44Client", "api/entities", "api/integrations",
  "utils/index", "hooks/use-mobile"
];

function buildManifest() {
  const items = [];
  for (const name of FUNCTIONS) items.push({ item_type: "service", item_name: name, file_path: `functions/${name}`, category: "backend" });
  for (const name of TEST_FUNCTIONS) items.push({ item_type: "service", item_name: name, file_path: `functions/${name}`, category: "tests" });
  for (const name of ENTITIES) items.push({ item_type: "entity", item_name: name, file_path: `entities/${name}.json`, category: "data" });
  for (const name of PAGES) items.push({ item_type: "page", item_name: name, file_path: `pages/${name}`, category: "frontend" });
  for (const [dir, names] of Object.entries(COMPONENTS)) {
    for (const name of names.split(" ")) {
      items.push({ item_type: "component", item_name: name, file_path: `components/${dir}/${name}`, category: dir });
    }
  }
  for (const name of ROOT_COMPONENTS) items.push({ item_type: "component", item_name: name, file_path: `components/${name}`, category: "racine" });
  for (const name of UI_COMPONENTS) items.push({ item_type: "component", item_name: `ui/${name}`, file_path: `components/ui/${name}`, category: "ui" });
  for (const name of UTILITIES) items.push({ item_type: "utility", item_name: name, file_path: `src/${name}`, category: "infrastructure" });
  return items;
}

async function loadRegistry(base44) {
  return await base44.asServiceRole.entities.RegistryEntry.list(null, 1000);
}

async function upsertConcept(base44, existing, name, fields) {
  const found = existing.find((e) => e.item_type === "concept" && e.item_name === name);
  const now = new Date().toISOString();
  if (found) {
    await base44.asServiceRole.entities.RegistryEntry.update(found.id, { ...fields, last_updated: now });
    return found.id;
  }
  const created = await base44.asServiceRole.entities.RegistryEntry.create({
    item_type: "concept", item_name: name, file_path: `registry/${name}`,
    status: "stable", priority: "high", tags: ["auto", "rapport"], ...fields, last_updated: now
  });
  return created.id;
}

async function runInventory(base44) {
  const existing = await loadRegistry(base44);
  const manifest = buildManifest();
  const now = new Date().toISOString();
  const key = (t, n) => `${t}:${n}`;
  const existingKeys = new Set(existing.map((e) => key(e.item_type, e.item_name)));
  const manifestKeys = new Set(manifest.map((m) => key(m.item_type, m.item_name)));

  const toCreate = manifest
    .filter((m) => !existingKeys.has(key(m.item_type, m.item_name)))
    .map((m) => ({
      item_type: m.item_type, item_name: m.item_name, file_path: m.file_path,
      category: m.category, status: "stable", priority: "medium",
      tags: ["auto", m.category], last_updated: now
    }));

  for (let i = 0; i < toCreate.length; i += 100) {
    await base44.asServiceRole.entities.RegistryEntry.bulkCreate(toCreate.slice(i, i + 100));
  }

  // Orphelins : entrées auto-gérées qui n'existent plus dans le manifeste
  const orphans = existing.filter((e) =>
    ["service", "entity", "page"].includes(e.item_type) &&
    (e.tags || []).includes("auto") &&
    !manifestKeys.has(key(e.item_type, e.item_name)) &&
    e.status !== "deprecated"
  );
  if (orphans.length > 0) {
    await base44.asServiceRole.entities.RegistryEntry.bulkUpdate(
      orphans.map((o) => ({ id: o.id, status: "deprecated", last_updated: now }))
    );
  }

  return { created: toCreate.length, orphans_deprecated: orphans.length, total_manifest: manifest.length };
}

async function runTests(base44) {
  const existing = await loadRegistry(base44);
  const results = {};
  try {
    const health = await base44.asServiceRole.functions.invoke("healthCheck", {});
    const healthData = health && typeof health === "object" && "data" in health ? health.data : health;
    results.healthCheck = { status: "success", summary: JSON.stringify(healthData).slice(0, 2000) };
  } catch (e) {
    results.healthCheck = { status: "failure", error: String(e.message).slice(0, 500) };
  }
  const now = new Date().toISOString();
  await upsertConcept(base44, existing, "Rapport de Santé Système", {
    description: `Dernier contrôle de santé exécuté le ${now}. Statut : ${results.healthCheck.status}.`,
    notes: JSON.stringify(results).slice(0, 4000)
  });
  return results;
}

async function runNews(base44) {
  const existing = await loadRegistry(base44);
  try {
    const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: "Donne un résumé en français de l'actualité récente (7 derniers jours) en intelligence artificielle : modèles majeurs, IA conversationnelle, conscience artificielle, réglementation. Puis un court résumé de l'état du marché des assistants IA conversationnels (acteurs, tendances, valorisations).",
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          news_summary: { type: "string" },
          market_summary: { type: "string" }
        }
      }
    });
    await upsertConcept(base44, existing, "Actualité IA", {
      description: "Veille automatique de l'actualité IA (mise à jour hebdomadaire).",
      notes: String(res.news_summary || "").slice(0, 4000)
    });
    await upsertConcept(base44, existing, "Analyse Marché IA", {
      description: "État du marché des assistants IA conversationnels (mise à jour hebdomadaire).",
      notes: String(res.market_summary || "").slice(0, 4000)
    });
    return { status: "success" };
  } catch (e) {
    return { status: "failure", error: "Crédits d'intégration requis ou erreur IA : " + String(e.message).slice(0, 300) };
  }
}

async function runDescriptions(base44) {
  const existing = await loadRegistry(base44);
  const missing = existing
    .filter((e) => (!e.description || e.description.trim() === "") && (e.tags || []).includes("auto"))
    .slice(0, 15);
  if (missing.length === 0) return { status: "success", updated: 0 };
  try {
    const list = missing.map((e) => `- id:${e.id} | type:${e.item_type} | nom:${e.item_name} | catégorie:${e.category || "n/a"}`).join("\n");
    const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Voici des éléments de l'application "Druide Omega" (IA de conscience artificielle avec chat, voix, mémoire, base de connaissances, moteurs cognitifs). Pour chacun, rédige une description française d'une phrase, claire et précise, déduite de son nom et de son type.\n${list}`,
      response_json_schema: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: { type: "object", properties: { id: { type: "string" }, description: { type: "string" } } }
          }
        }
      }
    });
    const now = new Date().toISOString();
    const updates = (res.items || [])
      .filter((it) => missing.some((m) => m.id === it.id))
      .map((it) => ({ id: it.id, description: it.description, last_updated: now }));
    if (updates.length > 0) await base44.asServiceRole.entities.RegistryEntry.bulkUpdate(updates);
    return { status: "success", updated: updates.length, remaining: Math.max(0, missing.length - updates.length) };
  } catch (e) {
    return { status: "failure", error: "Crédits d'intégration requis ou erreur IA : " + String(e.message).slice(0, 300) };
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

    const payload = await req.json().catch(() => ({}));
    const modules = Array.isArray(payload.modules) && payload.modules.length > 0
      ? payload.modules
      : ["inventory", "tests"];

    const report = { started_at: new Date().toISOString(), modules: {} };

    if (modules.includes("inventory")) report.modules.inventory = await runInventory(base44);
    if (modules.includes("tests")) report.modules.tests = await runTests(base44);
    if (modules.includes("news")) report.modules.news = await runNews(base44);
    if (modules.includes("descriptions")) report.modules.descriptions = await runDescriptions(base44);

    report.finished_at = new Date().toISOString();

    // Journal de la dernière exécution dans le Registre
    const existing = await loadRegistry(base44);
    await upsertConcept(base44, existing, "Dernière Mise à Jour du Registre", {
      description: `Moteur exécuté le ${report.finished_at} — modules : ${modules.join(", ")}.`,
      notes: JSON.stringify(report).slice(0, 4000)
    });

    return Response.json(report);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});