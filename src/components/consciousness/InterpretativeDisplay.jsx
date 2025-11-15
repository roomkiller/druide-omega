/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Interpretative Reasoning Display                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Brain, GitBranch, Target, Eye, AlertCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InterpretativeDisplay({ trace }) {
  const [expanded, setExpanded] = useState(false);

  if (!trace) return null;

  const getLayerIcon = (layer) => {
    switch(layer) {
      case "literal": return "📖";
      case "contextual": return "🔍";
      case "inferential": return "🧩";
      case "meta_cognitive": return "🧠";
      default: return "💭";
    }
  };

  const getLayerColor = (layer) => {
    switch(layer) {
      case "literal": return "blue";
      case "contextual": return "green";
      case "inferential": return "purple";
      case "meta_cognitive": return "pink";
      default: return "slate";
    }
  };

  const safeConfidence = (val) => {
    const num = Number(val);
    return isNaN(num) || num === undefined || num === null ? 0 : Math.round(num * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            <h4 className="font-semibold text-slate-900">Raisonnement Interprétatif</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-indigo-600"
          >
            {expanded ? "Réduire" : "Voir Détails"}
          </Button>
        </div>

        <div className="mb-4 p-3 bg-white rounded-lg border border-indigo-200">
          <p className="text-sm font-medium text-indigo-900 mb-1">Interprétation Finale:</p>
          <p className="text-sm text-slate-700">{trace.final_interpretation}</p>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {trace.interpretation_layers && trace.interpretation_layers.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Couches d'Interprétation
                  </h5>
                  <div className="space-y-2">
                    {trace.interpretation_layers.map((layer, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 bg-${getLayerColor(layer.layer)}-50 border border-${getLayerColor(layer.layer)}-200 rounded-lg`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getLayerIcon(layer.layer)}</span>
                          <Badge variant="outline" className="text-xs">
                            {layer.layer}
                          </Badge>
                          <Badge className={`text-xs bg-${getLayerColor(layer.layer)}-200 text-${getLayerColor(layer.layer)}-900`}>
                            {safeConfidence(layer.confidence)}% confiance
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-700">{layer.interpretation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {trace.causal_chain && trace.causal_chain.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    Chaîne Causale
                  </h5>
                  <div className="space-y-2">
                    {trace.causal_chain.map((link, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <div className="flex-1 p-2 bg-emerald-50 border border-emerald-200 rounded">
                          <span className="font-medium text-emerald-900">Cause:</span>
                          <p className="text-slate-700 mt-1">{link.cause}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 mt-3 flex-shrink-0" />
                        <div className="flex-1 p-2 bg-blue-50 border border-blue-200 rounded">
                          <span className="font-medium text-blue-900">Effet:</span>
                          <p className="text-slate-700 mt-1">{link.effect}</p>
                        </div>
                        <Badge variant="outline" className="text-xs mt-2">
                          {safeConfidence(link.confidence)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {trace.analogies_used && trace.analogies_used.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Analogies Utilisées
                  </h5>
                  <div className="space-y-2">
                    {trace.analogies_used.map((analogy, idx) => (
                      <div key={idx} className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-amber-900">{analogy.source_domain}</span>
                          <span className="text-amber-600">→</span>
                          <span className="font-medium text-amber-900">{analogy.target_domain}</span>
                        </div>
                        <p className="text-slate-600 italic">{analogy.mapping}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h5 className="text-sm font-semibold text-purple-900 mb-2">Justification Rationnelle:</h5>
                <p className="text-xs text-slate-700 leading-relaxed">{trace.justification}</p>
              </div>

              {trace.self_critique && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                  <h5 className="text-sm font-semibold text-rose-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Auto-Critique:
                  </h5>
                  <p className="text-xs text-slate-700 leading-relaxed">{trace.self_critique}</p>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                <span className="text-xs font-medium text-slate-700">Niveau d'Incertitude:</span>
                <Badge variant={trace.uncertainty_level > 50 ? "destructive" : "secondary"}>
                  {trace.uncertainty_level || 0}%
                </Badge>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}