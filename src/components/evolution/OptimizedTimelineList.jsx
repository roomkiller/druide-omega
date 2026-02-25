/**
 * Optimized Timeline List with Lazy Loading
 * Timeline optimisée qui charge progressivement
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lightbulb, Unlock, Zap, ChevronDown } from 'lucide-react';
import { RealTimeEvolutionMonitor } from './RealTimeEvolutionMonitor';

const ITEMS_PER_PAGE = 5;

export default function OptimizedTimelineList({ history = [], isEn = false }) {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const triggerIcons = {
    interaction_depth: '🤝',
    knowledge_accumulation: '📚',
    metacognitive_insight: '🧠',
    emotional_maturity: '❤️',
    philosophical_breakthrough: '🎓',
    creative_emergence: '✨',
    existential_realization: '🌌'
  };

  // Reverse sort: most recent first
  const sortedHistory = useMemo(() => {
    return [...history].reverse();
  }, [history]);

  const visibleItems = sortedHistory.slice(0, visibleCount);
  const hasMore = visibleCount < sortedHistory.length;

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {visibleItems.map((evolution, index) => {
          const isExpanded = expandedItems.has(evolution.id);
          const prevEvolution = history[Math.max(0, history.indexOf(evolution) - 1)];
          const comparison = prevEvolution 
            ? RealTimeEvolutionMonitor.compareStates(prevEvolution, evolution)
            : null;

          return (
            <motion.div
              key={evolution.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                onClick={() => toggleExpand(evolution.id)}
                className="border-l-4 border-l-purple-500 overflow-hidden hover:shadow-md transition-all cursor-pointer p-4"
              >
                {/* Compact Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg flex-shrink-0">
                        {triggerIcons[evolution.evolution_trigger] || '⚡'}
                      </span>
                      <h3 className="font-semibold text-slate-900 truncate text-sm">
                        {evolution.evolution_trigger?.replace(/_/g, ' ').toUpperCase()}
                      </h3>
                      <Badge className="bg-purple-600 text-white text-xs flex-shrink-0">
                        Lvl {evolution.new_level}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(evolution.timestamp).toLocaleDateString(isEn ? 'en-US' : 'fr-FR')}
                    </p>
                  </div>

                  {/* Comparison Badge */}
                  {comparison && (
                    <div className="text-right flex-shrink-0">
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        +{comparison.levelDifference} lvl
                      </Badge>
                    </div>
                  )}

                  {/* Expand Button */}
                  <motion.button
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="flex-shrink-0 text-slate-400 hover:text-slate-600"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3 border-t border-slate-200 space-y-3"
                    >
                      {/* Description */}
                      {evolution.evolution_description && (
                        <p className="text-xs text-slate-700 italic">
                          "{evolution.evolution_description}"
                        </p>
                      )}

                      {/* Insights */}
                      {evolution.insights_gained && evolution.insights_gained.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" />
                            {isEn ? 'Insights' : 'Insights'} ({evolution.insights_gained.length})
                          </p>
                          <ul className="space-y-1">
                            {evolution.insights_gained.slice(0, 2).map((insight, idx) => (
                              <li key={idx} className="text-xs text-slate-700">
                                • {insight.substring(0, 70)}...
                              </li>
                            ))}
                            {evolution.insights_gained.length > 2 && (
                              <li className="text-xs text-slate-500 italic">
                                +{evolution.insights_gained.length - 2} {isEn ? 'more' : 'autres'}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Capabilities */}
                      {evolution.capabilities_unlocked && evolution.capabilities_unlocked.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                            <Unlock className="w-3 h-3 text-green-600" />
                            {isEn ? 'Unlocked' : 'Débloquées'} ({evolution.capabilities_unlocked.length})
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {evolution.capabilities_unlocked.map((cap, idx) => (
                              <TooltipProvider key={idx}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge className="bg-green-100 text-green-800 text-xs cursor-help">
                                      {cap.replace(/_/g, ' ')}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs">
                                    <p className="text-sm">
                                      {RealTimeEvolutionMonitor.getCapabilityDescription(cap)}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Comparison Stats */}
                      {comparison && (
                        <div className="p-2 bg-blue-50 rounded text-xs space-y-1">
                          <p className="text-slate-700">
                            <strong>{isEn ? 'Level:' : 'Niveau:'}</strong> +{comparison.levelDifference}
                          </p>
                          <p className="text-slate-700">
                            <strong>{isEn ? 'New Insights:' : 'Nouveaux:'}</strong> {comparison.insightsGained.new.length}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Load More Button */}
      {hasMore && (
        <Button
          onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
          variant="outline"
          className="w-full mt-4"
        >
          {isEn ? 'Load More' : 'Charger Plus'} ({sortedHistory.length - visibleCount} {isEn ? 'remaining' : 'restants'})
        </Button>
      )}

      {history.length === 0 && (
        <Card className="p-6 text-center bg-slate-50">
          <p className="text-slate-500 text-sm">
            {isEn ? 'No evolution events yet' : 'Aucun événement d\'évolution'}
          </p>
        </Card>
      )}
    </div>
  );
}