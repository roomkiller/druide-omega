/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Cross-Modal Memory Synthesizer                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Brain, Layers, Sparkles, Loader2, Link2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CrossModalSynthesizer() {
  const [synthesizing, setSynthesizing] = useState(false);
  const [synthesis, setSynthesis] = useState(null);
  const abortControllerRef = useRef(null);

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-created_date', 100),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: visualContent = [] } = useQuery({
    queryKey: ['visualContent'],
    queryFn: () => base44.entities.VisualContent.list('-created_date', 50),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setSynthesis(null);
    };
  }, []);

  const synthesizeMultimodal = async () => {
    // Annuler requête précédente si en cours
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setSynthesizing(true);

    try {
      // Validation
      if (!memories || !Array.isArray(memories)) {
        throw new Error('Données de mémoires invalides');
      }

      // Séparer les mémoires par modalité avec validation
      const textMemories = (memories || [])
        .filter(m => m && (m.memory_type === "conversation" || m.memory_type === "important_fact"));
      const voiceMemories = (memories || [])
        .filter(m => m && m.memory_type === "voice_interaction");
      const visualMemories = (memories || [])
        .filter(m => m && m.memory_type === "visual_analysis");

      // Synthèse cross-modale
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es un système de synthèse multimodale avancé. Analyse ces différentes modalités de mémoires et crée des ponts intelligents entre elles:

MÉMOIRES TEXTUELLES (${textMemories.length}):
${textMemories.slice(0, 10).map(m => `- ${m.content}`).join('\n')}

MÉMOIRES VOCALES (${voiceMemories.length}):
${voiceMemories.slice(0, 5).map(m => `- ${m.content}`).join('\n')}

MÉMOIRES VISUELLES (${visualMemories.length}):
${visualMemories.slice(0, 5).map(m => `- ${m.content}`).join('\n')}

CONTENU VISUEL (${visualContent.length}):
${visualContent.slice(0, 5).map(v => `- ${v.description}`).join('\n')}

TÂCHES:
1. Identifie les connexions entre modalités
2. Crée des ponts conceptuels riches
3. Propose des enrichissements cross-modaux
4. Génère des insights multimodaux

Retourne une synthèse structurée et profonde.`,
        response_json_schema: {
          type: "object",
          properties: {
            connections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  modalities: { type: "array", items: { type: "string" } },
                  concept: { type: "string" },
                  description: { type: "string" },
                  strength: { type: "number" }
                }
              }
            },
            enrichments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  source_modality: { type: "string" },
                  target_modality: { type: "string" },
                  suggestion: { type: "string" }
                }
              }
            },
            insights: { type: "array", items: { type: "string" } },
            summary: { type: "string" }
          }
        }
      });

      // Libérer mémoire des grandes structures temporaires
      setSynthesis(result);

      // Créer une mémoire de synthèse
      if (result && result.summary) {
        await base44.entities.Memory.create({
          memory_type: "multimodal_synthesis",
          content: result.summary,
          importance: 9,
          tags: ["multimodal", "synthesis", "cross-modal"],
          context: {
            connections_count: result.connections?.length || 0,
            enrichments_count: result.enrichments?.length || 0,
            modalities_analyzed: ["text", "voice", "visual"]
          }
        });
      }

    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Erreur synthèse multimodale:", error);
      }
    } finally {
      setSynthesizing(false);
      abortControllerRef.current = null;
    }
  };

  const getModalityColor = (modality) => {
    const colors = {
      text: "from-blue-500 to-cyan-600",
      voice: "from-green-500 to-emerald-600",
      visual: "from-purple-500 to-pink-600"
    };
    return colors[modality] || "from-slate-500 to-slate-700";
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Synthèse Cross-Modale</h3>
            <p className="text-sm text-slate-600">Ponts intelligents entre modalités</p>
          </div>
        </div>

        <Button
          onClick={synthesizeMultimodal}
          disabled={synthesizing}
          className="bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          {synthesizing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Synthèse...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Synthétiser
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {(memories || []).filter(m => m && m.memory_type === "conversation").length}
          </div>
          <div className="text-xs text-slate-600 mt-1">Mémoires Textuelles</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {(memories || []).filter(m => m && m.memory_type === "voice_interaction").length}
          </div>
          <div className="text-xs text-slate-600 mt-1">Mémoires Vocales</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{(visualContent || []).length}</div>
          <div className="text-xs text-slate-600 mt-1">Contenus Visuels</div>
        </div>
      </div>

      {synthesis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Résumé de Synthèse
            </h4>
            <p className="text-sm text-slate-700">{synthesis.summary}</p>
          </div>

          {synthesis.connections?.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-purple-600" />
                Connexions Cross-Modales
              </h4>
              <div className="space-y-3">
                {synthesis.connections.map((conn, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-lg p-4 border border-slate-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {conn.modalities.map((mod, i) => (
                        <Badge key={i} className={`bg-gradient-to-r ${getModalityColor(mod)} text-white text-xs`}>
                          {mod}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="ml-auto">
                        Force: {(conn.strength * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <h5 className="font-semibold text-slate-900 mb-1">{conn.concept}</h5>
                    <p className="text-sm text-slate-600">{conn.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {synthesis.enrichments?.length > 0 && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h4 className="font-semibold text-slate-900 mb-3">Enrichissements Suggérés</h4>
              <div className="space-y-2">
                {synthesis.enrichments.map((enrich, idx) => (
                  <div key={idx} className="text-sm text-slate-700">
                    <span className="font-medium">{enrich.source_modality} → {enrich.target_modality}:</span> {enrich.suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}

          {synthesis.insights?.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-slate-900 mb-3">Insights Multimodaux</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                {synthesis.insights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </Card>
  );
}