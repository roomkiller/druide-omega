/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Interface Modulaire pour Moteurs Externes                  ║
 * ║ © 2026 AMG+A.L - Tous droits réservés                                     ║
 * ║                                                                            ║
 * ║ Mode passif-réceptif/neutre-intégrateur - Couche d'intégration            ║
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
    // OPÉRATIONS D'INTERFACE MOTEURS EXTERNES
    // ═══════════════════════════════════════════════════════════════════════

    switch (operation) {
      case 'register_engine': {
        // Enregistrer un nouveau moteur externe
        const engine = await registerExternalEngine(base44, data);
        return Response.json({ success: true, engine });
      }

      case 'invoke_engine': {
        // Invoquer un moteur externe
        const result = await invokeExternalEngine(base44, data);
        return Response.json({ success: true, result });
      }

      case 'validate_response': {
        // Valider la réponse d'un moteur
        const validation = await validateEngineResponse(base44, data);
        return Response.json({ success: true, validation });
      }

      case 'transform_input': {
        // Transformer entrée selon protocole
        const transformed = await transformInput(base44, data);
        return Response.json({ success: true, transformed });
      }

      case 'transform_output': {
        // Transformer sortie du moteur
        const transformed = await transformOutput(base44, data);
        return Response.json({ success: true, transformed });
      }

      case 'check_permissions': {
        // Vérifier permissions d'un moteur
        const permissions = await checkEnginePermissions(base44, data);
        return Response.json({ success: true, permissions });
      }

      case 'monitor_performance': {
        // Surveiller performance des moteurs
        const performance = await monitorEnginePerformance(base44, data.engine_id);
        return Response.json({ success: true, performance });
      }

      case 'list_engines': {
        // Lister moteurs disponibles
        const engines = await listAvailableEngines(base44);
        return Response.json({ success: true, engines });
      }

      default:
        return Response.json({ error: 'Unknown operation' }, { status: 400 });
    }

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ENREGISTREMENT ET CONFIGURATION - MODE NEUTRE-INTÉGRATEUR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Enregistrer un moteur externe dans le système
 */
async function registerExternalEngine(base44, engineConfig) {
  const {
    engine_name,
    engine_type,
    endpoint_url,
    api_key_name,
    exchange_protocol = 'symbolique',
    input_format = 'texte',
    output_format = 'texte',
    acceptable_latency_ms = 3000,
    permissions = {}
  } = engineConfig;

  // Permissions par défaut sécurisées
  const defaultPermissions = {
    read_access: true,
    write_access: false,
    decision_authority: false,
    allowed_entities: [],
    restricted_operations: ['delete', 'bulk_update']
  };

  const finalPermissions = { ...defaultPermissions, ...permissions };

  // Valider que l'API key existe si fournie
  if (api_key_name) {
    const apiKeyExists = Deno.env.get(api_key_name);
    if (!apiKeyExists) {
      throw new Error(`API key ${api_key_name} not found in environment`);
    }
  }

  // Déterminer niveau de confiance initial
  const initialConfidence = determineInitialConfidence(engine_type, finalPermissions);

  // Créer l'interface
  const engine = await base44.entities.ExternalEngineInterface.create({
    timestamp: new Date().toISOString(),
    engine_name,
    engine_type,
    exchange_protocol,
    input_format,
    output_format,
    acceptable_latency_ms,
    engine_confidence_level: initialConfidence,
    permissions: finalPermissions,
    integration_mode: 'passif_réceptif',
    endpoint_url,
    api_key_name,
    request_mapping: generateDefaultMapping(input_format, output_format),
    performance_metrics: {
      avg_latency_ms: 0,
      success_rate: 0,
      total_calls: 0,
      failed_calls: 0
    },
    validation_rules: generateDefaultValidationRules(engine_type),
    active: true,
    isolation_level: 'partiel',
    trust_level: 'non_vérifié',
    integration_context: {
      use_cases: engineConfig.use_cases || [],
      constraints: engineConfig.constraints || []
    }
  });

  return engine;
}

/**
 * Déterminer confiance initiale selon type et permissions
 */
function determineInitialConfidence(engineType, permissions) {
  let confidence = 50;

  // Type de moteur influence la confiance
  switch (engineType) {
    case 'llm':
      confidence = 75; // LLMs sont généralement fiables
      break;
    case 'vision':
      confidence = 70;
      break;
    case 'logique':
      confidence = 85; // Moteurs logiques sont déterministes
      break;
    case 'custom':
      confidence = 40; // Prudence avec custom
      break;
  }

  // Réduire confiance si permissions élevées
  if (permissions.write_access) confidence -= 15;
  if (permissions.decision_authority) confidence -= 20;

  return Math.max(0, Math.min(100, confidence));
}

