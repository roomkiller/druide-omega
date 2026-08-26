import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useIntegrationRelay } from "@/components/system/IntegrationRelay";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntelligentSynthesisEngine from "../components/synthesis/IntelligentSynthesisEngine";
import { 
  Sparkles, 
  Loader2, 
  TrendingUp,
  Lightbulb,
  Target,
  Brain,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function IntelligentSynthesis() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { relayOn } = useIntegrationRelay();

  const { data: syntheses = [], isLoading, refetch } = useQuery({
    queryKey: ['intelligentSyntheses'],
    queryFn: () => base44.entities.IntelligentSynthesis.list('-created_date', 20)
  });

  const handleGenerateAll = async () => {
    if (!relayOn) { alert("Arrêt interne — relais d'intégration désactivé. Activez le relais (bouton vert en bas à gauche) pour générer les synthèses."); return; }
    setIsGenerating(true);
    try {
      await Promise.all([
        IntelligentSynthesisEngine.synthesizeKnowledgeDiscoveries(),
        IntelligentSynthesisEngine.analyzeInteractionPatterns(),
        IntelligentSynthesisEngine.generateStrategicInsights()
      ]);
      refetch();
    } catch (error) {
      console.error("Erreur génération synthèses:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-blue-600';
      default: return 'bg-slate-600';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'memory_consolidation': return <Brain className="w-5 h-5" />;
      case 'knowledge_discovery': return <Lightbulb className="w-5 h-5" />;
      case 'pattern_analysis': return <TrendingUp className="w-5 h-5" />;
      case 'insight_generation': return <Sparkles className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'memory_consolidation': return 'Consolidation Mémoire';
      case 'knowledge_discovery': return 'Découverte Connaissances';
      case 'pattern_analysis': return 'Analyse Patterns';
      case 'insight_generation': return 'Insights Stratégiques';
      default: return type;
    }
  };

  const filteredSyntheses = activeTab === 'all' 
    ? syntheses 
    : syntheses.filter(s => s.synthesis_type === activeTab);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 px-4 sm:px-6 py-8 sm:py-10 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="ghost"
            size="sm"
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour Dashboard
          </Button>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="min-w-[64px] min-h-[64px] w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Synthèses Intelligentes</h1>
                <p className="text-purple-100 text-sm sm:text-base">Résumés automatiques et actions recommandées</p>
              </div>
            </div>
            <Button
              onClick={handleGenerateAll}
              disabled={isGenerating}
              className="min-h-[48px] w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white backdrop-blur-xl touch-target"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Générer Synthèses
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col overflow-hidden">
            <ScrollArea className="w-full flex-shrink-0 mb-6">
              <TabsList className="inline-flex bg-white shadow-md">
                <TabsTrigger value="all" className="min-h-[44px] touch-target">Toutes</TabsTrigger>
                <TabsTrigger value="knowledge_discovery" className="min-h-[44px] touch-target">
                  <span className="hidden sm:inline">Découvertes</span>
                  <span className="sm:hidden">Déc</span>
                </TabsTrigger>
                <TabsTrigger value="pattern_analysis" className="min-h-[44px] touch-target">Patterns</TabsTrigger>
                <TabsTrigger value="insight_generation" className="min-h-[44px] touch-target">Insights</TabsTrigger>
                <TabsTrigger value="memory_consolidation" className="min-h-[44px] touch-target">
                  <span className="hidden sm:inline">Consolidation</span>
                  <span className="sm:hidden">Cons</span>
                </TabsTrigger>
              </TabsList>
            </ScrollArea>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4 pb-6">
                  {filteredSyntheses.length === 0 ? (
                    <Card className="p-12 text-center">
                      <Sparkles className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2 text-slate-900">Aucune synthèse disponible</h3>
                      <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                        Générez des synthèses intelligentes pour obtenir des résumés automatiques et des actions recommandées
                      </p>
                      <Button onClick={handleGenerateAll} disabled={isGenerating} className="bg-purple-600 hover:bg-purple-700">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Générer Maintenant
                      </Button>
                    </Card>
                  ) : (
                    <AnimatePresence>
                      {filteredSyntheses.map((synthesis, idx) => (
                        <motion.div
                          key={synthesis.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <Card className="p-6 bg-white border-slate-200">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                  {getTypeIcon(synthesis.synthesis_type)}
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg text-slate-900">
                                    {getTypeLabel(synthesis.synthesis_type)}
                                  </h3>
                                  <p className="text-xs text-slate-500">
                                    {new Date(synthesis.created_date).toLocaleString('fr-FR')}
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-purple-600 text-white">
                                Confiance: {synthesis.confidence_score}%
                              </Badge>
                            </div>

                            {/* Executive Summary */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Résumé Exécutif
                              </h4>
                              <p className="text-slate-700">{synthesis.executive_summary}</p>
                            </div>

                            {/* Key Findings */}
                            {synthesis.key_findings?.length > 0 && (
                              <div className="mb-6">
                                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  Découvertes Clés
                                </h4>
                                <div className="space-y-2">
                                  {synthesis.key_findings.map((finding, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                      <Badge className="bg-green-600 text-white mt-0.5">
                                        {finding.importance}/10
                                      </Badge>
                                      <div className="flex-1">
                                        <p className="text-sm text-slate-800 font-medium">{finding.finding}</p>
                                        <Badge variant="outline" className="mt-1 text-xs">
                                          {finding.category}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Patterns */}
                            {synthesis.patterns_discovered?.length > 0 && (
                              <div className="mb-6">
                                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-blue-600" />
                                  Patterns Identifiés
                                </h4>
                                <div className="grid md:grid-cols-2 gap-3">
                                  {synthesis.patterns_discovered.map((pattern, i) => (
                                    <Card key={i} className="p-3 bg-blue-50 border-blue-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <Badge className="bg-blue-600 text-white text-xs">
                                          Fréquence: {pattern.frequency}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-slate-800 font-medium mb-1">{pattern.pattern}</p>
                                      <p className="text-xs text-slate-600">{pattern.significance}</p>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Recommended Actions */}
                            {synthesis.recommended_actions?.length > 0 && (
                              <div className="mb-6">
                                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                  <Target className="w-4 h-4 text-orange-600" />
                                  Actions Recommandées
                                </h4>
                                <div className="space-y-3">
                                  {synthesis.recommended_actions.map((action, i) => (
                                    <Card key={i} className="p-4 border-l-4 border-orange-500">
                                      <div className="flex items-start justify-between mb-2">
                                        <h5 className="font-semibold text-slate-900 flex-1">{action.action}</h5>
                                        <Badge className={`${getPriorityColor(action.priority)} text-white`}>
                                          {action.priority}
                                        </Badge>
                                      </div>
                                      <div className="grid md:grid-cols-3 gap-3 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg">
                                        <div>
                                          <span className="font-semibold text-slate-600">Impact:</span> {action.expected_impact}
                                        </div>
                                        <div>
                                          <span className="font-semibold text-slate-600">Ressources:</span> {action.resources_needed}
                                        </div>
                                        <div>
                                          <span className="font-semibold text-slate-600">Délai:</span> {action.deadline}
                                        </div>
                                      </div>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Insights */}
                            {synthesis.insights?.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                                  Insights Stratégiques
                                </h4>
                                <div className="space-y-2">
                                  {synthesis.insights.map((insight, i) => (
                                    <div key={i} className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                      <ArrowRight className="w-4 h-4 text-yellow-700 mt-0.5 flex-shrink-0" />
                                      <p className="text-sm text-slate-800">{insight}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}