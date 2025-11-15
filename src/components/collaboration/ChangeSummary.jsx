/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - AI-Generated Change Summary                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, User, Clock, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";

export default function ChangeSummary({ changes, collaborator }) {
  const [aiSummary, setAiSummary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateSummary();
  }, [changes]);

  const generateSummary = async () => {
    if (changes.length === 0) return;
    
    setIsGenerating(true);
    try {
      const summary = await base44.integrations.Core.InvokeLLM({
        prompt: `Génère un résumé concis des modifications apportées par un collaborateur:

MODIFICATIONS:
${changes.map((c, i) => `[${i + 1}] ${c.type}: "${c.before}" → "${c.after}"`).join('\n')}

COLLABORATEUR: ${collaborator?.name || 'Anonyme'}

Génère un résumé clair et structuré des changements.

Retourne JSON:
{
  "summary": "résumé principal concis",
  "key_changes": [
    {
      "category": "ajout|suppression|modification|amélioration",
      "description": "description courte",
      "impact": "low|medium|high"
    }
  ],
  "overall_impact": "positif|neutre|attention_requise",
  "suggestions": ["suggestion si pertinent"]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_changes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  description: { type: "string" },
                  impact: { type: "string" }
                }
              }
            },
            overall_impact: { type: "string" },
            suggestions: { type: "array", items: { type: "string" } }
          }
        }
      });

      setAiSummary(summary);
    } catch (error) {
      console.error("Erreur génération résumé:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const impactColors = {
    low: "bg-blue-100 text-blue-700",
    medium: "bg-orange-100 text-orange-700",
    high: "bg-red-100 text-red-700"
  };

  const overallImpactColors = {
    positif: "bg-green-100 text-green-700",
    neutre: "bg-slate-100 text-slate-700",
    attention_requise: "bg-orange-100 text-orange-700"
  };

  if (isGenerating) {
    return (
      <Card className="p-4 bg-purple-50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
          <p className="text-sm text-slate-600">Génération du résumé IA...</p>
        </div>
      </Card>
    );
  }

  if (!aiSummary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h4 className="font-semibold text-slate-900">Résumé des Changements</h4>
          </div>
          <Badge className={overallImpactColors[aiSummary.overall_impact]}>
            {aiSummary.overall_impact}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <User className="w-3 h-3" />
            {collaborator?.name || 'Collaborateur'}
            <Clock className="w-3 h-3 ml-2" />
            {new Date().toLocaleTimeString()}
          </div>

          <p className="text-sm text-slate-900">{aiSummary.summary}</p>

          <div className="space-y-2">
            {aiSummary.key_changes.map((change, i) => (
              <div key={i} className="p-2 bg-white rounded border border-indigo-100">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">{change.category}</Badge>
                  <Badge className={`text-xs ${impactColors[change.impact]}`}>
                    {change.impact}
                  </Badge>
                </div>
                <p className="text-xs text-slate-700">{change.description}</p>
              </div>
            ))}
          </div>

          {aiSummary.suggestions?.length > 0 && (
            <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-xs font-semibold text-yellow-900 mb-1">Suggestions:</p>
              {aiSummary.suggestions.map((s, i) => (
                <p key={i} className="text-xs text-yellow-700">• {s}</p>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}