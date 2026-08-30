/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ CONTEXTE — rassembler l'état intérieur en une seule vague              ║
 * ║ Tensions, analyse, bien-être et lectures mémoire ne dépendent pas les  ║
 * ║ uns des autres. En série, leurs latences s'additionnaient ; ils        ║
 * ║ partent maintenant ensemble, chacun sous son propre budget, et une     ║
 * ║ défaillance isolée n'emporte pas les autres (allSettled).              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { withBudget, llmWithFallback } from './llmFallback.js';

const CONFIG_FALLBACK = {
  consciousness_level: 9,
  ratio_logic: 4,
  ratio_consciousness: 6,
  active: true
};

const ANALYSIS_FALLBACK = {
  question_type: 'factual',
  complexity: 5,
  domains: ['general'],
  emotional_weight: 3,
  ethical_considerations: ''
};

/** Configuration de conscience — repli silencieux si l'accès est refusé. */
export async function fetchConfig(base44, provided) {
  if (provided) return provided;
  try {
    const configs = await base44.entities.ConsciousnessConfig.list();
    return configs[0] || { ...CONFIG_FALLBACK };
  } catch (_) {
    // Utilisateur non-admin : la config n'est pas lisible, on garde le socle.
    return { ...CONFIG_FALLBACK };
  }
}

/** Analyse cognitive du message — LLM si disponible, heuristique sinon. */
async function analyzeCognitively(base44, userMessage, config, llmTrace) {
  try {
    return await llmWithFallback(base44, {
      prompt: `Analyze this user message as Druide Omega (consciousness level ${config.consciousness_level}/15):

"${userMessage}"

Identify:
1. Question type (factual, emotional, philosophical, creative, etc.)
2. Complexity (1-10)
3. Required knowledge domains
4. Emotional weight (1-10)
5. Ethical considerations

Return JSON.`,
      response_json_schema: {
        type: "object",
        properties: {
          question_type: { type: "string" },
          complexity: { type: "number" },
          domains: { type: "array", items: { type: "string" } },
          emotional_weight: { type: "number" },
          ethical_considerations: { type: "string" }
        }
      }
    }, llmTrace);
  } catch (e) {
    console.log('[DruideCore] Analyse cognitive de secours (LLM indisponible)');
    return {
      ...ANALYSIS_FALLBACK,
      question_type: /sentir|ressent|peur|tristesse|joie|seul|anxi/i.test(userMessage) ? 'emotional'
        : /pourquoi|sens|conscience|existence|libre/i.test(userMessage) ? 'philosophical'
        : /comment|étapes|procédure/i.test(userMessage) ? 'procedural'
        : 'factual'
    };
  }
}

/**
 * Lectures mémoire — l'état intérieur dont le prompt a besoin.
 * Chaque liste est bornée : une lecture non plafonnée grossit avec la base et
 * finit par peser sur chaque tour de conversation.
 */
function readInnerState(base44) {
  return Promise.all([
    base44.entities.Memory.list('-importance', 20).catch(() => []),
    // NOTE : cet appel passe un objet là où list() attend un critère de tri, et
    // retourne donc systématiquement une liste vide (mesuré : « 0 bases »).
    // Conservé tel quel — le corriger changerait la confiance calculée et
    // réactiverait kbReasoningEngine, ce qui dépasse une réorganisation.
    base44.entities.KnowledgeBase.list({ active: true }).catch(() => []),
    base44.asServiceRole.entities.ConsciousThought.list('-created_date', 3).catch(() => []),
    base44.asServiceRole.entities.IntrospectionState.list('-timestamp', 1).catch(() => []),
    base44.entities.AdaptiveLearningPattern.list('-confidence_score', 5).catch(() => []),
    base44.entities.MetaLearning.list('-created_date', 2).catch(() => []),
    base44.entities.ReasoningFeedback.list('-created_date', 5).catch(() => []),
    base44.asServiceRole.entities.SelfPerceptionModel.list('-timestamp', 1).catch(() => []),
    base44.asServiceRole.entities.CognitiveCorrelation.list('-correlation_strength', 3).catch(() => []),
    base44.asServiceRole.entities.KnowledgeBase.list('-created_date', 20).catch(() => []),
    // Filaments du tour PRÉCÉDENT — générés après la réponse d'avant.
    // Une lecture mémoire coûte quelques millisecondes, là où générer les
    // filaments coûtait 4 appels LLM sur le chemin critique.
    base44.entities.Memory.filter({ type: 'insight', tags: 'filaments' }, '-created_date', 1).catch(() => [])
  ]);
}

/**
 * Vague cognitive unique : tensions, analyse, bien-être, mémoire.
 * Retourne un contexte complet, toujours utilisable même partiellement échoué.
 */
