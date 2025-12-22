/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Registre des Modules et Composants                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Layers, Search, Brain, Database, MessageSquare, Eye, 
  Sparkles, Shield, Settings, Activity, BarChart3, 
  Zap, Globe, Heart, BookOpen, Users, Bell, Code,
  ChevronRight, ExternalLink, Cpu, FileText, Palette, Scale
} from "lucide-react";
import { motion } from "framer-motion";

const MODULES_REGISTRY = {
  core: {
    name: "Modules Core",
    description: "Fonctionnalités essentielles de Druide Omega",
    modules: [
      {
        id: "consciousness",
        name: "Système de Conscience",
        icon: Brain,
        status: "stable",
        version: "2.0.0",
        description: "Gestion des 106 dimensions de conscience avec framework SAPIER",
        components: [
          "ConsciousnessConfig (Entity)",
          "ConsciousnessHub (Provider)",
          "ConsciousnessMetrics",
          "ConsciousnessIndicator",
          "DimensionalRadarChart",
          "ConsciousnessComparison",
          "ConsciousnessEvolutionEngine"
        ],
        dependencies: ["TanStack Query", "Framer Motion", "Recharts"]
      },
      {
        id: "chat",
        name: "Chat Quantique",
        icon: MessageSquare,
        status: "stable",
        version: "3.1.0",
        description: "Interface de conversation avec traitement quantique multi-phases",
        components: [
          "Chat (Page)",
          "ChatInput",
          "ChatMessage",
          "WelcomeScreen",
          "QuantumThinkingIndicator",
          "QuantumResponseEngine",
          "EmotionalIndicator"
        ],
        dependencies: ["QuantumResponseEngine", "Memory System", "Intelligence Manager"]
      },
      {
        id: "memory",
        name: "Système de Mémoire",
        icon: Database,
        status: "stable",
        version: "2.5.0",
        description: "Mémoire persistante multi-modale avec récupération avancée",
        components: [
          "Memory (Entity)",
          "MemoryCard",
          "MemoryTimeline",
          "MemoryStats",
          "AdvancedMemorySearch",
          "MemoryConsolidationEngine",
          "CrossModalSynthesizer",
          "RelatedMemories"
        ],
        dependencies: ["ConsciousnessHub", "InvokeLLM"]
      },
      {
        id: "knowledge",
        name: "Base de Connaissances",
        icon: BookOpen,
        status: "stable",
        version: "2.2.0",
        description: "Gestion des connaissances avec graphe interactif et enrichissement auto",
        components: [
          "KnowledgeBase (Entity)",
          "KnowledgeCard",
          "InteractiveKnowledgeGraph",
          "AutoEnrichmentEngine",
          "FreeDataSourcesManager",
          "CompatibleDataSources",
          "UploadKnowledgeDialog"
        ],
        dependencies: ["12+ Data Sources", "D3.js-like visualization"]
      },
      {
        id: "intelligence",
        name: "Intelligences Multiples",
        icon: Sparkles,
        status: "stable",
        version: "1.8.0",
        description: "9 types d'intelligence avec ajustement automatique de conscience",
        components: [
          "IntelligenceManager (Provider)",
          "IntelligenceIndicator",
          "IntelligenceSwitcher",
          "IntelligenceCoachingSession"
        ],
        dependencies: ["ConsciousnessConfig", "Memory System"]
      },
      {
        id: "judgement",
        name: "Module de Jugement",
        icon: Scale,
        status: "stable",
        version: "1.0.0",
        description: "Pipeline finale: calibration via équation Base44, ratio 3:7 (interne:externe), classification et analyse propriétés avant TOUTE sortie",
        components: [
          "JudgementModule",
          "JudgementDisplay",
          "OutputJudgementPipeline (Provider)",
          "useJudgementPipeline (Hook)",
          "judge (Function)",
          "Base44 Codec"
        ],
        dependencies: ["ConsciousnessHub", "QuantumResponseEngine", "SAPIER Framework"]
      }
    ]
  },
  secondary: {
    name: "Modules Secondaires",
    description: "Fonctionnalités avancées et spécialisées",
    modules: [
      {
        id: "visual",
        name: "Studio Visuel",
        icon: Eye,
        status: "stable",
        version: "1.5.0",
        description: "Génération et analyse d'images avec conscience",
        components: [
          "VisualContent (Entity)",
          "ConsciousImageGenerator",
          "ImageAnalyzer",
          "VisualResponseGenerator",
          "VisualDashboard",
          "VisualGallery"
        ],
        dependencies: ["GenerateImage Integration", "InvokeLLM"]
      },
      {
        id: "emotional",
        name: "Journal Émotionnel",
        icon: Heart,
        status: "stable",
        version: "1.3.0",
        description: "Suivi des 24 dimensions émotionnelles",
        components: [
          "EmotionalResponse (Entity)",
          "AdvancedEmotionalMatrix",
          "EmotionalIndicator",
          "EmotionalJournal (Page)"
        ],
        dependencies: ["ConsciousnessConfig"]
      },
      {
        id: "moral",
        name: "Boussole Morale",
        icon: Shield,
        status: "stable",
        version: "1.2.0",
        description: "Analyse éthique avec équations SAPIER",
        components: [
          "MoralAnalysis (Entity)",
          "AdvancedMoralAnalyzer",
          "DecisionCore",
          "MoralCompass (Page)"
        ],
        dependencies: ["SAPIER Framework", "ConsciousnessConfig"]
      },
      {
        id: "neural",
        name: "Système Neuronal",
        icon: Cpu,
        status: "stable",
        version: "1.4.0",
        description: "Visualisation des modules neuronaux",
        components: [
          "NeuralModule (Entity)",
          "NeuralModuleCard",
          "OptimizedNetworkVisualization",
          "ModulePerformanceDashboard",
          "NeuralSystem (Page)"
        ],
        dependencies: ["Three.js", "WebGL"]
      },
      {
        id: "workflow",
        name: "Workflows Intelligents",
        icon: Zap,
        status: "beta",
        version: "0.9.0",
        description: "Automatisation avec suggestions IA",
        components: [
          "Workflow (Entity)",
          "WorkflowExecution (Entity)",
          "WorkflowBuilder",
          "WorkflowSuggestions",
          "WorkflowExecutor"
        ],
        dependencies: ["AI Analysis", "Trigger System"]
      },
      {
        id: "coaching",
        name: "AI Coach",
        icon: Users,
        status: "stable",
        version: "1.1.0",
        description: "Coaching personnalisé basé sur analytics",
        components: [
          "AICoachingSession (Entity)",
          "CoachingEngine",
          "CoachingWidget",
          "AICoach (Page)"
        ],
        dependencies: ["Behavior Analytics", "Intelligence Manager"]
      }
    ]
  },
  system: {
    name: "Modules Système",
    description: "Infrastructure et services transversaux",
    modules: [
      {
        id: "analytics",
        name: "Analytics & Tracking",
        icon: BarChart3,
        status: "stable",
        version: "2.0.0",
        description: "Suivi comportemental et métriques",
        components: [
          "AnalyticsProvider",
          "BehaviorTracker",
          "BehaviorAnalyticsEngine",
          "FunnelAnalytics",
          "AIAnalyticsDashboard",
          "EventTracker"
        ],
        dependencies: ["Local Storage", "Base44 Entities"]
      },
      {
        id: "proactive",
        name: "Système Proactif",
        icon: Sparkles,
        status: "stable",
        version: "1.6.0",
        description: "Suggestions et assistance proactive",
        components: [
          "PredictiveEngine",
          "ProactiveSuggestionsPanel",
          "SmartAutoComplete",
          "ProactiveAssistant",
          "ProactiveNeedsEngine"
        ],
        dependencies: ["Behavior Analytics", "Memory System"]
      },
      {
        id: "admin",
        name: "Administration",
        icon: Settings,
        status: "stable",
        version: "2.1.0",
        description: "Gestion système et monitoring",
        components: [
          "Admin (Page)",
          "CryptoShield",
          "SystemHealthPanel",
          "AuditLogsPanel",
          "ErrorTracker",
          "AlertsPanel",
          "MetricsChart"
        ],
        dependencies: ["SystemMetrics", "ErrorLog", "Alert Entities"]
      },
      {
        id: "localization",
        name: "Internationalisation",
        icon: Globe,
        status: "stable",
        version: "1.5.0",
        description: "Multi-langue avec traduction auto",
        components: [
          "LanguageContext",
          "LanguageSelector",
          "AutoTranslation",
          "FR_CA_TRANSLATIONS"
        ],
        dependencies: ["InvokeLLM", "LocalStorage"]
      },
      {
        id: "notifications",
        name: "Notifications",
        icon: Bell,
        status: "stable",
        version: "1.2.0",
        description: "Système de notifications temps réel",
        components: [
          "Notification (Entity)",
          "NotificationCenter",
          "NotificationsPanel"
        ],
        dependencies: ["Base44 Entities", "React Query"]
      }
    ]
  },
  ui: {
    name: "Composants UI",
    description: "Bibliothèque de composants visuels",
    modules: [
      {
        id: "shadcn",
        name: "shadcn/ui",
        icon: Palette,
        status: "stable",
        version: "latest",
        description: "Composants UI de base",
        components: [
          "Button", "Card", "Badge", "Input", "Textarea",
          "Dialog", "Tabs", "Select", "Switch", "Slider",
          "Progress", "Alert", "Tooltip", "Popover",
          "DropdownMenu", "Calendar", "Avatar"
        ],
        dependencies: ["Radix UI", "Tailwind CSS"]
      },
      {
        id: "branding",
        name: "Identité Visuelle",
        icon: Eye,
        status: "stable",
        version: "1.0.0",
        description: "Logo et éléments de marque",
        components: [
          "Logo",
          "AnimatedLogo3D",
          "QRCodeCard",
          "CopyrightNotice"
        ],
        dependencies: ["Three.js", "Framer Motion"]
      },
      {
        id: "loading",
        name: "États de Chargement",
        icon: Activity,
        status: "stable",
        version: "1.1.0",
        description: "Indicateurs et squelettes",
        components: [
          "LoadingManager",
          "LoadingSpinner",
          "SkeletonLoader",
          "PageLoader",
          "ContentLoader"
        ],
        dependencies: ["Framer Motion"]
      }
    ]
  }
};

