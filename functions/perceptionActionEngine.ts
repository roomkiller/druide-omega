/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Moteur Boucle Perception → Décision → Action               ║
 * ║ © 2026 AMG+A.L - Tous droits réservés                                     ║
 * ║                                                                            ║
 * ║ Mode actif/régulé/hiérarchisé - Boucle vivante du système                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { operation, data } = await req.json();

    // ═══════════════════════════════════════════════════════════════════════
    // OPÉRATIONS DE LA BOUCLE PERCEPTION-ACTION
    // ═══════════════════════════════════════════════════════════════════════

    switch (operation) {
      case 'execute_loop': {
        // Exécuter un cycle complet perception → décision → action
        const result = await executePerceptionActionLoop(base44, data);
        return Response.json({ success: true, result });
      }

      case 'perceive': {
        // Phase perception uniquement
        const perception = await perceiveInput(base44, data);
        return Response.json({ success: true, perception });
      }

      case 'decide': {
        // Phase décision uniquement
        const decision = await makeDecision(base44, data);
        return Response.json({ success: true, decision });
      }

      case 'act': {
        // Phase action uniquement
        const action = await executeAction(base44, data);
        return Response.json({ success: true, action });
      }

      case 'provide_feedback': {
        // Enregistrer la rétroaction
        const feedback = await recordInternalFeedback(base44, data);
        return Response.json({ success: true, feedback });
      }

      case 'analyze_loops': {
        // Analyser les boucles passées
        const analysis = await analyzeLoopPerformance(base44);
        return Response.json({ success: true, analysis });
      }

      default:
        return Response.json({ error: 'Unknown operation' }, { status: 400 });
    }

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// BOUCLE COMPLÈTE PERCEPTION → DÉCISION → ACTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Exécuter la boucle complète
 */
