/**
 * Agrégateur d'Actualités IA en Temps Réel
 */
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Newspaper, TrendingUp, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function AINewsAggregator() {
  const queryClient = useQueryClient();
  const [fetching, setFetching] = useState(false);

  const fetchNewsMutation = useMutation({
    mutationFn: async () => {
      setFetching(true);

      const newsAnalysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Recherche les 10 actualités les plus importantes du monde de l'IA en 2025 (dernières 48h).

Catégories:
- Lancements de produits IA
- Investissements/Acquisitions
- Avancées techniques (AGI, Quantum AI, etc.)
- Réglementation
- Compétiteurs (OpenAI, Anthropic, Google, etc.)

Retourne JSON:
{
  "news": [{
    "title": str,
    "source": str,
    "category": str,
    "summary": str (100 chars max),
    "relevance_to_druide": str (high/medium/low),
    "impact": str,
    "date": str,
    "url": str (optionnel)
  }],
  "trending_topics": [str],
  "threats": [str],
  "opportunities": [str]
}`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            news: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  source: { type: "string" },
                  category: { type: "string" },
                  summary: { type: "string" },
                  relevance_to_druide: { type: "string" },
                  impact: { type: "string" },
                  date: { type: "string" },
                  url: { type: "string" }
                }
              }
            },
            trending_topics: { type: "array", items: { type: "string" } },
            threats: { type: "array", items: { type: "string" } },
            opportunities: { type: "array", items: { type: "string" } }
          }
        }
      });

      await base44.entities.MarketAnalysis.create({
        analysis_type: "ai_news_aggregation",
        market_data: newsAnalysis,
        competitor_analysis: {
          news_count: newsAnalysis.news?.length || 0,
          fetch_date: new Date().toISOString()
        }
      });

      return newsAnalysis;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiNews'] });
      setFetching(false);
    },
  });

  const { data: latestNews } = useQuery({
    queryKey: ['aiNews'],
    queryFn: async () => {
      const analyses = await base44.entities.MarketAnalysis.filter(
        { analysis_type: "ai_news_aggregation" },
        '-created_date',
        1
      );
      return analyses[0]?.market_data || null;
    },
  });

  const getCategoryColor = (category) => {
    const colors = {
      'Lancements': 'bg-blue-100 text-blue-700',
      'Investissements': 'bg-green-100 text-green-700',
      'Technique': 'bg-purple-100 text-purple-700',
      'Réglementation': 'bg-orange-100 text-orange-700',
      'Compétiteurs': 'bg-red-100 text-red-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getRelevanceColor = (relevance) => {
    if (relevance === 'high') return 'bg-red-500 text-white';
    if (relevance === 'medium') return 'bg-yellow-500 text-white';
    return 'bg-gray-400 text-white';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Actualités IA Mondiales</h2>
              <p className="text-sm text-slate-600">Flux en temps réel - Dernières 48h</p>
            </div>
          </div>
          <Button
            onClick={() => fetchNewsMutation.mutate()}
            disabled={fetching}
            className="min-h-[44px]"
          >
            {fetching ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {fetching ? 'Recherche...' : 'Actualiser'}
          </Button>
        </div>

        {latestNews ? (
          <Tabs defaultValue="news">
            <TabsList>
              <TabsTrigger value="news">
                Actualités ({latestNews.news?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="trends">
                Tendances
              </TabsTrigger>
              <TabsTrigger value="insights">
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="news" className="space-y-4 mt-4">
              {latestNews.news?.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="p-4 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                          <Badge className={getRelevanceColor(item.relevance_to_druide)}>
                            {item.relevance_to_druide}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{item.summary}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{item.source}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                        {item.impact && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                            <span className="text-xs font-semibold text-blue-700">Impact: </span>
                            <span className="text-xs text-blue-600">{item.impact}</span>
                          </div>
                        )}
                      </div>
                      {item.url && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="trends" className="mt-4">
              <Card className="p-5 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-slate-900">Topics Tendances</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {latestNews.trending_topics?.map((topic, idx) => (
                    <Badge key={idx} className="bg-purple-600 text-white text-sm">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4 mt-4">
              <Card className="p-5 bg-red-50 border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-slate-900">Menaces Potentielles</h3>
                </div>
                <ul className="space-y-2">
                  {latestNews.threats?.map((threat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-600">⚠</span>
                      <span className="text-sm text-slate-700">{threat}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-5 bg-green-50 border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-slate-900">Opportunités Identifiées</h3>
                </div>
                <ul className="space-y-2">
                  {latestNews.opportunities?.map((opp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-slate-700">{opp}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Aucune actualité chargée</p>
            <Button onClick={() => fetchNewsMutation.mutate()}>
              Charger les Actualités
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}