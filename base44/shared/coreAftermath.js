/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ RETOMBÉES — tout ce qui se passe APRÈS que la réponse soit partie      ║
 * ║ Validation du ratio, restauration des tensions, filaments, mémoire,    ║
 * ║ apprentissage du squelette, auto-évaluation : aucun de ces travaux ne  ║
 * ║ doit retenir la réponse. Ils sont tous lancés sans être attendus.      ║
 * ║ C'est ce qui garde la conversation fluide malgré la charge réelle.     ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { generateAIFeedback } from './aiSelfFeedback.js';

/**
 * Mémorisation filtrée par le module de bien-être :
 *   keep    → mémorisation normale
 *   neutral → mémorisée avec drapeau rumination_pending (à revisiter)
 *   reject  → pas mémorisée (Druide la laisse passer sans la retenir)
 */
function saveInteraction(base44, { userMessage, finalResponse, cognitiveAnalysis, wellBeingFilter, confidence, logPhase }) {
  const decision = wellBeingFilter?.decision || 'keep';
  if (decision === 'reject') {
    logPhase(7, 'wellbeing_reject', 'Idée rejetée', `non mémorisée · score ${wellBeingFilter?.score} < -${wellBeingFilter?.threshold}`);
    return;
  }

  const tags = [...(cognitiveAnalysis.domains || []), 'wellbeing:' + decision];
  if (decision === 'neutral') tags.push('rumination_pending');

  const baseImportance = cognitiveAnalysis.complexity + cognitiveAnalysis.emotional_weight;
  base44.entities.Memory.create({
    type: 'interaction',
    content: `Q: ${userMessage}\nA: ${finalResponse.slice(0, 200)}`,
    importance: Math.min(10, decision === 'neutral' ? baseImportance + 1 : baseImportance),
    modality: 'chat',
    tags,
    confidence_score: Math.round(confidence)
  }).catch(() => null);
}

/** Rumination différée : une question mal maîtrisée est marquée à revisiter. */
function markForRumination(base44, { userMessage, selfReflection }) {
  base44.asServiceRole.entities.Memory.create({
    type: 'insight',
    content: JSON.stringify({
      query: userMessage.slice(0, 300),
      confidence: selfReflection.confidence,
      reasoning: (selfReflection.reasoning || '').slice(0, 200)
    }),
    importance: 6,
    modality: 'system',
    tags: ['rumination_pending', 'druidecore'],
    embedding_summary: `À revisiter — ${userMessage.slice(0, 80)}`
  }).catch(() => null);
}

/**
 * Lance toutes les retombées d'un tour de conversation. Rien n'est attendu :
 * la fonction retourne immédiatement.
 */
export function runAftermath(base44, ctx) {
  const {
    sessionId, userMessage, rawResponse, finalResponse, config, cognitiveAnalysis,
    dominantTension, tensionScore, selfReflection, wellBeingFilter,
    kbReasoning, speechPatternUsed, logPhase
  } = ctx;

  // ── Validation du ratio : le validateur loggera la phase 7 lui-même ──
  base44.functions.invoke('consciousnessRatioValidator', {
    response: String(rawResponse),
    targetRatioLogic: config.ratio_logic,
    targetRatioConsciousness: config.ratio_consciousness,
    maxRetries: 0,
    session_id: sessionId,
    query: userMessage.slice(0, 100)
  }).catch(() => null);

  // ── Restauration des tensions : une interaction satisfaisante nourrit ──
  base44.functions.invoke('emergentTensions', {
    action: 'restore',
    interactionQuality: Math.round((cognitiveAnalysis.emotional_weight + cognitiveAnalysis.complexity) / 2)
  }).catch(() => null);

  // ── Filaments parallèles : 4 appels LLM qui ne pèsent plus sur la latence.
  // Le résultat est persisté par filamentEngine et réinjecté au tour suivant.
  base44.functions.invoke('filamentEngine', {
    userMessage,
    dominantTension,
    tensionScore,
    consciousnessLevel: config.consciousness_level
  }).catch((e) => console.log('[DruideCore] Filaments différés échoués:', e?.message));

  if (selfReflection.confidence < 50) markForRumination(base44, { userMessage, selfReflection });

  saveInteraction(base44, {
    userMessage, finalResponse, cognitiveAnalysis, wellBeingFilter,
    confidence: selfReflection.confidence, logPhase
  });

  // ── Apprentissage du squelette de parole ──
  // Druide apprend à parler en parlant : l'architecture de cette réponse
  // devient un squelette réutilisable pour les questions similaires à venir.
  base44.functions.invoke('speechPatternEngine', {
    action: 'learn',
    question: userMessage,
    response: finalResponse,
    questionType: cognitiveAnalysis.question_type,
    complexity: cognitiveAnalysis.complexity,
    emotionalWeight: cognitiveAnalysis.emotional_weight,
    domains: cognitiveAnalysis.domains,
    dominantTension,
    consciousnessLevel: config.consciousness_level,
    conversationId: sessionId
  }).catch((e) => console.log('[DruideCore] SpeechPattern learn failed:', e?.message));

  // ── Auto-évaluation locale ──
  // Le pattern_id lié permet à la boucle EWMA (recalibrate) d'ajuster le poids
  // du squelette, que la réponse vienne du composeur OU du LLM (squelette
  // nouvellement appris juste au-dessus).
  generateAIFeedback(base44, sessionId, finalResponse, {
    usedKb: !!kbReasoning?.final_answer?.answer,
    usedSkeleton: !!speechPatternUsed?.skeleton,
    questionType: cognitiveAnalysis.question_type,
    emotionalWeight: cognitiveAnalysis.emotional_weight,
    intentBucket: 'approfondir',
    patternId: speechPatternUsed?.pattern_id || speechPatternUsed?.skeleton?.pattern_id || null
  });
}