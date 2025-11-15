/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Multi-Step Reasoning Engine                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowRight, CheckCircle, Target } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";

export async function performMultiStepReasoning(problem, context = {}) {
  try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es une IA avec un raisonnement multi-étapes avancé. Résous ce problème complexe en décomposant ta réflexion.

PROBLÈME: ${problem}

CONTEXTE DISPONIBLE:
${JSON.stringify(context, null, 2)}

MÉTHODOLOGIE:
1. Analyse du problème (identifier les composantes clés)
2. Décomposition en sous-problèmes
3. Résolution étape par étape
4. Synthèse et vérification
5. Conclusion argumentée

Pour chaque étape, explique ton raisonnement et les décisions prises.

Retourne JSON:
{
  "problem_analysis": {
    "key_components": ["composante1", "composante2"],
    "complexity_level": 1-10,
    "required_knowledge": ["domaine1", "domaine2"]
  },
  "reasoning_steps": [
    {
      "step_number": 1,
      "title": "titre de l'étape",
      "reasoning": "raisonnement détaillé",
      "intermediate_result": "résultat intermédiaire",
      "confidence": 0-100
    }
  ],
  "synthesis": {
    "final_answer": "réponse finale complète",
    "reasoning_chain": "enchaînement logique complet",
    "assumptions_made": ["hypothèse1"],
    "limitations": ["limitation1"],
    "confidence_score": 0-100
  },
  "alternative_approaches": [
    {
      "approach": "approche alternative",
      "pros": ["avantage1"],
      "cons": ["inconvénient1"]
    }
  ]
}`,
      response_json_schema: {
        type: "object",
        properties: {
          problem_analysis: {
            type: "object",
            properties: {
              key_components: { type: "array", items: { type: "string" } },
              complexity_level: { type: "number" },
              required_knowledge: { type: "array", items: { type: "string" } }
            }
          },
          reasoning_steps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                step_number: { type: "number" },
                title: { type: "string" },
                reasoning: { type: "string" },
                intermediate_result: { type: "string" },
                confidence: { type: "number" }
              }
            }
          },
          synthesis: {
            type: "object",
            properties: {
              final_answer: { type: "string" },
              reasoning_chain: { type: "string" },
              assumptions_made: { type: "array", items: { type: "string" } },
              limitations: { type: "array", items: { type: "string" } },
              confidence_score: { type: "number" }
            }
          },
          alternative_approaches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                approach: { type: "string" },
                pros: { type: "array", items: { type: "string" } },
                cons: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    });

    return result;
  } catch (error) {
    console.error("Erreur raisonnement multi-étapes:", error);
    throw error;
  }
}

export function MultiStepReasoningDisplay({ reasoningData }) {
  if (!reasoningData) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-900">Raisonnement Multi-Étapes</h3>
      </div>

      {/* Problem Analysis */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-indigo-100">
        <h4 className="font-semibold text-sm text-indigo-900 mb-2">Analyse du Problème</h4>
        <div className="space-y-2">
          <div>
            <span className="text-xs text-slate-600">Complexité: </span>
            <Badge variant="secondary">{reasoningData.problem_analysis.complexity_level}/10</Badge>
          </div>
          <div>
            <span className="text-xs text-slate-600 block mb-1">Composantes clés:</span>
            <div className="flex flex-wrap gap-1">
              {reasoningData.problem_analysis.key_components.map((comp, i) => (
                <Badge key={i} variant="outline" className="text-xs">{comp}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reasoning Steps */}
      <div className="space-y-3 mb-6">
        {reasoningData.reasoning_steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="relative"
          >
            <Card className="p-4 bg-white border-indigo-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.step_number}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-sm text-slate-900">{step.title}</h5>
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      {step.confidence}% confiance
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{step.reasoning}</p>
                  <div className="p-2 bg-indigo-50 rounded text-sm text-indigo-900">
                    <strong>Résultat:</strong> {step.intermediate_result}
                  </div>
                </div>
              </div>
            </Card>
            {idx < reasoningData.reasoning_steps.length - 1 && (
              <div className="flex justify-center my-2">
                <ArrowRight className="w-5 h-5 text-indigo-400" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Synthesis */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h4 className="font-semibold text-green-900">Synthèse & Conclusion</h4>
          <Badge className="ml-auto bg-green-600 text-white">
            {reasoningData.synthesis.confidence_score}% confiance
          </Badge>
        </div>
        <p className="text-sm text-slate-900 mb-3">{reasoningData.synthesis.final_answer}</p>
        
        {reasoningData.synthesis.assumptions_made?.length > 0 && (
          <div className="mb-2">
            <p className="text-xs font-semibold text-slate-700 mb-1">Hypothèses:</p>
            {reasoningData.synthesis.assumptions_made.map((assumption, i) => (
              <p key={i} className="text-xs text-slate-600">• {assumption}</p>
            ))}
          </div>
        )}

        {reasoningData.synthesis.limitations?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-1">Limitations:</p>
            {reasoningData.synthesis.limitations.map((limitation, i) => (
              <p key={i} className="text-xs text-slate-600">• {limitation}</p>
            ))}
          </div>
        )}
      </div>

      {/* Alternative Approaches */}
      {reasoningData.alternative_approaches?.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-sm text-slate-900 mb-2">Approches Alternatives</h4>
          <div className="space-y-2">
            {reasoningData.alternative_approaches.map((alt, i) => (
              <Card key={i} className="p-3 bg-white border-slate-200">
                <p className="text-sm font-medium text-slate-900 mb-2">{alt.approach}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-green-600 font-semibold">Avantages:</span>
                    {alt.pros.map((pro, j) => (
                      <p key={j} className="text-slate-600">+ {pro}</p>
                    ))}
                  </div>
                  <div>
                    <span className="text-red-600 font-semibold">Inconvénients:</span>
                    {alt.cons.map((con, j) => (
                      <p key={j} className="text-slate-600">- {con}</p>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}