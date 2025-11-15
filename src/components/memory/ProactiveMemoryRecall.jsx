import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, MessageSquare, Mic, Image as ImageIcon, Network, Sparkles, Eye } from "lucide-react";

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
    if (!currentInput || currentInput.length < 15) {
      setRecalledMemories([]);
      setInsights(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      recallProactively();
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [currentInput]);

  const recallProactively = async () => {
    if (!memories || memories.length === 0) return;
    
    setIsRecalling(true);
    try {
      const inputLower = currentInput.toLowerCase();
      const words = inputLower.split(' ').filter(w => w.length > 4);

      const relevantMemories = memories.filter(m => {
        const contentLower = m.content?.toLowerCase() || "";
        const tagsLower = m.tags?.map(t => t.toLowerCase()) || [];
        
        const keywordMatch = words.some(word => 
          contentLower.includes(word) || tagsLower.some(tag => tag.includes(word))
        );

        return keywordMatch && m.importance >= 6;
      }).slice(0, 5);

      if (relevantMemories.length === 0) {
        setRecalledMemories([]);
        setInsights(null);
        setIsRecalling(false);
        return;
      }

      const modalityGroups = relevantMemories.reduce((acc, mem) => {
        if (!acc[mem.modality]) acc[mem.modality] = [];
        acc[mem.modality].push(mem);
        return acc;
      }, {});

      const insightPrompt = `Input (${currentModality}): "${currentInput}"

MÉMOIRES:
${relevantMemories.map(m => `[${m.modality}] ${m.content}`).join("\n")}

Génère un insight cross-modal concis.

JSON:
{
  "primary_insight": "insight principal",
  "recommended_context": "contexte synthétisé pour enrichir la réponse"
}`;

      const insightsResult = await base44.integrations.Core.InvokeLLM({
        prompt: insightPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            primary_insight: { type: "string" },
            recommended_context: { type: "string" }
          }
        }
      });

      setRecalledMemories(relevantMemories);
      setInsights(insightsResult);

      for (const memory of relevantMemories) {
        await base44.entities.Memory.update(memory.id, {
          access_count: (memory.access_count || 0) + 1,
          last_accessed: new Date().toISOString()
        });
      }

      if (onMemoriesRecalled) {
        onMemoriesRecalled({
          memories: relevantMemories,
          insights: insightsResult,
          modalityGroups
        });
      }

    } catch (error) {
      console.error("Recall error:", error);
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
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-4"
      >
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300/60">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-purple-900 text-sm">Rappel Cross-Modal</h3>
                <p className="text-xs text-purple-600">{recalledMemories.length} mémoires</p>
              </div>
            </div>

            {isRecalling ? (
              <div className="flex items-center justify-center py-4">
                <Sparkles className="w-5 h-5 animate-pulse text-purple-600" />
                <span className="ml-2 text-sm text-purple-600">Recherche...</span>
              </div>
            ) : (
              <>
                {insights?.primary_insight && (
                  <div className="bg-purple-100/80 rounded-lg p-3 mb-3">
                    <p className="text-sm text-purple-900 italic">"{insights.primary_insight}"</p>
                  </div>
                )}

                <div className="space-y-2">
                  {recalledMemories.map((memory) => {
                    const Icon = MODALITY_ICONS[memory.modality] || Brain;
                    const color = MODALITY_COLORS[memory.modality];
                    
                    return (
                      <div
                        key={memory.id}
                        className="bg-white/90 rounded-lg p-3 border border-purple-200/60"
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-6 h-6 bg-gradient-to-br ${color} rounded-md flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1">
                            <Badge className="bg-purple-100 text-purple-700 text-xs mb-1">
                              {memory.modality}
                            </Badge>
                            <p className="text-sm text-slate-800">{memory.content}</p>
                          </div>
                        </div>
                      </div>
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