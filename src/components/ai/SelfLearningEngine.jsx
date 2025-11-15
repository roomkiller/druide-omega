/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Self-Learning & Improvement Engine                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class SelfLearningEngine {
  constructor() {
    this.learningCycle = 0;
    this.improvementThreshold = 0.15; // 15% improvement needed
  }

  async analyzeFeedbackPatterns() {
    try {
      const feedbacks = await base44.entities.AIFeedback?.list('-timestamp', 100) || [];
      
      if (feedbacks.length < 10) {
        return { insufficient_data: true };
      }

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse ces feedbacks utilisateurs pour identifier les patterns d'amélioration:

FEEDBACKS (${feedbacks.length} total):
${feedbacks.slice(0, 30).map(f => `[${f.feature_type}] Rating: ${f.rating}/5 | Positif: ${f.is_positive} | "${f.feedback_text}"`).join('\n')}

OBJECTIF: Identifier les faiblesses récurrentes et les points d'amélioration prioritaires.

Retourne JSON:
{
  "patterns": {
    "common_complaints": [
      {
        "issue": "description du problème",
        "frequency": 0-100,
        "severity": "low|medium|high|critical",
        "affected_features": ["feature1", "feature2"]
      }
    ],
    "positive_patterns": [
      {
        "strength": "point fort",
        "frequency": 0-100
      }
    ]
  },
  "improvement_priorities": [
    {
      "area": "domaine à améliorer",
      "priority_score": 0-100,
      "suggested_changes": ["changement1", "changement2"],
      "expected_impact": "description de l'impact"
    }
  ],
  "learning_insights": [
    "insight 1",
    "insight 2"
  ],
  "overall_satisfaction_trend": "improving|stable|declining",
  "recommendation_summary": "résumé des recommandations"
}`,
        response_json_schema: {
          type: "object",
          properties: {
            patterns: {
              type: "object",
              properties: {
                common_complaints: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      issue: { type: "string" },
                      frequency: { type: "number" },
                      severity: { type: "string" },
                      affected_features: { type: "array", items: { type: "string" } }
                    }
                  }
                },
                positive_patterns: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      strength: { type: "string" },
                      frequency: { type: "number" }
                    }
                  }
                }
              }
            },
            improvement_priorities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  area: { type: "string" },
                  priority_score: { type: "number" },
                  suggested_changes: { type: "array", items: { type: "string" } },
                  expected_impact: { type: "string" }
                }
              }
            },
            learning_insights: { type: "array", items: { type: "string" } },
            overall_satisfaction_trend: { type: "string" },
            recommendation_summary: { type: "string" }
          }
        }
      });

      return analysis;
    } catch (error) {
      console.error("Erreur analyse patterns:", error);
      return null;
    }
  }

  async applyLearnings(learningData) {
    try {
      this.learningCycle++;

      // Create meta-learning entry
      await base44.entities.MetaLearning.create({
        learning_cycle: this.learningCycle,
        algorithm_type: "self_improvement",
        baseline_performance: learningData.baseline || {},
        improved_performance: learningData.improved || {},
        improvement_delta: learningData.delta || 0,
        learning_strategy: "feedback_driven",
        insights_discovered: learningData.insights || [],
        applied_to_system: true
      });

      // Update AI model settings based on learnings
      const improvements = await this.generateImprovements(learningData);
      
      return {
        cycle: this.learningCycle,
        improvements_applied: improvements,
        next_evaluation_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    } catch (error) {
      console.error("Erreur application apprentissages:", error);
      return null;
    }
  }

  async generateImprovements(learningData) {
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Basé sur ces données d'apprentissage, génère des améliorations concrètes:

${JSON.stringify(learningData, null, 2)}

Génère des ajustements spécifiques pour:
1. Paramètres du modèle (température, penalties, etc.)
2. Stratégies de réponse
3. Gestion du contexte
4. Personnalisation

Retourne JSON avec les améliorations recommandées.`,
        response_json_schema: {
          type: "object",
          properties: {
            model_adjustments: {
              type: "object",
              properties: {
                temperature_delta: { type: "number" },
                reasoning: { type: "string" }
              }
            },
            strategy_improvements: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  strategy: { type: "string" },
                  adjustment: { type: "string" }
                }
              }
            },
            context_management_improvements: { type: "array", items: { type: "string" } }
          }
        }
      });

      return result;
    } catch (error) {
      console.error("Erreur génération améliorations:", error);
      return {};
    }
  }

  async evaluateImprovement(before, after) {
    const improvement = {
      accuracy: ((after.accuracy - before.accuracy) / before.accuracy) * 100,
      satisfaction: ((after.satisfaction - before.satisfaction) / before.satisfaction) * 100,
      speed: ((before.speed - after.speed) / before.speed) * 100 // Lower is better
    };

    const avgImprovement = (improvement.accuracy + improvement.satisfaction + improvement.speed) / 3;

    return {
      improvement_metrics: improvement,
      avg_improvement: avgImprovement,
      meets_threshold: avgImprovement >= this.improvementThreshold * 100,
      recommendation: avgImprovement >= this.improvementThreshold * 100 
        ? "apply" 
        : "needs_more_data"
    };
  }

  async scheduleNextLearningCycle() {
    const nextCycleDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    return {
      next_cycle: this.learningCycle + 1,
      scheduled_for: nextCycleDate.toISOString(),
      min_feedback_required: 50
    };
  }
}

export const selfLearningEngine = new SelfLearningEngine();