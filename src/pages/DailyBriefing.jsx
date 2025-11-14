
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
        briefing_date: new Date().toISOString().split('T')[0],
        title: briefingData.title,
        summary: briefingData.summary,
        emerging_trends: briefingData.key_trends.map(t => ({
          domain: t.domain,
          trend: t.trend,
          significance: t.reasoning,
          related_domains: []
        })),
        key_breakthroughs: briefingData.insights.map(i => ({
          domain: i.type,
          breakthrough: i.insight,
          impact: i.relevance,
          source: "AI Analysis"
        })),
        cross_domain_insights: briefingData.cross_domain_connections.map(c => ({
          domains: c.domains,
          insight: c.connection,
          implications: c.potential
        })),
        recommendations: briefingData.recommendations.map(r => r.recommendation),
        knowledge_sources_analyzed: activeDomains.map(d => d.domain_name)
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
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/30 overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 flex-shrink-0"
              >
                <Newspaper className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </motion.div>
              
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 truncate">Briefings Intelligents</h1>
                <p className="text-sm sm:text-base text-slate-600 truncate">Synthèses quotidiennes</p>
              </div>
            </div>

            <Button
              onClick={generateBriefing}
              disabled={isGenerating || domains.length === 0}
              size="sm"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 flex-shrink-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" />
                  <span className="hidden sm:inline">Génération...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Générer</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Newspaper className="w-12 h-12 text-indigo-600" />
              </motion.div>
              <p className="text-slate-600 mt-4">Chargement...</p>
            </div>
          ) : briefings.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun briefing</h3>
              <p className="text-slate-600 mb-4 px-4">
                Générez votre premier briefing quotidien
              </p>
              <Button
                onClick={generateBriefing}
                disabled={isGenerating || domains.length === 0}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Générer
              </Button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
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
                    
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2 break-words">{briefing.title}</h2>
                          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{briefing.summary}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      </div>

                      {briefing.knowledge_sources_analyzed && briefing.knowledge_sources_analyzed.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {briefing.knowledge_sources_analyzed.slice(0, 5).map((domain, idx) => (
                            <Badge key={idx} variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                              {domain}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t">
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl font-bold text-indigo-600">
                            {briefing.emerging_trends?.length || 0}
                          </div>
                          <div className="text-xs text-slate-500">Tendances</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl font-bold text-blue-600">
                            {briefing.key_breakthroughs?.length || 0}
                          </div>
                          <div className="text-xs text-slate-500">Insights</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl font-bold text-cyan-600">
                            {briefing.recommendations?.length || 0}
                          </div>
                          <div className="text-xs text-slate-500">Actions</div>
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

      {/* Detail Dialog - With Scrolling */}
      <Dialog open={!!selectedBriefing} onOpenChange={() => setSelectedBriefing(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl sm:text-2xl break-words">{selectedBriefing?.title}</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            {selectedBriefing && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{selectedBriefing.summary}</p>
                </div>

                {selectedBriefing.emerging_trends?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                      Tendances Clés
                    </h3>
                    <div className="space-y-3">
                      {selectedBriefing.emerging_trends.map((trend, idx) => (
                        <Card key={idx} className="p-4 bg-white">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-medium text-slate-900 text-sm sm:text-base break-words">{trend.trend}</h4>
                              <Badge variant="outline" className="text-xs">{trend.domain}</Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600">{trend.significance}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {selectedBriefing.key_breakthroughs?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      Insights
                    </h3>
                    <div className="space-y-3">
                      {selectedBriefing.key_breakthroughs.map((insight, idx) => (
                        <Card key={idx} className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Lightbulb className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-900 mb-2 text-sm sm:text-base break-words">{insight.breakthrough}</h4>
                              <p className="text-xs sm:text-sm text-slate-600">{insight.impact}</p>
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
                            <p className="text-sm sm:text-base text-slate-900 break-words">{rec}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {selectedBriefing.cross_domain_insights?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Link2 className="w-5 h-5 text-purple-600" />
                      Connexions Cross-Domain
                    </h3>
                    <div className="space-y-3">
                      {selectedBriefing.cross_domain_insights.map((conn, idx) => (
                        <Card key={idx} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {conn.domains?.map((domain, i) => (
                              <React.Fragment key={i}>
                                <Badge className="bg-purple-100 text-purple-700 border-purple-300 text-xs">
                                  {domain}
                                </Badge>
                                {i < conn.domains.length - 1 && (
                                  <ArrowRight className="w-4 h-4 text-purple-400" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 mb-2 break-words">{conn.insight}</p>
                          <p className="text-xs text-slate-600 italic break-words">{conn.implications}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
