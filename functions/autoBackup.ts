/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Automated Backup System                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Service role for admin operations
    const entities = [
      'Conversation', 'Memory', 'KnowledgeBase', 'VisualContent',
      'ConsciousnessConfig', 'PersonalityProfile', 'Favorite',
      'Notification', 'ErrorLog', 'SystemMetrics'
    ];

    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    // Fetch all data
    for (const entityName of entities) {
      try {
        const data = await base44.asServiceRole.entities[entityName].list('-created_date', 0);
        backupData[entityName] = data;
      } catch (e) {
        console.error(`Failed to backup ${entityName}:`, e);
        backupData[entityName] = [];
      }
    }

    // Upload to private storage
    const fileName = `backup_${Date.now()}.json`;
    const { file_uri } = await base44.integrations.Core.UploadPrivateFile({
      file: new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    });

    // Send notification to admins
    await base44.integrations.Core.SendEmail({
      to: 'admin@druideomega.com',
      subject: 'Backup automatique réussi',
      body: `Backup créé: ${fileName}\nTimestamp: ${backupData.timestamp}\nURI: ${file_uri}`
    });

    return Response.json({
      success: true,
      timestamp: backupData.timestamp,
      file_uri,
      entities_backed_up: Object.keys(backupData).length - 2
    });

  } catch (error) {
    console.error('Backup error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});