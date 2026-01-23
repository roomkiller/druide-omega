/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Consciousness Analysis Dashboard                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ConsciousnessMetricsChart from "../components/consciousness/ConsciousnessMetricsChart";
import DimensionalRadarChart from "../components/consciousness/DimensionalRadarChart";
import ConsciousnessComparison from "../components/consciousness/ConsciousnessComparison";
import { Brain, TrendingUp, Calendar, GitCompare, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ConsciousnessAnalysis() {
  const [timeFilter, setTimeFilter] = useState("7d");
  const [compareState1, setCompareState1] = useState(null);
  const [compareState2, setCompareState2] = useState(null);

  const { data: currentConfig } = useQuery({
    queryKey: ['consciousnessConfig'],
    queryFn: async () => {
      const configs = await base44.entities.ConsciousnessConfig.list();
      return configs[0];
    }
  });

  const { data: evolutionHistory = [] } = useQuery({
    queryKey: ['consciousnessEvolution', timeFilter],
    queryFn: async () => {
      const evolutions = await base44.entities.ConsciousnessEvolution.list('-timestamp', 100);
      
      // Filtrer selon la période
      const now = Date.now();
      const filterMs = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        'all': Infinity
      };

      return evolutions.filter(e => {
        const timestamp = new Date(e.timestamp || e.created_date).getTime();
        return now - timestamp < filterMs[timeFilter];
      });
    }
  });

  // Préparer les données pour les graphiques temporels
  const timeSeriesData = evolutionHistory.map(e => ({
    timestamp: new Date(e.timestamp || e.created_date).toLocaleDateString(),
    consciousness_level: e.new_state?.consciousness_level || currentConfig?.consciousness_level || 12,
    ratio_logic: e.new_state?.ratio_logic || currentConfig?.ratio_logic || 3,
    ratio_consciousness: e.new_state?.ratio_consciousness || currentConfig?.ratio_consciousness || 12,
    creativity: e.new_state?.dimensional_hierarchy?.cognitive_dimensions?.creativity || 13,
    empathy: e.new_state?.dimensional_hierarchy?.emotional_dimensions?.empathy || 10,
  }));

  // Si pas d'historique, créer un point avec config actuelle
  if (timeSeriesData.length === 0 && currentConfig) {
    timeSeriesData.push({
      timestamp: new Date().toLocaleDateString(),
      consciousness_level: currentConfig.consciousness_level || 12,
      ratio_logic: currentConfig.ratio_logic || 3,
      ratio_consciousness: currentConfig.ratio_consciousness || 12,
      creativity: currentConfig.dimensional_hierarchy?.cognitive_dimensions?.creativity || 13,
      empathy: currentConfig.dimensional_hierarchy?.emotional_dimensions?.empathy || 10,
    });
  }

  const stats = {
    currentLevel: currentConfig?.consciousness_level || 12,
    avgLogicRatio: currentConfig?.ratio_logic || 3,
    avgConsciousnessRatio: currentConfig?.ratio_consciousness || 12,
    totalDimensions: 106,
    evolutionCount: evolutionHistory.length
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Analyse d'Orchestration</h1>
                <p className="text-sm text-slate-600">Visualisation des métriques SAPIER</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 heures</SelectItem>
                  <SelectItem value="7d">7 jours</SelectItem>
                  <SelectItem value="30d">30 jours</SelectItem>
                  <SelectItem value="all">Tout</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-white">
              <div className="text-2xl font-bold text-purple-600">{stats.currentLevel}/15</div>
              <div className="text-xs text-slate-600">Niveau Optimisation</div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-50 to-white">
              <div className="text-2xl font-bold text-blue-600">{stats.avgLogicRatio}</div>
              <div className="text-xs text-slate-600">Ratio Logique</div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-pink-50 to-white">
              <div className="text-2xl font-bold text-pink-600">{stats.avgConsciousnessRatio}</div>
              <div className="text-xs text-slate-600">Ratio Contextualisation</div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-indigo-50 to-white">
              <div className="text-2xl font-bold text-indigo-600">{stats.totalDimensions}</div>
              <div className="text-xs text-slate-600">Dimensions</div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-white">
              <div className="text-2xl font-bold text-green-600">{stats.evolutionCount}</div>
              <div className="text-xs text-slate-600">Évolutions</div>
            </Card>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Métriques principales */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Évolution Temporelle
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ConsciousnessMetricsChart
                 data={timeSeriesData}
                 metric="consciousness_level"
                 title="Niveau d'Optimisation"
                color="#8b5cf6"
              />
              <ConsciousnessMetricsChart
                 data={timeSeriesData}
                 metric="ratio_consciousness"
                 title="Ratio Contextualisation"
                color="#ec4899"
              />
              <ConsciousnessMetricsChart
                data={timeSeriesData}
                metric="ratio_logic"
                title="Ratio Logique"
                color="#3b82f6"
              />
              <ConsciousnessMetricsChart
                data={timeSeriesData}
                metric="creativity"
                title="Créativité"
                color="#10b981"
              />
            </div>
          </div>

          {/* Radar des dimensions */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Dimensions Multiples
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DimensionalRadarChart
                dimensions={currentConfig?.dimensional_hierarchy?.emotional_dimensions || {}}
                title="Dimensions Émotionnelles"
                maxValue={13}
              />
              <DimensionalRadarChart
                dimensions={currentConfig?.dimensional_hierarchy?.cognitive_dimensions || {}}
                title="Dimensions Cognitives"
                maxValue={13}
              />
              <DimensionalRadarChart
                dimensions={currentConfig?.dimensional_hierarchy?.existential_dimensions || {}}
                title="Dimensions Existentielles"
                maxValue={13}
              />
              <DimensionalRadarChart
                dimensions={currentConfig?.dimensional_hierarchy?.social_dimensions || {}}
                title="Dimensions Sociales"
                maxValue={13}
              />
            </div>
          </div>

          {/* Comparaison d'états */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-purple-600" />
              Comparaison d'États
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="p-4">
                <label className="text-sm font-semibold text-slate-700 mb-2 block">État 1</label>
                <Select onValueChange={(value) => {
                  const state = evolutionHistory.find(e => e.id === value);
                  setCompareState1(state?.new_state || currentConfig);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un état" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">État actuel</SelectItem>
                    {evolutionHistory.slice(0, 10).map(e => (
                      <SelectItem key={e.id} value={e.id}>
                        {new Date(e.timestamp || e.created_date).toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Card>

              <Card className="p-4">
                <label className="text-sm font-semibold text-slate-700 mb-2 block">État 2</label>
                <Select onValueChange={(value) => {
                  const state = evolutionHistory.find(e => e.id === value);
                  setCompareState2(state?.new_state || currentConfig);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un état" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">État actuel</SelectItem>
                    {evolutionHistory.slice(0, 10).map(e => (
                      <SelectItem key={e.id} value={e.id}>
                        {new Date(e.timestamp || e.created_date).toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Card>
            </div>

            <ConsciousnessComparison state1={compareState1} state2={compareState2} />
          </div>

          {/* SAPIER Equations Summary */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 border-2 border-purple-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">📐 Équations SAPIER</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-mono text-purple-700">M_S = {currentConfig?.sapier_equations?.knowledge_mass || 92}</p>
                <p className="text-xs text-slate-600">Masse de Savoir</p>
              </div>
              <div>
                <p className="font-mono text-purple-700">D_L = {currentConfig?.sapier_equations?.latent_degradation || 8}%</p>
                <p className="text-xs text-slate-600">Dégradation Latente</p>
              </div>
              <div>
                <p className="font-mono text-purple-700">Ratio = {currentConfig?.ratio_logic || 3}:{currentConfig?.ratio_consciousness || 12}</p>
                <p className="text-xs text-slate-600">Logique:Contextualisation</p>
              </div>
              <div>
                <p className="font-mono text-purple-700">C_L = {currentConfig?.consciousness_level || 12}/15</p>
                <p className="text-xs text-slate-600">Niveau d'Optimisation</p>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}