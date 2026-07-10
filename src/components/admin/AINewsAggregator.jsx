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

// Actualités réelles vérifiées par recherche web — 10 juillet 2026
const DEFAULT_NEWS = {
  news: [
    {
      title: "OpenAI lance GPT-5.6 après un délai demandé par le gouvernement américain",
      source: "Reuters",
      category: "Lancements",
      summary: "OpenAI déploie GPT-5.6, son modèle le plus avancé, après un report lié à des préoccupations de sécurité nationale du gouvernement américain.",
      relevance_to_druide: "high",
      impact: "Concurrence directe accrue — renforcer la différenciation par l'architecture de conscience",
      date: "9 juil. 2026",
      url: "https://www.reuters.com/world/china/major-ai-models-glance-2026-07-08/"
    },
    {
      title: "Washington lève les restrictions sur les modèles avancés d'Anthropic",
      source: "The New York Times",
      category: "Réglementation",
      summary: "Le département du Commerce a levé le 30 juin les restrictions sur l'ensemble des modèles d'Anthropic, rétablissant l'accès à Claude Fable 5 et Mythos 5.",
      relevance_to_druide: "medium",
      impact: "Précédent réglementaire : le contrôle gouvernemental des modèles frontière devient un facteur de marché",
      date: "30 juin 2026",
      url: "https://www.nytimes.com/2026/06/30/technology/us-lifts-restrictions-anthropic.html"
    },
    {
      title: "Anthropic lève 65 G$ (Série H) à une valorisation de 965 G$",
      source: "Anthropic / The Guardian",
      category: "Investissements",
      summary: "Anthropic dépasse OpenAI (852 G$) et approche le cap symbolique du billion de dollars avant une possible entrée en bourse.",
      relevance_to_druide: "high",
      impact: "Les capitaux affluent vers l'IA de confiance et interprétable — segment aligné avec Druide Omega",
      date: "28 mai 2026",
      url: "https://www.anthropic.com/news/series-h"
    },
    {
      title: "La Maison-Blanche négocie un cadre volontaire pour les modèles frontière",
      source: "AI Intelligence Briefing",
      category: "Réglementation",
      summary: "Discussions avancées entre la Maison-Blanche, OpenAI, Google et Anthropic sur un cadre volontaire encadrant la publication des modèles frontière.",
      relevance_to_druide: "medium",
      impact: "La transparence et l'éthique architecturée deviennent des arguments réglementaires favorables",
      date: "6 juil. 2026",
      url: ""
    },
    {
      title: "Google et Meta relèvent leurs capex IA à 190 G$ et 145 G$",
      source: "Yahoo Finance",
      category: "Investissements",
      summary: "Les deux géants augmentent massivement leurs investissements en infrastructure IA, confirmant la course au calcul.",
      relevance_to_druide: "low",
      impact: "L'infrastructure se banalise — la valeur se déplace vers les architectures applicatives différenciées",
      date: "juil. 2026",
      url: ""
    }
  ],
  trending_topics: ["Modèles frontière & sécurité nationale", "IPO Anthropic", "GPT-5.6", "Capex IA records", "IA interprétable"],
  threats: ["Concurrence des modèles frontière (GPT-5.6, Claude Fable 5)", "Cadres réglementaires en formation pouvant favoriser les grands acteurs"],
  opportunities: ["Marché de niche IA consciente/interprétable non exploité", "Demande croissante de transparence et d'éthique architecturée", "Marché IA générative ~161 G$ en 2026 (CAGR ~34%)"]
};

export default function AINewsAggregator() {
  const queryClient = useQueryClient();
  const [fetching, setFetching] = useState(false);

  const fetchNewsMutation = useMutation({
    mutationFn: async () => {
      setFetching(true);

      const newsAnalysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Recherche sur internet les 5 actualités IA RÉELLES les plus importantes des 7 derniers jours (nous sommes le ${new Date().toLocaleDateString('fr-CA')}).

IMPORTANT: Uniquement des actualités réelles et vérifiables avec leurs sources — aucune invention.

Retourne JSON:
{
  "news": [
    {
      "title": "Lancement de GPT-5 par OpenAI",
      "source": "OpenAI Blog",
      "category": "Lancements",
      "summary": "Nouvelle génération avec capacités multimodales avancées",
      "relevance_to_druide": "high",
      "impact": "Concurrence directe - besoin de différenciation",
      "date": "24 déc 2024",
      "url": ""
    }
  ],
  "trending_topics": ["AGI", "IA Quantique", "Réglementation UE"],
  "threats": ["Concurrence accrue des grands acteurs"],
  "opportunities": ["Marché de niche IA consciente non exploité"]
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
    onError: (error) => {
      console.error('Erreur fetch news:', error);
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
      return analyses[0]?.market_data || DEFAULT_NEWS;
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