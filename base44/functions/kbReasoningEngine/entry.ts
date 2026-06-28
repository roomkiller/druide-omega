/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ KB REASONING ENGINE — Backend Function                               ║
 * ║ Migré depuis components/ai/KBReasoningEngine                         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { query } = await req.json();
    if (!query) return Response.json({ error: 'query required' }, { status: 400 });

    const knowledgeBases = await base44.entities.KnowledgeBase.filter(
      { active: true },
      '-relevance_score',
      20
    );

    const reasoning = await base44.integrations.Core.InvokeLLM({
      prompt: `Effectue un raisonnement avancé sur la base de connaissances pour répondre à cette question:

QUESTION: ${query}

BASE DE CONNAISSANCES DISPONIBLE:
${knowledgeBases.map((k, i) => `[${i}] ${k.title}
Résumé: ${k.summary || ''}
Faits: ${(k.extracted_facts || []).slice(0, 3).join(' | ')}
Tags: ${(k.tags || []).join(', ')}`).join('\n\n')}

Effectue un raisonnement profond et structuré. Retourne JSON avec:
- direct_information (found, content)
- complex_relationships (tableau)
- implicit_knowledge (tableau)
- generated_hypotheses (tableau)
- multi_step_inference (steps, final_conclusion)
- contradictions_detected (tableau)
- knowledge_gaps (tableau)
- final_answer (answer, confidence, limitations)`,
      response_json_schema: {
        type: "object",
        properties: {
          direct_information: { type: "object", properties: { found: { type: "boolean" }, content: { type: "string" } } },
          complex_relationships: { type: "array", items: { type: "object" } },
          implicit_knowledge: { type: "array", items: { type: "object" } },
          generated_hypotheses: { type: "array", items: { type: "object" } },
          multi_step_inference: { type: "object", properties: { steps: { type: "array", items: { type: "object" } }, final_conclusion: { type: "string" } } },
          contradictions_detected: { type: "array", items: { type: "object" } },
          knowledge_gaps: { type: "array", items: { type: "object" } },
          final_answer: { type: "object", properties: { answer: { type: "string" }, confidence: { type: "number" }, limitations: { type: "string" } } }
        }
      }
    });

    return Response.json(reasoning);
  } catch (error) {
    console.error('[kbReasoningEngine]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});