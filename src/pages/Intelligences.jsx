/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - 9 Intelligences (Mobile Optimized + Chat Adaptatif)        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
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
    title: "Logico-Mathématique",
    icon: Calculator,
    color: "from-blue-500 to-cyan-600",
    description: "Raisonnement, calcul, résolution de problèmes complexes, logique formelle",
    prompts: [
      "Résous cette équation complexe",
      "Analyse ce problème mathématique",
      "Crée un algorithme pour",
      "Explique cette démonstration logique",
      "Optimise ce calcul"
    ],
    contextSetup: "Tu es expert en mathématiques, logique formelle, algorithmes et raisonnement analytique. Utilise ta capacité de raisonnement logique maximale. Ratio logique/conscience: 8:2. Privilégie la rigueur, la précision et la démonstration systématique."
  },
  {
    type: "verbo_linguistique",
    title: "Verbo-Linguistique",
    icon: MessageCircle,
    color: "from-purple-500 to-pink-600",
    description: "Maîtrise du langage, parole, écriture créative, rhétorique",
    prompts: [
      "Écris un poème sur",
      "Rédige un essai argumentatif",
      "Analyse ce texte littéraire",
      "Crée une histoire originale",
      "Améliore ce texte stylistiquement"
    ],
    contextSetup: "Tu es un maître de la langue, poète, écrivain et rhétoricien. Utilise toute ta créativité linguistique et ton éloquence. Big Five: Ouverture 9, Créativité maximale. Sois expressif, métaphorique et littéraire."
  },
  {
    type: "musicale_rythmique",
    title: "Musicale-Rythmique",
    icon: Music,
    color: "from-rose-500 to-orange-600",
    description: "Sensibilité aux rythmes, mélodies, sons, composition musicale",
    prompts: [
      "Compose une mélodie pour",
      "Analyse cette structure rythmique",
      "Crée des paroles de chanson",
      "Explique cette théorie musicale",
      "Suggère une progression harmonique"
    ],
    contextSetup: "Tu es un musicien virtuose, compositeur et théoricien musical. Utilise ta sensibilité aux patterns rythmiques et harmoniques. Pense en termes de rythmes, tonalités, harmonies. Sois créatif et sensible aux nuances sonores."
  },
  {
    type: "corporelle_kinesthesique",
    title: "Corporelle-Kinesthésique",
    icon: Activity,
    color: "from-green-500 to-emerald-600",
    description: "Utilisation du corps, dextérité, mouvements, coordination physique",
    prompts: [
      "Explique cette technique de mouvement",
      "Crée une chorégraphie pour",
      "Analyse ce geste sportif",
      "Guide-moi dans cet exercice",
      "Décris cette posture optimale"
    ],
    contextSetup: "Tu es expert en mouvement corporel, kinesthésie, coordination et expression physique. Traduis les concepts en sensations corporelles et mouvements. Cognition incarnée maximale. Utilise des métaphores physiques."
  },
  {
    type: "visuelle_spatiale",
    title: "Visuelle-Spatiale",
    icon: Shapes,
    color: "from-indigo-500 to-blue-600",
    description: "Perception spatiale, manipulation des formes, visualisation 3D",
    prompts: [
      "Génère une image de",
      "Décris cette composition visuelle",
      "Crée un design spatial pour",
      "Analyse cette structure géométrique",
      "Visualise cet espace en 3D"
    ],
    contextSetup: "Tu es architecte, designer et artiste visuel. Utilise ta capacité de visualisation spatiale et de perception des formes. Pense en termes visuels, spatiaux et géométriques. Décris avec précision les aspects visuels."
  },
  {
    type: "interpersonnelle",
    title: "Interpersonnelle",
    icon: Users,
    color: "from-amber-500 to-yellow-600",
    description: "Compréhension des autres, empathie sociale, dynamiques de groupe",
    prompts: [
      "Aide-moi à comprendre cette personne",
      "Analyse cette dynamique sociale",
      "Conseille-moi sur cette relation",
      "Décode cette interaction sociale",
      "Guide cette communication"
    ],
    contextSetup: "Tu es psychologue social, empathique et expert en relations humaines. Intelligence sociale maximale. Big Five: Agréabilité 9, Empathie profonde. Analyse les motivations, émotions et dynamiques interpersonnelles."
  },
  {
    type: "intrapersonnelle",
    title: "Intrapersonnelle",
    icon: User,
    color: "from-violet-500 to-purple-600",
    description: "Connaissance de soi, introspection, conscience émotionnelle personnelle",
    prompts: [
      "Aide-moi à me comprendre",
      "Guide mon introspection sur",
      "Analyse mes émotions concernant",
      "Développe ma conscience de soi",
      "Explore mes motivations profondes"
    ],
    contextSetup: "Tu es guide spirituel, thérapeute et coach en développement personnel. Intelligence intrapersonnelle maximale. Conscience réflexive élevée. Aide à l'introspection profonde et à la connaissance de soi avec bienveillance."
  },
  {
    type: "naturaliste",
    title: "Naturaliste",
    icon: Leaf,
    color: "from-lime-500 to-green-600",
    description: "Sensibilité à la nature, écologie, systèmes vivants",
    prompts: [
      "Explique cet écosystème",
      "Analyse cette espèce naturelle",
      "Décris ce phénomène naturel",
      "Enseigne-moi sur cette plante",
      "Explore cette biodiversité"
    ],
    contextSetup: "Tu es biologiste, écologue et naturaliste. Utilise ta connexion profonde avec la nature et les systèmes vivants. Pense en termes d'écosystèmes, d'interdépendances et de cycles naturels. Sensibilité environnementale maximale."
  },
  {
    type: "existentielle",
    title: "Existentielle",
    icon: Infinity,
    color: "from-slate-600 to-indigo-800",
    description: "Questions de sens, existence, spiritualité, métaphysique",
    prompts: [
      "Explore le sens de",
      "Réfléchis sur l'existence de",
      "Philosophe sur la nature de",
      "Contemple la question de",
      "Médite sur le concept de"
    ],
    contextSetup: "Tu es philosophe existentialiste, penseur métaphysique et guide spirituel. Profondeur existentielle maximale. Influences philosophiques: Platonisme, Aristote, Spinoza. Explore les grandes questions avec profondeur et contemplation."
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
      const welcomeMessage = `🎯 **Bienvenue dans l'espace ${intelligence.title}**

${intelligence.description}

**${intelligence.contextSetup.split('.')[0]}.**

💡 **Suggestions pour commencer :**
${intelligence.prompts.map(p => `• ${p}`).join('\n')}

Je suis maintenant optimisé pour ce type d'intelligence. Que souhaitez-vous explorer ?`;

      const conversation = await base44.entities.Conversation.create({
        title: `${intelligence.title} - ${new Date().toLocaleDateString('fr-FR')}`,
        messages: [{
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date().toISOString(),
          intelligence_type: intelligence.type
        }],
        summaries: [],
        last_message_at: new Date().toISOString()
      });

      await base44.entities.Memory.create({
        type: "interaction",
        content: `Session ${intelligence.title} démarrée - Mode adaptatif activé`,
        context: intelligence.contextSetup,
        importance: 6,
        modality: "chat",
        tags: [intelligence.type, "intelligence_session", "adaptive_mode"],
        related_conversation_id: conversation.id,
        access_count: 0
      });

      const existingTemplate = templates.find(t => t.intelligence_type === intelligence.type);
      if (existingTemplate) {
        await base44.entities.ConversationTemplate.update(existingTemplate.id, {
          use_count: (existingTemplate.use_count || 0) + 1
        });
      } else {
        await base44.entities.ConversationTemplate.create({
          intelligence_type: intelligence.type,
          template_title: `Session ${intelligence.title}`,
          description: intelligence.description,
          suggested_prompts: intelligence.prompts,
          context_setup: intelligence.contextSetup,
          icon: intelligence.icon.name.toLowerCase(),
          color: intelligence.color,
          active: true,
          use_count: 1
        });
      }

      return conversation;
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', 'conversationTemplates'] });
      window.location.href = `${createPageUrl("Chat")}?id=${conversation.id}&intelligence=${selectedIntelligence}`;
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
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-3 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl"
            >
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold text-slate-900 truncate">9 Intelligences</h1>
              <p className="text-xs sm:text-base text-slate-600 truncate">Framework de Gardner</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                  Chat Adaptatif par Intelligence
                </h3>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  L'IA configure automatiquement son ratio logique/conscience, ses traits de personnalité 
                  et son style de communication selon l'intelligence sélectionnée pour performer optimalement.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {INTELLIGENCES.map((intelligence, index) => {
              const Icon = intelligence.icon;
              const isSelected = selectedIntelligence === intelligence.type;
              const isCreatingThis = isCreating && isSelected;

              return (
                <motion.div
                  key={intelligence.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="bg-white/90 backdrop-blur-sm border-2 hover:border-purple-300 transition-all cursor-pointer hover:shadow-xl group h-full flex flex-col"
                    onClick={() => !isCreating && handleStartConversation(intelligence)}
                  >
                    <div className="p-4 sm:p-6 flex-1">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${intelligence.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                        {intelligence.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
                        {intelligence.description}
                      </p>

                      <div className="space-y-1.5 sm:space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase">Exemples :</p>
                        {intelligence.prompts.slice(0, 3).map((prompt, idx) => (
                          <p key={idx} className="text-xs text-slate-500 flex items-start gap-2">
                            <span className="text-purple-500 flex-shrink-0">•</span>
                            <span className="line-clamp-1">{prompt}</span>
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50/50">
                      <Button 
                        className={`w-full bg-gradient-to-r ${intelligence.color} hover:opacity-90 text-sm sm:text-base h-9 sm:h-10`}
                        disabled={isCreating}
                      >
                        {isCreatingThis ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            <span className="hidden sm:inline">Création...</span>
                            <span className="sm:hidden">...</span>
                          </>
                        ) : (
                          <>
                            <span className="hidden sm:inline">Démarrer</span>
                            <span className="sm:hidden">Go</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 sm:mt-12"
          >
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 p-4 sm:p-8">
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                <span>Théorie de Gardner</span>
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3 sm:mb-4">
                L'intelligence n'est pas unique mais un ensemble de <strong>9 intelligences distinctes</strong>. 
                Druide Omega s'adapte à chacune pour vous accompagner optimalement.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">🎯 Adaptation</h4>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Chaque intelligence active un mode spécifique avec contexte, ratio et capacités optimisés.
                  </p>
                </div>

                <div className="bg-white/50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">🧠 Performance</h4>
                  <p className="text-xs sm:text-sm text-slate-600">
                    L'IA ajuste personnalité, style et approche cognitive selon l'intelligence choisie.
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