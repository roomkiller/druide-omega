import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Use service role — this runs as a scheduled automation (no authenticated user)
    // Filter importance > 7 at the DB level and cap at 50 to avoid timeouts
    const importantMemories = await base44.asServiceRole.entities.Memory.filter(
      { importance: { $gt: 7 } },
      '-importance',
      50
    );

    if (importantMemories.length === 0) {
      return Response.json({ optimized: 0, message: 'Aucune mémoire importante à optimiser' });
    }

    let optimizedCount = 0;
    const now = new Date();

    for (const memory of importantMemories) {
      const recallScore = calculateRecallScore(memory);
      const updates = {
        last_accessed: now.toISOString(),
        access_count: (memory.access_count || 0) + 1,
        confidence_score: Math.min(100, recallScore + (memory.confidence_score || 80))
      };

      if (recallScore < 70) {
        updates.consolidation_mechanism = 'renforcée';
        updates.decay_rate = Math.max(0, (memory.decay_rate || 0.1) - 0.05);
      }

      await base44.asServiceRole.entities.Memory.update(memory.id, updates);
      optimizedCount++;
    }

    return Response.json({
      optimized: optimizedCount,
      total: importantMemories.length,
      message: `${optimizedCount} mémoires importantes optimisées pour meilleur rappel`,
      timestamp: now.toISOString()
    });
  } catch (error) {
    console.error('Memory recall optimization error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function calculateRecallScore(memory) {
  let score = memory.confidence_score || 80;
  
  // Bonus pour accès récent
  if (memory.last_accessed) {
    const daysSinceAccess = Math.floor((new Date() - new Date(memory.last_accessed)) / (1000 * 60 * 60 * 24));
    if (daysSinceAccess < 7) score += 15;
    else if (daysSinceAccess < 14) score += 10;
  }
  
  // Bonus pour consolidation
  if (memory.last_consolidation) {
    score += 10;
  }
  
  // Bonus basé sur importance
  if (memory.importance > 8) score += 15;
  
  // Pénalité pour ancien decay rate élevé
  if (memory.decay_rate > 0.15) score -= 20;
  
  return Math.min(100, Math.max(0, score));
}