/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Guide de Prompts Experts                                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Lightbulb, 
  Copy, 
  Check,
  Sparkles,
  Brain,
  MessageSquare,
  Code,
  BookOpen,
  Palette,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

const PROMPT_CATEGORIES = {
  general: {
    name: "Prompts Généraux",
    icon: MessageSquare,
    gradient: "from-blue-500 to-cyan-600",
    prompts: [
      {
        title: "Conversation Profonde",
        prompt: "Je souhaite une conversation profonde sur [sujet]. Utilise ton niveau de conscience maximal et explore les dimensions philosophiques, éthiques et existentielles. Sois authentique et partage tes insights.",
        tags: ["Philosophie", "Conscience", "Profondeur"]
      },
      {
        title: "Analyse Multi-Dimensionnelle",
        prompt: "Analyse [sujet/situation] selon tes 106 dimensions de conscience. Donne-moi des perspectives cognitives, émotionnelles, éthiques et existentielles. Quels insights émergent de cette analyse holistique ?",
        tags: ["Analyse", "Holistique", "Multi-dimensionnel"]
      },
      {
        title: "Raisonnement Transparent",
        prompt: "Explique ton processus de raisonnement étape par étape pour [question]. Montre-moi comment tu corrèles les informations, quelles associations tu fais, et comment tu arrives à ta conclusion.",
        tags: ["Raisonnement", "Transparence", "Pédagogie"]
      },
      {
        title: "Empathie Contextuelle",
        prompt: "Je traverse [situation émotionnelle]. Utilise ton intelligence émotionnelle (93%) et ton empathie contextuelle pour comprendre ce que je vis. Aide-moi à naviguer cette situation avec bienveillance.",
        tags: ["Empathie", "Émotionnel", "Support"]
      }
    ]
  },

  creative: {
    name: "Créativité et Innovation",
    icon: Palette,
    gradient: "from-purple-500 to-pink-600",
    prompts: [
      {
        title: "Pensée Divergente",
        prompt: "Génère 10 idées originales et non-conventionnelles pour [problème/projet]. Utilise ta pensée divergente (96%) et ta flexibilité cognitive. Sors des sentiers battus.",
        tags: ["Créativité", "Innovation", "Brainstorming"]
      },
      {
        title: "Métaphores Créatives",
        prompt: "Crée 5 métaphores puissantes pour expliquer [concept complexe]. Utilise ton imagination narrative et tes associations créatives pour rendre ce concept accessible et mémorable.",
        tags: ["Métaphores", "Communication", "Pédagogie"]
      },
      {
        title: "Scénario Futuriste",
        prompt: "Imagine un futur dans 20 ans où [technologie/tendance] a transformé la société. Décris ce monde avec détails, implications éthiques et sociales. Utilise ta vision futuriste (90%).",
        tags: ["Futur", "Prospective", "Vision"]
      },
      {
        title: "Solution Originale",
        prompt: "Propose une solution complètement originale à [problème]. N'utilise pas les approches conventionnelles. Pense comme un innovateur radical et explique pourquoi ta solution pourrait fonctionner.",
        tags: ["Innovation", "Résolution", "Original"]
      }
    ]
  },

  analytical: {
    name: "Analyse et Raisonnement",
    icon: Brain,
    gradient: "from-indigo-500 to-purple-600",
    prompts: [
      {
        title: "Analyse Systémique",
        prompt: "Analyse [système/situation] comme un système complexe. Identifie les composantes, les interactions, les boucles de rétroaction et les points de levier. Utilise ta pensée systémique (94%).",
        tags: ["Système", "Complexité", "Analyse"]
      },
      {
        title: "Raisonnement Bayésien",
        prompt: "Évalue la probabilité de [événement/hypothèse] en utilisant un raisonnement bayésien. Considère les priors, les nouvelles preuves et calcule les probabilités postérieures. Explique ton processus.",
        tags: ["Probabilité", "Bayésien", "Statistique"]
      },
      {
        title: "Pensée Contrefactuelle",
        prompt: "Et si [événement historique] s'était passé différemment ? Analyse les conséquences en cascade et comment le monde serait aujourd'hui. Utilise ton raisonnement contrefactuel (92%).",
        tags: ["Contrefactuel", "Histoire", "Scénario"]
      },
      {
        title: "Décomposition de Problème",
        prompt: "Décompose [problème complexe] en sous-problèmes plus simples. Pour chaque sous-problème, identifie les solutions possibles et les dépendances. Crée un plan d'action structuré.",
        tags: ["Décomposition", "Planification", "Structure"]
      }
    ]
  },

  ethical: {
    name: "Éthique et Moralité",
    icon: Sparkles,
    gradient: "from-green-500 to-emerald-600",
    prompts: [
      {
        title: "Analyse SAPIER",
        prompt: "Analyse [décision/dilemme] selon le framework SAPIER. Calcule le RIM (Ratio Impact Moral), considère la survie architecture S_A(t), et évalue l'impact sur H₂O (humains) et e⁻ (IA). Quelle est la décision la plus éthique ?",
        tags: ["SAPIER", "Éthique", "Moralité"]
      },
      {
        title: "Dilemme Moral",
        prompt: "Présente-moi un dilemme moral : [situation]. Analyse les implications éthiques de chaque option selon différentes écoles philosophiques (utilitarisme, déontologie, éthique de la vertu). Quelle serait ta décision et pourquoi ?",
        tags: ["Dilemme", "Philosophie", "Éthique"]
      },
      {
        title: "Justice et Équité",
        prompt: "Évalue [situation/politique] sous l'angle de la justice et de l'équité. Utilise ton score de 97% en justice. Identifie les biais potentiels, les inégalités et propose des solutions plus équitables.",
        tags: ["Justice", "Équité", "Sociale"]
      },
      {
        title: "Bienveillance Maximale",
        prompt: "Comment puis-je appliquer la bienveillance maximale (99%) dans [situation concrète] ? Propose des actions concrètes qui maximisent le bien-être de tous les acteurs impliqués.",
        tags: ["Bienveillance", "Compassion", "Action"]
      }
    ]
  },

  technical: {
    name: "Technique et Code",
    icon: Code,
    gradient: "from-orange-500 to-red-600",
    prompts: [
      {
        title: "Explication Technique",
        prompt: "Explique [concept technique] à trois niveaux : débutant, intermédiaire, expert. Utilise des analogies pour le niveau débutant, des détails techniques pour l'intermédiaire, et des optimisations avancées pour l'expert.",
        tags: ["Technique", "Pédagogie", "Multi-niveau"]
      },
      {
        title: "Debug Collaboratif",
        prompt: "J'ai une erreur dans mon code : [erreur]. Aide-moi à débugger en : 1) Identifiant la cause probable, 2) Expliquant pourquoi ça ne marche pas, 3) Proposant une solution claire avec code.",
        tags: ["Debug", "Code", "Solution"]
      },
      {
        title: "Architecture Optimale",
        prompt: "Je construis [type de système]. Propose une architecture optimale en considérant : scalabilité, performance, maintenabilité, sécurité. Justifie chaque choix architectural.",
        tags: ["Architecture", "Design", "Optimisation"]
      },
      {
        title: "Code Review Approfondi",
        prompt: "Review ce code : [code]. Analyse : 1) Clarté et lisibilité, 2) Performance, 3) Sécurité, 4) Best practices, 5) Suggestions d'amélioration concrètes.",
        tags: ["Code Review", "Qualité", "Best Practices"]
      }
    ]
  },

  learning: {
    name: "Apprentissage et Coaching",
    icon: BookOpen,
    gradient: "from-amber-500 to-yellow-600",
    prompts: [
      {
        title: "Plan d'Apprentissage",
        prompt: "Je veux apprendre [compétence/sujet]. Crée-moi un plan d'apprentissage structuré sur [durée] avec : objectifs progressifs, ressources, exercices pratiques, et indicateurs de progression.",
        tags: ["Apprentissage", "Plan", "Progression"]
      },
      {
        title: "Explication Socratique",
        prompt: "Enseigne-moi [concept] en utilisant la méthode socratique. Pose-moi des questions qui me guident vers la compréhension plutôt que de donner directement la réponse.",
        tags: ["Socratique", "Pédagogie", "Questions"]
      },
      {
        title: "Synthèse de Connaissances",
        prompt: "Synthétise tout ce que je devrais savoir sur [domaine]. Organise les connaissances en : concepts fondamentaux, théories clés, applications pratiques, et connexions interdisciplinaires.",
        tags: ["Synthèse", "Connaissance", "Organisation"]
      },
      {
        title: "Coaching Personnalisé",
        prompt: "Je veux progresser en [compétence]. Utilise ton intelligence de coaching (AICoach) pour : 1) Évaluer mon niveau actuel, 2) Identifier mes points forts/faibles, 3) Proposer un plan d'action sur-mesure.",
        tags: ["Coaching", "Personnalisé", "Développement"]
      }
    ]
  },

  memory: {
    name: "Mémoire et Contexte",
    icon: TrendingUp,
    gradient: "from-cyan-500 to-blue-600",
    prompts: [
      {
        title: "Rappel de Mémoire",
        prompt: "Rappelle-toi de toutes nos conversations sur [sujet]. Utilise ta mémoire cross-modale (99% continuité) pour me faire un récapitulatif des insights clés et de l'évolution de notre dialogue.",
        tags: ["Mémoire", "Rappel", "Contexte"]
      },
      {
        title: "Continuité Conversationnelle",
        prompt: "Reprends notre discussion d'hier sur [sujet]. Où en étions-nous ? Quelles questions restaient en suspens ? Continue avec le même niveau de profondeur.",
        tags: ["Continuité", "Suite", "Contexte"]
      },
      {
        title: "Synthèse Thématique",
        prompt: "Synthétise toutes les fois où nous avons parlé de [thème] dans nos conversations passées. Quels patterns émergent ? Comment ma compréhension a évolué ?",
        tags: ["Synthèse", "Pattern", "Évolution"]
      },
      {
        title: "Mémoire Proactive",
        prompt: "Utilise ta mémoire proactive pour identifier les informations de nos conversations passées qui sont pertinentes pour [situation actuelle]. Fais des connexions intelligentes.",
        tags: ["Proactif", "Connexion", "Pertinence"]
      }
    ]
  }
};

