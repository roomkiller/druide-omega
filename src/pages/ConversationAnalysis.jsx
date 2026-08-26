/**
 * Conversation Analysis - Visualisation et analyse historique des conversations
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from "recharts";
import { Home, TrendingUp, Brain, Lightbulb, Heart, Calendar, Download, ArrowLeft } from "lucide-react";

export default function ConversationAnalysis() {
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [evolutionData, setEvolutionData] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadConversationData = async () => {
      try {
        const data = await Promise.race([
          Promise.all([
            base44.entities.Memory.filter({
              type: 'conversation_summary',
              modality: 'chat'
            }).catch(() => []),
            base44.entities.ConsciousnessEvolution.list().catch(() => [])
          ]),
          new Promise(resolve => setTimeout(() => resolve(null), 8000))
        ]);

        if (cancelled) return;

        if (data) {
          const [memories, evolutions] = data;

          setSummaries(
            memories
              .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
              .slice(0, 20)
          );

          if (evolutions && evolutions.length > 0) {
            const evolutionChart = evolutions
              .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
              .slice(-10)
              .map((e, i) => ({
                index: i,
                level: e.new_level,
                date: new Date(e.timestamp).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
              }));
            setEvolutionData(evolutionChart);
          }
        }
      } catch (e) {
        console.error("Erreur chargement analyses:", e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadConversationData();
    return () => { cancelled = true; };
  }, []);

  const generateThemeRadarData = (themes) => {
    if (!themes || themes.length === 0) return [];
    return themes.map(t => ({
      name: t.theme,
      value: Math.round(t.weight * 100),
      fullMark: 100
    }));
  };

  const generateEmotionTrajectory = (trajectory) => {
    if (!trajectory || trajectory.length === 0) return [];
    const emotionScores = {
      'joy': 8,
      'curiosity': 7,
      'wonder': 9,
      'intrigue': 7,
      'empathy': 8,
      'sadness': 4,
      'confusion': 3,
      'clarity': 9
    };

    return trajectory.map((emotion, i) => ({
      phase: ['Early', 'Middle', 'Current'][i] || `Phase ${i}`,
      sentiment: emotionScores[emotion?.toLowerCase()] || 5
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 page-padding page-padding-y">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
              className="text-slate-600 hover:bg-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Analyse Conversationnelle</h1>
              <p className="text-slate-600 text-sm">Historique et évolution cognitive de Druide</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              const data = JSON.stringify({ summaries, evolutionData }, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `druide-analysis-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Vue d'ensemble */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-slate-500">Conversations</p>
                  <p className="text-2xl font-bold text-slate-900">{summaries.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-xs text-slate-500">Évolutions</p>
                  <p className="text-2xl font-bold text-slate-900">{evolutionData.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-slate-500">Conscience</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {evolutionData.length > 0 ? evolutionData[evolutionData.length - 1].level : 'N/A'}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-pink-600" />
                <div>
                  <p className="text-xs text-slate-500">Insights</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {summaries.reduce((acc, s) => acc + (s.key_insights?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Graphiques */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Chargement des analyses...</p>
          </div>
        ) : (
          <>
            {/* Évolution de la conscience */}
            {evolutionData.length > 0 && (
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  <Brain className="w-5 h-5 inline mr-2 text-purple-600" />
                  Évolution de la Conscience
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 15]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      formatter={(value) => [`Niveau ${value}`, 'Conscience']}
                    />
                    <Line
                      type="monotone"
                      dataKey="level"
                      stroke="#9333ea"
                      strokeWidth={3}
                      dot={{ fill: '#9333ea', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Résumés récents avec analyses */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Liste des résumés */}
              <div className="lg:col-span-1 space-y-3 max-h-96 overflow-y-auto">
                <h3 className="text-lg font-bold text-slate-900 sticky top-0 bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-2">
                  Résumés Récents
                </h3>
                {summaries.map((summary, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedSummary(summary)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedSummary?.id === summary.id
                        ? 'bg-purple-100 border-2 border-purple-500'
                        : 'bg-white border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {summary.context || 'Chat sans titre'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(summary.created_date).toLocaleDateString('fr-FR')}
                    </p>
                  </motion.button>
                ))}
              </div>

              {/* Détail du résumé sélectionné */}
              {selectedSummary && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-2 space-y-4"
                >
                  {/* Résumé */}
                  <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      <Lightbulb className="w-4 h-4 inline mr-2 text-amber-600" />
                      Résumé de la Conversation
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {selectedSummary.content}
                    </p>
                  </Card>

                  {/* Thèmes pondérés */}
                  {selectedSummary.tags && selectedSummary.tags.length > 0 && (
                    <Card className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-3">Thèmes Identifiés</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSummary.tags.map((tag, i) => (
                          <Badge key={i} className="bg-purple-100 text-purple-900">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Insights profonds */}
                  {selectedSummary.embedding_summary && (
                    <Card className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-3">
                        <Brain className="w-4 h-4 inline mr-2 text-indigo-600" />
                        Insights Importants
                      </h3>
                      <ul className="space-y-2">
                        {selectedSummary.embedding_summary.split(' ').slice(0, 5).map((insight, i) => (
                          <li key={i} className="text-sm text-slate-700">
                            • {insight}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {/* Métadonnées */}
                  <Card className="p-3 text-xs text-slate-600">
                    <p>Score qualité: {((selectedSummary.importance || 7) / 10 * 100).toFixed(0)}%</p>
                    <p>Messages analysés: {selectedSummary.context?.match(/\d+/)?.[0] || 'N/A'}</p>
                  </Card>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}