async function executePerceptionActionLoop(base44, inputData) {
  const startTime = Date.now();

  const {
    input,
    perceptual_filter = 'sélectif',
    decision_engine = 'hybride',
    loop_mode = 'régulé',
    urgency_level = 2,
    conversation_id = null
  } = inputData;

  // Capturer l'état système initial
  const systemSnapshot = await captureSystemSnapshot(base44);

  // ═══ PHASE 1: PERCEPTION ═══
  const perceptionPhase = await perceiveInput(base44, {
    input,
    filter: perceptual_filter,
    urgency_level
  });

  // ═══ PHASE 2: DÉCISION ═══
  const decisionPhase = await makeDecision(base44, {
    perception: perceptionPhase,
    engine: decision_engine,
    urgency_level,
    system_state: systemSnapshot
  });

  // ═══ PHASE 3: ACTION ═══
  const actionPhase = await executeAction(base44, {
    decision: decisionPhase,
    urgency_level
  });

  // ═══ PHASE 4: RÉTROACTION ═══
  const feedbackPhase = await generateInternalFeedback(base44, {
    perception: perceptionPhase,
    decision: decisionPhase,
    action: actionPhase
  });

  // Calculer durée et priorité
  const cycleDuration = Date.now() - startTime;
  const priorityScore = calculatePriorityScore(urgency_level, actionPhase.action_cost, actionPhase.estimated_impact);

  // Enregistrer la boucle complète
  const loop = await base44.entities.PerceptionActionLoop.create({
    timestamp: new Date().toISOString(),
    perception_phase: perceptionPhase,
    decision_phase: decisionPhase,
    action_phase: actionPhase,
    urgency_level,
    internal_feedback: feedbackPhase,
    loop_mode,
    cycle_duration_ms: cycleDuration,
    priority_score: priorityScore,
    related_conversation_id: conversation_id,
    related_memory_ids: actionPhase.memory_ids || [],
    system_state_snapshot: systemSnapshot
  });

  return loop;
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 1: PERCEPTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Percevoir et filtrer l'entrée
 */
async function perceiveInput(base44, data) {
  const { input, filter = 'sélectif', urgency_level = 2 } = data;

  let filteredInput = input;
  const contextGathered = [];

  // Appliquer le filtre perceptif
  switch (filter) {
    case 'neutre': {
      // Aucun filtrage, tout passe
      filteredInput = input;
      contextGathered.push('perception_complète_sans_filtre');
      break;
    }
    case 'sélectif': {
      // Filtrage modéré, prioriser l'essentiel
      filteredInput = await applySelectiveFilter(base44, input);
      contextGathered.push('contexte_pertinent_extrait');
      
      // Récupérer contexte pertinent
      const relevantMemories = await base44.entities.Memory.filter({
        created_by: base44.user?.email
      }, '-importance', 5);
      
      if (relevantMemories.length > 0) {
        contextGathered.push(`${relevantMemories.length}_mémoires_pertinentes`);
      }
      break;
    }
    case 'prioritaire': {
      // Filtrage strict, uniquement haute priorité
      filteredInput = await applyPriorityFilter(base44, input, urgency_level);
      contextGathered.push('filtre_prioritaire_actif');
      
      // Contexte critique uniquement
      const activeKB = await base44.entities.KnowledgeBase.filter({
        created_by: base44.user?.email,
        active: true
      }, '-relevance_score', 3);
      
      if (activeKB.length > 0) {
        contextGathered.push(`${activeKB.length}_sources_KB_prioritaires`);
      }
      break;
    }
  }

  // Évaluer qualité de perception
  const perceptionQuality = evaluatePerceptionQuality(input, filteredInput, contextGathered.length);

  return {
    perceptual_filter: filter,
    raw_input: input,
    filtered_input: filteredInput,
    context_gathered: contextGathered,
    perception_quality: perceptionQuality
  };
}

/**
 * Appliquer un filtre sélectif
 */
async function applySelectiveFilter(base44, input) {
  // Extraire les éléments clés de l'entrée
  const keywords = extractKeywords(input);
  return keywords.join(' ');
}

/**
 * Appliquer un filtre prioritaire
 */
async function applyPriorityFilter(base44, input, urgencyLevel) {
  // En mode prioritaire, ne garder que l'essentiel
  const essential = input.split('.')[0]; // Première phrase uniquement si urgence élevée
  return urgencyLevel >= 4 ? essential : input;
}

/**
 * Extraire mots-clés
 */
function extractKeywords(text) {
  const stopWords = ['le', 'la', 'les', 'un', 'une', 'des', 'de', 'et', 'ou', 'à', 'dans'];
  const words = text.toLowerCase().split(/\s+/);
  return words.filter(w => w.length > 3 && !stopWords.includes(w)).slice(0, 10);
}

/**
 * Évaluer la qualité de perception
 */
function evaluatePerceptionQuality(rawInput, filteredInput, contextCount) {
  const informationRetained = filteredInput.length / rawInput.length;
  const contextBonus = Math.min(30, contextCount * 10);
  
  const quality = (informationRetained * 70) + contextBonus;
  return Math.min(100, Math.round(quality));
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 2: DÉCISION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Prendre une décision basée sur la perception
 */
async function makeDecision(base44, data) {
  const { perception, engine = 'hybride', urgency_level = 2, system_state } = data;

  const optionsConsidered = [];
  let decisionMade = '';
  let reasoningTrace = '';

  // Générer les options
  const options = await generateDecisionOptions(base44, perception, system_state);

  // Évaluer selon le moteur décisionnel
  switch (engine) {
    case 'logique': {
      // Moteur logique pur
      const scored = options.map(opt => ({
        ...opt,
        score: evaluateLogically(opt, perception, system_state)
      }));
      
      scored.sort((a, b) => b.score - a.score);
      optionsConsidered.push(...scored.slice(0, 3));
      decisionMade = scored[0].option;
      reasoningTrace = `Analyse logique: ${scored[0].rationale}`;
      break;
    }
    case 'heuristique': {
      // Moteur heuristique (patterns)
      const scored = options.map(opt => ({
        ...opt,
        score: evaluateHeuristically(opt, urgency_level)
      }));
      
      scored.sort((a, b) => b.score - a.score);
      optionsConsidered.push(...scored.slice(0, 3));
      decisionMade = scored[0].option;
      reasoningTrace = `Heuristique rapide basée sur patterns antérieurs`;
      break;
    }
    case 'hybride': {
      // Hybride: logique + heuristique
      const scored = options.map(opt => {
        const logicScore = evaluateLogically(opt, perception, system_state);
        const heuristicScore = evaluateHeuristically(opt, urgency_level);
        return {
          ...opt,
          score: (logicScore * 0.6) + (heuristicScore * 0.4)
        };
      });
      
      scored.sort((a, b) => b.score - a.score);
      optionsConsidered.push(...scored.slice(0, 3));
      decisionMade = scored[0].option;
      reasoningTrace = `Hybride (logique 60% + heuristique 40%): ${scored[0].rationale}`;
      break;
    }
  }

  const decisionConfidence = optionsConsidered.length > 0 ? optionsConsidered[0].score : 75;

  return {
    decision_engine: engine,
    options_considered: optionsConsidered,
    decision_made: decisionMade,
    decision_confidence: Math.round(decisionConfidence),
    reasoning_trace: reasoningTrace
  };
}

/**
 * Générer les options de décision
 */
async function generateDecisionOptions(base44, perception, systemState) {
  const options = [];

  // Option 1: Réponse immédiate
  options.push({
    option: 'immediate_response',
    rationale: 'Fournir une réponse basée sur le contexte actuel'
  });

  // Option 2: Approfondir avec recherche
  options.push({
    option: 'research_and_respond',
    rationale: 'Rechercher des informations supplémentaires avant de répondre'
  });

  // Option 3: Stocker et différer
  if (perception.perception_quality < 70) {
    options.push({
      option: 'store_and_defer',
      rationale: 'Qualité de perception insuffisante, nécessite plus de contexte'
    });
  }

  // Option 4: Action système
  if (systemState?.cognitive_load > 80) {
    options.push({
      option: 'optimize_system',
      rationale: 'Charge cognitive élevée, optimisation requise'
    });
  }

  return options;
}

/**
 * Évaluation logique d'une option
 */
function evaluateLogically(option, perception, systemState) {
  let score = 50;

  // Bonus selon qualité perception
  if (perception.perception_quality >= 80) score += 20;
  else if (perception.perception_quality >= 60) score += 10;

  // Ajustement selon charge système
  if (systemState?.cognitive_load > 80 && option.option === 'optimize_system') {
    score += 30;
  }

  // Pénalité si action complexe et charge élevée
  if (option.option === 'research_and_respond' && systemState?.cognitive_load > 70) {
    score -= 15;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Évaluation heuristique d'une option
 */
function evaluateHeuristically(option, urgencyLevel) {
  let score = 60;

  // Urgence favorise réponse immédiate
  if (urgencyLevel >= 4 && option.option === 'immediate_response') {
    score += 30;
  }

  // Urgence faible favorise recherche approfondie
  if (urgencyLevel <= 2 && option.option === 'research_and_respond') {
    score += 20;
  }

  return Math.max(0, Math.min(100, score));
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 3: ACTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Exécuter l'action décidée
 */
async function executeAction(base44, data) {
  const { decision, urgency_level = 2 } = data;
  const decisionMade = decision.decision_made;

  let actionType = 'response';
  let actionDescription = '';
  let actionCost = 'moyen';
  let estimatedImpact = 'local';
  let actionExecuted = false;
  const memoryIds = [];

  // Déterminer l'action selon la décision
  switch (decisionMade) {
    case 'immediate_response': {
      actionType = 'response';
      actionDescription = 'Génération de réponse immédiate';
      actionCost = 'faible';
      estimatedImpact = 'local';
      actionExecuted = true;
      break;
    }
    case 'research_and_respond': {
      actionType = 'knowledge_update';
      actionDescription = 'Recherche approfondie puis réponse';
      actionCost = 'moyen';
      estimatedImpact = 'local';
      
      // Simuler recherche
      const kbAccessed = await base44.entities.KnowledgeBase.filter({
        created_by: base44.user?.email,
        active: true
      }, '-relevance_score', 2);
      
      actionExecuted = true;
      break;
    }
    case 'store_and_defer': {
      actionType = 'memory_storage';
      actionDescription = 'Stockage en mémoire pour traitement ultérieur';
      actionCost = 'faible';
      estimatedImpact = 'local';
      
      // Créer mémoire
      const memory = await base44.entities.Memory.create({
        type: 'fact',
        content: decision.reasoning_trace,
        context: 'Perception différée',
        importance: urgency_level * 2,
        encoding_priority: urgency_level >= 3 ? 'haute' : 'moyenne',
        retention_duration: 'semi_persistante',
        modality: 'system'
      });
      
      memoryIds.push(memory.id);
      actionExecuted = true;
      break;
    }
    case 'optimize_system': {
      actionType = 'system_adjustment';
      actionDescription = 'Optimisation des ressources système';
      actionCost = 'élevé';
      estimatedImpact = 'global';
      
      // Déclencher consolidation mémoire
      actionExecuted = true;
      break;
    }
    default: {
      actionType = 'no_action';
      actionDescription = 'Aucune action requise';
      actionCost = 'faible';
      estimatedImpact = 'local';
    }
  }

  return {
    action_type: actionType,
    action_description: actionDescription,
    action_cost: actionCost,
    estimated_impact: estimatedImpact,
    action_executed: actionExecuted,
    execution_timestamp: new Date().toISOString(),
    memory_ids: memoryIds
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 4: RÉTROACTION INTERNE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Générer la rétroaction interne
 */
async function generateInternalFeedback(base44, phases) {
  const { perception, decision, action } = phases;

  // Évaluer le succès
  const goalAchieved = action.action_executed;
  const efficiency = calculateEfficiency(perception, decision, action);

  // Identifier effets secondaires
  const sideEffects = [];
  if (action.action_cost === 'élevé') {
    sideEffects.push('charge_cognitive_augmentée');
  }
  if (action.estimated_impact === 'global') {
    sideEffects.push('impact_multi_modules');
  }

  // Déterminer statut feedback
  let feedbackStatus = 'succès';
  if (!goalAchieved) feedbackStatus = 'échec';
  else if (efficiency < 60) feedbackStatus = 'incertain';

  // Extraire apprentissage
  const learningExtracted = extractLearning(perception, decision, action, efficiency);

  // Déterminer si ajustement nécessaire
  const adjustmentNeeded = efficiency < 70 || sideEffects.length > 1;

  return {
    feedback_status: feedbackStatus,
    success_metrics: {
      goal_achieved: goalAchieved,
      efficiency: Math.round(efficiency),
      side_effects: sideEffects
    },
    learning_extracted: learningExtracted,
    adjustment_needed: adjustmentNeeded,
    feedback_timestamp: new Date().toISOString()
  };
}

/**
 * Enregistrer rétroaction manuelle
 */
async function recordInternalFeedback(base44, data) {
  const { loop_id, feedback_status, learning_note } = data;

  const loop = await base44.entities.PerceptionActionLoop.filter({ id: loop_id });
  
  if (!loop || loop.length === 0) {
    throw new Error('Loop not found');
  }

  const updated = await base44.entities.PerceptionActionLoop.update(loop_id, {
    internal_feedback: {
      ...loop[0].internal_feedback,
      feedback_status,
      learning_extracted: learning_note,
      feedback_timestamp: new Date().toISOString()
    }
  });

  return updated;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANALYSE ET MÉTRIQUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Analyser la performance des boucles
 */
async function analyzeLoopPerformance(base44) {
  const loops = await base44.entities.PerceptionActionLoop.filter({
    created_by: base44.user?.email
  }, '-timestamp', 100);

  const analysis = {
    total_loops: loops.length,
    avg_cycle_duration: 0,
    avg_efficiency: 0,
    success_rate: 0,
    by_urgency: {},
    by_decision_engine: {},
    by_action_type: {},
    feedback_distribution: {},
    improvement_opportunities: []
  };

  if (loops.length === 0) return analysis;

  let totalDuration = 0;
  let totalEfficiency = 0;
  let successCount = 0;

  for (const loop of loops) {
    // Durée moyenne
    totalDuration += loop.cycle_duration_ms || 0;

    // Efficacité moyenne
    const efficiency = loop.internal_feedback?.success_metrics?.efficiency || 0;
    totalEfficiency += efficiency;

    // Taux de succès
    if (loop.internal_feedback?.feedback_status === 'succès') {
      successCount++;
    }

    // Distribution par urgence
    const urgency = loop.urgency_level;
    analysis.by_urgency[urgency] = (analysis.by_urgency[urgency] || 0) + 1;

    // Distribution par moteur
    const engine = loop.decision_phase?.decision_engine || 'unknown';
    analysis.by_decision_engine[engine] = (analysis.by_decision_engine[engine] || 0) + 1;

    // Distribution par type d'action
    const actionType = loop.action_phase?.action_type || 'unknown';
    analysis.by_action_type[actionType] = (analysis.by_action_type[actionType] || 0) + 1;

    // Distribution feedback
    const feedbackStatus = loop.internal_feedback?.feedback_status || 'unknown';
    analysis.feedback_distribution[feedbackStatus] = (analysis.feedback_distribution[feedbackStatus] || 0) + 1;
  }

  analysis.avg_cycle_duration = Math.round(totalDuration / loops.length);
  analysis.avg_efficiency = Math.round(totalEfficiency / loops.length);
  analysis.success_rate = Math.round((successCount / loops.length) * 100);

  // Identifier opportunités d'amélioration
  if (analysis.avg_efficiency < 70) {
    analysis.improvement_opportunities.push('Optimiser le moteur décisionnel pour améliorer l\'efficacité');
  }
  if (analysis.success_rate < 80) {
    analysis.improvement_opportunities.push('Ajuster les filtres perceptifs pour réduire les échecs');
  }
  if (analysis.avg_cycle_duration > 2000) {
    analysis.improvement_opportunities.push('Réduire la durée des cycles en simplifiant les étapes');
  }

  return analysis;
}

/**
 * Capturer un snapshot de l'état système
 */
async function captureSystemSnapshot(base44) {
  const consciousnessConfigs = await base44.entities.ConsciousnessConfig.filter({
    created_by: base44.user?.email,
    active: true
  }).catch(() => []);

  const selfPerceptions = await base44.entities.SelfPerceptionModel?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 1).catch(() => []);

  const cognitiveLoad = selfPerceptions.length > 0 ? 
    selfPerceptions[0].energetic_state?.cognitive_load || 50 : 50;

  const consciousnessLevel = consciousnessConfigs.length > 0 ?
    consciousnessConfigs[0].consciousness_level : 0;

  return {
    cognitive_load: cognitiveLoad,
    consciousness_level: consciousnessLevel,
    active_modules: ['memory', 'knowledge', 'introspection', 'self_perception', 'structural_learning']
  };
}

/**
 * Calculer le score de priorité
 */
function calculatePriorityScore(urgency, cost, impact) {
  let score = urgency * 15; // Urgence pèse lourd

  // Coût influence négativement
  if (cost === 'élevé') score -= 10;
  else if (cost === 'moyen') score -= 5;

  // Impact influence positivement
  if (impact === 'global') score += 15;
  else score += 5;

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculer l'efficacité du cycle
 */
function calculateEfficiency(perception, decision, action) {
  const perceptionWeight = 0.3;
  const decisionWeight = 0.4;
  const actionWeight = 0.3;

  const perceptionScore = perception.perception_quality;
  const decisionScore = decision.decision_confidence;
  const actionScore = action.action_executed ? 90 : 0;

  const efficiency = 
    (perceptionScore * perceptionWeight) +
    (decisionScore * decisionWeight) +
    (actionScore * actionWeight);

  return efficiency;
}

/**
 * Extraire l'apprentissage d'un cycle
 */
function extractLearning(perception, decision, action, efficiency) {
  if (efficiency >= 85) {
    return `Boucle très efficace (${Math.round(efficiency)}%) - pattern à renforcer`;
  } else if (efficiency >= 70) {
    return `Boucle fonctionnelle (${Math.round(efficiency)}%) - optimisation possible`;
  } else {
    return `Boucle sous-optimale (${Math.round(efficiency)}%) - révision du filtre ou moteur requis`;
  }
}