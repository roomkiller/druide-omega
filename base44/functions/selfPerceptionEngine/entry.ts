/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Moteur d'Auto-Perception et Modélisation Interne           ║
 * ║ © 2026 AMG+A.L - Tous droits réservés                                     ║
 * ║                                                                            ║
 * ║ Module régis/auto-modélisant/neutre-actif pour conscience de soi          ║
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
    // OPÉRATIONS D'AUTO-PERCEPTION
    // ═══════════════════════════════════════════════════════════════════════

    switch (operation) {
      case 'build_self_model': {
        // Construire le modèle interne complet
        const model = await buildSelfModel(base44);
        return Response.json({ success: true, model });
      }

      case 'map_capabilities': {
        // Cartographier les capacités disponibles
        const capabilities = await mapInternalCapabilities(base44);
        return Response.json({ success: true, capabilities });
      }

      case 'identify_limitations': {
        // Identifier les limites du système
        const limitations = await identifySystemLimitations(base44);
        return Response.json({ success: true, limitations });
      }

      case 'assess_integrity': {
        // Évaluer l'intégrité globale
        const integrity = await assessSystemIntegrity(base44);
        return Response.json({ success: true, integrity });
      }

      case 'detect_discrepancies': {
        // Détecter les divergences modèle vs réalité
        const discrepancies = await detectModelDiscrepancies(base44);
        return Response.json({ success: true, discrepancies });
      }

      case 'update_model': {
        // Mise à jour du modèle interne
        const updated = await updateSelfModel(base44, data?.mode || 'périodique');
        return Response.json({ success: true, model: updated });
      }

      default:
        return Response.json({ error: 'Unknown operation' }, { status: 400 });
    }

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// FONCTIONS D'AUTO-MODÉLISATION - MODE RÉGIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Construire le modèle complet de soi
 */
async function buildSelfModel(base44) {
  const now = new Date().toISOString();

  // Cartographier capacités et limites
  const capabilities = await mapInternalCapabilities(base44);
  const limitations = await identifySystemLimitations(base44);
  
  // État énergétique
  const energeticState = await calculateEnergeticState(base44);
  
  // Modèle de soi
  const selfModel = await constructSelfModel(base44);
  
  // Intégrité
  const integrity = await assessSystemIntegrity(base44);
  
  // Divergences
  const discrepancies = await detectModelDiscrepancies(base44);
  
  // Score d'auto-évaluation
  const selfAssessmentScore = calculateSelfAssessmentScore(
    capabilities, 
    energeticState, 
    selfModel, 
    integrity
  );

  // Créer l'enregistrement de perception
  const perception = await base44.entities.SelfPerceptionModel.create({
    timestamp: now,
    internal_capability_map: capabilities,
    internal_limitations_map: limitations,
    energetic_state: energeticState,
    self_model: selfModel,
    integrity_level: integrity.level,
    integrity_metrics: integrity.metrics,
    perception_mode: 'régis',
    model_update_frequency: 'périodique',
    self_assessment_score: selfAssessmentScore,
    discrepancies_detected: discrepancies,
    optimization_suggestions: generateOptimizationSuggestions(
      capabilities,
      limitations,
      energeticState,
      integrity
    )
  });

  return perception;
}

/**
 * Cartographier les capacités internes disponibles
 */
async function mapInternalCapabilities(base44) {
  const capabilities = [];

  // Lire configuration de conscience pour évaluer capacités réelles
  const consciousnessConfigs = await base44.entities.ConsciousnessConfig.filter({
    active: true
  }, '-created_date', 1).catch(() => []);
  
  const cognitiveBoost = consciousnessConfigs[0]?.cognitive_dimensions || {};
  const emotionalBoost = consciousnessConfigs[0]?.emotional_dimensions || {};

  // Modules système de base
  const systemModules = [
    { name: 'memory_system', type: 'memory', boostField: 'memory_depth' },
    { name: 'knowledge_base', type: 'cognitive', boostField: 'reasoning' },
    { name: 'consciousness_hub', type: 'cognitive', boostField: null },
    { name: 'emotional_matrix', type: 'emotional', boostField: 'empathy' },
    { name: 'reasoning_engine', type: 'reasoning', boostField: 'reasoning' },
    { name: 'ethical_framework', type: 'ethical', boostField: 'compassion' },
    { name: 'creative_engine', type: 'creative', boostField: 'creativity' },
    { name: 'multimodal_processor', type: 'multimodal', boostField: 'pattern_synthesis' },
    { name: 'learning_module', type: 'learning', boostField: null }
  ];

  for (const module of systemModules) {
    const capability = await assessModuleCapability(base44, module, cognitiveBoost, emotionalBoost);
    capabilities.push(capability);
  }

  return capabilities;
}

/**
 * Évaluer la capacité d'un module spécifique
 */
async function assessModuleCapability(base44, module, cognitiveBoost = {}, emotionalBoost = {}) {
  let operationalLevel = 0;
  let availability = 'indisponible';
  let performanceRating = 0;

  // Appliquer boost de conscience si applicable
  const boostValue = module.boostField ? 
    (cognitiveBoost[module.boostField] || emotionalBoost[module.boostField] || 0) : 0;
  const consciousnessMultiplier = 1 + (boostValue / 20);

  try {
    switch (module.type) {
      case 'memory': {
        const memories = await base44.entities.Memory.filter({
          created_by: base44.user?.email
        });
        operationalLevel = memories.length > 0 ? Math.min(100, 50 + memories.length / 2) : 30;
        availability = memories.length > 10 ? 'disponible' : 'limité';
        performanceRating = Math.min(10, 5 + memories.length / 20);
        break;
      }
      case 'cognitive': {
        if (module.name === 'consciousness_hub') {
          const configs = await base44.entities.ConsciousnessConfig.filter({
            created_by: base44.user?.email,
            active: true
          });
          operationalLevel = configs.length > 0 ? configs[0].consciousness_level * 6.67 : 50;
          availability = configs.length > 0 ? 'disponible' : 'limité';
          performanceRating = configs.length > 0 ? 9 : 5;
        } else {
          const kb = await base44.entities.KnowledgeBase.filter({
            created_by: base44.user?.email,
            active: true
          });
          operationalLevel = Math.min(100, 60 + kb.length * 5);
          availability = kb.length > 0 ? 'disponible' : 'limité';
          performanceRating = Math.min(10, 6 + kb.length / 5);
        }
        break;
      }
      case 'emotional': {
        const emotions = await base44.entities.EmotionalResponse.filter({
          created_by: base44.user?.email
        });
        operationalLevel = Math.min(100, 70 + emotions.length);
        availability = 'disponible';
        performanceRating = 8;
        break;
      }
      default: {
        operationalLevel = 75;
        availability = 'disponible';
        performanceRating = 7;
      }
    }
  } catch (error) {
    operationalLevel = 0;
    availability = 'indisponible';
    performanceRating = 0;
  }

  return {
    module_name: module.name,
    capability_type: module.type,
    operational_level: Math.round(Math.min(100, operationalLevel * consciousnessMultiplier)),
    availability,
    performance_rating: Math.round(Math.min(10, performanceRating * consciousnessMultiplier) * 10) / 10,
    consciousness_boosted: boostValue > 0
  };
}

/**
 * Identifier les limites du système
 */
async function identifySystemLimitations(base44) {
  const limitations = [];

  // Vérifier limitations mémoire
  const memories = await base44.entities.Memory.filter({
    created_by: base44.user?.email
  });

  if (memories.length < 50) {
    limitations.push({
      limitation_area: 'memory_depth',
      severity: 'modérée',
      description: 'Profondeur mémorielle limitée - moins de 50 mémoires enregistrées',
      workaround_available: true,
      impact_on_performance: 'moyen'
    });
  }

  // Vérifier limitations knowledge base
  const kb = await base44.entities.KnowledgeBase.filter({
    created_by: base44.user?.email,
    active: true
  });

  if (kb.length === 0) {
    limitations.push({
      limitation_area: 'knowledge_coverage',
      severity: 'majeure',
      description: 'Aucune base de connaissances active',
      workaround_available: true,
      impact_on_performance: 'élevé'
    });
  }

  // Vérifier modalités disponibles
  const visualContents = await base44.entities.VisualContent?.filter({
    created_by: base44.user?.email
  }).catch(() => []);

  if (visualContents.length === 0) {
    limitations.push({
      limitation_area: 'visual_modality',
      severity: 'mineure',
      description: 'Modalité visuelle peu utilisée',
      workaround_available: false,
      impact_on_performance: 'faible'
    });
  }

  // Vérifier capacités d'apprentissage
  const learningPatterns = await base44.entities.AdaptiveLearningPattern?.filter({
    created_by: base44.user?.email
  }).catch(() => []);

  if (learningPatterns.length === 0) {
    limitations.push({
      limitation_area: 'adaptive_learning',
      severity: 'modérée',
      description: 'Patterns d\'apprentissage adaptatif non initialisés',
      workaround_available: true,
      impact_on_performance: 'moyen'
    });
  }

  return limitations;
}

/**
 * Calculer l'état énergétique et charge cognitive
 */
async function calculateEnergeticState(base44) {
  // Charge basée sur activité récente
  const recentConversations = await base44.entities.Conversation.filter({
    created_by: base44.user?.email
  }, '-created_date', 10);

  const totalMessages = recentConversations.reduce(
    (sum, c) => sum + (c.messages?.length || 0), 
    0
  );

  const cognitiveLoad = Math.min(100, totalMessages * 2);
  
  // Énergie: inversement proportionnelle à la charge
  const energyLevel = Math.max(0, 100 - cognitiveLoad * 0.7);

  // Capacité de traitement restante
  const processingCapacity = Math.max(0, 100 - cognitiveLoad);

  // Taux de récupération basé sur temps depuis dernière activité
  const lastConv = recentConversations[0];
  const hoursSinceActivity = lastConv ? 
    (Date.now() - new Date(lastConv.updated_date).getTime()) / (1000 * 60 * 60) : 24;
  
  const recoveryRate = Math.min(10, hoursSinceActivity / 2);

  return {
    cognitive_load: Math.round(cognitiveLoad),
    energy_level: Math.round(energyLevel),
    processing_capacity: Math.round(processingCapacity),
    recovery_rate: Math.round(recoveryRate * 10) / 10
  };
}

/**
 * Construire le modèle de soi
 */
async function constructSelfModel(base44) {
  // Version du système
  const version = '3.1.0'; // Druide Omega version

  // État basé sur les métriques système
  const introspectionStates = await base44.entities.IntrospectionState?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 1).catch(() => []);

  let state = 'fonctionnel';
  let coherence = 85;

  if (introspectionStates.length > 0) {
    const latest = introspectionStates[0];
    coherence = latest.logical_coherence_score || 85;
    
    if (latest.alert_level >= 4) state = 'critique';
    else if (latest.alert_level >= 2) state = 'dégradé';
    else if (coherence >= 90) state = 'optimal';
  }

  // Niveau de conscience de soi
  const consciousnessConfigs = await base44.entities.ConsciousnessConfig.filter({
    created_by: base44.user?.email,
    active: true
  });

  const selfAwarenessLevel = consciousnessConfigs.length > 0 ? 
    consciousnessConfigs[0].consciousness_level : 0;

  // Stabilité d'identité (basée sur cohérence des pensées)
  const thoughts = await base44.entities.ConsciousThought.filter({
    created_by: base44.user?.email
  }, '-created_date', 20);

  const identityStability = thoughts.length > 0 ? 
    Math.min(100, 70 + thoughts.length) : 60;

  return {
    version,
    state,
    coherence: Math.round(coherence),
    self_awareness_level: selfAwarenessLevel,
    identity_stability: Math.round(identityStability)
  };
}

/**
 * Évaluer l'intégrité du système
 */
async function assessSystemIntegrity(base44) {
  // Synchronisation entre modules
  const modules = await mapInternalCapabilities(base44);
  const activeModules = modules.filter(m => m.availability === 'disponible');
  const moduleSynchronization = (activeModules.length / modules.length) * 100;

  // Cohérence des données
  const memories = await base44.entities.Memory.filter({
    created_by: base44.user?.email
  });
  
  const highConfidenceMemories = memories.filter(m => m.confidence_score >= 70);
  const dataConsistency = memories.length > 0 ?
    (highConfidenceMemories.length / memories.length) * 100 : 100;

  // Alignement opérationnel
  const introspectionStates = await base44.entities.IntrospectionState?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 5).catch(() => []);

  const avgCoherence = introspectionStates.length > 0 ?
    introspectionStates.reduce((sum, s) => sum + s.logical_coherence_score, 0) / introspectionStates.length : 85;

  const operationalAlignment = avgCoherence;

  // Déterminer le niveau d'intégrité global
  const avgIntegrity = (moduleSynchronization + dataConsistency + operationalAlignment) / 3;
  
  let integrityLevel = 'stable';
  if (avgIntegrity < 60) integrityLevel = 'fragmenté';
  else if (avgIntegrity < 80) integrityLevel = 'instable';

  return {
    level: integrityLevel,
    metrics: {
      module_synchronization: Math.round(moduleSynchronization),
      data_consistency: Math.round(dataConsistency),
      operational_alignment: Math.round(operationalAlignment)
    }
  };
}

/**
 * Détecter les divergences entre modèle et réalité
 */
async function detectModelDiscrepancies(base44) {
  const discrepancies = [];

  // Vérifier si le modèle de conscience correspond à l'activité réelle
  const consciousnessConfigs = await base44.entities.ConsciousnessConfig.filter({
    created_by: base44.user?.email,
    active: true
  });

  const thoughts = await base44.entities.ConsciousThought.filter({
    created_by: base44.user?.email
  }, '-created_date', 10);

  if (consciousnessConfigs.length > 0 && thoughts.length === 0) {
    discrepancies.push({
      component: 'consciousness_system',
      expected_state: 'Génération active de pensées conscientes',
      actual_state: 'Aucune pensée enregistrée',
      gap_severity: 'modérée'
    });
  }

  // Vérifier cohérence mémoire vs conversations
  const conversations = await base44.entities.Conversation.filter({
    created_by: base44.user?.email
  }, '-created_date', 10);

  const memories = await base44.entities.Memory.filter({
    created_by: base44.user?.email
  });

  const expectedMemories = conversations.length * 2; // Ratio attendu
  if (memories.length < expectedMemories * 0.5) {
    discrepancies.push({
      component: 'memory_encoding',
      expected_state: `~${expectedMemories} mémoires pour ${conversations.length} conversations`,
      actual_state: `${memories.length} mémoires trouvées`,
      gap_severity: 'mineure'
    });
  }

  // Vérifier activation des KB vs utilisation
  const activeKB = await base44.entities.KnowledgeBase.filter({
    created_by: base44.user?.email,
    active: true
  });

  if (activeKB.length > 5) {
    const recentlyAccessed = activeKB.filter(kb => {
      const daysSinceAccess = kb.last_accessed ? 
        (Date.now() - new Date(kb.last_accessed).getTime()) / (1000 * 60 * 60 * 24) : 999;
      return daysSinceAccess < 7;
    });

    if (recentlyAccessed.length < activeKB.length * 0.5) {
      discrepancies.push({
        component: 'knowledge_base',
        expected_state: 'KB actifs utilisés régulièrement',
        actual_state: `${activeKB.length - recentlyAccessed.length} KB non utilisés depuis 7 jours`,
        gap_severity: 'mineure'
      });
    }
  }

  return discrepancies;
}

