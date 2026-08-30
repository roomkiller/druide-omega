/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ CONTEXTE — rassembler l'état intérieur en une seule vague              ║
 * ║ Tensions, analyse, bien-être et lectures mémoire ne dépendent pas les  ║
 * ║ uns des autres. En série, leurs latences s'additionnaient ; ils        ║
 * ║ partent maintenant ensemble, chacun sous son propre budget, et une     ║
 * ║ défaillance isolée n'emporte pas les autres (allSettled).              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { withBudget } from './llmFallback.js';
import { analyzeLocally } from './cognitiveAnalysis.js';

const CONFIG_FALLBACK = {
  consciousness_level: 9,
  ratio_logic: 4,
  ratio_consciousness: 6,
  active: true
};

/** Poids de confiance : plafonné, sinon un grand corpus écrase la mesure. */
const KB_CONFIDENCE_CAP = 3;

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

// L'analyse cognitive est désormais LOCALE (voir cognitiveAnalysis.js).
// Mesuré : l'aller-retour IA coûtait ~1 à 2 s et un appel complet par tour pour
// produire quatre valeurs déductibles de la forme de la question.

/**
 * Lectures mémoire — l'état intérieur dont le prompt a besoin.
 * Chaque liste est bornée : une lecture non plafonnée grossit avec la base et
 * finit par peser sur chaque tour de conversation.
 */
function readInnerState(base44) {
  return Promise.all([
    // 25 mémoires : les 20 premières servent au prompt, les 25 sont transmises
    // au compositeur (c'est exactement le pool qu'il lisait lui-même).
    base44.entities.Memory.list('-importance', 25).catch(() => []),
    base44.asServiceRole.entities.ConsciousThought.list('-created_date', 3).catch(() => []),
    base44.asServiceRole.entities.IntrospectionState.list('-timestamp', 1).catch(() => []),
    base44.entities.AdaptiveLearningPattern.list('-confidence_score', 5).catch(() => []),
    base44.entities.MetaLearning.list('-created_date', 2).catch(() => []),
    base44.entities.ReasoningFeedback.list('-created_date', 5).catch(() => []),
    base44.asServiceRole.entities.SelfPerceptionModel.list('-timestamp', 1).catch(() => []),
    base44.asServiceRole.entities.CognitiveCorrelation.list('-correlation_strength', 3).catch(() => []),
    // Chapitre d'identité : lecture récente par date (le corpus trié par
    // pertinence ci-dessous ne garantit pas d'y trouver le dernier chapitre).
    base44.asServiceRole.entities.KnowledgeBase.list('-created_date', 20).catch(() => []),
    // Filaments du tour PRÉCÉDENT — générés après la réponse d'avant.
    // Une lecture mémoire coûte quelques millisecondes, là où générer les
    // filaments coûtait 4 appels LLM sur le chemin critique.
    base44.entities.Memory.filter({ type: 'insight', tags: 'filaments' }, '-created_date', 1).catch(() => []),
    // Corpus de connaissances syntonisé — LA lecture de référence des bases.
    // Elle sert à la fois au compositeur de mémoire et au calcul de confiance :
    // la base de connaissances n'est plus lue trois fois par tour.
    base44.asServiceRole.entities.KnowledgeBase
      .filter({ active: true, status: 'ready' }, '-relevance_score', 300).catch(() => [])
  ]);
}

/**
 * Sélection des mémoires pertinentes.
 * L'ancien filtre exigeait qu'un tag de mémoire corresponde exactement à un
 * domaine d'analyse — dès que le vocabulaire des domaines changeait, il ne
 * retenait plus rien, et la confiance chutait sous le seuil de recherche web.
 * On combine donc l'accord de domaine et le recouvrement de mots, avec un
 * repli sur les mémoires les plus importantes déjà lues (coût nul).
 */
function selectRelevantMemories(memories, userMessage, cognitiveAnalysis) {
  const pool = memories.slice(0, 20);
  const domains = cognitiveAnalysis.domains || [];
  const words = new Set(
    String(userMessage).toLowerCase().replace(/[^\p{L}\s]/gu, ' ').split(/\s+/).filter((w) => w.length > 4)
  );

  const scored = pool.map((m) => {
    const tags = m.tags || [];
    let score = domains.some((d) => tags.includes(d)) ? 3 : 0;
    const text = `${m.content || ''} ${m.embedding_summary || ''}`.toLowerCase();
    for (const w of words) if (text.includes(w)) score += 1;
    return { m, score };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);

  if (scored.length > 0) return scored.slice(0, 5).map((x) => x.m);
  // Rien ne correspond : garder les deux mémoires les plus importantes plutôt
  // que de repartir les mains vides.
  return pool.slice(0, 2);
}

/**
 * Vague cognitive unique : tensions, analyse, bien-être, mémoire.
 * Retourne un contexte complet, toujours utilisable même partiellement échoué.
 */
export async function gatherContext(base44, { userMessage }) {
  // Analyse cognitive LOCALE : immédiate, aucun appel réseau, aucun crédit.
  const cognitiveAnalysis = analyzeLocally(userMessage);

  const [tensionsSettled, wellBeingSettled, memorySettled] = await Promise.allSettled([
    // narrative:false → tensions calculées sans LLM (arithmétique pure).
    // Le récit d'état est composé localement : tient largement dans le budget.
    withBudget(base44.functions.invoke('emergentTensions', { action: 'get', userMessage, narrative: false }), 2500, 'emergentTensions'),
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

  // ── Module de bien-être : garder ou rejeter l'idée reçue ──
  let wellBeingFilter = null;
  if (wellBeingSettled.status === 'fulfilled') {
    wellBeingFilter = wellBeingSettled.value?.data || wellBeingSettled.value;
  } else {
    console.log('[DruideCore] WellBeingModule unavailable:', wellBeingSettled.reason?.message);
  }

  // ── Savoir interne ──
  const [memories, recentThoughts, introspectionStates, learningPatterns,
    metaLearnings, recentFeedback, selfPerceptions, correlations, identityChapters,
    priorFilamentMems, kbCorpus] =
    memorySettled.status === 'fulfilled' ? memorySettled.value : [[], [], [], [], [], [], [], [], [], [], []];

  // Le corpus syntonisé EST la référence des bases de connaissances : plus de
  // lecture séparée, donc plus de divergence entre les deux vues.
  const knowledgeBases = kbCorpus;

  const relevantMemories = selectRelevantMemories(memories, userMessage, cognitiveAnalysis);

  return {
    emergentState, dominantTension, tensionScore,
    cognitiveAnalysis, wellBeingFilter,
    memories, knowledgeBases, recentThoughts, relevantMemories, kbCorpus,
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
  const knowledgeWeight = Math.min(KB_CONFIDENCE_CAP, relevantMemories.length) * 12
    + Math.min(KB_CONFIDENCE_CAP, knowledgeBases.length) * 8;
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