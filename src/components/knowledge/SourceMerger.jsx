/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Knowledge Source Merger & Conflict Detection               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitMerge, AlertTriangle, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SourceMerger({ knowledgeBases, onMergeComplete }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [similarGroups, setSimilarGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [conflicts, setConflicts] = useState([]);

  const analyzeSimilarSources = async () => {
    setIsAnalyzing(true);
    try {
      const sources = knowledgeBases.filter(kb => kb.status === 'ready' && kb.active);
      
      if (sources.length < 2) {
        alert("Au moins 2 sources actives sont nécessaires pour l'analyse");
        return;
      }

      const sourcesInfo = sources.map(kb => ({
        id: kb.id,
        title: kb.title,
        summary: kb.summary,
        tags: kb.tags || [],
        source_type: kb.source_type
      }));

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse ces sources de connaissances et identifie les groupes de sources similaires qui pourraient être fusionnées:

${JSON.stringify(sourcesInfo, null, 2)}

Critères de similarité:
1. Même sujet ou thème principal
2. Tags communs
3. Contenu redondant
4. Complémentarité des informations

Retourne JSON:
{
  "similar_groups": [
    {
      "source_ids": ["id1", "id2"],
      "similarity_score": 0-100,
      "reason": "explication de la similarité",
      "recommended_action": "merge|keep_separate",
      "potential_conflicts": ["description du conflit"],
      "merged_title_suggestion": "titre suggéré si fusion"
    }
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            similar_groups: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  source_ids: { type: "array", items: { type: "string" } },
                  similarity_score: { type: "number" },
                  reason: { type: "string" },
                  recommended_action: { type: "string" },
                  potential_conflicts: { type: "array", items: { type: "string" } },
                  merged_title_suggestion: { type: "string" }
                }
              }
            }
          }
        }
      });

      const groupsWithData = analysis.similar_groups.map(group => ({
        ...group,
        sources: sources.filter(kb => group.source_ids.includes(kb.id))
      }));

      setSimilarGroups(groupsWithData);
    } catch (error) {
      console.error("Erreur analyse similarité:", error);
      alert("Erreur lors de l'analyse des sources");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMergeSources = async (group) => {
    setIsMerging(true);
    try {
      const sourcesToMerge = group.sources;
      
      // Detect conflicts
      const detectedConflicts = [];
      
      // Check for conflicting tags
      const allTags = sourcesToMerge.flatMap(s => s.tags || []);
      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});
      
      // Check for title conflicts
      const titles = sourcesToMerge.map(s => s.title);
      if (new Set(titles).size > 1) {
        detectedConflicts.push({
          type: "title",
          description: "Titres différents",
          values: titles,
          resolution: "use_suggested"
        });
      }

      // Check for content conflicts
      const summaries = sourcesToMerge.map(s => s.summary).filter(Boolean);
      if (summaries.length > 1) {
        const conflictAnalysis = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyse ces résumés et identifie les conflits d'information:

${summaries.map((s, i) => `Source ${i + 1}: ${s}`).join('\n\n')}

Retourne les conflits détectés en JSON:
{
  "conflicts": [
    {
      "type": "information_conflict",
      "description": "description du conflit",
      "source_positions": [numéros des sources en conflit],
      "resolution_suggestion": "suggestion de résolution"
    }
  ],
  "merged_summary": "résumé fusionné et cohérent"
}`,
          response_json_schema: {
            type: "object",
            properties: {
              conflicts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    description: { type: "string" },
                    source_positions: { type: "array", items: { type: "number" } },
                    resolution_suggestion: { type: "string" }
                  }
                }
              },
              merged_summary: { type: "string" }
            }
          }
        });

        if (conflictAnalysis.conflicts.length > 0) {
          detectedConflicts.push(...conflictAnalysis.conflicts);
        }

        // Create merged source
        const mergedKB = await base44.entities.KnowledgeBase.create({
          title: group.merged_title_suggestion || sourcesToMerge[0].title,
          summary: conflictAnalysis.merged_summary,
          source_type: "merged",
          tags: [...new Set(allTags)],
          active: true,
          status: "ready",
          merged_from: sourcesToMerge.map(s => s.id),
          merge_conflicts: detectedConflicts,
          content: sourcesToMerge.map(s => s.content).join("\n\n---\n\n")
        });

        // Deactivate original sources
        for (const source of sourcesToMerge) {
          await base44.entities.KnowledgeBase.update(source.id, {
            active: false,
            merged_into: mergedKB.id
          });
        }

        setConflicts(detectedConflicts);
        onMergeComplete?.();
      }
    } catch (error) {
      console.error("Erreur fusion:", error);
      alert("Erreur lors de la fusion des sources");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-purple-200 text-purple-600 hover:bg-purple-50"
        >
          <GitMerge className="w-4 h-4 mr-2" />
          Fusionner Sources
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Fusion de Sources Similaires</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {similarGroups.length === 0 ? (
            <Card className="p-6 text-center">
              <GitMerge className="w-12 h-12 text-purple-300 mx-auto mb-3" />
              <p className="text-slate-600 mb-4">
                Analysez vos sources pour identifier les documents similaires
              </p>
              <Button
                onClick={analyzeSimilarSources}
                disabled={isAnalyzing || knowledgeBases.length < 2}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyser les Sources
                  </>
                )}
              </Button>
            </Card>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {similarGroups.map((group, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-purple-500 text-white">
                              Similarité: {group.similarity_score}%
                            </Badge>
                            {group.potential_conflicts?.length > 0 && (
                              <Badge variant="outline" className="text-orange-600 border-orange-300">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {group.potential_conflicts.length} conflits
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-slate-900 mb-1">
                            {group.merged_title_suggestion}
                          </p>
                          <p className="text-xs text-slate-600 mb-2">{group.reason}</p>
                          
                          <div className="space-y-1">
                            {group.sources.map(source => (
                              <div key={source.id} className="text-xs text-slate-500">
                                • {source.title}
                              </div>
                            ))}
                          </div>
                        </div>

                        {group.recommended_action === "merge" && (
                          <Button
                            size="sm"
                            onClick={() => handleMergeSources(group)}
                            disabled={isMerging}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {isMerging ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <GitMerge className="w-3 h-3 mr-1" />
                            )}
                            Fusionner
                          </Button>
                        )}
                      </div>

                      {group.potential_conflicts?.length > 0 && (
                        <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded">
                          <p className="text-xs font-semibold text-orange-900 mb-1">
                            Conflits potentiels:
                          </p>
                          {group.potential_conflicts.map((conflict, i) => (
                            <p key={i} className="text-xs text-orange-700">• {conflict}</p>
                          ))}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}