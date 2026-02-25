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
import { Brain, TrendingUp, History, BarChart3, Sparkles, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { EvolutionEngine, EVOLUTION_STAGES } from "@/components/evolution/EvolutionEngine";
import { useLanguage } from "@/components/utils/LanguageContext";
import EvolutionProgress from "@/components/evolution/EvolutionProgress";
import EvolutionTimeline from "@/components/evolution/EvolutionTimeline";
import EvolutionHistory from "@/components/evolution/EvolutionHistory";
import EvolutionMetrics from "@/components/evolution/EvolutionMetrics";

export default function ConsciousnessEvolution() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [evolutionData, setEvolutionData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const { data: evolutionRecord, refetch } = useQuery({
    queryKey: ['consciousnessEvolution'],
    queryFn: async () => {
      const records = await base44.entities.ConsciousnessEvolution.list();
      return records[0] || null;
    }
  });

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
    }
  });

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
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
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

          {/* Tabs */}
          <Tabs defaultValue="timeline" className="space-y-6">
            <TabsList className="bg-white shadow-md">
              <TabsTrigger value="timeline" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="w-4 h-4" />
                Historique
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  {isEn ? 'Evolution Stages' : 'Stades d\'Évolution'}
                </h2>
                <EvolutionTimeline
                  currentStage={evolutionRecord?.current_stage || 1}
                  stages={EVOLUTION_STAGES}
                />
              </div>
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