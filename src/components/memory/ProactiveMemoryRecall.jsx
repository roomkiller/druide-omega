/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Proactive Memory Recall (Enhanced)                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Sparkles, 
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProactiveMemoryRecall({ 
  currentInput, 
  currentModality = "chat",
  memories = [],
  onMemoriesRecalled 
}) {
  const [recalledMemories, setRecalledMemories] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastInput, setLastInput] = useState("");

  useEffect(() => {
    if (currentInput && currentInput.length > 15 && currentInput !== lastInput) {
      const debounce = setTimeout(() => {
        analyzeAndRecall();
      }, 1500);
      return () => clearTimeout(debounce);
    }
  }, [currentInput]);

  const analyzeAndRecall = async () => {
    if (isAnalyzing || memories.length === 0) return;
    
    setIsAnalyzing(true);
    setLastInput(currentInput);

    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse contextuelle pour rappel proactif de mémoires.

INPUT UTILISATEUR: "${currentInput}"
MODALITÉ: ${currentModality}

MÉMOIRES DISPONIBLES (${memories.length}):
${memories.slice(0, 20).map((m, i) => `${i+1}. [${m.type}] ${m.content.slice(0, 100)} | Tags: ${m.tags?.join(', ') || 'none'}`).join('\n')}

TÂCHE:
1. Identifier les mémoires pertinentes pour ce contexte
2. Extraire insights clés
3. Suggérer contexte utile
4. Recommander angles d'approche

Retourne JSON avec:
- relevant_memory_indices: [indices des mémoires pertinentes]
- relevance_scores: {index: score 0-100}
- insights: {
    key_connections: [str],
    recommended_context: str,
    suggested_angles: [str]
  }
- should_show: boolean (true si pertinent)`,
        response_json_schema: {
          type: "object",
          properties: {
            relevant_memory_indices: { type: "array", items: { type: "number" } },
            relevance_scores: { type: "object" },
            insights: {
              type: "object",
              properties: {
                key_connections: { type: "array", items: { type: "string" } },
                recommended_context: { type: "string" },
                suggested_angles: { type: "array", items: { type: "string" } }
              }
            },
            should_show: { type: "boolean" }
          }
        }
      });

      if (analysis.should_show && analysis.relevant_memory_indices?.length > 0) {
        const relevantMems = analysis.relevant_memory_indices
          .map(idx => memories[idx])
          .filter(m => m);

        const result = {
          memories: relevantMems,
          scores: analysis.relevance_scores,
          insights: analysis.insights
        };

        setRecalledMemories(result);
        onMemoriesRecalled?.(result);
      } else {
        setRecalledMemories(null);
      }
    } catch (error) {
      console.error("Erreur rappel mémoire:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!recalledMemories && !isAnalyzing) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <Card className="bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 border-2 border-purple-300 overflow-hidden">
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-purple-100/50 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: isAnalyzing ? 360 : 0,
                  scale: isAnalyzing ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: isAnalyzing ? Infinity : 0, ease: "linear" },
                  scale: { duration: 1, repeat: isAnalyzing ? Infinity : 0 }
                }}
                className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Brain className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Rappel Proactif de Mémoires
                </div>
                <div className="text-xs text-slate-600">
                  {isAnalyzing ? "Analyse en cours..." : `${recalledMemories?.memories?.length || 0} mémoires pertinentes`}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Content */}
          <AnimatePresence>
            {isExpanded && recalledMemories && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4">
                  {/* Insights */}
                  {recalledMemories.insights && (
                    <div className="space-y-3">
                      {recalledMemories.insights.recommended_context && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm font-semibold text-indigo-900">Contexte Recommandé</span>
                          </div>
                          <p className="text-sm text-indigo-800">
                            {recalledMemories.insights.recommended_context}
                          </p>
                        </div>
                      )}

                      {recalledMemories.insights.key_connections?.length > 0 && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-purple-900">Connexions Clés</span>
                          </div>
                          <ul className="space-y-1">
                            {recalledMemories.insights.key_connections.map((conn, idx) => (
                              <li key={idx} className="text-sm text-purple-800 flex items-start gap-2">
                                <span className="text-purple-600">•</span>
                                {conn}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {recalledMemories.insights.suggested_angles?.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="text-sm font-semibold text-green-900 mb-2">
                            Angles Suggérés
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {recalledMemories.insights.suggested_angles.map((angle, idx) => (
                              <Badge key={idx} className="bg-green-100 text-green-700 text-xs">
                                {angle}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recalled Memories */}
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-slate-700">Mémoires Pertinentes</div>
                    {recalledMemories.memories.map((memory, idx) => {
                      const score = recalledMemories.scores?.[idx] || 0;
                      return (
                        <motion.div
                          key={memory.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-white border border-slate-200 rounded-lg p-3 hover:border-purple-300 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {memory.type}
                            </Badge>
                            {score > 0 && (
                              <Badge className="bg-purple-100 text-purple-700 text-xs">
                                {score}% pertinent
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-700 line-clamp-2 mb-2">
                            {memory.content}
                          </p>
                          {memory.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {memory.tags.slice(0, 3).map((tag, tagIdx) => (
                                <Badge key={tagIdx} variant="outline" className="text-[10px]">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}