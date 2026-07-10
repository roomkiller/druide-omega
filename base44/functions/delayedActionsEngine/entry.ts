/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Delayed Actions Engine (actions retardées)                 ║
 * ║ 1. Rumination différée des réponses à faible confiance (IA)               ║
 * ║ 2. Intégration des rêves « pending » (sans IA)                            ║
 * ║ 3. Ré-consolidation J+1 des mémoires importantes (sans IA)                ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const svc = base44.asServiceRole;
    const report = { ruminations: 0, dreams_integrated: 0, reconsolidated: 0, errors: [] };

    // ── 1. Rumination différée : revisiter les questions à faible confiance ──
    try {
      const pending = await svc.entities.Memory.filter(
        { type: 'insight', tags: 'rumination_pending' }, 'created_date', 3
      );
      for (const task of pending) {
        let payload = {};
        try { payload = JSON.parse(task.content); } catch (_) { payload = { query: task.content }; }

        const thought = await svc.integrations.Core.InvokeLLM({
          prompt: `Tu es Druide Omega. Tu as répondu à cette question avec une confiance faible (${payload.confidence ?? '?'}%) : "${payload.query}".
Avec du recul, repense-la calmement. Produis un insight court (max 150 mots) : ce que tu comprends mieux maintenant, ce qui te manquait, et comment mieux répondre la prochaine fois.`
        });

        await svc.entities.Memory.create({
          type: 'insight',
          content: `Rumination différée sur « ${(payload.query || '').slice(0, 120)} » : ${String(thought).slice(0, 800)}`,
          importance: 7,
          modality: 'system',
          tags: ['rumination', 'druidecore'],
          embedding_summary: `Rumination différée — ${(payload.query || '').slice(0, 80)}`
        });
        await svc.entities.Memory.update(task.id, { tags: ['rumination_done', 'druidecore'] });
        report.ruminations++;
      }
    } catch (e) { report.errors.push({ task: 'rumination', error: e.message }); }

    // ── 2. Intégration des rêves en attente (0 crédit) ──
    try {
      const dreams = await svc.entities.DreamSimulation.filter(
        { integration_status: 'pending' }, 'created_date', 10
      );
      for (const dream of dreams) {
        const insights = (dream.insights_generated || []).slice(0, 3);
        if (insights.length > 0) {
          await svc.entities.Memory.create({
            type: 'insight',
            content: `Insights intégrés du rêve [${dream.dream_type}] : ${insights.join(' • ')}`.slice(0, 1000),
            importance: Math.min(9, Math.max(5, Math.round((dream.novelty_score || 50) / 12))),
            modality: 'system',
            tags: ['dream_integration', 'druidecore'],
            embedding_summary: `Intégration de rêve — ${dream.dream_type}`
          });
        }
        await svc.entities.DreamSimulation.update(dream.id, {
          integration_status: insights.length > 0 ? 'integrated' : 'archived'
        });
        report.dreams_integrated++;
      }
    } catch (e) { report.errors.push({ task: 'dreams', error: e.message }); }

    // ── 3. Ré-consolidation J+1 des mémoires importance ≥ 8 (0 crédit) ──
    try {
      const now = Date.now();
      const candidates = await svc.entities.Memory.filter({
        importance: { $gte: 8 },
        created_date: {
          $lt: new Date(now - 86400000).toISOString(),
          $gte: new Date(now - 3 * 86400000).toISOString()
        }
      }, '-importance', 50);

      for (const m of candidates.filter(m => !m.last_consolidation).slice(0, 20)) {
        await svc.entities.Memory.update(m.id, {
          last_consolidation: new Date().toISOString(),
          consolidation_mechanism: 'renforcée',
          confidence_score: Math.min(100, (m.confidence_score || 80) + 5)
        });
        report.reconsolidated++;
      }
    } catch (e) { report.errors.push({ task: 'reconsolidation', error: e.message }); }

    return Response.json({ success: true, ...report });
  } catch (error) {
    console.error('[DelayedActionsEngine] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});