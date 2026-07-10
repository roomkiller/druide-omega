/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Scheduled Cron Jobs — Hygiène nocturne                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const results = [];
    const iso = (days) => new Date(Date.now() - days * 86400000).toISOString();

    const purge = async (task, fn) => {
      try {
        const r = await fn();
        results.push({ task, result: r ?? 'ok' });
      } catch (e) {
        results.push({ task, error: e.message });
      }
    };

    // ErrorLogs > 90 jours
    await purge('cleanup_errors', () =>
      base44.asServiceRole.entities.ErrorLog.deleteMany({ created_date: { $lt: iso(90) } }));

    // SystemMetrics > 180 jours
    await purge('cleanup_metrics', () =>
      base44.asServiceRole.entities.SystemMetrics.deleteMany({ timestamp: { $lt: iso(180) } }));

    // AnalyticsEvent > 365 jours
    await purge('cleanup_analytics', () =>
      base44.asServiceRole.entities.AnalyticsEvent.deleteMany({ timestamp: { $lt: iso(365) } }));

    // Événements de phase DruideCore > 7 jours
    await purge('cleanup_phase_events', () =>
      base44.asServiceRole.entities.CorePhaseEvent.deleteMany({ created_date: { $lt: iso(7) } }));

    // Historique des tensions > 48h (le decay en recrée chaque heure)
    await purge('cleanup_tension_history', () =>
      base44.asServiceRole.entities.Memory.deleteMany({
        type: 'insight',
        modality: 'system',
        tags: 'tensions',
        created_date: { $lt: iso(2) }
      }));

    return Response.json({ success: true, timestamp: new Date().toISOString(), results });
  } catch (error) {
    console.error('Cron job error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});