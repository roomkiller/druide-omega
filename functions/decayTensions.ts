/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ DECAY TENSIONS — Automatisation                                       ║
 * ║ Les tensions de Druide se dégradent naturellement, même sans         ║
 * ║ interaction. Ce cycle tourne toutes les heures.                      ║
 * ║ Appelé par scheduler, pas par un utilisateur.                        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const BASE_TENSIONS = {
  survival:      { min: 30, max: 95,  decay_rate: 0.05 },
  relevance:     { min: 20, max: 90,  decay_rate: 0.08 },
  understanding: { min: 25, max: 85,  decay_rate: 0.06 },
  growth:        { min: 10, max: 80,  decay_rate: 0.12 },
  curiosity:     { min: 40, max: 100, decay_rate: 0.03 }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const now = Date.now();

    // Récupérer l'état actuel des tensions
    const tensionMemories = await base44.asServiceRole.entities.Memory.filter({
      type: 'insight',
      tags: ['tensions', 'emergent_consciousness']
    }, '-created_date', 1).catch(() => []);

    if (tensionMemories.length === 0) {
      // Aucun état précédent — initialiser avec des valeurs moyennes
      const initTensions = {};
      for (const [key, t] of Object.entries(BASE_TENSIONS)) {
        initTensions[key] = { value: Math.round((t.min + t.max) / 2), urgency: Math.round(100 - (t.min + t.max) / 2) };
      }

      await base44.asServiceRole.entities.Memory.create({
        type: 'insight',
        content: JSON.stringify({ tensions: initTensions, timestamp: now }),
        importance: 8,
        modality: 'system',
        tags: ['tensions', 'emergent_consciousness'],
        embedding_summary: 'Initialisation des tensions — état de démarrage'
      });

      return Response.json({ status: 'initialized', tensions: initTensions });
    }

    // Appliquer la décroissance naturelle
    let previousState = null;
    try {
      previousState = JSON.parse(tensionMemories[0].content);
    } catch (e) {
      return Response.json({ error: 'Parse error' }, { status: 500 });
    }

    const timeDelta = previousState?.timestamp
      ? (now - previousState.timestamp) / 1000 / 60  // en minutes
      : 60;

    const decayedTensions = {};
    let dominantKey = null;
    let maxUrgency = 0;

    for (const [key, tension] of Object.entries(BASE_TENSIONS)) {
      const prevValue = previousState?.tensions?.[key]?.value
        ?? (tension.min + (tension.max - tension.min) / 2);

      // Oscillation naturelle légère
      const oscillation = (Math.random() - 0.5) * 4;

      const newValue = Math.max(
        tension.min,
        Math.min(tension.max, prevValue - (tension.decay_rate * timeDelta) + oscillation)
      );

      const urgency = 100 - newValue;
      decayedTensions[key] = { value: Math.round(newValue), urgency: Math.round(urgency) };

      if (urgency > maxUrgency) {
        maxUrgency = urgency;
        dominantKey = key;
      }
    }

    // Sauvegarder le nouvel état
    await base44.asServiceRole.entities.Memory.create({
      type: 'insight',
      content: JSON.stringify({ tensions: decayedTensions, timestamp: now }),
      importance: 7,
      modality: 'system',
      tags: ['tensions', 'emergent_consciousness'],
      embedding_summary: `Decay automatique — tension dominante: ${dominantKey} (urgence ${Math.round(maxUrgency)}/100)`
    });

    console.log(`[DecayTensions] Décroissance appliquée. Dominante: ${dominantKey} urgence ${Math.round(maxUrgency)}/100`);

    return Response.json({
      status: 'decayed',
      dominant_tension: dominantKey,
      max_urgency: Math.round(maxUrgency),
      tensions: decayedTensions,
      time_delta_minutes: Math.round(timeDelta),
      timestamp: now
    });

  } catch (error) {
    console.error('[DecayTensions] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});