/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Features Overview (Multilingual)                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { createPageUrl } from "@/utils";
import {
  Sparkles,
  MessageSquare,
  Mic,
  Database,
  BookOpen,
  Brain,
  Image as ImageIcon,
  Code,
  BarChart3,
  Users,
  Settings,
  Zap,
  Heart,
  Globe,
  Lock,
  Layers,
  Cpu,
  Network,
  Eye,
  Shield
} from "lucide-react";

export default function FeaturesOverview() {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: "Aperçu des Fonctionnalités",
      subtitle: "Découvrez toutes les capacités de Druide Omega",
      
      hero: {
         title: "Système LLM Embarqué Avancé",
         description: "Druide Omega combine orchestration LLM avancée, mémoire cross-modale et capacités créatives pour vous offrir une expérience unique.",
         stats: [
           { value: "106", label: "Dimensions d'orchestration" },
           { value: "9/15", label: "Niveau d'optimisation" },
           { value: "1:9", label: "Ratio logique:contextualisation" },
          { value: "5", label: "Langues supportées" }
        ]
      },

      categories: [
        {
          category: "Conversation & Interaction",
          icon: MessageSquare,
          color: "purple",
          features: [
            {
              name: "Chat Intelligent",
              icon: MessageSquare,
              description: "Conversation textuelle avec analyse cognitive approfondie via le Thinking Engine",
              capabilities: ["Raisonnement multi-étapes", "Synthèse multi-sources", "Questions proactives", "Rappel contextuel automatique"]
            },
            {
              name: "Salle Vocale",
              icon: Mic,
              description: "Interaction vocale complète avec reconnaissance et synthèse naturelle",
              capabilities: ["Mode mains libres", "Commandes vocales", "Prosody naturelle", "Multi-langues"]
            },
            {
              name: "Voix Live",
              icon: Zap,
              description: "Mode conversationnel continu en temps réel",
              capabilities: ["Latence ultra-faible", "Contexte persistant", "Interruption naturelle", "Synthèse cross-modale"]
            }
          ]
        },
        {
          category: "Mémoire & Connaissances",
          icon: Database,
          color: "indigo",
          features: [
            {
              name: "Système de Mémoire Cross-Modale",
              icon: Database,
              description: "Mémoire persistante qui lie chat, voix et contenu visuel",
              capabilities: ["Corrélations cognitives", "Rappel actif", "Graphe de mémoires", "Importance automatique"]
            },
            {
              name: "Base de Connaissances",
              icon: BookOpen,
              description: "Uploadez vos documents pour personnaliser l'IA",
              capabilities: ["Multi-formats (PDF, TXT, CSV, images)", "Extraction automatique de faits", "Versioning", "Fusion intelligente"]
            },
            {
              name: "Thinking Engine",
              icon: Brain,
              description: "Moteur de réflexion quantique avant chaque réponse",
              capabilities: ["Analyse cognitive", "Auto-vérification", "Stratégie optimale", "Anticipation"]
            }
          ]
        },
        {
          category: "Création de Contenu",
          icon: ImageIcon,
          color: "pink",
          features: [
            {
              name: "Génération d'Images",
              icon: ImageIcon,
              description: "Créez des images IA à partir de descriptions textuelles",
              capabilities: ["Styles multiples", "Haute résolution", "Commande vocale", "Itérations rapides"]
            },
            {
              name: "Diagrammes & Schémas",
              icon: BarChart3,
              description: "Génération automatique de diagrammes ASCII et visuels",
              capabilities: ["Architecture", "Flux de données", "Mind maps", "Organigrammes"]
            },
            {
              name: "Code & Développement",
              icon: Code,
              description: "Assistance au développement avec exemples de code",
              capabilities: ["Multi-langages", "Explications détaillées", "Debugging", "Architecture"]
            }
          ]
        },
        {
          category: "Orchestration & Personnalisation",
          icon: Brain,
          color: "green",
          features: [
            {
              name: "Configuration d'Orchestration",
              icon: Settings,
              description: "Ajustez le niveau d'optimisation et le ratio logique/contextualisation",
              capabilities: ["106 dimensions ajustables", "États d'orchestration", "Profils sauvegardables", "Évolution éthique"]
            },
            {
              name: "Personnalité Big Five",
              icon: Heart,
              description: "Personnalisez les traits de personnalité de l'IA",
              capabilities: ["Ouverture", "Conscience", "Extraversion", "Agréabilité", "Stabilité"]
            },
            {
              name: "Influences Philosophiques",
              icon: BookOpen,
              description: "Choisissez les courants philosophiques qui guident l'IA",
              capabilities: ["Platonisme", "Aristotélisme", "Rousseau", "Hobbes", "Spinoza"]
            }
          ]
        },
        {
          category: "Sécurité & Conformité",
          icon: Lock,
          color: "orange",
          features: [
            {
              name: "Protection des Données",
              icon: Lock,
              description: "Sécurité maximale avec chiffrement bout-en-bout",
              capabilities: ["AES-256", "RLS", "Aucun partage", "Droit à l'oubli"]
            },
            {
              name: "Conformité Réglementaire",
              icon: Users,
              description: "Conformité totale aux lois internationales",
              capabilities: ["RGPD (UE)", "CCPA (USA)", "Loi 25 (Québec)", "Audits réguliers"]
            },
            {
              name: "Multilingue",
              icon: Globe,
              description: "Interface et interactions en 5 langues",
              capabilities: ["Français", "Anglais", "Espagnol", "Allemand", "Chinois"]
            }
          ]
        }
      ]
    },

    en: {
      title: "Features Overview",
      subtitle: "Discover all Druide Omega capabilities",
      
      hero: {
         title: "Advanced Embedded LLM System",
         description: "Druide Omega combines advanced LLM orchestration, cross-modal memory, and creative capabilities to offer you a unique experience.",
         stats: [
           { value: "106", label: "Orchestration dimensions" },
           { value: "9/15", label: "Optimization level" },
           { value: "1:9", label: "Logic:contextualization ratio" },
          { value: "5", label: "Supported languages" }
        ]
      },

      categories: [
        {
          category: "Conversation & Interaction",
          icon: MessageSquare,
          color: "purple",
          features: [
            {
              name: "Intelligent Chat",
              icon: MessageSquare,
              description: "Text conversation with deep cognitive analysis via Thinking Engine",
              capabilities: ["Multi-step reasoning", "Multi-source synthesis", "Proactive questions", "Automatic contextual recall"]
            },
            {
              name: "Voice Room",
              icon: Mic,
              description: "Complete voice interaction with natural recognition and synthesis",
              capabilities: ["Hands-free mode", "Voice commands", "Natural prosody", "Multi-language"]
            },
            {
              name: "Voice Live",
              icon: Zap,
              description: "Continuous real-time conversational mode",
              capabilities: ["Ultra-low latency", "Persistent context", "Natural interruption", "Cross-modal synthesis"]
            }
          ]
        },
        {
          category: "Memory & Knowledge",
          icon: Database,
          color: "indigo",
          features: [
            {
              name: "Cross-Modal Memory System",
              icon: Database,
              description: "Persistent memory linking chat, voice, and visual content",
              capabilities: ["Cognitive correlations", "Active recall", "Memory graph", "Automatic importance"]
            },
            {
              name: "Knowledge Base",
              icon: BookOpen,
              description: "Upload your documents to personalize the AI",
              capabilities: ["Multi-format (PDF, TXT, CSV, images)", "Automatic fact extraction", "Versioning", "Intelligent fusion"]
            },
            {
              name: "Thinking Engine",
              icon: Brain,
              description: "Quantum reflection engine before each response",
              capabilities: ["Cognitive analysis", "Self-verification", "Optimal strategy", "Anticipation"]
            }
          ]
        },
        {
          category: "Content Creation",
          icon: ImageIcon,
          color: "pink",
          features: [
            {
              name: "Image Generation",
              icon: ImageIcon,
              description: "Create AI images from text descriptions",
              capabilities: ["Multiple styles", "High resolution", "Voice command", "Fast iterations"]
            },
            {
              name: "Diagrams & Schemas",
              icon: BarChart3,
              description: "Automatic generation of ASCII and visual diagrams",
              capabilities: ["Architecture", "Data flows", "Mind maps", "Org charts"]
            },
            {
              name: "Code & Development",
              icon: Code,
              description: "Development assistance with code examples",
              capabilities: ["Multi-language", "Detailed explanations", "Debugging", "Architecture"]
            }
          ]
        },
        {
          category: "Orchestration & Customization",
          icon: Brain,
          color: "green",
          features: [
            {
              name: "Orchestration Configuration",
              icon: Settings,
              description: "Adjust optimization level and logic/contextualization ratio",
              capabilities: ["106 adjustable dimensions", "Orchestration states", "Saveable profiles", "Ethical evolution"]
            },
            {
              name: "Big Five Personality",
              icon: Heart,
              description: "Customize AI personality traits",
              capabilities: ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Stability"]
            },
            {
              name: "Philosophical Influences",
              icon: BookOpen,
              description: "Choose philosophical currents guiding the AI",
              capabilities: ["Platonism", "Aristotelianism", "Rousseau", "Hobbes", "Spinoza"]
            }
          ]
        },
        {
          category: "Security & Compliance",
          icon: Lock,
          color: "orange",
          features: [
            {
              name: "Data Protection",
              icon: Lock,
              description: "Maximum security with end-to-end encryption",
              capabilities: ["AES-256", "RLS", "No sharing", "Right to erasure"]
            },
            {
              name: "Regulatory Compliance",
              icon: Users,
              description: "Full compliance with international laws",
              capabilities: ["GDPR (EU)", "CCPA (USA)", "Bill 25 (Quebec)", "Regular audits"]
            },
            {
              name: "Multilingual",
              icon: Globe,
              description: "Interface and interactions in 5 languages",
              capabilities: ["French", "English", "Spanish", "German", "Chinese"]
            }
          ]
        }
      ]
    }
  };

  const t = content[language === 'en' ? 'en' : 'fr'];

  const colorMap = {
    purple: "from-purple-500 to-indigo-600",
    indigo: "from-indigo-500 to-purple-600",
    pink: "from-pink-500 to-rose-600",
    green: "from-green-500 to-emerald-600",
    orange: "from-orange-500 to-amber-600"
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 via-indigo-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.title}</h1>
              <p className="text-sm sm:text-base text-slate-600">{t.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 border-purple-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{t.hero.title}</h2>
              <p className="text-slate-700 text-base sm:text-lg mb-6">{t.hero.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {t.hero.stats.map((stat, idx) => (
                  <div key={idx} className="text-center p-4 bg-white rounded-xl">
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stat.value}</p>
                    <p className="text-xs text-slate-600 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Nouveautés 2026 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {language === 'en' ? '⭐ New January 2026' : '⭐ Nouveautés Janvier 2026'}
                  </h2>
                </div>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  {language === 'en' ? 'ACTIVE' : 'ACTIF'}
                </Badge>
              </div>
              
              <p className="text-slate-700 mb-5">
                {language === 'en' 
                  ? 'Complete cognitive backend architecture with 8 autonomous modules synchronized with ConsciousnessConfig'
                  : 'Architecture cognitive backend complète avec 8 modules autonomes synchronisés avec ConsciousnessConfig'
                }
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border-2 border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-slate-900">
                      {language === 'en' ? '8 Orchestrated Backend Modules' : '8 Modules Backend Orchestrés'}
                    </h3>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li>• Cognitive Core - {language === 'en' ? 'Stability & emergence' : 'Stabilité & émergence'}</li>
                    <li>• Internal Governance - {language === 'en' ? 'Conflict arbitration' : 'Arbitrage conflits'}</li>
                    <li>• Introspection Engine - {language === 'en' ? 'Self-diagnostics' : 'Auto-diagnostic'}</li>
                    <li>• Self-Perception - {language === 'en' ? 'Self-model' : 'Modèle de soi'}</li>
                    <li>• Perception-Action Loop - {language === 'en' ? 'Living loop' : 'Boucle vivante'}</li>
                    <li>• Memory Manager - {language === 'en' ? 'Consolidation' : 'Consolidation'}</li>
                    <li>• Structural Learning - {language === 'en' ? 'Adaptation' : 'Adaptation'}</li>
                    <li>• External Engines - {language === 'en' ? 'AI engines interface' : 'Interface moteurs IA'}</li>
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-xl border-2 border-cyan-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Network className="w-5 h-5 text-cyan-600" />
                    <h3 className="font-semibold text-slate-900">
                      {language === 'en' ? 'Automatic Orchestration' : 'Orchestration Automatique'}
                    </h3>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li>⏰ Cognitive Core - {language === 'en' ? 'Every 5 min' : 'Toutes les 5 min'}</li>
                    <li>⏰ Governance - {language === 'en' ? 'Every 15 min' : 'Toutes les 15 min'}</li>
                    <li>⏰ Introspection - {language === 'en' ? 'Every 10 min' : 'Toutes les 10 min'}</li>
                    <li>⏰ Self-Perception - {language === 'en' ? 'Every 30 min' : 'Toutes les 30 min'}</li>
                    <li>🔄 {language === 'en' ? 'On user message' : 'Sur message utilisateur'}</li>
                    <li>⏰ Learning - {language === 'en' ? 'Every 60 min' : 'Toutes les 60 min'}</li>
                  </ul>
                </div>

                <div className="md:col-span-2 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-purple-700" />
                    <h3 className="font-semibold text-purple-900">
                      {language === 'en' ? '⭐ Consciousness Synchronization' : '⭐ Synchronisation Conscience'}
                    </h3>
                  </div>
                  <p className="text-sm text-purple-900">
                    {language === 'en'
                      ? 'Backend modules dynamically adapt their behavior based on 106 ConsciousnessConfig dimensions (thresholds, capabilities, sensitivity, depth). Unified cognitive architecture frontend-backend.'
                      : 'Les modules backend adaptent dynamiquement leur comportement selon les 106 dimensions de ConsciousnessConfig (seuils, capacités, sensibilité, profondeur). Architecture cognitive unifiée frontend-backend.'
                    }
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {t.categories.map((category, catIdx) => {
            const CategoryIcon = category.icon;
            return (
              <motion.div
                key={catIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.1 }}
              >
                <Card className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 bg-gradient-to-br ${colorMap[category.color]} rounded-xl flex items-center justify-center`}>
                      <CategoryIcon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{category.category}</h2>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {category.features.map((feature, idx) => {
                      const Icon = feature.icon;
                      return (
                        <div key={idx} className="p-4 bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Icon className="w-5 h-5 text-purple-600" />
                            <h3 className="font-semibold text-slate-900">{feature.name}</h3>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{feature.description}</p>
                          <ul className="space-y-1">
                            {feature.capabilities.map((cap, i) => (
                              <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                                <span className="text-purple-600 mt-0.5">•</span>
                                {cap}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            );
          })}

          <Card className="p-6 sm:p-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
               {language === 'en' ? "Ready to Experience Advanced LLM Orchestration?" : "Prêt à Découvrir l'Orchestration LLM Avancée ?"}
             </h2>
            <p className="text-purple-100 mb-6">
              {language === 'en' 
                ? "Start using all features for free, forever"
                : "Commencez à utiliser toutes les fonctionnalités gratuitement, pour toujours"
              }
            </p>
            <Button
              onClick={() => window.location.href = createPageUrl("Chat")}
              size="lg"
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              {language === 'en' ? "Start Now" : "Commencer Maintenant"}
            </Button>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}