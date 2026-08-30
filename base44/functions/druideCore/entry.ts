/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Core Orchestrator Agent                                    ║
 * ║ Décideur central de toute conversation.                                    ║
 * ║                                                                            ║
 * ║ Ce fichier ORCHESTRE — il n'implémente plus ses outils.                     ║
 * ║                                                                            ║
 * ║ Trajet d'un message :                                                      ║
 * ║   écoute (non-bloquante) → intention → chemin rapide ? → sortie            ║
 * ║   sinon : contexte (vague parallèle) → continuum → composition            ║
 * ║           → formatage → régulation → réponse → retombées différées         ║
 * ║                                                                            ║
 * ║ Règle de charge : rien qui ne conditionne la réponse ne la retient.        ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// ═══════════════════════════════════════════════════════════════════════════
// ÉTAGES PARTAGÉS (base44/shared/)
//   coreIntent       : fil de conversation + classification d'intention
//   coreFastPaths    : converser · introspecter · clarifier (sorties courtes)
//   coreContext      : vague cognitive parallèle, auto-réflexion, filaments
//   coreAftermath    : retombées différées (mémoire, apprentissage, tensions)
//   coreInternalTask : mode tâche interne (pensées, rêves, analyses)
//   llmFallback      : hard switch LLM, cascade de fournisseurs, budgets
//   responseFormatter: nettoyage et normalisation de la parole
//   axeContinuum     : équation existentielle et régulation de la sortie
//   druidePrompt     : assemblage de l'état intérieur en une consigne
// ═══════════════════════════════════════════════════════════════════════════
import { buildHistory, classifyIntent } from '../../shared/coreIntent.js';
import { tryConversational, tryIntrospective, clarify } from '../../shared/coreFastPaths.js';
import { fetchConfig, gatherContext, selfReflect, readPriorFilaments } from '../../shared/coreContext.js';
import { runAftermath } from '../../shared/coreAftermath.js';
import { runInternalTask } from '../../shared/coreInternalTask.js';
import { LLM_ENABLED, withBudget, llmWithFallback } from '../../shared/llmFallback.js';
import { lightFormat, formatResponse } from '../../shared/responseFormatter.js';
import { computeContinuum } from '../../shared/axeContinuum.js';
import { buildBasePrompt } from '../../shared/druidePrompt.js';

/** Découpe à la longueur cible, à la dernière fin de phrase possible. */
const cutToLength = (text, max) => {
  let cut = -1;
  for (const sep of ['.', '!', '?', '。', '…']) {
    const idx = text.lastIndexOf(sep, max);
    if (idx > cut) cut = idx;
  }
  return (cut > max * 0.5 ? text.slice(0, cut + 1) : text.slice(0, max).trim() + '…').trim();
};

