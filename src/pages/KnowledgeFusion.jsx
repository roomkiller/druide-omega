/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Knowledge Fusion Page                                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Database, TrendingUp, Network, Brain, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

import FusionAnalyzer from "../components/knowledge/FusionAnalyzer";
import ComparativeAnalysis from "../components/knowledge/ComparativeAnalysis";
import InteractiveKnowledgeGraph from "../components/knowledge/InteractiveKnowledgeGraph";

export default function KnowledgeFusion() {
  const [selectedFusion, setSelectedFusion] = useState(null);

  const { data: fusions = [], isLoading } = useQuery({
    queryKey: ['knowledgeFusions'],
    queryFn: () => base44.entities.KnowledgeFusion.list('-last_updated'),
  });

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list({ status: 'ready' }),
  });

  const handleFusionComplete = (fusion) => {
    setSelectedFusion(fusion);
  };

  const stats = [
    { label: "Fusions Créées", value: fusions.length, icon: Sparkles, color: "purple" },
    { label: "Sources Disponibles", value: knowledgeBases.length, icon: Database, color: "blue" },
    { label: "Insights Émergents", value: fusions.reduce((sum, f) => sum + (f.emergent_insights?.length || 0), 0), icon: Lightbulb, color: "yellow" },
    { label: "Graphes Générés", value: fusions.filter(f => f.knowledge_graph).length, icon: Network, color: "green" }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      {/* Header */}
      <div className="px-6 py-6 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Knowledge Fusion</h1>
              <p className="text-slate-600">Synthétisez et analysez vos connaissances de manière proactive</p>
            </div>
            <div className="flex items-center gap-3">
              <Brain className="w-12 h-12 text-indigo-600" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={`p-4 bg-${stat.color}-50/50 border-${stat.color}-200 hover:shadow-lg transition-all`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-600">{stat.label}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="mb-6 bg-white/80 backdrop-blur-sm border border-slate-200">
              <TabsTrigger value="create" className="data-[state=active]:bg-indigo-100">
                <Sparkles className="w-4 h-4 mr-2" />
                Créer une Fusion
              </TabsTrigger>
              <TabsTrigger value="fusions" className="data-[state=active]:bg-purple-100">
                <Database className="w-4 h-4 mr-2" />
                Fusions Existantes ({fusions.length})
              </TabsTrigger>
              {selectedFusion && (
                <>
                  <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-100">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analyse
                  </TabsTrigger>
                  <TabsTrigger value="graph" className="data-[state=active]:bg-green-100">
                    <Network className="w-4 h-4 mr-2" />
                    Graphe
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Create Fusion Tab */}
            <TabsContent value="create" className="mt-0">
              <FusionAnalyzer onFusionComplete={handleFusionComplete} />
            </TabsContent>

            {/* Fusions List Tab */}
            <TabsContent value="fusions" className="mt-0">
              {fusions.length === 0 ? (
                <Card className="p-12 bg-white text-center border-2 border-dashed border-slate-300">
                  <Sparkles className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    Aucune fusion créée
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Créez votre première fusion de connaissances pour commencer
                  </p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {fusions.map((fusion, idx) => (
                    <motion.div
                      key={fusion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card
                        className={`p-6 cursor-pointer transition-all hover:shadow-xl ${
                          selectedFusion?.id === fusion.id
                            ? 'bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-400'
                            : 'bg-white hover:border-indigo-300'
                        }`}
                        onClick={() => setSelectedFusion(fusion)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-bold text-slate-900 flex-1">
                            {fusion.fusion_title}
                          </h3>
                          <Badge className="bg-indigo-200 text-indigo-800 capitalize">
                            {fusion.fusion_type}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="p-3 bg-white/60 rounded-lg">
                            <p className="text-xs text-slate-600">Sources</p>
                            <p className="text-lg font-bold text-slate-900">{fusion.source_kb_ids?.length || 0}</p>
                          </div>
                          <div className="p-3 bg-white/60 rounded-lg">
                            <p className="text-xs text-slate-600">Insights</p>
                            <p className="text-lg font-bold text-slate-900">{fusion.emergent_insights?.length || 0}</p>
                          </div>
                        </div>

                        {fusion.fusion_quality && (
                          <div className="space-y-2">
                            {Object.entries(fusion.fusion_quality).slice(0, 2).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-2">
                                <span className="text-xs text-slate-600 capitalize w-24">{key}:</span>
                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                                    style={{ width: `${value}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-slate-700">{value}%</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-xs text-slate-500">
                            Dernière mise à jour: {new Date(fusion.last_updated).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Analysis Tab */}
            {selectedFusion && (
              <TabsContent value="analysis" className="mt-0">
                <ComparativeAnalysis fusion={selectedFusion} />
              </TabsContent>
            )}

            {/* Graph Tab */}
            {selectedFusion && (
              <TabsContent value="graph" className="mt-0">
                <InteractiveKnowledgeGraph fusion={selectedFusion} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCEAU DE PROPRIÉTÉ INTELLECTUELLE
 * © 2025 AMG+A.L - PROPRIÉTAIRE
 * Innovation: Knowledge Fusion System
 * Référence: AMG-AL-DO-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */