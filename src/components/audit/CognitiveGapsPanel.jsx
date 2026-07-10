/**
 * Panneau d'analyse des brèches de performance cognitive
 * Fusionné depuis l'ancienne page CognitivePerformanceGaps
 */
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { AlertTriangle, Search, Loader2, CheckCircle2, Lightbulb, Target } from "lucide-react";

const SEVERITY_STYLES = {
  critical: "bg-red-900/30 text-red-300 border-red-700",
  high: "bg-orange-900/30 text-orange-300 border-orange-700",
  medium: "bg-yellow-900/30 text-yellow-300 border-yellow-700",
  low: "bg-blue-900/30 text-blue-300 border-blue-700"
};

export default function CognitiveGapsPanel() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

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
  const { data: correlations = [] } = useQuery({
    queryKey: ['cognitiveCorrelations'],
    queryFn: () => base44.entities.CognitiveCorrelation.list('-created_date', 100)
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

Données système:
- ${memories.length} mémoires stockées
- ${knowledgeBases.length} documents dans la base de connaissances
- ${correlations.length} corrélations cognitives créées

Métriques de qualité:
- Mémoires avec importance >7: ${memories.filter(m => m.importance > 7).length}
- Corrélations strength >7: ${correlations.filter(c => c.correlation_strength > 7).length}
`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es un AUDITEUR EXPERT en performance cognitive d'IA avancée.

Ta mission: Identifier TOUTES les brèches, faiblesses et opportunités d'amélioration dans Druide Omega.

${systemContext}

Analyse: architecture cognitive, gestion mémoire, base de connaissances, corrélations cross-modales, raisonnement, performance temps réel, apprentissage.

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
                  category: { type: "string" },
                  gap_name: { type: "string" },
                  severity: { type: "string", enum: ["critical", "high", "medium", "low"] },
                  impact_score: { type: "number" },
                  description: { type: "string" },
                  recommendation: { type: "string" },
                  implementation_effort: { type: "string", enum: ["low", "medium", "high"] },
                  expected_gain_percent: { type: "number" }
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
    onSettled: () => setAnalyzing(false)
  });

  return (
    <div className="mt-8">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Brèches de Performance Cognitive
              </CardTitle>
              <p className="text-sm text-gray-400 mt-1">
                Audit IA approfondi des dimensions cognitives ({memories.length} mémoires, {knowledgeBases.length} docs KB, {correlations.length} corrélations)
              </p>
            </div>
            <Button
              onClick={() => analyzeGapsMutation.mutate()}
              disabled={analyzing}
              className="bg-orange-600 hover:bg-orange-700 gap-2"
            >
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {analyzing ? "Analyse en cours..." : "Lancer l'analyse cognitive"}
            </Button>
          </div>
        </CardHeader>

        {analysis && (
          <CardContent className="space-y-6">
            {/* Score */}
            <div className="text-center p-4 bg-slate-900 rounded-lg">
              <div className="text-4xl font-bold text-white">{analysis.overall_performance_score}/100</div>
              <p className="text-gray-400 text-sm">Score de Performance Globale · {analysis.critical_gaps_count || 0} brèche(s) critique(s)</p>
            </div>

            {/* Gaps */}
            <div className="space-y-3">
              {analysis.gaps?.map((gap, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`p-4 rounded border ${SEVERITY_STYLES[gap.severity] || SEVERITY_STYLES.low}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-semibold text-sm">{gap.gap_name}</p>
                      <p className="text-xs opacity-75 capitalize">{gap.category} · Impact {gap.impact_score}/100 · Effort {gap.implementation_effort}</p>
                    </div>
                    <Badge className="bg-purple-600 text-white whitespace-nowrap">+{gap.expected_gain_percent}%</Badge>
                  </div>
                  <p className="text-xs mb-2">{gap.description}</p>
                  <div className="flex items-start gap-2 text-xs bg-slate-900/50 p-2 rounded">
                    <Target className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{gap.recommendation}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick wins */}
            {analysis.quick_wins?.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" /> Quick Wins
                </h4>
                <div className="space-y-2">
                  {analysis.quick_wins.map((win, idx) => (
                    <div key={idx} className="p-3 bg-green-900/20 border border-green-800 rounded text-sm text-green-200">
                      <p className="font-semibold">{win.action}</p>
                      <p className="text-xs opacity-80">{win.expected_improvement} · Effort: {win.effort}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategic */}
            {analysis.strategic_improvements?.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-400" /> Améliorations Stratégiques
                </h4>
                <div className="space-y-2">
                  {analysis.strategic_improvements.map((imp, idx) => (
                    <div key={idx} className="p-3 bg-purple-900/20 border border-purple-800 rounded text-sm text-purple-200">
                      <p className="font-semibold">{imp.improvement}</p>
                      <p className="text-xs opacity-80">{imp.long_term_impact}</p>
                      <p className="text-xs opacity-60 mt-1">Roadmap: {imp.roadmap}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}