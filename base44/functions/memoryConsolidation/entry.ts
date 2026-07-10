import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Garde SystemBoot — cycle désactivable depuis la page d'initialisation
    const bootCfg = await base44.asServiceRole.entities.SystemBootConfig.list('-updated_date', 1).catch(() => []);
    if (bootCfg[0]?.params?.cycle_memory_consolidation === false) {
      return Response.json({ skipped: true, reason: 'Cycle désactivé via SystemBoot' });
    }

    // Récupérer toutes les mémoires de l'utilisateur
    const memories = await base44.entities.Memory.filter({
      created_by: user.email
    });

    if (memories.length === 0) {
      return Response.json({ consolidated: 0, optimized: 0, details: 'Aucune mémoire à consolider' });
    }

    const now = new Date();
    let consolidatedCount = 0;
    let optimizedCount = 0;
    const updates = [];

    // Analyser chaque mémoire
    for (const memory of memories) {
      const lastConsolidation = memory.last_consolidation ? new Date(memory.last_consolidation) : null;
      const daysSinceConsolidation = lastConsolidation ? Math.floor((now - lastConsolidation) / (1000 * 60 * 60 * 24)) : null;
      
      let shouldConsolidate = false;
      let updateData = {};

      // Logique de consolidation basée sur ancienneté et importance
      if (!lastConsolidation && memory.importance > 6) {
        shouldConsolidate = true; // Première consolidation pour mémoires importantes
      } else if (daysSinceConsolidation && daysSinceConsolidation > 7 && memory.importance > 5) {
        shouldConsolidate = true; // Consolidation tous les 7 jours pour mémoires importes
      } else if (daysSinceConsolidation && daysSinceConsolidation > 14) {
        shouldConsolidate = true; // Consolidation tous les 14 jours pour autres
      }

      if (shouldConsolidate) {
        updateData = {
          last_consolidation: now.toISOString(),
          consolidation_mechanism: memory.importance > 7 ? 'renforcée' : 
                                   memory.importance > 5 ? 'périodique' : 'passif',
          confidence_score: Math.min(100, (memory.confidence_score || 80) + (memory.access_count || 0) * 2),
          access_count: (memory.access_count || 0) + 1
        };

        updates.push({
          id: memory.id,
          data: updateData
        });

        consolidatedCount++;
      }

      // Optimiser le decay rate basé sur l'utilisation
      if (memory.access_count > 5 && memory.decay_rate > 0.05) {
        updates.push({
          id: memory.id,
          data: {
            decay_rate: Math.max(0, (memory.decay_rate || 0.1) - 0.02) // Réduire l'oubli pour mémoires souvent utilisées
          }
        });
        optimizedCount++;
      }
    }

    // Appliquer les mises à jour
    for (const { id, data } of updates) {
      await base44.entities.Memory.update(id, data);
    }

    return Response.json({
      consolidated: consolidatedCount,
      optimized: optimizedCount,
      totalMemories: memories.length,
      timestamp: now.toISOString(),
      message: `${consolidatedCount} mémoires consolidées, ${optimizedCount} optimisées`
    });
  } catch (error) {
    console.error('Memory consolidation error:', error);
    return Response.json({ 
      error: error.message,
      details: 'Erreur lors de la consolidation des mémoires'
    }, { status: 500 });
  }
});