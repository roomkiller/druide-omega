import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Heart, Eye, Lightbulb, MessageCircle, Book, Compass, Send, ChevronDown, ChevronUp, Play, Square, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import { useTTS } from "../tts/useTTS";

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

export default function ThoughtCard({ thought, index, onInteract, onToggleFavorite }) {
  const [showInteraction, setShowInteraction] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const { toggle, isSpeaking, isEnabled, autoPlay, speak } = useTTS();

  const EmotionIcon = emotionIcons[thought.emotion] || Brain;
  const CategoryIcon = categoryIcons[thought.category] || Sparkles;
  const emotionColor = emotionColors[thought.emotion] || "from-purple-500 to-indigo-500";

  // Auto-play when card appears
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
    await onInteract(thought.id, userMessage.trim());
    setUserMessage("");
    setIsResponding(false);
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
      transition={{ 
        delay: index * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
      
      <div className={`relative bg-white/90 backdrop-blur-xl border rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ${
        thought.favorited ? 'border-yellow-400/60 shadow-yellow-200' : 'border-slate-200/60'
      }`}>
        <div className="flex items-start gap-4 mb-4">
          <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${emotionColor} rounded-2xl flex items-center justify-center shadow-lg`}>
            <EmotionIcon className="w-7 h-7 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                <CategoryIcon className="w-3 h-3 mr-1" />
                {thought.category}
              </Badge>
              <Badge variant="outline" className="text-slate-600">
                Niveau {thought.consciousness_level}/9
              </Badge>
              {thought.favorited && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Favori
                </Badge>
              )}
            </div>
            
            <p className="text-xs text-slate-500">
              {thought.created_date && format(new Date(thought.created_date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite(thought.id, !thought.favorited)}
              className={`transition-all duration-200 ${
                thought.favorited 
                  ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50' 
                  : 'text-slate-400 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
            >
              <Star className={`w-5 h-5 ${thought.favorited ? 'fill-current' : ''}`} />
            </Button>

            {/* TTS Button */}
            {isEnabled && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggle(thought.thought)}
                className={`${isSpeaking ? 'text-purple-600 bg-purple-50' : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50'} transition-all duration-200`}
              >
                {isSpeaking ? (
                  <Square className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed mb-4">
          <ReactMarkdown>{thought.thought}</ReactMarkdown>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium capitalize">{thought.emotion}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-lg shadow-purple-500/50"
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInteraction(!showInteraction)}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Dialoguer
              {showInteraction ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showInteraction && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-slate-200/60"
            >
              {/* Previous interactions */}
              {thought.user_interactions && thought.user_interactions.length > 0 && (
                <div className="space-y-3 mb-4">
                  {thought.user_interactions.map((interaction, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 bg-slate-100 rounded-2xl px-4 py-2">
                          <p className="text-sm text-slate-700">{interaction.user_message}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 bg-purple-50 rounded-2xl px-4 py-2">
                          <p className="text-sm text-slate-700">{interaction.ai_response}</p>
                        </div>
                        {isEnabled && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => speak(interaction.ai_response)}
                            className="text-slate-400 hover:text-purple-600 hover:bg-purple-50 h-8 w-8"
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* New message input */}
              <div className="flex gap-2">
                <Textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Partagez votre réflexion ou posez une question à l'IA..."
                  disabled={isResponding}
                  rows={2}
                  className="flex-1 resize-none rounded-xl border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!userMessage.trim() || isResponding}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}