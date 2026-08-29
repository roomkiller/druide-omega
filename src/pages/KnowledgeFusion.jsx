/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Knowledge Fusion Page                                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useIntegrationRelay } from "@/components/system/IntegrationRelay";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import FusionAnalyzer from "@/components/knowledge/FusionAnalyzer";
import ComparativeAnalysis from "@/components/knowledge/ComparativeAnalysis";
import KnowledgeGraphVisualizer from "@/components/neural/KnowledgeGraphVisualizer";
import { Network, Zap, TrendingUp, Plus, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/utils/LanguageContext";
import { navigateTo } from "@/lib/spaNavigate";

export default function KnowledgeFusion() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [selectedKBs, setSelectedKBs] = useState([]);
  const [fusionType, setFusionType] = useState("synthesis");
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const { relayOn } = useIntegrationRelay();

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['knowledge-bases'],
    queryFn: () => base44.entities.KnowledgeBase.list(),
    initialData: []
  });

  const { data: fusions = [] } = useQuery({
    queryKey: ['knowledge-fusions'],
    queryFn: () => base44.entities.KnowledgeFusion.list('-created_date'),
    initialData: []
  });

  const activeKBs = knowledgeBases.filter(kb => kb.status === 'ready');

  const toggleKBSelection = (kbId) => {
    setSelectedKBs(prev =>
      prev.includes(kbId)
        ? prev.filter(id => id !== kbId)
        : [...prev, kbId]
    );
  };

  const handleCreateFusion = () => {
    if (!relayOn) { alert("Arrêt interne — relais d'intégration désactivé. Activez le relais (bouton vert en bas à gauche) pour créer une fusion."); return; }
    if (selectedKBs.length < 2) {
      alert("Sélectionnez au moins 2 sources pour créer une fusion");
      return;
    }
    setShowAnalyzer(true);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-indigo-50 overflow-hidden">
      {/* Header */}
      <div className="flex-none px-4 sm:px-6 py-6 sm:py-8 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={() => navigateTo('ArchitectDashboard')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au Dashboard
          </Button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="min-w-[56px] min-h-[56px] w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
                <Network className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Fusion de Connaissances</h1>
                <p className="text-sm text-slate-500">
                  {fusions.length} analyses • {selectedKBs.length} sources sélectionnées
                </p>
              </div>
            </div>

            <Button
              onClick={handleCreateFusion}
              disabled={selectedKBs.length < 2}
              className="min-h-[48px] w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 touch-target"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer une Fusion
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Network className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-slate-700">Sources Disponibles</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">{activeKBs.length}</div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-slate-700">Fusions Créées</span>
              </div>
              <div className="text-2xl font-bold text-purple-700">{fusions.length}</div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-slate-700">Insights Générés</span>
              </div>
              <div className="text-2xl font-bold text-green-700">
                {fusions.reduce((sum, f) => sum + (f.emergent_insights?.length || 0), 0)}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6">
          {showAnalyzer ? (
            <FusionAnalyzer
              selectedKBIds={selectedKBs}
              knowledgeBases={knowledgeBases}
              fusionType={fusionType}
              onClose={() => setShowAnalyzer(false)}
              onComplete={() => {
                setShowAnalyzer(false);
                setSelectedKBs([]);
                queryClient.invalidateQueries({ queryKey: ['knowledge-fusions'] });
              }}
            />
          ) : (
            <>
              <Card className="p-6 sm:p-8 mb-6 bg-white/80 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Sélection des Sources</h2>
                <p className="text-slate-600 mb-4">
                  Sélectionnez 2 sources ou plus pour créer une analyse de fusion
                </p>
                
                {activeKBs.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">
                    Aucune source disponible. Uploadez des documents d'abord.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activeKBs.map(kb => (
                      <div
                        key={kb.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer touch-target min-h-[64px] ${
                          selectedKBs.includes(kb.id)
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                        onClick={() => toggleKBSelection(kb.id)}
                      >
                        <Checkbox
                          checked={selectedKBs.includes(kb.id)}
                          onCheckedChange={() => toggleKBSelection(kb.id)}
                          className="min-w-[24px] min-h-[24px]"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{kb.title}</h3>
                          <p className="text-sm text-slate-600">
                            {kb.source_type} • {kb.extracted_facts?.length || 0} faits extraits
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {fusions.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-900">Analyses Précédentes</h2>
                  {fusions.map(fusion => (
                    <div key={fusion.id} className="space-y-4">
                      <ComparativeAnalysis fusion={fusion} />
                      {fusion.knowledge_graph && (
                        <KnowledgeGraphVisualizer 
                          graph={fusion.knowledge_graph}
                          title={`Knowledge Graph: ${fusion.fusion_title}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}