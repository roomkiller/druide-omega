import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer les traces de raisonnement lentes
    const slowReasonings = await base44.entities.ReasoningFeedback.filter(
      { complexity_score: { $gte: 7 } }
    );

    if (slowReasonings.length === 0) {
      return Response.json({ optimized: 0, message: 'Aucune trace lente trouvée' });
    }

    // Analyser les patterns de latence
    const analysisPrompt = `Analyse ces requêtes complexes et leurs latences pour identifier les goulots d'étranglement:

${slowReasonings.slice(0, 5).map(r => `Query: ${r.query}\nComplexity: ${r.complexity_score}\nRating: ${r.user_rating}`).join('\n---\n')}

Identifie:
1. Les patterns de requête lente
2. Les étapes optimisables
3. Les stratégies de caching applicables
4. Les approximations acceptables pour les réponses rapides

Format JSON: {
  "bottlenecks": ["..."],
  "caching_strategies": [{"pattern": "...", "ttl_seconds": 3600}],
  "fast_approximation": "stratégie pour réponse rapide avant calcul complet"
}`;

    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: analysisPrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          bottlenecks: { type: 'array', items: { type: 'string' } },
          caching_strategies: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                pattern: { type: 'string' },
                ttl_seconds: { type: 'number' }
              }
            }
          },
          fast_approximation: { type: 'string' }
        }
      }
    });

    // Sauvegarder la configuration d'optimisation
    const now = new Date().toISOString();
    const cacheConfig = {
      timestamp: now,
      strategies: analysis?.caching_strategies || [],
      approximation_enabled: true,
      bottlenecks: analysis?.bottlenecks || []
    };

    // Sauvegarder en localStorage du système
    await base44.asServiceRole.entities.RegistryEntry.create({
      key: 'latency_optimization_config',
      value: JSON.stringify(cacheConfig),
      category: 'performance',
      last_updated: now
    });

    return Response.json({
      optimized: true,
      strategies: analysis?.caching_strategies?.length || 0,
      bottlenecks: analysis?.bottlenecks || [],
      fast_approximation: analysis?.fast_approximation,
      timestamp: now
    });
  } catch (error) {
    console.error('Latency optimization error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});