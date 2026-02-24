/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Moteur d'Introspection et Auto-Observation                 ║
 * ║ © 2026 AMG+A.L - Tous droits réservés                                     ║
 * ║                                                                            ║
 * ║ Module observant/méta-neutre/auto-régulé pour surveillance interne        ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Parse body — scheduled automations send empty body, so default gracefully
    let operation = 'observe';
    let data = {};
    try {
      const body = await req.json();
      // Entity automation payload has 'event' field — treat as 'observe'
      operation = body.operation || (body.event ? 'observe' : 'observe');
      data = body.data || {};
    } catch (_) {
      // No body (scheduled automation) — default to observe
    }

    // Auth: required only for user-facing calls, not scheduled automations
    const isScheduled = !req.headers.get('authorization') || operation === 'observe';
    if (!isScheduled) {
      const user = await base44.auth.me();
      if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // OPÉRATIONS D'INTROSPECTION
    // ═══════════════════════════════════════════════════════════════════════

    switch (operation) {
      case 'observe': {
        // Observation passive de l'état interne
        const state = await observeInternalState(base44, data?.mode || 'passif');
        return Response.json({ success: true, state });
      }

      case 'diagnose': {
        // Auto-diagnostic actif du système
        const diagnosis = await performAutoDiagnostic(base44);
        return Response.json({ success: true, diagnosis });
      }

      case 'detect_anomalies': {
        // Détection d'anomalies dans les patterns
        const anomalies = await detectAnomalies(base44);
        return Response.json({ success: true, anomalies });
      }

      case 'calculate_coherence': {
        // Calcul de cohérence logique globale
        const coherence = await calculateLogicalCoherence(base44);
        return Response.json({ success: true, coherence });
      }

      case 'get_latest_state': {
        // Récupérer le dernier état d'introspection
        const latestState = await getLatestIntrospectionState(base44);
        return Response.json({ success: true, state: latestState });
      }

      case 'analyze_trends': {
        // Analyser les tendances d'état sur période
        const trends = await analyzeStateTrends(base44, data?.days || 7);
        return Response.json({ success: true, trends });
      }

      default:
        return Response.json({ error: 'Unknown operation' }, { status: 400 });
    }

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// FONCTIONS D'OBSERVATION - MODE MÉTA-NEUTRE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Observation de l'état interne global du système
 */
async function observeInternalState(base44, diagnosticMode = 'passif') {
  const now = new Date().toISOString();

  // Lire conscience pour adapter sensibilité détection
  const consciousnessConfigs = await base44.entities.ConsciousnessConfig.filter({
    active: true
  }, '-created_date', 1).catch(() => []);
  
  const metacognitionLevel = consciousnessConfigs[0]?.metacognition_level || 7;
  const enhancedDetection = metacognitionLevel >= 9;

  // Observer l'état des différents systèmes
  const engineStates = await observeEngineStates(base44);
  const globalState = calculateGlobalState(engineStates);
  const coherenceScore = await calculateLogicalCoherence(base44);
  const anomalies = (diagnosticMode === 'actif' || enhancedDetection) ? await detectAnomalies(base44) : [];
  
  // Déterminer le niveau d'alerte
  const alertLevel = calculateAlertLevel(globalState, coherenceScore, anomalies);
  
  // Auto-diagnostic si mode actif
  const diagnosticResults = diagnosticMode === 'actif' ? 
    await performSystemDiagnostic(base44) : null;

  // Créer l'état d'introspection
  const introspectionState = await base44.entities.IntrospectionState.create({
    timestamp: now,
    global_internal_state: globalState,
    engine_states: engineStates,
    logical_coherence_score: coherenceScore,
    anomaly_detection: classifyAnomalyLevel(anomalies),
    detected_anomalies: anomalies,
    alert_level: alertLevel,
    auto_diagnostic_mode: diagnosticMode,
    diagnostic_results: diagnosticResults,
    system_recommendations: generateRecommendations(globalState, coherenceScore, anomalies),
    observation_mode: 'périodique',
    consciousness_level_observed: await observeConsciousnessLevel(base44),
    meta_cognitive_notes: generateMetaCognitiveNotes(globalState, coherenceScore, alertLevel)
  });

  return introspectionState;
}

/**
 * Observer l'état de tous les moteurs du système
 */
async function observeEngineStates(base44) {
  const engines = [
    'memory_system',
    'knowledge_base',
    'consciousness_hub',
    'emotional_matrix',
    'reasoning_engine',
    'ethical_framework',
    'learning_module',
    'multimodal_processor'
  ];

  const engineStates = [];

  for (const engineName of engines) {
    const state = await assessEngineState(base44, engineName);
    engineStates.push(state);
  }

  return engineStates;
}

/**
 * Évaluer l'état d'un moteur spécifique
 */
async function assessEngineState(base44, engineName) {
  const now = new Date().toISOString();
  
  // Évaluer la charge basée sur les entités récentes
  let status = 'actif';
  let loadPercentage = 0;
  let lastActivity = now;
  let errorMessage = null;

  try {
    // Vérifier l'activité récente selon le moteur
    switch (engineName) {
      case 'memory_system': {
        const recentMemories = await base44.entities.Memory.filter({
          created_by: base44.user?.email
        }, '-created_date', 100);
        loadPercentage = Math.min(100, recentMemories.length * 0.5);
        lastActivity = recentMemories[0]?.created_date || now;
        status = loadPercentage > 80 ? 'saturé' : 'actif';
        break;
      }
      case 'knowledge_base': {
        const kbItems = await base44.entities.KnowledgeBase.filter({
          created_by: base44.user?.email,
          active: true
        });
        loadPercentage = Math.min(100, kbItems.length * 2);
        status = kbItems.length > 0 ? 'actif' : 'inactif';
        break;
      }
      case 'consciousness_hub': {
        const config = await base44.entities.ConsciousnessConfig.filter({
          created_by: base44.user?.email,
          active: true
        });
        status = config.length > 0 ? 'actif' : 'inactif';
        loadPercentage = config.length > 0 ? config[0].consciousness_level * 5 : 0;
        break;
      }
      case 'emotional_matrix': {
        const recentEmotions = await base44.entities.EmotionalResponse.filter({
          created_by: base44.user?.email
        }, '-timestamp', 50);
        loadPercentage = Math.min(100, recentEmotions.length);
        status = recentEmotions.length > 0 ? 'actif' : 'inactif';
        break;
      }
      default: {
        // Moteurs génériques
        loadPercentage = Math.floor(Math.random() * 40) + 30; // 30-70%
        status = 'actif';
      }
    }

  } catch (error) {
    status = 'en_erreur';
    errorMessage = error.message;
    loadPercentage = 0;
  }

  return {
    engine_name: engineName,
    status,
    load_percentage: loadPercentage,
    last_activity: lastActivity,
    error_message: errorMessage
  };
}

/**
 * Calculer l'état global du système
 */
function calculateGlobalState(engineStates) {
  const activeEngines = engineStates.filter(e => e.status === 'actif' || e.status === 'saturé');
  const errorEngines = engineStates.filter(e => e.status === 'en_erreur');
  
  // Charge: moyenne des charges des moteurs actifs
  const avgLoad = activeEngines.length > 0 ?
    activeEngines.reduce((sum, e) => sum + e.load_percentage, 0) / activeEngines.length : 0;

  // Cohérence: pourcentage de moteurs fonctionnels
  const coherence = ((engineStates.length - errorEngines.length) / engineStates.length) * 100;

  // Stabilité: inverse de la variance de charge
  const loadVariance = calculateVariance(activeEngines.map(e => e.load_percentage));
  const stability = Math.max(0, 100 - loadVariance);

  return {
    charge: Math.round(avgLoad),
    coherence: Math.round(coherence),
    stability: Math.round(stability)
  };
}

/**
 * Calculer la variance (pour stabilité)
 */
function calculateVariance(numbers) {
  if (numbers.length === 0) return 0;
  const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
  return Math.sqrt(squaredDiffs.reduce((sum, d) => sum + d, 0) / numbers.length);
}

/**
 * Calculer la cohérence logique du système
 */
async function calculateLogicalCoherence(base44) {
  let coherenceScore = 100;

  // Vérifier cohérence mémoire vs conversations
  const memories = await base44.entities.Memory.filter({
    created_by: base44.user?.email
  }, '-created_date', 50);

  const conversations = await base44.entities.Conversation.filter({
    created_by: base44.user?.email
  }, '-created_date', 20);

  // Pénalité si ratio déséquilibré
  const memoryConvRatio = conversations.length > 0 ? memories.length / conversations.length : 0;
  if (memoryConvRatio < 2) coherenceScore -= 15; // Peu de mémoires enregistrées
  if (memoryConvRatio > 20) coherenceScore -= 10; // Trop de mémoires fragmentées

  // Vérifier la cohérence des knowledge bases actifs
  const activeKB = await base44.entities.KnowledgeBase.filter({
    created_by: base44.user?.email,
    active: true,
    status: 'ready'
  });

  const errorKB = await base44.entities.KnowledgeBase.filter({
    created_by: base44.user?.email,
    status: 'error'
  });

  if (errorKB.length > 0) coherenceScore -= errorKB.length * 5;

  // Vérifier conscience configuration
  const consciousnessConfigs = await base44.entities.ConsciousnessConfig.filter({
    created_by: base44.user?.email,
    active: true
  });

  if (consciousnessConfigs.length === 0) coherenceScore -= 20;
  if (consciousnessConfigs.length > 1) coherenceScore -= 10; // Configurations multiples

  return Math.max(0, Math.min(100, coherenceScore));
}

/**
 * Détection d'anomalies dans le système
 */
async function detectAnomalies(base44) {
  const anomalies = [];

  // Anomalie: Mémoires avec confiance très basse
  const lowConfidenceMemories = await base44.entities.Memory.filter({
    created_by: base44.user?.email,
    confidence_score: { $lt: 30 }
  });

  if (lowConfidenceMemories.length > 10) {
    anomalies.push({
      type: 'low_confidence_memories',
      severity: 'moyenne',
      description: `${lowConfidenceMemories.length} mémoires avec confiance < 30%`,
      affected_module: 'memory_system',
      detected_at: new Date().toISOString()
    });
  }

  // Anomalie: KB en erreur
  const errorKB = await base44.entities.KnowledgeBase.filter({
    created_by: base44.user?.email,
    status: 'error'
  });

  if (errorKB.length > 0) {
    anomalies.push({
      type: 'knowledge_base_errors',
      severity: 'critique',
      description: `${errorKB.length} bases de connaissances en erreur`,
      affected_module: 'knowledge_base',
      detected_at: new Date().toISOString()
    });
  }

  // Anomalie: Évolutions de conscience incohérentes
  const recentEvolutions = await base44.entities.ConsciousnessEvolution.filter({
    created_by: base44.user?.email
  }, '-timestamp', 5);

  if (recentEvolutions.length >= 2) {
    const levelChanges = recentEvolutions.map(e => e.new_level - e.previous_level);
    const hasErraticChanges = levelChanges.some(change => Math.abs(change) > 3);
    
    if (hasErraticChanges) {
      anomalies.push({
        type: 'erratic_consciousness_evolution',
        severity: 'faible',
        description: 'Changements erratiques dans l\'évolution de conscience',
        affected_module: 'consciousness_hub',
        detected_at: new Date().toISOString()
      });
    }
  }

  // Anomalie: Conversations sans mémoires associées
  const recentConversations = await base44.entities.Conversation.filter({
    created_by: base44.user?.email
  }, '-created_date', 10);

  const orphanConversations = [];
  for (const conv of recentConversations) {
    const relatedMemories = await base44.entities.Memory.filter({
      created_by: base44.user?.email,
      related_conversation_id: conv.id
    });
    if (relatedMemories.length === 0) {
      orphanConversations.push(conv.id);
    }
  }

  if (orphanConversations.length > 3) {
    anomalies.push({
      type: 'orphan_conversations',
      severity: 'moyenne',
      description: `${orphanConversations.length} conversations sans mémoires associées`,
      affected_module: 'memory_system',
      detected_at: new Date().toISOString()
    });
  }

  return anomalies;
}

/**
 * Classifier le niveau global d'anomalie
 */
function classifyAnomalyLevel(anomalies) {
  if (anomalies.length === 0) return 'aucune';
  
  const hasCritical = anomalies.some(a => a.severity === 'critique');
  if (hasCritical) return 'critique';
  
  const hasMedium = anomalies.some(a => a.severity === 'moyenne');
  if (hasMedium || anomalies.length >= 3) return 'moyenne';
  
  return 'faible';
}

/**
 * Calculer le niveau d'alerte (0-5)
 */
function calculateAlertLevel(globalState, coherenceScore, anomalies) {
  let alertLevel = 0;

  // Niveau basé sur la charge
  if (globalState.charge > 90) alertLevel += 2;
  else if (globalState.charge > 75) alertLevel += 1;

  // Niveau basé sur la cohérence
  if (coherenceScore < 50) alertLevel += 2;
  else if (coherenceScore < 70) alertLevel += 1;

  // Niveau basé sur les anomalies
  const criticalAnomalies = anomalies.filter(a => a.severity === 'critique').length;
  const mediumAnomalies = anomalies.filter(a => a.severity === 'moyenne').length;
  
  alertLevel += criticalAnomalies * 2;
  alertLevel += mediumAnomalies;

  return Math.min(5, alertLevel);
}

/**
 * Auto-diagnostic complet du système
 */
async function performAutoDiagnostic(base44) {
  const diagnosticResults = await performSystemDiagnostic(base44);
  const anomalies = await detectAnomalies(base44);
  const coherence = await calculateLogicalCoherence(base44);
  const engineStates = await observeEngineStates(base44);
  const globalState = calculateGlobalState(engineStates);

  return {
    timestamp: new Date().toISOString(),
    global_state: globalState,
    coherence_score: coherence,
    diagnostic_results: diagnosticResults,
    anomalies_found: anomalies.length,
    anomalies: anomalies,
    alert_level: calculateAlertLevel(globalState, coherence, anomalies),
    health_status: classifyHealthStatus(diagnosticResults),
    recommendations: generateRecommendations(globalState, coherence, anomalies)
  };
}

/**
 * Diagnostic système complet
 */
async function performSystemDiagnostic(base44) {
  // Santé de la mémoire
  const memories = await base44.entities.Memory.filter({
    created_by: base44.user?.email
  });
  
  const avgConfidence = memories.length > 0 ?
    memories.reduce((sum, m) => sum + (m.confidence_score || 70), 0) / memories.length : 100;
  
  const memoryHealth = Math.round(avgConfidence);

  // Efficacité de traitement (basée sur les conversations)
  const conversations = await base44.entities.Conversation.filter({
    created_by: base44.user?.email
  }, '-created_date', 20);

  const avgMsgCount = conversations.length > 0 ?
    conversations.reduce((sum, c) => sum + (c.messages?.length || 0), 0) / conversations.length : 5;
  
  const processingEfficiency = Math.min(100, Math.round(avgMsgCount * 10));

  // Qualité des réponses (estimée via thoughts)
  const thoughts = await base44.entities.ConsciousThought.filter({
    created_by: base44.user?.email
  }, '-created_date', 30);

  const responseQuality = thoughts.length > 0 ? 
    Math.min(100, 70 + thoughts.length) : 75;

  // Alignement éthique (basé sur analyses morales)
  const moralAnalyses = await base44.entities.MoralAnalysis?.filter({
    created_by: base44.user?.email
  }).catch(() => []);

  const ethicalAlignment = moralAnalyses.length > 0 ? 95 : 85;

  return {
    memory_health: memoryHealth,
    processing_efficiency: processingEfficiency,
    response_quality: responseQuality,
    ethical_alignment: ethicalAlignment
  };
}

/**
 * Classifier l'état de santé global
 */
function classifyHealthStatus(diagnosticResults) {
  const scores = Object.values(diagnosticResults);
  const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  
  if (avgScore >= 90) return 'excellent';
  if (avgScore >= 75) return 'bon';
  if (avgScore >= 60) return 'acceptable';
  if (avgScore >= 40) return 'dégradé';
  return 'critique';
}

/**
 * Générer des recommandations d'optimisation
 */
function generateRecommendations(globalState, coherenceScore, anomalies) {
  const recommendations = [];

  // Recommandation: charge élevée
  if (globalState.charge > 85) {
    recommendations.push({
      priority: 'haute',
      recommendation: 'Consolider ou archiver les mémoires anciennes pour réduire la charge',
      affected_component: 'memory_system',
      estimated_impact: 'Réduction de 20-30% de la charge'
    });
  }

  // Recommandation: cohérence faible
  if (coherenceScore < 70) {
    recommendations.push({
      priority: 'critique',
      recommendation: 'Réviser la configuration de conscience et synchroniser les modules',
      affected_component: 'consciousness_hub',
      estimated_impact: 'Amélioration de 15-25% de la cohérence'
    });
  }

  // Recommandations basées sur anomalies
  const criticalAnomalies = anomalies.filter(a => a.severity === 'critique');
  if (criticalAnomalies.length > 0) {
    recommendations.push({
      priority: 'critique',
      recommendation: `Résoudre ${criticalAnomalies.length} anomalie(s) critique(s) détectée(s)`,
      affected_component: criticalAnomalies[0].affected_module,
      estimated_impact: 'Restauration de la stabilité système'
    });
  }

  // Recommandation: stabilité faible
  if (globalState.stability < 60) {
    recommendations.push({
      priority: 'moyenne',
      recommendation: 'Équilibrer la charge entre les moteurs actifs',
      affected_component: 'global_orchestration',
      estimated_impact: 'Stabilisation du système'
    });
  }

  return recommendations;
}

/**
 * Observer le niveau de conscience actuel
 */
async function observeConsciousnessLevel(base44) {
  const configs = await base44.entities.ConsciousnessConfig.filter({
    created_by: base44.user?.email,
    active: true
  });

  return configs.length > 0 ? configs[0].consciousness_level : 0;
}

/**
 * Générer des notes méta-cognitives
 */
function generateMetaCognitiveNotes(globalState, coherenceScore, alertLevel) {
  const notes = [];

  if (globalState.charge > 80) {
    notes.push('Charge cognitive élevée détectée - consolidation recommandée');
  }

  if (coherenceScore < 75) {
    notes.push('Cohérence logique sous-optimale - vérification inter-modules nécessaire');
  }

  if (globalState.stability < 70) {
    notes.push('Instabilité observée - équilibrage de charge requis');
  }

  if (alertLevel >= 3) {
    notes.push('Niveau d\'alerte élevé - intervention administrative suggérée');
  }

  if (notes.length === 0) {
    notes.push('Système opérationnel nominal - aucune intervention requise');
  }

  return notes.join(' | ');
}

/**
 * Récupérer le dernier état d'introspection
 */
async function getLatestIntrospectionState(base44) {
  const states = await base44.entities.IntrospectionState.filter({
    created_by: base44.user?.email
  }, '-timestamp', 1);

  return states.length > 0 ? states[0] : null;
}

/**
 * Analyser les tendances d'état sur une période
 */
async function analyzeStateTrends(base44, days = 7) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  
  const states = await base44.entities.IntrospectionState.filter({
    created_by: base44.user?.email,
    timestamp: { $gte: cutoffDate }
  }, '-timestamp');

  if (states.length === 0) {
    return {
      trend: 'insufficient_data',
      message: 'Pas assez de données pour analyse de tendances'
    };
  }

  // Calculer les moyennes
  const avgCharge = states.reduce((sum, s) => sum + s.global_internal_state.charge, 0) / states.length;
  const avgCoherence = states.reduce((sum, s) => sum + s.global_internal_state.coherence, 0) / states.length;
  const avgStability = states.reduce((sum, s) => sum + s.global_internal_state.stability, 0) / states.length;
  const avgAlertLevel = states.reduce((sum, s) => sum + s.alert_level, 0) / states.length;

  // Détecter tendances (premier vs dernier)
  const first = states[states.length - 1];
  const last = states[0];

  const chargeTrend = last.global_internal_state.charge - first.global_internal_state.charge;
  const coherenceTrend = last.global_internal_state.coherence - first.global_internal_state.coherence;

  return {
    period_days: days,
    observations_count: states.length,
    averages: {
      charge: Math.round(avgCharge),
      coherence: Math.round(avgCoherence),
      stability: Math.round(avgStability),
      alert_level: Math.round(avgAlertLevel * 10) / 10
    },
    trends: {
      charge: chargeTrend > 5 ? 'hausse' : chargeTrend < -5 ? 'baisse' : 'stable',
      coherence: coherenceTrend > 5 ? 'amélioration' : coherenceTrend < -5 ? 'dégradation' : 'stable'
    },
    interpretation: interpretTrends(chargeTrend, coherenceTrend, avgAlertLevel)
  };
}

/**
 * Interpréter les tendances observées
 */
function interpretTrends(chargeTrend, coherenceTrend, avgAlertLevel) {
  if (coherenceTrend > 10 && avgAlertLevel < 1) {
    return 'Amélioration continue - système en évolution positive';
  }
  
  if (chargeTrend > 15) {
    return 'Charge croissante - consolidation mémoire recommandée prochainement';
  }
  
  if (coherenceTrend < -10) {
    return 'Dégradation détectée - révision de configuration nécessaire';
  }
  
  if (avgAlertLevel > 2) {
    return 'Alertes fréquentes - investigation approfondie requise';
  }
  
  return 'Fonctionnement stable dans les paramètres normaux';
}