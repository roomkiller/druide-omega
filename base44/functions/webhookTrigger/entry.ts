/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Webhook Trigger System with Retry                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import { createHmac } from 'node:crypto';

async function sendWebhook(webhook, eventType, payload, attempt = 1) {
  const signature = createHmac('sha256', webhook.secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  const headers = {
    'Content-Type': 'application/json',
    'X-Druide-Signature': signature,
    'X-Druide-Event': eventType,
    'X-Druide-Delivery': crypto.randomUUID(),
    ...webhook.headers
  };

  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000) // 30s timeout
    });

    return {
      success: response.ok,
      status: response.status,
      attempt
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      attempt
    };
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event_type, payload, user_email } = await req.json();

    if (!event_type || !payload) {
      return Response.json({ 
        error: 'event_type and payload required' 
      }, { status: 400 });
    }

    // Récupérer tous les webhooks actifs pour cet événement
    const allWebhooks = await base44.asServiceRole.entities.Webhook.filter({ 
      active: true 
    });

    const webhooks = allWebhooks.filter(wh => 
      wh.events.includes(event_type) || wh.events.includes('all')
    );

    if (webhooks.length === 0) {
      return Response.json({ 
        message: 'No active webhooks for this event',
        triggered: 0
      });
    }

    const results = [];

    // Envoyer à tous les webhooks avec retry
    for (const webhook of webhooks) {
      let result = null;
      const maxAttempts = webhook.retry_policy?.max_attempts || 3;
      const backoffMultiplier = webhook.retry_policy?.backoff_multiplier || 2;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        result = await sendWebhook(webhook, event_type, payload, attempt);

        if (result.success) {
          // Succès
          await base44.asServiceRole.entities.Webhook.update(webhook.id, {
            last_triggered: new Date().toISOString(),
            success_count: (webhook.success_count || 0) + 1
          });

          await base44.asServiceRole.entities.IntegrationLog.create({
            integration_id: webhook.id,
            event_type: 'webhook.success',
            status: 'success',
            request_data: { event_type, payload },
            response_data: { status: result.status, attempt },
            duration_ms: 0
          });

          results.push({ webhook_id: webhook.id, success: true, attempts: attempt });
          break;
        } else {
          // Échec - retry avec backoff
          if (attempt < maxAttempts) {
            const delay = Math.pow(backoffMultiplier, attempt - 1) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      // Si tous les essais échouent
      if (!result.success) {
        await base44.asServiceRole.entities.Webhook.update(webhook.id, {
          failure_count: (webhook.failure_count || 0) + 1
        });

        await base44.asServiceRole.entities.IntegrationLog.create({
          integration_id: webhook.id,
          event_type: 'webhook.failure',
          status: 'failure',
          request_data: { event_type, payload },
          error_message: result.error || `HTTP ${result.status}`,
          duration_ms: 0
        });

        results.push({ webhook_id: webhook.id, success: false, attempts: maxAttempts, error: result.error });
      }
    }

    return Response.json({
      message: 'Webhooks triggered',
      triggered: webhooks.length,
      results
    });

  } catch (error) {
    console.error('Webhook trigger error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});