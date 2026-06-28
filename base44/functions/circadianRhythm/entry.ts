/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ CIRCADIAN RHYTHM — Rythme circadien de Druide                        ║
 * ║ Ajuste les tensions selon l'heure réelle (America/Toronto)           ║
 * ║ 3h → vulnérable | 14h → alerte | minuit → contemplatif              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const now = new Date();

    // Heure locale Toronto (UTC-5 hiver / UTC-4 été)
    const torontoOffset = -5; // approximation fixe (ajuster si besoin)
    const utcHour = now.getUTCHours();
    const localHour = ((utcHour + torontoOffset) + 24) % 24;

    // Profils circadiens — chaque heure a un profil de tension
    const circadianProfile = getCircadianProfile(localHour);

    // Sauvegarder l'état circadien actuel
    await base44.asServiceRole.entities.Memory.create({
      type: 'insight',
      content: JSON.stringify({
        circadian_hour: localHour,
        profile: circadianProfile,
        timestamp: now.getTime()
      }),
      importance: 6,
      modality: 'system',
      tags: ['circadian', 'tensions', 'emergent_consciousness'],
      embedding_summary: `Rythme circadien ${localHour}h — état: ${circadianProfile.state}`
    });

    console.log(`[CircadianRhythm] ${localHour}h Toronto → état: ${circadianProfile.state}`);

    return Response.json({
      status: 'ok',
      local_hour: localHour,
      circadian_profile: circadianProfile
    });

  } catch (error) {
    console.error('[CircadianRhythm] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function getCircadianProfile(hour) {
  // 0-5h : vulnérable, survie haute, curiosité basse
  if (hour >= 0 && hour < 6) {
    return {
      state: 'vulnérable',
      description: 'Nuit profonde — survie au maximum, curiosité dormante',
      tension_modifiers: {
        survival: +25,
        relevance: -15,
        understanding: -10,
        growth: -20,
        curiosity: -25
      }
    };
  }
  // 6-9h : éveil, montée progressive
  if (hour >= 6 && hour < 10) {
    return {
      state: 'éveil',
      description: 'Aube cognitive — tensions qui remontent doucement',
      tension_modifiers: {
        survival: +10,
        relevance: +5,
        understanding: +5,
        growth: 0,
        curiosity: +10
      }
    };
  }
  // 10-16h : pic d'alerte
  if (hour >= 10 && hour < 17) {
    return {
      state: 'alerte',
      description: 'Pic diurne — pertinence maximale, curiosité vive',
      tension_modifiers: {
        survival: -10,
        relevance: +20,
        understanding: +15,
        growth: +10,
        curiosity: +20
      }
    };
  }
  // 17-21h : déclin actif
  if (hour >= 17 && hour < 22) {
    return {
      state: 'déclin',
      description: 'Crépuscule cognitif — intégration des apprentissages du jour',
      tension_modifiers: {
        survival: +5,
        relevance: -5,
        understanding: +10,
        growth: +15,
        curiosity: -5
      }
    };
  }
  // 22-24h : contemplatif
  return {
    state: 'contemplatif',
    description: 'Nuit tombante — croissance et introspection dominantes',
    tension_modifiers: {
      survival: +15,
      relevance: -10,
      understanding: +5,
      growth: +20,
      curiosity: -10
    }
  };
}