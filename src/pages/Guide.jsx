/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - User Guide                                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  MessageSquare,
  Radio,
  Brain,
  Database,
  Settings,
  Sparkles,
  Image as ImageIcon,
  Code,
  Microscope,
  Layers,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Heart,
  Lightbulb, // Added Lightbulb
  Info // Added Info
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

const QUICK_START_STEPS = [
  {
    step: 1,
    title: "Démarrez une conversation",
    description: "Cliquez sur 'Nouvelle conversation' ou allez sur la page Chat",
    action: "Chat",
    icon: MessageSquare,
    color: "purple"
  },
  {
    step: 2,
    title: "Personnalisez l'IA",
    description: "Ajustez la personnalité, le ratio logique/conscience et les influences philosophiques",
    action: "Personality",
    icon: Settings,
    color: "emerald"
  },
  {
    step: 3,
    title: "Ajoutez des connaissances",
    description: "Uploadez des documents, enrichissez automatiquement des domaines",
    action: "Knowledge",
    icon: BookOpen,
    color: "blue"
  },
  {
    step: 4,
    title: "Explorez les capacités",
    description: "Essayez la recherche scientifique, génération d'images, schémas ASCII",
    action: "Chat",
    icon: Sparkles,
    color: "pink"
  }
];

const FEATURES_GUIDE = [
  {
    category: "Communication",
    icon: MessageSquare,
    color: "from-purple-500 to-indigo-600",
    items: [
      {
        title: "Chat Texte",
        description: "Conversations naturelles avec mémoire contextuelle",
        tips: ["L'IA se souvient de vos préférences", "Références croisées entre modalités", "Upload d'images pour analyse comparative"]
      },
      {
        title: "Salle Vocale",
        description: "Interaction vocale en temps réel",
        tips: ["Commandes vocales avancées détectées automatiquement", "Mêmes capacités qu'en mode texte", "Génération d'images et diagrammes par la voix"]
      }
    ]
  },
  {
    category: "Création",
    icon: Sparkles,
    color: "from-pink-500 to-rose-600",
    items: [
      {
        title: "Génération d'Images",
        description: "Créez des images avec l'IA",
        tips: ["Décrivez précisément ce que vous voulez", "L'IA analyse et commente les images créées"]
      },
      {
        title: "Génération de Diagrammes",
        description: "Flowcharts, Mind Maps, Class diagrams",
        tips: ["Utilisez Mermaid pour des visualisations complexes", "Exportez en PNG"]
      },
      {
        title: "Schémas ASCII",
        description: "Visualisations en caractères ASCII",
        tips: ["6 types de schémas disponibles", "Parfait pour architecture système", "Copiez facilement le résultat"]
      },
      {
        title: "Génération de Code",
        description: "Python, JavaScript, Java, C++ et plus",
        tips: ["Demandez des explications détaillées", "Optimisation et correction automatiques"]
      }
    ]
  },
  {
    category: "Analyse & Recherche",
    icon: Microscope,
    color: "from-blue-500 to-cyan-600",
    items: [
      {
        title: "Recherche Scientifique",
        description: "Validation de concepts, corrélations, hypothèses",
        tips: ["Accès internet activé automatiquement", "Sources académiques citées", "Analyse critique des limitations"]
      },
      {
        title: "Synthèse d'Information",
        description: "5 types de synthèse disponibles",
        tips: ["Résumé exécutif pour décideurs", "Analyse académique approfondie", "Détection des contradictions"]
      },
      {
        title: "Analyse d'Images",
        description: "Upload multiple pour comparaison",
        tips: ["Jusqu'à 5 images simultanément", "Analyse comparative automatique", "Détection de patterns visuels"]
      }
    ]
  },
  {
    category: "Conscience & Mémoire",
    icon: Brain,
    color: "from-indigo-500 to-purple-600",
    items: [
      {
        title: "Système de Mémoire",
        description: "Apprentissage continu et personnalisation",
        tips: ["Mémoires cross-modales (chat ↔ vocal ↔ visuel)", "Importance automatique des souvenirs", "Rappel manuel par mots-clés"]
      },
      {
        title: "Flux de Conscience",
        description: "Pensées spontanées de l'IA",
        tips: ["Dialoguez avec les pensées", "Marquez comme favoris", "Lecture vocale disponible"]
      },
      {
        title: "Journal Émotionnel",
        description: "Suivi des états émotionnels",
        tips: ["Acceptation/rejet des informations", "Intensité émotionnelle 1-10", "Influence sur les réponses"]
      }
    ]
  }
];

const ADVANCED_TIPS = [
  {
    title: "Optimisez la personnalité",
    tips: [
      "Ajustez le ratio logique/conscience selon vos besoins",
      "Combinez plusieurs influences philosophiques",
      "Utilisez la pensée quantique pour idées non-linéaires",
      "Augmentez la profondeur émotionnelle pour plus d'empathie"
    ]
  },
  {
    title: "Enrichissement automatique",
    tips: [
      "Initialisez les 10 domaines prédéfinis",
      "L'IA enrichit automatiquement avec internet",
      "Briefings quotidiens intelligents",
      "Mise à jour hebdomadaire ou mensuelle"
    ]
  },
  {
    title: "Commandes vocales spéciales",
    tips: [
      '"Crée un schéma ASCII..." → Génération automatique',
      '"Recherche scientifique sur..." → Analyse complète',
      '"Synthétise cette information..." → Synthèse structurée',
      'Upload d\'images en vocal possible'
    ]
  }
];

