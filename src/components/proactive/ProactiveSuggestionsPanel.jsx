/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Proactive Suggestions Panel                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Info, ExternalLink, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PredictiveEngine } from "./PredictiveEngine";
import { createPageUrl } from "@/utils";

export default function ProactiveSuggestionsPanel({ context, onSuggestionClick }) {
  const [predictions, setPredictions] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, [context.currentPage]);

  const loadPredictions = async () => {
    setIsLoading(true);
    const result = await PredictiveEngine.predictNextAction(context);
    setPredictions(result);
    setIsLoading(false);
  };

  const handleSuggestionClick = (prediction) => {
    if (onSuggestionClick) {
      onSuggestionClick(prediction);
    }

    if (prediction.action_type === 'navigate') {
      window.location.href = createPageUrl(prediction.action_target);
    }
  };

  if (!isVisible || !predictions) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'action': return <TrendingUp className="w-4 h-4" />;
      case 'information': return <Info className="w-4 h-4" />;
      case 'resource': return <ExternalLink className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'from-red-500 to-orange-600';
      case 'medium': return 'from-amber-500 to-yellow-600';
      default: return 'from-blue-500 to-cyan-600';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-4"
      >
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 bg-gradient-to-br ${getUrgencyColor(predictions.urgency_level)} rounded-lg flex items-center justify-center`}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">IA Prédictive</h3>
                <p className="text-xs text-slate-600">{predictions.contextual_insights}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {predictions.predictions.slice(0, 3).map((pred, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSuggestionClick(pred)}
                className="p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-400 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(pred.type)}
                    <span className="font-medium text-slate-900 text-sm">{pred.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {pred.confidence}%
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-2">{pred.description}</p>
                <p className="text-xs text-slate-500 italic">{pred.reasoning}</p>
              </motion.div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadPredictions}
            className="w-full mt-3 text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <Sparkles className="w-3 h-3 mr-2" />
            Actualiser les prédictions
          </Button>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}