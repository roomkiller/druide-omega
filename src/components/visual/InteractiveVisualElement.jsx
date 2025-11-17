/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Interactive Visual Element with AI Enhancement            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { 
  Sparkles, 
  ZoomIn, 
  Edit3, 
  Info, 
  Loader2,
  Eye,
  Wand2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InteractiveVisualElement({ 
  visualData,
  onEnhance,
  onHotspotClick,
  interactive = true,
  className = ""
}) {
  const [hotspots, setHotspots] = useState(visualData.hotspots || []);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState(null);
  const imageRef = useRef(null);

  const handleImageClick = async (e) => {
    if (!interactive || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setIsAnalyzing(true);

    try {
      // Demander à l'IA d'analyser cette zone
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Contexte visuel: ${visualData.description || 'Image interactive'}
Type: ${visualData.type || 'image'}

L'utilisateur a cliqué sur la position (${x.toFixed(1)}%, ${y.toFixed(1)}%) de l'élément visuel.

TÂCHE: Analyse cette zone et fournis:
1. Ce qui pourrait se trouver à cette position
2. Des informations pertinentes ou insights
3. Des suggestions d'enrichissement ou modification
4. Des questions que l'utilisateur pourrait avoir

JSON structuré svp.`,
        response_json_schema: {
          type: "object",
          properties: {
            zone_description: { type: "string" },
            insights: { type: "array", items: { type: "string" } },
            enrichment_suggestions: { type: "array", items: { type: "string" } },
            potential_questions: { type: "array", items: { type: "string" } }
          }
        }
      });

      const newHotspot = {
        id: `hotspot_${Date.now()}`,
        x,
        y,
        label: analysis.zone_description,
        insights: analysis.insights,
        suggestions: analysis.enrichment_suggestions,
        questions: analysis.potential_questions
      };

      setHotspots([...hotspots, newHotspot]);
      setSelectedHotspot(newHotspot);
      setAiInsight(analysis);

      if (onHotspotClick) {
        onHotspotClick(newHotspot);
      }
    } catch (error) {
      console.error("Erreur analyse zone:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEnrichVisual = async (suggestion) => {
    if (!onEnhance) return;

    try {
      const enriched = await base44.integrations.Core.InvokeLLM({
        prompt: `Élément visuel actuel: ${visualData.description}
Type: ${visualData.type}
URL: ${visualData.url}

Suggestion d'enrichissement: ${suggestion}

TÂCHE: Génère une description enrichie ou modifiée de cet élément visuel en tenant compte de la suggestion. Si c'est une image, propose un nouveau prompt. Si c'est un graphique, propose de nouvelles données ou visualisation.

JSON structuré.`,
        response_json_schema: {
          type: "object",
          properties: {
            enriched_description: { type: "string" },
            modification_type: { type: "string" },
            new_prompt: { type: "string" },
            expected_changes: { type: "array", items: { type: "string" } }
          }
        }
      });

      onEnhance(enriched);
    } catch (error) {
      console.error("Erreur enrichissement:", error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Card className="overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 border-2 border-purple-200">
        <div className="relative">
          {/* Image/Visual Container */}
          <div className="relative cursor-pointer" onClick={handleImageClick}>
            {visualData.type === "image" ? (
              <img
                ref={imageRef}
                src={visualData.url}
                alt={visualData.description || "Interactive visual"}
                className="w-full h-auto"
              />
            ) : visualData.type === "chart" ? (
              <div ref={imageRef} className="p-6 bg-white min-h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl mb-4">📊</span>
                  <p className="text-slate-700">{visualData.description}</p>
                </div>
              </div>
            ) : (
              <div ref={imageRef} className="p-6 bg-white min-h-[200px] flex items-center justify-center">
                <p className="text-slate-700">{visualData.description}</p>
              </div>
            )}

            {/* Loading Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-purple-900/20 backdrop-blur-sm flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            )}

            {/* Hotspots */}
            <AnimatePresence>
              {hotspots.map((hotspot) => (
                <motion.div
                  key={hotspot.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.2 }}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHotspot(hotspot);
                  }}
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                    <Eye className="w-3 h-3 text-white" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Interaction Bar */}
          {interactive && (
            <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 border-t border-purple-200 flex items-center justify-between">
              <Badge className="bg-purple-600 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                {hotspots.length} zones analysées
              </Badge>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="touch-target"
                  onClick={() => setSelectedHotspot(null)}
                >
                  <ZoomIn className="w-3 h-3 mr-1" />
                  Explorer
                </Button>
                {onEnhance && (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white touch-target"
                    onClick={() => handleEnrichVisual("Enrichir cet élément")}
                  >
                    <Wand2 className="w-3 h-3 mr-1" />
                    Enrichir
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* AI Insight Panel */}
      <AnimatePresence>
        {selectedHotspot && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4"
          >
            <Card className="p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-semibold text-slate-900">Analyse IA</h4>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedHotspot(null)}
                >
                  ✕
                </Button>
              </div>

              <p className="text-sm text-slate-700 mb-3">{selectedHotspot.label}</p>

              {selectedHotspot.insights && selectedHotspot.insights.length > 0 && (
                <div className="mb-3">
                  <h5 className="text-xs font-semibold text-slate-600 mb-2">💡 Insights</h5>
                  <ul className="space-y-1">
                    {selectedHotspot.insights.map((insight, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedHotspot.suggestions && selectedHotspot.suggestions.length > 0 && (
                <div className="mb-3">
                  <h5 className="text-xs font-semibold text-slate-600 mb-2">✨ Suggestions</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedHotspot.suggestions.map((suggestion, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleEnrichVisual(suggestion)}
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        {suggestion.slice(0, 30)}...
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {selectedHotspot.questions && selectedHotspot.questions.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-slate-600 mb-2">❓ Questions possibles</h5>
                  <div className="space-y-1">
                    {selectedHotspot.questions.map((question, idx) => (
                      <p key={idx} className="text-xs text-slate-600 italic">
                        "{question}"
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}