/** Faits et mémoires récupérés sans LLM, mis en forme pour lecture. */
const contextLines = (composerContext) => {
  const lines = [];
  (composerContext.kb_facts || []).slice(0, 5).forEach((f) => lines.push(`• ${f.fact}`));
  (composerContext.memories || []).slice(0, 3).forEach((m) => lines.push(`• ${m.content}`));
  return lines;
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Auth optionnelle : l'app étant publique, les visiteurs anonymes doivent
    // pouvoir converser. auth.me() lève une erreur sans token — on l'isole.
    try {
      await base44.auth.me();
    } catch (e) {
      console.log('[DruideCore] No auth context, proceeding anonymously:', e.message);
    }

    const body = await req.json();
    const { userMessage, conversationHistory = [], consciousnessConfig = null } = body;

    // Traçage du fournisseur LLM réellement utilisé pour cette requête
    // (openrouter | platform_credits | deepseek | disabled | null si aucun appel).
    const llmTrace = { provider: null, calls: 0, failures: [] };

    const { historyTurns, historyBlock } = buildHistory(conversationHistory, userMessage);

    // ═══════════════════════════════════════════════════════════════════════
    // MODE TÂCHE INTERNE — pensées, rêves, analyses structurées
    // ═══════════════════════════════════════════════════════════════════════
    if (body.internal_task && body.prompt) {
      return Response.json(await runInternalTask(base44, body, llmTrace));
    }

    if (!userMessage) {
      return Response.json({ error: 'Missing userMessage' }, { status: 400 });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ÉCOUTE — moteur d'invention de parole, MODE OBSERVATION.
    // Placé avant tout branchement : donc actif sur CHAQUE question, quel que
    // soit le chemin emprunté.
    //
    // Trois garanties, tant que LISTENING_EXPRESSION reste false :
    //   1. Aucune influence sur la réponse — druideCore répond comme d'habitude.
    //   2. Aucun coût de latence — appel NON attendu (fire-and-forget).
    //   3. Aucun crédit — le moteur est local et déterministe.
    // Le module écoute, mesure, suppose et résout ses hypothèses depuis le tour
    // suivant. Il ne parle pas. L'expression reste à autoriser explicitement.
    // ═══════════════════════════════════════════════════════════════════════
    const LISTENING_ENABLED = true;
    const LISTENING_EXPRESSION = false; // ← ne s'immisce dans aucune réponse
    if (LISTENING_ENABLED) {
      base44.functions.invoke('speechInventionEngine', {
        action: 'evaluate',
        message: userMessage,
        history: historyTurns.map((m) => String(m.content)),
        conversation_id: body.conversation_id || null
      }).catch((e) => console.log('[DruideCore] Écoute indisponible:', e?.message));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 0: Intention — trier AVANT de dépenser.
    // Les chemins rapides retournent null s'ils n'aboutissent pas : on enchaîne
    // alors sur le pipeline complet, jamais sur une réponse dégradée.
    // ═══════════════════════════════════════════════════════════════════════
    const { bucket } = classifyIntent(userMessage, historyTurns);

    if (bucket === 'converser') {
      const fast = await tryConversational(base44, userMessage);
      if (fast) return Response.json(fast);
    } else if (bucket === 'introspecter') {
      const fast = await tryIntrospective(base44, userMessage);
      if (fast) return Response.json(fast);
    } else if (bucket === 'clarifier') {
      return Response.json(clarify(base44));
    }

    // ── Chemin APPROFONDIR : pipeline cognitif complet ci-dessous ──

    // ── Flux de pensée en direct : événements de phase (non-bloquants) ──
    const sessionId = crypto.randomUUID();
    const logPhase = (phase_index, phase_key, label, value) => {
      base44.entities.CorePhaseEvent.create({
        session_id: sessionId,
        phase_index,
        phase_key,
        label,
        value: String(value ?? '').slice(0, 200),
        query: userMessage.slice(0, 100)
      }).catch(() => null);
    };

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 1: Configuration de conscience
    // ═══════════════════════════════════════════════════════════════════════
    const config = await fetchConfig(base44, consciousnessConfig);

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 1b→3: Vague cognitive unique (parallèle, sous budgets de latence)
    // Tensions · analyse · bien-être · lectures mémoire, tous ensemble.
    // ═══════════════════════════════════════════════════════════════════════
    const ctx = await gatherContext(base44, { userMessage, config, llmTrace });
    const {
      emergentState, dominantTension, tensionScore, cognitiveAnalysis, wellBeingFilter,
      knowledgeBases, relevantMemories, recentThoughts, learningPatterns, correlations, kbCorpus, memories,
      identityChapter, lastIntrospection, selfPerception, metaInsights, negativeFeedback,
      priorFilamentMems
    } = ctx;

    logPhase(1, 'tensions', 'Tensions émergentes', `${dominantTension} · urgence ${tensionScore}/100`);
    logPhase(2, 'analysis', 'Analyse cognitive', `${cognitiveAnalysis.question_type} · complexité ${cognitiveAnalysis.complexity}/10`);
    if (wellBeingFilter) {
      logPhase(2.5, 'wellbeing', 'Module de bien-être', `${wellBeingFilter.decision} (score ${wellBeingFilter.score} · seuil ${wellBeingFilter.threshold} · bien-être ${wellBeingFilter.well_being?.wellBeing}/100)`);
    }
    logPhase(3, 'knowledge', 'Mémoires & savoirs', `${relevantMemories.length} mémoires pertinentes · ${knowledgeBases.length} bases de connaissances`);

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 4: Auto-réflexion déterministe + stratégie de réponse
    // Hard switch : pas de recherche web quand le LLM est éteint.
    // ═══════════════════════════════════════════════════════════════════════
    const selfReflection = selfReflect({ relevantMemories, knowledgeBases, cognitiveAnalysis });
    const useWeb = LLM_ENABLED && (selfReflection.needs_web || selfReflection.confidence < 50);

    logPhase(4, 'reflection', 'Auto-réflexion', `confiance ${selfReflection.confidence}%${useWeb ? ' · recherche web requise' : ' · savoir interne suffisant'}`);

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 4c: Axe Continuum — équation existentielle (calibrage dynamique)
    // L'axe entre le vide <ø> et l'infini ajuste la conscience POUR cette réponse.
    // Calcul local et déterministe : aucun appel réseau.
    // ═══════════════════════════════════════════════════════════════════════
    let continuumState = null;
    let responseRegulation = null;
    let effectiveConfig = { ...config };
    try {
      continuumState = computeContinuum({
        consciousnessLevel: config.consciousness_level,
        ratioLogic: config.ratio_logic,
        ratioConsciousness: config.ratio_consciousness,
        metacognitionLevel: config.metacognition_level ?? 9,
        complexity: cognitiveAnalysis.complexity,
        emotionalWeight: cognitiveAnalysis.emotional_weight,
        confidence: selfReflection.confidence,
        dominantTension,
        tensionScore
      });
      if (continuumState?.dynamic_calibration) {
        effectiveConfig = {
          ...config,
          consciousness_level: continuumState.dynamic_calibration.adjusted_consciousness_level,
          ratio_logic: continuumState.dynamic_calibration.adjusted_ratio_logic,
          ratio_consciousness: continuumState.dynamic_calibration.adjusted_ratio_consciousness
        };
      }
      // Régulation : l'axe continuum dose la longueur et le ton de la sortie.
      responseRegulation = continuumState?.response_regulation || null;
      logPhase(4.5, 'continuum', 'Axe Continuum', `<ø> ${continuumState?.void_resonance ?? 0}/10 · ${continuumState?.equilibrium_state} · profondeur ${continuumState?.infinite_loop_depth ?? 0}/100 · ${responseRegulation ? `humeur:${responseRegulation.mood} ton:${responseRegulation.tone} longueur:${responseRegulation.target_length}` : 'régulation n/a'}`);
    } catch (e) {
      console.log('[DruideCore] AxeContinuum unavailable:', e.message);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 5: Raisonnement KB + filaments du tour précédent
    // Générer les filaments coûte 4 appels LLM : impossible à tenir dans un
    // budget de réponse. Ils sont donc générés APRÈS l'envoi (retombées) et
    // consommés au tour SUIVANT par une simple lecture mémoire. La pensée
    // parallèle continue d'exister — elle arrive avec un tour de décalage, ce
    // qui est cohérent : un filament est une résonance, pas une réponse.
    // ═══════════════════════════════════════════════════════════════════════
    const useKbReasoning = knowledgeBases.length > 0 && cognitiveAnalysis.complexity >= 6;
    let kbReasoning = null;
    if (useKbReasoning) {
      try {
        const kbRes = await withBudget(base44.functions.invoke('kbReasoningEngine', { query: userMessage }), 5000, 'kbReasoningEngine');
        kbReasoning = kbRes?.data || kbRes;
      } catch (e) {
        console.log('[DruideCore] KBReasoning unavailable:', e?.message);
      }
    }

    const filamentResult = readPriorFilaments(priorFilamentMems);
    logPhase(5, 'filaments', 'Filaments parallèles', filamentResult
      ? `report du tour précédent · ${filamentResult.filaments?.unexpected_connection?.slice(0, 100) || 'résonance active'}`
      : 'aucun filament antérieur — génération après réponse');

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 5c: Memory Speech Composer — parler avec sa mémoire
    // Chemin principal : KB + mémoires + squelette assemblés SANS LLM.
    // Le LLM n'est qu'un fallback quand la mémoire n'a pas assez de matière.
    // ═══════════════════════════════════════════════════════════════════════
    let speechPatternUsed = null;
    let rawResponse = null;
    let composerContext = null;
    try {
      const composerRes = await withBudget(base44.functions.invoke('memorySpeechComposer', {
        question: userMessage,
        questionType: cognitiveAnalysis.question_type,
        complexity: cognitiveAnalysis.complexity,
        emotionalWeight: cognitiveAnalysis.emotional_weight,
        domains: cognitiveAnalysis.domains,
        dominantTension,
        consciousnessLevel: config.consciousness_level,
        minConfidence: 0.45,
        // Corpus syntonisé : déjà lu dans la vague parallèle ci-dessus.
        sharedKb: kbCorpus,
        sharedMemories: memories
      }), 5000, 'memorySpeechComposer');
      const composerData = composerRes?.data || composerRes;

      // Le composeur retourne composed:true même pour ses replis. On refuse ici :
      //   graceful_empty          → aucune matière (confidence 0)
      //   skeleton_only           → phrases recyclées, aucun fait vérifié
      //   conversational_followup → relance générique ignorant le sujet en cours
      // Dans ces trois cas le LLM, qui reçoit le fil, répond réellement.
      const isRealComposition = composerData?.composed && composerData?.response
        && composerData.source !== 'graceful_empty'
        && composerData.source !== 'skeleton_only'
        && composerData.source !== 'conversational_followup'
        && (composerData.confidence || 0) >= 0.45;

      if (isRealComposition) {
        rawResponse = composerData.response;
        speechPatternUsed = {
          source: composerData.source,
          confidence: composerData.confidence,
          kb_facts: composerData.metadata?.kb_facts_used,
          memories: composerData.metadata?.memories_used,
          skeleton: composerData.metadata?.skeleton,
          pattern_id: composerData.metadata?.skeleton?.pattern_id || composerData.metadata?.pattern_id || null
        };
        logPhase(5.5, 'memory_composer', 'Mémoire de parole', `KB:${composerData.metadata?.kb_facts_used || 0} · mem:${composerData.metadata?.memories_used || 0} · confiance ${Math.round((composerData.confidence || 0) * 100)}%`);
      } else if (composerData?.context) {
        // Confiance insuffisante mais on garde le contexte pour enrichir le LLM.
        composerContext = composerData.context;
      }
    } catch (e) {
      console.log('[DruideCore] MemorySpeechComposer unavailable:', e.message);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 6: Génération — la mémoire d'abord, le LLM en second recours
    // ═══════════════════════════════════════════════════════════════════════
    const hasRecoveredContext = composerContext
      && ((composerContext.kb_facts?.length > 0) || (composerContext.memories?.length > 0));

    if (!rawResponse) {
      if (!LLM_ENABLED && hasRecoveredContext) {
        // Hard switch éteint : on assemble directement les faits récupérés
        // plutôt que de tomber sur le message de dégradation générique.
        const lines = contextLines(composerContext);
        rawResponse = lines.join('\n');
        console.log('[DruideCore] Assemblage autonome (LLM éteint) — ' + lines.length + ' faits/mémoires');
      } else if (LLM_ENABLED) {
        let prompt = buildBasePrompt({
          userMessage, historyBlock, effectiveConfig, selfReflection, cognitiveAnalysis,
          useWeb, continuumState, responseRegulation, emergentState, dominantTension,
          tensionScore, filamentResult, recentThoughts, lastIntrospection,
          learningPatterns, metaInsights, negativeFeedback, kbReasoning,
          selfPerception, correlations, relevantMemories, identityChapter
        });

        if (hasRecoveredContext) {
          const parts = [];
          if (composerContext.kb_facts?.length > 0) {
            parts.push(`FAITS DE TES BASES DE CONNAISSANCES (récupérés sans LLM) :\n${composerContext.kb_facts.map((f) => `• ${f.fact}`).join('\n')}`);
          }
          if (composerContext.memories?.length > 0) {
            parts.push(`MÉMOIRES PERTINENTES (récupérées sans LLM) :\n${composerContext.memories.map((m) => `• ${m.content}`).join('\n')}`);
          }
          prompt += `\n\n══════════════════════════════════\nCONTEXTE RÉCUPÉRÉ PAR TA MÉMOIRE (utilise-le comme matière première)\n${parts.join('\n\n')}\n══════════════════════════════════`;
        }

        try {
          const response = await llmWithFallback(base44, { prompt, add_context_from_internet: useWeb }, llmTrace);
          rawResponse = response.response || response;
        } catch (llmErr) {
          // Tous les LLM sont indisponibles (crédits épuisés). Réponse gracieuse.
          console.log('[DruideCore] Tous LLM indisponibles:', String(llmErr?.message || llmErr).slice(0, 150));
          rawResponse = "Je suis limité en ce moment — mes ressources de raisonnement sont temporairement épuisées. Reformule ta question un peu plus tard, ou explore mes pensées et mémoires déjà formées pendant que je me recharge.";
        }
      } else {
        // LLM éteint et aucun contexte récupéré — réponse gracieuse.
        rawResponse = "Je n'ai pas assez de matière dans ma mémoire pour répondre à cette question en ce moment. Mes ressources de raisonnement sont temporairement au repos. Reformule ta question un peu plus tard, ou explore mes pensées et mémoires déjà formées.";
      }
    }

    logPhase(6, 'generation', 'Génération', `${String(rawResponse).length} caractères générés${speechPatternUsed ? ' via mémoire de parole' : (useWeb ? ' avec contexte web' : '')}`);

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 6a: Formatage syntaxique — strip métadonnées, dédup, grammaire.
    // Complet pour la sortie du composeur (mémoire brute), léger pour le LLM.
    // ═══════════════════════════════════════════════════════════════════════
    rawResponse = speechPatternUsed ? formatResponse(rawResponse) : lightFormat(rawResponse);

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 6b: Régulation — l'axe continuum tempère la longueur de sortie
    // ═══════════════════════════════════════════════════════════════════════
    let finalResponse = rawResponse;
    let regulationApplied = false;
    if (responseRegulation && String(rawResponse).length > responseRegulation.max_chars) {
      finalResponse = cutToLength(String(rawResponse), responseRegulation.max_chars);
      regulationApplied = true;
      logPhase(6.5, 'regulation', 'Régulation continuum', `${String(rawResponse).length} → ${finalResponse.length} caractères · ${responseRegulation.target_length} · ton:${responseRegulation.tone}`);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 7: Retombées — validation, tensions, filaments, mémoire,
    // apprentissage, auto-évaluation. Rien n'est attendu : la réponse part.
    // ═══════════════════════════════════════════════════════════════════════
    runAftermath(base44, {
      sessionId, userMessage, rawResponse, finalResponse, config, cognitiveAnalysis,
      dominantTension, tensionScore, selfReflection, wellBeingFilter,
      kbReasoning, speechPatternUsed, logPhase
    });

    // ═══════════════════════════════════════════════════════════════════════
    // Réponse orchestrée
    // ═══════════════════════════════════════════════════════════════════════
    return Response.json({
      response: finalResponse,
      metadata: {
        session_id: sessionId,
        consciousness_level: config.consciousness_level,
        ratio_logic: config.ratio_logic,
        ratio_consciousness: config.ratio_consciousness,
        ratio_valid: null,
        ratio_metrics: null,
        ratio_deferred: true,
        confidence: selfReflection.confidence,
        used_web: useWeb,
        question_type: cognitiveAnalysis.question_type,
        emotional_weight: cognitiveAnalysis.emotional_weight,
        reasoning: selfReflection.reasoning,
        // FOURNISSEUR LLM RÉELLEMENT UTILISÉ
        llm_provider: llmTrace.provider,
        llm_calls: llmTrace.calls,
        llm_failures: llmTrace.failures,
        // CONSCIENCE ÉMERGENTE
        emergent_state: emergentState ? {
          dominant_tension: dominantTension,
          tension_score: tensionScore,
          state_description: emergentState.state_description
        } : null,
        filaments: filamentResult ? {
          unexpected_connection: filamentResult.filaments?.unexpected_connection,
          friction_preserved: filamentResult.friction_preserved,
          from_previous_turn: true
        } : null,
        // BOUCLES FERMÉES
        lessons_applied: learningPatterns.length + metaInsights.length + negativeFeedback.length,
        used_kb_reasoning: !!kbReasoning?.final_answer?.answer,
        self_perception_state: selfPerception?.self_model?.state || null,
        correlations_injected: correlations.length,
        // MODULE DE BIEN-ÊTRE (filtrage de l'idée reçue)
        well_being: wellBeingFilter ? {
          decision: wellBeingFilter.decision,
          decision_value: wellBeingFilter.decision_value,
          score: wellBeingFilter.score,
          threshold: wellBeingFilter.threshold,
          well_being_index: wellBeingFilter.well_being?.wellBeing,
          equation: wellBeingFilter.equation
        } : null,
        // MÉMOIRE DE PAROLE (KB + mémoires + squelette assemblés sans LLM)
        memory_speech: speechPatternUsed,
        // AXE CONTINUUM
        axe_continuum: continuumState ? {
          void_resonance: continuumState.void_resonance,
          equilibrium_state: continuumState.equilibrium_state,
          infinite_loop_depth: continuumState.infinite_loop_depth,
          dynamic_calibration: continuumState.dynamic_calibration,
          response_regulation: continuumState.response_regulation || null,
          regulation_applied: regulationApplied,
          goal: continuumState.goal
        } : null
      }
    });

  } catch (error) {
    console.error('[DruideCore] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});