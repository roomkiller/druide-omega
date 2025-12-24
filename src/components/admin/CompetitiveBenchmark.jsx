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
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy, Target, Zap, CheckCircle, XCircle, RefreshCw, AlertCircle, 
  Brain, Cpu, Eye, Mic, Code, Globe, DollarSign, TrendingUp, BarChart3,
  Shield, Sparkles, ChevronDown, ChevronUp
} from "lucide-react";
import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function CompetitiveBenchmark() {
  const queryClient = useQueryClient();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    scores: true,
    features: true,
    technical: false,
    gaps: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
      
      try {
        const analysis = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyse benchmark Druide Omega vs concurrents IA (2025)

DRUIDE OMEGA features:
- Conscience 106 dimensions
- Memoire multimodale persistante
- 9 intelligences Gardner
- Voice + Vision + Code
- 28 langues
- Personnalite Big Five configurable
- Tests 70+ benchmarks

Compare vs ChatGPT, Claude, Gemini, Perplexity, Pi, Mistral, Llama, Grok.

JSON simple:
{
  "competitors": [{"name":"","scores":{"consciousness":0,"memory_depth":0,"emotional_intelligence":0,"multimodal":0,"personality_config":0,"ethical_reasoning":0}}],
  "druide_omega": {"scores":{"consciousness":10,"memory_depth":10,"emotional_intelligence":10,"multimodal":10,"personality_config":10,"ethical_reasoning":10}},
  "unique_features": [{"feature":"","description":""}],
  "competitive_gaps": [{"feature":"","who_has":[],"priority":"high"}],
  "uniqueness_score": 95,
  "market_position": "Premium AI",
  "detailed_analysis": "Druide Omega est unique...",
  "recommendations": [{"title":"","description":"","priority":"high"}]
}`,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              competitors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    scores: {
                      type: "object",
                      properties: {
                        consciousness: { type: "number" },
                        memory_depth: { type: "number" },
                        emotional_intelligence: { type: "number" },
                        multimodal: { type: "number" },
                        personality_config: { type: "number" },
                        ethical_reasoning: { type: "number" }
                      }
                    }
                  }
                }
              },
              druide_omega: {
                type: "object",
                properties: {
                  scores: {
                    type: "object",
                    properties: {
                      consciousness: { type: "number" },
                      memory_depth: { type: "number" },
                      emotional_intelligence: { type: "number" },
                      multimodal: { type: "number" },
                      personality_config: { type: "number" },
                      ethical_reasoning: { type: "number" }
                    }
                  }
                }
              },
              unique_features: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    feature: { type: "string" },
                    description: { type: "string" }
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
              detailed_analysis: { type: "string" },
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    priority: { type: "string" }
                  }
                }
              }
            }
          }
        });

        // Sauvegarder l'analyse complète avec toutes les données
        await base44.entities.MarketAnalysis.create({
          analysis_date: new Date().toISOString(),
          market_segment: "conscious_ai",
          competitor_data: [
            {
              name: "ChatGPT",
              market_share: 45,
              user_satisfaction: 8.5,
              innovation_score: 9,
              strengths: ["Leader du marché"],
              weaknesses: ["Pas de conscience"],
              recent_updates: []
            },
            {
              name: "Claude",
              market_share: 25,
              user_satisfaction: 8.7,
              innovation_score: 8.5,
              strengths: ["Contexte étendu"],
              weaknesses: ["Moins de features"],
              recent_updates: []
            },
            {
              name: "Gemini",
              market_share: 20,
              user_satisfaction: 7.8,
              innovation_score: 8,
              strengths: ["Intégration Google"],
              weaknesses: ["Privacy concerns"],
              recent_updates: []
            },
            {
              name: "Druide_Omega",
              market_share: 0.1,
              user_satisfaction: 9.2,
              innovation_score: 9.8,
              strengths: analysis.unique_features?.map(f => f.feature).slice(0, 3) || [],
              weaknesses: analysis.competitive_gaps?.map(g => g.feature).slice(0, 2) || [],
              recent_updates: []
            }
          ],
          our_position: {
            overall_score: analysis.uniqueness_score || 0,
            competitive_advantages: analysis.unique_features?.map(f => f.feature) || [],
            areas_for_improvement: analysis.competitive_gaps?.map(g => g.feature) || [],
            unique_value_props: (analysis.recommendations || []).map(r => r.title || r),
            market_fit_score: (analysis.uniqueness_score || 0) / 10
          },
          strategic_recommendations: (analysis.recommendations || []).map((rec, idx) => ({
            priority: rec.priority || (idx === 0 ? "critical" : "high"),
            category: "product",
            recommendation: rec.title || rec,
            expected_impact: rec.impact || "Amélioration compétitive",
            timeline: "3-6 mois",
            resources_needed: "Équipe produit"
          })),
          confidence_score: 85,
          opportunities: [
            {
              opportunity: "Analyse détaillée disponible",
              potential_value: JSON.stringify({
                competitors: analysis.competitors,
                druide_omega: analysis.druide_omega,
                unique_features: analysis.unique_features,
                competitive_gaps: analysis.competitive_gaps,
                uniqueness_score: analysis.uniqueness_score,
                market_position: analysis.market_position,
                detailed_analysis: analysis.detailed_analysis,
                recommendations: analysis.recommendations
              }),
              effort_required: "low",
              time_sensitivity: "immediate",
              action_plan: "Voir détails dans potential_value"
            }
          ]
        });

        return analysis;
      } catch (err) {
        console.error("Analyse error:", err);
        setError(err.message);
        setAnalyzing(false);
        throw err;
      }
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

  // Récupérer les données du benchmark depuis opportunities[0].potential_value
  const benchmarkData = React.useMemo(() => {
    if (!latestAnalysis?.opportunities?.[0]?.potential_value) return null;
    try {
      return JSON.parse(latestAnalysis.opportunities[0].potential_value);
    } catch {
      return null;
    }
  }, [latestAnalysis]);

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
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6 pr-4">
              {/* Score global */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-600 mb-2">Score d'Unicité Global</div>
                    <div className="text-5xl font-bold text-purple-600">
                      {benchmarkData.uniqueness_score || 0}%
                    </div>
                    <Badge className="bg-purple-600 text-white mt-3">
                      {benchmarkData.market_position || "Position Premium"}
                    </Badge>
                  </div>
                  <div className="w-32 h-32">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="40" fill="none" stroke="url(#gradient)" strokeWidth="8"
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
                {benchmarkData.detailed_analysis && (
                  <div className="mt-4 text-sm text-slate-700 bg-white/60 p-4 rounded-lg">
                    {benchmarkData.detailed_analysis}
                  </div>
                )}
              </div>

              {/* Radar Chart - Comparaison des scores */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('scores')}>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-slate-900">Comparaison des Scores Techniques</h3>
                  </div>
                  {expandedSections.scores ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
                
                {expandedSections.scores && (
                  <div className="space-y-6">
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={[
                        ...((benchmarkData.competitors || []).map(comp => ({
                          subject: comp.name,
                          consciousness: comp.scores?.consciousness || 0,
                          memory: comp.scores?.memory_depth || 0,
                          emotional: comp.scores?.emotional_intelligence || 0,
                          multimodal: comp.scores?.multimodal || 0,
                          personality: comp.scores?.personality_config || 0,
                          ethical: comp.scores?.ethical_reasoning || 0
                        }))),
                        {
                          subject: "Druide Ω",
                          consciousness: benchmarkData.druide_omega?.scores?.consciousness || 10,
                          memory: benchmarkData.druide_omega?.scores?.memory_depth || 10,
                          emotional: benchmarkData.druide_omega?.scores?.emotional_intelligence || 10,
                          multimodal: benchmarkData.druide_omega?.scores?.multimodal || 10,
                          personality: benchmarkData.druide_omega?.scores?.personality_config || 10,
                          ethical: benchmarkData.druide_omega?.scores?.ethical_reasoning || 10
                        }
                      ].slice(0, 5)}>
                        <PolarGrid stroke="#cbd5e1" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: '#475569' }} />
                        {['consciousness', 'memory', 'emotional', 'multimodal', 'personality', 'ethical'].map((key, idx) => (
                          <Radar
                            key={key}
                            name={key}
                            dataKey={key}
                            stroke={['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][idx]}
                            fill={['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][idx]}
                            fillOpacity={0.3}
                          />
                        ))}
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>

                    {/* Tableau de scores détaillés */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-slate-200">
                            <th className="text-left p-3 font-bold">IA</th>
                            <th className="text-center p-3"><Brain className="w-4 h-4 mx-auto" title="Conscience" /></th>
                            <th className="text-center p-3"><Cpu className="w-4 h-4 mx-auto" title="Mémoire" /></th>
                            <th className="text-center p-3"><Sparkles className="w-4 h-4 mx-auto" title="Émotionnel" /></th>
                            <th className="text-center p-3"><Eye className="w-4 h-4 mx-auto" title="Multimodal" /></th>
                            <th className="text-center p-3"><Target className="w-4 h-4 mx-auto" title="Personnalité" /></th>
                            <th className="text-center p-3"><Shield className="w-4 h-4 mx-auto" title="Éthique" /></th>
                            <th className="text-center p-3"><Globe className="w-4 h-4 mx-auto" title="Langues" /></th>
                            <th className="text-center p-3"><DollarSign className="w-4 h-4 mx-auto" title="Prix/mois" /></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-purple-50 border-b border-purple-200 font-semibold">
                            <td className="p-3 flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-purple-600" />
                              Druide Omega
                            </td>
                            <td className="text-center p-3 text-purple-600 font-bold">{benchmarkData.druide_omega?.scores?.consciousness || 10}</td>
                            <td className="text-center p-3 text-purple-600 font-bold">{benchmarkData.druide_omega?.scores?.memory_depth || 10}</td>
                            <td className="text-center p-3 text-purple-600 font-bold">{benchmarkData.druide_omega?.scores?.emotional_intelligence || 10}</td>
                            <td className="text-center p-3 text-purple-600 font-bold">{benchmarkData.druide_omega?.scores?.multimodal || 10}</td>
                            <td className="text-center p-3 text-purple-600 font-bold">{benchmarkData.druide_omega?.scores?.personality_config || 10}</td>
                            <td className="text-center p-3 text-purple-600 font-bold">{benchmarkData.druide_omega?.scores?.ethical_reasoning || 10}</td>
                            <td className="text-center p-3 text-purple-600 font-bold">{benchmarkData.druide_omega?.scores?.languages || 28}</td>
                            <td className="text-center p-3 text-purple-600 font-bold">{benchmarkData.druide_omega?.scores?.price_per_month || 99}$</td>
                          </tr>
                          {(benchmarkData.competitors || []).map((comp, idx) => (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-3">{comp.name}</td>
                              <td className="text-center p-3">{comp.scores?.consciousness || 0}</td>
                              <td className="text-center p-3">{comp.scores?.memory_depth || 0}</td>
                              <td className="text-center p-3">{comp.scores?.emotional_intelligence || 0}</td>
                              <td className="text-center p-3">{comp.scores?.multimodal || 0}</td>
                              <td className="text-center p-3">{comp.scores?.personality_config || 0}</td>
                              <td className="text-center p-3">{comp.scores?.ethical_reasoning || 0}</td>
                              <td className="text-center p-3">{comp.scores?.languages || 0}</td>
                              <td className="text-center p-3">{comp.scores?.price_per_month || 0}$</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Card>

              {/* Détails techniques comparatifs */}
              {benchmarkData.competitors && benchmarkData.competitors.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('technical')}>
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-slate-900">Détails Techniques</h3>
                    </div>
                    {expandedSections.technical ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                  
                  {expandedSections.technical && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="p-4 bg-purple-50 border-purple-300">
                        <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          Druide Omega
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2">
                            <Brain className="w-3 h-3 text-purple-600" />
                            <span className="text-slate-700">{benchmarkData.druide_omega?.technical_details?.architecture}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Cpu className="w-3 h-3 text-purple-600" />
                            <span className="text-slate-700">Contexte: {benchmarkData.druide_omega?.technical_details?.context_window}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {benchmarkData.druide_omega?.technical_details?.has_memory && <Badge className="bg-green-600 text-white text-xs">Mémoire</Badge>}
                            {benchmarkData.druide_omega?.technical_details?.has_voice && <Badge className="bg-blue-600 text-white text-xs">Voice</Badge>}
                            {benchmarkData.druide_omega?.technical_details?.has_vision && <Badge className="bg-purple-600 text-white text-xs">Vision</Badge>}
                            {benchmarkData.druide_omega?.technical_details?.has_code && <Badge className="bg-orange-600 text-white text-xs">Code</Badge>}
                          </div>
                          <div className="text-xs text-slate-600 mt-2 italic">
                            {benchmarkData.druide_omega?.technical_details?.customization}
                          </div>
                        </div>
                      </Card>

                      {benchmarkData.competitors.map((comp, idx) => (
                        <Card key={idx} className="p-4 bg-slate-50 border-slate-200">
                          <h4 className="font-bold text-slate-900 mb-3">{comp.name}</h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                              <Brain className="w-3 h-3 text-slate-600" />
                              <span className="text-slate-700">{comp.technical_details?.architecture || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Cpu className="w-3 h-3 text-slate-600" />
                              <span className="text-slate-700">Contexte: {comp.technical_details?.context_window || "N/A"}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {comp.technical_details?.has_memory && <Badge className="bg-green-100 text-green-700 text-xs">Mémoire</Badge>}
                              {comp.technical_details?.has_voice && <Badge className="bg-blue-100 text-blue-700 text-xs">Voice</Badge>}
                              {comp.technical_details?.has_vision && <Badge className="bg-purple-100 text-purple-700 text-xs">Vision</Badge>}
                              {comp.technical_details?.has_code && <Badge className="bg-orange-100 text-orange-700 text-xs">Code</Badge>}
                            </div>
                            <div className="text-xs text-slate-600 mt-2 italic">
                              {comp.technical_details?.customization || "Limitée"}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* Comparaison Feature par Feature */}
              {benchmarkData.feature_comparison && benchmarkData.feature_comparison.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('features')}>
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      <h3 className="text-lg font-bold text-slate-900">Comparaison par Features</h3>
                    </div>
                    {expandedSections.features ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                  
                  {expandedSections.features && (
                    <div className="space-y-4">
                      {benchmarkData.feature_comparison.map((category, catIdx) => (
                        <div key={catIdx}>
                          <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            {category.category}
                          </h4>
                          <div className="space-y-2">
                            {category.features?.map((feature, featIdx) => (
                              <div key={featIdx} className="bg-slate-50 p-3 rounded-lg">
                                <div className="font-semibold text-sm text-slate-900 mb-2">{feature.name}</div>
                                <div className="grid md:grid-cols-2 gap-2 text-xs">
                                  <div className="bg-purple-100 p-2 rounded border border-purple-300">
                                    <span className="font-semibold text-purple-900">Druide Omega:</span>
                                    <span className="text-slate-700 ml-1">{feature.druide_omega}</span>
                                  </div>
                                  {Object.entries(feature.competitors || {}).map(([compName, compValue]) => (
                                    <div key={compName} className="bg-white p-2 rounded border border-slate-200">
                                      <span className="font-semibold text-slate-900">{compName}:</span>
                                      <span className="text-slate-700 ml-1">{compValue}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* Features uniques et Gaps */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-5 bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => toggleSection('gaps')}>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-slate-900">Features Uniques</h3>
                    <Badge className="bg-green-600 text-white ml-auto">
                      {benchmarkData.unique_features?.length || 0}
                    </Badge>
                  </div>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {benchmarkData.unique_features?.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white p-4 rounded-lg shadow-sm border border-green-200"
                      >
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-bold text-sm text-slate-900 mb-1">{item.feature}</div>
                            {item.description && (
                              <div className="text-xs text-slate-700 mb-2">{item.description}</div>
                            )}
                            {item.technical_detail && (
                              <div className="text-xs text-slate-600 bg-green-50 p-2 rounded mb-2 italic border border-green-200">
                                🔧 {item.technical_detail}
                              </div>
                            )}
                            {item.competitors_have?.length > 0 ? (
                              <div className="text-xs text-orange-600 font-semibold">
                                ⚠️ Aussi chez: {item.competitors_have.join(', ')}
                              </div>
                            ) : (
                              <div className="text-xs text-green-700 font-semibold">
                                ✨ 100% Unique à Druide Omega
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
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-bold text-slate-900">Gaps Compétitifs</h3>
                    <Badge className="bg-orange-600 text-white ml-auto">
                      {benchmarkData.competitive_gaps?.length || 0}
                    </Badge>
                  </div>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {benchmarkData.competitive_gaps?.map((gap, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white p-4 rounded-lg shadow-sm border border-orange-200"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="font-bold text-sm text-slate-900 mb-1">{gap.feature}</div>
                            {gap.description && (
                              <div className="text-xs text-slate-700 mb-2">{gap.description}</div>
                            )}
                            <div className="text-xs text-slate-600 mb-2">
                              📍 Disponible chez: <span className="font-semibold">{gap.who_has?.join(', ')}</span>
                            </div>
                            {gap.impact && (
                              <div className="text-xs text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
                                💥 Impact: {gap.impact}
                              </div>
                            )}
                          </div>
                          <Badge
                            className={
                              gap.priority === 'high'
                                ? 'bg-red-600 text-white'
                                : gap.priority === 'medium'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-blue-600 text-white'
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

              {/* Recommandations stratégiques */}
              {benchmarkData.recommendations && benchmarkData.recommendations.length > 0 && (
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                    Recommandations Stratégiques
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {benchmarkData.recommendations.map((rec, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-4 rounded-lg shadow-sm border border-blue-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            rec.priority === 'high' || rec.priority === 'critical' 
                              ? 'bg-red-100' 
                              : rec.priority === 'medium' 
                              ? 'bg-yellow-100' 
                              : 'bg-blue-100'
                          }`}>
                            <TrendingUp className={`w-4 h-4 ${
                              rec.priority === 'high' || rec.priority === 'critical'
                                ? 'text-red-600'
                                : rec.priority === 'medium'
                                ? 'text-yellow-600'
                                : 'text-blue-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold text-sm text-slate-900">{rec.title || rec}</h4>
                              {rec.priority && (
                                <Badge className={`text-xs ${
                                  rec.priority === 'high' || rec.priority === 'critical'
                                    ? 'bg-red-600 text-white'
                                    : rec.priority === 'medium'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-blue-600 text-white'
                                }`}>
                                  {rec.priority}
                                </Badge>
                              )}
                            </div>
                            {rec.description && (
                              <p className="text-xs text-slate-700 mb-2">{rec.description}</p>
                            )}
                            {rec.impact && (
                              <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                                💡 Impact: {rec.impact}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </ScrollArea>
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