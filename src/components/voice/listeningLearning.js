/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROUTINE D'APPRENTISSAGE DE L'ÉCOUTE
 *
 * La patience de base (listeningPatience.js) décide combien de temps se taire.
 * Cette routine observe ensuite ce qui s'est réellement passé et corrige le
 * palier concerné, par petites touches :
 *
 *   trop_court → l'utilisateur a repris la parole pendant l'attente
 *                → Druide écoutera un peu plus longtemps ce palier
 *   trop_long  → la voix s'était éteinte bien avant la fin de l'attente
 *                → Druide répondra plus vite sur ce palier
 *   juste      → l'attente s'est écoulée proprement → le coefficient se stabilise
 *
 * Entièrement local et déterministe : aucun appel LLM, aucun crédit.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { base44 } from "@/api/base44Client";

const MIN_FACTOR = 0.5;
const MAX_FACTOR = 1.6;
const STEP = 0.06;      // correction par observation — volontairement lente
const HARD_CAP_MS = 6000; // la réactivité reste prioritaire

/** Lit les coefficients appris, indexés par palier. */
export async function loadListeningCalibration() {
  const records = await base44.entities.ListeningCalibration.list('-last_observed', 20);
  const byTier = {};
  for (const r of records) {
    if (byTier[r.tier] === undefined) byTier[r.tier] = r;
  }
  return byTier;
}

/** Applique le coefficient appris au délai calculé par la patience de base. */
export function applyCalibration(delayMs, tier, calibration) {
  const factor = calibration?.[tier]?.factor ?? 1;
  return Math.min(HARD_CAP_MS, Math.max(600, Math.round(delayMs * factor)));
}

/**
 * Verdict sur un tour d'écoute.
 * @param {number} plannedMs délai que Druide s'était donné
 * @param {number} waitedMs  temps réellement écoulé avant de parler
 * @param {boolean} userResumed l'utilisateur a repris la parole pendant l'attente
 */
export function judgeListening(plannedMs, waitedMs, userResumed) {
  if (userResumed) return 'trop_court';
  if (waitedMs < plannedMs * 0.5) return 'trop_long';
  return 'juste';
}

const nextFactor = (current, outcome) => {
  const base = current ?? 1;
  const moved = outcome === 'trop_court' ? base + STEP
    : outcome === 'trop_long' ? base - STEP
    : base + (1 - base) * 0.2; // « juste » ramène doucement vers l'équilibre
  return Math.min(MAX_FACTOR, Math.max(MIN_FACTOR, Number(moved.toFixed(3))));
};

/**
 * Enregistre l'observation et fait évoluer le coefficient du palier.
 * Non bloquant : appelé après que Druide a pris la parole.
 */
export async function recordListeningOutcome({ tier, plannedMs, waitedMs, userResumed }) {
  const outcome = judgeListening(plannedMs, waitedMs, userResumed);

  const existing = (await base44.entities.ListeningCalibration.filter({ tier }, '-last_observed', 1))[0];

  const observations = (existing?.observations || 0) + 1;
  const payload = {
    tier,
    factor: nextFactor(existing?.factor, outcome),
    observations,
    too_long: (existing?.too_long || 0) + (outcome === 'trop_long' ? 1 : 0),
    too_short: (existing?.too_short || 0) + (outcome === 'trop_court' ? 1 : 0),
    just_right: (existing?.just_right || 0) + (outcome === 'juste' ? 1 : 0),
    avg_waited_ms: Math.round(((existing?.avg_waited_ms || 0) * (observations - 1) + waitedMs) / observations),
    last_outcome: outcome,
    last_observed: new Date().toISOString()
  };

  if (existing) {
    await base44.entities.ListeningCalibration.update(existing.id, payload);
  } else {
    await base44.entities.ListeningCalibration.create(payload);
  }

  return { outcome, factor: payload.factor };
}