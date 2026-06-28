import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer les données disponibles
    const [memories, knowledge, conversations] = await Promise.all([
      base44.entities.Memory.filter({ created_by: user.email }),
      base44.entities.KnowledgeBase.list(),
      base44.entities.Conversation.filter({ created_by: user.email })
    ]);

    if (memories.length < 2 || knowledge.length < 2) {
      return Response.json({ created: 0, message: 'Données insuffisantes pour les corrélations' });
    }

    // Analyser les patterns avec LLM
    const analysisPrompt = `Analyse ces données et identifie les corrélations cognitives fortes:
    
    MÉMOIRES (${memories.length}): ${memories.slice(0, 5).map(m => m.content).join(' | ')}
    
    CONNAISSANCES (${knowledge.length}): ${knowledge.slice(0, 5).map(k => k.title).join(' | ')}
    
    CONVERSATIONS (${conversations.length}): ${conversations.length > 0 ? 'présentes' : 'aucune'}
    
    Pour chaque corrélation identifiée, fournis:
    1. Deux concepts reliés
    2. Type de lien (causal, sémantique, associatif, analogique)
    3. Force 1-10
    4. Justification brève
    
    Format JSON: [{"source":"concept1", "target":"concept2", "type":"causal", "strength":8, "reasoning":"..."}]`;

    const analysisResult = await base44.integrations.Core.InvokeLLM({
      prompt: analysisPrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          correlations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                source: { type: 'string' },
                target: { type: 'string' },
                type: { type: 'string' },
                strength: { type: 'number' },
                reasoning: { type: 'string' }
              }
            }
          }
        }
      }
    });

    let createdCount = 0;
    const now = new Date();

    if (analysisResult?.correlations) {
      for (const corr of analysisResult.correlations) {
        try {
          await base44.entities.CognitiveCorrelation.create({
            timestamp: now.toISOString(),
            correlation_type: corr.type || 'semantic',
            source_modality: 'memory',
            target_modality: 'knowledge',
            source_content: corr.source,
            target_content: corr.target,
            correlation_strength: Math.min(10, Math.max(1, corr.strength || 5)),
            interpretation: corr.reasoning,
            justification: `Corrélation identifiée via analyse cross-modale: ${corr.reasoning}`,
            confidence_level: Math.min(100, (corr.strength || 5) * 10),
            cognitive_layer: 'intermediate'
          });
          createdCount++;
        } catch (e) {
          console.error('Erreur création corrélation:', e);
        }
      }
    }

    return Response.json({
      created: createdCount,
      analyzed: { memories: memories.length, knowledge: knowledge.length, conversations: conversations.length },
      timestamp: now.toISOString(),
      message: `${createdCount} nouvelles corrélations intelligentes créées`
    });
  } catch (error) {
    console.error('Correlation enhancement error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});