/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - AI-Driven Collaborative Conflict Resolver                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, GitMerge, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ConflictResolver({ conflict, onResolved }) {
  const [isResolving, setIsResolving] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const getAISuggestion = async () => {
    setIsResolving(true);
    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse ce conflit d'édition collaborative et suggère la meilleure résolution:

VOTRE VERSION:
${conflict.yours}

VERSION AUTRE COLLABORATEUR:
${conflict.theirs}

VERSION DE BASE:
${conflict.base}

Objectifs:
1. Préserver les améliorations des deux versions
2. Maintenir la cohérence du texte
3. Éviter les redondances
4. Assurer la clarté maximale

Retourne JSON:
{
  "suggested_resolution": "texte fusionné optimal",
  "reasoning": "explication de la stratégie de fusion",
  "conflicts_resolved": ["conflit1", "conflit2"],
  "improvements_preserved": {
    "from_yours": ["amélioration1"],
    "from_theirs": ["amélioration1"]
  },
  "confidence": 0-100
}`,
        response_json_schema: {
          type: "object",
          properties: {
            suggested_resolution: { type: "string" },
            reasoning: { type: "string" },
            conflicts_resolved: { type: "array", items: { type: "string" } },
            improvements_preserved: {
              type: "object",
              properties: {
                from_yours: { type: "array", items: { type: "string" } },
                from_theirs: { type: "array", items: { type: "string" } }
              }
            },
            confidence: { type: "number" }
          }
        }
      });

      setAiSuggestion(analysis);
    } catch (error) {
      console.error("Erreur résolution IA:", error);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-300">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-bold text-slate-900">Conflit d'Édition</h3>
      </div>

      <div className="space-y-3 mb-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs font-semibold text-blue-900 mb-1">Votre version</p>
          <p className="text-sm text-slate-900">{conflict.yours}</p>
        </div>

        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-xs font-semibold text-green-900 mb-1">Autre collaborateur</p>
          <p className="text-sm text-slate-900">{conflict.theirs}</p>
        </div>
      </div>

      {!aiSuggestion ? (
        <Button
          onClick={getAISuggestion}
          disabled={isResolving}
          className="w-full bg-purple-600"
        >
          {isResolving ? (
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
          ) : (
            <GitMerge className="w-4 h-4 mr-2" />
          )}
          {isResolving ? "Analyse IA..." : "Résolution IA"}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-purple-900">Suggestion IA</p>
              <Badge className="bg-purple-600 text-white">
                Confiance: {aiSuggestion.confidence}%
              </Badge>
            </div>
            <p className="text-sm text-slate-900 mb-2">{aiSuggestion.suggested_resolution}</p>
            <p className="text-xs text-slate-600 italic">{aiSuggestion.reasoning}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => onResolved(conflict.yours)}
            >
              Garder la mienne
            </Button>
            <Button
              variant="outline"
              onClick={() => onResolved(conflict.theirs)}
            >
              Garder l'autre
            </Button>
          </div>
          <Button
            onClick={() => onResolved(aiSuggestion.suggested_resolution)}
            className="w-full bg-purple-600"
          >
            <GitMerge className="w-4 h-4 mr-2" />
            Utiliser Suggestion IA
          </Button>
        </div>
      )}
    </Card>
  );
}