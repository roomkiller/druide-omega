/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Advanced Rate Limiter per User                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// In-memory store (use Redis in production)
const rateLimitStore = new Map();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { user_id, endpoint, limit_per_minute = 60, limit_per_hour = 1000 } = await req.json();

    if (!user_id || !endpoint) {
      return Response.json({ error: 'user_id and endpoint required' }, { status: 400 });
    }

    const now = Date.now();
    const minuteKey = `${user_id}:${endpoint}:minute`;
    const hourKey = `${user_id}:${endpoint}:hour`;

    // Clean old entries
    for (const [key, data] of rateLimitStore.entries()) {
      if (now - data.timestamp > 3600000) { // 1 hour
        rateLimitStore.delete(key);
      }
    }

    // Get current counts
    const minuteData = rateLimitStore.get(minuteKey) || { count: 0, timestamp: now };
    const hourData = rateLimitStore.get(hourKey) || { count: 0, timestamp: now };

    // Reset if window expired
    if (now - minuteData.timestamp > 60000) {
      minuteData.count = 0;
      minuteData.timestamp = now;
    }

    if (now - hourData.timestamp > 3600000) {
      hourData.count = 0;
      hourData.timestamp = now;
    }

    // Check limits
    if (minuteData.count >= limit_per_minute) {
      await base44.asServiceRole.entities.AuditLog.create({
        action: 'RATE_LIMIT_EXCEEDED',
        resource_type: 'api_key',
        resource_id: user_id,
        user_email: user_id,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        details: { endpoint, limit: 'per_minute', count: minuteData.count },
        status: 'blocked',
        severity: 'high'
      });

      return Response.json({
        allowed: false,
        retry_after: 60 - Math.floor((now - minuteData.timestamp) / 1000),
        limit: limit_per_minute,
        remaining: 0
      }, { status: 429 });
    }

    if (hourData.count >= limit_per_hour) {
      await base44.asServiceRole.entities.AuditLog.create({
        action: 'RATE_LIMIT_EXCEEDED',
        resource_type: 'api_key',
        resource_id: user_id,
        user_email: user_id,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        details: { endpoint, limit: 'per_hour', count: hourData.count },
        status: 'blocked',
        severity: 'critical'
      });

      return Response.json({
        allowed: false,
        retry_after: 3600 - Math.floor((now - hourData.timestamp) / 1000),
        limit: limit_per_hour,
        remaining: 0
      }, { status: 429 });
    }

    // Increment counts
    minuteData.count++;
    hourData.count++;
    rateLimitStore.set(minuteKey, minuteData);
    rateLimitStore.set(hourKey, hourData);

    return Response.json({
      allowed: true,
      limit_minute: limit_per_minute,
      remaining_minute: limit_per_minute - minuteData.count,
      limit_hour: limit_per_hour,
      remaining_hour: limit_per_hour - hourData.count
    });

  } catch (error) {
    console.error('Rate limiter error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});