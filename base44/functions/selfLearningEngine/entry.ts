/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ SELF LEARNING ENGINE — Backend Function                              ║
 * ║ Migré depuis components/ai/SelfLearningEngine                        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const feedbacks = await base44.entities.AIFeedback.list('-created_date', 100).catch(() => []);

    if (feedbacks.length < 10) {
      return Response.json({ insufficient_data: true, feedback_count: feedbacks.length });
    }

    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyse ces feedbacks utilisateurs pour identifier les patterns d'amélioration:

FEEDBACKS (${feedbacks.length} total):
${feedbacks.slice(0, 30).map(f => `[${f.feature_type}] Rating: ${f.rating}/5 | Positif: ${f.is_positive} | "${f.feedback_text}"`).join('\n')}

Identifie les faiblesses récurrentes et les points d'amélioration prioritaires. Retourne JSON:
{
  "patterns": { "common_complaints": [], "positive_patterns": [] },
  "improvement_priorities": [],
  "learning_insights": [],
  "overall_satisfaction_trend": "improving|stable|declining",
  "recommendation_summary": ""
}`,
      response_json_schema: {
        type: "object",
        properties: {
          patterns: { type: "object" },
          improvement_priorities: { type: "array", items: { type: "object" } },
          learning_insights: { type: "array", items: { type: "string" } },
          overall_satisfaction_trend: { type: "string" },
          recommendation_summary: { type: "string" }
        }
      }
    });

    // Sauvegarder le cycle d'apprentissage
    await base44.entities.MetaLearning.create({
      algorithm_type: "self_improvement",
      learning_strategy: "feedback_driven",
      insights_discovered: analysis.learning_insights || [],
      applied_to_system: true
    }).catch(() => {});

    return Response.json(analysis);
  } catch (error) {
    console.error('[selfLearningEngine]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});