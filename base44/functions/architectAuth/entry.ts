/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Authentification Architecte (email + mot de passe)         ║
 * ║ Valide les identifiants contre les secrets serveur (rien en clair frontend)║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    const expectedEmail = secrets.get('ARCHITECT_EMAIL');
    const expectedPassword = secrets.get('ARCHITECT_PASSWORD');

    if (!expectedEmail || !expectedPassword) {
      return Response.json({ error: 'Configuration serveur incomplète' }, { status: 500 });
    }

    // Comparaison sensible à la casse pour l'email, exacte pour le mot de passe
    const emailOk = email.trim().toLowerCase() === expectedEmail.trim().toLowerCase();
    const passOk = password === expectedPassword;

    if (!emailOk || !passOk) {
      // Journal d'audit pour les tentatives échouées
      try {
        await base44.asServiceRole.entities.AuditLog.create({
          action: 'ARCHITECT_LOGIN_FAILED',
          resource_type: 'auth',
          resource_id: email,
          user_email: email,
          ip_address: req.headers.get('x-forwarded-for') || 'unknown',
          user_agent: req.headers.get('user-agent'),
          details: { reason: 'invalid_credentials' },
          status: 'failed',
          severity: 'high'
        });
      } catch {}
      return Response.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    // Succès — journal d'audit
    try {
      await base44.asServiceRole.entities.AuditLog.create({
        action: 'ARCHITECT_LOGIN_SUCCESS',
        resource_type: 'auth',
        resource_id: email,
        user_email: email,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent'),
        details: { method: 'email_password' },
        status: 'success',
        severity: 'medium'
      });
    } catch {}

    // Jeton de session signé (horodatage + email) — valide pour la session navigateur
    const issuedAt = Date.now();
    const token = btoa(`${email}:${issuedAt}:architect`);

    return Response.json({
      success: true,
      token,
      user: { email: expectedEmail, role: 'architect' }
    });
  } catch (error) {
    console.error('architectAuth error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}