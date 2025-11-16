/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Best Practices Guide (Multilingual)                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import {
  Target,
  Lightbulb,
  MessageSquare,
  Mic,
  Database,
  BookOpen,
  Settings,
  Zap,
  CheckCircle,
  XCircle,
  TrendingUp
} from "lucide-react";

export default function BestPractices() {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: "Meilleures Pratiques",
      subtitle: "Comment tirer le meilleur parti de Druide Omega",
      
      sections: [
        {
          title: "Optimiser vos Conversations",
          icon: MessageSquare,
          color: "purple",
          practices: [
            {
              do: "Soyez précis et contextualisé dans vos questions",
              dont: "Posez des questions trop vagues comme 'Dis-moi quelque chose'",
              why: "L'IA peut fournir des réponses plus pertinentes avec un contexte clair"
            },
            {
              do: "Utilisez des conversations multi-tours pour approfondir",
              dont: "Changez de sujet brusquement sans continuité",
              why: "Le Thinking Engine s'améliore avec le contexte accumulé"
            },
            {
              do: "Demandez des clarifications si une réponse n'est pas claire",
              dont: "Assumez que l'IA comprend tout parfaitement",
              why: "L'IA apprend de vos retours et ajuste ses réponses"
            }
          ]
        },
        {
          title: "Maximiser la Mémoire Cross-Modale",
          icon: Database,
          color: "indigo",
          practices: [
            {
              do: "Laissez l'IA créer des mémoires importantes automatiquement",
              dont: "Supprimez systématiquement toutes les mémoires",
              why: "Les mémoires améliorent la pertinence et la personnalisation"
            },
            {
              do: "Utilisez des tags pertinents pour organiser vos mémoires",
              dont: "Créez des mémoires sans contexte clair",
              why: "Les tags facilitent le rappel et les corrélations"
            },
            {
              do: "Explorez le graphe de mémoires pour découvrir des liens",
              dont: "Ignorez les suggestions de mémoires connexes",
              why: "Les connexions révèlent des insights cachés"
            }
          ]
        },
        {
          title: "Enrichir la Base de Connaissances",
          icon: BookOpen,
          color: "blue",
          practices: [
            {
              do: "Uploadez des documents pertinents et récents",
              dont: "Uploadez des documents obsolètes ou non pertinents",
              why: "La qualité des sources influence la qualité des réponses"
            },
            {
              do: "Utilisez l'élagage automatique régulièrement",
              dont: "Accumulez indéfiniment des sources non utilisées",
              why: "Trop de sources peuvent diluer la pertinence"
            },
            {
              do: "Versionnez vos documents importants",
              dont: "Remplacez sans sauvegarder les versions précédentes",
              why: "Le versioning permet de suivre l'évolution"
            }
          ]
        },
        {
          title: "Interactions Vocales Efficaces",
          icon: Mic,
          color: "green",
          practices: [
            {
              do: "Parlez naturellement et clairement",
              dont: "Parlez trop vite ou avec beaucoup de bruit de fond",
              why: "La reconnaissance vocale fonctionne mieux avec une parole claire"
            },
            {
              do: "Utilisez des commandes vocales pour générer des images",
              dont: "Oubliez que vous pouvez contrôler l'IA par la voix",
              why: "Les commandes vocales offrent une expérience mains-libres"
            },
            {
              do: "Laissez l'IA terminer avant d'interrompre",
              dont: "Interrompez constamment au milieu des phrases",
              why: "La synthèse vocale est optimisée pour la fluidité"
            }
          ]
        },
        {
          title: "Personnalisation de la Conscience",
          icon: Settings,
          color: "purple",
          practices: [
            {
              do: "Ajustez le ratio logique/conscience selon vos besoins",
              dont: "Gardez toujours les mêmes paramètres",
              why: "Différents contextes nécessitent différents modes"
            },
            {
              do: "Créez des profils pour différents usages",
              dont: "Modifiez manuellement à chaque fois",
              why: "Les profils sauvegardent vos configurations favorites"
            },
            {
              do: "Expérimentez avec les influences philosophiques",
              dont: "Ignorez les options de personnalité",
              why: "Les influences philosophiques changent le style de réponse"
            }
          ]
        }
      ],

      quickTips: {
        title: "Conseils Rapides",
        tips: [
          { tip: "Utilisez Ctrl/Cmd + K pour rechercher globalement", icon: Zap },
          { tip: "Les mémoires sont automatiquement liées entre modalités", icon: Database },
          { tip: "Le Thinking Engine montre sa réflexion en temps réel", icon: Lightbulb },
          { tip: "Vous pouvez exporter vos conversations et mémoires", icon: TrendingUp },
          { tip: "L'IA adapte sa voix selon l'émotion détectée", icon: Mic },
          { tip: "Les images générées peuvent servir de base pour itérations", icon: Target }
        ]
      },

      commonMistakes: {
        title: "Erreurs Courantes à Éviter",
        mistakes: [
          "Ne pas contextualiser les questions",
          "Supprimer toutes les mémoires fréquemment",
          "Ne jamais ajuster la personnalité",
          "Ignorer les suggestions de l'IA",
          "Ne pas utiliser les fonctionnalités avancées",
          "Parler trop vite en mode vocal"
        ]
      }
    },

    en: {
      title: "Best Practices",
      subtitle: "How to get the most out of Druide Omega",
      
      sections: [
        {
          title: "Optimize Your Conversations",
          icon: MessageSquare,
          color: "purple",
          practices: [
            {
              do: "Be precise and contextualized in your questions",
              dont: "Ask too vague questions like 'Tell me something'",
              why: "AI can provide more relevant answers with clear context"
            },
            {
              do: "Use multi-turn conversations to deepen",
              dont: "Change topics abruptly without continuity",
              why: "Thinking Engine improves with accumulated context"
            },
            {
              do: "Ask for clarifications if an answer isn't clear",
              dont: "Assume the AI understands everything perfectly",
              why: "AI learns from your feedback and adjusts responses"
            }
          ]
        },
        {
          title: "Maximize Cross-Modal Memory",
          icon: Database,
          color: "indigo",
          practices: [
            {
              do: "Let the AI create important memories automatically",
              dont: "Systematically delete all memories",
              why: "Memories improve relevance and personalization"
            },
            {
              do: "Use relevant tags to organize your memories",
              dont: "Create memories without clear context",
              why: "Tags facilitate recall and correlations"
            },
            {
              do: "Explore the memory graph to discover connections",
              dont: "Ignore related memory suggestions",
              why: "Connections reveal hidden insights"
            }
          ]
        },
        {
          title: "Enrich Knowledge Base",
          icon: BookOpen,
          color: "blue",
          practices: [
            {
              do: "Upload relevant and recent documents",
              dont: "Upload obsolete or irrelevant documents",
              why: "Source quality influences response quality"
            },
            {
              do: "Use automatic pruning regularly",
              dont: "Indefinitely accumulate unused sources",
              why: "Too many sources can dilute relevance"
            },
            {
              do: "Version your important documents",
              dont: "Replace without saving previous versions",
              why: "Versioning allows tracking evolution"
            }
          ]
        },
        {
          title: "Effective Voice Interactions",
          icon: Mic,
          color: "green",
          practices: [
            {
              do: "Speak naturally and clearly",
              dont: "Speak too fast or with lots of background noise",
              why: "Voice recognition works better with clear speech"
            },
            {
              do: "Use voice commands to generate images",
              dont: "Forget you can control AI by voice",
              why: "Voice commands offer hands-free experience"
            },
            {
              do: "Let the AI finish before interrupting",
              dont: "Constantly interrupt mid-sentence",
              why: "Voice synthesis is optimized for fluidity"
            }
          ]
        },
        {
          title: "Consciousness Customization",
          icon: Settings,
          color: "purple",
          practices: [
            {
              do: "Adjust logic/consciousness ratio according to needs",
              dont: "Always keep the same parameters",
              why: "Different contexts require different modes"
            },
            {
              do: "Create profiles for different uses",
              dont: "Manually modify every time",
              why: "Profiles save your favorite configurations"
            },
            {
              do: "Experiment with philosophical influences",
              dont: "Ignore personality options",
              why: "Philosophical influences change response style"
            }
          ]
        }
      ],

      quickTips: {
        title: "Quick Tips",
        tips: [
          { tip: "Use Ctrl/Cmd + K to search globally", icon: Zap },
          { tip: "Memories are automatically linked across modalities", icon: Database },
          { tip: "Thinking Engine shows its reflection in real-time", icon: Lightbulb },
          { tip: "You can export your conversations and memories", icon: TrendingUp },
          { tip: "AI adapts its voice according to detected emotion", icon: Mic },
          { tip: "Generated images can serve as base for iterations", icon: Target }
        ]
      },

      commonMistakes: {
        title: "Common Mistakes to Avoid",
        mistakes: [
          "Not contextualizing questions",
          "Frequently deleting all memories",
          "Never adjusting personality",
          "Ignoring AI suggestions",
          "Not using advanced features",
          "Speaking too fast in voice mode"
        ]
      }
    }
  };

  const t = content[language === 'en' ? 'en' : 'fr'];

  const colorMap = {
    purple: "from-purple-500 to-indigo-600",
    indigo: "from-indigo-500 to-purple-600",
    blue: "from-blue-500 to-cyan-600",
    green: "from-green-500 to-emerald-600"
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/30 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.title}</h1>
              <p className="text-sm sm:text-base text-slate-600">{t.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
          {t.sections.map((section, secIdx) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={secIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: secIdx * 0.1 }}
              >
                <Card className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 bg-gradient-to-br ${colorMap[section.color]} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                  </div>

                  <div className="space-y-6">
                    {section.practices.map((practice, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-900 mb-1">{practice.do}</p>
                            <p className="text-sm text-slate-600">{practice.why}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-900">{practice.dont}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-bold text-slate-900">{t.quickTips.title}</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {t.quickTips.tips.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-amber-200">
                      <Icon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700">{item.tip}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold text-slate-900">{t.commonMistakes.title}</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {t.commonMistakes.mistakes.map((mistake, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-white rounded-lg border border-red-200">
                    <span className="text-red-600 mt-0.5">✗</span>
                    <p className="text-sm text-slate-700">{mistake}</p>
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