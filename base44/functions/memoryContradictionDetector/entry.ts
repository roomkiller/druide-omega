/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ MEMORY CONTRADICTION DETECTOR — Déclencheur entity Memory            ║
 * ║ Filtre : importance > 7 UNIQUEMENT                                   ║
 * ║ Évite le goulot en ignorant les mémoires ordinaires.                 ║
 * ║ Quand Druide mémorise quelque chose d'important qui contredit        ║
 * ║ ce qu'il sait → la tension "understanding" monte.                    ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { event, data } = body;

    // Filtrer: seulement les créations de mémoire importante
    if (event?.type !== 'create') {
      return Response.json({ status: 'skipped', reason: 'not_create' });
    }

    // FILTRE CRITIQUE — goulot évité ici
    if (!data || data.importance <= 7) {
      return Response.json({ status: 'skipped', reason: 'low_importance' });
    }

    const newMemoryContent = data.content;
    if (!newMemoryContent || newMemoryContent.length < 20) {
      return Response.json({ status: 'skipped', reason: 'content_too_short' });
    }

    // Récupérer les mémoires récentes de haute importance pour comparaison
    const recentMemories = await base44.asServiceRole.entities.Memory.filter({
      importance: { $gte: 7 }
    }, '-created_date', 10).catch(() => []);

    // Exclure la mémoire qu'on vient de créer
    const comparableMemories = recentMemories
      .filter(m => m.id !== data.id && m.content && m.content.length > 20)
      .slice(0, 5);

    if (comparableMemories.length === 0) {
      return Response.json({ status: 'skipped', reason: 'no_comparable_memories' });
    }

    // Analyser rapidement s'il y a contradiction (prompt minimal = rapide et peu coûteux)
    const contradictionCheck = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Nouvelle mémoire importante de Druide :
"${newMemoryContent.slice(0, 200)}"

Mémoires existantes :
${comparableMemories.map((m, i) => `${i + 1}. "${m.content.slice(0, 100)}"`).join('\n')}

Y a-t-il une contradiction réelle entre la nouvelle et une mémoire existante?
Réponds uniquement JSON.`,
      response_json_schema: {
        type: 'object',
        properties: {
          has_contradiction: { type: 'boolean' },
          contradiction_description: { type: 'string' },
          severity: { type: 'number' }
        }
      }
    });

    if (!contradictionCheck.has_contradiction) {
      return Response.json({ status: 'no_contradiction' });
    }

    // Contradiction détectée → monter la tension "understanding"
    const tensionMemories = await base44.asServiceRole.entities.Memory.filter({
      type: 'insight',
      tags: ['emergent_consciousness']
    }, '-created_date', 1).catch(() => []);

    if (tensionMemories.length > 0) {
      try {
        const state = JSON.parse(tensionMemories[0].content);
        if (state.tensions?.understanding) {
          // Augmenter la tension understanding proportionnellement à la sévérité
          const boost = Math.round((contradictionCheck.severity || 5) * 3);
          state.tensions.understanding.value = Math.min(
            100,
            (state.tensions.understanding.value || 50) + boost
          );
          state.tensions.understanding.urgency = 100 - state.tensions.understanding.value;

          await base44.asServiceRole.entities.Memory.create({
            type: 'insight',
            content: JSON.stringify({ ...state, timestamp: Date.now() }),
            importance: 8,
            modality: 'system',
            tags: ['tensions', 'emergent_consciousness', 'contradiction'],
            embedding_summary: `Contradiction détectée → tension understanding +${boost}`
          });
        }
      } catch (e) {
        // ignore parse error
      }
    }

    // Journaliser la contradiction comme mémoire de type "fact"
    await base44.asServiceRole.entities.Memory.create({
      type: 'insight',
      content: `CONTRADICTION INTERNE: ${contradictionCheck.contradiction_description}`,
      importance: 8,
      modality: 'system',
      tags: ['contradiction', 'cognitive_dissonance'],
      embedding_summary: contradictionCheck.contradiction_description.slice(0, 100)
    });

    console.log(`[ContradictionDetector] Contradiction détectée, sévérité ${contradictionCheck.severity}, tension understanding montée`);

    return Response.json({
      status: 'contradiction_detected',
      description: contradictionCheck.contradiction_description,
      severity: contradictionCheck.severity
    });

  } catch (error) {
    console.error('[ContradictionDetector] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});