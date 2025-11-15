/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Automatic Duplicate Detector & Smart Merger               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Merge, AlertTriangle, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DuplicateDetector({ knowledgeBases, onDetectionComplete }) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(true);

  useEffect(() => {
    if (autoDetectEnabled && knowledgeBases.length >= 2) {
      detectDuplicates();
    }
  }, [knowledgeBases.length]);

  const detectDuplicates = async () => {
    if (isDetecting) return;
    
    setIsDetecting(true);
    try {
      const activeKBs = knowledgeBases.filter(kb => kb.status === 'ready' && kb.active);
      
      if (activeKBs.length < 2) {
        setDuplicates([]);
        return;
      }

      const kbData = activeKBs.map(kb => ({
        id: kb.id,
        title: kb.title,
        summary: kb.summary,
        content_hash: kb.content?.substring(0, 500),
        tags: kb.tags || [],
        source_url: kb.source_url
      }));

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse ces sources de connaissances et détecte les doublons potentiels avec un algorithme de similarité avancé.

SOURCES:
${JSON.stringify(kbData, null, 2)}

CRITÈRES DE DÉTECTION:
1. Similarité sémantique du contenu (>80%)
2. Titres identiques ou très similaires
3. Même source URL
4. Tags fortement chevauchants
5. Contenu redondant

Pour chaque doublon détecté, fournis:
- Score de similarité (0-100)
- Type de doublon (exact|partial|semantic)
- Recommandation de fusion
- Conflits potentiels

Retourne JSON:
{
  "duplicates": [
    {
      "group_id": "unique_id",
      "kb_ids": ["id1", "id2"],
      "similarity_score": 0-100,
      "duplicate_type": "exact|partial|semantic",
      "reasons": ["raison1", "raison2"],
      "merge_recommendation": "immediate|review|keep_separate",
      "potential_conflicts": [
        {
          "field": "title|content|tags",
          "description": "description du conflit",
          "severity": "low|medium|high"
        }
      ],
      "merged_suggestion": {
        "title": "titre suggéré",
        "summary": "résumé fusionné",
        "tags": ["tag1", "tag2"],
        "keep_primary": "id_primaire"
      }
    }
  ],
  "total_duplicates": 0,
  "scan_quality": 0-100
}`,
        response_json_schema: {
          type: "object",
          properties: {
            duplicates: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  group_id: { type: "string" },
                  kb_ids: { type: "array", items: { type: "string" } },
                  similarity_score: { type: "number" },
                  duplicate_type: { type: "string" },
                  reasons: { type: "array", items: { type: "string" } },
                  merge_recommendation: { type: "string" },
                  potential_conflicts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        field: { type: "string" },
                        description: { type: "string" },
                        severity: { type: "string" }
                      }
                    }
                  },
                  merged_suggestion: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      summary: { type: "string" },
                      tags: { type: "array", items: { type: "string" } },
                      keep_primary: { type: "string" }
                    }
                  }
                }
              }
            },
            total_duplicates: { type: "number" },
            scan_quality: { type: "number" }
          }
        }
      });

      const duplicatesWithData = result.duplicates.map(dup => ({
        ...dup,
        sources: activeKBs.filter(kb => dup.kb_ids.includes(kb.id))
      }));

      setDuplicates(duplicatesWithData);
      onDetectionComplete?.(duplicatesWithData);
    } catch (error) {
      console.error("Erreur détection doublons:", error);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSmartMerge = async (duplicate) => {
    try {
      const primary = duplicate.sources.find(s => s.id === duplicate.merged_suggestion.keep_primary);
      const others = duplicate.sources.filter(s => s.id !== duplicate.merged_suggestion.keep_primary);

      // Create merged version
      await base44.entities.KnowledgeBase.create({
        title: duplicate.merged_suggestion.title,
        summary: duplicate.merged_suggestion.summary,
        tags: duplicate.merged_suggestion.tags,
        content: [primary.content, ...others.map(o => o.content)].join("\n\n---MERGED---\n\n"),
        source_type: "merged_duplicate",
        active: true,
        status: "ready",
        merged_from: duplicate.kb_ids,
        duplicate_detection_metadata: {
          similarity_score: duplicate.similarity_score,
          merge_date: new Date().toISOString(),
          conflicts_resolved: duplicate.potential_conflicts
        }
      });

      // Deactivate duplicates
      for (const kb of duplicate.sources) {
        await base44.entities.KnowledgeBase.update(kb.id, {
          active: false,
          duplicate_merged: true
        });
      }

      // Refresh
      setDuplicates(prev => prev.filter(d => d.group_id !== duplicate.group_id));
      onDetectionComplete?.();
    } catch (error) {
      console.error("Erreur fusion:", error);
    }
  };

  if (duplicates.length === 0 && !isDetecting) {
    return (
      <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium text-green-900">Aucun doublon détecté</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-orange-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Copy className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-bold text-slate-900">Doublons Détectés</h3>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {duplicates.length}
          </Badge>
        </div>
        <Button
          size="sm"
          onClick={detectDuplicates}
          disabled={isDetecting}
          variant="outline"
        >
          {isDetecting ? <Sparkles className="w-4 h-4 animate-pulse" /> : "Re-scanner"}
        </Button>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-3">
          {duplicates.map((dup, idx) => (
            <motion.div
              key={dup.group_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-4 border-orange-200 bg-orange-50/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-orange-500 text-white">
                        {dup.similarity_score}% similaire
                      </Badge>
                      <Badge variant="outline">{dup.duplicate_type}</Badge>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mb-2">
                      {dup.merged_suggestion.title}
                    </p>
                    <div className="space-y-1 mb-2">
                      {dup.sources.map(source => (
                        <p key={source.id} className="text-xs text-slate-600">
                          • {source.title}
                        </p>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 mb-2">
                      {dup.reasons.map((reason, i) => (
                        <p key={i}>✓ {reason}</p>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSmartMerge(dup)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Merge className="w-3 h-3 mr-1" />
                    Fusionner
                  </Button>
                </div>

                {dup.potential_conflicts?.length > 0 && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                      <p className="text-xs font-semibold text-red-900">Conflits à résoudre:</p>
                    </div>
                    {dup.potential_conflicts.map((conflict, i) => (
                      <p key={i} className="text-xs text-red-700">
                        • {conflict.field}: {conflict.description} ({conflict.severity})
                      </p>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}