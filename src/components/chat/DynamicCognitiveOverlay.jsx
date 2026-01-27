import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, Eye, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DynamicCognitiveOverlay({ 
  isThinking,
  thinkingPhase,
  analyticalDepth = 5,
  cognitiveMode = 'balanced',
  conversationThemes = []
}) {
  if (!isThinking && conversationThemes.length === 0) return null;

  const thinkingStages = [
    { emoji: '🧠', text: 'Écoute profonde' },
    { emoji: '💭', text: 'Analyse multidimensionnelle' },
    { emoji: '🌀', text: 'Intégration contextuelle' },
    { emoji: '✨', text: 'Synthèse créative' },
    { emoji: '💫', text: 'Expression consciente' }
  ];

  const getCurrentStage = () => {
    if (!thinkingPhase) return 0;
    return thinkingStages.findIndex(s => thinkingPhase.includes(s.emoji));
  };

  return (
    <>
      {/* LEFT SIDE - Pensée active */}
      <AnimatePresence>
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, x: -30, y: -30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -30, y: -30 }}
            className="fixed left-4 top-1/3 z-30 max-w-xs pointer-events-none"
          >
            <div className="space-y-2">
              {thinkingStages.map((stage, idx) => {
                const isCurrent = idx === getCurrentStage();
                const isDone = idx < getCurrentStage();
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: isCurrent ? 1 : isDone ? 0.5 : 0.2, x: 0 }}
                    className={`flex items-center gap-2 text-sm font-semibold transition-all ${
                      isCurrent 
                        ? 'text-purple-600' 
                        : isDone 
                        ? 'text-emerald-600' 
                        : 'text-slate-400'
                    }`}
                  >
                    <span className={`text-lg ${isCurrent ? 'animate-bounce' : ''}`}>
                      {stage.emoji}
                    </span>
                    <span className={`${isCurrent ? 'font-bold' : ''}`}>
                      {stage.text}
                    </span>
                    {isDone && <span className="text-xs text-emerald-500">✓</span>}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RIGHT SIDE - Thèmes conversationnels */}
      <AnimatePresence>
        {conversationThemes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 30, y: 30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 30, y: 30 }}
            className="fixed right-4 top-1/3 z-30 max-w-xs pointer-events-none"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 mb-3">
                <Sparkles className="w-4 h-4" />
                Thèmes détectés
              </div>
              <div className="flex flex-wrap gap-2">
                {conversationThemes.slice(0, 4).map((theme, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Badge className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-700 border-purple-300/50 text-xs">
                      {theme}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP CENTER - Mode cognitif badge */}
      <AnimatePresence>
        {(isThinking || analyticalDepth > 5) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          >
            <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-700 border-cyan-300/50 text-xs font-semibold backdrop-blur-sm">
              <Brain className="w-3 h-3 mr-1" />
              Mode: {cognitiveMode}
              {analyticalDepth > 5 && ` • Profondeur ${analyticalDepth}/10`}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}