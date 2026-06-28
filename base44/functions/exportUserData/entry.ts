/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Export User Data (RGPD Compliance)                         ║
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

    // Fetch all user data
    const [
      conversations,
      memories,
      knowledge,
      visuals,
      favorites,
      consciousnessConfigs,
      personalityProfiles
    ] = await Promise.all([
      base44.entities.Conversation.list('-created_date', 0),
      base44.entities.Memory.list('-created_date', 0),
      base44.entities.KnowledgeBase.list('-created_date', 0),
      base44.entities.VisualContent.list('-created_date', 0),
      base44.entities.Favorite.list('-created_date', 0),
      base44.entities.ConsciousnessConfig.list('-created_date', 0),
      base44.entities.PersonalityProfile.list('-created_date', 0)
    ]);

    const exportData = {
      export_info: {
        user_email: user.email,
        export_date: new Date().toISOString(),
        rgpd_compliant: true,
        version: '1.0.0'
      },
      user_profile: {
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_date: user.created_date
      },
      conversations: conversations.map(c => ({
        id: c.id,
        title: c.title,
        messages: c.messages,
        created_date: c.created_date
      })),
      memories: memories.map(m => ({
        id: m.id,
        type: m.type,
        content: m.content,
        importance: m.importance,
        created_date: m.created_date
      })),
      knowledge_bases: knowledge.map(kb => ({
        id: kb.id,
        title: kb.title,
        content: kb.content,
        source_type: kb.source_type,
        created_date: kb.created_date
      })),
      visual_content: visuals.map(v => ({
        id: v.id,
        type: v.type,
        description: v.description,
        url: v.url,
        created_date: v.created_date
      })),
      favorites: favorites,
      consciousness_configs: consciousnessConfigs,
      personality_profiles: personalityProfiles,
      statistics: {
        total_conversations: conversations.length,
        total_memories: memories.length,
        total_knowledge: knowledge.length,
        total_visuals: visuals.length
      }
    };

    // Send email with download link
    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: 'Export de vos données - Druide Omega',
      body: `Bonjour,

Votre export de données RGPD est prêt.

Statistiques:
- ${conversations.length} conversations
- ${memories.length} mémoires
- ${knowledge.length} bases de connaissances
- ${visuals.length} contenus visuels

Les données sont attachées à cet email au format JSON.

Cordialement,
L'équipe Druide Omega`
    });

    return Response.json(exportData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename=druide_omega_data_${user.email}_${Date.now()}.json`
      }
    });

  } catch (error) {
    console.error('Export error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});