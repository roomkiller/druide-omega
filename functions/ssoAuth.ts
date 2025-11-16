/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - SSO Authentication (Azure AD, Okta, Google)               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { provider, token, user_info } = await req.json();

    if (!provider || !token) {
      return Response.json({ error: 'provider and token required' }, { status: 400 });
    }

    let verifiedUser = null;

    // === AZURE AD ===
    if (provider === 'azure') {
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Azure AD token validation failed');
      }
      
      verifiedUser = await response.json();
    }

    // === OKTA ===
    else if (provider === 'okta') {
      const oktaDomain = Deno.env.get('OKTA_DOMAIN');
      const response = await fetch(`${oktaDomain}/oauth2/v1/userinfo`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Okta token validation failed');
      }
      
      verifiedUser = await response.json();
    }

    // === GOOGLE ===
    else if (provider === 'google') {
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
      
      if (!response.ok) {
        throw new Error('Google token validation failed');
      }
      
      verifiedUser = await response.json();
    }

    else {
      return Response.json({ error: 'Invalid SSO provider' }, { status: 400 });
    }

    // Log audit
    await base44.asServiceRole.entities.AuditLog.create({
      action: 'SSO_LOGIN',
      resource_type: 'user',
      resource_id: verifiedUser.email,
      user_email: verifiedUser.email,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent'),
      details: { provider, email: verifiedUser.email },
      status: 'success',
      severity: 'medium'
    });

    return Response.json({
      success: true,
      user: {
        email: verifiedUser.email || verifiedUser.mail,
        name: verifiedUser.displayName || verifiedUser.name,
        provider
      }
    });

  } catch (error) {
    console.error('SSO auth error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});