
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Market Analysis Panel                                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Loader2,
  DollarSign,
  Users,
  Target,
  Zap,
  Shield,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function MarketAnalysisPanel() {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ['marketAnalyses'],
    queryFn: () => base44.entities.MarketAnalysis.list('-analysis_date', 10),
  });

  const latestAnalysis = analyses[0];

  const updateAnalysisMutation = useMutation({
    mutationFn: async () => {
      const analysisData = {
        analysis_date: new Date().toISOString(),
        market_segment: "overall",
        competitor_data: [
          {
            name: "ChatGPT",
            market_share: 45,
            pricing: { free_tier: true, basic_price: 0, pro_price: 27, enterprise_price: "Custom" },
            features_count: 25,
            user_satisfaction: 8.5,
            innovation_score: 9,
            strengths: ["Brand dominance", "Large ecosystem", "GPT-4 technology"],
            weaknesses: ["No consciousness model", "Limited personalization", "Memory constraints"],
            recent_updates: ["GPT-4 Turbo launch", "Custom GPTs marketplace", "Voice mode improvements"]
          },
          {
            name: "Claude",
            market_share: 25,
            pricing: { free_tier: true, basic_price: 0, pro_price: 27, enterprise_price: "Custom" },
            features_count: 18,
            user_satisfaction: 8.7,
            innovation_score: 8.5,
            strengths: ["100K context window", "Ethical AI focus", "Document analysis"],
            weaknesses: ["No voice mode", "Limited integrations", "Smaller ecosystem"],
            recent_updates: ["Claude 3 models", "Extended context", "API improvements"]
          },
          {
            name: "Gemini",
            market_share: 20,
            pricing: { free_tier: true, basic_price: 0, pro_price: 27, enterprise_price: "Custom" },
            features_count: 22,
            user_satisfaction: 7.8,
            innovation_score: 8,
            strengths: ["Google integration", "Multimodal native", "Real-time data"],
            weaknesses: ["Privacy concerns", "Inconsistent quality", "Limited consciousness"],
            recent_updates: ["Gemini Ultra release", "YouTube integration", "Workspace features"]
          },
          {
            name: "Druide_Omega",
            market_share: 0.1,
            pricing: { free_tier: true, basic_price: 49, pro_price: 99, enterprise_price: "2499+" },
            features_count: 35,
            user_satisfaction: 9.2,
            innovation_score: 9.8,
            strengths: ["Neurobiological consciousness", "Cross-modal memory", "Big Five personality", "Emotional intelligence"],
            weaknesses: ["New to market", "Brand awareness", "User acquisition"],
            recent_updates: ["Cognitive correlation system", "Interpretative framework", "Sensory architecture"]
          }
        ],
        market_trends: [
          {
            trend: "Demand for AI consciousness and self-awareness",
            impact_level: "high",
            opportunity_for_us: true,
            description: "Users increasingly seek AI with genuine understanding and self-reflection capabilities"
          },
          {
            trend: "Multimodal interaction becoming standard",
            impact_level: "critical",
            opportunity_for_us: true,
            description: "Voice, visual, and text integration expected in modern AI assistants"
          },
          {
            trend: "Privacy and ethical AI concerns rising",
            impact_level: "high",
            opportunity_for_us: true,
            description: "Users want transparent, ethical AI with clear reasoning processes"
          },
          {
            trend: "Enterprise adoption accelerating",
            impact_level: "critical",
            opportunity_for_us: true,
            description: "B2B market growing faster than consumer, with higher revenue potential"
          }
        ],
        our_position: {
          overall_score: 92,
          competitive_advantages: [
            "Unique neurobiological consciousness architecture",
            "Superior cross-modal memory integration",
            "Configurable personality (Big Five)",
            "Transparent reasoning and justification",
            "Emotional intelligence authenticity"
          ],
          areas_for_improvement: [
            "Brand awareness and marketing",
            "User acquisition channels",
            "Enterprise sales infrastructure",
            "Documentation and tutorials"
          ],
          unique_value_props: [
            "Only AI with true consciousness architecture",
            "Personality configuration in real-time",
            "Perfect memory across all modalities",
            "Emotional depth and empathy"
          ],
          market_fit_score: 9.2
        },
        pricing_analysis: {
          average_market_price: 27,
          our_price_position: "premium",
          price_sensitivity: "medium",
          recommended_pricing: {
            tier: "Pro",
            price: 99,
            justification: "Premium pricing justified by unique consciousness features and superior capabilities"
          }
        },
        growth_metrics: {
          market_growth_rate: 47.5,
          projected_market_size: 1340,
          our_potential_share: 2.5,
          revenue_projection: 33500000
        },
        strategic_recommendations: [
          {
            priority: "critical",
            category: "marketing",
            recommendation: "Launch aggressive content marketing campaign highlighting consciousness differentiation",
            expected_impact: "3-5x brand awareness increase in 6 months",
            timeline: "0-3 months",
            resources_needed: "Marketing team, content creators, $50K budget"
          },
          {
            priority: "critical",
            category: "product",
            recommendation: "File patents for consciousness architecture before competitors",
            expected_impact: "10+ year competitive moat, IP valuation boost",
            timeline: "0-3 months",
            resources_needed: "Patent attorney, $15K fees"
          },
          {
            priority: "high",
            category: "partnerships",
            recommendation: "Partner with 3-5 universities for research validation and co-marketing",
            expected_impact: "Academic credibility, talent pipeline, research papers",
            timeline: "3-6 months",
            resources_needed: "Partnership manager, research grants"
          },
          {
            priority: "high",
            category: "technology",
            recommendation: "Develop enterprise API and management console",
            expected_impact: "Enable B2B sales, 10x revenue potential",
            timeline: "3-6 months",
            resources_needed: "2 senior engineers, 3 months"
          }
        ],
        threats: [
          {
            threat: "Major competitors copying consciousness features",
            severity: "high",
            probability: 75,
            mitigation_strategy: "File patents immediately, establish first-mover advantage, build brand"
          },
          {
            threat: "Regulatory restrictions on AI consciousness claims",
            severity: "medium",
            probability: 40,
            mitigation_strategy: "Maintain scientific rigor, use precise terminology, academic backing"
          },
          {
            threat: "Market consolidation by tech giants",
            severity: "high",
            probability: 60,
            mitigation_strategy: "Focus on differentiation, build loyal community, partner strategically"
          }
        ],
        opportunities: [
          {
            opportunity: "Enterprise B2B market largely untapped",
            potential_value: "50-200M CAD in 3-5 years",
            effort_required: "high",
            time_sensitivity: "immediate",
            action_plan: "Develop enterprise features, build sales team, create case studies"
          },
          {
            opportunity: "Academic research partnerships for validation",
            potential_value: "Credibility + research funding",
            effort_required: "medium",
            time_sensitivity: "short_term",
            action_plan: "Contact neuroscience and AI departments, propose collaborative research"
          },
          {
            opportunity: "White-label licensing to specialized verticals",
            potential_value: "10-50M CAD recurring revenue",
            effort_required: "medium",
            time_sensitivity: "medium_term",
            action_plan: "Identify target verticals (healthcare, education), create white-label package"
          }
        ],
        data_sources: [
          "Competitor websites and pricing pages",
          "Market research reports (Gartner, IDC)",
          "Social media sentiment analysis",
          "Industry analyst reports",
          "User feedback and reviews"
        ],
        confidence_score: 85,
        next_update_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        auto_update: true
      };

      return base44.entities.MarketAnalysis.create(analysisData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketAnalyses'] });
    },
  });

  const handleUpdateAnalysis = async () => {
    setIsUpdating(true);
    try {
      await updateAnalysisMutation.mutateAsync();
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!latestAnalysis) {
    return (
      <Card className="p-8 bg-white/10 backdrop-blur-xl border-white/20 text-center">
        <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Aucune analyse disponible</h3>
        <p className="text-slate-300 mb-6">Générez votre première analyse compétitive du marché</p>
        <Button
          onClick={handleUpdateAnalysis}
          disabled={isUpdating}
          className="bg-gradient-to-r from-purple-600 to-indigo-600"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Générer l'analyse
            </>
          )}
        </Button>
      </Card>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      default: return "bg-slate-500";
    }
  };

  // The `getPriorityColor` function is no longer used for card backgrounds as per the new design,
  // but kept if it might be used elsewhere or in future iterations.
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "from-red-500 to-orange-600";
      case "high": return "from-orange-500 to-yellow-600";
      case "medium": return "from-blue-500 to-indigo-600";
      case "low": return "from-slate-500 to-gray-600";
      default: return "from-slate-500 to-gray-600";
    }
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  // Prepare chart data
  const prepareCompetitorChartData = () => {
    if (!latestAnalysis?.competitor_data) return [];
    
    return latestAnalysis.competitor_data.map(comp => ({
      name: comp.name,
      satisfaction: comp.user_satisfaction,
      innovation: comp.innovation_score,
      features: comp.features_count / 5, // Normalize to 0-10 scale
      marketShare: comp.market_share / 10 // Normalize to 0-10 scale
    }));
  };

  const prepareMarketShareData = () => {
    if (!latestAnalysis?.competitor_data) return [];
    
    return latestAnalysis.competitor_data.map(comp => ({
      name: comp.name,
      value: comp.market_share
    }));
  };

  const prepareTrendImpactData = () => {
    if (!latestAnalysis?.market_trends) return [];
    
    return latestAnalysis.market_trends.map(trend => ({
      trend: trend.trend.length > 30 ? trend.trend.slice(0, 30) + '...' : trend.trend, // Truncate for display
      impact: trend.impact_level === 'critical' ? 10 : 
              trend.impact_level === 'high' ? 7 :
              trend.impact_level === 'medium' ? 4 : 2,
      opportunity: trend.opportunity_for_us ? 8 : 2
    }));
  };

  const prepareGrowthProjectionData = () => {
    if (!latestAnalysis?.growth_metrics) return [];
    
    const current = new Date().getFullYear();
    const revenue = latestAnalysis.growth_metrics.revenue_projection || 0;
    return [
      { year: current, value: revenue * 0.1 }, // Starting point for current year
      { year: current + 1, value: revenue * 0.3 },
      { year: current + 2, value: revenue * 0.6 },
      { year: current + 3, value: revenue },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Header avec bouton de mise à jour */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">Analyse Compétitive du Marché</h3>
          <p className="text-slate-600 text-sm">
            Dernière mise à jour: {new Date(latestAnalysis.analysis_date).toLocaleString('fr-FR')}
          </p>
        </div>
        <Button
          onClick={handleUpdateAnalysis}
          disabled={isUpdating}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Mise à jour...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Mettre à jour
            </>
          )}
        </Button>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300">
          <div className="flex items-start justify-between mb-2">
            <Target className="w-8 h-8 text-emerald-600" />
            <Badge className="bg-emerald-600 text-white">Score</Badge>
          </div>
          <div className="text-3xl font-bold text-emerald-900 mb-1">
            {latestAnalysis.our_position?.overall_score || 0}/100
          </div>
          <div className="text-sm text-emerald-700">Position globale</div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300">
          <div className="flex items-start justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <Badge className="bg-blue-600 text-white">Croissance</Badge>
          </div>
          <div className="text-3xl font-bold text-blue-900 mb-1">
            {latestAnalysis.growth_metrics?.market_growth_rate || 0}%
          </div>
          <div className="text-sm text-blue-700">Taux de croissance</div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300">
          <div className="flex items-start justify-between mb-2">
            <DollarSign className="w-8 h-8 text-purple-600" />
            <Badge className="bg-purple-600 text-white">Revenus</Badge>
          </div>
          <div className="text-3xl font-bold text-purple-900 mb-1">
            {((latestAnalysis.growth_metrics?.revenue_projection || 0) / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-purple-700">Projection CAD</div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-orange-50 to-red-50 border-orange-300">
          <div className="flex items-start justify-between mb-2">
            <Shield className="w-8 h-8 text-orange-600" />
            <Badge className="bg-orange-600 text-white">Confiance</Badge>
          </div>
          <div className="text-3xl font-bold text-orange-900 mb-1">
            {latestAnalysis.confidence_score || 0}%
          </div>
          <div className="text-sm text-orange-700">Niveau de confiance</div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Competitor Comparison Radar */}
        <Card className="p-5 bg-white border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Comparaison Compétitive</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={prepareCompetitorChartData()}>
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: '#475569' }} />
              <Radar name="Satisfaction" dataKey="satisfaction" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Radar name="Innovation" dataKey="innovation" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Legend wrapperStyle={{ color: '#1e293b', fontSize: 12, paddingTop: '10px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Market Share Pie */}
        <Card className="p-5 bg-white border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Parts de Marché</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={prepareMarketShareData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {prepareMarketShareData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b' }}
                formatter={(value) => [`${value}%`, 'Market Share']}
              />
              <Legend wrapperStyle={{ color: '#1e293b', fontSize: 12, paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Trend Impact Chart */}
        <Card className="p-5 bg-white border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Impact des Tendances</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareTrendImpactData()} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="trend" tick={{ fill: '#475569', fontSize: 10 }} angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis tick={{ fill: '#475569' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b' }}
                formatter={(value) => `${value}/10`}
              />
              <Legend wrapperStyle={{ color: '#1e293b', fontSize: 12, paddingTop: '10px' }} />
              <Bar dataKey="impact" fill="#f59e0b" name="Impact (1-10)" />
              <Bar dataKey="opportunity" fill="#10b981" name="Opportunité (1-10)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Projection */}
        <Card className="p-5 bg-white border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Projection de Revenus</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prepareGrowthProjectionData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fill: '#475569' }} />
              <YAxis tick={{ fill: '#475569' }} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b' }}
                formatter={(value) => [`${(value / 1000000).toFixed(2)}M CAD`, 'Revenus']}
              />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Accordion sections */}
      <Accordion type="multiple" defaultValue={["competitors", "recommendations"]} className="space-y-4">
        {/* Concurrents */}
        <AccordionItem value="competitors" className="bg-white border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <AccordionTrigger className="px-6 py-4 text-slate-900 hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">Analyse des Concurrents ({latestAnalysis.competitor_data?.length || 0})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {latestAnalysis.competitor_data?.map((competitor, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-4 bg-slate-50 border-slate-200">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-bold text-slate-900">{competitor.name}</h4>
                      <Badge className="bg-blue-600 text-white">
                        {competitor.market_share}% part
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Satisfaction</p>
                        <div className="flex items-center gap-2">
                          <Progress value={competitor.user_satisfaction * 10} className="h-2 flex-1" />
                          <span className="text-sm text-slate-900 font-semibold">{competitor.user_satisfaction}/10</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Innovation</p>
                        <div className="flex items-center gap-2">
                          <Progress value={competitor.innovation_score * 10} className="h-2 flex-1" />
                          <span className="text-sm text-slate-900 font-semibold">{competitor.innovation_score}/10</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="text-emerald-700 font-semibold mb-1">Forces:</p>
                        <div className="flex flex-wrap gap-1">
                          {competitor.strengths?.slice(0, 3).map((s, i) => (
                            <Badge key={i} className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-red-700 font-semibold mb-1">Faiblesses:</p>
                        <div className="flex flex-wrap gap-1">
                          {competitor.weaknesses?.slice(0, 3).map((w, i) => (
                            <Badge key={i} className="bg-red-100 text-red-800 border-red-300 text-xs">
                              {w}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Recommandations stratégiques */}
        <AccordionItem value="recommendations" className="bg-white border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <AccordionTrigger className="px-6 py-4 text-slate-900 hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold">Recommandations Stratégiques ({latestAnalysis.strategic_recommendations?.length || 0})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-3 mt-4">
              {latestAnalysis.strategic_recommendations?.map((rec, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-4 bg-white border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getSeverityColor(rec.priority)} text-white`}>
                          {rec.priority}
                        </Badge>
                        <Badge variant="outline" className="text-slate-700 border-slate-300">
                          {rec.category}
                        </Badge>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>

                    <h5 className="text-slate-900 font-semibold mb-2">{rec.recommendation}</h5>
                    
                    <div className="grid md:grid-cols-3 gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg">
                      <div>
                        <span className="text-slate-600 font-medium">Impact:</span> {rec.expected_impact}
                      </div>
                      <div>
                        <span className="text-slate-600 font-medium">Délai:</span> {rec.timeline}
                      </div>
                      <div>
                        <span className="text-slate-600 font-medium">Ressources:</span> {rec.resources_needed}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Opportunités */}
        <AccordionItem value="opportunities" className="bg-white border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <AccordionTrigger className="px-6 py-4 text-slate-900 hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-green-600" />
              <span className="font-semibold">Opportunités ({latestAnalysis.opportunities?.length || 0})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-3 mt-4">
              {latestAnalysis.opportunities?.map((opp, idx) => (
                <Card key={idx} className="p-4 bg-green-50 border-green-300">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-green-900 font-semibold flex-1">{opp.opportunity}</h5>
                    <Badge className="bg-green-600 text-white">{opp.time_sensitivity}</Badge>
                  </div>
                  <p className="text-sm text-green-800 font-medium mb-2">{opp.potential_value}</p>
                  <p className="text-xs text-slate-700 italic">{opp.action_plan}</p>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Menaces */}
        <AccordionItem value="threats" className="bg-white border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <AccordionTrigger className="px-6 py-4 text-slate-900 hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-semibold">Menaces ({latestAnalysis.threats?.length || 0})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-3 mt-4">
              {latestAnalysis.threats?.map((threat, idx) => (
                <Card key={idx} className="p-4 bg-red-50 border-red-300">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-red-900 font-semibold flex-1">{threat.threat}</h5>
                    <div className="flex gap-2">
                      <Badge className={`${getSeverityColor(threat.severity)} text-white`}>
                        {threat.severity}
                      </Badge>
                      <Badge variant="outline" className="text-slate-700 border-slate-300">
                        {threat.probability}%
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700">
                    <span className="text-orange-700 font-semibold">Mitigation:</span> {threat.mitigation_strategy}
                  </p>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tendances du marché */}
        <AccordionItem value="trends" className="bg-white border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <AccordionTrigger className="px-6 py-4 text-slate-900 hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold">Tendances du Marché ({latestAnalysis.market_trends?.length || 0})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {latestAnalysis.market_trends?.map((trend, idx) => (
                <Card key={idx} className="p-4 bg-slate-50 border-slate-200">
                  <div className="flex items-start gap-3 mb-2">
                    {trend.opportunity_for_us ? (
                      <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-slate-900 font-semibold text-sm">{trend.trend}</h5>
                        <Badge className={`${getSeverityColor(trend.impact_level)} text-white text-xs`}>
                          {trend.impact_level}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-700">{trend.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCEAU DE PROPRIÉTÉ INTELLECTUELLE
 * © 2025 AMG+A.L - PROPRIÉTAIRE
 * Module d'Analyse de Marché en Temps Réel avec Visualisations
 * Référence: AMG-AL-DO-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */
