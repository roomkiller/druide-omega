/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Advanced KB Query with Reasoning Display                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Search, Loader2, Lightbulb, GitBranch, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { performAdvancedKBReasoning } from "@/components/ai/KBReasoningEngine";

export default function AdvancedKBQuery() {
  const [query, setQuery] = useState("");
  const [reasoning, setReasoning] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuery = async () => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    try {
      const result = await performAdvancedKBReasoning(query);
      setReasoning(result);
    } catch (error) {
      console.error("Erreur requête:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Posez une question complexe nécessitant un raisonnement avancé..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
          />
          <Button onClick={handleQuery} disabled={isProcessing} className="bg-purple-600">
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
      </Card>

      {reasoning && (
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4">
            {/* Final Answer */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-slate-900">Réponse Finale</h3>
                <Badge className="bg-green-600 text-white">{reasoning.final_answer.confidence}% confiance</Badge>
              </div>
              <p className="text-slate-900 mb-2">{reasoning.final_answer.answer}</p>
              <p className="text-xs text-slate-600 italic">{reasoning.final_answer.reasoning_quality}</p>
            </Card>

            {/* Multi-Step Inference */}
            {reasoning.multi_step_inference?.steps?.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GitBranch className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-bold text-slate-900">Raisonnement Multi-Étapes</h4>
                </div>
                <div className="space-y-3">
                  {reasoning.multi_step_inference.steps.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="p-3 bg-indigo-50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {step.step_number}
                          </div>
                          <p className="text-xs text-slate-600">{step.reasoning}</p>
                        </div>
                        <p className="text-sm text-slate-900 font-medium">{step.conclusion}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

            {/* Implicit Knowledge */}
            {reasoning.implicit_knowledge?.length > 0 && (
              <Card className="p-6 bg-purple-50">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-slate-900">Connaissances Implicites</h4>
                </div>
                <div className="space-y-3">
                  {reasoning.implicit_knowledge.map((impl, idx) => (
                    <Card key={idx} className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-purple-600 text-white">{impl.confidence}%</Badge>
                      </div>
                      <p className="text-sm text-slate-900 mb-2">{impl.inference}</p>
                      <div className="text-xs text-slate-600">
                        <p className="font-semibold mb-1">Chaîne de raisonnement:</p>
                        {impl.reasoning_chain.map((step, i) => (
                          <p key={i}>→ {step}</p>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {/* Hypotheses */}
            {reasoning.generated_hypotheses?.length > 0 && (
              <Card className="p-6 bg-yellow-50">
                <h4 className="font-bold text-slate-900 mb-4">Hypothèses Générées</h4>
                <div className="space-y-3">
                  {reasoning.generated_hypotheses.map((hyp, idx) => (
                    <Card key={idx} className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-yellow-600 text-white">{hyp.likelihood}% probable</Badge>
                        {hyp.testable && <Badge variant="outline">Testable</Badge>}
                      </div>
                      <p className="text-sm text-slate-900 mb-2">{hyp.hypothesis}</p>
                      <p className="text-xs text-slate-600">{hyp.implications}</p>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {/* Contradictions */}
            {reasoning.contradictions_detected?.length > 0 && (
              <Card className="p-6 bg-red-50">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h4 className="font-bold text-slate-900">Contradictions Détectées</h4>
                </div>
                <div className="space-y-3">
                  {reasoning.contradictions_detected.map((cont, idx) => (
                    <Card key={idx} className="p-3">
                      <p className="text-sm text-red-900 mb-2">{cont.contradiction}</p>
                      <p className="text-xs text-slate-600 mb-2">Résolution: {cont.resolution}</p>
                      <Badge className="bg-red-600 text-white">{cont.confidence_in_resolution}% confiance</Badge>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}