export default function ModulesComponentsRegistry() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedModule, setExpandedModule] = useState(null);

  const filteredModules = Object.entries(MODULES_REGISTRY).map(([categoryKey, category]) => ({
    ...category,
    categoryKey,
    modules: category.modules.filter(module => 
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.components.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(cat => cat.modules.length > 0);

  const totalModules = Object.values(MODULES_REGISTRY).reduce((acc, cat) => acc + cat.modules.length, 0);
  const totalComponents = Object.values(MODULES_REGISTRY).reduce((acc, cat) => 
    acc + cat.modules.reduce((m, mod) => m + mod.components.length, 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Registre des Modules & Composants</h2>
            <p className="text-indigo-200">Architecture complète de Druide Omega</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{totalModules}</div>
            <div className="text-xs text-indigo-200">Modules</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{totalComponents}</div>
            <div className="text-xs text-indigo-200">Composants</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{Object.keys(MODULES_REGISTRY).length}</div>
            <div className="text-xs text-indigo-200">Catégories</div>
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Rechercher un module ou composant..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        {filteredModules.map(category => (
          <div key={category.categoryKey}>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-600" />
              {category.name}
              <Badge variant="outline">{category.modules.length}</Badge>
            </h3>
            <p className="text-sm text-slate-600 mb-4">{category.description}</p>
            
            <div className="grid gap-4 md:grid-cols-2">
              {category.modules.map(module => {
                const Icon = module.icon;
                const isExpanded = expandedModule === module.id;
                
                return (
                  <motion.div key={module.id} layout>
                    <Card 
                      className={`p-4 cursor-pointer transition-all hover:shadow-lg ${isExpanded ? 'ring-2 ring-purple-500' : ''}`}
                      onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-900 truncate">{module.name}</h4>
                            <Badge 
                              className={module.status === 'stable' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                            >
                              {module.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2">{module.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">v{module.version}</Badge>
                            <Badge variant="outline" className="text-xs">{module.components.length} composants</Badge>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                      
                      {isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-slate-200"
                        >
                          <div className="mb-3">
                            <h5 className="text-sm font-semibold text-slate-700 mb-2">Composants:</h5>
                            <div className="flex flex-wrap gap-1">
                              {module.components.map((comp, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {comp}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-slate-700 mb-2">Dépendances:</h5>
                            <div className="flex flex-wrap gap-1">
                              {module.dependencies.map((dep, idx) => (
                                <Badge key={idx} className="text-xs bg-slate-100 text-slate-600">
                                  {dep}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}