/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - AI Workflow Suggestions                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, TrendingUp, Loader2, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkflowSuggestions({ userActivity, onCreateFromSuggestion }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeBehavior = async () => {
    setIsAnalyzing(true);
    
    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse les habitudes utilisateur pour suggérer des workflows automatisés:

Activité récente:
- ${userActivity?.conversations || 0} conversations
- ${userActivity?.memories || 0} mémoires créées
- ${userActivity?.knowledge || 0} bases de connaissances
- Actions fréquentes: ${userActivity?.frequent_actions?.join(', ') || 'N/A'}
- Heures d'activité: ${userActivity?.active_hours?.join(', ') || 'N/A'}

TÂCHE: Génère 3-5 suggestions de workflows pertinents qui pourraient automatiser des tâches répétitives ou optimiser le travail.

Pour chaque suggestion:
{
  "name": "Nom du workflow",
  "description": "Description détaillée",
  "trigger": "Type de déclencheur",
  "actions": ["action1", "action2"],
  "value": "Valeur ajoutée",
  "frequency_estimate": "daily/weekly/monthly",
  "time_saved_min": 5-60
}`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  trigger: { type: "string" },
                  actions: { type: "array", items: { type: "string" } },
                  value: { type: "string" },
                  frequency_estimate: { type: "string" },
                  time_saved_min: { type: "number" }
                }
              }
            },
            insights: { type: "string" }
          }
        }
      });

      setSuggestions(analysis.suggestions || []);
    } catch (error) {
      console.error("Erreur analyse:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Suggestions IA</h3>
            <p className="text-xs text-slate-600">Workflows basés sur vos habitudes</p>
          </div>
        </div>

        <Button
          onClick={analyzeBehavior}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          {isAnalyzing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyser
            </>
          )}
        </Button>
      </div>

      {suggestions.length > 0 ? (
        <div className="space-y-3">
          {suggestions.map((suggestion, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-4 bg-white/80 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">{suggestion.name}</h4>
                    <p className="text-sm text-slate-700 mb-2">{suggestion.description}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onCreateFromSuggestion(suggestion)}
                    className="ml-3"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Créer
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    🎯 {suggestion.trigger}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ⚡ {suggestion.actions.length} action(s)
                  </Badge>
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    ⏱️ ~{suggestion.time_saved_min}min économisées
                  </Badge>
                </div>

                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{suggestion.value}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">
          <Brain className="w-12 h-12 mx-auto mb-3 text-purple-300" />
          <p className="text-sm">Cliquez sur "Analyser" pour recevoir des suggestions</p>
        </div>
      )}
    </Card>
  );
}