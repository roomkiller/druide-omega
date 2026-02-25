/**
 * Affiche les insights du réseau neuronal conversationnel
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, TrendingUp, BarChart3 } from 'lucide-react';

export default function ConversationNeuronDisplay({ 
  networkState, 
  insights, 
  onShowReflection 
}) {
  if (!networkState || !insights) return null;

  const cognitive = networkState.cognitive;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-4"
      >
        {/* Synthèse Cognitive */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="w-5 h-5 text-purple-600" />
              Synthèse Cognitive
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Évolution thématique */}
            {cognitive.thematicJourney.length > 0 && (
              <motion.div 
                className="p-3 bg-white rounded-lg border border-purple-100"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  Évolution conversationnelle
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-mono">
                    {cognitive.conversationEvolvedFrom}
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-mono">
                    {cognitive.conversationEvolvedTo}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Thèmes actifs */}
            <motion.div 
              className="p-3 bg-white rounded-lg border border-purple-100"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                Thèmes actifs prioritaires
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {cognitive.activeThemes.map((theme, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
                  >
                    {theme.name} <span className="text-purple-600">({theme.relevance})</span>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Utilisation mémoire */}
            <motion.div 
              className="p-3 bg-white rounded-lg border border-purple-100"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                Allocation cognitive
              </p>
              <div className="mt-2 space-y-2">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${cognitive.memoryUsage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-slate-600">
                  Ressources cognitives: {cognitive.memoryUsage}
                </p>
              </div>
            </motion.div>

            {/* Statut phase */}
            <motion.div 
              className="p-3 bg-white rounded-lg border border-purple-100"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-slate-600">
                <span className="font-semibold">Phase:</span> <span className="capitalize">{cognitive.phase}</span> 
                <span className="ml-2 text-xs text-slate-500">({cognitive.totalMessages} messages)</span>
              </p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Insight réflexif */}
        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200"
          >
            <p className="text-sm text-slate-700 italic">
              💭 <span className="font-semibold">Observation Druide:</span> "{insights.reflection}"
            </p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}