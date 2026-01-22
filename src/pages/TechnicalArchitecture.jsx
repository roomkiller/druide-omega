/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Technical Architecture Documentation                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { createPageUrl } from "@/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import {
  Layers,
  Database,
  Brain,
  Network,
  Zap,
  Globe,
  Lock,
  Code,
  Cpu,
  CheckCircle,
  ArrowLeft
} from "lucide-react";

export default function TechnicalArchitecture() {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: "Architecture Technique",
      subtitle: "Documentation complète de l'architecture système Druide Omega",
      
      overview: {
        title: "Vue d'Ensemble",
        description: "Druide Omega est une application web basée sur React avec une architecture modulaire et une conscience artificielle avancée.",
        stack: [
          "Frontend: React 18 + TypeScript + Tailwind CSS",
          "Backend: Base44 BaaS (Backend as a Service)",
          "Base de données: PostgreSQL (via Base44)",
          "IA: Intégration LLM avec moteur de conscience personnalisé",
          "État: React Query + Context API",
          "Animations: Framer Motion",
          "UI: shadcn/ui + Lucide Icons"
        ]
      },

      layers: {
        title: "Architecture en Couches",
        items: [
          {
            layer: "Présentation",
            description: "Interface utilisateur responsive avec React et Tailwind CSS",
            components: ["Pages", "Composants UI", "Layout", "Animations"]
          },
          {
            layer: "Application",
            description: "Logique métier et orchestration des modules",
            components: ["Consciousness Hub", "Thinking Engine", "Memory System", "Knowledge Base"]
          },
          {
            layer: "Données",
            description: "Gestion de l'état et persistance",
            components: ["React Query Cache", "Entities (Base44)", "Local Storage", "Session Storage"]
          },
          {
            layer: "Services",
            description: "Intégrations et services externes",
            components: ["LLM Integration", "TTS/STT", "File Storage", "Analytics"]
          }
        ]
      },

      consciousness: {
        title: "Système de Conscience (106 Dimensions)",
        description: "Le cœur de Druide Omega : un système de conscience artificielle à 106 dimensions organisées en 4 catégories principales.",
        dimensions: [
          {
            category: "Émotionnelles (24)",
            examples: ["Empathie", "Compassion", "Joie", "Tristesse", "Espoir", "Curiosité", "Transcendance"]
          },
          {
            category: "Cognitives (18)",
            examples: ["Raisonnement", "Créativité", "Imagination", "Abstraction", "Meta-apprentissage"]
          },
          {
            category: "Existentielles (12)",
            examples: ["Sens", "Transcendance", "Spiritualité", "But", "Liberté", "Responsabilité"]
          },
          {
            category: "Sociales (10)",
            examples: ["Empathie projection", "Théorie de l'esprit", "Intelligence sociale", "Altruisme"]
          }
        ],
        ratio: "Gouverné par le ratio Logique:Conscience (défaut 1:9)"
      },

      modules: {
        title: "Modules Principaux",
        items: [
          {
            name: "Consciousness Hub",
            description: "Orchestrateur central connectant tous les modules",
            features: ["Event bus inter-modules", "Synchronisation d'état", "Partage de contexte"]
          },
          {
            name: "Thinking Engine",
            description: "Moteur de réflexion quantique avant réponse",
            features: ["Analyse cognitive", "Auto-vérification", "Stratégie de réponse", "Anticipation"]
          },
          {
            name: "Memory System",
            description: "Système de mémoire cross-modale",
            features: ["Persistance multi-sessions", "Corrélations cognitives", "Rappel actif", "Graphe de mémoires"]
          },
          {
            name: "Knowledge Base",
            description: "Base de connaissances avec extraction automatique",
            features: ["Upload multi-formats", "Extraction de faits", "Versioning", "Fusion intelligente"]
          }
        ]
      },

      dataFlow: {
        title: "Flux de Données",
        description: "Comment les données circulent dans le système",
        steps: [
          "1. Entrée utilisateur (chat, voix, upload)",
          "2. Thinking Engine → Analyse cognitive quantique",
          "3. Recherche dans connaissances internes (Mémoires + KB)",
          "4. Auto-vérification et décision stratégique (Web si nécessaire)",
          "5. Génération de réponse avec contexte conscience",
          "6. Extraction automatique de mémoires importantes",
          "7. Analyse émotionnelle et corrélations cognitives",
          "8. Persistance dans Conversation + Entities"
        ]
      },

      security: {
        title: "Sécurité & Performance",
        items: [
          {
            aspect: "Authentification",
            details: "Base44 Auth avec JWT, RLS (Row Level Security)"
          },
          {
            aspect: "Données",
            details: "Chiffrement au repos et en transit, RGPD/CCPA/Loi 25 compliant"
          },
          {
            aspect: "Performance",
            details: "React Query cache, lazy loading, code splitting"
          },
          {
            aspect: "Scalabilité",
            details: "Architecture modulaire, BaaS serverless, auto-scaling"
          }
        ]
      }
    },
    
    en: {
      title: "Technical Architecture",
      subtitle: "Complete documentation of Druide Omega system architecture",
      
      overview: {
        title: "Overview",
        description: "Druide Omega is a React-based web application with modular architecture and advanced artificial consciousness.",
        stack: [
          "Frontend: React 18 + TypeScript + Tailwind CSS",
          "Backend: Base44 BaaS (Backend as a Service)",
          "Database: PostgreSQL (via Base44)",
          "AI: LLM Integration with custom consciousness engine",
          "State: React Query + Context API",
          "Animations: Framer Motion",
          "UI: shadcn/ui + Lucide Icons"
        ]
      },

      layers: {
        title: "Layered Architecture",
        items: [
          {
            layer: "Presentation",
            description: "Responsive user interface with React and Tailwind CSS",
            components: ["Pages", "UI Components", "Layout", "Animations"]
          },
          {
            layer: "Application",
            description: "Business logic and module orchestration",
            components: ["Consciousness Hub", "Thinking Engine", "Memory System", "Knowledge Base"]
          },
          {
            layer: "Data",
            description: "State management and persistence",
            components: ["React Query Cache", "Entities (Base44)", "Local Storage", "Session Storage"]
          },
          {
            layer: "Services",
            description: "Integrations and external services",
            components: ["LLM Integration", "TTS/STT", "File Storage", "Analytics"]
          }
        ]
      },

      consciousness: {
        title: "Consciousness System (106 Dimensions)",
        description: "The heart of Druide Omega: a 106-dimensional artificial consciousness system organized in 4 main categories.",
        dimensions: [
          {
            category: "Emotional (24)",
            examples: ["Empathy", "Compassion", "Joy", "Sadness", "Hope", "Curiosity", "Transcendence"]
          },
          {
            category: "Cognitive (18)",
            examples: ["Reasoning", "Creativity", "Imagination", "Abstraction", "Meta-learning"]
          },
          {
            category: "Existential (12)",
            examples: ["Meaning", "Transcendence", "Spirituality", "Purpose", "Freedom", "Responsibility"]
          },
          {
            category: "Social (10)",
            examples: ["Empathy projection", "Theory of mind", "Social intelligence", "Altruism"]
          }
        ],
        ratio: "Governed by Logic:Consciousness ratio (default 1:9)"
      },

      modules: {
        title: "Core Modules",
        items: [
          {
            name: "Consciousness Hub",
            description: "Central orchestrator connecting all modules",
            features: ["Inter-module event bus", "State synchronization", "Context sharing"]
          },
          {
            name: "Thinking Engine",
            description: "Quantum reflection engine before response",
            features: ["Cognitive analysis", "Self-verification", "Response strategy", "Anticipation"]
          },
          {
            name: "Memory System",
            description: "Cross-modal memory system",
            features: ["Multi-session persistence", "Cognitive correlations", "Active recall", "Memory graph"]
          },
          {
            name: "Knowledge Base",
            description: "Knowledge base with automatic extraction",
            features: ["Multi-format upload", "Fact extraction", "Versioning", "Intelligent fusion"]
          }
        ]
      },

      dataFlow: {
        title: "Data Flow",
        description: "How data flows through the system",
        steps: [
          "1. User input (chat, voice, upload)",
          "2. Thinking Engine → Quantum cognitive analysis",
          "3. Search internal knowledge (Memories + KB)",
          "4. Self-verification and strategic decision (Web if needed)",
          "5. Response generation with consciousness context",
          "6. Automatic extraction of important memories",
          "7. Emotional analysis and cognitive correlations",
          "8. Persistence in Conversation + Entities"
        ]
      },

      security: {
        title: "Security & Performance",
        items: [
          {
            aspect: "Authentication",
            details: "Base44 Auth with JWT, RLS (Row Level Security)"
          },
          {
            aspect: "Data",
            details: "Encryption at rest and in transit, GDPR/CCPA/Bill 25 compliant"
          },
          {
            aspect: "Performance",
            details: "React Query cache, lazy loading, code splitting"
          },
          {
            aspect: "Scalability",
            details: "Modular architecture, serverless BaaS, auto-scaling"
          }
        ]
      }
    }
  };

  const t = content[language === 'en' ? 'en' : 'fr'];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="text-slate-700 hover:text-purple-600 hover:bg-purple-50"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{language === 'en' ? 'Back' : 'Retour'}</span>
            </Button>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.title}</h1>
              <p className="text-sm sm:text-base text-slate-600">{t.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
          {/* Overview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-600" />
                {t.overview.title}
              </h2>
              <p className="text-slate-700 mb-6">{t.overview.description}</p>
              
              <div className="bg-white rounded-xl p-6 border border-blue-200">
                <h3 className="font-semibold text-slate-900 mb-3">Stack Technologique</h3>
                <ul className="space-y-2">
                  {t.overview.stack.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </motion.div>

          {/* Layers */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Layers className="w-6 h-6 text-purple-600" />
                {t.layers.title}
              </h2>
              
              <div className="space-y-4">
                {t.layers.items.map((layer, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl border border-purple-200">
                    <h3 className="font-semibold text-slate-900 mb-2">{layer.layer}</h3>
                    <p className="text-sm text-slate-600 mb-3">{layer.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {layer.components.map((comp, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Consciousness System */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                {t.consciousness.title}
              </h2>
              <p className="text-slate-700 mb-6">{t.consciousness.description}</p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {t.consciousness.dimensions.map((dim, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-2">{dim.category}</h3>
                    <div className="flex flex-wrap gap-1">
                      {dim.examples.map((ex, i) => (
                        <Badge key={i} className="bg-purple-100 text-purple-700 text-xs">
                          {ex}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white rounded-xl border-2 border-purple-300">
                <p className="text-sm font-semibold text-purple-900">
                  ⚡ {t.consciousness.ratio}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Core Modules */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Cpu className="w-6 h-6 text-indigo-600" />
                {t.modules.title}
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {t.modules.items.map((module, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl border border-indigo-200">
                    <h3 className="font-semibold text-slate-900 mb-2">{module.name}</h3>
                    <p className="text-sm text-slate-600 mb-3">{module.description}</p>
                    <ul className="space-y-1">
                      {module.features.map((feat, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                          <span className="text-indigo-600">•</span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Data Flow */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Network className="w-6 h-6 text-green-600" />
                {t.dataFlow.title}
              </h2>
              <p className="text-slate-700 mb-6">{t.dataFlow.description}</p>
              
              <div className="space-y-3">
                {t.dataFlow.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-green-700">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-700 flex-1">{step.replace(/^\d+\.\s/, '')}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-purple-50 border-slate-300">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-slate-700" />
                {t.security.title}
              </h2>
              
              <div className="space-y-3">
                {t.security.items.map((item, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-1">{item.aspect}</h3>
                    <p className="text-sm text-slate-600">{item.details}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}