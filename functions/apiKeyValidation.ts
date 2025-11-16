/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - API Key Validation & Rate Limiting                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { api_key, operation } = await req.json();

    if (!api_key) {
      return Response.json({ 
        valid: false, 
        error: 'API key required' 
      }, { status: 401 });
    }

    // Trouver la clé API
    const apiKeys = await base44.asServiceRole.entities.APIKey.filter({ 
      key: api_key,
      active: true 
    });

    if (apiKeys.length === 0) {
      return Response.json({ 
        valid: false, 
        error: 'Invalid API key' 
      }, { status: 401 });
    }

    const apiKey = apiKeys[0];

    // Vérifier expiration
    if (apiKey.expires_at) {
      const expiryDate = new Date(apiKey.expires_at);
      if (expiryDate < new Date()) {
        return Response.json({ 
          valid: false, 
          error: 'API key expired' 
        }, { status: 401 });
      }
    }

    // Vérifier permissions
    if (operation && !apiKey.permissions.includes(operation) && !apiKey.permissions.includes('admin')) {
      return Response.json({ 
        valid: false, 
        error: 'Insufficient permissions' 
      }, { status: 403 });
    }

    // Rate Limiting
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    const oneHourAgo = new Date(now.getTime() - 3600000);

    // Compter les requêtes récentes (simulation - en prod utiliser Redis)
    const recentLogs = await base44.asServiceRole.entities.IntegrationLog.filter({
      integration_id: apiKey.id,
      created_date: { $gte: oneHourAgo.toISOString() }
    });

    const requestsLastMinute = recentLogs.filter(log => 
      new Date(log.created_date) >= oneMinuteAgo
    ).length;

    const requestsLastHour = recentLogs.length;

    // Vérifier limites
    const rateLimitExceeded = 
      requestsLastMinute >= apiKey.rate_limit.requests_per_minute ||
      requestsLastHour >= apiKey.rate_limit.requests_per_hour;

    if (rateLimitExceeded) {
      return Response.json({ 
        valid: false, 
        error: 'Rate limit exceeded',
        rate_limit: {
          requests_per_minute: apiKey.rate_limit.requests_per_minute,
          requests_per_hour: apiKey.rate_limit.requests_per_hour,
          current_minute: requestsLastMinute,
          current_hour: requestsLastHour
        }
      }, { status: 429 });
    }

    // Mettre à jour statistiques
    await base44.asServiceRole.entities.APIKey.update(apiKey.id, {
      last_used: now.toISOString(),
      usage_count: (apiKey.usage_count || 0) + 1
    });

    return Response.json({ 
      valid: true,
      user_email: apiKey.created_by,
      permissions: apiKey.permissions,
      rate_limit: {
        remaining_minute: apiKey.rate_limit.requests_per_minute - requestsLastMinute - 1,
        remaining_hour: apiKey.rate_limit.requests_per_hour - requestsLastHour - 1
      }
    });

  } catch (error) {
    console.error('API Key validation error:', error);
    return Response.json({ 
      valid: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
});