/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Health Check Endpoint                                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  const startTime = Date.now();
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {}
  };

  try {
    const base44 = createClientFromRequest(req);

    // Database check
    try {
      await base44.asServiceRole.entities.Conversation.list('-created_date', 1);
      health.checks.database = { status: 'up', latency: Date.now() - startTime };
    } catch (e) {
      health.checks.database = { status: 'down', error: e.message };
      health.status = 'unhealthy';
    }

    // Integration check
    try {
      await base44.integrations.Core.InvokeLLM({ prompt: 'test' });
      health.checks.llm = { status: 'up' };
    } catch (e) {
      health.checks.llm = { status: 'degraded', error: e.message };
    }

    // Memory usage
    const memUsage = Deno.memoryUsage();
    health.checks.memory = {
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB'
    };

    health.response_time_ms = Date.now() - startTime;

    return Response.json(health, {
      status: health.status === 'healthy' ? 200 : 503
    });

  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
});