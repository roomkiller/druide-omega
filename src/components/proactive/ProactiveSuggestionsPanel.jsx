/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Proactive Suggestions Panel (Mobile Simplified)            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PredictiveEngine } from "./PredictiveEngine";
import { createPageUrl } from "@/utils";

export default function ProactiveSuggestionsPanel({ context, onSuggestionClick }) {
  const [predictions, setPredictions] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const loadPredictions = async () => {
      const result = await PredictiveEngine.predictNextAction(context);
      setPredictions(result);
    };
    loadPredictions();
  }, [context.currentPage]);

  const handleSuggestionClick = (prediction) => {
    if (onSuggestionClick) {
      onSuggestionClick(prediction);
    }

    if (prediction.action_type === 'navigate') {
      window.location.href = createPageUrl(prediction.action_target);
    }
  };

  if (!isVisible || !predictions?.predictions?.length) return null;

  const topPrediction = predictions.predictions[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        onClick={() => handleSuggestionClick(topPrediction)}
        className="mb-3 cursor-pointer"
      >
        <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-purple-300/50 rounded-lg px-3 py-2 flex items-center justify-between gap-2 hover:border-purple-400/70 transition-all">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-slate-900 font-medium truncate">
              {topPrediction.title}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              {topPrediction.confidence}%
            </Badge>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
              className="hover:bg-white/50 rounded p-0.5"
            >
              <X className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}