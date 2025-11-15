/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Enhanced AI Conflict Resolver with User Preferences        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, GitMerge, Sparkles, Settings } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function EnhancedConflictResolver({ conflict, onResolved, documentContext }) {
  const [isResolving, setIsResolving] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const user = await base44.auth.me();
      setUserPreferences(user.conflict_resolution_preferences || {
        prefer_conciseness: true,
        prefer_clarity: true,
        auto_accept_ai: false,
        trust_level: 'medium'
      });
    } catch (error) {
      console.error("Erreur chargement préférences:", error);
    }
  };

  const getContextAwareResolution = async () => {
    setIsResolving(true);
    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Résous ce conflit d'édition collaborative avec analyse contextuelle approfondie:

CONTEXTE DU DOCUMENT:
Type: ${documentContext?.type || 'document'}
Sujet: ${documentContext?.subject || 'général'}
Collaborateurs: ${documentContext?.collaborators?.join(', ') || 'multiples'}
Historique récent: ${documentContext?.recentChanges?.slice(0, 3).join(' → ') || 'aucun'}

VOTRE VERSION:
${conflict.yours}

VERSION COLLABORATEUR:
${conflict.theirs}

VERSION DE BASE:
${conflict.base}

PRÉFÉRENCES UTILISATEUR:
- Préfère concision: ${userPreferences?.prefer_conciseness}
- Préfère clarté: ${userPreferences?.prefer_clarity}
- Niveau de confiance IA: ${userPreferences?.trust_level}

DIRECTIVES DE FUSION INTELLIGENTE:
1. Analyser l'intention de chaque modification
2. Respecter les préférences utilisateur
3. Préserver le contexte et la cohérence
4. Détecter et résoudre les contradictions sémantiques
5. Optimiser pour la clarté ET la concision
6. Maintenir le style cohérent du document

Retourne JSON:
{
  "suggested_resolution": "texte fusionné optimal",
  "reasoning": "explication détaillée de la stratégie",
  "confidence": 0-100,
  "merge_strategy": "preference_based|semantic|syntactic|hybrid",
  "detected_intentions": {
    "yours": "intention détectée",
    "theirs": "intention détectée"
  },
  "preserved_elements": {
    "from_yours": ["élément1", "élément2"],
    "from_theirs": ["élément1", "élément2"]
  },
  "improvements_made": [
    {
      "type": "clarity|conciseness|coherence|style",
      "description": "amélioration apportée"
    }
  ],
  "alternative_resolutions": [
    {
      "text": "alternative 1",
      "reasoning": "pourquoi cette alternative",
      "score": 0-100
    }
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            suggested_resolution: { type: "string" },
            reasoning: { type: "string" },
            confidence: { type: "number" },
            merge_strategy: { type: "string" },
            detected_intentions: {
              type: "object",
              properties: {
                yours: { type: "string" },
                theirs: { type: "string" }
              }
            },
            preserved_elements: {
              type: "object",
              properties: {
                from_yours: { type: "array", items: { type: "string" } },
                from_theirs: { type: "array", items: { type: "string" } }
              }
            },
            improvements_made: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  description: { type: "string" }
                }
              }
            },
            alternative_resolutions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  reasoning: { type: "string" },
                  score: { type: "number" }
                }
              }
            }
          }
        }
      });

      setAiSuggestion(analysis);

      // Auto-accept if confidence high and user trusts AI
      if (analysis.confidence > 90 && userPreferences?.auto_accept_ai) {
        await onResolved(analysis.suggested_resolution);
      }
    } catch (error) {
      console.error("Erreur résolution:", error);
    } finally {
      setIsResolving(false);
    }
  };

  const updatePreferences = async (newPrefs) => {
    try {
      await base44.auth.updateMe({
        conflict_resolution_preferences: { ...userPreferences, ...newPrefs }
      });
      setUserPreferences(prev => ({ ...prev, ...newPrefs }));
    } catch (error) {
      console.error("Erreur mise à jour préférences:", error);
    }
  };

  return (
    <div className="space-y-4">
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
            <p className="text-xs font-semibold text-green-900 mb-1">Version collaborateur</p>
            <p className="text-sm text-slate-900">{conflict.theirs}</p>
          </div>
        </div>

        {!aiSuggestion ? (
          <Button
            onClick={getContextAwareResolution}
            disabled={isResolving}
            className="w-full bg-purple-600"
          >
            {isResolving ? (
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            ) : (
              <GitMerge className="w-4 h-4 mr-2" />
            )}
            {isResolving ? "Analyse contextuelle..." : "Résolution IA Intelligente"}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-purple-900">Suggestion IA</p>
                <div className="flex gap-2">
                  <Badge className="bg-purple-600 text-white">
                    {aiSuggestion.confidence}% confiance
                  </Badge>
                  <Badge variant="outline">
                    {aiSuggestion.merge_strategy}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-slate-900 mb-2 p-2 bg-white rounded">
                {aiSuggestion.suggested_resolution}
              </p>
              
              <p className="text-xs text-slate-600 mb-3">{aiSuggestion.reasoning}</p>

              {aiSuggestion.detected_intentions && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2 bg-blue-100 rounded text-xs">
                    <strong>Votre intention:</strong> {aiSuggestion.detected_intentions.yours}
                  </div>
                  <div className="p-2 bg-green-100 rounded text-xs">
                    <strong>Leur intention:</strong> {aiSuggestion.detected_intentions.theirs}
                  </div>
                </div>
              )}

              {aiSuggestion.improvements_made?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold mb-1">Améliorations:</p>
                  {aiSuggestion.improvements_made.map((imp, i) => (
                    <Badge key={i} variant="outline" className="mr-1 mb-1 text-xs">
                      {imp.type}: {imp.description}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {aiSuggestion.alternative_resolutions?.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold mb-2">Alternatives:</p>
                {aiSuggestion.alternative_resolutions.map((alt, i) => (
                  <div key={i} className="p-2 bg-white rounded mb-2 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <Badge className="bg-slate-600 text-white">{alt.score}%</Badge>
                    </div>
                    <p className="mb-1">{alt.text}</p>
                    <p className="text-slate-600 italic">{alt.reasoning}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => onResolved(alt.text)}
                    >
                      Utiliser cette alternative
                    </Button>
                  </div>
                ))}
              </div>
            )}

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
              Accepter Suggestion IA
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-4 h-4 text-slate-600" />
          <h4 className="text-sm font-semibold">Préférences de Résolution</h4>
        </div>
        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={userPreferences?.prefer_conciseness}
              onChange={(e) => updatePreferences({ prefer_conciseness: e.target.checked })}
            />
            Préférer les versions concises
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={userPreferences?.prefer_clarity}
              onChange={(e) => updatePreferences({ prefer_clarity: e.target.checked })}
            />
            Préférer les versions claires
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={userPreferences?.auto_accept_ai}
              onChange={(e) => updatePreferences({ auto_accept_ai: e.target.checked })}
            />
            Auto-accepter suggestions IA haute confiance
          </label>
        </div>
      </Card>
    </div>
  );
}