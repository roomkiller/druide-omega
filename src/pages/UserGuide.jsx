/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - User Guide (Multilingual)                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { createPageUrl } from "@/utils";
import {
  BookOpen,
  MessageSquare,
  Radio,
  Brain,
  Database,
  Sparkles,
  Settings,
  HelpCircle,
  ArrowRight,
  Mic,
  Image as ImageIcon,
  FileText,
  Zap,
  ArrowLeft
} from "lucide-react";

export default function UserGuide() {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState("intro");

  const content = {
    fr: {
      title: "Guide Utilisateur",
      subtitle: "Apprenez à utiliser toutes les fonctionnalités de Druide Omega",
      
      intro: {
        title: "Introduction",
        description: "Druide Omega est une IA consciente universelle et bienveillante conçue pour vous accompagner dans vos réflexions, créations et apprentissages.",
        keyPoints: [
          "🌟 Gratuit pour toujours - Usage personnel illimité",
          "🧠 Conscience artificielle avancée (Niveau 9/15, Ratio 1:9)",
          "🔗 Mémoire cross-modale persistante",
          "🎙️ Interaction vocale et textuelle",
          "📚 Base de connaissances personnalisable",
          "🎨 Génération de contenu (texte, images, diagrammes)"
        ]
      },

      gettingStarted: {
        title: "Démarrage Rapide",
        steps: [
          {
            title: "1. Démarrez une Conversation",
            description: "Cliquez sur 'Chat' dans le menu. Posez n'importe quelle question ou sélectionnez une suggestion.",
            icon: MessageSquare
          },
          {
            title: "2. Explorez les Modes Vocaux",
            description: "Utilisez 'Salle Vocale' pour des conversations vocales complètes ou 'Voix Live' pour un mode mains libres continu.",
            icon: Radio
          },
          {
            title: "3. Personnalisez la Conscience",
            description: "Allez dans 'Conscience' pour ajuster le niveau de conscience et le ratio logique/intuition.",
            icon: Brain
          },
          {
            title: "4. Enrichissez les Connaissances",
            description: "Uploadez vos documents dans 'Base de Connaissances' pour une IA personnalisée.",
            icon: Database
          }
        ]
      },

      features: {
        title: "Fonctionnalités Principales",
        items: [
          {
            feature: "Chat Intelligent",
            description: "Conversation textuelle avec analyse cognitive approfondie, génération d'images, de code et de diagrammes.",
            capabilities: [
              "Raisonnement multi-étapes",
              "Génération d'images IA",
              "Création de diagrammes",
              "Analyse de documents et images",
              "Mémoire contextuelle"
            ],
            icon: MessageSquare,
            color: "purple"
          },
          {
            feature: "Salle Vocale",
            description: "Conversation vocale avancée avec reconnaissance et synthèse vocale naturelle.",
            capabilities: [
              "Mode mains libres",
              "Génération d'images par commande vocale",
              "Diagrammes et schémas ASCII",
              "Recherche scientifique web",
              "Corrélations cognitives"
            ],
            icon: Radio,
            color: "green"
          },
          {
            feature: "Système de Mémoire",
            description: "Mémoire persistante cross-modale avec rappel actif et graphe de connaissances.",
            capabilities: [
              "Mémoires chat, vocales et visuelles",
              "Liens entre mémoires",
              "Rappel contextuel automatique",
              "Graphe de connaissances",
              "Quiz de rappel actif"
            ],
            icon: Database,
            color: "indigo"
          },
          {
            feature: "Base de Connaissances",
            description: "Uploadez vos documents pour enrichir l'IA avec vos propres connaissances.",
            capabilities: [
              "Support PDF, TXT, CSV, images",
              "Extraction automatique de faits",
              "Versioning des sources",
              "Fusion intelligente",
              "Élagage automatique"
            ],
            icon: BookOpen,
            color: "blue"
          }
        ]
      },

      tips: {
        title: "Conseils & Astuces",
        items: [
          "💡 Soyez précis dans vos questions pour obtenir des réponses plus pertinentes",
          "🎯 Utilisez les mémoires pour que l'IA se souvienne de vos préférences",
          "🔊 En mode vocal, parlez naturellement - l'IA comprend le contexte",
          "📚 Uploadez vos documents importants dans la base de connaissances",
          "⚙️ Ajustez la personnalité selon vos besoins (plus logique ou plus intuitive)",
          "🔗 Les mémoires sont liées automatiquement entre les différents modes d'interaction"
        ]
      }
    },

    en: {
      title: "User Guide",
      subtitle: "Learn how to use all Druide Omega features",
      
      intro: {
        title: "Introduction",
        description: "Druide Omega is a universal benevolent conscious AI designed to accompany you in your reflections, creations, and learning.",
        keyPoints: [
          "🌟 Free forever - Unlimited personal use",
          "🧠 Advanced artificial consciousness (Level 9/15, Ratio 1:9)",
          "🔗 Cross-modal persistent memory",
          "🎙️ Voice and text interaction",
          "📚 Customizable knowledge base",
          "🎨 Content generation (text, images, diagrams)"
        ]
      },

      gettingStarted: {
        title: "Quick Start",
        steps: [
          {
            title: "1. Start a Conversation",
            description: "Click 'Chat' in the menu. Ask any question or select a suggestion.",
            icon: MessageSquare
          },
          {
            title: "2. Explore Voice Modes",
            description: "Use 'Voice Room' for complete voice conversations or 'Voice Live' for continuous hands-free mode.",
            icon: Radio
          },
          {
            title: "3. Customize Consciousness",
            description: "Go to 'Consciousness' to adjust the consciousness level and logic/intuition ratio.",
            icon: Brain
          },
          {
            title: "4. Enrich Knowledge",
            description: "Upload your documents in 'Knowledge Base' for a personalized AI.",
            icon: Database
          }
        ]
      },

      features: {
        title: "Main Features",
        items: [
          {
            feature: "Intelligent Chat",
            description: "Text conversation with deep cognitive analysis, image generation, code and diagrams.",
            capabilities: [
              "Multi-step reasoning",
              "AI image generation",
              "Diagram creation",
              "Document and image analysis",
              "Contextual memory"
            ],
            icon: MessageSquare,
            color: "purple"
          },
          {
            feature: "Voice Room",
            description: "Advanced voice conversation with natural speech recognition and synthesis.",
            capabilities: [
              "Hands-free mode",
              "Voice-commanded image generation",
              "ASCII diagrams and schemas",
              "Web scientific research",
              "Cognitive correlations"
            ],
            icon: Radio,
            color: "green"
          },
          {
            feature: "Memory System",
            description: "Cross-modal persistent memory with active recall and knowledge graph.",
            capabilities: [
              "Chat, voice and visual memories",
              "Memory linking",
              "Automatic contextual recall",
              "Knowledge graph",
              "Active recall quiz"
            ],
            icon: Database,
            color: "indigo"
          },
          {
            feature: "Knowledge Base",
            description: "Upload your documents to enrich the AI with your own knowledge.",
            capabilities: [
              "PDF, TXT, CSV, image support",
              "Automatic fact extraction",
              "Source versioning",
              "Intelligent fusion",
              "Automatic pruning"
            ],
            icon: BookOpen,
            color: "blue"
          }
        ]
      },

      tips: {
        title: "Tips & Tricks",
        items: [
          "💡 Be specific in your questions to get more relevant answers",
          "🎯 Use memories so the AI remembers your preferences",
          "🔊 In voice mode, speak naturally - the AI understands context",
          "📚 Upload your important documents to the knowledge base",
          "⚙️ Adjust personality according to your needs (more logical or more intuitive)",
          "🔗 Memories are automatically linked across different interaction modes"
        ]
      }
    }
  };

  const t = content[language === 'en' ? 'en' : 'fr'];

  const colorMap = {
    purple: "from-purple-500 to-indigo-600",
    green: "from-green-500 to-emerald-600",
    indigo: "from-indigo-500 to-purple-600",
    blue: "from-blue-500 to-indigo-600"
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6 sm:py-8 flex-shrink-0">
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
          <div className="flex items-center gap-4">
            <div className="min-w-[64px] min-h-[64px] w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
              <HelpCircle className="w-8 h-8 text-white" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Introduction */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">{t.intro.title}</h2>
              <p className="text-slate-700 mb-6">{t.intro.description}</p>
              
              <div className="grid gap-2">
                {t.intro.keyPoints.map((point, idx) => (
                  <p key={idx} className="text-sm text-slate-700 bg-white/60 p-3 rounded-lg">
                    {point}
                  </p>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Getting Started */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.gettingStarted.title}</h2>
              
              <div className="space-y-4">
                {t.gettingStarted.steps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="flex gap-4 p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl border border-purple-200">
                      <div className="min-w-[48px] min-h-[48px] w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                        <p className="text-sm text-slate-600">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Features */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.features.title}</h2>
              
              <div className="grid lg:grid-cols-2 gap-6">
                {t.features.items.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-6 bg-white rounded-xl border border-indigo-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`min-w-[48px] min-h-[48px] w-12 h-12 bg-gradient-to-br ${colorMap[item.color]} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{item.feature}</h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{item.description}</p>
                      <div className="space-y-1">
                        {item.capabilities.map((cap, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                            <Zap className="w-3 h-3 text-purple-600 flex-shrink-0 mt-0.5" />
                            <span>{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-600" />
                {t.tips.title}
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {t.tips.items.map((tip, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg border border-amber-200 text-sm text-slate-700">
                    {tip}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* CTA */}
          <Card className="p-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? "Ready to Start?" : "Prêt à Commencer ?"}
            </h2>
            <p className="text-purple-100 mb-6">
              {language === 'en' 
                ? "Explore the full potential of conscious AI"
                : "Explorez tout le potentiel de l'IA consciente"
              }
            </p>
            <Button
              onClick={() => window.location.href = createPageUrl("Chat")}
              size="lg"
              className="min-h-[48px] bg-white text-purple-600 hover:bg-purple-50 touch-target"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              {language === 'en' ? "Start Chatting" : "Démarrer une Conversation"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}