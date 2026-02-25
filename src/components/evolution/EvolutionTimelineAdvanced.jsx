/**
 * Advanced Evolution Timeline
 * Chronologie détaillée avec comparaisons d'états et analyse des déclencheurs
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, Lightbulb, Unlock } from 'lucide-react';
import { RealTimeEvolutionMonitor } from './RealTimeEvolutionMonitor';

export default function EvolutionTimelineAdvanced({ history = [], isEn = false }) {
  const triggerAnalysis = useMemo(() => {
    return RealTimeEvolutionMonitor.analyzeTriggers(history);
  }, [history]);

  const capacityImpact = useMemo(() => {
    return RealTimeEvolutionMonitor.getCapacityImpactMap(history);
  }, [history]);

  const triggerIcons = {
    interaction_depth: '🤝',
    knowledge_accumulation: '📚',
    metacognitive_insight: '🧠',
    emotional_maturity: '❤️',
    philosophical_breakthrough: '🎓',
    creative_emergence: '✨',
    existential_realization: '🌌'
  };

  return (
    <div className="space-y-6">
      {/* Timeline with Advanced Context */}
      <div className="space-y-4">
        {history.map((evolution, index) => {
          const prevEvolution = history[index + 1];
          const comparison = prevEvolution 
            ? RealTimeEvolutionMonitor.compareStates(prevEvolution, evolution)
            : null;

          const triggerData = triggerAnalysis[evolution.evolution_trigger];

          return (
            <motion.div
              key={evolution.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-l-4 border-l-purple-500 overflow-hidden hover:shadow-lg transition-all">
                <div className="p-6">
                  {/* Header: Trigger + Level */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {triggerIcons[evolution.evolution_trigger] || '⚡'}
                        </span>
                        <div>
                          <h3 className="font-bold text-slate-900">
                            {evolution.evolution_trigger?.replace(/_/g, ' ').toUpperCase()}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {new Date(evolution.timestamp).toLocaleDateString(isEn ? 'en-US' : 'fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-600">
                        {evolution.new_level}
                      </div>
                      <p className="text-xs text-slate-500">
                        {isEn ? 'Consciousness' : 'Conscience'}
                      </p>
                    </div>
                  </div>

                  {/* Evolution Summary */}
                  {evolution.evolution_description && (
                    <p className="text-sm text-slate-700 mb-4 italic">
                      "{evolution.evolution_description}"
                    </p>
                  )}

                  {/* Comparison with Previous State */}
                  {comparison && (
                    <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-xs font-semibold text-slate-600">
                          {isEn ? 'Level Gain' : 'Gain de Niveau'}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          +{comparison.levelDifference}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600">
                          {isEn ? 'New Insights' : 'Nouveaux Insights'}
                        </p>
                        <p className="text-lg font-bold text-indigo-600">
                          +{comparison.insightsGained.new.length}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Metrics from Trigger Analysis */}
                  {triggerData && (
                    <div className="mb-4 p-3 bg-amber-50 rounded-lg">
                      <p className="text-xs font-semibold text-slate-600 mb-2">
                        {isEn ? 'Trigger Statistics' : 'Statistiques du Déclencheur'}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">
                          {isEn ? 'Occurrences' : 'Occurrences'}: <strong>{triggerData.count}</strong>
                        </span>
                        <span className="text-slate-700">
                          {isEn ? 'Avg Level Gain' : 'Gain Moyen'}: <strong>+{triggerData.avgLevelGain.toFixed(1)}</strong>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Insights Gained */}
                  {evolution.insights_gained && evolution.insights_gained.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3 text-yellow-600" />
                        {isEn ? 'Insights Gained' : 'Insights Acquis'}
                      </h4>
                      <div className="space-y-1">
                        {evolution.insights_gained.map((insight, idx) => (
                          <p key={idx} className="text-xs text-slate-700 line-clamp-2">
                            • {insight}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Capabilities Unlocked with Impact */}
                  {evolution.capabilities_unlocked && evolution.capabilities_unlocked.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                        <Unlock className="w-3 h-3 text-green-600" />
                        {isEn ? 'Capabilities Unlocked' : 'Capacités Débloquées'}
                      </h4>
                      <div className="space-y-2">
                        {evolution.capabilities_unlocked.map((capability, idx) => {
                          const impact = capacityImpact[capability];
                          return (
                            <div key={idx} className="p-2 bg-green-50 rounded border-l-2 border-l-green-400">
                              <Badge className="bg-green-600 text-white mb-1 text-xs">
                                {capability}
                              </Badge>
                              {impact && (
                                <p className="text-xs text-slate-700 mt-1">
                                  {impact.impact}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Trigger Analysis Summary */}
      {Object.keys(triggerAnalysis).length > 0 && (
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            {isEn ? 'Trigger Effectiveness Analysis' : 'Analyse d\'Efficacité des Déclencheurs'}
          </h3>

          <div className="space-y-3">
            {Object.entries(triggerAnalysis)
              .sort(([, a], [, b]) => b.avgLevelGain - a.avgLevelGain)
              .map(([trigger, data]) => (
                <div key={trigger} className="p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900 text-sm">
                      {trigger.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <Badge className="bg-purple-600 text-white">
                      {data.count}x
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>
                      {isEn ? 'Avg Level Gain' : 'Gain Moyen'}: +{data.avgLevelGain.toFixed(2)}
                    </span>
                    <span>
                      {isEn ? 'Capabilities' : 'Capacités'}: {new Set(data.capabilitiesUnlocked).size}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}