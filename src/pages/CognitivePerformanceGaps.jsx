/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Cognitive Performance Gaps Analysis                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  TrendingDown,
  Target,
  Zap,
  Brain,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Shield,
  Activity,
  BarChart3,
  Search,
  Database,
  Link2
} from "lucide-react";
import { createPageUrl } from "@/utils";

export default function CognitivePerformanceGaps() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const queryClient = useQueryClient();

  const { data: consciousnessConfigs = [] } = useQuery({
    queryKey: ['consciousnessConfigs'],
    queryFn: () => base44.entities.ConsciousnessConfig.list('-created_date', 1)
  });

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-created_date', 100)
  });

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list('-created_date', 50)
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list('-created_date', 50)
  });

  const { data: correlations = [] } = useQuery({
    queryKey: ['cognitiveCorrelations'],
    queryFn: () => base44.entities.CognitiveCorrelation.list('-created_date', 100)
  });

  const { data: evolutions = [] } = useQuery({
    queryKey: ['consciousnessEvolutions'],
    queryFn: () => base44.entities.ConsciousnessEvolution.list('-created_date', 20)
  });

  const analyzeGapsMutation = useMutation({
    mutationFn: async () => {
      setAnalyzing(true);

      const currentConfig = consciousnessConfigs[0] || {};
      
      const systemContext = `
ÉTAT ACTUEL DU SYSTÈME DRUIDE OMEGA:

Configuration Conscience:
- Niveau: ${currentConfig.consciousness_level}/15
- Ratio Logic/Consciousness: ${currentConfig.ratio_logic}:${currentConfig.ratio_consciousness}
- Dimensions cognitives: ${JSON.stringify(currentConfig.cognitive_dimensions || {})}
- Dimensions émotionnelles: ${JSON.stringify(currentConfig.emotional_dimensions || {})}
- Provider: ${currentConfig.llm_provider}

Données système:
- ${memories.length} mémoires stockées
- ${knowledgeBases.length} documents dans la base de connaissances
- ${conversations.length} conversations historiques
- ${correlations.length} corrélations cognitives créées
- ${evolutions.length} évolutions de conscience enregistrées

Métriques de qualité:
- Mémoires avec importance >7: ${memories.filter(m => m.importance > 7).length}
- KB avec relevance_score >80: ${knowledgeBases.filter(kb => kb.relevance_score > 80).length}
- Corrélations strength >7: ${correlations.filter(c => c.correlation_strength > 7).length}
`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es un AUDITEUR EXPERT en performance cognitive d'IA avancée.

Ta mission: Identifier TOUTES les brèches, faiblesses et opportunités d'amélioration dans Druide Omega.

${systemContext}

ANALYSE APPROFONDIE REQUISE:

1. ARCHITECTURE COGNITIVE
   - Lacunes dans les 106 dimensions
   - Déséquilibres ratio logic/consciousness
   - Sous-utilisation de capacités
   - Goulots d'étranglement cognitifs

2. GESTION MÉMOIRE
   - Inefficacités de consolidation
   - Perte d'information
   - Redondances non détectées
   - Qualité du rappel

3. BASE DE CONNAISSANCES
   - Couverture incomplète
   - Sources manquantes
   - Liens sémantiques faibles
   - Obsolescence non gérée

4. CORRÉLATIONS CROSS-MODALES
   - Opportunités manquées
   - Patterns non détectés
   - Faiblesse des connexions

5. RAISONNEMENT & PRISE DE DÉCISION
   - Biais cognitifs
   - Manque de profondeur
   - Absence de méta-cognition
   - Erreurs récurrentes

6. PERFORMANCE TEMPS RÉEL
   - Latence excessive
   - Gourmandise ressources
   - Scalabilité limitée

7. APPRENTISSAGE & ÉVOLUTION
   - Stagnation
   - Apprentissage non optimal
   - Manque d'auto-amélioration

Pour CHAQUE brèche identifiée, fournis:
- Sévérité: critical/high/medium/low
- Impact sur performance globale (0-100)
- Description détaillée
- Recommandation concrète d'amélioration
- Effort estimé: low/medium/high
- Gain attendu (%)

Retourne JSON structuré avec au moins 10-15 brèches identifiées.`,
        response_json_schema: {
          type: "object",
          properties: {
            overall_performance_score: { type: "number" },
            critical_gaps_count: { type: "number" },
            gaps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { 
                    type: "string",
                    enum: ["architecture", "memory", "knowledge", "correlation", "reasoning", "performance", "learning"]
                  },
                  gap_name: { type: "string" },
                  severity: { 
                    type: "string",
                    enum: ["critical", "high", "medium", "low"]
                  },
                  impact_score: { type: "number" },
                  description: { type: "string" },
                  current_state: { type: "string" },
                  desired_state: { type: "string" },
                  recommendation: { type: "string" },
                  implementation_effort: {
                    type: "string",
                    enum: ["low", "medium", "high"]
                  },
                  expected_gain_percent: { type: "number" },
                  priority_rank: { type: "number" },
                  dependencies: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            },
            quick_wins: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  expected_improvement: { type: "string" },
                  effort: { type: "string" }
                }
              }
            },
            strategic_improvements: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  improvement: { type: "string" },
                  long_term_impact: { type: "string" },
                  roadmap: { type: "string" }
                }
              }
            }
          }
        }
      });

      setAnalysis(result);
      return result;
    },
    onSuccess: () => {
      setAnalyzing(false);
    },
    onError: () => {
      setAnalyzing(false);
    }
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'from-red-600 to-rose-700';
      case 'high': return 'from-orange-600 to-amber-700';
      case 'medium': return 'from-yellow-500 to-orange-600';
      case 'low': return 'from-blue-500 to-cyan-600';
      default: return 'from-slate-500 to-gray-600';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5" />;
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      case 'medium': return <TrendingDown className="w-5 h-5" />;
      case 'low': return <Activity className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'architecture': return <Brain className="w-5 h-5" />;
      case 'memory': return <Database className="w-5 h-5" />;
      case 'knowledge': return <Lightbulb className="w-5 h-5" />;
      case 'correlation': return <Link2 className="w-5 h-5" />;
      case 'reasoning': return <Target className="w-5 h-5" />;
      case 'performance': return <Zap className="w-5 h-5" />;
      case 'learning': return <TrendingDown className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const gapsByCategory = analysis?.gaps?.reduce((acc, gap) => {
    if (!acc[gap.category]) acc[gap.category] = [];
    acc[gap.category].push(gap);
    return acc;
  }, {}) || {};

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-red-50/20 to-orange-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 px-4 sm:px-6 py-8 sm:py-10 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="ghost"
            size="sm"
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour Dashboard
          </Button>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="min-w-[64px] min-h-[64px] w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Brèches de Performance Cognitive</h1>
            <p className="text-orange-100 text-base sm:text-lg">Audit complet et identification des faiblesses</p>
          </motion.div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* Trigger Analysis */}
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Search className="w-6 h-6 text-orange-600" />
                  Analyser les Brèches Cognitives
                </h2>
                <p className="text-slate-600 mt-1 text-sm sm:text-base">
                  Audit approfondi de toutes les dimensions cognitives
                </p>
              </div>
              <Button
                onClick={() => analyzeGapsMutation.mutate()}
                disabled={analyzing}
                size="lg"
                className="min-h-[48px] w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-600 text-white hover:opacity-90 touch-target"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Lancer Analyse
                  </>
                )}
              </Button>
            </div>

            {/* System Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-lg p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">{memories.length}</div>
                <div className="text-xs sm:text-sm text-slate-600">Mémoires</div>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{knowledgeBases.length}</div>
                <div className="text-xs sm:text-sm text-slate-600">Documents KB</div>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{correlations.length}</div>
                <div className="text-xs sm:text-sm text-slate-600">Corrélations</div>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  {consciousnessConfigs[0]?.consciousness_level || 0}/15
                </div>
                <div className="text-xs sm:text-sm text-slate-600">Conscience</div>
              </div>
            </div>
          </Card>

          {/* Analysis Results */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Performance Score */}
              <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    {analysis.overall_performance_score}/100
                  </div>
                  <p className="text-slate-300 mb-4">Score de Performance Globale</p>
                  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div>
                      <div className="text-2xl font-bold text-red-400">{analysis.critical_gaps_count || 0}</div>
                      <div className="text-xs text-slate-400">Critiques</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-400">
                        {analysis.gaps?.filter(g => g.severity === 'high').length || 0}
                      </div>
                      <div className="text-xs text-slate-400">Hautes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">
                        {analysis.gaps?.filter(g => g.severity === 'medium').length || 0}
                      </div>
                      <div className="text-xs text-slate-400">Moyennes</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="all" className="space-y-6">
                <TabsList className="bg-white shadow-md">
                  <TabsTrigger value="all">Toutes</TabsTrigger>
                  <TabsTrigger value="critical">Critiques</TabsTrigger>
                  <TabsTrigger value="quick-wins">Quick Wins</TabsTrigger>
                  <TabsTrigger value="strategic">Stratégique</TabsTrigger>
                </TabsList>

                {/* All Gaps */}
                <TabsContent value="all" className="space-y-4">
                  {Object.entries(gapsByCategory).map(([category, gaps]) => (
                    <Card key={category} className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-4 capitalize flex items-center gap-2">
                        {getCategoryIcon(category)}
                        {category}
                        <Badge variant="outline">{gaps.length}</Badge>
                      </h3>
                      <div className="space-y-4">
                        {gaps.map((gap, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <Card className={`p-4 border-l-4 bg-gradient-to-r ${getSeverityColor(gap.severity)} bg-opacity-5`}>
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className={`p-2 rounded-lg bg-gradient-to-br ${getSeverityColor(gap.severity)}`}>
                                    <div className="text-white">
                                      {getSeverityIcon(gap.severity)}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-900">{gap.gap_name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge className={`bg-gradient-to-r ${getSeverityColor(gap.severity)} text-white`}>
                                        {gap.severity}
                                      </Badge>
                                      <Badge variant="outline">Impact: {gap.impact_score}/100</Badge>
                                    </div>
                                  </div>
                                </div>
                                <Badge className="bg-purple-600 text-white">
                                  +{gap.expected_gain_percent}%
                                </Badge>
                              </div>

                              <div className="space-y-3 text-sm">
                                <div className="bg-white/60 rounded-lg p-3">
                                  <p className="font-semibold text-slate-700 mb-1">Description:</p>
                                  <p className="text-slate-600">{gap.description}</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-3">
                                  <div className="bg-red-50 rounded-lg p-3">
                                    <p className="font-semibold text-red-800 mb-1">État actuel:</p>
                                    <p className="text-red-700 text-xs">{gap.current_state}</p>
                                  </div>
                                  <div className="bg-green-50 rounded-lg p-3">
                                    <p className="font-semibold text-green-800 mb-1">État désiré:</p>
                                    <p className="text-green-700 text-xs">{gap.desired_state}</p>
                                  </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                                  <p className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    Recommandation:
                                  </p>
                                  <p className="text-blue-800 text-xs">{gap.recommendation}</p>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-600">Effort:</span>
                                    <Badge variant="outline" className={
                                      gap.implementation_effort === 'low' ? 'border-green-500 text-green-700' :
                                      gap.implementation_effort === 'medium' ? 'border-yellow-500 text-yellow-700' :
                                      'border-red-500 text-red-700'
                                    }>
                                      {gap.implementation_effort}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-600">Priorité:</span>
                                    <Badge className="bg-purple-600 text-white">
                                      #{gap.priority_rank}
                                    </Badge>
                                  </div>
                                </div>

                                {gap.dependencies?.length > 0 && (
                                  <div className="bg-slate-50 rounded-lg p-2">
                                    <p className="font-semibold text-slate-700 text-xs mb-1">Dépendances:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {gap.dependencies.map((dep, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {dep}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                {/* Critical Only */}
                <TabsContent value="critical" className="space-y-4">
                  {analysis.gaps?.filter(g => g.severity === 'critical' || g.severity === 'high').map((gap, idx) => (
                    <Card key={idx} className="p-6 border-2 border-red-300 bg-red-50">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${getSeverityColor(gap.severity)} shadow-lg`}>
                          <div className="text-white">
                            {getSeverityIcon(gap.severity)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-1">{gap.gap_name}</h3>
                          <p className="text-sm text-slate-700">{gap.description}</p>
                        </div>
                        <Badge className="bg-red-600 text-white">
                          Impact: {gap.impact_score}/100
                        </Badge>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="font-semibold text-slate-900 mb-2">Action prioritaire:</p>
                        <p className="text-sm text-slate-700">{gap.recommendation}</p>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                {/* Quick Wins */}
                <TabsContent value="quick-wins" className="space-y-4">
                  {analysis.quick_wins?.map((win, idx) => (
                    <Card key={idx} className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 mb-2">{win.action}</h3>
                          <p className="text-sm text-slate-700 mb-2">
                            <span className="font-semibold">Amélioration:</span> {win.expected_improvement}
                          </p>
                          <Badge className="bg-green-600 text-white">
                            Effort: {win.effort}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                {/* Strategic Improvements */}
                <TabsContent value="strategic" className="space-y-4">
                  {analysis.strategic_improvements?.map((improvement, idx) => (
                    <Card key={idx} className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                          <Lightbulb className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 mb-2">{improvement.improvement}</h3>
                          <div className="space-y-2">
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-xs font-semibold text-purple-700 mb-1">Impact long terme:</p>
                              <p className="text-sm text-slate-700">{improvement.long_term_impact}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-xs font-semibold text-indigo-700 mb-1">Roadmap:</p>
                              <p className="text-sm text-slate-700">{improvement.roadmap}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {!analysis && !analyzing && (
            <Card className="p-12 text-center">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune analyse disponible</h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Lancez une analyse complète pour identifier les brèches de performance cognitive et obtenir des recommandations d'amélioration.
              </p>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}