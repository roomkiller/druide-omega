
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
import { useIntelligence } from "@/components/system/IntelligenceContext"; // New import
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import PageTransition from "@/components/animations/PageTransition"; // New import
import ProactiveSuggestionsPanel from "@/components/system/ProactiveSuggestionsPanel"; // New import
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
  Loader2,
  Lightbulb // New icon
} from "lucide-react";

const INTELLIGENCES = [
  {
    type: "logico_mathematique",
    title: "Logico-Mathématique",
    titleEn: "Logical-Mathematical",
    icon: Calculator,
    color: "from-blue-500 to-cyan-600",
    description: "Raisonnement, calcul, résolution de problèmes complexes, logique formelle",
    descriptionEn: "Reasoning, calculation, complex problem-solving, formal logic",
    examples: [ // Changed from prompts to examples
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
    titleEn: "Verbal-Linguistic",
    icon: MessageCircle,
    color: "from-purple-500 to-pink-600",
    description: "Maîtrise du langage, parole, écriture créative, rhétorique",
    descriptionEn: "Mastery of language, speech, creative writing, rhetoric",
    examples: [ // Changed from prompts to examples
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
    titleEn: "Musical-Rhythmic",
    icon: Music,
    color: "from-rose-500 to-orange-600",
    description: "Sensibilité aux rythmes, mélodies, sons, composition musicale",
    descriptionEn: "Sensitivity to rhythm, melody, sound, musical composition",
    examples: [ // Changed from prompts to examples
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
    titleEn: "Bodily-Kinesthetic",
    icon: Activity,
    color: "from-green-500 to-emerald-600",
    description: "Utilisation du corps, dextérité, mouvements, coordination physique",
    descriptionEn: "Use of the body, dexterity, movement, physical coordination",
    examples: [ // Changed from prompts to examples
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
    titleEn: "Visual-Spatial",
    icon: Shapes,
    color: "from-indigo-500 to-blue-600",
    description: "Perception spatiale, manipulation des formes, visualisation 3D",
    descriptionEn: "Spatial perception, manipulation of shapes, 3D visualization",
    examples: [ // Changed from prompts to examples
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
    titleEn: "Interpersonal",
    icon: Users,
    color: "from-amber-500 to-yellow-600",
    description: "Compréhension des autres, empathie sociale, dynamiques de groupe",
    descriptionEn: "Understanding others, social empathy, group dynamics",
    examples: [ // Changed from prompts to examples
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
    titleEn: "Intrapersonal",
    icon: User,
    color: "from-violet-500 to-purple-600",
    description: "Connaissance de soi, introspection, conscience émotionnelle personnelle",
    descriptionEn: "Self-knowledge, introspection, personal emotional awareness",
    examples: [ // Changed from prompts to examples
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
    titleEn: "Naturalistic",
    icon: Leaf,
    color: "from-lime-500 to-green-600",
    description: "Sensibilité à la nature, écologie, systèmes vivants",
    descriptionEn: "Sensitivity to nature, ecology, living systems",
    examples: [ // Changed from prompts to examples
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
    titleEn: "Existential",
    icon: Infinity,
    color: "from-slate-600 to-indigo-800",
    description: "Questions de sens, existence, spiritualité, métaphysique",
    descriptionEn: "Questions of meaning, existence, spirituality, metaphysics",
    examples: [ // Changed from prompts to examples
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
  const { t, language } = useLanguage(); // Added language
  const hub = useConsciousnessHub();
  const { setActiveIntelligence } = useIntelligence(); // New hook
  const queryClient = useQueryClient();
  const [selectedIntelligence, setSelectedIntelligence] = useState(null);

  const createConversationMutation = useMutation({
    mutationFn: async (intelligence) => {
      const conversation = await base44.entities.Conversation.create({
        title: `${intelligence.title} - ${new Date().toLocaleDateString('fr-FR')}`,
        messages: [], // Changed to empty array
        summaries: [],
        last_message_at: new Date().toISOString()
      });

      await base44.entities.Memory.create({
        type: "interaction",
        content: `Mode ${intelligence.title} activé`, // Updated content
        context: intelligence.contextSetup.slice(0, 200), // Updated context slice
        importance: 7, // Updated importance
        modality: "intelligence_mode", // Updated modality
        tags: [intelligence.type, "intelligence_activation"], // Updated tags
        access_count: 0
      });

      // Removed ConversationTemplate logic as per outline

      return conversation;
    },
    onSuccess: (conversation, intelligence) => { // Added intelligence to args
      setActiveIntelligence(intelligence.type); // New call
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      hub.invalidateData(['memories']); // New call to invalidate memories
      window.location.href = createPageUrl(`Chat?id=${conversation.id}&intelligence=${intelligence.type}`); // Updated URL
    }
  });

  const handleIntelligenceSelect = (intelligence) => { // Renamed function
    setSelectedIntelligence(intelligence);
    createConversationMutation.mutate(intelligence);
  };

  // Removed useEffect for hub.registerModule

  return (
    <PageTransition> {/* New Wrapper */}
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30"> {/* Updated gradient */}
        {/* Header - Mobile Optimized */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-3 sm:px-6 py-6 sm:py-10 flex-shrink-0"> {/* Updated background */}
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 sm:gap-4" // Updated classname
            >
              <div className="min-w-[56px] min-h-[56px] w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl"> {/* Updated classname for icon container */}
                <Lightbulb className="w-7 h-7 sm:w-8 sm:h-8 text-white" /> {/* Changed icon */}
              </div>
              <div className="px-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                  {t('intelligences.title')} {/* Using translation */}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-purple-100">
                  {t('intelligences.subtitle')} {/* Using translation */}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8"> {/* Adjusted padding */}
            {/* Proactive Suggestions */}
            <div className="mb-4 sm:mb-6"> {/* New component */}
              <ProactiveSuggestionsPanel
                context={{
                  currentPage: 'Intelligences',
                  lastAction: 'browsing_intelligences'
                }}
              />
            </div>

            {/* Removed the Chat Adaptatif card */}

            {/* Intelligence Cards Grid - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"> {/* Adjusted gaps */}
              {INTELLIGENCES.map((intelligence, index) => {
                const Icon = intelligence.icon;
                const isLoading = createConversationMutation.isPending && selectedIntelligence?.type === intelligence.type;
                
                return (
                  <motion.div
                    key={intelligence.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.97 }} {/* Updated whileTap */}
                  >
                    <Card 
                      onClick={() => !createConversationMutation.isPending && handleIntelligenceSelect(intelligence)} {/* Renamed handler */}
                      className={`p-4 sm:p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 ${ /* Updated classname for sizing and border */
                        isLoading ? 'border-purple-500 bg-purple-50' : 'border-transparent hover:border-purple-300'
                      } bg-white/90 backdrop-blur-sm group min-h-[200px] sm:min-h-[280px] touch-target`}
                    >
                      <div className="flex flex-col h-full"> {/* Added flex column for content */}
                        <div className="flex items-start justify-between mb-3 sm:mb-4"> {/* Adjusted margin */}
                          <div className={`min-w-[56px] min-h-[56px] w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${intelligence.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ${ /* Updated classname for sizing and border radius */
                            isLoading ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'
                          }`}>
                            <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" /> {/* Updated icon sizing */}
                          </div>
                          <Badge variant="outline" className="text-xs"> {/* Added Badge */}
                            Gardner
                          </Badge>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2"> {/* Updated sizing */}
                          {language === 'en' ? intelligence.titleEn : intelligence.title} {/* Using language specific title */}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 flex-1 line-clamp-3"> {/* Updated sizing, margin, and clamp */}
                          {language === 'en' ? intelligence.descriptionEn : intelligence.description} {/* Using language specific description */}
                        </p>

                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-slate-700"> {/* Updated text */}
                            {language === 'en' ? 'Examples:' : 'Exemples:'} {/* Using translation */}
                          </p>
                          <div className="space-y-1"> {/* Adjusted spacing */}
                            {intelligence.examples.slice(0, 2).map((example, idx) => ( {/* Changed from prompts to examples, limited to 2 */}
                              <div key={idx} className="text-xs text-slate-600 flex items-start gap-1.5"> {/* Adjusted styling */}
                                <span className="text-purple-600 flex-shrink-0">•</span> {/* Changed color */}
                                <span className="line-clamp-2">{example}</span> {/* Added line clamp */}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button 
                          disabled={createConversationMutation.isPending}
                          className={`w-full mt-4 min-h-[48px] bg-gradient-to-r ${intelligence.color} text-white hover:opacity-90 touch-target`}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              {language === 'en' ? 'Activating...' : 'Activation...'} {/* Using translation */}
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" /> {/* Changed icon */}
                              {language === 'en' ? 'Activate' : 'Activer'} {/* Using translation */}
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Info Card - Mobile Optimized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 sm:mt-12" {/* Adjusted margin */}
            >
              <Card className="p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"> {/* Adjusted padding */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2"> {/* Updated sizing, changed to h3 */}
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" /> {/* Updated sizing */}
                  {language === 'en' ? 'How it works' : 'Comment ça fonctionne'} {/* Using translation */}
                </h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-700"> {/* Updated sizing */}
                  <p>
                    🎯 <strong>{language === 'en' ? 'Multiple Intelligences:' : 'Intelligences Multiples:'}</strong>{' '}
                    {language === 'en' 
                      ? 'Based on Howard Gardner\'s theory, each intelligence offers a unique cognitive approach.'
                      : 'Basé sur la théorie de Howard Gardner, chaque intelligence offre une approche cognitive unique.'
                    }
                  </p>
                  <p>
                    🧠 <strong>{language === 'en' ? 'Adaptive Context:' : 'Contexte Adaptatif:'}</strong>{' '}
                    {language === 'en'
                      ? 'The AI reconfigures its consciousness to specialize in the selected domain.'
                      : 'L\'IA reconfigure sa conscience pour se spécialiser dans le domaine sélectionné.'
                    }
                  </p>
                  <p>
                    ✨ <strong>{language === 'en' ? 'Enhanced Results:' : 'Résultats Améliorés:'}</strong>{' '}
                    {language === 'en'
                      ? 'More relevant, creative, and specialized responses for your specific needs.'
                      : 'Réponses plus pertinentes, créatives et spécialisées pour vos besoins spécifiques.'
                    }
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </ScrollArea>
      </div>
    </PageTransition> {/* New Wrapper */}
  );
}
