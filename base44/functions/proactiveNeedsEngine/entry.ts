/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ PROACTIVE NEEDS ENGINE — Backend Function                            ║
 * ║ Migré depuis components/ai/ProactiveNeedsEngine                      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const [conversations, memories, knowledgeBases] = await Promise.all([
      base44.entities.Conversation.list('-created_date', 10),
      base44.entities.Memory.filter({ importance: { $gt: 6 } }, '-importance', 20),
      base44.entities.KnowledgeBase.filter({ active: true }, '-created_date', 10)
    ]);

    const anticipation = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyse les interactions passées et anticipe les besoins futurs de l'utilisateur.

CONVERSATIONS RÉCENTES (${conversations.length}):
${conversations.map(c => `- ${c.title}: ${c.messages?.slice(-1).map(m => m.content?.substring(0, 80)).join('')}`).join('\n')}

MÉMOIRES IMPORTANTES (${memories.length}):
${memories.map(m => `- ${m.type}: ${m.content?.substring(0, 80)}`).join('\n')}

BASE DE CONNAISSANCES (${knowledgeBases.length}):
${knowledgeBases.map(k => `- ${k.title}`).join('\n')}

Anticipe les besoins et retourne JSON:
{
  "anticipated_needs": [{ "need": "", "probability": 0, "urgency": "low|medium|high", "suggested_action": "" }],
  "relevant_kb_suggestions": [{ "kb_title": "", "relevance_reason": "" }],
  "detected_trends": [{ "trend": "", "strength": 0 }],
  "follow_up_suggestions": [{ "context": "", "follow_up": "" }]
}`,
      response_json_schema: {
        type: "object",
        properties: {
          anticipated_needs: { type: "array", items: { type: "object" } },
          relevant_kb_suggestions: { type: "array", items: { type: "object" } },
          detected_trends: { type: "array", items: { type: "object" } },
          follow_up_suggestions: { type: "array", items: { type: "object" } }
        }
      }
    });

    return Response.json(anticipation);
  } catch (error) {
    console.error('[proactiveNeedsEngine]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});