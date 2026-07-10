/**
 * pages.config.js - Page routing configuration
 *
 * Toutes les pages sont chargées paresseusement (React.lazy) pour alléger
 * le chargement initial, surtout sur mobile. Le Layout reste chargé
 * immédiatement car il enveloppe toutes les pages.
 *
 * THE ONLY EDITABLE VALUE: mainPage
 */
import { lazy } from 'react';
import __Layout from './Layout.jsx';

const AICoach = lazy(() => import('./pages/AICoach'));
const AIEthicsCharter = lazy(() => import('./pages/AIEthicsCharter'));
const AIModuleStore = lazy(() => import('./pages/AIModuleStore'));
const AITests = lazy(() => import('./pages/AITests'));
const AIWorkspace = lazy(() => import('./pages/AIWorkspace'));
const AIWorkspaces = lazy(() => import('./pages/AIWorkspaces'));
const APIDocumentation = lazy(() => import('./pages/APIDocumentation'));
const APIPortal = lazy(() => import('./pages/APIPortal'));
const APIReference = lazy(() => import('./pages/APIReference'));
const AccessibilityStatement = lazy(() => import('./pages/AccessibilityStatement'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Analytics = lazy(() => import('./pages/Analytics'));
const ApplicationAudit = lazy(() => import('./pages/ApplicationAudit'));
const ApplicationEvaluation = lazy(() => import('./pages/ApplicationEvaluation'));
const ApplicationRegistry = lazy(() => import('./pages/ApplicationRegistry'));
const ArchitectDashboard = lazy(() => import('./pages/ArchitectDashboard'));
const ArchitectureLab = lazy(() => import('./pages/ArchitectureLab'));
const BehaviorAnalytics = lazy(() => import('./pages/BehaviorAnalytics'));
const BestPractices = lazy(() => import('./pages/BestPractices'));
const Billing = lazy(() => import('./pages/Billing'));
const BusinessUseCases = lazy(() => import('./pages/BusinessUseCases'));
const Changelog = lazy(() => import('./pages/Changelog'));
const Chat = lazy(() => import('./pages/Chat'));
const chat2 = lazy(() => import('./pages/Chat_2'));
const CognitiveNetworkVisualization = lazy(() => import('./pages/CognitiveNetworkVisualization'));
const CompetitiveForces = lazy(() => import('./pages/CompetitiveForces'));
const CompletionAnalysis = lazy(() => import('./pages/CompletionAnalysis'));
const ComponentDocumentation = lazy(() => import('./pages/ComponentDocumentation'));
const Consciousness = lazy(() => import('./pages/Consciousness'));
const ConsciousnessAnalysis = lazy(() => import('./pages/ConsciousnessAnalysis'));
const ConsciousnessConfiguration = lazy(() => import('./pages/ConsciousnessConfiguration'));
const ConsciousnessEvolution = lazy(() => import('./pages/ConsciousnessEvolution'));
const ConsciousnessState = lazy(() => import('./pages/ConsciousnessState'));
const ConversationAnalysis = lazy(() => import('./pages/ConversationAnalysis'));
const DailyBriefing = lazy(() => import('./pages/DailyBriefing'));
const DataModels = lazy(() => import('./pages/DataModels'));
const DataValidation = lazy(() => import('./pages/DataValidation'));
const DecisionArchive = lazy(() => import('./pages/DecisionArchive'));
const Documentation = lazy(() => import('./pages/Documentation'));
const DocumentationSynthesis = lazy(() => import('./pages/DocumentationSynthesis'));
const Dreams = lazy(() => import('./pages/Dreams'));
const DruideControl = lazy(() => import('./pages/DruideControl'));
const DruideOmegaExplained = lazy(() => import('./pages/DruideOmegaExplained'));
const EmotionalJournal = lazy(() => import('./pages/EmotionalJournal'));
const EthicalEvolution = lazy(() => import('./pages/EthicalEvolution'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Favorites = lazy(() => import('./pages/Favorites'));
const FeaturesOverview = lazy(() => import('./pages/FeaturesOverview'));
const GDPRCompliance = lazy(() => import('./pages/GDPRCompliance'));
const Games = lazy(() => import('./pages/Games'));
const Glossary = lazy(() => import('./pages/Glossary'));
const Guide = lazy(() => import('./pages/Guide'));
const HiddenTalents = lazy(() => import('./pages/HiddenTalents'));
const Home = lazy(() => import('./pages/Home'));
const Insights = lazy(() => import('./pages/Insights'));
const Integrations = lazy(() => import('./pages/Integrations'));
const IntellectualProperty = lazy(() => import('./pages/IntellectualProperty'));
const Intelligences = lazy(() => import('./pages/Intelligences'));
const IntelligentSynthesis = lazy(() => import('./pages/IntelligentSynthesis'));
const Knowledge = lazy(() => import('./pages/Knowledge'));
const KnowledgeEnrichment = lazy(() => import('./pages/KnowledgeEnrichment'));
const KnowledgeFusion = lazy(() => import('./pages/KnowledgeFusion'));
const KnowledgeGraph = lazy(() => import('./pages/KnowledgeGraph'));
const KnowledgeManagement = lazy(() => import('./pages/KnowledgeManagement'));
const Landing = lazy(() => import('./pages/Landing'));
const Learning = lazy(() => import('./pages/Learning'));
const Legal = lazy(() => import('./pages/Legal'));
const MarketPosition = lazy(() => import('./pages/MarketPosition'));
const MedicalResearch = lazy(() => import('./pages/MedicalResearch'));
const Memory = lazy(() => import('./pages/Memory'));
const MemoryConsolidation = lazy(() => import('./pages/MemoryConsolidation'));
const MetaLearning = lazy(() => import('./pages/MetaLearning'));
const MobilePlan = lazy(() => import('./pages/MobilePlan'));
const Monitoring = lazy(() => import('./pages/Monitoring'));
const MoralCompass = lazy(() => import('./pages/MoralCompass'));
const MultimodalStudio = lazy(() => import('./pages/MultimodalStudio'));
const NeuralSystem = lazy(() => import('./pages/NeuralSystem'));
const OfflineTest = lazy(() => import('./pages/OfflineTest'));
const PartnerProgram = lazy(() => import('./pages/PartnerProgram'));
const PerformanceGuide = lazy(() => import('./pages/PerformanceGuide'));
const Personality = lazy(() => import('./pages/Personality'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Privacy = lazy(() => import('./pages/Privacy'));
const ProductManagement = lazy(() => import('./pages/ProductManagement'));
const Profile = lazy(() => import('./pages/Profile'));
const ProjectOverview = lazy(() => import('./pages/ProjectOverview'));
const ProjectProgress = lazy(() => import('./pages/ProjectProgress'));
const PromptGuide = lazy(() => import('./pages/PromptGuide'));
const ProofOfConcept = lazy(() => import('./pages/ProofOfConcept'));
const PsychologyResearch = lazy(() => import('./pages/PsychologyResearch'));
const PublicAdmin = lazy(() => import('./pages/PublicAdmin'));
const PublicHome = lazy(() => import('./pages/PublicHome'));
const RDDocumentation = lazy(() => import('./pages/RDDocumentation'));
const ReactNativeSetup = lazy(() => import('./pages/ReactNativeSetup'));
const Registry = lazy(() => import('./pages/Registry'));
const RegulatoryCompliance = lazy(() => import('./pages/RegulatoryCompliance'));
const Security = lazy(() => import('./pages/Security'));
const SecurityDashboard = lazy(() => import('./pages/SecurityDashboard'));
const SelfCodingLab = lazy(() => import('./pages/SelfCodingLab'));
const SemanticSearch = lazy(() => import('./pages/SemanticSearch'));
const Shop = lazy(() => import('./pages/Shop'));
const Status = lazy(() => import('./pages/Status'));
const StrategicPositioning = lazy(() => import('./pages/StrategicPositioning'));
const SystemHealth = lazy(() => import('./pages/SystemHealth'));
const TechnicalArchitecture = lazy(() => import('./pages/TechnicalArchitecture'));
const Terms = lazy(() => import('./pages/Terms'));
const TestRunner = lazy(() => import('./pages/TestRunner'));
const TestingDocumentation = lazy(() => import('./pages/TestingDocumentation'));
const TranslationAudit = lazy(() => import('./pages/TranslationAudit'));
const TranslationWorkPlan = lazy(() => import('./pages/TranslationWorkPlan'));
const Tutorials = lazy(() => import('./pages/Tutorials'));
const UpdatePhases = lazy(() => import('./pages/UpdatePhases'));
const UseCases = lazy(() => import('./pages/UseCases'));
const UserGuide = lazy(() => import('./pages/UserGuide'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const VideoStudio = lazy(() => import('./pages/VideoStudio'));
const VisualGallery = lazy(() => import('./pages/VisualGallery'));
const VisualInteraction = lazy(() => import('./pages/VisualInteraction'));
const VoiceLive = lazy(() => import('./pages/VoiceLive'));
const VoiceRoom = lazy(() => import('./pages/VoiceRoom'));
const Workflows = lazy(() => import('./pages/Workflows'));


export const PAGES = {
    "AICoach": AICoach,
    "AIEthicsCharter": AIEthicsCharter,
    "AIModuleStore": AIModuleStore,
    "AITests": AITests,
    "AIWorkspace": AIWorkspace,
    "AIWorkspaces": AIWorkspaces,
    "APIDocumentation": APIDocumentation,
    "APIPortal": APIPortal,
    "APIReference": APIReference,
    "AccessibilityStatement": AccessibilityStatement,
    "Admin": Admin,
    "AdminLogin": AdminLogin,
    "Analytics": Analytics,
    "ApplicationAudit": ApplicationAudit,
    "ApplicationEvaluation": ApplicationEvaluation,
    "ApplicationRegistry": ApplicationRegistry,
    "ArchitectDashboard": ArchitectDashboard,
    "ArchitectureLab": ArchitectureLab,
    "BehaviorAnalytics": BehaviorAnalytics,
    "BestPractices": BestPractices,
    "Billing": Billing,
    "BusinessUseCases": BusinessUseCases,
    "Changelog": Changelog,
    "Chat": Chat,
    "Chat_2": chat2,
    "CognitiveNetworkVisualization": CognitiveNetworkVisualization,
    "CompetitiveForces": CompetitiveForces,
    "CompletionAnalysis": CompletionAnalysis,
    "ComponentDocumentation": ComponentDocumentation,
    "Consciousness": Consciousness,
    "ConsciousnessAnalysis": ConsciousnessAnalysis,
    "ConsciousnessConfiguration": ConsciousnessConfiguration,
    "ConsciousnessEvolution": ConsciousnessEvolution,
    "ConsciousnessState": ConsciousnessState,
    "ConversationAnalysis": ConversationAnalysis,
    "DailyBriefing": DailyBriefing,
    "DataModels": DataModels,
    "DataValidation": DataValidation,
    "DecisionArchive": DecisionArchive,
    "Documentation": Documentation,
    "DocumentationSynthesis": DocumentationSynthesis,
    "Dreams": Dreams,
    "DruideControl": DruideControl,
    "DruideOmegaExplained": DruideOmegaExplained,
    "EmotionalJournal": EmotionalJournal,
    "EthicalEvolution": EthicalEvolution,
    "FAQ": FAQ,
    "Favorites": Favorites,
    "FeaturesOverview": FeaturesOverview,
    "GDPRCompliance": GDPRCompliance,
    "Games": Games,
    "Glossary": Glossary,
    "Guide": Guide,
    "HiddenTalents": HiddenTalents,
    "Home": Home,
    "Insights": Insights,
    "Integrations": Integrations,
    "IntellectualProperty": IntellectualProperty,
    "Intelligences": Intelligences,
    "IntelligentSynthesis": IntelligentSynthesis,
    "Knowledge": Knowledge,
    "KnowledgeEnrichment": KnowledgeEnrichment,
    "KnowledgeFusion": KnowledgeFusion,
    "KnowledgeGraph": KnowledgeGraph,
    "KnowledgeManagement": KnowledgeManagement,
    "Landing": Landing,
    "Learning": Learning,
    "Legal": Legal,
    "MarketPosition": MarketPosition,
    "MedicalResearch": MedicalResearch,
    "Memory": Memory,
    "MemoryConsolidation": MemoryConsolidation,
    "MetaLearning": MetaLearning,
    "MobilePlan": MobilePlan,
    "Monitoring": Monitoring,
    "MoralCompass": MoralCompass,
    "MultimodalStudio": MultimodalStudio,
    "NeuralSystem": NeuralSystem,
    "OfflineTest": OfflineTest,
    "PartnerProgram": PartnerProgram,
    "PerformanceGuide": PerformanceGuide,
    "Personality": Personality,
    "Pricing": Pricing,
    "Privacy": Privacy,
    "ProductManagement": ProductManagement,
    "Profile": Profile,
    "ProjectOverview": ProjectOverview,
    "ProjectProgress": ProjectProgress,
    "PromptGuide": PromptGuide,
    "ProofOfConcept": ProofOfConcept,
    "PsychologyResearch": PsychologyResearch,
    "PublicAdmin": PublicAdmin,
    "PublicHome": PublicHome,
    "RDDocumentation": RDDocumentation,
    "ReactNativeSetup": ReactNativeSetup,
    "Registry": Registry,
    "RegulatoryCompliance": RegulatoryCompliance,
    "Security": Security,
    "SecurityDashboard": SecurityDashboard,
    "SelfCodingLab": SelfCodingLab,
    "SemanticSearch": SemanticSearch,
    "Shop": Shop,
    "Status": Status,
    "StrategicPositioning": StrategicPositioning,
    "SystemHealth": SystemHealth,
    "TechnicalArchitecture": TechnicalArchitecture,
    "Terms": Terms,
    "TestRunner": TestRunner,
    "TestingDocumentation": TestingDocumentation,
    "TranslationAudit": TranslationAudit,
    "TranslationWorkPlan": TranslationWorkPlan,
    "Tutorials": Tutorials,
    "UpdatePhases": UpdatePhases,
    "UseCases": UseCases,
    "UserGuide": UserGuide,
    "UserManagement": UserManagement,
    "VideoStudio": VideoStudio,
    "VisualGallery": VisualGallery,
    "VisualInteraction": VisualInteraction,
    "VoiceLive": VoiceLive,
    "VoiceRoom": VoiceRoom,
    "Workflows": Workflows,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};