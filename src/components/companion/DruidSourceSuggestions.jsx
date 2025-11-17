/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Druid Source Suggestions Engine                            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { Sparkles, Download, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedDataImporter } from "../knowledge/EnhancedDataImporter";

export default function DruidSourceSuggestions({ recentMessages = [], currentTask = null }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState({});
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    if (recentMessages.length > 0) {
      analyzeSuggestions();
    }
  }, [recentMessages, currentTask]);

  const analyzeSuggestions = async () => {
    setLoading(true);
    try {
      const context = recentMessages.slice(-5).map(m => m.content).join("\n");
      
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es le Druide Omega. Analyse cette conversation et suggère des sources de données externes pertinentes à importer.

Conversation récente:
${context}

Tâche actuelle: ${currentTask || 'Aucune'}

Sources disponibles: Wikipedia, arXiv, PubMed, OpenStreetMap, Project Gutenberg, DBpedia

IMPORTANT: Suggère UNIQUEMENT des sources TRÈS pertinentes pour enrichir les connaissances actuelles.

Retourne JSON avec max 3 suggestions:
{
  "suggestions": [
    {
      "source": "wikipedia|arxiv|pubmed|openstreetmap|gutenberg|dbpedia",
      "query": "terme de recherche précis",
      "reason": "pourquoi cette source est pertinente (max 50 car)",
      "relevance": 1-10
    }
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  source: { type: "string" },
                  query: { type: "string" },
                  reason: { type: "string" },
                  relevance: { type: "number" }
                }
              }
            }
          }
        }
      });

      const filtered = (analysis.suggestions || [])
        .filter(s => s.relevance >= 7)
        .slice(0, 3);
      
      setSuggestions(filtered);
    } catch (error) {
      console.error("Suggestion analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (suggestion) => {
    const key = `${suggestion.source}-${suggestion.query}`;
    setImporting(prev => ({ ...prev, [key]: true }));

    try {
      await EnhancedDataImporter.importAndSave(
        suggestion.source,
        suggestion.query,
        ['druid-suggested']
      );
      
      // Remove from suggestions
      setSuggestions(prev => prev.filter(s => 
        s.source !== suggestion.source || s.query !== suggestion.query
      ));
    } catch (error) {
      console.error("Import error:", error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setImporting(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleDismiss = (suggestion) => {
    const key = `${suggestion.source}-${suggestion.query}`;
    setDismissed(prev => new Set(prev).add(key));
    setSuggestions(prev => prev.filter(s => 
      s.source !== suggestion.source || s.query !== suggestion.query
    ));
  };

  const visibleSuggestions = suggestions.filter(s => 
    !dismissed.has(`${s.source}-${s.query}`)
  );

  if (loading) {
    return (
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          <span className="text-sm text-slate-700">Le Druide analyse les sources pertinentes...</span>
        </div>
      </Card>
    );
  }

  if (visibleSuggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-slate-900">Suggestions du Druide</h3>
            <Badge className="bg-purple-600 text-white text-xs">
              {visibleSuggestions.length}
            </Badge>
          </div>

          <div className="space-y-2">
            {visibleSuggestions.map((suggestion, index) => {
              const key = `${suggestion.source}-${suggestion.query}`;
              const isImporting = importing[key];

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-3 border border-purple-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {suggestion.source}
                        </Badge>
                        <span className="font-medium text-slate-900 text-sm">
                          {suggestion.query}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {suggestion.reason}
                      </p>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleImport(suggestion)}
                        disabled={isImporting}
                        className="bg-purple-600 hover:bg-purple-700 h-8"
                      >
                        {isImporting ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Download className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDismiss(suggestion)}
                        className="h-8"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}