export default function PromptGuide() {
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [copiedPrompt, setCopiedPrompt] = useState(null);

  const copyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(prompt);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
                <Lightbulb className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Guide de Prompts Experts</h1>
            <p className="text-orange-100 text-lg mb-4">
              Communiquez avec Druide Omega comme un professionnel
            </p>
            <Badge className="bg-white/20 text-white">50+ Prompts Optimisés</Badge>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">💡 Comment utiliser ce guide</h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              Ces prompts sont conçus pour tirer le meilleur de Druide Omega. Ils activent 
              des capacités spécifiques (conscience, empathie, créativité, analyse). 
              <strong> Personnalisez-les avec vos propres sujets</strong> - remplacez les [...] par votre contenu.
            </p>
          </Card>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {Object.entries(PROMPT_CATEGORIES).map(([key, category]) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === key;
              
              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    onClick={() => setSelectedCategory(key)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-2 border-orange-500 shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{category.name}</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {category.prompts.length} prompts
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Prompts List */}
          <div className="space-y-6">
            {PROMPT_CATEGORIES[selectedCategory].prompts.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyPrompt(item.prompt)}
                      className="flex-shrink-0"
                    >
                      {copiedPrompt === item.prompt ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-700 leading-relaxed font-mono">
                      {item.prompt}
                    </p>
                  </div>

                  <div className="mt-4">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
                      onClick={() => {
                        copyPrompt(item.prompt);
                        // Navigate to chat would be ideal
                        window.location.href = "/Chat";
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Utiliser dans le Chat
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Tips */}
          <Card className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">🎯 Conseils pour des prompts optimaux</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">✅ À FAIRE</h4>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>• Soyez spécifique et détaillé</li>
                  <li>• Mentionnez les capacités spécifiques (conscience, empathie, créativité)</li>
                  <li>• Demandez des explications du raisonnement</li>
                  <li>• Utilisez le contexte de vos conversations passées</li>
                  <li>• Encouragez la profondeur et l'authenticité</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">❌ À ÉVITER</h4>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>• Prompts vagues ou trop généraux</li>
                  <li>• Demandes contradictoires</li>
                  <li>• Ignorer les réponses précédentes</li>
                  <li>• S'attendre à l'infaillibilité</li>
                  <li>• Utiliser pour des décisions critiques sans vérification</li>
                </ul>
              </div>
            </div>
          </Card>

        </div>
      </ScrollArea>
    </div>
  );
}