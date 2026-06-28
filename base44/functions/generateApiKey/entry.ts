/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Generate Secure API Key                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import { randomBytes } from 'node:crypto';

function generateSecureApiKey() {
  const prefix = 'do_'; // druide omega
  const random = randomBytes(32).toString('hex');
  return `${prefix}${random}`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, permissions, expires_in_days } = await req.json();

    if (!name || !permissions || !Array.isArray(permissions)) {
      return Response.json({ 
        error: 'name and permissions (array) required' 
      }, { status: 400 });
    }

    const apiKey = generateSecureApiKey();
    
    const expiresAt = expires_in_days 
      ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const newKey = await base44.entities.APIKey.create({
      name,
      key: apiKey,
      permissions,
      rate_limit: {
        requests_per_minute: 60,
        requests_per_hour: 1000
      },
      active: true,
      expires_at: expiresAt,
      usage_count: 0
    });

    return Response.json({ 
      data: {
        id: newKey.id,
        name: newKey.name,
        key: apiKey, // Montrer UNE SEULE FOIS
        permissions: newKey.permissions,
        expires_at: expiresAt,
        created_at: newKey.created_date
      },
      warning: 'Save this API key now. You will not be able to see it again!'
    }, { status: 201 });

  } catch (error) {
    console.error('Generate API key error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});