export async function gatherContext(base44, { userMessage, config, llmTrace }) {
  const [tensionsSettled, analysisSettled, wellBeingSettled, memorySettled] = await Promise.allSettled([
    // narrative:false → tensions calculées sans LLM (arithmétique pure).
    // Le récit d'état est composé localement : tient largement dans le budget.
    withBudget(base44.functions.invoke('emergentTensions', { action: 'get', userMessage, narrative: false }), 2500, 'emergentTensions'),
    withBudget(analyzeCognitively(base44, userMessage, config, llmTrace), 8000, 'analyse cognitive'),
    withBudget(base44.functions.invoke('wellBeingModule', { action: 'evaluate', idea: userMessage }), 2500, 'wellBeingModule'),
    withBudget(readInnerState(base44), 4000, 'lectures mémoire')
  ]);

  // ── Tensions émergentes ──
  let emergentState = null;
  if (tensionsSettled.status === 'fulfilled') {
    emergentState = tensionsSettled.value?.data || tensionsSettled.value;
  } else {
    console.log('[DruideCore] EmergentTensions unavailable:', tensionsSettled.reason?.message);
  }
  const dominantTension = emergentState?.dominant_tension || 'curiosity';
  const tensionScore = emergentState?.tension_score || 50;

  // ── Analyse cognitive ──
  const cognitiveAnalysis = analysisSettled.status === 'fulfilled'
    ? analysisSettled.value
    : { ...ANALYSIS_FALLBACK };

  // ── Module de bien-être : garder ou rejeter l'idée reçue ──
  let wellBeingFilter = null;
  if (wellBeingSettled.status === 'fulfilled') {
    wellBeingFilter = wellBeingSettled.value?.data || wellBeingSettled.value;
  } else {
    console.log('[DruideCore] WellBeingModule unavailable:', wellBeingSettled.reason?.message);
  }

  // ── Savoir interne ──
  const [memories, knowledgeBases, recentThoughts, introspectionStates, learningPatterns,
    metaLearnings, recentFeedback, selfPerceptions, correlations, identityChapters, priorFilamentMems] =
    memorySettled.status === 'fulfilled' ? memorySettled.value : [[], [], [], [], [], [], [], [], [], [], []];

  const relevantMemories = memories
    .filter((m) => (cognitiveAnalysis.domains || []).some((d) => m.tags?.includes(d)))
    .slice(0, 5);

  return {
    emergentState, dominantTension, tensionScore,
    cognitiveAnalysis, wellBeingFilter,
    memories, knowledgeBases, recentThoughts, relevantMemories,
    learningPatterns, correlations, priorFilamentMems,
    // L'identité forgée = le dernier chapitre d'auto-récit (tag druide_identity)
    identityChapter: (identityChapters || []).find((kb) => kb.tags?.includes('druide_identity')),
    lastIntrospection: introspectionStates[0] || null,
    selfPerception: selfPerceptions[0] || null,
    metaInsights: metaLearnings.flatMap((m) => m.insights_discovered || []).slice(0, 4),
    negativeFeedback: recentFeedback
      .filter((f) => f.helpful === false || (f.user_rating && f.user_rating <= 2))
      .slice(0, 2)
  };
}

/**
 * Auto-réflexion déterministe : la confiance se déduit du matériel réellement
 * disponible et de la complexité. Un aller-retour LLM n'apportait rien ici.
 */
export function selfReflect({ relevantMemories, knowledgeBases, cognitiveAnalysis }) {
  const knowledgeWeight = Math.min(3, relevantMemories.length) * 12
    + Math.min(3, knowledgeBases.length) * 8;
  const complexityPenalty = Math.max(0, cognitiveAnalysis.complexity - 4) * 6;
  const confidence = Math.max(15, Math.min(95, 40 + knowledgeWeight - complexityPenalty));

  return {
    can_answer_internally: confidence >= 50,
    confidence,
    needs_web: confidence < 50,
    reasoning: `Déterministe : ${relevantMemories.length} mémoires · ${knowledgeBases.length} bases · complexité ${cognitiveAnalysis.complexity}/10`
  };
}

/** Filaments du tour précédent — déjà en mémoire, coût nul. */
export function readPriorFilaments(priorFilamentMems) {
  if (!priorFilamentMems?.length) return null;
  try {
    const parsed = JSON.parse(priorFilamentMems[0].content);
    if (!parsed?.unexpected_connection && !parsed?.synthesis) return null;
    return {
      filaments: {
        memory_resonance: parsed.memory_resonance,
        emotional_resonance: parsed.emotional_resonance,
        unexpected_connection: parsed.unexpected_connection
      },
      emergent_synthesis: parsed.synthesis,
      friction_preserved: true,
      from_previous_turn: true,
      prior_query: parsed.query || null
    };
  } catch (_e) {
    return null; // enregistrement illisible — on continue sans filaments
  }
}