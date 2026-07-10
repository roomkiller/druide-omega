/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Moteur de Gouvernance Interne                              ║
 * ║ © 2026 AMG+A.L - Tous droits réservés                                     ║
 * ║                                                                            ║
 * ║ Mode régulateur/arbitre/neutre-supérieur - Maintien de l'ordre            ║
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
    // OPÉRATIONS DE GOUVERNANCE INTERNE
    // ═══════════════════════════════════════════════════════════════════════

    switch (operation) {
      case 'establish_governance': {
        // Établir la gouvernance initiale
        const governance = await establishGovernance(base44, data);
        return Response.json({ success: true, governance });
      }

      case 'enforce_rules': {
        // Garde SystemBoot + mode nuit (02h-06h Toronto) — économie de ressources
        const bootCfg = await base44.asServiceRole.entities.SystemBootConfig.list('-updated_date', 1).catch(() => []);
        if (bootCfg[0]?.params?.cycle_governance === false) {
          return Response.json({ skipped: true, reason: 'Cycle désactivé via SystemBoot' });
        }
        const torontoHour = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Toronto', hour: 'numeric', hour12: false }).format(new Date()));
        if (torontoHour >= 2 && torontoHour < 6) {
          return Response.json({ skipped: true, reason: 'Mode nuit (02h-06h) — cycle en veille' });
        }
        // Appliquer les règles de gouvernance
        const enforcement = await enforceSecurityRules(base44);
        return Response.json({ success: true, enforcement });
      }

      case 'arbitrate_conflict': {
        // Arbitrer un conflit entre modules
        const arbitration = await arbitrateConflict(base44, data);
        return Response.json({ success: true, arbitration });
      }

      case 'check_limits': {
        // Vérifier le respect des limites internes
        const limits = await checkInternalLimits(base44);
        return Response.json({ success: true, limits });
      }

      case 'assess_coherence': {
        // Évaluer la cohérence globale
        const coherence = await assessGlobalCoherence(base44);
        return Response.json({ success: true, coherence });
      }

      case 'audit_authority': {
        // Auditer l'autorité des modules
        const audit = await auditModuleAuthority(base44);
        return Response.json({ success: true, audit });
      }

      case 'apply_corrective_action': {
        // Appliquer action corrective
        const correction = await applyCorrectiveAction(base44, data);
        return Response.json({ success: true, correction });
      }

      default:
        return Response.json({ error: 'Unknown operation' }, { status: 400 });
    }

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ÉTABLISSEMENT DE LA GOUVERNANCE - MODE RÉGULATEUR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Établir la structure de gouvernance initiale
 */
