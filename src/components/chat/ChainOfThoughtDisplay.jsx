/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Chain of Thought Reasoning Display                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronDown, ChevronUp, Lightbulb, CheckCircle, Sparkles } from "lucide-react";

export default function ChainOfThoughtDisplay({ reasoning, complexityScore }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!reasoning || reasoning.length === 0) return null;

  return (
    <div className="mb-4">
      <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-indigo-900">Raisonnement Chain-of-Thought</p>
                <p className="text-xs text-indigo-600">{reasoning.length} étapes de réflexion</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-700">
                Complexité: {complexityScore}/10
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Réduire
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Voir le raisonnement
                  </>
                )}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 mt-4"
              >
                {reasoning.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Connection line */}
                    {index < reasoning.length - 1 && (
                      <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 to-purple-300" />
                    )}

                    <div className="relative bg-white rounded-xl p-4 shadow-sm border border-indigo-100">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-indigo-600" />
                            <p className="text-xs font-semibold text-indigo-900">Étape {index + 1}</p>
                          </div>
                          <p className="text-sm text-slate-700 mb-2 leading-relaxed">
                            {step.thought}
                          </p>
                          {step.conclusion && (
                            <div className="flex items-start gap-2 mt-2 p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                              <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-indigo-800 italic">
                                {step.conclusion}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Final synthesis indicator */}
                <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <p className="text-sm font-semibold">Synthèse finale</p>
                  </div>
                  <p className="text-xs opacity-90">
                    L'IA a analysé {reasoning.length} étapes de raisonnement pour formuler sa réponse complète ci-dessous.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}