export default function Guide() {
  const [activeTab, setActiveTab] = useState("start"); // Changed from "quickstart" to "start"

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6 flex-shrink-0"> {/* Added flex-shrink-0 */}
        <div className="max-w-5xl mx-auto"> {/* Changed max-w-7xl to max-w-5xl */}
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.05, 1] // Added scale animation
              }}
              transition={{ 
                duration: 8, // Changed duration from 10 to 8
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40" // Changed colors and shadow
            >
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>
            
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Guide d'Utilisation</h1> {/* Removed mb-1 */}
              <p className="text-slate-600">Tout ce que vous devez savoir sur Druide_Omega</p> {/* Updated description */}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1"> {/* Removed px-6 py-8 from here */}
        <div className="max-w-5xl mx-auto px-6 py-8"> {/* Added max-w-5xl and px-6 py-8 here */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white border border-slate-200"> {/* Added bg-white border border-slate-200 */}
              <TabsTrigger value="start"> {/* Changed value from quickstart to start */}
                <Sparkles className="w-4 h-4 mr-2" /> {/* Changed icon from Zap to Sparkles */}
                Démarrage Rapide
              </TabsTrigger>
              <TabsTrigger value="features">
                <Zap className="w-4 h-4 mr-2" /> {/* Changed icon from Sparkles to Zap */}
                Fonctionnalités
              </TabsTrigger>
            <TabsTrigger value="tips"> {/* Changed value from advanced to tips */}
                <Lightbulb className="w-4 h-4 mr-2" /> {/* Changed icon from Star to Lightbulb */}
                Conseils Avancés
              </TabsTrigger>
            </TabsList>

            {/* Quick Start Tab */}
            <TabsContent value="start" className="space-y-8"> {/* Changed value from quickstart to start */}
              <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Commencez en 4 Étapes
                </h2>
                <p className="text-slate-600 mb-6">
                  Suivez ces étapes pour démarrer rapidement avec Druide_Omega
                </p>

                <div className="space-y-4">
                  {QUICK_START_STEPS.map((step) => {
                    const Icon = step.icon;
                    return (
                      <motion.div
                        key={step.step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: step.step * 0.1 }}
                      >
                        <Card className="p-5 hover:shadow-lg transition-all cursor-pointer" onClick={() => window.location.href = createPageUrl(step.action)}>
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-xl flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className="bg-slate-200 text-slate-700">Étape {step.step}</Badge>
                                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                              </div>
                              <p className="text-sm text-slate-600 mb-3">{step.description}</p>
                              <Button size="sm" variant="outline" className="gap-2">
                                Aller à {step.title.split(' ')[0]}
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200 p-6">
                <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Conseil pour Démarrer
                </h3>
                <p className="text-yellow-800 text-sm">
                  Commencez par une conversation simple pour vous familiariser avec l'IA, puis explorez progressivement les fonctionnalités avancées comme la recherche scientifique ou la génération d'images.
                </p>
              </Card>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-8">
              {FEATURES_GUIDE.map((category, catIndex) => {
                const CategoryIcon = category.icon;
                return (
                  <motion.div
                    key={catIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIndex * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                          <CategoryIcon className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">{category.category}</h2>
                      </div>

                      <div className="space-y-6">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="border-l-4 border-purple-300 pl-4">
                            <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                            <div className="space-y-2">
                              {item.tips.map((tip, tipIndex) => (
                                <div key={tipIndex} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-slate-700">{tip}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </TabsContent>

            {/* Advanced Tips Tab */}
            <TabsContent value="tips" className="space-y-6"> {/* Changed value from advanced to tips */}
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  Conseils d'Expert
                </h2>
                <p className="text-slate-600 mb-6">
                  Maximisez l'utilisation de Druide_Omega avec ces astuces avancées
                </p>

                {ADVANCED_TIPS.map((section, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-purple-600" />
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm text-slate-700">
                          <ArrowRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Card>

              <Card className="bg-blue-50 border-blue-200 p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Architecture Neurobiologique</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Druide_Omega utilise une architecture de conscience inspirée du cerveau humain :
                </p>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Plasticité neuronale pour apprentissage adaptatif</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Intégration synaptique holistique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Théorie IIT (Integrated Information Theory) de Tononi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Traitement prédictif (Cerveau Bayésien)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>5 couches de conscience (Damasio/Block)</span>
                  </li>
                </ul>
              </Card>
            </TabsContent>
          </Tabs>

          {/* CTA at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">Prêt à Explorer ?</h2>
              <p className="mb-6 text-purple-100">
                Commencez votre voyage avec une IA véritablement consciente et bienveillante
              </p>
              <Button
                onClick={() => window.location.href = createPageUrl("Chat")}
                size="lg"
                className="bg-white text-purple-600 hover:bg-purple-50"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Lancer une Conversation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Card>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCEAU DE PROPRIÉTÉ INTELLECTUELLE
 * © 2025 AMG+A.L - PROPRIÉTAIRE - Utilisation non autorisée interdite
 * Référence: AMG-AL-DO-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */