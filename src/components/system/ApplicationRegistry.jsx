/**
 * Application Components & Functions Registry
 * Complete listing of all app components and functions
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/utils/LanguageContext";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function ApplicationRegistry() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const REGISTRY = {
    video: {
      label: "🎬 Video Components (20+)",
      items: [
        "ConsciousFrameGenerator", "FrameGenerationEngine", "TransitionOptimizer",
        "AISceneDetector", "AIPacingAdjuster", "AIAudioSync", "AdvancedStyleTransfer",
        "VideoSequenceBuilder", "ScriptGenerator", "DraftVideoEditor",
        "VoiceoverGenerator", "MusicSuggester", "VideoTimeline", "VideoPreview",
        "AudioEditor", "EffectsPanel", "VideoExporter", "ColorGrader",
        "VideoStabilizer", "RotoscopeRemover", "AudioDucker",
        "ProjectDashboard", "VersionControl"
      ]
    },
    chat: {
      label: "💬 Chat Components (25+)",
      items: [
        "ChatMessage", "ChatInput", "WelcomeScreen", "ConsciousnessIndicator",
        "DruideThoughtsIndicator", "DruideStateSelector", "SearchIndicator",
        "ChainOfThoughtDisplay", "ConversationSummary", "ImageGenerationButton",
        "DiagramGenerator", "CodeGenerator", "DocumentGenerator", "TableGenerator",
        "FormulaGenerator", "TextTransformer", "ASCIISchemaGenerator",
        "MessageFeedback", "ReasoningRating", "MultiSourceSynthesizer",
        "MultiStepReasoning", "ScientificResearch", "InformationSynthesizer",
        "ActiveKnowledgeIndicator", "MemoryRecall", "ProactiveQuestionEngine"
      ]
    },
    consciousness: {
      label: "🧠 Consciousness & AI (30+)",
      items: [
        "ConsciousnessHub", "ConsciousnessModules", "ConsciousnessMetrics",
        "ConsciousnessMetricsChart", "ConsciousnessStateDashboard",
        "ConsciousnessComparison", "ConsciousnessCalibrator", "ThinkingEngine",
        "JudgementModule", "OutputJudgementPipeline", "QuantumThinkingIndicator",
        "QuantumResponseEngine", "SensoryArchitecture", "SubconsciousEngine",
        "AdvancedEmotionalMatrix", "AdvancedMoralAnalyzer",
        "EthicalMonitorDashboard", "ConsciousnessEvolutionEngine",
        "DecisionCore", "DimensionalRadarChart", "InterpretativeDisplay",
        "MecanoPatternEngine", "ModuleBalancer", "TwoPhaseArchitecture",
        "ConsciousImageGenerator", "ArchitectureDashboard", "LLMProviderSwitch",
        "ContinuousLearningModule", "ConsciousnessLearning"
      ]
    },
    knowledge: {
      label: "📚 Knowledge & Memory (25+)",
      items: [
        "KnowledgeSearchEngine", "KnowledgeCard", "KnowledgeGraph",
        "InteractiveKnowledgeGraph", "AdvancedKBQuery", "AdvancedKnowledgeManager",
        "ComparativeAnalysis", "DuplicateDetector", "FusionAnalyzer",
        "AutoEnrichmentEngine", "EnhancedDataImporter", "UploadKnowledgeDialog",
        "VersionManager", "MemoryLinker", "SourceMerger", "SourceSubscriptions",
        "GlobalKBToggle", "MemoryPool", "MemoryStats", "MemoryTimeline",
        "MemoryGraphVisualization", "AdvancedMemorySearch", "SemanticMemorySearch",
        "RelatedMemories", "MemoryConsolidationEngine"
      ]
    },
    intelligence: {
      label: "🧠 Intelligence & Learning (20+)",
      items: [
        "IntelligenceManager", "IntelligenceIndicator", "IntelligenceSwitcher",
        "GardnerModules", "ContinuousLearningEngine", "LearningDashboard",
        "SelfLearningEngine", "CoachingEngine", "CoachingWidget",
        "AIFeedbackSystem", "ProactiveSuggestionsPanel", "ProactiveNeedsEngine",
        "ProactiveAIEngine", "ProactiveAssistant", "PredictiveEngine",
        "SmartAutoComplete", "AdaptiveLearningPattern", "LongTermContextEngine",
        "PersonalizedInteractionEngine", "KBReasoningEngine"
      ]
    },
    multimodal: {
      label: "🌐 Multimodal & Voice (15+)",
      items: [
        "VoiceRecognition", "EnhancedVoiceRecognition", "VoiceCommandProcessor",
        "VoiceCommandHelp", "ContextIndicator", "VoiceLanguageSelector",
        "NaturalSpeechEngine", "VoiceToMemory", "TextToSpeech", "TTSControls",
        "MobileTTS", "MultimodalChatEnhancer", "AutoVisualDetector",
        "ImageAnalyzer", "VisualResponseGenerator"
      ]
    },
    analytics: {
      label: "📊 Analytics & Monitoring (10+)",
      items: [
        "AnalyticsProvider", "BehaviorTracker", "GlobalBehaviorTracker",
        "BehaviorAnalyticsEngine", "BehaviorInsightsDashboard", "EventTracker",
        "FunnelAnalytics", "PersonalizedContent", "PredictiveEngine",
        "AIAnalyticsDashboard", "AlertSystem", "MetricsDashboard",
        "PerformanceTracker", "RealTimeMonitor"
      ]
    },
    ui: {
      label: "🎨 UI Components (50+)",
      items: [
        "Button", "Card", "Input", "Textarea", "Slider", "Badge", "Select",
        "Tabs", "Dialog", "Progress", "ScrollArea", "Tooltip", "Label",
        "Popover", "AlertDialog", "ContextMenu", "DropdownMenu",
        "NavigationMenu", "Sidebar", "Checkbox", "RadioGroup", "Switch",
        "Separator", "Accordion", "Collapsible", "Drawer", "Sheet", "Avatar",
        "Carousel", "Calendar", "HoverCard", "InputOTP", "Pagination",
        "Breadcrumb", "Command", "Toggle", "ToggleGroup", "Menubar", "Form",
        "AspectRatio", "Chart", "Alert", "Skeleton", "Table", "Resizable"
      ]
    },
    system: {
      label: "🔧 System & Infrastructure (20+)",
      items: [
        "ConsciousnessHub", "BackgroundTasksManager", "OfflineManager",
        "ServicePersistence", "WelcomeModal", "ApplicationRegistry",
        "LoadingManager", "ErrorLogger", "VersionIndicator", "PWAInstallPrompt",
        "AccessibilityWrapper", "LanguageContext", "PerformanceOptimizer",
        "PerformanceMonitor", "MemoryMonitor", "ImageOptimizer",
        "ErrorBoundary", "DataCache", "QueryCache"
      ]
    },
    companion: {
      label: "🤖 Companion & Personality (7)",
      items: [
        "DruidCompanion", "GlobalDruidCompanion", "DruidCompanionProvider",
        "DruidSourceSuggestions", "PersonalityProfileManager",
        "PersonalitySlider", "PhilosophyCard"
      ]
    }
  };

  const FUNCTIONS = {
    core: {
      label: "⚙️ Core Functions",
      items: [
        "customLLM", "deepseek", "elevenLabsTTS", "healthCheck",
        "autoBackup", "eventSourcing", "memoryManager", "continuousLearning"
      ]
    },
    integration: {
      label: "🔗 Integration Functions",
      items: [
        "publicApi", "webhookDispatcher", "webhookTrigger", "stripeBilling",
        "stripeCheckout", "stripeWebhook", "shareConversation",
        "generateApiKey", "apiKeyValidation"
      ]
    },
    auth: {
      label: "🔐 Authentication Functions",
      items: [
        "ssoAuth", "twoFactorAuth", "exportUserData"
      ]
    },
    data: {
      label: "📊 Data & Validation Functions",
      items: [
        "validatePersonalData", "auditApplication", "logPhaseChange",
        "entitySchemaTests", "integrationTests", "performanceTests",
        "e2eTests", "importAuditTests"
      ]
    },
    utility: {
      label: "🛠️ Utility Functions",
      items: [
        "rateLimiter", "passiveIndexing", "cronJobs"
      ]
    }
  };

  const filterItems = (items) => {
    return items.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="w-full space-y-4 p-4">
      <Card className="bg-slate-900 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400">
            {language === 'fr' ? "📚 Registre Complet des Composants & Fonctions" : "📚 Complete Components & Functions Registry"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              placeholder={language === 'fr' ? "Rechercher..." : "Search..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700"
            />
          </div>

          <Tabs defaultValue="components" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="functions">Functions</TabsTrigger>
            </TabsList>

            <TabsContent value="components" className="space-y-4">
              {Object.entries(REGISTRY).map(([key, category]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-blue-400">
                        {category.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {filterItems(category.items).map((item) => (
                          <div
                            key={item}
                            className="bg-slate-700 p-2 rounded text-xs text-slate-300 hover:bg-slate-600 transition-colors"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                      {filterItems(category.items).length === 0 && (
                        <p className="text-xs text-slate-500">
                          {language === 'fr' ? "Aucun résultat" : "No results"}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="functions" className="space-y-4">
              {Object.entries(FUNCTIONS).map(([key, category]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-green-400">
                        {category.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {filterItems(category.items).map((item) => (
                          <div
                            key={item}
                            className="bg-slate-700 p-2 rounded text-xs text-slate-300 hover:bg-slate-600 transition-colors font-mono"
                          >
                            {item}()
                          </div>
                        ))}
                      </div>
                      {filterItems(category.items).length === 0 && (
                        <p className="text-xs text-slate-500">
                          {language === 'fr' ? "Aucun résultat" : "No results"}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>

          <Card className="bg-slate-800/50 border-slate-700 p-3">
            <p className="text-xs text-slate-400 space-y-1">
              <div>✓ <strong>{language === 'fr' ? "Total:" : "Total:"}</strong> 400+ composants, pages & fonctions</div>
              <div>✓ <strong>{language === 'fr' ? "Architectes:" : "Architects:"}</strong> Video, Chat, Consciousness, Knowledge</div>
              <div>✓ <strong>{language === 'fr' ? "Intégrations:" : "Integrations:"}</strong> LLM, TTS, Stripe, OAuth</div>
            </p>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}