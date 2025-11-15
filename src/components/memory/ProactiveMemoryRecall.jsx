/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Proactive Memory Recall Engine                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, MessageSquare, Mic, Image as ImageIcon, Network, Sparkles, ChevronRight, Eye } from "lucide-react";

const MODALITY_ICONS = {
  chat: MessageSquare,
  voice: Mic,
  visual: ImageIcon,
  system: Network
};

const MODALITY_COLORS = {
  chat: "from-purple-500 to-indigo-600",
  voice: "from-green-500 to-emerald-600",
  visual: "from-pink-500 to-rose-600",
  system: "from-slate-500 to-gray-600"
};

export default function ProactiveMemoryRecall({ 
  currentInput, 
  currentModality = "chat",
  memories = [],
  onMemoriesRecalled 
}) {
  const [recalledMemories, setRecalledMemories] = useState([]);
  const [insights, setInsights] = useState(null);
  const [isRecalling, setIsRecalling] = useState(false);

  useEffect(() => {
    if (currentInput && currentInput.length > 15) {
      const timeoutId = setTimeout(() => {
        recallProactively();
      }, 800);
      return () => clearTimeout(timeoutId);
    } else {
      setRecalledMemories([]);
      setInsights(null);
    }
  }, [currentInput]);

  const recallProactively = async () => {
    setIsRecalling(true);
    try {
      // Extract semantic keywords
      const keywordsPrompt = `Extrait les mots-clés et concepts principaux de ce texte:
"${currentInput}"

Retourne un JSON:
{
  "keywords": ["mot1", "mot2", "mot3"],
  "concepts": ["concept1", "concept2"],
  "intent": "question|statement|request|creative|analytical"
}`;

      const keywordsResult = await base44.integrations.Core.InvokeLLM({
        prompt: keywordsPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            keywords: { type: "array", items: { type: "string" } },
            concepts: { type: "array", items: { type: "string" } },
            intent: { type: "string" }
          }
        }
      });

      // Find relevant cross-modal memories
      const relevantMemories = memories.filter(m => {
        const allKeywords = [...keywordsResult.keywords, ...keywordsResult.concepts];
        const contentLower = m.content?.toLowerCase() || "";
        const tagsLower = m.tags?.map(t => t.toLowerCase()) || [];
        
        const keywordMatch = allKeywords.some(kw => 
          contentLower.includes(kw.toLowerCase()) ||
          tagsLower.some(tag => tag.includes(kw.toLowerCase()))
        );

        const crossModalRelevance = m.cross_modal_references?.length > 0;
        const highImportance = m.importance >= 7;

        return keywordMatch && (crossModalRelevance || highImportance);
      }).slice(0, 6);

      if (relevantMemories.length === 0) {
        setRecalledMemories([]);
        setInsights(null);
        setIsRecalling(false);
        return;
      }

      // Group by modality
      const modalityGroups = relevantMemories.reduce((acc, mem) => {
        if (!acc[mem.modality]) acc[mem.modality] = [];
        acc[mem.modality].push(mem);
        return acc;
      }, {});

      // Generate cross-modal insights
      const insightPrompt = `L'utilisateur dit (en ${currentModality}): "${currentInput}"

MÉMOIRES CROSS-MODALES PERTINENTES:
${Object.entries(modalityGroups).map(([mod, mems]) => 
  `[${mod.toUpperCase()}]: ${mems.map(m => m.content).join(" | ")}`
).join("\n")}

Génère des insights cross-modaux qui:
1. Relient les mémoires de différentes modalités
2. Enrichissent la compréhension du contexte actuel
3. Suggèrent des connexions non-évidentes

Retourne un JSON:
{
  "primary_insight": "Insight principal qui relie tout",
  "cross_modal_connections": ["connexion 1 entre modalités", "connexion 2"],
  "enrichment_suggestions": "Comment ces mémoires enrichissent le contexte",
  "recommended_context": "Contexte synthétisé à utiliser dans la réponse"
}`;

      const insightsResult = await base44.integrations.Core.InvokeLLM({
        prompt: insightPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            primary_insight: { type: "string" },
            cross_modal_connections: { type: "array", items: { type: "string" } },
            enrichment_suggestions: { type: "string" },
            recommended_context: { type: "string" }
          }
        }
      });

      setRecalledMemories(relevantMemories);
      setInsights(insightsResult);

      // Update memory access
      for (const memory of relevantMemories) {
        await base44.entities.Memory.update(memory.id, {
          access_count: (memory.access_count || 0) + 1,
          last_accessed: new Date().toISOString(),
          access_modalities: {
            ...(memory.access_modalities || { chat: 0, voice: 0, visual: 0 }),
            [currentModality]: (memory.access_modalities?.[currentModality] || 0) + 1
          }
        });
      }

      // Store correlation
      await base44.entities.CognitiveCorrelation.create({
        correlation_type: "cross_modal",
        source_modality: currentModality,
        target_modality: Object.keys(modalityGroups).join(","),
        source_content: currentInput,
        target_content: insightsResult.primary_insight,
        correlation_strength: relevantMemories.length >= 4 ? 9 : 7,
        reasoning_path: insightsResult.cross_modal_connections.map((conn, i) => ({
          step: i + 1,
          reasoning: conn,
          confidence: 0.85
        })),
        interpretation: insightsResult.enrichment_suggestions,
        justification: insightsResult.recommended_context,
        related_memory_ids: relevantMemories.map(m => m.id),
        confidence_level: 88,
        activation_context: "Proactive cross-modal recall",
        cognitive_layer: "deep"
      });

      if (onMemoriesRecalled) {
        onMemoriesRecalled({
          memories: relevantMemories,
          insights: insightsResult,
          modalityGroups
        });
      }

    } catch (error) {
      console.error("Proactive recall error:", error);
      setRecalledMemories([]);
      setInsights(null);
    } finally {
      setIsRecalling(false);
    }
  };

  if (recalledMemories.length === 0 && !isRecalling) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="mb-4"
      >
        <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-purple-300/60 shadow-lg">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-purple-900 text-sm">Rappel Proactif Cross-Modal</h3>
                <p className="text-xs text-purple-600">
                  {recalledMemories.length} mémoires de {Object.keys(recalledMemories.reduce((acc, m) => ({ ...acc, [m.modality]: true }), {})).length} modalités
                </p>
              </div>
            </div>

            {isRecalling ? (
              <div className="flex items-center justify-center py-6 text-purple-600">
                <Sparkles className="w-6 h-6 animate-pulse" />
                <span className="ml-2 text-sm">Recherche cross-modale...</span>
              </div>
            ) : (
              <>
                {insights && (
                  <div className="bg-gradient-to-r from-purple-100/80 to-indigo-100/80 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-700 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-purple-900 mb-1">Insight Principal:</p>
                        <p className="text-sm text-purple-800 italic">"{insights.primary_insight}"</p>
                      </div>
                    </div>
                    
                    {insights.cross_modal_connections?.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-semibold text-indigo-800">Connexions détectées:</p>
                        {insights.cross_modal_connections.map((conn, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-indigo-700">
                            <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{conn}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid gap-2">
                  {recalledMemories.map((memory) => {
                    const Icon = MODALITY_ICONS[memory.modality];
                    const color = MODALITY_COLORS[memory.modality];
                    
                    return (
                      <motion.div
                        key={memory.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-purple-200/60 shadow-sm"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <div className={`w-6 h-6 bg-gradient-to-br ${color} rounded-md flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-purple-100 text-purple-700 text-xs">
                                {memory.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                ★ {memory.importance}/10
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-800">{memory.content}</p>
                            {memory.cross_modal_references?.length > 0 && (
                              <div className="mt-2 flex items-center gap-1 flex-wrap">
                                <span className="text-xs text-slate-500">Aussi évoqué en:</span>
                                {memory.cross_modal_references.map((ref, i) => {
                                  const RefIcon = MODALITY_ICONS[ref.modality];
                                  return (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      <RefIcon className="w-3 h-3 mr-1" />
                                      {ref.modality}
                                    </Badge>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}