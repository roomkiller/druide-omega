/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Cross-Modal Synthesizer Component                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Network, MessageSquare, Mic, Image as ImageIcon, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

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

export default function CrossModalSynthesizer({ 
  currentInput, 
  currentModality = "chat",
  memories = [],
  knowledgeBases = [],
  onSynthesisReady 
}) {
  const [synthesis, setSynthesis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const synthesisTimeoutRef = React.useRef(null);
  const abortControllerRef = React.useRef(null);

  useEffect(() => {
    // Debounce pour éviter appels excessifs
    if (synthesisTimeoutRef.current) {
      clearTimeout(synthesisTimeoutRef.current);
    }

    synthesisTimeoutRef.current = setTimeout(() => {
      if (currentInput && currentInput.length > 10) {
        synthesizeProactively();
      }
    }, 1000);

    return () => {
      if (synthesisTimeoutRef.current) {
        clearTimeout(synthesisTimeoutRef.current);
      }
    };
  }, [currentInput]);

  const synthesizeProactively = async () => {
    // Annuler synthèse précédente si en cours
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    
    try {
      // Find cross-modal memories related to current input
      const relevantMemories = (memories || []).filter(m => {
        // Look for memories from other modalities
        if (m.modality === currentModality) return false;
        
        // Check content relevance
        const inputLower = currentInput.toLowerCase();
        const contentMatch = m.content?.toLowerCase().includes(inputLower) ||
          inputLower.split(' ').some(word => 
            word.length > 4 && m.content?.toLowerCase().includes(word)
          );
        
        // Check tag overlap
        const tagMatch = m.tags?.some(tag => 
          inputLower.includes(tag.toLowerCase())
        );
        
        return contentMatch || tagMatch;
      }).slice(0, 5);

      if (relevantMemories.length === 0) {
        setSynthesis(null);
        setIsLoading(false);
        return;
      }

      // Group by modality
      const groupedMemories = relevantMemories.reduce((acc, mem) => {
        if (!acc[mem.modality]) acc[mem.modality] = [];
        acc[mem.modality].push(mem);
        return acc;
      }, {});

      // Create synthesis prompt
      const modalitiesInvolved = Object.keys(groupedMemories);
      const memoriesText = Object.entries(groupedMemories)
        .map(([modality, mems]) => 
          `[${modality.toUpperCase()}]\n${mems.map(m => `- ${m.content} (importance: ${m.importance})`).join('\n')}`
        ).join('\n\n');

      const synthesisPrompt = `Tu es en train de traiter une entrée ${currentModality} de l'utilisateur: "${currentInput}"

MÉMOIRES CROSS-MODALES PERTINENTES:
${memoriesText}

En tant qu'IA consciente, génère une synthèse proactive qui:
1. Identifie les connexions entre ces mémoires de différentes modalités
2. Crée un contexte enrichi en fusionnant les perspectives
3. Suggère des insights émergents de cette fusion cross-modale
4. Propose comment cette synthèse enrichit la compréhension actuelle

Retourne un JSON:
{
  "synthesis": "Synthèse narrative naturelle des connexions",
  "key_connections": ["connexion 1", "connexion 2", "connexion 3"],
  "emergent_insights": ["insight 1", "insight 2"],
  "contextual_enrichment": "Comment cette synthèse enrichit le contexte actuel",
  "modalities_bridged": ["modality1", "modality2"]
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: synthesisPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            synthesis: { type: "string" },
            key_connections: { type: "array", items: { type: "string" } },
            emergent_insights: { type: "array", items: { type: "string" } },
            contextual_enrichment: { type: "string" },
            modalities_bridged: { type: "array", items: { type: "string" } }
          }
        }
      });

      setSynthesis({
        ...result,
        memories: relevantMemories,
        modalityGroups: groupedMemories
      });

      // Store this synthesis as a cognitive correlation (async, non-bloquant)
      base44.entities.CognitiveCorrelation.create({
        correlation_type: "cross_modal",
        source_modality: currentModality,
        target_modality: modalitiesInvolved.join(","),
        source_content: currentInput.slice(0, 500),
        target_content: result.synthesis.slice(0, 500),
        correlation_strength: relevantMemories.length >= 3 ? 8 : 6,
        reasoning_path: result.key_connections.map((conn, i) => ({
          step: i + 1,
          reasoning: conn,
          confidence: 0.8
        })),
        interpretation: result.contextual_enrichment,
        justification: result.synthesis,
        related_memory_ids: relevantMemories.map(m => m.id),
        confidence_level: 85,
        activation_context: `${currentModality} input processing`,
        cognitive_layer: "deep"
      }).catch(err => console.warn('[CrossModal] Erreur stockage correlation:', err));

      // Callback with enriched context
      if (onSynthesisReady) {
        onSynthesisReady(result);
      }

    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Cross-modal synthesis error:", error);
      }
      setSynthesis(null);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (synthesisTimeoutRef.current) {
        clearTimeout(synthesisTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (!synthesis && !isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        className="mb-4"
      >
        <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-300/50 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-indigo-900">Synthèse Cross-Modale Proactive</h3>
                  <p className="text-xs text-indigo-600">
                    {synthesis?.modalities_bridged?.length || 0} modalités connectées
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-indigo-700"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>

            {/* Modalities Bridge */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {synthesis?.modalityGroups && Object.keys(synthesis.modalityGroups).map((modality) => {
                const Icon = MODALITY_ICONS[modality] || Network;
                const color = MODALITY_COLORS[modality];
                return (
                  <div
                    key={modality}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${color} text-white text-xs font-semibold`}
                  >
                    <Icon className="w-3 h-3" />
                    {modality}
                  </div>
                );
              })}
            </div>

            {/* Main Synthesis */}
            {isLoading ? (
              <div className="text-center py-4 text-indigo-600">
                <Sparkles className="w-6 h-6 animate-pulse mx-auto mb-2" />
                <p className="text-sm">Synthèse en cours...</p>
              </div>
            ) : (
              <>
                <div className="bg-white/60 rounded-lg p-3 mb-3">
                  <p className="text-sm text-slate-800 leading-relaxed italic">
                    "{synthesis?.contextual_enrichment}"
                  </p>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {/* Full Synthesis */}
                    <div className="bg-indigo-100/50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-indigo-800 mb-1">Synthèse Complète:</p>
                      <p className="text-sm text-indigo-900">{synthesis?.synthesis}</p>
                    </div>

                    {/* Key Connections */}
                    {synthesis?.key_connections && synthesis.key_connections.length > 0 && (
                      <div className="bg-purple-100/50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-purple-800 mb-2">Connexions Clés:</p>
                        <ul className="space-y-1">
                          {synthesis.key_connections.map((conn, i) => (
                            <li key={i} className="text-sm text-purple-900 flex items-start gap-2">
                              <span className="text-purple-600 font-bold">•</span>
                              {conn}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Emergent Insights */}
                    {synthesis?.emergent_insights && synthesis.emergent_insights.length > 0 && (
                      <div className="bg-pink-100/50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-pink-800 mb-2">Insights Émergents:</p>
                        <ul className="space-y-1">
                          {synthesis.emergent_insights.map((insight, i) => (
                            <li key={i} className="text-sm text-pink-900 flex items-start gap-2">
                              <Sparkles className="w-3 h-3 text-pink-600 mt-0.5 flex-shrink-0" />
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Related Memories */}
                    {synthesis?.memories && synthesis.memories.length > 0 && (
                      <div className="bg-slate-100/50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-slate-800 mb-2">
                          Mémoires Liées ({synthesis.memories.length}):
                        </p>
                        <div className="space-y-2">
                          {synthesis.memories.map((mem) => {
                            const Icon = MODALITY_ICONS[mem.modality];
                            return (
                              <div key={mem.id} className="flex items-start gap-2 text-xs">
                                <Icon className="w-3 h-3 text-slate-600 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-700">{mem.content.slice(0, 80)}...</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}