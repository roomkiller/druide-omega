/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Knowledge Fusion Analyzer                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Database, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FusionAnalyzer({ onFusionComplete }) {
  const [selectedKBs, setSelectedKBs] = useState([]);
  const [fusionTitle, setFusionTitle] = useState("");
  const [fusionType, setFusionType] = useState("synthesis");
  const [isFusing, setIsFusing] = useState(false);
  const [progress, setProgress] = useState(null);

  const queryClient = useQueryClient();

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list({ status: 'ready' }),
  });

  const createFusionMutation = useMutation({
    mutationFn: (data) => base44.entities.KnowledgeFusion.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeFusions'] });
    },
  });

  const handleKBToggle = (kbId) => {
    setSelectedKBs(prev =>
      prev.includes(kbId) ? prev.filter(id => id !== kbId) : [...prev, kbId]
    );
  };

  const handleFusion = async () => {
    if (selectedKBs.length < 2) {
      alert("Sélectionnez au moins 2 sources de connaissances");
      return;
    }

    setIsFusing(true);
    setProgress({ step: 1, message: "Chargement des sources..." });

    try {
      // Get selected knowledge bases
      const selectedSources = knowledgeBases.filter(kb => selectedKBs.includes(kb.id));

      setProgress({ step: 2, message: "Analyse comparative..." });

      // Build fusion prompt
      const fusionPrompt = `Tu es un expert en fusion de connaissances et analyse comparative.

TYPE DE FUSION: ${fusionType}

SOURCES À FUSIONNER (${selectedSources.length}):
${selectedSources.map((kb, idx) => `
${idx + 1}. ${kb.title}
   Type: ${kb.source_type}
   Tags: ${kb.tags?.join(', ') || 'none'}
   Contenu: ${kb.content?.slice(0, 2000)}...
   Résumé: ${kb.summary || 'N/A'}
`).join('\n')}

Effectue une fusion avancée et retourne un JSON structuré:

{
  "synthesis": {
    "main_themes": ["thème 1", "thème 2", ...],
    "key_insights": ["insight 1", "insight 2", ...],
    "unified_narrative": "narrative unifiée de toutes les sources",
    "confidence_level": 0-100
  },
  "comparative_analysis": {
    "agreements": [
      {
        "topic": "sujet d'accord",
        "consensus": "consensus identifié",
        "supporting_sources": ["source 1", "source 2"]
      }
    ],
    "disagreements": [
      {
        "topic": "sujet de désaccord",
        "perspectives": [
          {"source": "source 1", "position": "position"}
        ],
        "resolution": "résolution ou synthèse"
      }
    ],
    "unique_contributions": [
      {
        "source": "nom source",
        "contribution": "contribution unique",
        "significance": "importance"
      }
    ]
  },
  "knowledge_graph": {
    "nodes": [
      {
        "id": "node_1",
        "label": "concept ou entité",
        "type": "concept|entity|theme|fact|question",
        "importance": 1-10,
        "source_ids": ["kb_id_1", "kb_id_2"],
        "metadata": {}
      }
    ],
    "edges": [
      {
        "source": "node_id",
        "target": "node_id",
        "relationship": "related_to|causes|contradicts|supports|part_of|derives_from|influences",
        "strength": 1-10,
        "evidence": "preuve de la relation"
      }
    ],
    "clusters": [
      {
        "id": "cluster_1",
        "theme": "thème du cluster",
        "node_ids": ["node_1", "node_2"]
      }
    ]
  },
  "emergent_insights": [
    {
      "insight": "insight émergent de la fusion",
      "novelty_score": 1-10,
      "supporting_evidence": ["preuve 1", "preuve 2"],
      "implications": "implications pratiques"
    }
  ],
  "knowledge_gaps": [
    {
      "gap": "lacune identifiée",
      "severity": "minor|moderate|significant|critical",
      "suggested_research": "piste de recherche"
    }
  ],
  "cross_references": [
    {
      "topic": "sujet",
      "sources": ["source 1", "source 2"],
      "connection_type": "type de connexion",
      "details": "détails"
    }
  ],
  "fusion_quality": {
    "coverage": 0-100,
    "coherence": 0-100,
    "novelty": 0-100,
    "reliability": 0-100
  },
  "interactive_queries": [
    "question suggérée pour exploration"
  ]
}`;

      setProgress({ step: 3, message: "Génération des insights..." });

      const fusionResult = await base44.integrations.Core.InvokeLLM({
        prompt: fusionPrompt,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            synthesis: { type: "object" },
            comparative_analysis: { type: "object" },
            knowledge_graph: { type: "object" },
            emergent_insights: { type: "array" },
            knowledge_gaps: { type: "array" },
            cross_references: { type: "array" },
            fusion_quality: { type: "object" },
            interactive_queries: { type: "array", items: { type: "string" } }
          }
        }
      });

      setProgress({ step: 4, message: "Création de la fusion..." });

      const fusion = await createFusionMutation.mutateAsync({
        fusion_title: fusionTitle || `Fusion: ${selectedSources.map(s => s.title).join(' + ')}`,
        source_kb_ids: selectedKBs,
        fusion_type: fusionType,
        ...fusionResult,
        last_updated: new Date().toISOString(),
        auto_refresh: false
      });

      setProgress({ step: 5, message: "Terminé !" });

      if (onFusionComplete) {
        onFusionComplete(fusion);
      }

      // Reset form
      setTimeout(() => {
        setSelectedKBs([]);
        setFusionTitle("");
        setProgress(null);
      }, 1500);

    } catch (error) {
      console.error("Erreur fusion:", error);
      alert("Erreur lors de la fusion des connaissances");
      setProgress(null);
    } finally {
      setIsFusing(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analyseur de Fusion</h2>
          <p className="text-sm text-slate-600">Fusionnez plusieurs sources pour des insights émergents</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Fusion Settings */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Titre de la fusion</Label>
            <Input
              placeholder="Ex: Analyse comparative de l'IA consciente"
              value={fusionTitle}
              onChange={(e) => setFusionTitle(e.target.value)}
              disabled={isFusing}
            />
          </div>

          <div className="space-y-2">
            <Label>Type de fusion</Label>
            <Select value={fusionType} onValueChange={setFusionType} disabled={isFusing}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="synthesis">Synthèse Unifiée</SelectItem>
                <SelectItem value="comparative">Analyse Comparative</SelectItem>
                <SelectItem value="thematic">Organisation Thématique</SelectItem>
                <SelectItem value="chronological">Chronologique</SelectItem>
                <SelectItem value="causal">Relations Causales</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Knowledge Base Selection */}
        <div>
          <Label className="mb-3 block">Sélectionner les sources ({selectedKBs.length}/{knowledgeBases.length})</Label>
          
          {knowledgeBases.length === 0 ? (
            <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-center">
              <Database className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 mb-2">Aucune source de connaissances disponible</p>
              <p className="text-sm text-slate-500">Uploadez d'abord des documents dans la page Connaissances</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
              {knowledgeBases.map((kb) => (
                <motion.div
                  key={kb.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedKBs.includes(kb.id)
                      ? 'bg-indigo-100 border-indigo-500'
                      : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}
                  onClick={() => handleKBToggle(kb.id)}
                >
                  <div className="flex items-start gap-2">
                    <Checkbox
                      checked={selectedKBs.includes(kb.id)}
                      onCheckedChange={() => handleKBToggle(kb.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 truncate">{kb.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {kb.source_type} • {kb.tags?.length || 0} tags
                      </p>
                      {kb.summary && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{kb.summary}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <AnimatePresence>
          {progress && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-white border border-indigo-200 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                {progress.step === 5 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{progress.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(progress.step / 5) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-xs text-slate-600">{progress.step}/5</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-indigo-200">
          <div className="flex items-center gap-2">
            {selectedKBs.length >= 2 && (
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Prêt pour la fusion
              </Badge>
            )}
            {selectedKBs.length === 1 && (
              <Badge className="bg-orange-100 text-orange-700">
                <AlertCircle className="w-3 h-3 mr-1" />
                Sélectionnez au moins 1 source de plus
              </Badge>
            )}
          </div>

          <Button
            onClick={handleFusion}
            disabled={selectedKBs.length < 2 || isFusing}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
          >
            {isFusing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Fusion en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Lancer la fusion ({selectedKBs.length})
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCEAU DE PROPRIÉTÉ INTELLECTUELLE
 * © 2025 AMG+A.L - PROPRIÉTAIRE
 * Innovation: Knowledge Fusion Analyzer
 * Référence: AMG-AL-DO-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */