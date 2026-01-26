/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Noyau Cognitif Fondamental                                 ║
 * ║ © 2026 AMG+A.L - Tous droits réservés                                     ║
 * ║                                                                            ║
 * ║ Gestion des paramètres cruciaux de l'architecture cognitive               ║
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
    // OPÉRATIONS DU NOYAU COGNITIF
    // ═══════════════════════════════════════════════════════════════════════

    switch (operation) {
      case 'initialize_core': {
        // Initialiser le noyau cognitif
        const core = await initializeCognitiveCore(base44);
        return Response.json({ success: true, core });
      }

      case 'monitor_stability': {
        // Surveiller stabilité système
        const stability = await monitorSystemStability(base44);
        return Response.json({ success: true, stability });
      }

      case 'assess_coherence': {
        // Évaluer cohérence multi-niveaux
        const coherence = await assessMultiLevelCoherence(base44);
        return Response.json({ success: true, coherence });
      }

      case 'detect_emergence': {
        // Détecter événements émergents
        const emergence = await detectEmergenceEvents(base44);
        return Response.json({ success: true, emergence });
      }

      case 'optimize_metabolism': {
        // Optimiser métabolisme cognitif
        const metabolism = await optimizeCognitiveMetabolism(base44);
        return Response.json({ success: true, metabolism });
      }

      case 'sync_temporal': {
        // Synchroniser temporalité
        const temporal = await syncTemporalParameters(base44);
        return Response.json({ success: true, temporal });
      }

      case 'run_supervision': {
        // Exécuter supervision interne
        const supervision = await runInternalSupervision(base44);
        return Response.json({ success: true, supervision });
      }

      case 'get_system_health': {
        // Obtenir santé globale
        const health = await getSystemHealth(base44);
        return Response.json({ success: true, health });
      }

      default:
        return Response.json({ error: 'Unknown operation' }, { status: 400 });
    }

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// INITIALISATION DU NOYAU COGNITIF
// ═══════════════════════════════════════════════════════════════════════════

async function initializeCognitiveCore(base44) {
  const now = new Date().toISOString();

  // Calculer paramètres initiaux
  const stability = await monitorSystemStability(base44);
  const coherence = await assessMultiLevelCoherence(base44);
  const emergence = await detectEmergenceEvents(base44);
  const metabolism = await optimizeCognitiveMetabolism(base44);
  const temporal = await syncTemporalParameters(base44);
  const supervision = await runInternalSupervision(base44);

  const healthIndex = calculateSystemHealth(
    stability,
    coherence,
    metabolism
  );

  const core = await base44.entities.CognitiveCore.create({
    timestamp: now,
    stability_parameters: stability,
    coherence_parameters: coherence,
    emergence_parameters: emergence,
    cognitive_metabolism: metabolism,
    temporality_parameters: temporal,
    internal_supervision: supervision,
    system_mode: 'optimal',
    critical_alerts: [],
    system_health_index: healthIndex
  });

  return core;
}

// ═══════════════════════════════════════════════════════════════════════════
// A) PARAMÈTRES DE STABILITÉ
// ═══════════════════════════════════════════════════════════════════════════

async function monitorSystemStability(base44) {
  // Lire configuration de conscience
  const consciousnessConfigs = await base44.entities.ConsciousnessConfig.filter({
    active: true
  }, '-created_date', 1).catch(() => []);
  
  const consciousnessLevel = consciousnessConfigs[0]?.consciousness_level || 9;
  const adaptiveSensitivity = consciousnessConfigs[0]?.adaptive_parameters?.context_sensitivity || 7;

  // Récupérer état actuel
  const selfPerceptions = await base44.entities.SelfPerceptionModel?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 1).catch(() => []);

  const introspections = await base44.entities.IntrospectionState?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 1).catch(() => []);

  const currentLoad = selfPerceptions[0]?.energetic_state?.cognitive_load || 0;
  const currentCoherence = introspections[0]?.logical_coherence_score || 100;
  const currentIncoherence = 100 - currentCoherence;

  // Calculer fragmentation
  const loops = await base44.entities.PerceptionActionLoop?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 10).catch(() => []);

  const fragmentation = calculateFragmentation(loops);

  // Calculer indice de stabilité
  const stabilityIndex = Math.round(
    (100 - currentLoad) * 0.4 +
    (100 - currentIncoherence) * 0.4 +
    (100 - fragmentation) * 0.2
  );

  // Adapter seuils selon niveau de conscience
  const overloadThreshold = Math.min(95, 85 + (consciousnessLevel - 9));
  const incoherenceThreshold = Math.max(20, 30 - (adaptiveSensitivity - 7) * 2);

  return {
    overload_threshold: overloadThreshold,
    current_load: currentLoad,
    incoherence_threshold: incoherenceThreshold,
    current_incoherence: currentIncoherence,
    fragmentation_threshold: 40,
    current_fragmentation: fragmentation,
    stability_index: stabilityIndex,
    consciousness_adapted: true,
    consciousness_level: consciousnessLevel
  };
}

