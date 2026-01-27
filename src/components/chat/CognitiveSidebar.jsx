import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, Eye, Filter, ChevronRight, Sparkles, Wind, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export default function CognitiveSidebar({ 
  isThinking, 
  thinkingPhase, 
  messageCount,
  conversationThemes,
  analyticalDepth = 5,
  onDepthChange,
  showReasoningTrace = false,
  onReasoningTraceToggle,
  cognitiveMode = 'balanced',
  onCognitiveModeChange
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const cognitiveModes = [
    { id: 'analytical', label: 'Analytique', icon: Brain, color: 'from-blue-500 to-cyan-500' },
    { id: 'intuitive', label: 'Intuitif', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
    { id: 'balanced', label: 'Équilibré', icon: Wind, color: 'from-emerald-500 to-teal-500' },
    { id: 'creative', label: 'Créatif', icon: Lightbulb, color: 'from-amber-500 to-orange-500' }
  ];

  const thinkingStages = [
    { stage: '🧠 Écoute profonde', color: 'text-blue-500' },
    { stage: '💭 Analyse multidimensionnelle', color: 'text-purple-500' },
    { stage: '🌀 Intégration contextuelle', color: 'text-pink-500' },
    { stage: '✨ Synthèse créative', color: 'text-amber-500' },
    { stage: '💫 Expression consciente', color: 'text-emerald-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-0 top-0 h-full pt-[200px] pointer-events-none"
    >
      {/* Sidebar compacte */}
      <motion.div
        animate={{ width: isExpanded ? '280px' : '60px' }}
        className="h-screen bg-gradient-to-b from-slate-900/40 via-purple-900/30 to-slate-900/40 backdrop-blur-md border-r border-purple-500/20 pointer-events-auto flex flex-col gap-4 p-3 overflow-y-auto"
      >
        {/* Toggle button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 rounded-lg bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 flex items-center justify-center text-white transition-all hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </motion.button>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 text-white text-xs"
          >
            {/* État de pensée */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-semibold">
                <Brain className="w-4 h-4" />
                Processus
              </div>
              <AnimatePresence mode="wait">
                {isThinking ? (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-2"
                  >
                    {thinkingStages.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: thinkingPhase.includes(item.stage.split(' ')[0]) ? 1 : 0.4, x: 0 }}
                        className={`text-xs p-1.5 rounded bg-slate-800/40 ${item.color} transition-all ${
                          thinkingPhase.includes(item.stage.split(' ')[0]) ? 'bg-slate-700/60 scale-105' : ''
                        }`}
                      >
                        {item.stage}
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-slate-400 text-xs py-2"
                  >
                    Prêt à réfléchir...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mode cognitif */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-semibold">
                <Zap className="w-4 h-4" />
                Mode cognitif
              </div>
              <div className="space-y-1.5">
                {cognitiveModes.map(mode => (
                  <motion.button
                    key={mode.id}
                    onClick={() => onCognitiveModeChange?.(mode.id)}
                    whileHover={{ scale: 1.05 }}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-all ${
                      cognitiveMode === mode.id
                        ? `bg-gradient-to-r ${mode.color} text-white font-semibold`
                        : 'bg-slate-800/30 text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <mode.icon className="w-3 h-3" />
                    {mode.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Profondeur analytique */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-semibold">
                <Eye className="w-4 h-4" />
                Profondeur
              </div>
              <div className="space-y-2">
                <Slider
                  value={[analyticalDepth]}
                  onValueChange={(val) => onDepthChange?.(val[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="text-slate-400 text-center text-xs font-semibold">
                  {analyticalDepth}/10
                </div>
              </div>
            </div>

            {/* Thèmes détectés */}
            {conversationThemes && conversationThemes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  Thèmes
                </div>
                <div className="flex flex-wrap gap-1">
                  {conversationThemes.slice(0, 3).map((theme, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded-full border border-purple-500/50"
                    >
                      {theme}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Contrôles */}
            <div className="space-y-2 pt-4 border-t border-purple-500/20">
              <Button
                size="sm"
                variant={showReasoningTrace ? 'default' : 'outline'}
                onClick={() => onReasoningTraceToggle?.()}
                className="w-full justify-start text-xs h-8"
              >
                <Filter className="w-3 h-3 mr-1" />
                {showReasoningTrace ? 'Trace active' : 'Voir trace'}
              </Button>
            </div>

            {/* Message count */}
            <div className="text-slate-400 text-center text-xs pt-2">
              {messageCount} messages
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}