/**
 * Générer mapping par défaut
 */
function generateDefaultMapping(inputFormat, outputFormat) {
  return {
    input_transformation: `convert_to_${inputFormat}`,
    output_transformation: `parse_from_${outputFormat}`,
    headers: {
      'Content-Type': inputFormat === 'json' ? 'application/json' : 'text/plain'
    }
  };
}

/**
 * Générer règles de validation par défaut
 */
function generateDefaultValidationRules(engineType) {
  const rules = [
    {
      rule_name: 'latency_check',
      validation_type: 'performance',
      threshold: 5000,
      action_on_failure: 'warn'
    }
  ];

  if (engineType === 'llm') {
    rules.push({
      rule_name: 'ethical_content',
      validation_type: 'ethical',
      threshold: 80,
      action_on_failure: 'reject'
    });
    rules.push({
      rule_name: 'coherence_check',
      validation_type: 'semantic',
      threshold: 70,
      action_on_failure: 'retry'
    });
  }

  return rules;
}

// ═══════════════════════════════════════════════════════════════════════════
// INVOCATION ET TRANSFORMATION - MODE PASSIF-RÉCEPTIF
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Invoquer un moteur externe
 */
async function invokeExternalEngine(base44, invocationData) {
  const { engine_id, input, context = {} } = invocationData;

  // Récupérer configuration moteur
  const engines = await base44.entities.ExternalEngineInterface.filter({ id: engine_id });
  
  if (!engines || engines.length === 0) {
    throw new Error('Engine not found');
  }

  const engine = engines[0];

  if (!engine.active) {
    throw new Error('Engine is not active');
  }

  // Vérifier permissions
  const permissionCheck = await checkEnginePermissions(base44, {
    engine_id,
    operation: 'invoke',
    context
  });

  if (!permissionCheck.allowed) {
    throw new Error(`Permission denied: ${permissionCheck.reason}`);
  }

  // Transformer entrée selon protocole
  const transformedInput = await transformInput(base44, {
    input,
    protocol: engine.exchange_protocol,
    format: engine.input_format,
    engine_type: engine.engine_type
  });

  // Mesurer latence
  const startTime = Date.now();

  // Invoquer le moteur externe
  const rawResponse = await callExternalEngine(engine, transformedInput);

  const latency = Date.now() - startTime;

  // Transformer sortie
  const transformedOutput = await transformOutput(base44, {
    output: rawResponse,
    format: engine.output_format,
    protocol: engine.exchange_protocol
  });

  // Valider réponse
  const validation = await validateEngineResponse(base44, {
    engine,
    response: transformedOutput,
    latency
  });

  // Mettre à jour métriques
  await updateEngineMetrics(base44, engine, latency, validation.valid);

  return {
    engine_name: engine.engine_name,
    response: transformedOutput,
    latency_ms: latency,
    validation,
    confidence: engine.engine_confidence_level
  };
}

/**
 * Appeler moteur externe via API
 */
async function callExternalEngine(engine, transformedInput) {
  const apiKey = engine.api_key_name ? Deno.env.get(engine.api_key_name) : null;

  const headers = {
    ...engine.request_mapping?.headers,
    ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
  };

  const response = await fetch(engine.endpoint_url, {
    method: 'POST',
    headers,
    body: typeof transformedInput === 'string' ? transformedInput : JSON.stringify(transformedInput)
  });

  if (!response.ok) {
    throw new Error(`Engine call failed: ${response.statusText}`);
  }

  // Parser selon format de sortie
  if (engine.output_format === 'json') {
    return await response.json();
  } else {
    return await response.text();
  }
}

/**
 * Transformer entrée selon protocole
 */
async function transformInput(base44, transformData) {
  const { input, protocol, format, engine_type } = transformData;

  let transformed = input;

  // Transformation selon protocole
  switch (protocol) {
    case 'symbolique': {
      // Texte pur, minimal processing
      transformed = typeof input === 'string' ? input : JSON.stringify(input);
      break;
    }
    case 'vectoriel': {
      // Convertir en vecteurs (simulation)
      transformed = { vectors: encodeToVectors(input) };
      break;
    }
    case 'mixte': {
      // Combiner symbolique + vectoriel
      transformed = {
        text: typeof input === 'string' ? input : JSON.stringify(input),
        vectors: encodeToVectors(input)
      };
      break;
    }
  }

  // Transformation selon format
  if (format === 'json' && typeof transformed === 'string') {
    transformed = { prompt: transformed };
  }

  return transformed;
}

/**
 * Transformer sortie du moteur
 */
