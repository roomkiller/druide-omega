/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Registre central de navigation                              ║
 * ║ Source unique de vérité pour toutes les métadonnées de navigation.         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * Trois listes (identifiants = clés de pagesConfig.PAGES) :
 *
 * - PUBLIC_PAGES       : accessibles sans authentification. Le ConfidentialPageGuard
 *                        court-circuite ces pages (jamais bloquées).
 * - CONFIDENTIAL_PAGES : réservées aux administrateurs / session architecte.
 *                        Le guard affiche un écran « Accès restreint » pour les autres.
 * - ARCHITECT_PAGES    : affichées avec le LayoutArchitect (sidebar admin orange).
 *
 * Toute page absente de ces listes est publique par défaut : rendue via LayoutPublic,
 * non bloquée par le guard.
 */

export const PUBLIC_PAGES = [
  'PublicHome', 'Home', 'Landing',
  'Documentation', 'HiddenTalents', 'UserGuide',
  'FeaturesOverview', 'PromptGuide',
];

export const CONFIDENTIAL_PAGES = [
  // Documentation technique et architecture
  'TechnicalArchitecture', 'DruideOmegaExplained', 'RDDocumentation',
  'DocumentationSynthesis', 'ComponentDocumentation', 'TestingDocumentation',
  'DataModels', 'APIDocumentation', 'APIReference', 'APIPortal',
  'ArchitectureLab', 'ProofOfConcept',
  // Orchestration et systèmes cognitifs internes
  'NeuralSystem', 'ConsciousnessConfiguration',
  'ConsciousnessAnalysis', 'Consciousness', 'ConsciousnessState', 'ConsciousnessEvolution',
  'UpdatePhases', 'MetaLearning', 'KnowledgeFusion', 'SelfCodingLab', 'Glossary', 'Changelog',
  // Registre et audit
  'Registry', 'ApplicationRegistry', 'ApplicationAudit', 'ApplicationEvaluation',
  // Stratégie et valorisation
  'LegalIPReport', 'StrategicPositioning', 'MarketPosition', 'CompetitiveForces',
  'ProjectOverview', 'ProjectProgress',
  // Administration et contrôle
  'Admin', 'PublicAdmin', 'UserManagement', 'SystemHealth', 'SystemBoot',
  'DruideControl', 'ArchitectDashboard', 'AITests',
  // Monitoring, tests et qualité internes
  'Monitoring', 'Security', 'SecurityDashboard', 'TestRunner',
  'DataValidation', 'MemoryConsolidation',
  // Analyses et données internes
  'Analytics', 'BehaviorAnalytics', 'CompletionAnalysis',
  'DecisionArchive', 'EthicalEvolution', 'SecureVault',
  // Propriété intellectuelle et plans internes
  'IntellectualProperty', 'TranslationAudit', 'TranslationWorkPlan',
  'MobilePlan', 'ReactNativeSetup', 'ProductManagement',
  'PerformanceGuide', 'BestPractices',
];

export const ARCHITECT_PAGES = [
  'ArchitectDashboard', 'DruideControl', 'SystemHealth',
  'Consciousness', 'Admin', 'SystemBoot',
  'ApplicationEvaluation', 'UserManagement', 'PublicAdmin', 'AITests',
];

// Sets pré-computés (lowercase) pour une recherche O(1) insensible à la casse.
export const PUBLIC_PAGES_SET = new Set(PUBLIC_PAGES.map((p) => p.toLowerCase()));
export const CONFIDENTIAL_PAGES_SET = new Set(CONFIDENTIAL_PAGES.map((p) => p.toLowerCase()));
export const ARCHITECT_PAGES_SET = new Set(ARCHITECT_PAGES.map((p) => p.toLowerCase()));