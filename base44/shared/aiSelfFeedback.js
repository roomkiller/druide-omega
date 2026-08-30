/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ AI SELF-FEEDBACK — auto-évaluation locale d'une réponse (sans LLM)    ║
 * ║ Note la réponse par heuristiques et alimente l'entité AIFeedback.     ║
 * ║ Non-bloquant par construction : n'interrompt jamais une réponse.      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

export function generateAIFeedback(base44, sessionId, response, context = {}) {
  try {
    const respLen = String(response || '').length;
    let rating = 2;
    if (respLen > 30) rating += 1;
    if (respLen > 120) rating += 1;
    if (context.usedKb) rating += 1;
    if (context.usedSkeleton) rating += 0.5;
    if (/[?]/.test(response)) rating += 0.5;
    rating = Math.min(5, Math.max(1, Math.round(rating * 2) / 2));

    const featureType = context.usedKb ? 'synthesis'
      : context.usedSkeleton ? 'personalization'
      : context.emotionalWeight >= 7 ? 'empathy'
      : 'general';

    const feedbackText = rating >= 4
      ? `Réponse cohérente (${respLen}c)${context.usedKb ? ', synthèse KB' : ''}${context.usedSkeleton ? ', squelette mémoire' : ''}${/[?]/.test(response) ? ', question engageante' : ''}.`
      : rating >= 3
      ? `Réponse acceptable (${respLen}c), pourrait être plus riche.`
      : `Réponse courte (${respLen}c) — manque de profondeur.`;

    base44.entities.AIFeedback.create({
      response_id: sessionId,
      feature_type: featureType,
      rating,
      is_positive: rating >= 3,
      feedback_text: feedbackText,
      context_data: {
        question_type: context.questionType || null,
        emotional_weight: context.emotionalWeight || null,
        response_length: respLen,
        used_kb: !!context.usedKb,
        used_skeleton: !!context.usedSkeleton,
        intent_bucket: context.intentBucket || null,
        pipeline_bypassed: context.pipelineBypassed || false,
        pattern_id: context.patternId || null
      },
      timestamp: new Date().toISOString(),
      processed: false
    }).catch(() => null);
  } catch (_e) { /* non-bloquant */ }
}