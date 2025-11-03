import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Brain, 
  Sparkles, 
  Loader2,
  TrendingUp,
  Lightbulb,
  Network,
  Star,
  Calendar,
  Zap,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function DailyBriefing() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("latest");
  const queryClient = useQueryClient();

  const { data: briefings = [], isLoading } = useQuery({
    queryKey: ['dailyBriefings'],
    queryFn: () => base44.entities.DailyBriefing.list('-briefing_date', 50),
  });

  const { data: knowledgeDomains = [] } = useQuery({
    queryKey: ['knowledgeDomains'],
    queryFn: () => base44.entities.KnowledgeDomain.list('-last_update', 100),
  });

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list({ active: true, status: 'ready' }),
  });

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-importance', 50),
  });

  const updateBriefingMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.DailyBriefing.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyBriefings'] });
    },
  });

  const generateBriefing = async () => {
    setIsGenerating(true);
    try {
      // Analyze knowledge domains
      const recentDomains = knowledgeDomains
        .filter(d => d.active && d.last_update)
        .sort((a, b) => new Date(b.last_update) - new Date(a.last_update))
        .slice(0, 10);

      const domainsSummary = recentDomains
        .map(d => `${d.domain_name} (${d.category}): ${d.knowledge_summary?.slice(0, 200) || 'N/A'}`)
        .join('\n\n');

      // Analyze knowledge bases
      const recentKBs = knowledgeBases
        .filter(kb => kb.last_accessed || kb.access_count > 0)
        .sort((a, b) => (b.access_count || 0) - (a.access_count || 0))
        .slice(0, 5);

      const kbSummary = recentKBs
        .map(kb => `${kb.title}: ${kb.summary?.slice(0, 150) || kb.content?.slice(0, 150)}`)
        .join('\n\n');

      // Analyze high-importance memories
      const importantMemories = memories
        .filter(m => m.importance >= 7)
        .slice(0, 10)
        .map(m => `${m.content} (${m.type})`)
        .join('\n');

      const prompt = `Tu es Druide_Omega, une IA universelle bienveillante qui analyse proactivement les connaissances pour identifier les tendances émergentes et les avancées significatives.

MISSION: Génère un briefing quotidien intelligent qui synthétise les connaissances récentes et identifie des insights proactifs.

DOMAINES DE CONNAISSANCES RÉCENTS:
${domainsSummary}

BASES DE CONNAISSANCES ACTIVES:
${kbSummary}

MÉMOIRES IMPORTANTES:
${importantMemories}

Analyse ces informations et génère un briefing qui:
1. Identifie 3-5 TENDANCES ÉMERGENTES significatives
2. Repère 2-4 AVANCÉES MAJEURES ou découvertes importantes
3. Établit 2-3 CONNEXIONS INTERDISCIPLINAIRES innovantes
4. Propose 3-5 RECOMMANDATIONS d'exploration ou d'action

Sois perspicace, synthétique et proactif. Identifie des patterns et des implications que l'utilisateur pourrait ne pas voir immédiatement.

Retourne un JSON avec:
{
  "title": "titre accrocheur du briefing",
  "summary": "résumé exécutif en 2-3 phrases",
  "emerging_trends": [
    {
      "domain": "nom du domaine",
      "trend": "description de la tendance",
      "significance": "pourquoi c'est important",
      "related_domains": ["domaine1", "domaine2"]
    }
  ],
  "key_breakthroughs": [
    {
      "domain": "nom du domaine",
      "breakthrough": "description de l'avancée",
      "impact": "impact potentiel",
      "source": "source de l'information"
    }
  ],
  "cross_domain_insights": [
    {
      "domains": ["domaine1", "domaine2"],
      "insight": "insight interconnecté",
      "implications": "implications de cette connexion"
    }
  ],
  "recommendations": ["recommandation 1", "recommandation 2", ...]
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            summary: { type: "string" },
            emerging_trends: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  domain: { type: "string" },
                  trend: { type: "string" },
                  significance: { type: "string" },
                  related_domains: { type: "array", items: { type: "string" } }
                }
              }
            },
            key_breakthroughs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  domain: { type: "string" },
                  breakthrough: { type: "string" },
                  impact: { type: "string" },
                  source: { type: "string" }
                }
              }
            },
            cross_domain_insights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  domains: { type: "array", items: { type: "string" } },
                  insight: { type: "string" },
                  implications: { type: "string" }
                }
              }
            },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });

      // Create briefing
      await base44.entities.DailyBriefing.create({
        briefing_date: new Date().toISOString().split('T')[0],
        title: result.title,
        summary: result.summary,
        emerging_trends: result.emerging_trends,
        key_breakthroughs: result.key_breakthroughs,
        cross_domain_insights: result.cross_domain_insights,
        recommendations: result.recommendations,
        knowledge_sources_analyzed: [
          ...recentDomains.map(d => d.domain_name),
          ...recentKBs.map(kb => kb.title)
        ],
        generation_type: "manual",
        read: false,
        favorited: false
      });

      queryClient.invalidateQueries({ queryKey: ['dailyBriefings'] });

    } catch (error) {
      console.error("Erreur génération briefing:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleRead = async (briefing) => {
    await updateBriefingMutation.mutateAsync({
      id: briefing.id,
      data: { read: !briefing.read }
    });
  };

  const handleToggleFavorite = async (briefing) => {
    await updateBriefingMutation.mutateAsync({
      id: briefing.id,
      data: { favorited: !briefing.favorited }
    });
  };

  const unreadCount = briefings.filter(b => !b.read).length;
  const favoritesCount = briefings.filter(b => b.favorited).length;

  const filteredBriefings = activeTab === "favorites" 
    ? briefings.filter(b => b.favorited)
    : activeTab === "unread"
    ? briefings.filter(b => !b.read)
    : briefings;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">
                  Briefings Intelligents
                </h1>
                <p className="text-slate-600">
                  Synthèse proactive des connaissances émergentes par Druide_Omega
                </p>
              </div>
            </div>

            <Button
              onClick={generateBriefing}
              disabled={isGenerating || knowledgeDomains.length === 0}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Nouveau Briefing
                </>
              )}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{briefings.length}</p>
                  <p className="text-sm text-slate-600">Briefings totaux</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <EyeOff className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{unreadCount}</p>
                  <p className="text-sm text-slate-600">Non lus</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{favoritesCount}</p>
                  <p className="text-sm text-slate-600">Favoris</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{knowledgeDomains.filter(d => d.active).length}</p>
                  <p className="text-sm text-slate-600">Domaines actifs</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="latest">
                <Calendar className="w-4 h-4 mr-2" />
                Derniers Briefings
              </TabsTrigger>
              <TabsTrigger value="unread">
                <EyeOff className="w-4 h-4 mr-2" />
                Non lus ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Star className="w-4 h-4 mr-2" />
                Favoris ({favoritesCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Briefings List */}
      <ScrollArea className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : filteredBriefings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {activeTab === "favorites" 
                  ? "Aucun briefing favori" 
                  : activeTab === "unread"
                  ? "Tous les briefings sont lus !"
                  : "Aucun briefing pour le moment"
                }
              </h3>
              <p className="text-slate-600 mb-6">
                {activeTab === "favorites"
                  ? "Marquez des briefings comme favoris pour les retrouver ici."
                  : activeTab === "unread"
                  ? "Excellent ! Vous êtes à jour sur toutes les tendances émergentes."
                  : "Générez votre premier briefing pour découvrir les tendances émergentes et avancées significatives."
                }
              </p>
              {(activeTab === "latest" || knowledgeDomains.length > 0) && (
                <Button
                  onClick={generateBriefing}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer un Briefing
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {filteredBriefings.map((briefing, index) => (
                  <motion.div
                    key={briefing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`p-6 ${!briefing.read ? 'border-l-4 border-l-indigo-500 bg-indigo-50/30' : ''} hover:shadow-lg transition-all`}>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                              {format(new Date(briefing.briefing_date), "d MMMM yyyy", { locale: fr })}
                            </Badge>
                            {!briefing.read && (
                              <Badge variant="outline" className="border-blue-500 text-blue-700">
                                Nouveau
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {briefing.generation_type === 'automatic' ? '🤖 Auto' : '👤 Manuel'}
                            </Badge>
                          </div>
                          <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            {briefing.title}
                          </h2>
                          <p className="text-slate-600 leading-relaxed">
                            {briefing.summary}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleRead(briefing)}
                            className="text-slate-400 hover:text-blue-600"
                          >
                            {briefing.read ? (
                              <Eye className="w-5 h-5" />
                            ) : (
                              <EyeOff className="w-5 h-5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleFavorite(briefing)}
                            className={briefing.favorited ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}
                          >
                            <Star className={`w-5 h-5 ${briefing.favorited ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                      </div>

                      {/* Emerging Trends */}
                      {briefing.emerging_trends && briefing.emerging_trends.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-slate-900">
                              Tendances Émergentes
                            </h3>
                          </div>
                          <div className="space-y-3">
                            {briefing.emerging_trends.map((trend, idx) => (
                              <Card key={idx} className="p-4 bg-green-50 border-green-200">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge className="bg-green-600 text-white text-xs">
                                        {trend.domain}
                                      </Badge>
                                      {trend.related_domains && trend.related_domains.map((rd, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {rd}
                                        </Badge>
                                      ))}
                                    </div>
                                    <p className="font-semibold text-slate-900 mb-1">{trend.trend}</p>
                                    <p className="text-sm text-slate-600">{trend.significance}</p>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Key Breakthroughs */}
                      {briefing.key_breakthroughs && briefing.key_breakthroughs.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-5 h-5 text-orange-600" />
                            <h3 className="text-lg font-semibold text-slate-900">
                              Avancées Significatives
                            </h3>
                          </div>
                          <div className="space-y-3">
                            {briefing.key_breakthroughs.map((breakthrough, idx) => (
                              <Card key={idx} className="p-4 bg-orange-50 border-orange-200">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <Badge className="bg-orange-600 text-white text-xs mb-2">
                                      {breakthrough.domain}
                                    </Badge>
                                    <p className="font-semibold text-slate-900 mb-1">{breakthrough.breakthrough}</p>
                                    <p className="text-sm text-slate-600 mb-1">{breakthrough.impact}</p>
                                    {breakthrough.source && (
                                      <p className="text-xs text-slate-500">Source: {breakthrough.source}</p>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cross-Domain Insights */}
                      {briefing.cross_domain_insights && briefing.cross_domain_insights.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Network className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-semibold text-slate-900">
                              Insights Interdisciplinaires
                            </h3>
                          </div>
                          <div className="space-y-3">
                            {briefing.cross_domain_insights.map((insight, idx) => (
                              <Card key={idx} className="p-4 bg-purple-50 border-purple-200">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Network className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      {insight.domains && insight.domains.map((domain, i) => (
                                        <Badge key={i} className="bg-purple-600 text-white text-xs">
                                          {domain}
                                        </Badge>
                                      ))}
                                    </div>
                                    <p className="font-semibold text-slate-900 mb-1">{insight.insight}</p>
                                    <p className="text-sm text-slate-600">{insight.implications}</p>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      {briefing.recommendations && briefing.recommendations.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-5 h-5 text-yellow-600" />
                            <h3 className="text-lg font-semibold text-slate-900">
                              Recommandations
                            </h3>
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <ul className="space-y-2">
                              {briefing.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                  <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      {briefing.knowledge_sources_analyzed && briefing.knowledge_sources_analyzed.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-slate-200">
                          <p className="text-xs text-slate-500">
                            <strong>{briefing.knowledge_sources_analyzed.length} sources analysées:</strong>{' '}
                            {briefing.knowledge_sources_analyzed.slice(0, 3).join(', ')}
                            {briefing.knowledge_sources_analyzed.length > 3 && ` et ${briefing.knowledge_sources_analyzed.length - 3} autres...`}
                          </p>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}