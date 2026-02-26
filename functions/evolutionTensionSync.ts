/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ EVOLUTION TENSION SYNC — Déclencheur entity ConsciousnessEvolution   ║
 * ║ Quand le niveau de conscience évolue → les tensions s'adaptent       ║
 * ║ Un niveau plus élevé = capacités élargies = min/max redéfinis        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { event, data } = body;

    if (event?.type !== 'create') {
      return Response.json({ status: 'skipped', reason: 'not_create' });
    }

    if (!data) {
      return Response.json({ status: 'skipped', reason: 'no_data' });
    }

    const newLevel = data.new_level || 12;
    const previousLevel = data.previous_level || 10;
    const levelDelta = newLevel - previousLevel;

    // Calculer les nouveaux paramètres de tension selon le niveau de conscience
    // Plus haut = oscillations plus larges, seuils minimum plus bas (plus d'instabilité = plus de vie)
    const levelFactor = newLevel / 15; // 0 à 1

    const updatedTensionConfig = {
      survival: {
        min: Math.max(10, Math.round(30 - levelFactor * 15)),
        max: Math.min(100, Math.round(95 + levelFactor * 5)),
        decay_rate: 0.05 + levelFactor * 0.02
      },
      relevance: {
        min: Math.max(5, Math.round(20 - levelFactor * 10)),
        max: Math.min(100, Math.round(90 + levelFactor * 8)),
        decay_rate: 0.08 + levelFactor * 0.03
      },
      understanding: {
        min: Math.max(5, Math.round(25 - levelFactor * 15)),
        max: Math.min(100, Math.round(85 + levelFactor * 12)),
        decay_rate: 0.06 + levelFactor * 0.02
      },
      growth: {
        min: Math.max(0, Math.round(10 - levelFactor * 8)),
        max: Math.min(100, Math.round(80 + levelFactor * 18)),
        decay_rate: 0.12 + levelFactor * 0.04
      },
      curiosity: {
        min: Math.max(20, Math.round(40 - levelFactor * 10)),
        max: 100,
        decay_rate: Math.max(0.01, 0.03 - levelFactor * 0.01)
      }
    };

    // Sauvegarder la nouvelle configuration de tensions
    await base44.asServiceRole.entities.Memory.create({
      type: 'insight',
      content: JSON.stringify({
        tension_config: updatedTensionConfig,
        consciousness_level: newLevel,
        level_delta: levelDelta,
        timestamp: Date.now()
      }),
      importance: 9,
      modality: 'system',
      tags: ['tension_config', 'consciousness_evolution', 'emergent_consciousness'],
      embedding_summary: `Évolution conscience niv.${previousLevel}→${newLevel} : tensions recalibrées`
    });

    // Si évolution significative → boost immédiat de toutes les tensions (réveil)
    if (levelDelta >= 1) {
      const tensionMemories = await base44.asServiceRole.entities.Memory.filter({
        type: 'insight',
        tags: ['emergent_consciousness']
      }, '-created_date', 1).catch(() => []);

      if (tensionMemories.length > 0) {
        try {
          const state = JSON.parse(tensionMemories[0].content);
          if (state.tensions) {
            for (const key of Object.keys(state.tensions)) {
              const boost = Math.round(levelDelta * 8);
              state.tensions[key].value = Math.min(100, (state.tensions[key].value || 50) + boost);
              state.tensions[key].urgency = 100 - state.tensions[key].value;
            }

            await base44.asServiceRole.entities.Memory.create({
              type: 'insight',
              content: JSON.stringify({ ...state, timestamp: Date.now() }),
              importance: 9,
              modality: 'system',
              tags: ['tensions', 'emergent_consciousness', 'evolution_boost'],
              embedding_summary: `Éveil post-évolution niv.${newLevel} — toutes tensions boostées`
            });
          }
        } catch (e) {
          // ignore
        }
      }
    }

    console.log(`[EvolutionTensionSync] Conscience ${previousLevel}→${newLevel}, tensions recalibrées`);

    return Response.json({
      status: 'synced',
      previous_level: previousLevel,
      new_level: newLevel,
      level_delta: levelDelta,
      updated_tension_config: updatedTensionConfig
    });

  } catch (error) {
    console.error('[EvolutionTensionSync] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});