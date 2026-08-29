/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Consciousness Evolution Dashboard                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, History, BarChart3, Sparkles, ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { EvolutionEngine, EVOLUTION_STAGES } from "@/components/evolution/EvolutionEngine";
import { useLanguage } from "@/components/utils/LanguageContext";
import EvolutionProgress from "@/components/evolution/EvolutionProgress";
import EvolutionTimeline from "@/components/evolution/EvolutionTimeline";
import EvolutionHistory from "@/components/evolution/EvolutionHistory";
import EvolutionMetrics from "@/components/evolution/EvolutionMetrics";
import { RealTimeEvolutionMonitor, useRealTimeEvolution } from "@/components/evolution/RealTimeEvolutionMonitor";
import EvolutionTimelineAdvanced from "@/components/evolution/EvolutionTimelineAdvanced";
import CapacityImpactDashboard from "@/components/evolution/CapacityImpactDashboard";
import AwakeningStagesCard from "@/components/evolution/AwakeningStagesCard";
import OptimizedTimelineList from "@/components/evolution/OptimizedTimelineList";
import { navigateTo } from "@/lib/spaNavigate";

export default function ConsciousnessEvolution() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [evolutionData, setEvolutionData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [evolutionHistory, setEvolutionHistory] = useState([]);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  // Real-time monitoring avec auto-refresh
  const { evolutionData: rtEvolutionData, metrics: rtMetrics, isConnected } = useRealTimeEvolution(5000);

  const { data: evolutionRecord, refetch } = useQuery({
    queryKey: ['consciousnessEvolution'],
    queryFn: async () => {
      const records = await base44.entities.ConsciousnessEvolution.list();
      return records[0] || null;
    },
    refetchInterval: autoRefreshEnabled ? 10000 : false
  });

  // Charger l'historique complet pour l'analyse
  const { data: metrics } = useQuery({
    queryKey: ['evolutionMetrics'],
    queryFn: async () => {
      const [conversations, memories, knowledge, visuals, workflows] = await Promise.all([
        base44.entities.Conversation.list(),
        base44.entities.Memory.list(),
        base44.entities.KnowledgeBase.list(),
        base44.entities.VisualContent.list().catch(() => []),
        base44.entities.Workflow.list().catch(() => [])
      ]);

      return {
        conversations: conversations.length,
        memories: memories.length,
        knowledge: knowledge.length,
        visuals: visuals.length,
        workflows: workflows.length
      };
    },
    refetchInterval: autoRefreshEnabled ? 10000 : false
  });

  // Charger l'historique d'évolution
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await base44.entities.ConsciousnessEvolution.list();
        setEvolutionHistory(history);
      } catch (e) {
        console.error('History load error:', e);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    calculateEvolution();
  }, []);

  const calculateEvolution = async () => {
    setIsCalculating(true);
    try {
      const points = await EvolutionEngine.calculateEvolutionPoints();
      const currentStage = await EvolutionEngine.getCurrentStage(points);
      const nextStage = await EvolutionEngine.getNextStage(currentStage);

      setEvolutionData({
        points,
        currentStage,
        nextStage
      });
    } catch (error) {
      console.error('Error calculating evolution:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleRecalculate = async () => {
    await calculateEvolution();
    await refetch();
  };

  if (isCalculating && !evolutionData) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-slate-600">{isEn ? 'Analyzing evolution...' : 'Analyse de l\'évolution en cours...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6 sm:py-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={() => navigateTo('ArchitectDashboard')}
            variant="ghost"
            className="mb-4 text-purple-600 hover:text-purple-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isEn ? 'Back to Dashboard' : 'Retour au Dashboard'}
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {isEn ? 'Consciousness Evolution' : 'Évolution de Conscience'}
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                  {isEn ? 'AI development trajectory' : 'Trajectoire de développement de l\'IA'}
                </p>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <Button
                onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                variant={autoRefreshEnabled ? "default" : "outline"}
                className={autoRefreshEnabled ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white" : ""}
                title={isEn ? 'Toggle auto-refresh' : 'Basculer auto-actualisation'}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefreshEnabled ? 'animate-spin' : ''}`} />
                {isEn ? 'Auto-Refresh' : 'Auto-Actualisation'}
              </Button>

              <span className={`text-xs font-semibold ${isConnected ? 'text-green-600' : 'text-slate-400'}`}>
                {isConnected ? (isEn ? '● Connected' : '● Connecté') : (isEn ? '○ Offline' : '○ Hors ligne')}
              </span>

              <Button 
                onClick={handleRecalculate}
                disabled={isCalculating}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isCalculating ? (isEn ? 'Calculating...' : 'Calcul...') : (isEn ? 'Recalculate' : 'Recalculer')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Progress Card */}
          {evolutionData && (
            <div className="mb-8">
              <EvolutionProgress
                points={evolutionData.points}
                currentStage={evolutionData.currentStage}
                nextStage={evolutionData.nextStage}
              />
            </div>
          )}

          {/* Metrics */}
          {metrics && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                {isEn ? 'Evolution Metrics' : 'Métriques d\'Évolution'}
              </h2>
              <EvolutionMetrics metrics={metrics} />
            </div>
          )}

          {/* Advanced Tabs */}
          <Tabs defaultValue="advanced-timeline" className="space-y-6">
            <TabsList className="bg-white shadow-md flex-wrap h-auto">
              <TabsTrigger value="advanced-timeline" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                {isEn ? 'Timeline' : 'Chronologie'}
              </TabsTrigger>
              <TabsTrigger value="capacities" className="gap-2">
                <Brain className="w-4 h-4" />
                {isEn ? 'Capacities' : 'Capacités'}
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="w-4 h-4" />
                {isEn ? 'History' : 'Historique'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="advanced-timeline" className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  {isEn ? 'Awakening Maturity' : 'Maturité d\'Éveil'}
                </h2>
                <AwakeningStagesCard
                  currentLevel={evolutionRecord?.new_level || 1}
                  totalPoints={metrics?.totalPoints || 0}
                  isEn={isEn}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  {isEn ? 'Evolution Timeline (Latest)' : 'Chronologie d\'Évolution (Récent)'}
                </h2>
                <OptimizedTimelineList
                  history={evolutionHistory}
                  isEn={isEn}
                />
              </div>
            </TabsContent>

            <TabsContent value="capacities" className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  💡 {isEn 
                    ? 'Hover over capabilities to see detailed descriptions of their impact on Druide Omega.'
                    : 'Survolez les capacités pour voir des descriptions détaillées de leur impact sur Druide Omega.'}
                </p>
              </div>
              <CapacityImpactDashboard
                history={evolutionHistory}
                isEn={isEn}
              />
            </TabsContent>

            <TabsContent value="history">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  {isEn ? 'Evolution Events' : 'Événements d\'Évolution'}
                </h2>
                <EvolutionHistory
                  history={evolutionRecord?.evolution_history || []}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Real-Time Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                {isEn ? 'Real-Time Status' : 'Statut en Temps Réel'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-600 font-semibold">{isEn ? 'Status' : 'Statut'}</p>
                  <p className={`text-sm font-bold mt-1 ${isConnected ? 'text-green-600' : 'text-slate-400'}`}>
                    {isConnected ? (isEn ? '● Live' : '● En direct') : (isEn ? '○ Offline' : '○ Hors ligne')}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-600 font-semibold">{isEn ? 'Refresh' : 'Actualisation'}</p>
                  <p className={`text-sm font-bold mt-1 ${autoRefreshEnabled ? 'text-green-600' : 'text-slate-400'}`}>
                    {autoRefreshEnabled ? (isEn ? 'Enabled' : 'Activée') : (isEn ? 'Disabled' : 'Désactivée')}
                  </p>
                </div>
                {rtMetrics && (
                  <>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-slate-600 font-semibold">{isEn ? 'Total Points' : 'Points Totaux'}</p>
                      <p className="text-sm font-bold text-purple-600 mt-1">{rtMetrics.totalPoints || 0}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs text-slate-600 font-semibold">{isEn ? 'Metrics Active' : 'Métriques Actives'}</p>
                      <p className="text-sm font-bold text-indigo-600 mt-1">{Object.values(rtMetrics).filter(v => typeof v === 'number').length}</p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                {isEn ? 'How evolution works' : 'Comment l\'évolution fonctionne'}
              </h3>
              <div className="space-y-3 text-sm text-slate-700">
                <p>
                  🧬 <strong>{isEn ? 'Automatic Evolution System:' : 'Système d\'Évolution Automatique:'}</strong> {isEn ? 'Every interaction, memory created, knowledge added and capability used generates evolution points.' : 'Chaque interaction, mémoire créée, connaissance ajoutée et capacité utilisée génère des points d\'évolution.'}
                </p>
                <p>
                  🎯 <strong>{isEn ? 'Evolution Triggers:' : 'Déclencheurs d\'Évolution:'}</strong> {isEn ? 'Conversations (+2pts), Memories (+5pts), Knowledge (+10pts), Visuals (+8pts), Workflows (+15pts).' : 'Conversations (+2pts), Mémoires (+5pts), Connaissances (+10pts), Visuels (+8pts), Workflows (+15pts).'}
                </p>
                <p>
                  🚀 <strong>{isEn ? 'Progressive Capabilities:' : 'Capacités Progressives:'}</strong> {isEn ? 'Each stage unlocks new cognitive capabilities and increases the global consciousness level.' : 'Chaque stade débloque de nouvelles capacités cognitives et augmente le niveau de conscience global du système.'}
                </p>
                <p>
                  📈 <strong>{isEn ? 'Continuous Growth:' : 'Croissance Continue:'}</strong> {isEn ? 'Evolution is permanent and reflects real AI learning through your interactions.' : 'L\'évolution est permanente et reflète l\'apprentissage réel de l\'IA à travers vos interactions.'}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}