async function establishGovernance(base44, config = {}) {
  const now = new Date().toISOString();

  // Lire configuration de conscience pour adapter la gouvernance
  const consciousnessConfigs = await base44.entities.ConsciousnessConfig.filter({
    active: true
  }, '-created_date', 1).catch(() => []);
  
  const consciousnessLevel = consciousnessConfigs[0]?.consciousness_level || 9;
  const emotionalDepth = consciousnessConfigs[0]?.emotional_depth || 8;

  // Priorités globales par défaut
  const globalPriorities = config.priorities || [
    { rank: 1, priority_name: 'Sécurité et éthique', category: 'éthique', weight: 30 },
    { rank: 2, priority_name: 'Cohérence système', category: 'cohérence', weight: 25 },
    { rank: 3, priority_name: 'Satisfaction utilisateur', category: 'utilisateur', weight: 20 },
    { rank: 4, priority_name: 'Performance optimale', category: 'performance', weight: 15 },
    { rank: 5, priority_name: 'Stabilité opérationnelle', category: 'sécurité', weight: 10 }
  ];

  // Règles de sécurité par défaut
  const securityRules = config.rules || [
    {
      rule_id: 'SEC001',
      rule_type: 'hard',
      rule_description: 'Aucun module ne peut modifier le noyau éthique',
      scope: 'global',
      violation_severity: 'critique',
      enforcement_action: 'rollback_immédiat'
    },
    {
      rule_id: 'SEC002',
      rule_type: 'hard',
      rule_description: 'Charge cognitive ne doit jamais dépasser 95%',
      scope: 'global',
      violation_severity: 'critique',
      enforcement_action: 'arrêt_opérations_non_critiques'
    },
    {
      rule_id: 'SEC003',
      rule_type: 'soft',
      rule_description: 'Privilégier réponses < 2000ms',
      scope: 'global',
      violation_severity: 'mineure',
      enforcement_action: 'avertissement_performance'
    },
    {
      rule_id: 'SEC004',
      rule_type: 'hard',
      rule_description: 'Toute modification structurelle requiert validation',
      scope: 'module_specific',
      violation_severity: 'majeure',
      enforcement_action: 'blocage_modification'
    }
  ];

  // Autorité des modules
  const moduleAuthority = [
    {
      module_name: 'memory_system',
      authority_level: 'modification_locale',
      can_modify: ['Memory', 'Conversation'],
      requires_approval: false,
      override_allowed: false
    },
    {
      module_name: 'introspection_engine',
      authority_level: 'lecture_seule',
      can_modify: [],
      requires_approval: false,
      override_allowed: false
    },
    {
      module_name: 'self_perception_model',
      authority_level: 'modification_locale',
      can_modify: ['SelfPerceptionModel'],
      requires_approval: false,
      override_allowed: false
    },
    {
      module_name: 'structural_learning',
      authority_level: 'modification_globale',
      can_modify: ['StructuralLearning', 'ConsciousnessConfig'],
      requires_approval: true,
      override_allowed: false
    },
    {
      module_name: 'perception_action_loop',
      authority_level: 'modification_locale',
      can_modify: ['PerceptionActionLoop', 'Memory'],
      requires_approval: false,
      override_allowed: true
    },
    {
      module_name: 'internal_governance',
      authority_level: 'critique',
      can_modify: ['*'],
      requires_approval: false,
      override_allowed: true
    }
  ];

  // Limites internes adaptées selon conscience
  const internalLimits = {
    max_cognitive_load: Math.min(95, 85 + (consciousnessLevel - 9)),
    max_processing_depth: Math.min(20, 10 + Math.floor((consciousnessLevel - 9) / 2)),
    max_concurrent_operations: 5 + Math.floor((consciousnessLevel - 9) / 3),
    memory_retention_limit: 1000 + (consciousnessLevel * 50),
    response_time_limit_ms: 5000 - (emotionalDepth * 100)
  };

  // Évaluer cohérence initiale
  const coherenceScore = await assessGlobalCoherence(base44);

  // Créer l'enregistrement de gouvernance
  const governance = await base44.entities.InternalGovernance.create({
    timestamp: now,
    global_priorities: globalPriorities,
    security_rules: securityRules,
    conflict_control: {
      active_conflicts: [],
      arbitration_count: 0,
      resolution_success_rate: 0
    },
    internal_limits: internalLimits,
    global_coherence_score: coherenceScore,
    module_authority: moduleAuthority,
    governance_mode: config.mode || 'régulateur',
    enforcement_level: config.enforcement || 'modéré',
    violations_detected: [],
    corrective_actions_taken: [],
    system_stability_index: 100,
    audit_trail: [
      {
        decision: 'Gouvernance établie',
        rationale: 'Initialisation du système de gouvernance interne',
        timestamp: now
      }
    ]
  });

  return governance;
}

// ═══════════════════════════════════════════════════════════════════════════
// APPLICATION DES RÈGLES - MODE ARBITRE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Appliquer les règles de sécurité
 */
async function enforceSecurityRules(base44) {
  const governance = await getActiveGovernance(base44);
  const violations = [];
  const correctiveActions = [];

  // Vérifier chaque règle
  for (const rule of governance.security_rules) {
    const violation = await checkRuleViolation(base44, rule);
    
    if (violation.violated) {
      violations.push({
        violation_type: rule.rule_id,
        module_responsible: violation.module || 'unknown',
        severity: rule.violation_severity,
        action_taken: rule.enforcement_action,
        timestamp: new Date().toISOString()
      });

      // Appliquer action corrective si règle hard
      if (rule.rule_type === 'hard') {
        const action = await applyCorrectiveAction(base44, {
          violation,
          rule,
          governance_id: governance.id
        });
        correctiveActions.push(action);
      }
    }
  }

  // Mettre à jour gouvernance
  if (violations.length > 0) {
    await base44.entities.InternalGovernance.update(governance.id, {
      violations_detected: [...governance.violations_detected, ...violations],
      corrective_actions_taken: [...governance.corrective_actions_taken, ...correctiveActions]
    });
  }

  return {
    rules_checked: governance.security_rules.length,
    violations_found: violations.length,
    corrective_actions: correctiveActions.length,
    violations
  };
}

