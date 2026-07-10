/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Core Session Consolidator (relais de fin de session)       ║
 * ║ Déclenché quand la phase finale « ratio » est créée : agrège les 7        ║
 * ║ phases d'une réflexion en une trace unique. Sans IA — 0 crédit.           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const sessionId = body?.data?.session_id;

    if (!sessionId) {
      return Response.json({ skipped: true, reason: 'Pas de session_id' });
    }

    const events = await base44.asServiceRole.entities.CorePhaseEvent.filter(
      { session_id: sessionId }, 'phase_index', 20
    );

    if (events.length === 0) {
      return Response.json({ skipped: true, reason: 'Aucun événement de phase' });
    }

    const trace = events.map(e => `${e.phase_index}. ${e.label || e.phase_key} : ${e.value || ''}`).join('\n');

    await base44.asServiceRole.entities.Memory.create({
      type: 'insight',
      content: `Trace de session DruideCore\nQuestion : ${events[0].query || '(inconnue)'}\n${trace}`.slice(0, 2000),
      importance: 5,
      modality: 'system',
      tags: ['druidecore', 'session_trace'],
      embedding_summary: `Session ${sessionId.slice(0, 8)} — ${events.length} phases — ${(events[0].query || '').slice(0, 80)}`
    });

    return Response.json({ consolidated: true, session_id: sessionId, phases: events.length });
  } catch (error) {
    console.error('[CoreSessionConsolidator] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});