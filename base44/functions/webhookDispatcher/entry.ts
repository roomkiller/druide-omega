/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Webhook Dispatcher                                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { event, payload } = await req.json();

    // Fetch all active webhooks
    const webhooks = await base44.entities.Webhook.filter({ 
      event_type: event,
      active: true
    });

    const results = [];

    for (const webhook of webhooks) {
      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Druide-Event': event,
            'X-Druide-Signature': generateSignature(payload, webhook.secret)
          },
          body: JSON.stringify(payload)
        });

        results.push({
          webhook_id: webhook.id,
          status: response.status,
          success: response.ok
        });

        // Log webhook call
        await base44.entities.IntegrationLog.create({
          integration_type: 'webhook',
          status: response.ok ? 'success' : 'error',
          metadata: {
            webhook_id: webhook.id,
            event,
            status_code: response.status
          }
        });

      } catch (error) {
        results.push({
          webhook_id: webhook.id,
          error: error.message
        });
      }
    }

    return Response.json({
      success: true,
      event,
      dispatched: results.length,
      results
    });

  } catch (error) {
    console.error('Webhook dispatcher error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function generateSignature(payload, secret) {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload) + secret);
  return crypto.subtle.digest('SHA-256', data).then(hash => 
    Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  );
}