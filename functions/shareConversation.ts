/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Share Conversation Function                                ║
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

    const { conversationId, expiresInDays = 7, password } = await req.json();

    // Fetch conversation
    const conversations = await base44.entities.Conversation.list();
    const conversation = conversations.find(c => c.id === conversationId);

    if (!conversation) {
      return Response.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Generate unique share token
    const shareToken = crypto.randomUUID();

    // Calculate expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Hash password if provided
    let passwordHash = null;
    if (password) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      passwordHash = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }

    // Create shared conversation
    const shared = await base44.entities.SharedConversation.create({
      conversation_id: conversationId,
      share_token: shareToken,
      title: conversation.title,
      messages: conversation.messages,
      expires_at: expiresAt.toISOString(),
      password_protected: !!password,
      password_hash: passwordHash,
      view_count: 0,
      active: true
    });

    const shareUrl = `${new URL(req.url).origin}/shared/${shareToken}`;

    return Response.json({
      success: true,
      share_url: shareUrl,
      expires_at: expiresAt.toISOString(),
      password_protected: !!password
    });

  } catch (error) {
    console.error('Share error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});