/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Meta-Learning System                                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useIntegrationRelay } from "@/components/system/IntegrationRelay";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Zap,
  Target,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { createPageUrl } from "@/utils";

export default function MetaLearning() {
  const [running, setRunning] = useState(false);
  const queryClient = useQueryClient();
  const { relayOn } = useIntegrationRelay();

  const { data: cycles = [] } = useQuery({
    queryKey: ['metaLearning'],
    queryFn: () => base44.entities.MetaLearning.list('-learning_cycle', 20)
  });

  const runMetaLearningMutation = useMutation({
    mutationFn: async () => {
      if (!relayOn) { alert("Arrêt interne — relais d'intégration désactivé. Activez le relais (bouton vert en bas à gauche) pour lancer un cycle."); return null; }
      setRunning(true);
      
      const algorithmTypes = [
        'pattern_recognition',
        'causal_inference',
        'emotional_processing',
        'memory_consolidation',
        'reasoning_optimization',
        'creativity_enhancement',
        'self_reflection'
      ];
      
      const randomAlgorithm = algorithmTypes[Math.floor(Math.random() * algorithmTypes.length)];
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es un système de META-APPRENTISSAGE pour Druide Omega.

Ton rôle: Améliorer l'algorithme "${randomAlgorithm}" en analysant ses performances et en proposant des optimisations.

TÂCHE:
1. Évalue la performance actuelle (accuracy, speed, efficiency, generalization)
2. Identifie les faiblesses et opportunités d'amélioration
3. Propose une stratégie d'optimisation concrète
4. Génère des insights sur comment améliorer cet algorithme
5. Détermine le prochain algorithme à optimiser

Retourne JSON avec:
- baseline_performance: {accuracy, speed, efficiency, generalization} (scores 0-100)
- improved_performance: {accuracy, speed, efficiency, generalization} (scores après amélioration)
- improvement_delta: % d'amélioration global
- learning_strategy: stratégie d'optimisation utilisée
- insights_discovered: array de insights
- success_rate: taux de succès (0-100)
- next_optimization_target: prochain algorithme à cibler`,
        response_json_schema: {
          type: "object",
          properties: {
            baseline_performance: {
              type: "object",
              properties: {
                accuracy: {type: "number"},
                speed: {type: "number"},
                efficiency: {type: "number"},
                generalization: {type: "number"}
              }
            },
            improved_performance: {
              type: "object",
              properties: {
                accuracy: {type: "number"},
                speed: {type: "number"},
                efficiency: {type: "number"},
                generalization: {type: "number"}
              }
            },
            improvement_delta: {type: "number"},
            learning_strategy: {type: "string"},
            insights_discovered: {type: "array", items: {type: "string"}},
            success_rate: {type: "number"},
            next_optimization_target: {type: "string"}
          }
        }
      });

      const cycleNumber = cycles.length + 1;

      await base44.entities.MetaLearning.create({
        learning_cycle: cycleNumber,
        algorithm_type: randomAlgorithm,
        ...result,
        failed_attempts: result.success_rate < 50 ? 1 : 0,
        applied_to_system: result.improvement_delta > 10
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metaLearning'] });
      setRunning(false);
    },
    onError: () => {
      setRunning(false);
    }
  });

  const getPerformanceColor = (delta) => {
    if (delta > 20) return 'text-green-600';
    if (delta > 10) return 'text-blue-600';
    if (delta > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 sm:px-6 py-8 sm:py-10 flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="ghost"
            size="sm"
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour Dashboard
          </Button>
          <div className="text-center">
          <div className="min-w-[64px] min-h-[64px] w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Meta-Apprentissage</h1>
          <p className="text-purple-100 text-base sm:text-lg">L'IA améliore ses propres algorithmes d'apprentissage</p>
          </div>
        </motion.div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <span className="hidden sm:inline">Lancer un Cycle de Meta-Apprentissage</span>
                  <span className="sm:hidden">Lancer Cycle</span>
                </h2>
                <p className="text-slate-600 mt-1 text-sm sm:text-base">
                  L'IA va analyser et optimiser un de ses algorithmes
                </p>
              </div>
              <Button
                onClick={() => runMetaLearningMutation.mutate()}
                disabled={running}
                size="lg"
                className="min-h-[48px] w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 touch-target"
              >
                {running ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span className="hidden sm:inline">En cours...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    <span className="hidden sm:inline">Lancer Meta-Apprentissage</span>
                    <span className="sm:hidden">Lancer</span>
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">{cycles.length}</div>
                <div className="text-sm text-slate-600">Cycles Complétés</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600">
                  {cycles.filter(c => c.applied_to_system).length}
                </div>
                <div className="text-sm text-slate-600">Améliorations Appliquées</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">
                  {cycles.length > 0 
                    ? Math.round(cycles.reduce((sum, c) => sum + (c.success_rate || 0), 0) / cycles.length)
                    : 0}%
                </div>
                <div className="text-sm text-slate-600">Taux de Succès Moyen</div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Historique des Cycles</h3>
            {cycles.map((cycle, index) => (
              <motion.div
                key={cycle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-purple-500 text-white">
                          Cycle #{cycle.learning_cycle}
                        </Badge>
                        <Badge variant="outline">
                          {cycle.algorithm_type?.replace(/_/g, ' ')}
                        </Badge>
                        {cycle.applied_to_system && (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Appliqué
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">
                        Stratégie: {cycle.learning_strategy}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getPerformanceColor(cycle.improvement_delta || 0)}`}>
                        +{cycle.improvement_delta?.toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-500">Amélioration</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {['accuracy', 'speed', 'efficiency', 'generalization'].map(metric => (
                      <div key={metric} className="bg-slate-50 rounded-lg p-3">
                        <div className="text-xs text-slate-600 capitalize mb-1">
                          {metric}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-400">
                            {cycle.baseline_performance?.[metric]?.toFixed(0) || 0}
                          </span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="text-sm font-bold text-slate-900">
                            {cycle.improved_performance?.[metric]?.toFixed(0) || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {cycle.insights_discovered && cycle.insights_discovered.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Insights Découverts
                      </h4>
                      <ul className="space-y-1">
                        {cycle.insights_discovered.map((insight, idx) => (
                          <li key={idx} className="text-sm text-purple-800">• {insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {cycle.next_optimization_target && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                      <Target className="w-4 h-4" />
                      Prochain objectif: <span className="font-semibold">{cycle.next_optimization_target}</span>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}