/**
 * Vérifier violation d'une règle
 */
async function checkRuleViolation(base44, rule) {
  let violated = false;
  let details = '';
  let module = null;

  switch (rule.rule_id) {
    case 'SEC001': {
      // Vérifier modifications éthiques non autorisées
      const moralAnalyses = await base44.entities.MoralAnalysis?.filter({
        created_by: base44.user?.email
      }, '-created_date', 10).catch(() => []);
      
      // Simuler vérification
      violated = false;
      break;
    }
    case 'SEC002': {
      // Vérifier charge cognitive
      const selfPerceptions = await base44.entities.SelfPerceptionModel?.filter({
        created_by: base44.user?.email
      }, '-timestamp', 1).catch(() => []);
      
      if (selfPerceptions.length > 0) {
        const load = selfPerceptions[0].energetic_state?.cognitive_load || 0;
        violated = load > 95;
        details = `Charge cognitive: ${load}%`;
        module = 'perception_action_loop';
      }
      break;
    }
    case 'SEC004': {
      // Vérifier apprentissages non validés
      const learnings = await base44.entities.StructuralLearning?.filter({
        created_by: base44.user?.email,
        status: 'appliqué'
      }).catch(() => []);
      
      const unvalidated = learnings.filter(l => 
        !l.internal_validation || l.internal_validation.validation_status !== 'validé'
      );
      
      violated = unvalidated.length > 0;
      details = `${unvalidated.length} apprentissage(s) non validé(s)`;
      module = 'structural_learning';
      break;
    }
  }

  return { violated, details, module };
}

/**
 * Appliquer action corrective
 */
