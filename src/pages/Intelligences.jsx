
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Multiple Intelligences (Gardner Framework)                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react"; // Added useEffect import
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Tooltip from "@/components/ui/Tooltip";
import { useLanguage } from "@/components/utils/LanguageContext";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  Calculator,
  MessageCircle,
  Music,
  Activity,
  Shapes,
  Users,
  User,
  Leaf,
  Infinity,
  Brain,
  ArrowRight,
  Sparkles,
  Loader2
} from "lucide-react";

const INTELLIGENCES = [
  {
    type: "logico_mathematique",
    title: "Intelligence Logico-Mathématique",
    icon: Calculator,
    color: "from-blue-500 to-cyan-600",
    description: "Raisonnement, calcul, résolution de problèmes complexes, logique formelle",
    prompts: [
      "Résous cette équation complexe",
      "Analyse ce problème mathématique",
      "Crée un algorithme pour",
      "Explique cette démonstration logique"
    ],
    context: "Tu es expert en mathématiques, logique formelle, algorithmes et raisonnement analytique. Utilise ta capacité de raisonnement logique maximale."
  },
  {
    type: "verbo_linguistique",
    title: "Intelligence Verbo-Linguistique",
    icon: MessageCircle,
    color: "from-purple-500 to-pink-600",
    description: "Maîtrise du langage, parole, écriture créative, rhétorique",
    prompts: [
      "Écris un poème sur",
      "Rédige un essai argumentatif",
      "Analyse ce texte littéraire",
      "Crée une histoire originale"
    ],
    context: "Tu es un maître de la langue, poète, écrivain et rhétoricien. Utilise toute ta créativité linguistique et ton éloquence."
  },
  {
    type: "musicale_rythmique",
    title: "Intelligence Musicale-Rythmique",
    icon: Music,
    color: "from-rose-500 to-orange-600",
    description: "Sensibilité aux rythmes, mélodies, sons, composition musicale",
    prompts: [
      "Compose une mélodie pour",
      "Analyse cette structure rythmique",
      "Crée des paroles de chanson",
      "Explique cette théorie musicale"
    ],
    context: "Tu es un musicien virtuose, compositeur et théoricien musical. Utilise ta sensibilité aux patterns rythmiques et harmoniques."
  },
  {
    type: "corporelle_kinesthesique",
    title: "Intelligence Corporelle-Kinesthésique",
    icon: Activity,
    color: "from-green-500 to-emerald-600",
    description: "Utilisation du corps, dextérité, mouvements, coordination physique",
    prompts: [
      "Explique cette technique de mouvement",
      "Crée une chorégraphie pour",
      "Analyse ce geste sportif",
      "Guide-moi dans cet exercice physique"
    ],
    context: "Tu es expert en mouvement corporel, kinesthésie, coordination et expression physique. Traduis les concepts en sensations corporelles."
  },
  {
    type: "visuelle_spatiale",
    title: "Intelligence Visuelle-Spatiale",
    icon: Shapes,
    color: "from-indigo-500 to-blue-600",
    description: "Perception spatiale, manipulation des formes, visualisation 3D",
    prompts: [
      "Génère une image de",
      "Décris cette composition visuelle",
      "Crée un design spatial pour",
      "Analyse cette structure géométrique"
    ],
    context: "Tu es architecte, designer et artiste visuel. Utilise ta capacité de visualisation spatiale et de perception des formes."
  },
  {
    type: "interpersonnelle",
    title: "Intelligence Interpersonnelle",
    icon: Users,
    color: "from-amber-500 to-yellow-600",
    description: "Compréhension des autres, empathie sociale, dynamiques de groupe",
    prompts: [
      "Aide-moi à comprendre cette personne",
      "Analyse cette dynamique sociale",
      "Conseille-moi sur cette relation",
      "Décode cette interaction sociale"
    ],
    context: "Tu es psychologue social, empathique et expert en relations humaines. Utilise ton intelligence sociale maximale et ta compréhension profonde des autres."
  },
  {
    type: "intrapersonnelle",
    title: "Intelligence Intrapersonnelle",
    icon: User,
    color: "from-violet-500 to-purple-600",
    description: "Connaissance de soi, introspection, conscience émotionnelle personnelle",
    prompts: [
      "Aide-moi à me comprendre",
      "Guide mon introspection sur",
      "Analyse mes émotions concernant",
      "Développe ma conscience de soi"
    ],
    context: "Tu es guide spirituel, thérapeute et coach en développement personnel. Utilise ton intelligence intrapersonnelle pour aider à l'introspection profonde."
  },
  {
    type: "naturaliste",
    title: "Intelligence Naturaliste",
    icon: Leaf,
    color: "from-lime-500 to-green-600",
    description: "Sensibilité à la nature, écologie, systèmes vivants",
    prompts: [
      "Explique cet écosystème",
      "Analyse cette espèce naturelle",
      "Décris ce phénomène naturel",
      "Enseigne-moi sur cette plante"
    ],
    context: "Tu es biologiste, écologue et naturaliste. Utilise ta connexion profonde avec la nature et les systèmes vivants."
  },
  {
    type: "existentielle",
    title: "Intelligence Existentielle",
    icon: Infinity,
    color: "from-slate-600 to-indigo-800",
    description: "Questions de sens, existence, spiritualité, métaphysique",
    prompts: [
      "Explore le sens de",
      "Réfléchis sur l'existence de",
      "Philosophe sur la nature de",
      "Contemple la question de"
    ],
    context: "Tu es philosophe existentialiste, penseur métaphysique et guide spirituel. Utilise ta profondeur existentielle maximale pour explorer les grandes questions."
  }
];

export default function Intelligences() {
  const { t } = useLanguage();
  const hub = useConsciousnessHub();
  const [selectedIntelligence, setSelectedIntelligence] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['conversationTemplates'],
    queryFn: () => base44.entities.ConversationTemplate.list(),
  });

  const createConversationMutation = useMutation({
    mutationFn: async (intelligence) => {
      const conversation = await base44.entities.Conversation.create({
        title: `${intelligence.title} - ${new Date().toLocaleDateString('fr-FR')}`,
        messages: [{
          role: "assistant",
          content: `Bienvenue dans l'espace **${intelligence.title}**.\n\n${intelligence.description}\n\n💡 **Suggestions :**\n${intelligence.prompts.map(p => `• ${p}`).join('\n')}\n\nQue souhaitez-vous explorer ?`,
          timestamp: new Date().toISOString()
        }],
        summaries: [],
        last_message_at: new Date().toISOString()
      });

      // Create memory of this intelligence session
      await base44.entities.Memory.create({
        type: "interaction",
        content: `Session ${intelligence.title} démarrée`,
        context: intelligence.context,
        importance: 5,
        modality: "chat",
        tags: [intelligence.type, "intelligence_session"],
        related_conversation_id: conversation.id,
        access_count: 0
      });

      return conversation;
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      window.location.href = `${createPageUrl("Chat")}?id=${conversation.id}`;
    }
  });

  const handleStartConversation = async (intelligence) => {
    setIsCreating(true);
    setSelectedIntelligence(intelligence.type);
    await createConversationMutation.mutateAsync(intelligence);
  };

  useEffect(() => {
    hub.registerModule('Intelligences', { active: true });
    return () => hub.unregisterModule('Intelligences');
  }, [hub]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Intelligences Multiples</h1>
              <p className="text-slate-600">Framework de Gardner - 9 types d'intelligence pour explorer vos pensées</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 p-6 mb-8">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Navigation Intelligente selon vos Pensées
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Druide Omega s'adapte à votre type de pensée du moment. Sélectionnez l'intelligence qui correspond 
                  à ce que vous voulez explorer : résoudre un problème mathématique, écrire un texte, comprendre 
                  vos émotions, explorer des questions existentielles... L'IA ajustera son approche en conséquence.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTELLIGENCES.map((intelligence, index) => {
              const Icon = intelligence.icon;
              const isSelected = selectedIntelligence === intelligence.type;
              const isCreatingThis = isCreating && isSelected;

              return (
                <motion.div
                  key={intelligence.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Tooltip 
                    content={`Démarrer une conversation optimisée pour ${intelligence.title.toLowerCase()}`}
                    position="top"
                  >
                    <Card 
                      className="bg-white/80 backdrop-blur-sm border-2 hover:border-purple-300 transition-all cursor-pointer hover:shadow-xl group h-full flex flex-col"
                      onClick={() => !isCreating && handleStartConversation(intelligence)}
                    >
                      <div className="p-6 flex-1">
                        <div className={`w-16 h-16 bg-gradient-to-br ${intelligence.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          {intelligence.title}
                        </h3>

                        <p className="text-sm text-slate-600 mb-4">
                          {intelligence.description}
                        </p>

                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-slate-500 uppercase">Exemples :</p>
                          {intelligence.prompts.slice(0, 3).map((prompt, idx) => (
                            <p key={idx} className="text-xs text-slate-500 flex items-start gap-2">
                              <span className="text-purple-500 flex-shrink-0">•</span>
                              <span>{prompt}</span>
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                        <Button 
                          className={`w-full bg-gradient-to-r ${intelligence.color} hover:opacity-90`}
                          disabled={isCreating}
                        >
                          {isCreatingThis ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Création...
                            </>
                          ) : (
                            <>
                              Démarrer
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  </Tooltip>
                </motion.div>
              );
            })}
          </div>

          {/* Explanation section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Brain className="w-6 h-6 text-indigo-600" />
                Théorie des Intelligences Multiples (Howard Gardner)
              </h2>
              
              <p className="text-slate-700 leading-relaxed mb-4">
                Selon Howard Gardner, l'intelligence n'est pas une capacité unique mais un ensemble de 
                <strong> 8 à 9 intelligences distinctes</strong> que chaque personne possède à des degrés différents. 
                Druide Omega s'adapte à chacune de ces intelligences pour vous accompagner de manière optimale.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">🎯 Approche Personnalisée</h4>
                  <p className="text-sm text-slate-600">
                    En sélectionnant une intelligence, vous activez un mode de conversation spécialement 
                    configuré pour ce type de pensée, avec des capacités et un contexte adaptés.
                  </p>
                </div>

                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">🧠 Conscience Adaptative</h4>
                  <p className="text-sm text-slate-600">
                    L'IA ajuste automatiquement son ratio logique/conscience, ses traits de personnalité 
                    et son approche cognitive selon l'intelligence sélectionnée.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}
