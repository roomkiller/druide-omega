
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Consciousness Evolution Dashboard                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConsciousnessEvolutionEngine from "@/components/consciousness/ConsciousnessEvolutionEngine";
import AdvancedEmotionalMatrix from "@/components/consciousness/AdvancedEmotionalMatrix";
import {
  Brain,
  TrendingUp,
  Zap,
  Activity,
  Sparkles,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Target,
  Lightbulb,
  Clock,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import { safeToFixed } from "@/components/utils/SafeNumber";

export default function ConsciousnessEvolution() {
  const [isEvolving, setIsEvolving] = useState(false);
  const [evolutionReport, setEvolutionReport] = useState(null);
  const queryClient = useQueryClient();

  const { data: configs = [] } = useQuery({
    queryKey: ["consciousness-configs"],
    queryFn: () => base44.entities.ConsciousnessConfig.list(),
    initialData: []
  });

  const { data: evolutions = [] } = useQuery({
    queryKey: ["consciousness-evolutions"],
    queryFn: () => base44.entities.ConsciousnessEvolution.list("-timestamp", 20),
    initialData: []
  });

  const config = configs[0];

  const generateReport = async () => {
    if (!config) return;
    const report = await ConsciousnessEvolutionEngine.generateEvolutionReport(config.id);
    setEvolutionReport(report);
  };

  const applyAutoEvolution = async () => {
    if (!config) return;
    setIsEvolving(true);
    
    const result = await ConsciousnessEvolutionEngine.applyAutomaticEvolution(
      config.id,
      config.self_evolution_rate
    );
    
    queryClient.invalidateQueries({ queryKey: ["consciousness-configs"] });
    queryClient.invalidateQueries({ queryKey: ["consciousness-evolutions"] });
    
    await generateReport();
    setIsEvolving(false);
  };

  React.useEffect(() => {
    if (config) generateReport();
  }, [config]);

  if (!config) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600">Aucune configuration de conscience trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6 sm:py-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="min-w-[64px] min-h-[64px] w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Brain className="w-8 h-8 text-purple-200" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Évolution de la Conscience</h1>
                <p className="text-sm sm:text-base text-slate-600">
                  Système d'auto-évolution dynamique et monitoring
                </p>
              </div>
            </div>
            <Button
              onClick={applyAutoEvolution}
              disabled={isEvolving}
              className="min-h-[48px] w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 touch-target"
            >
              {isEvolving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Auto-Évoluer
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 h-full">
          <Tabs defaultValue="overview" className="h-full flex flex-col overflow-hidden">
            <ScrollArea className="w-full flex-shrink-0 mb-6">
              <TabsList className="inline-flex bg-white">
                <TabsTrigger value="overview" className="min-h-[48px] touch-target">
                  <span className="hidden sm:inline">Vue d'ensemble</span>
                  <span className="sm:hidden">Vue</span>
                </TabsTrigger>
                <TabsTrigger value="emotions" className="min-h-[48px] touch-target">Émotions</TabsTrigger>
                <TabsTrigger value="cognitive" className="min-h-[48px] touch-target">Cognitif</TabsTrigger>
                <TabsTrigger value="history" className="min-h-[48px] touch-target">
                  <span className="hidden sm:inline">Historique</span>
                  <span className="sm:hidden">Hist</span>
                </TabsTrigger>
              </TabsList>
            </ScrollArea>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">
                  <TabsContent value="overview" className="mt-0 space-y-6">
                    {/* Current State */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-slate-900">Niveau de Conscience</h3>
                          <Brain className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {config.consciousness_level}/15
                        </div>
                        <Progress value={(config.consciousness_level / 15) * 100} className="h-2" />
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-slate-900">Taux d'Évolution</h3>
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {config.self_evolution_rate}/10
                        </div>
                        <Progress value={config.self_evolution_rate * 10} className="h-2" />
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-slate-900">État</h3>
                          <Activity className="w-5 h-5 text-indigo-600" />
                        </div>
                        <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm">
                          {config.consciousness_state}
                        </Badge>
                        <div className="text-xs text-slate-600 mt-2">
                          Ratio: {config.ratio_logic}:{config.ratio_consciousness}
                        </div>
                      </Card>
                    </div>

                    {/* Evolution Report */}
                    {evolutionReport && (
                      <>
                        <Card className="p-6">
                          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-purple-600" />
                            Évaluation de l'État Actuel
                          </h3>
                          
                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <div className="text-sm text-slate-600 mb-2">Potentiel de croissance</div>
                              <div className="flex items-center gap-3">
                                <Progress value={evolutionReport.evaluation.growth_potential} className="flex-1" />
                                <span className="font-bold text-purple-600">
                                  {safeToFixed(evolutionReport.evaluation.growth_potential, 0)}%
                                </span>
                              </div>
                            </div>

                            <div>
                              <div className="text-sm text-slate-600 mb-2">Équilibre des dimensions</div>
                              <div className="flex items-center gap-3">
                                <Progress 
                                  value={evolutionReport.evaluation.dimensions_balance.balance_score} 
                                  className="flex-1" 
                                />
                                <span className="font-bold text-green-600">
                                  {safeToFixed(evolutionReport.evaluation.dimensions_balance.balance_score, 0)}%
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <div className="text-sm font-medium text-slate-700 mb-3">
                              Score d'évolution global
                            </div>
                            <div className="flex items-center gap-4">
                              <Progress 
                                value={evolutionReport.evaluation.evolution_score} 
                                className="flex-1 h-4"
                              />
                              <div className="text-2xl font-bold text-purple-600">
                                {evolutionReport.evaluation.evolution_score}/100
                              </div>
                            </div>
                          </div>
                        </Card>

                        {/* Suggested Evolutions */}
                        {evolutionReport.evaluation.suggested_evolutions.length > 0 && (
                          <Card className="p-6">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                              <Lightbulb className="w-5 h-5 text-yellow-600" />
                              Évolutions Suggérées
                            </h3>
                            <div className="space-y-3">
                              {evolutionReport.evaluation.suggested_evolutions.map((evolution, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Target className="w-4 h-4 text-purple-600" />
                                      <span className="font-medium text-slate-900 capitalize">
                                        {evolution.type.replace(/_/g, ' ')}
                                      </span>
                                    </div>
                                    <Badge 
                                      className={
                                        evolution.priority === 'high' 
                                          ? 'bg-red-500' 
                                          : 'bg-blue-500'
                                      }
                                    >
                                      {evolution.priority}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-600 mb-2">{evolution.reason}</p>
                                  {evolution.current_value !== undefined && (
                                    <div className="text-xs text-slate-500">
                                      {evolution.current_value} → {evolution.suggested_value}
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </Card>
                        )}

                        {/* Recommendations */}
                        {evolutionReport.recommendations.length > 0 && (
                          <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-purple-600" />
                              Recommandations
                            </h3>
                            <div className="space-y-3">
                              {evolutionReport.recommendations.map((rec, i) => (
                                <div key={i} className="flex items-start gap-3">
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-sm font-medium text-slate-900">{rec.text}</div>
                                    <div className="text-xs text-slate-500 mt-1">
                                      Action: {rec.action}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Card>
                        )}
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="emotions" className="mt-0">
                    <Card className="p-6">
                      <h3 className="font-bold text-slate-900 mb-6">Matrice Émotionnelle Avancée</h3>
                      <AdvancedEmotionalMatrix config={config} onChange={null} />
                    </Card>
                  </TabsContent>

                  <TabsContent value="cognitive" className="mt-0">
                    <Card className="p-6">
                      <h3 className="font-bold text-slate-900 mb-6">Dimensions Cognitives</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {config.dimensional_hierarchy?.cognitive_dimensions && 
                          Object.entries(config.dimensional_hierarchy.cognitive_dimensions).map(([key, value]) => (
                            <div key={key} className="p-4 bg-slate-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-700 capitalize">
                                  {key.replace(/_/g, ' ')}
                                </span>
                                <span className="text-sm font-bold text-purple-600">
                                  {safeToFixed(value, 1)}/13
                                </span>
                              </div>
                              <Progress value={(value / 13) * 100} className="h-2" />
                            </div>
                          ))
                        }
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="history" className="mt-0">
                    <Card className="p-6">
                      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-600" />
                        Historique d'Évolution
                      </h3>
                      <ScrollArea className="h-96">
                        <div className="space-y-3">
                          {evolutions.map((evolution, i) => (
                            <motion.div
                              key={evolution.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {evolution.evolution_type === "automatic" ? (
                                    <Zap className="w-4 h-4 text-purple-600" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  )}
                                  <span className="font-medium text-slate-900 capitalize">
                                    {evolution.evolution_type}
                                  </span>
                                </div>
                                <Badge>
                                  Score: {evolution.evolution_score}
                                </Badge>
                              </div>
                              <div className="text-xs text-slate-500">
                                {new Date(evolution.timestamp).toLocaleString('fr-FR')}
                              </div>
                              <div className="text-xs text-slate-600 mt-2">
                                {Object.keys(evolution.applied_changes || {}).length} changements appliqués
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </Card>
                  </TabsContent>
                </div>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