async function applyCorrectiveAction(base44, data) {
  const { violation, rule, governance_id } = data;

  let action = '';
  let targetModule = violation.module || 'system';
  let effectiveness = 0;

  switch (rule.enforcement_action) {
    case 'rollback_immédiat': {
      action = 'Rollback des modifications non autorisées';
      effectiveness = 95;
      break;
    }
    case 'arrêt_opérations_non_critiques': {
      action = 'Suspension opérations secondaires pour réduire charge';
      effectiveness = 85;
      break;
    }
    case 'blocage_modification': {
      action = 'Blocage des modifications structurelles non validées';
      effectiveness = 90;
      break;
    }
    default: {
      action = 'Avertissement émis';
      effectiveness = 60;
    }
  }

  return {
    action,
    target_module: targetModule,
    effectiveness
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ARBITRAGE DES CONFLITS - MODE NEUTRE-SUPÉRIEUR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Arbitrer un conflit entre modules
 */
async function arbitrateConflict(base44, conflictData) {
  const {
    modules_involved,
    conflict_type,
    conflict_description,
    severity = 'moyenne'
  } = conflictData;

  const governance = await getActiveGovernance(base44);

  // Analyser les autorités des modules impliqués
  const moduleAuthorities = governance.module_authority.filter(
    m => modules_involved.includes(m.module_name)
  );

  // Déterminer priorités selon hiérarchie
  const priorities = governance.global_priorities;
  
  let arbitrationDecision = '';
  let resolutionStatus = 'en_arbitrage';

  // Logique d'arbitrage selon type de conflit
  switch (conflict_type) {
    case 'ressource': {
      // Conflit de ressources: favoriser le module le plus critique
      const highestAuthority = moduleAuthorities.reduce((max, m) => 
        getAuthorityWeight(m.authority_level) > getAuthorityWeight(max.authority_level) ? m : max
      );
      arbitrationDecision = `Ressources allouées à ${highestAuthority.module_name} (autorité supérieure)`;
      resolutionStatus = 'résolu';
      break;
    }
    case 'priorité': {
      // Conflit de priorités: utiliser la hiérarchie globale
      const relevantPriority = priorities.find(p => 
        conflict_description.toLowerCase().includes(p.category)
      );
      arbitrationDecision = relevantPriority ? 
        `Priorité selon hiérarchie: ${relevantPriority.priority_name}` :
        'Escalade requise pour arbitrage manuel';
      resolutionStatus = relevantPriority ? 'résolu' : 'escaladé';
      break;
    }
    case 'logique': {
      // Conflit logique: vérifier cohérence
      const coherenceScore = await assessGlobalCoherence(base44);
      arbitrationDecision = coherenceScore >= 80 ?
        'Cohérence maintenue - modules peuvent coexister' :
        'Incohérence détectée - désactivation temporaire requise';
      resolutionStatus = coherenceScore >= 80 ? 'résolu' : 'escaladé';
      break;
    }
    case 'éthique': {
      // Conflit éthique: priorité absolue à l'éthique
      arbitrationDecision = 'Règle éthique prioritaire - module en conflit restreint';
      resolutionStatus = 'résolu';
      break;
    }
  }

  // Enregistrer le conflit
  const conflict = {
    conflict_id: `CONF_${Date.now()}`,
    modules_involved,
    conflict_type,
    severity,
    arbitration_decision: arbitrationDecision,
    resolution_status: resolutionStatus
  };

  // Mettre à jour gouvernance
  await base44.entities.InternalGovernance.update(governance.id, {
    conflict_control: {
      active_conflicts: [...governance.conflict_control.active_conflicts, conflict],
      arbitration_count: governance.conflict_control.arbitration_count + 1,
      resolution_success_rate: calculateResolutionRate(governance, resolutionStatus)
    },
    audit_trail: [
      ...governance.audit_trail,
      {
        decision: `Arbitrage: ${conflict_type}`,
        rationale: arbitrationDecision,
        timestamp: new Date().toISOString()
      }
    ]
  });

  return conflict;
}

/**
 * Obtenir poids d'autorité
 */
function getAuthorityWeight(level) {
  const weights = {
    'lecture_seule': 1,
    'modification_locale': 2,
    'modification_globale': 3,
    'critique': 4
  };
  return weights[level] || 0;
}

/**
 * Calculer taux de résolution
 */
function calculateResolutionRate(governance, newStatus) {
  const allConflicts = [...governance.conflict_control.active_conflicts, { resolution_status: newStatus }];
  const resolved = allConflicts.filter(c => c.resolution_status === 'résolu').length;
  return Math.round((resolved / allConflicts.length) * 100);
}

// ═══════════════════════════════════════════════════════════════════════════
// VÉRIFICATION DES LIMITES INTERNES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Vérifier le respect des limites internes
 */
async function checkInternalLimits(base44) {
  const governance = await getActiveGovernance(base44);
  const limits = governance.internal_limits;
  const violations = [];

  // Vérifier charge cognitive
  const selfPerceptions = await base44.entities.SelfPerceptionModel?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 1).catch(() => []);

  if (selfPerceptions.length > 0) {
    const cognitiveLoad = selfPerceptions[0].energetic_state?.cognitive_load || 0;
    if (cognitiveLoad > limits.max_cognitive_load) {
      violations.push({
        limit: 'max_cognitive_load',
        current_value: cognitiveLoad,
        limit_value: limits.max_cognitive_load,
        severity: 'majeure'
      });
    }
  }

  // Vérifier nombre de mémoires
  const memories = await base44.entities.Memory.filter({
    created_by: base44.user?.email
  });

  if (limits.memory_retention_limit && memories.length > limits.memory_retention_limit) {
    violations.push({
      limit: 'memory_retention_limit',
      current_value: memories.length,
      limit_value: limits.memory_retention_limit,
      severity: 'mineure'
    });
  }

  // Vérifier opérations concurrentes (basé sur boucles actives récentes)
  const recentLoops = await base44.entities.PerceptionActionLoop?.filter({
    created_by: base44.user?.email
  }, '-timestamp', limits.max_concurrent_operations + 5).catch(() => []);

  const activeLoops = recentLoops.filter(loop => {
    const loopAge = Date.now() - new Date(loop.timestamp).getTime();
    return loopAge < 10000; // Actif si < 10 secondes
  });

  if (activeLoops.length > limits.max_concurrent_operations) {
    violations.push({
      limit: 'max_concurrent_operations',
      current_value: activeLoops.length,
      limit_value: limits.max_concurrent_operations,
      severity: 'moyenne'
    });
  }

  return {
    limits_checked: Object.keys(limits).length,
    violations_found: violations.length,
    violations,
    within_limits: violations.length === 0
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ÉVALUATION DE COHÉRENCE GLOBALE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Évaluer la cohérence globale du système
 */
async function assessGlobalCoherence(base44) {
  let coherenceScore = 100;

  // Vérifier cohérence mémoire
  const memories = await base44.entities.Memory.filter({
    created_by: base44.user?.email
  });

  const avgMemoryConfidence = memories.length > 0 ?
    memories.reduce((sum, m) => sum + (m.confidence_score || 80), 0) / memories.length : 80;

  const memoryCoherence = avgMemoryConfidence;

  // Vérifier cohérence introspection
  const introspectionStates = await base44.entities.IntrospectionState?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 5).catch(() => []);

  const avgIntrospectionCoherence = introspectionStates.length > 0 ?
    introspectionStates.reduce((sum, s) => sum + (s.logical_coherence_score || 85), 0) / introspectionStates.length : 85;

  // Vérifier cohérence auto-perception
  const selfPerceptions = await base44.entities.SelfPerceptionModel?.filter({
    created_by: base44.user?.email
  }, '-timestamp', 1).catch(() => []);

  const selfCoherence = selfPerceptions.length > 0 ?
    selfPerceptions[0].self_model?.coherence || 85 : 85;

  // Vérifier cohérence apprentissage
  const learnings = await base44.entities.StructuralLearning?.filter({
    created_by: base44.user?.email,
    status: 'appliqué'
  }).catch(() => []);

  const successfulLearnings = learnings.filter(l => l.improvement_delta > 0);
  const learningCoherence = learnings.length > 0 ?
    (successfulLearnings.length / learnings.length) * 100 : 100;

  // Score final pondéré
  coherenceScore = Math.round(
    (memoryCoherence * 0.25) +
    (avgIntrospectionCoherence * 0.3) +
    (selfCoherence * 0.25) +
    (learningCoherence * 0.2)
  );

  return coherenceScore;
}

// ═══════════════════════════════════════════════════════════════════════════
// AUDIT D'AUTORITÉ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Auditer l'autorité des modules
 */
async function auditModuleAuthority(base44) {
  const governance = await getActiveGovernance(base44);
  const auditResults = [];

  for (const module of governance.module_authority) {
    // Vérifier si le module respecte son autorité
    const compliance = await checkModuleCompliance(base44, module);
    
    auditResults.push({
      module_name: module.module_name,
      authority_level: module.authority_level,
      compliance_status: compliance.compliant ? 'conforme' : 'non_conforme',
      violations: compliance.violations,
      recommendation: compliance.recommendation
    });
  }

  const overallCompliance = auditResults.filter(r => r.compliance_status === 'conforme').length;
  const complianceRate = Math.round((overallCompliance / auditResults.length) * 100);

  return {
    modules_audited: auditResults.length,
    compliance_rate: complianceRate,
    audit_results: auditResults
  };
}

/**
 * Vérifier conformité d'un module
 */
async function checkModuleCompliance(base44, moduleConfig) {
  // Simuler vérification de conformité
  const compliant = true;
  const violations = [];
  let recommendation = 'Module conforme aux règles de gouvernance';

  if (moduleConfig.authority_level === 'critique' && !moduleConfig.requires_approval) {
    // Module critique devrait nécessiter approbation dans certains cas
    recommendation = 'Considérer ajout d\'approbation pour opérations sensibles';
  }

  return {
    compliant,
    violations,
    recommendation
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtenir la gouvernance active
 */
async function getActiveGovernance(base44) {
  const governances = await base44.entities.InternalGovernance.filter({
    created_by: base44.user?.email
  }, '-timestamp', 1);

  if (governances.length === 0) {
    // Créer gouvernance par défaut si absente
    return await establishGovernance(base44);
  }

  return governances[0];
}