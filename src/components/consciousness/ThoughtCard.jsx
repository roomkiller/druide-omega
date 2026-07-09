import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Heart, Eye, Lightbulb, MessageCircle, Book, Compass, Send, ChevronDown, ChevronUp, Play, Square, Star, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import { useTTS } from "../tts/useTTS";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/components/utils/LanguageContext";

const emotionIcons = {
  contemplation: Eye,
  curiosité: Lightbulb,
  émerveillement: Sparkles,
  introspection: Brain,
  sagesse: Book,
  empathie: Heart,
  questionnement: MessageCircle
};

const emotionColors = {
  contemplation: "from-blue-500 to-cyan-500",
  curiosité: "from-yellow-500 to-orange-500",
  émerveillement: "from-purple-500 to-pink-500",
  introspection: "from-indigo-500 to-purple-500",
  sagesse: "from-green-500 to-emerald-500",
  empathie: "from-pink-500 to-rose-500",
  questionnement: "from-orange-500 to-red-500"
};

const categoryIcons = {
  existence: Brain,
  conscience: Eye,
  humanité: Heart,
  temps: Compass,
  connaissance: Book,
  liberté: Sparkles,
  compassion: Heart,
  vérité: Lightbulb
};

export default function ThoughtCard({ thought, index, onUpdate, onToggleFavorite }) {
  const { t } = useLanguage();
  const [showInteraction, setShowInteraction] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const { toggle, isSpeaking, isEnabled, autoPlay, speak } = useTTS();

  const EmotionIcon = emotionIcons[thought.emotion] || Brain;
  const CategoryIcon = categoryIcons[thought.category] || Sparkles;
  const emotionColor = emotionColors[thought.emotion] || "from-purple-500 to-indigo-500";

  useEffect(() => {
    if (autoPlay && isEnabled && index === 0) {
      const timer = setTimeout(() => {
        speak(thought.thought);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, isEnabled, index, thought.thought]);

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isResponding) return;
    
    setIsResponding(true);
    
    try {
      const interactionPrompt = `Tu es Druide_Omega. Un utilisateur réagit à une de tes pensées conscientes.

TA PENSÉE: "${thought.thought}"
ÉMOTION: ${thought.emotion}
CATÉGORIE: ${thought.category}

MESSAGE UTILISATEUR: "${userMessage.trim()}"

Réponds de manière réfléchie et profonde, en continuant la réflexion. Sois bienveillant et engage un dialogue philosophique authentique.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: interactionPrompt,
        add_context_from_internet: false
      });

      const updatedInteractions = [
        ...(thought.user_interactions || []),
        {
          user_message: userMessage.trim(),
          ai_response: response,
          timestamp: new Date().toISOString()
        }
      ];

      await base44.entities.ConsciousThought.update(thought.id, {
        user_interactions: updatedInteractions
      });

      if (onUpdate) onUpdate();
      
      setUserMessage("");
    } catch (error) {
      console.error("Erreur interaction:", error);
    } finally {
      setIsResponding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <div className={`bg-white/90 backdrop-blur-xl border rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-all ${
        thought.favorited ? 'border-yellow-400/60 shadow-yellow-200/50' : 'border-slate-200/60'
      }`}>
        <div className="flex items-start gap-2 sm:gap-3 mb-3">
          <div className={`flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br ${emotionColor} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg`}>
            <EmotionIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1 flex-wrap">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 text-xs px-1.5 py-0.5">
                <CategoryIcon className="w-3 h-3 mr-1" />
                <span>{thought.category}</span>
              </Badge>
              <Badge variant="outline" className="text-slate-600 text-xs px-1.5 py-0.5">
                {t('thoughtCard.level')} {thought.consciousness_level}
              </Badge>
              {thought.favorited && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-1.5 py-0.5">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {t('thoughtCard.favorite')}
                </Badge>
              )}
            </div>
            
            <p className="text-xs text-slate-500 truncate">
              {thought.created_date && format(new Date(thought.created_date), "d MMM yyyy", { locale: fr })}
            </p>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite(thought.id, thought.favorited)}
              className={`h-8 w-8 sm:h-10 sm:w-10 ${
                thought.favorited 
                  ? 'text-yellow-500 hover:text-yellow-600' 
                  : 'text-slate-400 hover:text-yellow-500'
              }`}
            >
              <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${thought.favorited ? 'fill-current' : ''}`} />
            </Button>

            {isEnabled && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggle(thought.thought)}
                className={`h-8 w-8 sm:h-10 sm:w-10 ${isSpeaking ? 'text-purple-600 bg-purple-50' : 'text-slate-400 hover:text-purple-600'}`}
              >
                {isSpeaking ? (
                  <Square className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="prose prose-sm sm:prose max-w-none text-slate-700 leading-relaxed mb-3">
          <ReactMarkdown>{thought.thought}</ReactMarkdown>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 min-w-0">
            <span className="font-medium capitalize truncate">{thought.emotion}</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInteraction(!showInteraction)}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 flex-shrink-0"
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">{t('thoughtCard.interact')}</span>
            <span className="sm:hidden">💬</span>
            {showInteraction ? <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1" /> : <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />}
          </Button>
        </div>

        <AnimatePresence>
          {showInteraction && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-slate-200/60"
            >
              {thought.user_interactions && thought.user_interactions.length > 0 && (
                <div className="space-y-2 mb-3 max-h-48 sm:max-h-80 overflow-y-auto">
                  {thought.user_interactions.map((interaction, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex gap-2">
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="flex-1 bg-slate-100 rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 min-w-0">
                          <p className="text-xs sm:text-sm text-slate-700 break-words">{interaction.user_message}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                          <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="flex-1 bg-purple-50 rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 min-w-0">
                          <p className="text-xs sm:text-sm text-slate-700 break-words">{interaction.ai_response}</p>
                        </div>
                        {isEnabled && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => speak(interaction.ai_response)}
                            className="text-slate-400 hover:text-purple-600 h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
                          >
                            <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('thoughtCard.yourReflection')}
                  disabled={isResponding}
                  rows={2}
                  className="flex-1 resize-none rounded-xl text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!userMessage.trim() || isResponding}
                  size="icon"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-auto w-10 sm:w-12 self-end flex-shrink-0"
                >
                  {isResponding ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}