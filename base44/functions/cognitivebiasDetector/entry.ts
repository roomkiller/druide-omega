import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer les décisions récentes
    const decisions = await base44.entities.IntuitiveDecision.filter(
      { created_by: user.email }
    );

    const reasoningTraces = await base44.entities.ReasoningFeedback.filter(
      { user_rating: { $lt: 4 } } // Récupérer les mauvaises évaluations
    );

    if (decisions.length === 0 && reasoningTraces.length === 0) {
      return Response.json({ biases: [], message: 'Pas de données pour analyse' });
    }

    // Analyser les biais avec LLM
    const analysisPrompt = `Analyse ces décisions et raisonnements pour identifier les biais cognitifs:

DÉCISIONS (${decisions.length}):
${decisions.slice(0, 3).map(d => `- Context: ${d.decision_context}\n  Decision: ${d.decision_type}\n  Heart/Consciousness: ${d.heart_consciousness_ratio}`).join('\n')}

RAISONNEMENTS FAIBLES (${reasoningTraces.length}):
${reasoningTraces.slice(0, 3).map(r => `- Query: ${r.query}\n  Rating: ${r.user_rating}/5`).join('\n')}

Identifie les biais cognitifs potentiels (biais de confirmation, biais d'ancrage, biais de disponibilité, etc.) et propose des corrections.

Réponds en JSON:
{
  "detected_biases": [
    {
      "type": "nom du biais",
      "description": "description",
      "severity": 1-10,
      "evidence": "où vu",
      "correction": "comment corriger"
    }
  ]
}`;

    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: analysisPrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          detected_biases: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                description: { type: 'string' },
                severity: { type: 'number' },
                evidence: { type: 'string' },
                correction: { type: 'string' }
              }
            }
          }
        }
      }
    });

    let trackedBiases = 0;

    if (analysis?.detected_biases) {
      for (const bias of analysis.detected_biases) {
        try {
          await base44.asServiceRole.entities.CognitiveCorrelation.create({
            timestamp: new Date().toISOString(),
            correlation_type: 'causal',
            source_modality: 'system',
            target_modality: 'chat',
            source_content: `Bias Detection: ${bias.type}`,
            target_content: bias.correction,
            correlation_strength: Math.min(10, bias.severity || 5),
            interpretation: bias.description,
            justification: `Biais cognitif détecté: ${bias.evidence}. Correction: ${bias.correction}`,
            confidence_level: (bias.severity || 5) * 10,
            cognitive_layer: 'meta',
            activation_context: 'bias_detection'
          });
          trackedBiases++;
        } catch (e) {
          console.error('Erreur tracking biais:', e);
        }
      }
    }

    return Response.json({
      detected: analysis?.detected_biases?.length || 0,
      tracked: trackedBiases,
      biases: analysis?.detected_biases || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Bias detection error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});