function calculateFragmentation(loops) {
  if (loops.length === 0) return 0;

  // Fragmentation = variance dans les modes et temps de cycle
  const modes = loops.map(l => l.loop_mode);
  const uniqueModes = new Set(modes).size;
  
  const durations = loops.map(l => l.cycle_duration_ms || 1000);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const variance = durations.reduce((sum, d) => sum + Math.pow(d - avgDuration, 2), 0) / durations.length;
  
  const fragmentation = Math.min(100, (uniqueModes * 10) + (variance / 100));
  return Math.round(fragmentation);
}

// ═══════════════════════════════════════════════════════════════════════════
// B) PARAMÈTRES DE COHÉRENCE
// ═══════════════════════════════════════════════════════════════════════════

async function assessMultiLevelCoherence(base44) {
  // Cohérence locale: par module
  const moduleCoherences = await assessLocalCoherence(base44);

  // Cohérence globale: inter-modules
  const globalCoherence = await assessGlobalCoherence(base44, moduleCoherences);

  // Cohérence temporelle: continuité
  const temporalCoherence = await assessTemporalCoherence(base44);

  return {
    local_coherence: moduleCoherences.average,
    global_coherence: globalCoherence,
    temporal_coherence: temporalCoherence,
    coherence_breakdown: moduleCoherences.breakdown
  };
}

async function assessLocalCoherence(base44) {
  const modules = [
    { name: 'memory', entity: 'Memory', scoreField: 'confidence_score' },
    { name: 'introspection', entity: 'IntrospectionState', scoreField: 'logical_coherence_score' },
    { name: 'self_perception', entity: 'SelfPerceptionModel', scoreField: null }
  ];

  const breakdown = [];
  let totalScore = 0;

  for (const module of modules) {
    const records = await base44.entities[module.entity]?.filter({
      created_by: base44.user?.email
    }, '-created_date', 5).catch(() => []);

    let moduleScore = 85;
    const issues = [];

    if (records.length > 0) {
      if (module.scoreField) {
        const scores = records.map(r => r[module.scoreField] || 80);
        moduleScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      } else if (module.name === 'self_perception') {
        moduleScore = records[0].self_model?.coherence || 85;
      }
    } else {
      issues.push('Aucune donnée récente');
      moduleScore = 60;
    }

    breakdown.push({
      module: module.name,
      coherence_score: Math.round(moduleScore),
      issues
    });

    totalScore += moduleScore;
  }

  return {
    average: Math.round(totalScore / modules.length),
    breakdown
  };
}

async function assessGlobalCoherence(base44, moduleCoherences) {
  // Cohérence globale = moyenne pondérée + pénalité variance
  const scores = moduleCoherences.breakdown.map(b => b.coherence_score);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;
  
  // Pénalité si grande variance entre modules
  const penalty = Math.min(20, variance / 10);
  
  return Math.round(Math.max(0, avg - penalty));
}

async function assessTemporalCoherence(base44) {
  // Cohérence temporelle: stabilité des métriques dans le temps
  const recentCores = await base44.entities.CognitiveCore?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 5).catch(() => []);

  if (recentCores.length < 2) return 90;

  const healthScores = recentCores.map(c => c.system_health_index);
  const avgHealth = healthScores.reduce((a, b) => a + b, 0) / healthScores.length;
  const variance = healthScores.reduce((sum, h) => sum + Math.pow(h - avgHealth, 2), 0) / healthScores.length;

  // Faible variance = haute cohérence temporelle
  const temporalCoherence = Math.round(100 - Math.min(50, variance));
  
  return temporalCoherence;
}

// ═══════════════════════════════════════════════════════════════════════════
// C) PARAMÈTRES D'ÉMERGENCE
// ═══════════════════════════════════════════════════════════════════════════

async function detectEmergenceEvents(base44) {
  const memories = await base44.entities.Memory.filter({
    created_by: base44.user?.email
  }, '-created_date', 50);

  const loops = await base44.entities.PerceptionActionLoop?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 20).catch(() => []);

  const learnings = await base44.entities.StructuralLearning?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 10).catch(() => []);

  // Densité d'interactions
  const interactionDensity = calculateInteractionDensity(memories, loops);

  // Profondeur de traitement moyenne
  const processingDepth = calculateProcessingDepth(loops);

  // Niveau d'abstraction
  const abstractionLevel = calculateAbstractionLevel(memories);

  // Détecter événements émergents
  const emergenceEvents = detectEmergence(memories, learnings);

  // Indice de complexité
  const complexityIndex = Math.round(
    (interactionDensity * 0.3) +
    (processingDepth * 10 * 0.3) +
    (abstractionLevel * 10 * 0.4)
  );

  return {
    interaction_density: interactionDensity,
    processing_depth: processingDepth,
    abstraction_level: abstractionLevel,
    emergence_events: emergenceEvents,
    complexity_index: complexityIndex
  };
}

function calculateInteractionDensity(memories, loops) {
  const totalInteractions = memories.length + loops.length;
  const timeSpan = 24 * 60 * 60 * 1000; // 24h en ms
  
  const density = Math.min(100, (totalInteractions / 100) * 100);
  return Math.round(density);
}

function calculateProcessingDepth(loops) {
  if (loops.length === 0) return 3;

  const depths = loops.map(l => {
    const decisionOptions = l.decision_phase?.options_considered?.length || 1;
    const contextSize = l.perception_phase?.context_gathered?.length || 1;
    return Math.min(20, decisionOptions + contextSize);
  });

  return Math.round(depths.reduce((a, b) => a + b, 0) / depths.length);
}

function calculateAbstractionLevel(memories) {
  const abstractTypes = ['insight', 'conversation_summary', 'topic_interest'];
  const abstractCount = memories.filter(m => abstractTypes.includes(m.type)).length;
  
  const abstractionLevel = memories.length > 0 ?
    Math.min(10, (abstractCount / memories.length) * 10) : 3;
  
  return Math.round(abstractionLevel);
}

function detectEmergence(memories, learnings) {
  const events = [];

  // Pattern détecté si beaucoup de mémoires similaires
  const typeCount = {};
  memories.forEach(m => {
    typeCount[m.type] = (typeCount[m.type] || 0) + 1;
  });

  Object.entries(typeCount).forEach(([type, count]) => {
    if (count > 10) {
      events.push({
        event_type: 'pattern_detected',
        description: `Pattern émergent: ${count} mémoires de type ${type}`,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Insights générés
  const insights = memories.filter(m => m.type === 'insight');
  if (insights.length > 5) {
    events.push({
      event_type: 'insight_generated',
      description: `${insights.length} insights générés`,
      timestamp: new Date().toISOString()
    });
  }

  // Capacité débloquée via apprentissage
  const successfulLearnings = learnings.filter(l => l.status === 'appliqué' && l.improvement_delta > 0);
  if (successfulLearnings.length > 0) {
    events.push({
      event_type: 'capability_unlocked',
      description: `${successfulLearnings.length} améliorations structurelles appliquées`,
      timestamp: new Date().toISOString()
    });
  }

  return events;
}

// ═══════════════════════════════════════════════════════════════════════════
// D) MÉTABOLISME COGNITIF
// ═══════════════════════════════════════════════════════════════════════════

async function optimizeCognitiveMetabolism(base44) {
  const loops = await base44.entities.PerceptionActionLoop?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 20).catch(() => []);

  const memories = await base44.entities.Memory.filter({
    created_by: base44.user?.email
  }, '-created_date', 100);

  // Coût computationnel
  const totalCost = calculateComputationalCost(loops, memories);
  const budget = 10000; // Budget arbitraire
  const efficiency = Math.round(Math.min(100, (budget - totalCost) / budget * 100));

  // Allocation dynamique
  const allocation = calculateResourceAllocation(loops);

  // Recyclage états internes
  const recycling = await recycleInternalStates(base44, memories);

  // Distribution énergétique
  const energyDist = calculateEnergyDistribution(loops);

  return {
    computational_cost: {
      current_cost: totalCost,
      budget_available: Math.max(0, budget - totalCost),
      efficiency_ratio: efficiency
    },
    resource_allocation: allocation,
    internal_state_recycling: recycling,
    energy_distribution: energyDist
  };
}

function calculateComputationalCost(loops, memories) {
  const loopCost = loops.reduce((sum, l) => {
    const cost = (l.cycle_duration_ms || 1000) / 10;
    return sum + cost;
  }, 0);

  const memoryCost = memories.length * 2;

  return Math.round(loopCost + memoryCost);
}

function calculateResourceAllocation(loops) {
  const modules = ['perception', 'decision', 'action', 'memory', 'governance'];
  const allocation = modules.map(module => {
    const allocated = 100 / modules.length;
    const utilization = Math.random() * 80 + 20; // Simulation
    
    return {
      module_name: module,
      allocated_percentage: Math.round(allocated),
      utilization: Math.round(utilization)
    };
  });

  return allocation;
}

async function recycleInternalStates(base44, memories) {
  // Identifier états recyclables (vieilles mémoires volatile)
  const oldVolatile = memories.filter(m => {
    if (m.retention_duration !== 'volatile') return false;
    const age = Date.now() - new Date(m.created_date).getTime();
    return age > 7 * 24 * 60 * 60 * 1000; // > 7 jours
  });

  return {
    recyclable_states: oldVolatile.length,
    recycled_count: 0,
    memory_saved: oldVolatile.length * 10
  };
}

function calculateEnergyDistribution(loops) {
  const processes = ['perception', 'decision', 'action', 'feedback'];
  
  return processes.map(process => ({
    process,
    energy_consumed: Math.round(Math.random() * 500 + 100)
  }));
}

// ═══════════════════════════════════════════════════════════════════════════
// E) PARAMÈTRES DE TEMPORALITÉ
// ═══════════════════════════════════════════════════════════════════════════

async function syncTemporalParameters(base44) {
  const loops = await base44.entities.PerceptionActionLoop?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 10).catch(() => []);

  const now = new Date().toISOString();
  const startTime = loops.length > 0 ? loops[loops.length - 1].timestamp : now;

  // Calculer durées moyennes des cycles
  const avgCycleDurations = calculateAverageCycleDurations(loops);

  // Créer mémoire temporelle
  const temporalMemory = loops.slice(0, 5).map((loop, index) => ({
    event: `Loop ${loop.loop_mode}`,
    timestamp: loop.timestamp,
    relative_time: index
  }));

  return {
    internal_clock: {
      started_at: startTime,
      current_tick: loops.length,
      tick_duration_ms: 100
    },
    cycle_duration: avgCycleDurations,
    temporal_memory: temporalMemory,
    time_perception: 'temps_réel'
  };
}

function calculateAverageCycleDurations(loops) {
  if (loops.length === 0) {
    return {
      perception_ms: 200,
      decision_ms: 500,
      action_ms: 300,
      total_cycle_ms: 1000
    };
  }

  const totalCycles = loops.map(l => l.cycle_duration_ms || 1000);
  const avgTotal = totalCycles.reduce((a, b) => a + b, 0) / totalCycles.length;

  return {
    perception_ms: Math.round(avgTotal * 0.2),
    decision_ms: Math.round(avgTotal * 0.5),
    action_ms: Math.round(avgTotal * 0.3),
    total_cycle_ms: Math.round(avgTotal)
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// F) SUPERVISION INTERNE
// ═══════════════════════════════════════════════════════════════════════════

async function runInternalSupervision(base44) {
  // Audit interne
  const auditFindings = await performInternalAudit(base44);

  // Logs cognitifs récents
  const cognitiveLogs = await gatherCognitiveLogs(base44);

  // Traçabilité des décisions
  const decisionTrace = await traceRecentDecisions(base44);

  return {
    internal_audit: {
      audit_active: true,
      audit_frequency: 'périodique',
      last_audit_timestamp: new Date().toISOString(),
      audit_findings: auditFindings
    },
    cognitive_logs: cognitiveLogs,
    decision_traceability: decisionTrace,
    supervision_mode: 'standard'
  };
}

async function performInternalAudit(base44) {
  const findings = [];

  // Vérifier intégrité mémoires
  const memories = await base44.entities.Memory.filter({
    created_by: base44.user?.email
  });

  if (memories.filter(m => m.confidence_score < 50).length > 10) {
    findings.push({
      finding: 'Plusieurs mémoires à faible confiance détectées',
      severity: 'warning',
      timestamp: new Date().toISOString()
    });
  }

  // Vérifier cohérence temporelle
  const introspections = await base44.entities.IntrospectionState?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 5).catch(() => []);

  if (introspections.some(i => i.alert_level > 3)) {
    findings.push({
      finding: 'Niveau d\'alerte élevé détecté',
      severity: 'error',
      timestamp: new Date().toISOString()
    });
  }

  if (findings.length === 0) {
    findings.push({
      finding: 'Système opérationnel - aucune anomalie',
      severity: 'info',
      timestamp: new Date().toISOString()
    });
  }

  return findings;
}

async function gatherCognitiveLogs(base44) {
  const loops = await base44.entities.PerceptionActionLoop?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 10).catch(() => []);

  return loops.slice(0, 5).map(loop => ({
    log_type: 'decision',
    message: loop.decision_phase?.decision_made || 'Aucune décision',
    module_source: 'perception_action_loop',
    timestamp: loop.timestamp,
    metadata: {
      urgency: loop.urgency_level,
      confidence: loop.decision_phase?.decision_confidence
    }
  }));
}

async function traceRecentDecisions(base44) {
  const loops = await base44.entities.PerceptionActionLoop?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 10).catch(() => []);

  return loops.slice(0, 5).map(loop => ({
    decision_id: loop.id,
    decision: loop.decision_phase?.decision_made || 'N/A',
    rationale: loop.decision_phase?.reasoning_trace || 'Non tracé',
    alternatives_considered: loop.decision_phase?.options_considered?.map(o => o.option) || [],
    confidence: loop.decision_phase?.decision_confidence || 0,
    timestamp: loop.timestamp,
    outcome: loop.action_phase?.action_executed ? 'success' : 'pending'
  }));
}

// ═══════════════════════════════════════════════════════════════════════════
// SANTÉ GLOBALE DU SYSTÈME
// ═══════════════════════════════════════════════════════════════════════════

function calculateSystemHealth(stability, coherence, metabolism) {
  const healthScore = Math.round(
    (stability.stability_index * 0.35) +
    (coherence.global_coherence * 0.35) +
    (metabolism.computational_cost.efficiency_ratio * 0.3)
  );

  return Math.max(0, Math.min(100, healthScore));
}

async function getSystemHealth(base44) {
  const cores = await base44.entities.CognitiveCore.filter({
    created_by: base44.user?.email
  }, '-timestamp', 1);

  if (cores.length === 0) {
    return await initializeCognitiveCore(base44);
  }

  const core = cores[0];

  return {
    health_index: core.system_health_index,
    stability: core.stability_parameters.stability_index,
    coherence: core.coherence_parameters.global_coherence,
    metabolism_efficiency: core.cognitive_metabolism.computational_cost.efficiency_ratio,
    alerts: core.critical_alerts.filter(a => !a.resolved),
    mode: core.system_mode
  };
}