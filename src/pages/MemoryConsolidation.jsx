import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import MemoryConsolidationEngine from "../components/memory/MemoryConsolidationEngine";
import IntelligentSynthesisEngine from "../components/synthesis/IntelligentSynthesisEngine";
import { 
  Brain, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Database,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function MemoryConsolidation() {
  const [isConsolidating, setIsConsolidating] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [synthesis, setSynthesis] = useState(null);

  const handleConsolidate = async () => {
    setIsConsolidating(true);
    setProgress(0);
    setSynthesis(null); // Reset synthesis on new consolidation run

    try {
      setProgress(25);
      const consolidationResults = await MemoryConsolidationEngine.runFullConsolidation();
      
      setProgress(75); // Update progress after consolidation, before synthesis
      setResults(consolidationResults);
      
      // Générer synthèse intelligente
      const intelligentSynthesis = await IntelligentSynthesisEngine.synthesizeMemoryConsolidation(consolidationResults);
      setSynthesis(intelligentSynthesis);
      setProgress(100);
    } catch (error) {
      console.error("Erreur consolidation:", error);
    } finally {
      setIsConsolidating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 sm:px-6 py-8 sm:py-10 flex-shrink-0">
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
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Consolidation Intelligente</h1>
                <p className="text-purple-100 text-sm sm:text-base">Fusion automatique conversations → mémoires → connaissances</p>
              </div>
            </div>
            <Button
              onClick={handleConsolidate}
              disabled={isConsolidating}
              className="min-h-[48px] w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white backdrop-blur-xl touch-target"
            >
              {isConsolidating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              <span className="hidden sm:inline">Lancer Consolidation</span>
              <span className="sm:hidden">Lancer</span>
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 h-full">
          <ScrollArea className="h-full">
            <div className="space-y-6 pr-4 pb-6">
              {isConsolidating && (
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Consolidation en cours...</h3>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                </Card>
              )}

              {/* NEW: Synthesis Section */}
              {synthesis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-900">
                      <Sparkles className="w-5 h-5" />
                      Synthèse Intelligente
                    </h3>
                    
                    <div className="mb-4 p-4 bg-white rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">Résumé Exécutif</h4>
                      <p className="text-slate-700">{synthesis.executive_summary}</p>
                    </div>

                    {synthesis.recommended_actions?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-3">Actions Recommandées</h4>
                        <div className="space-y-2">
                          {synthesis.recommended_actions.map((action, i) => (
                            <Card key={i} className="p-3 bg-white">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-slate-900 text-sm">{action.action}</span>
                                <Badge className={`${action.priority === 'high' || action.priority === 'critical' ? 'bg-red-600' : 'bg-blue-600'} text-white text-xs`}>
                                  {action.priority}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-600">{action.expected_impact}</p>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}

              {results && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Résumé */}
                    <div className="grid md:grid-cols-4 gap-4">
                      <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                          <div>
                            <div className="text-2xl font-bold text-green-900">
                              {results.conversations_to_memories.length}
                            </div>
                            <div className="text-sm text-green-700">Mémoires créées</div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Database className="w-8 h-8 text-blue-600" />
                          <div>
                            <div className="text-2xl font-bold text-blue-900">
                              {results.memories_to_knowledge.length}
                            </div>
                            <div className="text-sm text-blue-700">Connaissances créées</div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                        <div className="flex items-center gap-3 mb-2">
                          <AlertTriangle className="w-8 h-8 text-orange-600" />
                          <div>
                            <div className="text-2xl font-bold text-orange-900">
                              {results.contradictions_detected.length}
                            </div>
                            <div className="text-sm text-orange-700">Contradictions détectées</div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <div className="flex items-center gap-3 mb-2">
                          <TrendingUp className="w-8 h-8 text-purple-600" />
                          <div>
                            <div className="text-2xl font-bold text-purple-900">
                              {results.contradictions_resolved.length}
                            </div>
                            <div className="text-sm text-purple-700">Contradictions résolues</div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Détails des mémoires créées */}
                    {results.conversations_to_memories.length > 0 && (
                      <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          Nouvelles Mémoires Créées
                        </h3>
                        <div className="space-y-3">
                          {results.conversations_to_memories.map((result, idx) => (
                            <Card key={idx} className="p-4 bg-green-50">
                              <div className="flex items-start justify-between mb-2">
                                <Badge className="bg-green-600">Mémoire</Badge>
                                <Badge variant="outline">Importance: {result.memory.importance}/10</Badge>
                              </div>
                              <p className="text-sm text-slate-700">{result.memory.content}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {result.memory.tags?.map((tag, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </Card>
                    )}

                    {/* Détails des connaissances créées */}
                    {results.memories_to_knowledge.length > 0 && (
                      <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Database className="w-5 h-5 text-blue-600" />
                          Nouvelles Connaissances Structurées
                        </h3>
                        <div className="space-y-3">
                          {results.memories_to_knowledge.map((result, idx) => (
                            <Card key={idx} className="p-4 bg-blue-50">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-bold text-blue-900">{result.knowledge.title}</h4>
                                <Badge className="bg-blue-600">Connaissance</Badge>
                              </div>
                              <p className="text-sm text-slate-700 mb-2">{result.knowledge.content.slice(0, 200)}...</p>
                              <div className="text-xs text-slate-500">
                                Synthétisé depuis {result.sources.length} mémoires
                              </div>
                            </Card>
                          ))}
                        </div>
                      </Card>
                    )}

                    {/* Contradictions détectées */}
                    {results.contradictions_detected.length > 0 && (
                      <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                          Contradictions Détectées
                        </h3>
                        <div className="space-y-3">
                          {results.contradictions_detected.slice(0, 5).map((contradiction, idx) => (
                            <Card key={idx} className="p-4 bg-orange-50 border-orange-200">
                              <div className="flex items-start justify-between mb-2">
                                <Badge className="bg-orange-600">
                                  {contradiction.type}
                                </Badge>
                                <Badge variant="outline">
                                  {contradiction.contradiction.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-700 font-medium mb-2">
                                {contradiction.contradiction.details}
                              </p>
                              <div className="grid md:grid-cols-2 gap-2 text-xs">
                                <div className="bg-white p-2 rounded">
                                  <div className="font-semibold text-slate-600 mb-1">Source 1:</div>
                                  <div className="text-slate-700">
                                    {JSON.stringify(contradiction.source1).slice(0, 100)}...
                                  </div>
                                </div>
                                <div className="bg-white p-2 rounded">
                                  <div className="font-semibold text-slate-600 mb-1">Source 2:</div>
                                  <div className="text-slate-700">
                                    {JSON.stringify(contradiction.source2).slice(0, 100)}...
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </Card>
                    )}

                    {/* Contradictions résolues */}
                    {results.contradictions_resolved.length > 0 && (
                      <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                          Contradictions Résolues Automatiquement
                        </h3>
                        <div className="space-y-3">
                          {results.contradictions_resolved.map((resolution, idx) => (
                            <Card key={idx} className="p-4 bg-purple-50">
                              <div className="flex items-center justify-between mb-2">
                                <Badge className="bg-purple-600">{resolution.resolution}</Badge>
                                <Badge variant="outline">{resolution.type}</Badge>
                              </div>
                              <p className="text-sm text-slate-700">
                                {resolution.reason || 'Résolution appliquée avec succès'}
                              </p>
                            </Card>
                          ))}
                        </div>
                      </Card>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              {!results && !isConsolidating && !synthesis && (
                <Card className="p-12 text-center">
                  <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Consolidation Intelligente</h3>
                  <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                    Lancez une consolidation complète pour fusionner automatiquement vos conversations en mémoires, 
                    vos mémoires en connaissances structurées, et détecter/résoudre les contradictions.
                  </p>
                  <Button onClick={handleConsolidate} className="min-h-[48px] bg-purple-600 hover:bg-purple-700 touch-target">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Démarrer la Consolidation
                  </Button>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}