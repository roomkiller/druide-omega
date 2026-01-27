import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer les feedbacks et évaluations récents
    const [reasoningFeedback, emotionalResponses, decisions] = await Promise.all([
      base44.entities.ReasoningFeedback.filter({ created_by: user.email }),
      base44.entities.EmotionalResponse.filter({ created_by: user.email }),
      base44.entities.IntuitiveDecision.filter({ created_by: user.email })
    ]);

    // Analyser les patterns d'apprentissage
    const analysisPrompt = `Analyse ces interactions utilisateur pour identifier les patterns d'apprentissage manqués:

FEEDBACKS RÉCENTS (${reasoningFeedback.length}):
${reasoningFeedback.slice(0, 5).map(f => `Query: "${f.query}" | Rating: ${f.user_rating}/5`).join('\n')}

RÉPONSES ÉMOTIONNELLES (${emotionalResponses.length}):
${emotionalResponses.slice(0, 3).map(e => `"${e.trigger_content}" → ${e.emotional_reaction} (intensity: ${e.emotional_intensity})`).join('\n')}

DÉCISIONS (${decisions.length}):
${decisions.slice(0, 3).map(d => `${d.decision_type}: "${d.decision_context.substring(0, 50)}..."`).join('\n')}

Identifie:
1. Ce que le système devrait apprendre des succès (rating 4-5)
2. Ce que le système devrait éviter des échecs (rating 1-2)
3. Les patterns d'émotions positives à renforcer
4. Les évolutions cognitives nécessaires

Réponds en JSON: {
  "patterns_to_learn": ["pattern1", "pattern2"],
  "patterns_to_avoid": ["pattern1"],
  "emotional_triggers": {"trigger": "action"},
  "cognitive_evolution": {"dimension": "change_needed"},
  "learning_confidence": 0-100
}`;

    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: analysisPrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          patterns_to_learn: { type: 'array', items: { type: 'string' } },
          patterns_to_avoid: { type: 'array', items: { type: 'string' } },
          emotional_triggers: { type: 'object' },
          cognitive_evolution: { type: 'object' },
          learning_confidence: { type: 'number' }
        }
      }
    });

    // Sauvegarder les données d'apprentissage
    let learnedPatterns = 0;
    const now = new Date().toISOString();

    if (analysis?.patterns_to_learn) {
      for (const pattern of analysis.patterns_to_learn) {
        try {
          await base44.entities.MetaLearning.create({
            pattern: pattern,
            type: 'success_pattern',
            frequency: 1,
            confidence: analysis.learning_confidence || 75,
            last_updated: now,
            data_source: 'continuous_feedback'
          });
          learnedPatterns++;
        } catch (e) {
          console.error('Error saving pattern:', e);
        }
      }
    }

    // Mettre à jour la configuration de conscience si évolutions identifiées
    if (analysis?.cognitive_evolution && Object.keys(analysis.cognitive_evolution).length > 0) {
      try {
        const config = await base44.entities.ConsciousnessConfig.list();
        if (config.length > 0) {
          const updates = {};
          for (const [dimension, change] of Object.entries(analysis.cognitive_evolution)) {
            if (dimension === 'emotional_depth' || dimension === 'metacognition_level') {
              updates[dimension] = Math.min(10, (config[0][dimension] || 5) + 1);
            }
          }
          if (Object.keys(updates).length > 0) {
            await base44.entities.ConsciousnessConfig.update(config[0].id, updates);
          }
        }
      } catch (e) {
        console.error('Error updating consciousness:', e);
      }
    }

    return Response.json({
      learned: learnedPatterns,
      patterns_analyzed: analysis?.patterns_to_learn?.length || 0,
      patterns_avoided: analysis?.patterns_to_avoid?.length || 0,
      confidence: analysis?.learning_confidence || 0,
      cognitive_updates: Object.keys(analysis?.cognitive_evolution || {}).length,
      timestamp: now
    });
  } catch (error) {
    console.error('Learning optimization error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});