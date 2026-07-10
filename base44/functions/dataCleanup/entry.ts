import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Purge automatique des données accumulées (snapshots cognitifs, traces, logs)
// Rétention: CorePhaseEvent 7j · snapshots/traces 30j · logs résolus 30j
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
    const svc = base44.asServiceRole.entities;

    const targets = [
      { name: 'CorePhaseEvent', query: { created_date: { $lt: daysAgo(7) } } },
      { name: 'ConsciousnessSnapshot', query: { created_date: { $lt: daysAgo(30) } } },
      { name: 'CognitiveCore', query: { created_date: { $lt: daysAgo(30) } } },
      { name: 'IntrospectionState', query: { created_date: { $lt: daysAgo(30) } } },
      { name: 'ThinkingTrace', query: { created_date: { $lt: daysAgo(30) } } },
      { name: 'IntegrationLog', query: { created_date: { $lt: daysAgo(30) } } },
      { name: 'ErrorLog', query: { resolved: true, created_date: { $lt: daysAgo(30) } } }
    ];

    const results = {};
    for (const target of targets) {
      try {
        const res = await svc[target.name].deleteMany(target.query);
        results[target.name] = res?.deleted_count ?? res ?? 'ok';
      } catch (e) {
        results[target.name] = `error: ${e.message}`;
      }
    }

    return Response.json({ success: true, purged: results, executed_at: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});