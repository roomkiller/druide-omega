/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Enhanced AI Change Summary with Deep Analysis              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, User, Clock, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";

export default function EnhancedChangeSummary({ changes, collaborator, documentContext }) {
  const [aiSummary, setAiSummary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [detailLevel, setDetailLevel] = useState('standard'); // 'brief', 'standard', 'detailed'

  useEffect(() => {
    generateEnhancedSummary();
  }, [changes, detailLevel]);

  const generateEnhancedSummary = async () => {
    if (changes.length === 0) return;
    
    setIsGenerating(true);
    try {
      const summary = await base44.integrations.Core.InvokeLLM({
        prompt: `Génère un résumé ${detailLevel === 'brief' ? 'bref' : detailLevel === 'detailed' ? 'très détaillé' : 'standard'} des modifications:

CONTEXTE DU DOCUMENT:
${documentContext ? `Type: ${documentContext.type}, Sujet: ${documentContext.subject}` : 'Général'}

MODIFICATIONS (${changes.length}):
${changes.map((c, i) => `[${i + 1}] ${c.type}: "${c.before}" → "${c.after}"`).join('\n')}

COLLABORATEUR: ${collaborator?.name || 'Anonyme'} (Rôle: ${collaborator?.role || 'contributeur'})

ANALYSE APPROFONDIE:
1. Résumé concis mais complet
2. Catégorisation intelligente des changements
3. Analyse de l'impact sur la qualité
4. Détection de patterns d'édition
5. Évaluation de la cohérence globale
6. Recommandations d'amélioration si nécessaire

Retourne JSON:
{
  "summary": "résumé principal",
  "key_changes": [
    {
      "category": "ajout|suppression|modification|amélioration|restructuration",
      "description": "description",
      "impact": "low|medium|high",
      "quality_improvement": 0-100
    }
  ],
  "editing_patterns": [
    {
      "pattern": "pattern détecté",
      "frequency": 0-100,
      "interpretation": "signification du pattern"
    }
  ],
  "quality_analysis": {
    "clarity_delta": -100 to 100,
    "conciseness_delta": -100 to 100,
    "coherence_score": 0-100,
    "style_consistency": 0-100
  },
  "overall_impact": "very_positive|positive|neutral|needs_attention|negative",
  "collaboration_insights": {
    "editing_style": "description du style d'édition",
    "focus_areas": ["domaine1", "domaine2"],
    "complementarity": "comment ces éditions complètent le document"
  },
  "recommendations": [
    {
      "type": "follow_up|review|clarification|validation",
      "suggestion": "suggestion concrète",
      "priority": "low|medium|high"
    }
  ],
  "semantic_changes": [
    {
      "before_meaning": "sens avant",
      "after_meaning": "sens après",
      "intentional": true/false,
      "needs_verification": true/false
    }
  ]
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
                  impact: { type: "string" },
                  quality_improvement: { type: "number" }
                }
              }
            },
            editing_patterns: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  pattern: { type: "string" },
                  frequency: { type: "number" },
                  interpretation: { type: "string" }
                }
              }
            },
            quality_analysis: {
              type: "object",
              properties: {
                clarity_delta: { type: "number" },
                conciseness_delta: { type: "number" },
                coherence_score: { type: "number" },
                style_consistency: { type: "number" }
              }
            },
            overall_impact: { type: "string" },
            collaboration_insights: {
              type: "object",
              properties: {
                editing_style: { type: "string" },
                focus_areas: { type: "array", items: { type: "string" } },
                complementarity: { type: "string" }
              }
            },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  suggestion: { type: "string" },
                  priority: { type: "string" }
                }
              }
            },
            semantic_changes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  before_meaning: { type: "string" },
                  after_meaning: { type: "string" },
                  intentional: { type: "boolean" },
                  needs_verification: { type: "boolean" }
                }
              }
            }
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
    very_positive: "bg-green-100 text-green-700 border-green-300",
    positive: "bg-green-50 text-green-600 border-green-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    needs_attention: "bg-orange-100 text-orange-700 border-orange-300",
    negative: "bg-red-100 text-red-700 border-red-300"
  };

  if (isGenerating) {
    return (
      <Card className="p-4 bg-purple-50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
          <p className="text-sm text-slate-600">Analyse approfondie en cours...</p>
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
            <h4 className="font-semibold text-slate-900">Résumé Intelligent</h4>
          </div>
          <div className="flex gap-1">
            {['brief', 'standard', 'detailed'].map(level => (
              <Button
                key={level}
                size="sm"
                variant={detailLevel === level ? "default" : "outline"}
                onClick={() => setDetailLevel(level)}
                className="text-xs h-6 px-2"
              >
                {level === 'brief' ? 'Bref' : level === 'standard' ? 'Standard' : 'Détaillé'}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <User className="w-3 h-3" />
            {collaborator?.name || 'Collaborateur'}
            <Clock className="w-3 h-3 ml-2" />
            {new Date().toLocaleTimeString()}
            <Badge className={overallImpactColors[aiSummary.overall_impact]}>
              {aiSummary.overall_impact.replace('_', ' ')}
            </Badge>
          </div>

          <p className="text-sm text-slate-900 p-3 bg-white rounded border border-indigo-200">
            {aiSummary.summary}
          </p>

          {/* Quality Analysis */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-white rounded border border-indigo-100">
              <p className="text-xs font-semibold mb-1">Clarté</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${aiSummary.quality_analysis.clarity_delta >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.abs(aiSummary.quality_analysis.clarity_delta)}%` }}
                  />
                </div>
                <span className="text-xs font-bold">{aiSummary.quality_analysis.clarity_delta > 0 ? '+' : ''}{aiSummary.quality_analysis.clarity_delta}%</span>
              </div>
            </div>
            <div className="p-2 bg-white rounded border border-indigo-100">
              <p className="text-xs font-semibold mb-1">Concision</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${aiSummary.quality_analysis.conciseness_delta >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.abs(aiSummary.quality_analysis.conciseness_delta)}%` }}
                  />
                </div>
                <span className="text-xs font-bold">{aiSummary.quality_analysis.conciseness_delta > 0 ? '+' : ''}{aiSummary.quality_analysis.conciseness_delta}%</span>
              </div>
            </div>
          </div>

          {/* Key Changes */}
          <div className="space-y-2">
            {aiSummary.key_changes.map((change, i) => (
              <div key={i} className="p-2 bg-white rounded border border-indigo-100">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">{change.category}</Badge>
                  <Badge className={`text-xs ${impactColors[change.impact]}`}>
                    {change.impact}
                  </Badge>
                  {change.quality_improvement > 0 && (
                    <Badge className="bg-green-500 text-white text-xs">
                      +{change.quality_improvement}% qualité
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-700">{change.description}</p>
              </div>
            ))}
          </div>

          {/* Editing Patterns */}
          {aiSummary.editing_patterns?.length > 0 && (
            <div className="p-3 bg-purple-100 rounded border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-700" />
                <p className="text-xs font-semibold text-purple-900">Patterns d'édition</p>
              </div>
              {aiSummary.editing_patterns.map((pattern, i) => (
                <div key={i} className="text-xs text-purple-800 mb-1">
                  <strong>{pattern.pattern}</strong> ({pattern.frequency}%): {pattern.interpretation}
                </div>
              ))}
            </div>
          )}

          {/* Semantic Changes */}
          {aiSummary.semantic_changes?.some(s => s.needs_verification) && (
            <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-700" />
                <p className="text-xs font-semibold text-yellow-900">Changements sémantiques à vérifier</p>
              </div>
              {aiSummary.semantic_changes.filter(s => s.needs_verification).map((change, i) => (
                <div key={i} className="text-xs text-yellow-800 mb-2">
                  <p><strong>Avant:</strong> {change.before_meaning}</p>
                  <p><strong>Après:</strong> {change.after_meaning}</p>
                </div>
              ))}
            </div>
          )}

          {/* Collaboration Insights */}
          {detailLevel !== 'brief' && aiSummary.collaboration_insights && (
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs font-semibold text-blue-900 mb-2">Insights de collaboration</p>
              <p className="text-xs text-blue-800 mb-2">{aiSummary.collaboration_insights.editing_style}</p>
              <p className="text-xs text-blue-700">{aiSummary.collaboration_insights.complementarity}</p>
            </div>
          )}

          {/* Recommendations */}
          {aiSummary.recommendations?.length > 0 && detailLevel !== 'brief' && (
            <div className="space-y-2">
              <p className="text-xs font-semibold">Recommandations:</p>
              {aiSummary.recommendations.map((rec, i) => (
                <div key={i} className="p-2 bg-white rounded border-l-4" style={{
                  borderLeftColor: rec.priority === 'high' ? '#ef4444' : rec.priority === 'medium' ? '#f59e0b' : '#3b82f6'
                }}>
                  <Badge className="text-xs mb-1">{rec.type}</Badge>
                  <p className="text-xs text-slate-700">{rec.suggestion}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}