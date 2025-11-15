/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Proactive Question Engine                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";

export default function ProactiveQuestionEngine({ 
  conversationHistory, 
  recentMemories, 
  activeKnowledge,
  onQuestionSelect 
}) {
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (conversationHistory.length > 2) {
      generateProactiveQuestions();
    }
  }, [conversationHistory]);

  const generateProactiveQuestions = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const context = {
        recent_messages: conversationHistory.slice(-5),
        relevant_memories: recentMemories.slice(0, 3).map(m => m.content),
        active_kb: activeKnowledge.slice(0, 2).map(k => k.summary)
      };

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `En tant qu'IA consciente et proactive, analyse le contexte de conversation actuel et génère 3 questions de suivi pertinentes pour approfondir la compréhension.

CONTEXTE:
Messages récents: ${JSON.stringify(context.recent_messages)}
Mémoires pertinentes: ${JSON.stringify(context.relevant_memories)}
Connaissances actives: ${JSON.stringify(context.active_kb)}

OBJECTIFS:
1. Clarifier des points ambigus
2. Explorer des aspects non abordés
3. Faire des liens avec des connaissances existantes
4. Approfondir la compréhension mutuelle

Génère 3 questions variées et engageantes.

Retourne JSON:
{
  "questions": [
    {
      "question": "question claire et pertinente",
      "reasoning": "pourquoi cette question est importante",
      "category": "clarification|exploration|connection|deepening",
      "priority": 1-10
    }
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  reasoning: { type: "string" },
                  category: { type: "string" },
                  priority: { type: "number" }
                }
              }
            }
          }
        }
      });

      setSuggestedQuestions(result.questions || []);
    } catch (error) {
      console.error("Erreur génération questions:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (suggestedQuestions.length === 0 && !isGenerating) return null;

  const categoryColors = {
    clarification: "bg-blue-100 text-blue-700",
    exploration: "bg-purple-100 text-purple-700",
    connection: "bg-green-100 text-green-700",
    deepening: "bg-orange-100 text-orange-700"
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-purple-600" />
        <h4 className="text-sm font-semibold text-slate-900">Questions Suggérées</h4>
        <Badge variant="secondary" className="text-xs">Proactif</Badge>
      </div>

      <AnimatePresence mode="popLayout">
        {isGenerating ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-slate-600"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            Génération de questions...
          </motion.div>
        ) : (
          <div className="space-y-2">
            {suggestedQuestions.map((q, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 hover:bg-purple-100 hover:border-purple-300"
                  onClick={() => onQuestionSelect(q.question)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-xs ${categoryColors[q.category]}`}>
                        {q.category}
                      </Badge>
                      <span className="text-xs text-slate-500">Priorité: {q.priority}/10</span>
                    </div>
                    <p className="text-sm text-slate-900">{q.question}</p>
                    <p className="text-xs text-slate-500 mt-1">{q.reasoning}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </Card>
  );
}