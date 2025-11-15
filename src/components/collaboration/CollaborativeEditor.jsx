/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - AI-Assisted Collaborative Editor                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Users, Save, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AIEditingSuggestions from "./AIEditingSuggestions";

export default function CollaborativeEditor({ 
  documentId, 
  initialContent = "", 
  onSave,
  collaborators = [] 
}) {
  const [content, setContent] = useState(initialContent);
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    // Auto-analyze on content change
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    debounceTimer.current = setTimeout(() => {
      if (content.length > 50) {
        analyzContent();
      }
    }, 2000);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [content]);

  const analyzContent = async () => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse ce texte et suggère des améliorations pour la clarté et la concision:

TEXTE:
${content}

Génère jusqu'à 5 suggestions concrètes et actionnables.

Retourne JSON:
{
  "suggestions": [
    {
      "type": "clarity|conciseness|grammar|style",
      "severity": "low|medium|high",
      "original": "texte original",
      "suggested": "amélioration suggérée",
      "reason": "explication courte",
      "position": {
        "start": 0,
        "end": 10
      }
    }
  ],
  "overall_score": {
    "clarity": 0-10,
    "conciseness": 0-10,
    "readability": 0-10
  }
}`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  severity: { type: "string" },
                  original: { type: "string" },
                  suggested: { type: "string" },
                  reason: { type: "string" },
                  position: {
                    type: "object",
                    properties: {
                      start: { type: "number" },
                      end: { type: "number" }
                    }
                  }
                }
              }
            },
            overall_score: {
              type: "object",
              properties: {
                clarity: { type: "number" },
                conciseness: { type: "number" },
                readability: { type: "number" }
              }
            }
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

  const applySuggestion = (suggestion) => {
    const newContent = content.replace(suggestion.original, suggestion.suggested);
    setContent(newContent);
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(content);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">Éditeur</h3>
              {collaborators.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {collaborators.length} collaborateur(s)
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="text-xs text-slate-500">
                  Sauvegardé {new Date(lastSaved).toLocaleTimeString()}
                </span>
              )}
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-purple-600"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                Sauvegarder
              </Button>
            </div>
          </div>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="font-mono text-sm"
            placeholder="Commencez à écrire..."
          />

          {isAnalyzing && (
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Analyse IA en cours...
            </div>
          )}
        </Card>
      </div>

      <div>
        <AIEditingSuggestions
          suggestions={suggestions}
          onApply={applySuggestion}
          onDismiss={(s) => setSuggestions(prev => prev.filter(sg => sg !== s))}
        />
      </div>
    </div>
  );
}