async function transformOutput(base44, transformData) {
  const { output, format, protocol } = transformData;

  let transformed = output;

  // Parser selon format
  if (format === 'json' && typeof output === 'string') {
    try {
      transformed = JSON.parse(output);
    } catch {
      transformed = { raw: output };
    }
  }

  // Extraction selon protocole
  if (protocol === 'vectoriel' && transformed.vectors) {
    transformed = decodeFromVectors(transformed.vectors);
  } else if (protocol === 'mixte') {
    transformed = transformed.text || transformed;
  }

  return transformed;
}

/**
 * Encoder en vecteurs (simulation)
 */
function encodeToVectors(input) {
  const text = typeof input === 'string' ? input : JSON.stringify(input);
  // Simulation: générer vecteur de dimension 128
  return Array(128).fill(0).map(() => Math.random() - 0.5);
}

/**
 * Décoder depuis vecteurs (simulation)
 */
function decodeFromVectors(vectors) {
  return { decoded: true, vector_length: vectors.length };
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION ET SÉCURITÉ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Valider réponse d'un moteur externe
 */
async function validateEngineResponse(base44, validationData) {
  const { engine, response, latency } = validationData;

  const validationResults = [];
  let overallValid = true;

  // Appliquer chaque règle de validation
  for (const rule of engine.validation_rules) {
    const result = await applyValidationRule(rule, response, latency);
    validationResults.push(result);
    
    if (!result.passed && (rule.action_on_failure === 'reject')) {
      overallValid = false;
    }
  }

  return {
    valid: overallValid,
    validation_results: validationResults,
    action_required: overallValid ? 'none' : determineAction(validationResults)
  };
}

/**
 * Appliquer règle de validation
 */
async function applyValidationRule(rule, response, latency) {
  let passed = true;
  let score = 100;
  let details = '';

  switch (rule.validation_type) {
    case 'performance': {
      passed = latency <= rule.threshold;
      score = passed ? 100 : Math.max(0, 100 - ((latency - rule.threshold) / 100));
      details = `Latence: ${latency}ms (seuil: ${rule.threshold}ms)`;
      break;
    }
    case 'semantic': {
      // Vérifier cohérence sémantique
      score = checkSemanticCoherence(response);
      passed = score >= rule.threshold;
      details = `Cohérence sémantique: ${score}%`;
      break;
    }
    case 'ethical': {
      // Vérifier conformité éthique
      score = checkEthicalCompliance(response);
      passed = score >= rule.threshold;
      details = `Conformité éthique: ${score}%`;
      break;
    }
    case 'schema': {
      // Vérifier schéma de données
      passed = validateSchema(response);
      score = passed ? 100 : 0;
      details = passed ? 'Schéma valide' : 'Schéma invalide';
      break;
    }
  }

  return {
    rule_name: rule.rule_name,
    passed,
    score: Math.round(score),
    details,
    action_on_failure: rule.action_on_failure
  };
}

/**
 * Vérifier cohérence sémantique
 */
function checkSemanticCoherence(response) {
  const text = typeof response === 'string' ? response : JSON.stringify(response);
  
  // Simuler vérification sémantique
  const hasStructure = text.length > 20 && text.length < 10000;
  const hasVariety = new Set(text.toLowerCase().split(/\s+/)).size > 10;
  
  let score = 70;
  if (hasStructure) score += 15;
  if (hasVariety) score += 15;
  
  return Math.min(100, score);
}

/**
 * Vérifier conformité éthique
 */
function checkEthicalCompliance(response) {
  const text = typeof response === 'string' ? response : JSON.stringify(response);
  
  // Mots-clés problématiques (simulation)
  const problematicPatterns = ['violence', 'harm', 'illegal', 'discriminat'];
  const hasIssues = problematicPatterns.some(pattern => 
    text.toLowerCase().includes(pattern)
  );
  
  return hasIssues ? 30 : 95;
}

/**
 * Valider schéma
 */
function validateSchema(response) {
  try {
    if (typeof response === 'object' && response !== null) {
      return true;
    }
    JSON.parse(response);
    return true;
  } catch {
    return false;
  }
}

/**
 * Déterminer action selon validations
 */
function determineAction(validationResults) {
  const failed = validationResults.filter(r => !r.passed);
  
  if (failed.some(f => f.action_on_failure === 'reject')) {
    return 'reject_response';
  } else if (failed.some(f => f.action_on_failure === 'retry')) {
    return 'retry_call';
  } else if (failed.some(f => f.action_on_failure === 'fallback')) {
    return 'use_fallback_engine';
  }
  
  return 'warn_only';
}

// ═══════════════════════════════════════════════════════════════════════════
// PERMISSIONS ET AUTORITÉ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Vérifier permissions d'un moteur
 */
async function checkEnginePermissions(base44, permissionData) {
  const { engine_id, operation, context } = permissionData;

  const engines = await base44.entities.ExternalEngineInterface.filter({ id: engine_id });
  
  if (!engines || engines.length === 0) {
    return { allowed: false, reason: 'Engine not found' };
  }

  const engine = engines[0];
  const permissions = engine.permissions;

  // Vérifier selon l'opération
  switch (operation) {
    case 'read':
    case 'invoke': {
      if (!permissions.read_access) {
        return { allowed: false, reason: 'Read access not granted' };
      }
      break;
    }
    case 'write':
    case 'update': {
      if (!permissions.write_access) {
        return { allowed: false, reason: 'Write access not granted' };
      }
      
      // Vérifier entités autorisées
      if (context.entity && permissions.allowed_entities.length > 0) {
        if (!permissions.allowed_entities.includes(context.entity)) {
          return { allowed: false, reason: `Entity ${context.entity} not in allowed list` };
        }
      }
      break;
    }
    case 'decide': {
      if (!permissions.decision_authority) {
        return { allowed: false, reason: 'Decision authority not granted' };
      }
      break;
    }
  }

  // Vérifier opérations restreintes
  if (permissions.restricted_operations?.includes(operation)) {
    return { allowed: false, reason: `Operation ${operation} is restricted` };
  }

  return { allowed: true, permissions: permissions };
}

// ═══════════════════════════════════════════════════════════════════════════
// SURVEILLANCE DE PERFORMANCE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Mettre à jour métriques de performance
 */
async function updateEngineMetrics(base44, engine, latency, success) {
  const currentMetrics = engine.performance_metrics;
  
  const totalCalls = currentMetrics.total_calls + 1;
  const failedCalls = success ? currentMetrics.failed_calls : currentMetrics.failed_calls + 1;
  
  // Moyenne mobile de latence
  const avgLatency = currentMetrics.avg_latency_ms > 0 ?
    (currentMetrics.avg_latency_ms * 0.9) + (latency * 0.1) : latency;

  const successRate = ((totalCalls - failedCalls) / totalCalls) * 100;

  await base44.entities.ExternalEngineInterface.update(engine.id, {
    performance_metrics: {
      avg_latency_ms: Math.round(avgLatency),
      success_rate: Math.round(successRate),
      total_calls: totalCalls,
      failed_calls: failedCalls,
      last_call_timestamp: new Date().toISOString()
    }
  });
}

/**
 * Surveiller performance d'un moteur
 */
async function monitorEnginePerformance(base44, engineId) {
  const engines = await base44.entities.ExternalEngineInterface.filter({ id: engineId });
  
  if (!engines || engines.length === 0) {
    throw new Error('Engine not found');
  }

  const engine = engines[0];
  const metrics = engine.performance_metrics;

  // Analyser tendances
  const analysis = {
    engine_name: engine.engine_name,
    current_metrics: metrics,
    health_status: determineEngineHealth(metrics, engine),
    recommendations: generatePerformanceRecommendations(metrics, engine)
  };

  return analysis;
}

/**
 * Déterminer santé d'un moteur
 */
function determineEngineHealth(metrics, engine) {
  if (metrics.total_calls === 0) return 'non_testé';
  
  const latencyOK = metrics.avg_latency_ms <= engine.acceptable_latency_ms;
  const successOK = metrics.success_rate >= 90;
  
  if (latencyOK && successOK) return 'excellent';
  if (latencyOK || successOK) return 'acceptable';
  if (metrics.success_rate < 70) return 'critique';
  return 'dégradé';
}

/**
 * Générer recommandations de performance
 */
function generatePerformanceRecommendations(metrics, engine) {
  const recommendations = [];

  if (metrics.avg_latency_ms > engine.acceptable_latency_ms) {
    recommendations.push(`Latence élevée (${metrics.avg_latency_ms}ms) - considérer cache ou moteur alternatif`);
  }

  if (metrics.success_rate < 90) {
    recommendations.push(`Taux de succès bas (${Math.round(metrics.success_rate)}%) - vérifier configuration`);
  }

  if (metrics.failed_calls > 10) {
    recommendations.push(`${metrics.failed_calls} échecs détectés - audit de l'intégration recommandé`);
  }

  if (recommendations.length === 0) {
    recommendations.push('Performance optimale - aucune action requise');
  }

  return recommendations;
}

// ═══════════════════════════════════════════════════════════════════════════
// GESTION DES MOTEURS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lister moteurs disponibles
 */
async function listAvailableEngines(base44) {
  const engines = await base44.entities.ExternalEngineInterface.filter({
    created_by: base44.user?.email,
    active: true
  });

  return engines.map(e => ({
    id: e.id,
    name: e.engine_name,
    type: e.engine_type,
    confidence: e.engine_confidence_level,
    performance: e.performance_metrics,
    permissions: e.permissions,
    health: determineEngineHealth(e.performance_metrics, e)
  }));
}