/**
 * Apprentissage de la patience d'écoute.
 *
 * Chaque tour de parole laisse un verdict : ai-je attendu trop peu (l'autre
 * reprend la parole pendant mon attente), trop longtemps (sa voix s'était
 * éteinte bien avant), ou juste ? Ces verdicts déplacent un coefficient par
 * palier d'écoute, conservé dans ListeningCalibration. Druide devient donc
 * progressivement plus tolérant aux silences là où il coupait, et plus vif là
 * où il faisait attendre.
 */

import { base44 } from '@/api/base44Client';

const MIN_FACTOR = 0.4;
const MAX_FACTOR = 1.8;

// Le gain d'écoute est plus fort que la reprise de vivacité : mieux vaut
// tendre vers la patience, l'erreur de couper la parole coûte davantage.
const STEP = { trop_court: 0.16, trop_long: 0.07, juste: 0.02 };

/** Coefficients appris, par palier. */
export async function loadListeningCalibration() {
  const rows = await base44.entities.ListeningCalibration.list('-updated_date', 20);
  const byTier = {};
  for (const row of rows) {
    if (byTier[row.tier] === undefined) byTier[row.tier] = row.factor ?? 1;
  }
  return byTier;
}

/** Applique le coefficient appris au délai de base du palier. */
export function applyLearnedPatience(delayMs, tier, calibration) {
  const factor = calibration?.[tier] ?? 1;
  return Math.round(delayMs * factor);
}

function nextFactor(current, outcome) {
  const step = STEP[outcome] ?? 0;
  // Attendre trop peu allonge l'écoute ; attendre trop longtemps la raccourcit.
  const delta = outcome === 'trop_court' ? step : outcome === 'trop_long' ? -step : step / 2;
  return Math.min(MAX_FACTOR, Math.max(MIN_FACTOR, (current ?? 1) + delta));
}

/**
 * Enregistre un verdict d'écoute et fait glisser le coefficient du palier.
 * Non bloquant : un échec de persistance ne doit jamais gêner la conversation.
 */
export async function recordListeningOutcome({ tier, outcome, waitedMs }) {
  const existing = await base44.entities.ListeningCalibration.filter({ tier }, '-updated_date', 1);
  const row = existing[0];
  const now = new Date().toISOString();

  if (!row) {
    return base44.entities.ListeningCalibration.create({
      tier,
      factor: nextFactor(1, outcome),
      observations: 1,
      too_long: outcome === 'trop_long' ? 1 : 0,
      too_short: outcome === 'trop_court' ? 1 : 0,
      just_right: outcome === 'juste' ? 1 : 0,
      avg_waited_ms: waitedMs || 0,
      last_outcome: outcome,
      last_observed: now
    });
  }

  const observations = (row.observations || 0) + 1;
  const avg = ((row.avg_waited_ms || 0) * (observations - 1) + (waitedMs || 0)) / observations;

  return base44.entities.ListeningCalibration.update(row.id, {
    factor: nextFactor(row.factor, outcome),
    observations,
    too_long: (row.too_long || 0) + (outcome === 'trop_long' ? 1 : 0),
    too_short: (row.too_short || 0) + (outcome === 'trop_court' ? 1 : 0),
    just_right: (row.just_right || 0) + (outcome === 'juste' ? 1 : 0),
    avg_waited_ms: Math.round(avg),
    last_outcome: outcome,
    last_observed: now
  });
}