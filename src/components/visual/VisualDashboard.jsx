/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Visual Dashboard with AI Interactions                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import InteractiveVisualElement from "./InteractiveVisualElement";
import { 
  Image as ImageIcon, 
  BarChart3, 
  Sparkles,
  Plus,
  Eye,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VisualDashboard() {
  const [selectedVisual, setSelectedVisual] = useState(null);
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: visuals = [], isLoading } = useQuery({
    queryKey: ['visualContent'],
    queryFn: () => base44.entities.VisualContent.list('-created_date'),
  });

  const enhanceVisualMutation = useMutation({
    mutationFn: async ({ visualId, enrichedData }) => {
      return await base44.entities.VisualContent.update(visualId, {
        enriched_metadata: enrichedData,
        interaction_count: (visuals.find(v => v.id === visualId)?.interaction_count || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visualContent'] });
    }
  });

  const createInteractiveVisual = async () => {
    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Génère un concept d'élément visuel interactif pour le tableau de bord Druide Omega.

Propose:
1. Type (image, graphique, diagramme)
2. Description du concept
3. Suggestions de zones interactives
4. Valeur ajoutée pour l'utilisateur

JSON structuré.`,
        response_json_schema: {
          type: "object",
          properties: {
            type: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            suggested_hotspots: { type: "array", items: { type: "string" } },
            value_proposition: { type: "string" }
          }
        }
      });

      // Si c'est une image, générer
      let url = null;
      if (analysis.type === "image") {
        const imageResult = await base44.integrations.Core.GenerateImage({
          prompt: analysis.description
        });
        url = imageResult.url;
      }

      await base44.entities.VisualContent.create({
        type: analysis.type,
        title: analysis.title,
        description: analysis.description,
        url: url,
        metadata: {
          suggested_hotspots: analysis.suggested_hotspots,
          value_proposition: analysis.value_proposition
        },
        interaction_count: 0,
        tags: ['interactive', 'ai-generated']
      });

      queryClient.invalidateQueries({ queryKey: ['visualContent'] });
    } catch (error) {
      console.error("Erreur création visuel:", error);
    }
  };

  const handleHotspotClick = async (visualId, hotspot) => {
    // Log l'interaction
    const visual = visuals.find(v => v.id === visualId);
    if (!visual) return;

    const interactions = visual.metadata?.interactions || [];
    interactions.push({
      hotspot_id: hotspot.id,
      timestamp: new Date().toISOString(),
      insights_viewed: hotspot.insights?.length || 0
    });

    await base44.entities.VisualContent.update(visualId, {
      metadata: {
        ...visual.metadata,
        interactions
      }
    });
  };

  const handleEnhance = async (visualId, enrichedData) => {
    await enhanceVisualMutation.mutateAsync({ visualId, enrichedData });
  };

  const filteredVisuals = visuals.filter(v => {
    if (filter === "all") return true;
    return v.type === filter;
  });

  const stats = {
    total: visuals.length,
    images: visuals.filter(v => v.type === "image").length,
    charts: visuals.filter(v => v.type === "chart").length,
    interactions: visuals.reduce((sum, v) => sum + (v.interaction_count || 0), 0)
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Tableau Visuel Interactif</h1>
                <p className="text-sm text-slate-600">Explorez et enrichissez avec l'IA</p>
              </div>
            </div>

            <Button
              onClick={createInteractiveVisual}
              className="bg-gradient-to-r from-purple-600 to-pink-600 touch-target"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-white">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                  <div className="text-xs text-slate-600">Éléments</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-pink-50 to-white">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-8 h-8 text-pink-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stats.images}</div>
                  <div className="text-xs text-slate-600">Images</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-indigo-50 to-white">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-indigo-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stats.charts}</div>
                  <div className="text-xs text-slate-600">Graphiques</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-white">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stats.interactions}</div>
                  <div className="text-xs text-slate-600">Interactions</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/60 px-4 sm:px-6 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex gap-2">
          {["all", "image", "chart", "diagram"].map(f => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className="touch-target"
            >
              {f === "all" ? "Tous" : f === "image" ? "Images" : f === "chart" ? "Graphiques" : "Diagrammes"}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {isLoading ? (
            <div className="text-center py-16">
              <Layers className="w-12 h-12 text-purple-600 mx-auto animate-pulse" />
              <p className="text-slate-600 mt-4">Chargement...</p>
            </div>
          ) : filteredVisuals.length === 0 ? (
            <div className="text-center py-16">
              <Layers className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun élément</h3>
              <p className="text-sm text-slate-600 mb-6">Créez votre premier élément interactif</p>
              <Button
                onClick={createInteractiveVisual}
                className="bg-gradient-to-r from-purple-600 to-pink-600 touch-target"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredVisuals.map((visual, idx) => (
                  <motion.div
                    key={visual.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">{visual.title}</h3>
                        <p className="text-xs text-slate-600">{visual.description}</p>
                      </div>
                      <Badge variant="outline">
                        {visual.interaction_count || 0} interactions
                      </Badge>
                    </div>
                    
                    <InteractiveVisualElement
                      visualData={{
                        type: visual.type,
                        url: visual.url,
                        description: visual.description,
                        hotspots: visual.metadata?.hotspots || []
                      }}
                      onEnhance={(enriched) => handleEnhance(visual.id, enriched)}
                      onHotspotClick={(hotspot) => handleHotspotClick(visual.id, hotspot)}
                      interactive={true}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}