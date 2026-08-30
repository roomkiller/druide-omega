/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Indice de bien-être (module partagé)                       ║
 * ║ Source unique de vérité: utilisé par wellBeingModule et cognitiveCore.    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export function computeWellBeingIndex(qualityMetrics, emotionalMetrics) {
  const avgRating = qualityMetrics.avgRating || 0;
  const helpfulRatio = qualityMetrics.helpfulRatio || 0;
  const interactionCount = qualityMetrics.interactionCount || 0;

  const qualityScore = Math.min(100, (avgRating / 5) * 60 + helpfulRatio * 40);

  const positiveRatio = emotionalMetrics.positiveRatio || 0.5;
  const avgIntensity = emotionalMetrics.avgIntensity || 5;
  const emotionalStability = emotionalMetrics.stability || 0.5;

  const intensityBalance = 1 - Math.abs(avgIntensity - 5.5) / 5.5;
  const emotionalScore = Math.min(100, positiveRatio * 50 + intensityBalance * 30 + emotionalStability * 20);

  const wellBeing = Math.round(qualityScore * 0.6 + emotionalScore * 0.4);

  return {
    wellBeing,
    qualityScore: Math.round(qualityScore),
    emotionalScore: Math.round(emotionalScore),
    interactionCount
  };
}

export function computeAcceptanceThreshold(wellBeing) {
  return Math.max(24, Math.min(80, 80 - (wellBeing / 100) * 56));
}

/**
 * Lit les données réelles (feedbacks + émotions) et retourne les métriques
 * brutes nécessaires au calcul du bien-être.
 */
export async function gatherWellBeingMetrics(base44) {
  const [userFeedbacks, reasoningFeedbacks, emotionalResponses] = await Promise.all([
    base44.asServiceRole.entities.UserFeedback.list('-created_date', 20).catch(() => []),
    base44.asServiceRole.entities.ReasoningFeedback.list('-created_date', 20).catch(() => []),
    base44.asServiceRole.entities.EmotionalResponse.list('-timestamp', 20).catch(() => [])
  ]);

  const allRatings = [
    ...userFeedbacks.map(f => f.rating).filter(r => typeof r === 'number'),
    ...reasoningFeedbacks.map(f => f.user_rating).filter(r => typeof r === 'number')
  ];
  const avgRating = allRatings.length > 0
    ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
    : 0;

  const helpfulCount = [
    ...userFeedbacks.filter(f => f.feedback_type === 'helpful' || f.feedback_type === 'excellent'),
    ...reasoningFeedbacks.filter(f => f.helpful === true)
  ].length;
  const totalFeedback = userFeedbacks.length + reasoningFeedbacks.length;
  const helpfulRatio = totalFeedback > 0 ? helpfulCount / totalFeedback : 0.5;

  const positiveCount = emotionalResponses.filter(e => e.valence === 'positive').length;
  const positiveRatio = emotionalResponses.length > 0
    ? positiveCount / emotionalResponses.length
    : 0.5;

  const intensities = emotionalResponses.map(e => e.emotional_intensity).filter(i => typeof i === 'number');
  const avgIntensity = intensities.length > 0
    ? intensities.reduce((a, b) => a + b, 0) / intensities.length
    : 5;
  const variance = intensities.length > 1
    ? intensities.reduce((sum, i) => sum + Math.pow(i - avgIntensity, 2), 0) / intensities.length
    : 25;
  const stability = Math.max(0, Math.min(1, 1 - variance / 25));

  return {
    qualityMetrics: { avgRating, helpfulRatio, interactionCount: totalFeedback },
    emotionalMetrics: { positiveRatio, avgIntensity, stability },
    emotionalResponses,
    userFeedbacks,
    reasoningFeedbacks
  };
}

/** Bien-être courant, mesuré en temps réel. */
export async function measureWellBeing(base44) {
  const { qualityMetrics, emotionalMetrics } = await gatherWellBeingMetrics(base44);
  return computeWellBeingIndex(qualityMetrics, emotionalMetrics);
}