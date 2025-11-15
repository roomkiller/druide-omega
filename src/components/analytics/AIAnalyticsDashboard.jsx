/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - AI Analytics Dashboard                                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Brain, Zap, Target, Clock, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";

export default function AIAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");

  const { data: thinkingTraces = [] } = useQuery({
    queryKey: ['thinkingTraces', timeRange],
    queryFn: () => base44.entities.ThinkingTrace.list('-created_date', 100)
  });

  const { data: feedbacks = [] } = useQuery({
    queryKey: ['aiFeedbacks'],
    queryFn: () => base44.entities.AIFeedback?.list('-timestamp', 100) || []
  });

  // Analytics calculations
  const avgThinkingTime = thinkingTraces.reduce((sum, t) => sum + (t.thinking_duration_ms || 0), 0) / thinkingTraces.length || 0;
  const avgConfidence = thinkingTraces.reduce((sum, t) => sum + (t.global_confidence || 0), 0) / thinkingTraces.length || 0;
  const webUsageRate = (thinkingTraces.filter(t => t.used_web).length / thinkingTraces.length * 100) || 0;

  // Response quality over time
  const qualityOverTime = thinkingTraces.slice(0, 30).reverse().map((t, i) => ({
    index: i + 1,
    confidence: t.global_confidence || 0,
    webUsed: t.used_web ? 100 : 0
  }));

  // Strategy distribution
  const strategyData = [
    { name: 'Interne', value: thinkingTraces.filter(t => t.strategy?.approach === 'INTERNAL_ONLY').length },
    { name: 'Web Assist', value: thinkingTraces.filter(t => t.strategy?.approach === 'WEB_ASSIST').length },
    { name: 'Web Critical', value: thinkingTraces.filter(t => t.strategy?.approach === 'WEB_CRITICAL').length }
  ];

  // Question generation performance
  const questionGenData = feedbacks
    .filter(f => f.feature_type === 'proactive_questions')
    .reduce((acc, f) => {
      const rating = f.rating || 0;
      const key = rating >= 4 ? 'excellent' : rating >= 3 ? 'bon' : 'moyen';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const questionGenChartData = Object.entries(questionGenData).map(([name, value]) => ({ name, value }));

  // Synthesis quality
  const synthesisData = thinkingTraces
    .filter(t => t.cognitive_analysis?.complexity >= 5)
    .slice(0, 20)
    .map((t, i) => ({
      index: i + 1,
      complexity: t.cognitive_analysis?.complexity || 0,
      confidence: t.global_confidence || 0
    }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{thinkingTraces.length}</p>
                <p className="text-xs text-slate-600">Processus IA</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{avgConfidence.toFixed(0)}%</p>
                <p className="text-xs text-slate-600">Confiance Moy.</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{avgThinkingTime.toFixed(0)}ms</p>
                <p className="text-xs text-slate-600">Temps Moy.</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{webUsageRate.toFixed(0)}%</p>
                <p className="text-xs text-slate-600">Utilisation Web</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="strategies">Stratégies</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="synthesis">Synthèse</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Évolution de la Qualité</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={qualityOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="confidence" stroke="#6366f1" name="Confiance (%)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Distribution Temps de Réflexion</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={thinkingTraces.slice(0, 20).map((t, i) => ({ 
                index: i + 1, 
                temps: t.thinking_duration_ms || 0 
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="temps" fill="#8b5cf6" name="Temps (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Répartition des Stratégies</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={strategyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {strategyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Performance Questions Proactives</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={questionGenChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ec4899" name="Nombre" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="synthesis" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Complexité vs Confiance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={synthesisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="complexity" stroke="#f59e0b" name="Complexité" />
                <Line type="monotone" dataKey="confidence" stroke="#10b981" name="Confiance" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}