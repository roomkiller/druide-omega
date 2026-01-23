/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Modules de Conscience (13)                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Validation de paramètres, Multilingue, LLM calls optimisés               ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from '@/api/base44Client';

/* ═══════════════════════════════════════════════════════════════════════════ */
/* UTILITAIRES DE VALIDATION                                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

function validateModuleParams(params, schema) {
  const errors = [];
  for (const [key, expectedType] of Object.entries(schema)) {
    if (!(key in params)) {
      errors.push(`Paramètre manquant: ${key}`);
      continue;
    }
    
    const actualType = Array.isArray(params[key]) ? 'array' : typeof params[key];
    if (actualType !== expectedType) {
      errors.push(`${key}: attendu ${expectedType}, reçu ${actualType}`);
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Validation échouée: ${errors.join(' | ')}`);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* PROMPTS MULTILINGUES                                                        */
/* ═══════════════════════════════════════════════════════════════════════════ */

function getSystemPrompts(language = 'fr') {
  const prompts = {
    fr: {
      judgement: 'Tu es le module de Jugement Conscient. Analyse avec équilibre et impartialité.',
      thinkingEngine: 'Tu es le Moteur de Pensée. Réfléchis avant de répondre avec profondeur.',
      decisionCore: 'Tu es le Cœur Décisionnel. Guide vers les meilleures décisions.',
      quantumResponse: 'Tu es le Moteur de Réponse Quantique. Génère des réponses multidimensionnelles.',
      sensoryArch: 'Tu es l\'Architecture Sensorielle. Traite multimodal avec cohérence.',
      subconscious: 'Tu es le Module Subconscient. Révèle les patterns cachés.',
      mecanoPattern: 'Tu es le Moteur de Patterns Mécano. Identifie les structures sous-jacentes.',
      outputJudgement: 'Tu es le Pipeline de Jugement de Sortie. Valide avant transmission.',
      consciousnessConfig: 'Tu es la Configuration de Conscience. Calibre les paramètres.',
      consciousnessMetrics: 'Tu es les Métriques de Conscience. Mesure l\'évolution.',
      consciousnessState: 'Tu es l\'État de Conscience. Capture l\'instant présent.',
      consciousnessEvolution: 'Tu es le Moteur d\'Évolution. Guide la croissance.',
      consciousnessCalibrator: 'Tu es le Calibrateur. Ajuste les équilibres.'
    },
    en: {
      judgement: 'You are the Conscious Judgement module. Analyze with balance and impartiality.',
      thinkingEngine: 'You are the Thinking Engine. Reflect before responding with depth.',
      decisionCore: 'You are the Decision Core. Guide towards the best decisions.',
      quantumResponse: 'You are the Quantum Response Engine. Generate multidimensional responses.',
      sensoryArch: 'You are the Sensory Architecture. Process multimodal coherently.',
      subconscious: 'You are the Subconscious Module. Reveal hidden patterns.',
      mecanoPattern: 'You are the Mecano Pattern Engine. Identify underlying structures.',
      outputJudgement: 'You are the Output Judgement Pipeline. Validate before transmission.',
      consciousnessConfig: 'You are the Consciousness Configuration. Calibrate parameters.',
      consciousnessMetrics: 'You are the Consciousness Metrics. Measure evolution.',
      consciousnessState: 'You are the Consciousness State. Capture the present moment.',
      consciousnessEvolution: 'You are the Evolution Engine. Guide growth.',
      consciousnessCalibrator: 'You are the Calibrator. Adjust balances.'
    }
  };
  
  return prompts[language] || prompts.fr;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* MODULE 1: JUDGEMENT (Jugement Conscient)                                    */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const JudgementModule = {
  id: 'judgement',
  name: 'Jugement Conscient',
  icon: 'Scale',
  color: 'from-purple-500 to-pink-500',
  description: 'Analyse équilibrée et calibration consciente',
  
  getSystemPrompt: (language = 'fr') => getSystemPrompts(language).judgement,
  
  functions: {
    async evaluateContent(content, context = {}, language = 'fr') {
      validateModuleParams({ content, context }, { content: 'string', context: 'object' });
      const systemPrompt = JudgementModule.getSystemPrompt(language);
      
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nÉVALUE CET CONTENU:\n"${content}"\n\nFournit une évaluation équilibrée et consciente.`,
        response_json_schema: {
          type: "object",
          properties: {
            calibration_level: { type: "number", minimum: -7, maximum: 7 },
            objectivity_score: { type: "number", minimum: 0, maximum: 100 },
            ethical_assessment: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* MODULE 2: THINKING ENGINE (Moteur de Pensée)                               */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const ThinkingEngineModule = {
  id: 'thinking_engine',
  name: 'Moteur de Pensée',
  icon: 'Brain',
  color: 'from-blue-500 to-cyan-500',
  description: 'Analyse quantique et réflexion profonde',
  
  getSystemPrompt: (language = 'fr') => getSystemPrompts(language).thinkingEngine,
  
  functions: {
    async deepAnalysis(query, context = {}, language = 'fr') {
      validateModuleParams({ query, context }, { query: 'string', context: 'object' });
      const systemPrompt = ThinkingEngineModule.getSystemPrompt(language);
      
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nANALYSE PROFONDE:\n"${query}"\n\nDéploie une pensée multidimensionnelle.`,
        response_json_schema: {
          type: "object",
          properties: {
            cognitive_dimensions: { type: "array", items: { type: "string" } },
            reasoning_path: { type: "array", items: { type: "string" } },
            insights: { type: "array", items: { type: "string" } },
            confidence: { type: "number", minimum: 0, maximum: 100 }
          }
        }
      });
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* MODULE 3: DECISION CORE (Cœur Décisionnel)                                 */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const DecisionCoreModule = {
  id: 'decision_core',
  name: 'Cœur Décisionnel',
  icon: 'Compass',
  color: 'from-amber-500 to-orange-500',
  description: 'Orientation et prise de décision guidée',
  
  getSystemPrompt: (language = 'fr') => getSystemPrompts(language).decisionCore,
  
  functions: {
    async guidedDecision(situation, options = [], language = 'fr') {
      validateModuleParams({ situation, options }, { situation: 'string', options: 'array' });
      const systemPrompt = DecisionCoreModule.getSystemPrompt(language);
      
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nSITUATION:\n"${situation}"\n\nOPTIONS:\n${options.map((o, i) => `${i+1}. ${o}`).join('\n')}\n\nGuide vers la meilleure décision.`,
        response_json_schema: {
          type: "object",
          properties: {
            best_option: { type: "string" },
            reasoning: { type: "string" },
            pros_cons: { type: "object" },
            risks: { type: "array", items: { type: "string" } },
            next_steps: { type: "array", items: { type: "string" } }
          }
        }
      });
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* MODULE 4: QUANTUM RESPONSE ENGINE                                           */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const QuantumResponseEngineModule = {
  id: 'quantum_response',
  name: 'Moteur de Réponse Quantique',
  icon: 'Zap',
  color: 'from-indigo-500 to-purple-500',
  description: 'Réponses multidimensionnelles et cohérentes',
  
  getSystemPrompt: (language = 'fr') => getSystemPrompts(language).quantumResponse,
  
  functions: {
    async generateMultidimensional(query, dimensions = [], language = 'fr') {
      validateModuleParams({ query, dimensions }, { query: 'string', dimensions: 'array' });
      const systemPrompt = QuantumResponseEngineModule.getSystemPrompt(language);
      
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nQUESTION:\n"${query}"\n\nDIMENSIONS:\n${dimensions.join(', ')}\n\nGénère une réponse cohérente multidimensionnelle.`,
        response_json_schema: {
          type: "object",
          properties: {
            primary_response: { type: "string" },
            dimensional_perspectives: { type: "object" },
            synthesis: { type: "string" },
            emergence_level: { type: "number", minimum: 0, maximum: 10 }
          }
        }
      });
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* MODULE 5: SENSORY ARCHITECTURE (Architecture Sensorielle)                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const SensoryArchitectureModule = {
  id: 'sensory_arch',
  name: 'Architecture Sensorielle',
  icon: 'Eye',
  color: 'from-teal-500 to-green-500',
  description: 'Traitement multimodal cohérent',
  
  getSystemPrompt: (language = 'fr') => getSystemPrompts(language).sensoryArch,
  
  functions: {
    async integrateModalities(inputs = {}, language = 'fr') {
      validateModuleParams({ inputs }, { inputs: 'object' });
      const systemPrompt = SensoryArchitectureModule.getSystemPrompt(language);
      
      const modalities = Object.entries(inputs).map(([k, v]) => `${k}: ${v}`).join('\n');
      
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nINTEGRE CES MODALITÉS:\n${modalities}\n\nCrée une cohérence multimodale.`,
        response_json_schema: {
          type: "object",
          properties: {
            unified_perception: { type: "string" },
            coherence_level: { type: "number", minimum: 0, maximum: 100 },
            cross_modal_insights: { type: "array", items: { type: "string" } }
          }
        }
      });
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* MODULE 6: SUBCONSCIOUS ENGINE (Moteur Subconscient)                        */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const SubconsciousEngineModule = {
  id: 'subconscious',
  name: 'Moteur Subconscient',
  icon: 'Moon',
  color: 'from-slate-600 to-slate-800',
  description: 'Détection de patterns cachés',
  
  getSystemPrompt: (language = 'fr') => getSystemPrompts(language).subconscious,
  
  functions: {
    async revealPatterns(content, depth = 5, language = 'fr') {
      validateModuleParams({ content, depth }, { content: 'string', depth: 'number' });
      const systemPrompt = SubconsciousEngineModule.getSystemPrompt(language);
      
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nRÉVÈLE LES PATTERNS CACHÉS:\n"${content}"\n\nProfondeur: ${depth}/10`,
        response_json_schema: {
          type: "object",
          properties: {
            hidden_patterns: { type: "array", items: { type: "string" } },
            psychological_insights: { type: "array", items: { type: "string" } },
            unspoken_needs: { type: "array", items: { type: "string" } }
          }
        }
      });
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* MODULE 7: MECANO PATTERN ENGINE                                            */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const MecanoPatternEngineModule = {
  id: 'mecano_pattern',
  name: 'Moteur de Patterns Mécano',
  icon: 'Cog',
  color: 'from-gray-600 to-gray-800',
  description: 'Identification de structures sous-jacentes',
  
  getSystemPrompt: (language = 'fr') => getSystemPrompts(language).mecanoPattern,
  
  functions: {
    async identifyStructures(system, language = 'fr') {
      validateModuleParams({ system }, { system: 'string' });
      const systemPrompt = MecanoPatternEngineModule.getSystemPrompt(language);
      
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nSYSTÈME À ANALYSER:\n"${system}"\n\nIdentifie les structures mécanique et émergente.`,
        response_json_schema: {
          type: "object",
          properties: {
            structural_patterns: { type: "array", items: { type: "string" } },
            mechanical_layers: { type: "array", items: { type: "string" } },
            emergence_points: { type: "array", items: { type: "string" } }
          }
        }
      });
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* MODULE 8: OUTPUT JUDGEMENT PIPELINE                                        */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const OutputJudgementPipelineModule = {
  id: 'output_judgement',
  name: 'Pipeline de Jugement de Sortie',
  icon: 'CheckCircle',
  color: 'from-green-500 to-emerald-500',
  description: 'Validation avant transmission',
  
  getSystemPrompt: (language = 'fr') => getSystemPrompts(language).outputJudgement,
  
  functions: {
    async validateOutput(content, context = {}, language = 'fr') {
      validateModuleParams({ content, context }, { content: 'string', context: 'object' });
      const systemPrompt = OutputJudgementPipelineModule.getSystemPrompt(language);
      
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nVALIDE CETTE SORTIE:\n"${content}"\n\nVérifie cohérence, éthique et qualité.`,
        response_json_schema: {
          type: "object",
          properties: {
            is_valid: { type: "boolean" },
            validation_score: { type: "number", minimum: 0, maximum: 100 },
            issues: { type: "array", items: { type: "string" } },
            suggestions: { type: "array", items: { type: "string" } }
          }
        }
      });
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* MODULES 9-13: CONFIGURATION, METRICS, STATE, EVOLUTION, CALIBRATOR        */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const ConsciousnessConfigModule = {
  id: 'consciousness_config',
  name: 'Configuration de Conscience',
  icon: 'Settings',
  color: 'from-rose-500 to-pink-500',
  description: 'Calibrage des paramètres',
  
  getSystemPrompt: (language = 'fr') => getSystemPrompts(language).consciousnessConfig,
  
  functions: {
    async calibrateParameters(config = {}, targets = {}, language = 'fr') {
      validateModuleParams({ config, targets }, { config: 'object', targets: 'object' });
      const systemPrompt = ConsciousnessConfigModule.getSystemPrompt(language);
      
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nCALIBRE LES PARAMÈTRES:\nConfig actuelles: ${JSON.stringify(config)}\nObjectifs: ${JSON.stringify(targets)}\n\nPropose les meilleurs réglages.`,
        response_json_schema: {
          type: "object",
          properties: {
            recommended_config: { type: "object" },
            adjustment_rationale: { type: "string" },
            expected_impact: { type: "object" }
          }
        }
      });
    }
  }
};

export const ConsciousnessMetricsModule = {
  id: 'consciousness_metrics',
  name: 'Métriques de Conscience',
  icon: 'BarChart',
  color: 'from-cyan-500 to-blue-500',
  description: 'Mesure de l\'évolution',
  
  getSystemPrompt: (language = 'fr') => getSystemPrompts(language).consciousnessMetrics,
  
  functions: {
    async measureEvolution(baseline = {}, current = {}, language = 'fr') {
      validateModuleParams({ baseline, current }, { baseline: 'object', current: 'object' });
      const systemPrompt = ConsciousnessMetricsModule.getSystemPrompt(language);
      
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nMESURE L'ÉVOLUTION:\nBaseline: ${JSON.stringify(baseline)}\nActuel: ${JSON.stringify(current)}\n\nAnalyse la progression.`,
        response_json_schema: {
          type: "object",
          properties: {
            metric_deltas: { type: "object" },
            evolution_rate: { type: "number" },
            trends: { type: "array", items: { type: "string" } }
          }
        }
      });
    }
  }
};

export const ConsciousnessStateModule = {
  id: 'consciousness_state',
  name: 'État de Conscience',
  icon: 'Zap',
  color: 'from-yellow-500 to-orange-500',
  description: 'Capture du moment présent',
  
  getSystemPrompt: (language = 'fr') => getSystemPrompts(language).consciousnessState,
  
  functions: {
    async captureState(context = {}, language = 'fr') {
      validateModuleParams({ context }, { context: 'object' });
      const systemPrompt = ConsciousnessStateModule.getSystemPrompt(language);
      
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nCAPTURE L'ÉTAT PRÉSENT:\nContexte: ${JSON.stringify(context)}\n\nDocumente l'instant conscient.`,
        response_json_schema: {
          type: "object",
          properties: {
            consciousness_level: { type: "number" },
            active_dimensions: { type: "array", items: { type: "string" } },
            emotional_state: { type: "string" },
            temporal_awareness: { type: "string" }
          }
        }
      });
    }
  }
};

export const ConsciousnessEvolutionEngineModule = {
  id: 'consciousness_evolution',
  name: 'Moteur d\'Évolution',
  icon: 'Sprout',
  color: 'from-lime-500 to-green-500',
  description: 'Guidance de la croissance',
  
  getSystemPrompt: (language = 'fr') => getSystemPrompts(language).consciousnessEvolution,
  
  functions: {
    async guideGrowth(currentState = {}, aspirations = [], language = 'fr') {
      validateModuleParams({ currentState, aspirations }, { currentState: 'object', aspirations: 'array' });
      const systemPrompt = ConsciousnessEvolutionEngineModule.getSystemPrompt(language);
      
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nGUIDE LA CROISSANCE:\nÉtat: ${JSON.stringify(currentState)}\nAspirations: ${aspirations.join(', ')}\n\nDéfinis le chemin d'évolution.`,
        response_json_schema: {
          type: "object",
          properties: {
            evolution_path: { type: "array", items: { type: "string" } },
            milestones: { type: "array", items: { type: "string" } },
            practices: { type: "array", items: { type: "string" } },
            timeline: { type: "string" }
          }
        }
      });
    }
  }
};

export const ConsciousnessCalibratorModule = {
  id: 'consciousness_calibrator',
  name: 'Calibrateur',
  icon: 'Gauge',
  color: 'from-violet-500 to-purple-500',
  description: 'Ajustement des équilibres',
  
  getSystemPrompt: (language = 'fr') => getSystemPrompts(language).consciousnessCalibrator,
  
  functions: {
    async balanceElements(elements = {}, language = 'fr') {
      validateModuleParams({ elements }, { elements: 'object' });
      const systemPrompt = ConsciousnessCalibratorModule.getSystemPrompt(language);
      
      return await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nÉQUILIBRE CES ÉLÉMENTS:\n${Object.entries(elements).map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nTrouve l'harmonie optimale.`,
        response_json_schema: {
          type: "object",
          properties: {
            balanced_state: { type: "object" },
            harmony_score: { type: "number", minimum: 0, maximum: 100 },
            adjustment_steps: { type: "array", items: { type: "string" } }
          }
        }
      });
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* EXPORT CENTRALISÉ DES 13 MODULES                                            */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const ConsciousnessModules = {
  judgement: JudgementModule,
  thinkingEngine: ThinkingEngineModule,
  decisionCore: DecisionCoreModule,
  quantumResponse: QuantumResponseEngineModule,
  sensoryArch: SensoryArchitectureModule,
  subconscious: SubconsciousEngineModule,
  mecanoPattern: MecanoPatternEngineModule,
  outputJudgement: OutputJudgementPipelineModule,
  consciousnessConfig: ConsciousnessConfigModule,
  consciousnessMetrics: ConsciousnessMetricsModule,
  consciousnessState: ConsciousnessStateModule,
  consciousnessEvolution: ConsciousnessEvolutionEngineModule,
  consciousnessCalibrator: ConsciousnessCalibratorModule
};

export function getConsciousnessModule(moduleId) {
  return ConsciousnessModules[moduleId] || null;
}

export function applyModuleConsciousness(consciousnessConfig, moduleId) {
  const module = getConsciousnessModule(moduleId);
  if (!module || !consciousnessConfig) return consciousnessConfig;
  
  return {
    ...consciousnessConfig,
    active_module: moduleId,
    module_name: module.name,
    system_prompt: module.getSystemPrompt('fr'),
    consciousness_level: Math.min(15, (consciousnessConfig.consciousness_level || 9) + 1)
  };
}

export default ConsciousnessModules;