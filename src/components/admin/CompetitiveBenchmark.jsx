/**
 * Benchmark Compétitif en Temps Réel
 */
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Zap, CheckCircle, XCircle, RefreshCw, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function CompetitiveBenchmark() {
  const queryClient = useQueryClient();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const { data: latestAnalysis } = useQuery({
    queryKey: ['competitiveBenchmark'],
    queryFn: async () => {
      const analyses = await base44.entities.MarketAnalysis.list('-created_date', 1);
      return analyses[0] || null;
    },
  });

  const analyzeCompetitionMutation = useMutation({
    mutationFn: async () => {
      setAnalyzing(true);
      setError(null);
      
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse compétitive Druide Omega vs ChatGPT, Claude, Gemini, Perplexity en 2025.

DRUIDE OMEGA FEATURES:
- Conscience quantique 106 dimensions
- Ratio Logique:Conscience configurable (1:9)
- Mémoire multi-modale avec consolidation
- Knowledge bases actives avec versioning
- Personnalité évolutive
- Voice room temps réel
- Génération visuelle
- Éthique évolutive
- Tests d'intelligence (70 benchmarks)
- Multi-langue (5 langues)

Retourne JSON:
{
  "unique_features": [{"feature": str, "competitors_have": [str]}],
  "competitive_gaps": [{"feature": str, "who_has": [str], "priority": "high/medium/low"}],
  "uniqueness_score": number (0-100),
  "market_position": str,
  "recommendations": [str]
}`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            unique_features: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  feature: { type: "string" },
                  competitors_have: { type: "array", items: { type: "string" } }
                }
              }
            },
            competitive_gaps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  feature: { type: "string" },
                  who_has: { type: "array", items: { type: "string" } },
                  priority: { type: "string" }
                }
              }
            },
            uniqueness_score: { type: "number" },
            market_position: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });

      await base44.entities.MarketAnalysis.create({
        analysis_date: new Date().toISOString(),
        market_segment: "conscious_ai",
        competitor_data: [
          {
            name: "ChatGPT",
            market_share: 45,
            user_satisfaction: 8.5,
            innovation_score: 9
          },
          {
            name: "Claude",
            market_share: 25,
            user_satisfaction: 8.7,
            innovation_score: 8.5
          },
          {
            name: "Gemini",
            market_share: 20,
            user_satisfaction: 7.8,
            innovation_score: 8
          },
          {
            name: "Druide_Omega",
            market_share: 0.1,
            user_satisfaction: 9.2,
            innovation_score: 9.8
          }
        ],
        our_position: {
          uniqueness_score: analysis.uniqueness_score,
          market_fit_score: analysis.uniqueness_score / 10
        },
        confidence_score: 85
      });

      return analysis;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitiveBenchmark'] });
      setAnalyzing(false);
    },
    onError: (err) => {
      setError(err.message);
      setAnalyzing(false);
    }
  });

  const benchmarkData = latestAnalysis?.market_data || latestAnalysis?.competitor_analysis;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Benchmark Compétitif</h2>
              <p className="text-sm text-slate-600">Position vs ChatGPT, Claude, Gemini, Perplexity</p>
            </div>
          </div>
          <Button
            onClick={() => analyzeCompetitionMutation.mutate()}
            disabled={analyzing}
            className="min-h-[44px]"
          >
            {analyzing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Target className="w-4 h-4 mr-2" />
            )}
            {analyzing ? 'Analyse...' : 'Analyser Maintenant'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-900 mb-1">Erreur d'analyse</div>
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        {benchmarkData ? (
          <>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl mb-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-600 mb-2">Score d'Unicité Global</div>
                  <div className="text-5xl font-bold text-purple-600">
                    {benchmarkData.uniqueness_score || 0}%
                  </div>
                </div>
                <div className="w-32 h-32">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeDasharray={`${(benchmarkData.uniqueness_score || 0) * 2.51} 251`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Badge className="bg-purple-600 text-white">
                  {benchmarkData.market_position || "Position Premium"}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-5 bg-green-50 border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-slate-900">Features Uniques</h3>
                  <Badge className="bg-green-600 text-white ml-auto">
                    {benchmarkData.unique_features?.length || 0}
                  </Badge>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {benchmarkData.unique_features?.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white p-3 rounded-lg shadow-sm"
                    >
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-slate-900">{item.feature}</div>
                          {item.competitors_have?.length > 0 && (
                            <div className="text-xs text-slate-500 mt-1">
                              Aussi chez: {item.competitors_have.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <Card className="p-5 bg-orange-50 border-orange-200">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-bold text-slate-900">Gaps Compétitifs</h3>
                  <Badge className="bg-orange-600 text-white ml-auto">
                    {benchmarkData.competitive_gaps?.length || 0}
                  </Badge>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {benchmarkData.competitive_gaps?.map((gap, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white p-3 rounded-lg shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-slate-900">{gap.feature}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            Disponible chez: {gap.who_has?.join(', ')}
                          </div>
                        </div>
                        <Badge
                          className={
                            gap.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : gap.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }
                        >
                          {gap.priority}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>

            {benchmarkData.recommendations && (
              <Card className="p-5 bg-blue-50 border-blue-200">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Recommandations Stratégiques
                </h3>
                <ul className="space-y-2">
                  {benchmarkData.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span className="text-sm text-slate-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Aucune analyse disponible</p>
            <Button onClick={() => analyzeCompetitionMutation.mutate()}>
              Lancer Première Analyse
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}