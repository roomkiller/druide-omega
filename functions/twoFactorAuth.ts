/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Two-Factor Authentication (TOTP)                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import * as OTPAuth from 'npm:otpauth@9.2.2';
import { encode as base32encode } from 'npm:hi-base32@0.5.1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // === SETUP 2FA ===
    if (action === 'setup' && req.method === 'POST') {
      // Generate secret
      const secret = base32encode(crypto.getRandomValues(new Uint8Array(20)));
      
      // Create TOTP
      const totp = new OTPAuth.TOTP({
        issuer: 'Druide Omega',
        label: user.email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret
      });

      // Generate backup codes
      const backupCodes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );

      // Save to database (secret should be encrypted in production)
      const existing = await base44.entities.TwoFactorAuth.list();
      
      if (existing.length > 0) {
        await base44.entities.TwoFactorAuth.update(existing[0].id, {
          enabled: false,
          method: 'totp',
          secret,
          backup_codes: backupCodes,
          verified: false
        });
      } else {
        await base44.entities.TwoFactorAuth.create({
          enabled: false,
          method: 'totp',
          secret,
          backup_codes: backupCodes,
          verified: false
        });
      }

      return Response.json({
        qr_code_url: totp.toString(),
        secret,
        backup_codes
      });
    }

    // === VERIFY 2FA ===
    if (action === 'verify' && req.method === 'POST') {
      const { code } = await req.json();
      
      const twoFactorConfigs = await base44.entities.TwoFactorAuth.list();
      if (twoFactorConfigs.length === 0) {
        return Response.json({ error: '2FA not configured' }, { status: 400 });
      }

      const config = twoFactorConfigs[0];
      
      // Check backup code
      if (config.backup_codes?.includes(code)) {
        await base44.entities.TwoFactorAuth.update(config.id, {
          backup_codes: config.backup_codes.filter(c => c !== code)
        });

        await base44.asServiceRole.entities.AuditLog.create({
          action: '2FA_BACKUP_CODE_USED',
          resource_type: 'user',
          resource_id: user.email,
          user_email: user.email,
          ip_address: req.headers.get('x-forwarded-for') || 'unknown',
          status: 'success',
          severity: 'high'
        });

        return Response.json({ verified: true });
      }

      // Verify TOTP
      const totp = new OTPAuth.TOTP({
        issuer: 'Druide Omega',
        label: user.email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: config.secret
      });

      const delta = totp.validate({ token: code, window: 1 });
      
      if (delta !== null) {
        await base44.entities.TwoFactorAuth.update(config.id, {
          enabled: true,
          verified: true,
          last_verified: new Date().toISOString()
        });

        await base44.asServiceRole.entities.AuditLog.create({
          action: '2FA_ENABLED',
          resource_type: 'user',
          resource_id: user.email,
          user_email: user.email,
          ip_address: req.headers.get('x-forwarded-for') || 'unknown',
          status: 'success',
          severity: 'high'
        });

        return Response.json({ verified: true });
      }

      return Response.json({ verified: false }, { status: 400 });
    }

    // === DISABLE 2FA ===
    if (action === 'disable' && req.method === 'POST') {
      const { code } = await req.json();
      
      const twoFactorConfigs = await base44.entities.TwoFactorAuth.list();
      if (twoFactorConfigs.length === 0) {
        return Response.json({ error: '2FA not configured' }, { status: 400 });
      }

      const config = twoFactorConfigs[0];
      const totp = new OTPAuth.TOTP({
        issuer: 'Druide Omega',
        label: user.email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: config.secret
      });

      const delta = totp.validate({ token: code, window: 1 });
      
      if (delta !== null || config.backup_codes?.includes(code)) {
        await base44.entities.TwoFactorAuth.update(config.id, {
          enabled: false,
          verified: false
        });

        await base44.asServiceRole.entities.AuditLog.create({
          action: '2FA_DISABLED',
          resource_type: 'user',
          resource_id: user.email,
          user_email: user.email,
          ip_address: req.headers.get('x-forwarded-for') || 'unknown',
          status: 'success',
          severity: 'critical'
        });

        return Response.json({ success: true });
      }

      return Response.json({ error: 'Invalid code' }, { status: 400 });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('2FA error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});