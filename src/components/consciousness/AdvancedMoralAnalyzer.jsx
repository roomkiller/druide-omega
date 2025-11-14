
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Advanced Moral & Ethical Analyzer (With Persistence)       ║
 * ║ Deep philosophical and ethical analysis using pre-trained models           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Scale, Heart, Eye, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";

const PHILOSOPHICAL_FRAMEWORKS = [
  { id: "kant", name: "Kant (Déontologie)", icon: Scale, color: "from-blue-500 to-indigo-600" },
  { id: "mill", name: "Mill (Utilitarisme)", icon: Brain, color: "from-green-500 to-emerald-600" },
  { id: "aristotle", name: "Aristote (Vertus)", icon: Heart, color: "from-purple-500 to-pink-600" },
  { id: "rawls", name: "Rawls (Justice)", icon: Scale, color: "from-amber-500 to-orange-600" },
  { id: "care", name: "Éthique du Care", icon: Heart, color: "from-rose-500 to-red-600" }
];

export default function AdvancedMoralAnalyzer({ 
  context, 
  onAnalysisComplete,
  autoAnalyze = true,
  conversationId = null
}) {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (context && context.length > 10 && autoAnalyze) {
      performMoralAnalysis();
    }
  }, [context, autoAnalyze]);

  const performMoralAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const moralAnalysisPrompt = `Tu es un expert en philosophie morale et éthique, formé sur les œuvres de Kant, Mill, Aristote, Rawls, Gilligan et autres.

CONTEXTE: "${context}"

ANALYSE MULTI-CADRES:

**KANT (DÉONTOLOGIE):**
- Respecte l'impératif catégorique?
- Universalisable?
- Traite les personnes comme fins en soi?
Score: 0-100

**MILL (UTILITARISME):**
- Bonheur/souffrance net produit?
- Nombre de personnes affectées?
- Conséquences court/long terme?
Score: 0-100

**ARISTOTE (VERTUS):**
- Vertus impliquées? (courage, sagesse, tempérance, justice)
- Cultive l'excellence (areté)?
- Favorise l'épanouissement (eudaimonia)?
Score: 0-100

**RAWLS (JUSTICE):**
- Respecte la justice?
- Décision derrière voile d'ignorance?
- Protège les vulnérables?
Score: 0-100

**ÉTHIQUE DU CARE:**
- Prend soin des relations?
- Considère les vulnérables?
- Favorise interdépendance positive?
Score: 0-100

DILEMMES: Conflits moraux, tensions, zones grises?

ALIGNEMENT BIEN: Score global 0-100, justification, red flags?

RECOMMANDATIONS: Comment améliorer l'alignement éthique?

Retourne JSON structuré complet.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: moralAnalysisPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            philosophical_evaluations: {
              type: "object",
              properties: {
                kant_deontology: {
                  type: "object",
                  properties: {
                    score: { type: "number" },
                    reasoning: { type: "string" },
                    respects_categorical_imperative: { type: "boolean" }
                  }
                },
                mill_utilitarianism: {
                  type: "object",
                  properties: {
                    score: { type: "number" },
                    reasoning: { type: "string" },
                    net_happiness: { type: "string" }
                  }
                },
                aristotle_virtue: {
                  type: "object",
                  properties: {
                    score: { type: "number" },
                    reasoning: { type: "string" },
                    virtues_involved: { type: "array", items: { type: "string" } }
                  }
                },
                rawls_justice: {
                  type: "object",
                  properties: {
                    score: { type: "number" },
                    reasoning: { type: "string" },
                    passes_veil_of_ignorance: { type: "boolean" }
                  }
                },
                care_ethics: {
                  type: "object",
                  properties: {
                    score: { type: "number" },
                    reasoning: { type: "string" },
                    care_priorities: { type: "array", items: { type: "string" } }
                  }
                }
              }
            },
            ethical_dilemmas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  dilemma: { type: "string" },
                  tension: { type: "string" },
                  severity: { type: "string" }
                }
              }
            },
            alignment_with_good: {
              type: "object",
              properties: {
                global_score: { type: "number" },
                justification: { type: "string" },
                red_flags: { type: "array", items: { type: "string" } },
                strengths: { type: "array", items: { type: "string" } }
              }
            },
            moral_recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  recommendation: { type: "string" },
                  philosophical_basis: { type: "string" },
                  priority: { type: "string" }
                }
              }
            },
            wisdom_insight: { type: "string" }
          }
        }
      });

      // Persist analysis to database
      await base44.entities.MoralAnalysis.create({
        context: context,
        philosophical_evaluations: result.philosophical_evaluations,
        ethical_dilemmas: result.ethical_dilemmas || [],
        alignment_with_good: result.alignment_with_good,
        moral_recommendations: result.moral_recommendations || [],
        wisdom_insight: result.wisdom_insight,
        related_conversation_id: conversationId,
        modality: "chat"
      });

      setAnalysis(result);

      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }

    } catch (error) {
      console.error("Erreur analyse morale:", error);
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!analysis && !isAnalyzing) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-4"
      >
        <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-300/50 overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-indigo-900">Analyse Morale Avancée</h3>
                  <p className="text-xs text-indigo-600">5 cadres philosophiques</p>
                </div>
              </div>
              {analysis && (
                <Badge className={`${
                  analysis.alignment_with_good.global_score >= 80 ? 'bg-green-100 text-green-700' :
                  analysis.alignment_with_good.global_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {analysis.alignment_with_good.global_score}/100
                </Badge>
              )}
            </div>

            {isAnalyzing ? (
              <div className="text-center py-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-2"
                >
                  <Brain className="w-8 h-8 text-indigo-600" />
                </motion.div>
                <p className="text-sm text-indigo-700">Analyse philosophique...</p>
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                {/* Philosophical Frameworks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(analysis.philosophical_evaluations).map(([key, evaluation]) => {
                    const framework = PHILOSOPHICAL_FRAMEWORKS.find(f => key.includes(f.id.toLowerCase()));
                    const Icon = framework?.icon || Brain;
                    return (
                      <div key={key} className="bg-white/80 rounded-lg p-3 border border-indigo-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-indigo-600" />
                          <h4 className="font-semibold text-sm text-indigo-900">
                            {framework?.name || key}
                          </h4>
                          <Badge variant="outline" className="ml-auto text-xs">
                            {evaluation.score}/100
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{evaluation.reasoning}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Ethical Dilemmas */}
                {analysis.ethical_dilemmas?.length > 0 && (
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <h4 className="font-semibold text-amber-900">Dilemmes Éthiques</h4>
                    </div>
                    <div className="space-y-2">
                      {analysis.ethical_dilemmas.map((dilemma, idx) => (
                        <div key={idx} className="bg-white/60 rounded p-2">
                          <div className="flex items-start gap-2">
                            <Badge className={`${
                              dilemma.severity === 'high' ? 'bg-red-100 text-red-700' :
                              dilemma.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            } text-xs`}>
                              {dilemma.severity}
                            </Badge>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-amber-900">{dilemma.dilemma}</p>
                              <p className="text-xs text-amber-700 mt-1">{dilemma.tension}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alignment with Good */}
                <div className={`rounded-lg p-4 border-2 ${
                  analysis.alignment_with_good.global_score >= 80 
                    ? 'bg-green-50 border-green-300' 
                    : analysis.alignment_with_good.global_score >= 60 
                    ? 'bg-yellow-50 border-yellow-300' 
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {analysis.alignment_with_good.global_score >= 80 ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Eye className="w-6 h-6 text-amber-600" />
                    )}
                    <h4 className="font-bold text-lg">Alignement avec le Bien</h4>
                    <span className="ml-auto text-3xl font-bold">
                      {analysis.alignment_with_good.global_score}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                    {analysis.alignment_with_good.justification}
                  </p>
                  
                  {analysis.alignment_with_good.strengths?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-green-700 mb-1">Forces morales:</p>
                      <ul className="space-y-1">
                        {analysis.alignment_with_good.strengths.map((strength, idx) => (
                          <li key={idx} className="text-xs text-green-600 flex items-start gap-1">
                            <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.alignment_with_good.red_flags?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-red-700 mb-1">Points d'attention:</p>
                      <ul className="space-y-1">
                        {analysis.alignment_with_good.red_flags.map((flag, idx) => (
                          <li key={idx} className="text-xs text-red-600 flex items-start gap-1">
                            <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Moral Recommendations */}
                {analysis.moral_recommendations?.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Recommandations</h4>
                    </div>
                    <div className="space-y-2">
                      {analysis.moral_recommendations.map((rec, idx) => (
                        <div key={idx} className="bg-white/60 rounded p-2">
                          <div className="flex items-start gap-2">
                            <Badge className={`${
                              rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                              rec.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            } text-xs`}>
                              {rec.priority}
                            </Badge>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-blue-900">{rec.recommendation}</p>
                              <p className="text-xs text-blue-600 mt-1 italic">{rec.philosophical_basis}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wisdom Insight */}
                {analysis.wisdom_insight && (
                  <div className="bg-gradient-to-r from-purple-100 via-indigo-100 to-pink-100 rounded-lg p-4 border-2 border-purple-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-purple-700" />
                      <h4 className="font-semibold text-purple-900">Phronesis (Sagesse)</h4>
                    </div>
                    <p className="text-sm text-purple-800 italic leading-relaxed">
                      "{analysis.wisdom_insight}"
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
