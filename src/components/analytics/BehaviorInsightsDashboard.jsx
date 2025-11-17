/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Behavior Insights Dashboard                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BehaviorAnalyticsEngine } from "./BehaviorAnalyticsEngine";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity, TrendingUp, Zap, Clock, Target, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function BehaviorInsightsDashboard() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    loadAnalysis();
  }, [timeRange]);

  const loadAnalysis = async () => {
    setLoading(true);
    const data = await BehaviorAnalyticsEngine.analyzePatterns(timeRange);
    setAnalysis(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="p-8 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />
          <span className="text-slate-600">Analyse des comportements...</span>
        </div>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="p-8 text-center">
        <p className="text-slate-600">Aucune donnée disponible</p>
      </Card>
    );
  }

  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">Analyse Comportementale</h2>
              <p className="text-sm text-slate-600">{analysis.totalEvents} événements sur {timeRange} jours</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {[7, 14, 30].map(days => (
              <Button
                key={days}
                variant={timeRange === days ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(days)}
              >
                {days}j
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={loadAnalysis}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-slate-600">Actions</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{analysis.totalEvents}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-slate-600">Session moy.</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{analysis.avgSessionDuration}min</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-slate-600">Séquences</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{analysis.actionSequences.length}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-slate-600">Patterns</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{analysis.repetitivePatterns.length}</p>
          </div>
        </div>
      </Card>

      {/* Section Usage */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Utilisation par Section</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analysis.sectionUsage}
                dataKey="count"
                nameKey="section"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.section} (${entry.percentage}%)`}
              >
                {analysis.sectionUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Heures de Pointe</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analysis.peakHours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" label={{ value: 'Heure', position: 'insideBottom', offset: -5 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Feature Frequency */}
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Fonctionnalités Utilisées</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {analysis.featureFrequency.slice(0, 9).map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">{feature.feature}</span>
                <Badge className="bg-purple-600 text-white">{feature.count}x</Badge>
              </div>
              <div className="w-full bg-white rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((feature.count / analysis.featureFrequency[0].count) * 100, 100)}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Action Sequences */}
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Séquences d'Actions Fréquentes
        </h3>
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {analysis.actionSequences.map((seq, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-700">{seq.sequence}</span>
                <Badge variant="outline">{seq.count} fois</Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Repetitive Patterns */}
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-600" />
          Patterns Répétitifs (Opportunités d'Automatisation)
        </h3>
        <div className="space-y-3">
          {analysis.repetitivePatterns.map((pattern, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="border border-orange-200 bg-orange-50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900">{pattern.pattern}</span>
                <Badge className={`${
                  pattern.automation_potential === 'high' 
                    ? 'bg-red-500' 
                    : 'bg-orange-500'
                } text-white`}>
                  {pattern.automation_potential === 'high' ? 'Haute priorité' : 'Moyenne priorité'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>{pattern.count} répétitions</span>
                <span>•</span>
                <span>Intervalle moyen: {pattern.avg_interval_minutes} min</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* AI Insights */}
      {analysis.insights && (
        <Card className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-purple-200">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Insights IA
          </h3>

          <div className="space-y-6">
            {/* Automation Opportunities */}
            {analysis.insights.automation_opportunities?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Opportunités d'Automatisation
                </h4>
                <div className="space-y-2">
                  {analysis.insights.automation_opportunities.map((opp, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-slate-900">{opp.pattern}</p>
                        <Badge className={`${
                          opp.priority === 'high' ? 'bg-red-500' : 
                          opp.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                        } text-white`}>
                          {opp.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{opp.suggested_workflow}</p>
                      <p className="text-xs text-green-600 font-medium">⏱️ Gain estimé: {opp.time_saved}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feature Recommendations */}
            {analysis.insights.feature_recommendations?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Fonctionnalités à Explorer</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {analysis.insights.feature_recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3">
                      <p className="font-medium text-slate-900 mb-1">{rec.feature}</p>
                      <p className="text-xs text-slate-600">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UI Optimizations */}
            {analysis.insights.ui_optimizations?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Optimisations UI</h4>
                <div className="space-y-2">
                  {analysis.insights.ui_optimizations.map((opt, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3">
                      <p className="font-medium text-slate-900 mb-1">{opt.area}</p>
                      <p className="text-sm text-slate-600">{opt.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {analysis.insights.quick_actions?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Actions Rapides Suggérées</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.insights.quick_actions.map((action, idx) => (
                    <Badge key={idx} className="bg-purple-100 text-purple-700">
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}