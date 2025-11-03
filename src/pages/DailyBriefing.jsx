import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  Sparkles,
  Calendar,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Loader2,
  Link2,
  Target,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DailyBriefing() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBriefing, setSelectedBriefing] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: briefings = [], isLoading } = useQuery({
    queryKey: ['dailyBriefings'],
    queryFn: () => base44.entities.DailyBriefing.list('-created_date'),
  });

  const { data: domains = [] } = useQuery({
    queryKey: ['knowledgeDomains'],
    queryFn: () => base44.entities.KnowledgeDomain.list(),
  });

  const generateBriefing = async () => {
    setIsGenerating(true);
    try {
      const activeDomains = domains.filter(d => d.auto_update);
      
      if (activeDomains.length === 0) {
        alert("Aucun domaine actif pour générer un briefing");
        return;
      }

      const domainsText = activeDomains
        .map(d => `- ${d.name}: ${d.summary || 'Pas de résumé'}`)
        .join('\n');

      const briefingPrompt = `Tu es Druide_Omega, une IA universelle bienveillante.

Génère un briefing quotidien intelligent basé sur ces domaines de connaissance actifs:

${domainsText}

Le briefing doit contenir:
1. Un titre accrocheur
2. Un résumé exécutif (2-3 phrases)
3. Des tendances clés (3-5 tendances)
4. Des insights profonds (3-5 insights)
5. Des recommandations actionnables (3-5 recommandations)
6. Des connexions cross-domain (2-3 connexions entre domaines)

Retourne un JSON structuré:
{
  "title": "titre du briefing",
  "summary": "résumé exécutif",
  "key_trends": [
    {
      "trend": "description de la tendance",
      "domain": "nom du domaine",
      "impact": "high|medium|low",
      "reasoning": "pourquoi cette tendance est importante"
    }
  ],
  "insights": [
    {
      "insight": "insight profond",
      "type": "pattern|opportunity|risk|innovation",
      "relevance": "pourquoi c'est pertinent"
    }
  ],
  "recommendations": [
    {
      "recommendation": "recommandation actionnable",
      "priority": "high|medium|low",
      "timeframe": "immediate|short-term|long-term"
    }
  ],
  "cross_domain_connections": [
    {
      "domains": ["domaine 1", "domaine 2"],
      "connection": "description de la connexion",
      "potential": "potentiel de cette connexion"
    }
  ]
}`;

      const briefingData = await base44.integrations.Core.InvokeLLM({
        prompt: briefingPrompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            summary: { type: "string" },
            key_trends: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  trend: { type: "string" },
                  domain: { type: "string" },
                  impact: { type: "string" },
                  reasoning: { type: "string" }
                }
              }
            },
            insights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  insight: { type: "string" },
                  type: { type: "string" },
                  relevance: { type: "string" }
                }
              }
            },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  recommendation: { type: "string" },
                  priority: { type: "string" },
                  timeframe: { type: "string" }
                }
              }
            },
            cross_domain_connections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  domains: { type: "array", items: { type: "string" } },
                  connection: { type: "string" },
                  potential: { type: "string" }
                }
              }
            }
          }
        }
      });

      await base44.entities.DailyBriefing.create({
        title: briefingData.title,
        summary: briefingData.summary,
        key_trends: briefingData.key_trends,
        insights: briefingData.insights,
        recommendations: briefingData.recommendations,
        cross_domain_connections: briefingData.cross_domain_connections,
        domains_covered: activeDomains.map(d => d.name)
      });

      queryClient.invalidateQueries({ queryKey: ['dailyBriefings'] });
    } catch (error) {
      console.error("Erreur génération briefing:", error);
      alert("Erreur lors de la génération du briefing");
    } finally {
      setIsGenerating(false);
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-700 border-red-300";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 border-red-300";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low": return "bg-blue-100 text-blue-700 border-blue-300";
      default: return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case "pattern": return <TrendingUp className="w-4 h-4" />;
      case "opportunity": return <Target className="w-4 h-4" />;
      case "risk": return <AlertCircle className="w-4 h-4" />;
      case "innovation": return <Sparkles className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/30">
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40"
              >
                <Newspaper className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Briefings Intelligents</h1>
                <p className="text-slate-600">Synthèses quotidiennes des connaissances</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={generateBriefing}
                disabled={isGenerating || domains.length === 0}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer Briefing
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Newspaper className="w-12 h-12 text-indigo-600" />
              </motion.div>
              <p className="text-slate-600 mt-4">Chargement des briefings...</p>
            </div>
          ) : briefings.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun briefing disponible</h3>
              <p className="text-slate-600 mb-4">
                Générez votre premier briefing quotidien pour commencer
              </p>
              <Button
                onClick={generateBriefing}
                disabled={isGenerating || domains.length === 0}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Générer le premier briefing
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {briefings.map((briefing, index) => (
                <motion.div
                  key={briefing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="overflow-hidden hover:shadow-xl transition-all cursor-pointer bg-white"
                    onClick={() => setSelectedBriefing(briefing)}
                  >
                    <div className="h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500" />
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-slate-900 mb-2">{briefing.title}</h2>
                          <p className="text-slate-700 leading-relaxed">{briefing.summary}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0 ml-4" />
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {briefing.domains_covered?.map((domain, idx) => (
                          <Badge key={idx} variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                            {domain}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-600">
                            {briefing.key_trends?.length || 0}
                          </div>
                          <div className="text-xs text-slate-500">Tendances</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {briefing.insights?.length || 0}
                          </div>
                          <div className="text-xs text-slate-500">Insights</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-600">
                            {briefing.recommendations?.length || 0}
                          </div>
                          <div className="text-xs text-slate-500">Recommandations</div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(briefing.created_date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={!!selectedBriefing} onOpenChange={() => setSelectedBriefing(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedBriefing?.title}</DialogTitle>
          </DialogHeader>

          {selectedBriefing && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
                <p className="text-slate-700 leading-relaxed">{selectedBriefing.summary}</p>
              </div>

              {selectedBriefing.key_trends?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    Tendances Clés
                  </h3>
                  <div className="space-y-3">
                    {selectedBriefing.key_trends.map((trend, idx) => (
                      <Card key={idx} className="p-4 bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-slate-900">{trend.trend}</h4>
                              <Badge className={getImpactColor(trend.impact)}>
                                {trend.impact} impact
                              </Badge>
                            </div>
                            <Badge variant="outline" className="mb-2">{trend.domain}</Badge>
                            <p className="text-sm text-slate-600">{trend.reasoning}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {selectedBriefing.insights?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    Insights Profonds
                  </h3>
                  <div className="space-y-3">
                    {selectedBriefing.insights.map((insight, idx) => (
                      <Card key={idx} className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            {getInsightIcon(insight.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-slate-900">{insight.insight}</h4>
                              <Badge variant="outline" className="text-xs capitalize">{insight.type}</Badge>
                            </div>
                            <p className="text-sm text-slate-600">{insight.relevance}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {selectedBriefing.recommendations?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Recommandations
                  </h3>
                  <div className="space-y-3">
                    {selectedBriefing.recommendations.map((rec, idx) => (
                      <Card key={idx} className="p-4 bg-white">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-medium text-slate-900">{rec.recommendation}</h4>
                              <Badge className={getPriorityColor(rec.priority)}>
                                {rec.priority} priority
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {rec.timeframe}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {selectedBriefing.cross_domain_connections?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-purple-600" />
                    Connexions Cross-Domain
                  </h3>
                  <div className="space-y-3">
                    {selectedBriefing.cross_domain_connections.map((conn, idx) => (
                      <Card key={idx} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          {conn.domains.map((domain, i) => (
                            <React.Fragment key={i}>
                              <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                                {domain}
                              </Badge>
                              {i < conn.domains.length - 1 && (
                                <ArrowRight className="w-4 h-4 text-purple-400" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{conn.connection}</p>
                        <p className="text-xs text-slate-600 italic">{conn.potential}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}