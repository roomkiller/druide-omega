/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ KB REASONING ENGINE — Backend Function                               ║
 * ║ Recherche lexicale locale + composition déterministe.                ║
 * ║ Le LLM n'est qu'un enrichissement optionnel : son absence            ║
 * ║ n'empêche jamais la réponse.                                         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { rankKnowledge, composeLocalAnswer } from '../../shared/kbRetrieval.js';
import { readKbCorpus } from '../../shared/kbCorpus.js';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { query, allowLLM = true } = await req.json();
    if (!query) return Response.json({ error: 'query required' }, { status: 400 });

    // ── 1. Récupération complète du corpus (paginée, sans coupure arbitraire) ──
    const knowledgeBases = await readKbCorpus(base44);

    // ── 2. Sélection lexicale locale ──
    const ranked = rankKnowledge(query, knowledgeBases, 6);
    const local = composeLocalAnswer(query, ranked);

    const baseResult = {
      direct_information: { found: local.found, content: local.answer },
      implicit_knowledge: local.facts.map((f) => ({ insight: f })),
      complex_relationships: [],
      generated_hypotheses: [],
      multi_step_inference: { steps: [], final_conclusion: local.answer },
      contradictions_detected: [],
      knowledge_gaps: local.found ? [] : [{ gap: query }],
      final_answer: {
        answer: local.answer,
        confidence: local.confidence,
        limitations: local.found
          ? 'Réponse composée à partir des fiches de la base, sans inférence externe.'
          : 'Aucune fiche pertinente trouvée dans la base.'
      },
      sources: local.sources,
      kb_scanned: knowledgeBases.length,
      kb_matched: ranked.length,
      mode: 'local'
    };

    // ── 3. Enrichissement LLM optionnel (jamais bloquant) ──
    if (!allowLLM || ranked.length === 0) {
      return Response.json(baseResult);
    }

    try {
      const reasoning = await base44.integrations.Core.InvokeLLM({
        prompt: `Réponds à la question en t'appuyant STRICTEMENT sur les fiches fournies.

QUESTION: ${query}

FICHES PERTINENTES (déjà sélectionnées par pertinence):
${ranked.map((r, i) => `[${i}] ${r.kb.title}
Résumé: ${r.kb.summary || ''}
Faits: ${(r.kb.extracted_facts || []).join(' | ')}`).join('\n\n')}

Retourne un JSON avec:
- final_answer (answer, confidence 0-100, limitations)
- multi_step_inference (steps [{step, reasoning}], final_conclusion)
- implicit_knowledge (tableau de {insight})
- contradictions_detected (tableau de {contradiction})
- knowledge_gaps (tableau de {gap})`,
        response_json_schema: {
          type: 'object',
          properties: {
            final_answer: {
              type: 'object',
              properties: {
                answer: { type: 'string' },
                confidence: { type: 'number' },
                limitations: { type: 'string' }
              }
            },
            multi_step_inference: {
              type: 'object',
              properties: {
                steps: { type: 'array', items: { type: 'object' } },
                final_conclusion: { type: 'string' }
              }
            },
            implicit_knowledge: { type: 'array', items: { type: 'object' } },
            contradictions_detected: { type: 'array', items: { type: 'object' } },
            knowledge_gaps: { type: 'array', items: { type: 'object' } }
          }
        }
      });

      return Response.json({
        ...baseResult,
        ...reasoning,
        sources: local.sources,
        kb_scanned: knowledgeBases.length,
        kb_matched: ranked.length,
        mode: 'llm_enriched',
        local_answer: local.answer
      });
    } catch (llmError) {
      console.warn('[kbReasoningEngine] LLM indisponible, repli local:', llmError.message);
      return Response.json({
        ...baseResult,
        mode: 'local_fallback',
        llm_error: llmError.message
      });
    }
  } catch (error) {
    console.error('[kbReasoningEngine]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}