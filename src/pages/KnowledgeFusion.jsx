/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Knowledge Fusion Page                                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import FusionAnalyzer from "@/components/knowledge/FusionAnalyzer";
import ComparativeAnalysis from "@/components/knowledge/ComparativeAnalysis";
import { Network, Zap, TrendingUp, Plus } from "lucide-react";
import { useLanguage } from "@/components/utils/LanguageContext";

export default function KnowledgeFusion() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [selectedKBs, setSelectedKBs] = useState([]);
  const [fusionType, setFusionType] = useState("synthesis");
  const [showAnalyzer, setShowAnalyzer] = useState(false);

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
    if (selectedKBs.length < 2) {
      alert("Sélectionnez au moins 2 sources pour créer une fusion");
      return;
    }
    setShowAnalyzer(true);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="flex-none px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Fusion de Connaissances</h1>
              <p className="text-sm text-slate-500">
                {fusions.length} analyses • {selectedKBs.length} sources sélectionnées
              </p>
            </div>
          </div>

          <Button
            onClick={handleCreateFusion}
            disabled={selectedKBs.length < 2}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer une Fusion
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <ScrollArea className="flex-1">
        <div className="p-6">
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
              <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Sélection des Sources</h2>
                <p className="text-slate-600 mb-4">
                  Sélectionnez 2 sources ou plus pour créer une analyse de fusion comparative
                </p>
                
                {activeKBs.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">
                    Aucune source de connaissances disponible. Uploadez des documents d'abord.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activeKBs.map(kb => (
                      <div
                        key={kb.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          selectedKBs.includes(kb.id)
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                        onClick={() => toggleKBSelection(kb.id)}
                      >
                        <Checkbox
                          checked={selectedKBs.includes(kb.id)}
                          onCheckedChange={() => toggleKBSelection(kb.id)}
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
                    <ComparativeAnalysis key={fusion.id} fusion={fusion} />
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