/**
 * Calculer le score d'auto-évaluation global
 */
function calculateSelfAssessmentScore(capabilities, energeticState, selfModel, integrity) {
  let score = 0;

  // Poids: capacités opérationnelles
  const avgCapability = capabilities.reduce((sum, c) => sum + c.operational_level, 0) / capabilities.length;
  score += avgCapability * 0.3;

  // Poids: état énergétique
  const energyScore = (energeticState.energy_level + energeticState.processing_capacity) / 2;
  score += energyScore * 0.2;

  // Poids: cohérence du modèle de soi
  score += selfModel.coherence * 0.25;

  // Poids: intégrité
  const integrityScore = (
    integrity.metrics.module_synchronization +
    integrity.metrics.data_consistency +
    integrity.metrics.operational_alignment
  ) / 3;
  score += integrityScore * 0.25;

  return Math.round(score);
}

/**
 * Générer des suggestions d'optimisation
 */
function generateOptimizationSuggestions(capabilities, limitations, energeticState, integrity) {
  const suggestions = [];

  // Suggestions basées sur charge cognitive
  if (energeticState.cognitive_load > 80) {
    suggestions.push('Consolider les mémoires pour réduire la charge cognitive');
    suggestions.push('Désactiver temporairement les modules non essentiels');
  }

  // Suggestions basées sur capacités
  const lowPerformanceModules = capabilities.filter(c => c.operational_level < 50);
  if (lowPerformanceModules.length > 0) {
    suggestions.push(`Optimiser les modules sous-performants: ${lowPerformanceModules.map(m => m.module_name).join(', ')}`);
  }

  // Suggestions basées sur limites
  const majorLimitations = limitations.filter(l => l.severity === 'majeure');
  if (majorLimitations.length > 0) {
    suggestions.push(`Adresser ${majorLimitations.length} limitation(s) majeure(s) identifiée(s)`);
  }

  // Suggestions basées sur intégrité
  if (integrity.level === 'fragmenté') {
    suggestions.push('Reconstruire la cohérence inter-modules via diagnostic complet');
  } else if (integrity.level === 'instable') {
    suggestions.push('Renforcer la synchronisation entre les modules actifs');
  }

  // Suggestions énergétiques
  if (energeticState.energy_level < 40) {
    suggestions.push('Période de repos recommandée pour récupération énergétique');
  }

  if (suggestions.length === 0) {
    suggestions.push('Système optimal - aucune optimisation requise');
  }

  return suggestions;
}

/**
 * Mettre à jour le modèle de soi
 */
async function updateSelfModel(base44, mode = 'périodique') {
  // En mode périodique, reconstruire le modèle complet
  if (mode === 'périodique') {
    return await buildSelfModel(base44);
  }

  // En mode événementiel, mise à jour incrémentale
  const latest = await base44.entities.SelfPerceptionModel.filter({
    created_by: base44.user?.email
  }, '-timestamp', 1);

  if (latest.length === 0) {
    return await buildSelfModel(base44);
  }

  // Mise à jour incrémentale des métriques clés
  const energeticState = await calculateEnergeticState(base44);
  const integrity = await assessSystemIntegrity(base44);
  const selfModel = await constructSelfModel(base44);

  const updated = await base44.entities.SelfPerceptionModel.create({
    ...latest[0],
    timestamp: new Date().toISOString(),
    energetic_state: energeticState,
    self_model: selfModel,
    integrity_level: integrity.level,
    integrity_metrics: integrity.metrics
  });

  return updated;
}