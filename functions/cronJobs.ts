/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Scheduled Cron Jobs                                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const results = [];

  try {
    // Daily cleanup - ErrorLogs > 90 days
    const errorCutoff = new Date();
    errorCutoff.setDate(errorCutoff.getDate() - 90);
    const errorLogs = await base44.asServiceRole.entities.ErrorLog.list();
    let deletedErrors = 0;
    
    for (const log of errorLogs) {
      if (new Date(log.created_date) < errorCutoff) {
        await base44.asServiceRole.entities.ErrorLog.delete(log.id);
        deletedErrors++;
      }
    }
    results.push({ task: 'cleanup_errors', deleted: deletedErrors });

    // Weekly cleanup - SystemMetrics > 180 days
    const metricsCutoff = new Date();
    metricsCutoff.setDate(metricsCutoff.getDate() - 180);
    const metrics = await base44.asServiceRole.entities.SystemMetrics.list();
    let deletedMetrics = 0;
    
    for (const metric of metrics) {
      if (new Date(metric.timestamp) < metricsCutoff) {
        await base44.asServiceRole.entities.SystemMetrics.delete(metric.id);
        deletedMetrics++;
      }
    }
    results.push({ task: 'cleanup_metrics', deleted: deletedMetrics });

    // Monthly cleanup - AnalyticsEvent > 365 days
    const analyticsCutoff = new Date();
    analyticsCutoff.setDate(analyticsCutoff.getDate() - 365);
    const events = await base44.asServiceRole.entities.AnalyticsEvent.list();
    let deletedEvents = 0;
    
    for (const event of events) {
      if (new Date(event.timestamp) < analyticsCutoff) {
        await base44.asServiceRole.entities.AnalyticsEvent.delete(event.id);
        deletedEvents++;
      }
    }
    results.push({ task: 'cleanup_analytics', deleted: deletedEvents });

    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});