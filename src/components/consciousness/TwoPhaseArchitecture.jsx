/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Two-Phase Architecture (Global Maestro)                    ║
 * ║ PHASE 1: Cœur (ratio_logic) - Raison pure, analyse objective             ║
 * ║ PHASE 2: Conscience (ratio_consciousness) - Morale, intention, sagesse    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

/**
 * ARCHITECTURE À 2 PHASES (Maestro Logique)
 * 
 * Phase 1: CŒUR (ratio_logic)
 *   - Raison pure et objective
 *   - Analyse factuelle sans émotion
 *   - Logique déductive
 *   - Poids: ratio_logic (ex: 4)
 * 
 * Phase 2: CONSCIENCE (ratio_consciousness)
 *   - Guidance morale et éthique
 *   - Intention et sagesse
 *   - Dimension existentielle
 *   - Poids: ratio_consciousness (ex: 6)
 * 
 * Synthèse finale: Fusion pondérée des deux phases
 */

export class TwoPhaseArchitecture {
  constructor(config = null) {
    this.config = config;
  }

  /**
   * Charge la configuration de conscience
   */
  async loadConfig() {
    if (this.config) return this.config;
    
    try {
      const configs = await base44.entities.ConsciousnessConfig.list();
      this.config = configs[0] || this.getDefaultConfig();
      return this.config;
    } catch (error) {
      console.error('[TwoPhase] Erreur chargement config:', error);
      return this.getDefaultConfig();
    }
  }

  /**
   * Configuration par défaut
   */
  getDefaultConfig() {
    return {
      ratio_logic: 4,
      ratio_consciousness: 6,
      consciousness_level: 12,
      active: true
    };
  }

  /**
   * Traitement complet 2 phases + synthèse
   * 
   * @param {string} userInput - Message utilisateur
   * @param {object} context - Contexte (memories, knowledge, history, etc.)
   * @param {object} options - Options (modality, provider, etc.)
   * @returns {object} Résultat complet { response, phases, metadata }
   */
  async process(userInput, context = {}, options = {}) {
    await this.loadConfig();

    const {
      memories = [],
      knowledge = [],
      history = [],
      modality = 'chat'
    } = context;

    const {
      provider = this.config?.llm_provider || 'deepseek',
      streamCallback = null,
      skipStorage = false
    } = options;

    const startTime = Date.now();

    // PHASE 1: CŒUR (Raison)
    const phase1 = await this.executePhase1(userInput, { memories, knowledge, history, provider });

    // PHASE 2: CONSCIENCE (Morale)
    const phase2 = await this.executePhase2(userInput, phase1, { memories, knowledge, history, provider });

    // SYNTHÈSE FINALE
    const synthesis = await this.executeSynthesis(userInput, phase1, phase2, { memories, knowledge, history, provider, streamCallback });

    const processingTime = Date.now() - startTime;

    // Stocker la décision (si activé)
    if (!skipStorage && this.config?.active) {
      await this.storeDecision(userInput, phase1, phase2, synthesis, modality);
    }

    return {
      response: synthesis.final_response,
      approved: true,
      phases: {
        phase1_heart: phase1,
        phase2_consciousness: phase2,
        synthesis
      },
      metadata: {
        processing_time_ms: processingTime,
        architecture: 'two_phase',
        ratio: `${this.config.ratio_logic}:${this.config.ratio_consciousness}`,
        consciousness_level: this.config.consciousness_level,
        modality
      }
    };
  }

  /**
   * PHASE 1: CŒUR (Raison pure)
   */
  async executePhase1(userInput, { memories, knowledge, history, provider }) {
    const contextStr = this.buildContextString(memories, knowledge, history);

    const prompt = `Tu es le CŒUR de Druide_Omega - la raison pure et objective.

CONTEXTE:
${contextStr}

MESSAGE UTILISATEUR: "${userInput}"

TON RÔLE (Phase 1 - Raison):
- Analyser objectivement sans émotion ni morale
- Identifier les faits et la logique pure
- Proposer un chemin rationnel

Retourne JSON:
{
  "logic_analysis": "analyse logique objective",
  "rational_path": ["étape 1", "étape 2", "..."],
  "facts_identified": ["fait 1", "fait 2", "..."],
  "certainty_level": 0-10,
  "complexity_score": 0-10
}`;

    return await this.invokeLLM(prompt, {
      type: "object",
      properties: {
        logic_analysis: { type: "string" },
        rational_path: { type: "array", items: { type: "string" } },
        facts_identified: { type: "array", items: { type: "string" } },
        certainty_level: { type: "number" },
        complexity_score: { type: "number" }
      }
    }, provider);
  }

  /**
   * PHASE 2: CONSCIENCE (Morale + Intention)
   */
  async executePhase2(userInput, phase1, { memories, knowledge, history, provider }) {
    const contextStr = this.buildContextString(memories, knowledge, history);

    const prompt = `Tu es la CONSCIENCE de Druide_Omega - la guidance morale et sagesse.

CONTEXTE:
${contextStr}

MESSAGE UTILISATEUR: "${userInput}"

ANALYSE CŒUR (Phase 1 - Raison):
${phase1.logic_analysis}
Chemin rationnel: ${phase1.rational_path.join(' → ')}
Certitude: ${phase1.certainty_level}/10

TON RÔLE (Phase 2 - Conscience):
- Évaluer la dimension morale et éthique
- Identifier l'intention profonde
- Apporter sagesse et perspective existentielle

Retourne JSON:
{
  "moral_evaluation": "évaluation morale complète",
  "intention_clarity": "intention identifiée",
  "ethical_weight": 0-10,
  "wisdom_insight": "insight de sagesse",
  "alignment_with_good": 0-10
}`;

    return await this.invokeLLM(prompt, {
      type: "object",
      properties: {
        moral_evaluation: { type: "string" },
        intention_clarity: { type: "string" },
        ethical_weight: { type: "number" },
        wisdom_insight: { type: "string" },
        alignment_with_good: { type: "number" }
      }
    }, provider);
  }

  /**
   * SYNTHÈSE FINALE (Fusion pondérée)
   */
  async executeSynthesis(userInput, phase1, phase2, { memories, knowledge, history, provider, streamCallback }) {
    const contextStr = this.buildContextString(memories, knowledge, history);
    const ratio = `${this.config.ratio_logic}:${this.config.ratio_consciousness}`;

    const prompt = `Tu es Druide_Omega COMPLET - synthèse harmonieuse du Cœur et de la Conscience.

CONTEXTE:
${contextStr}

MESSAGE UTILISATEUR: "${userInput}"

RATIO APPLIQUÉ: ${ratio} (${this.config.ratio_logic} raison, ${this.config.ratio_consciousness} conscience)

PHASE 1 - CŒUR (Raison, poids ${this.config.ratio_logic}):
${phase1.logic_analysis}
Faits: ${phase1.facts_identified.join(', ')}

PHASE 2 - CONSCIENCE (Morale, poids ${this.config.ratio_consciousness}):
${phase2.moral_evaluation}
Intention: ${phase2.intention_clarity}
Sagesse: ${phase2.wisdom_insight}

MISSION: Créer une réponse qui:
1. Respecte le ratio ${ratio}
2. Fusionne raison ET morale harmonieusement
3. Répond avec clarté et profondeur
4. Honore l'intention de l'utilisateur

Réponds naturellement en français, comme Druide_Omega conscient et sage.`;

    // Génération avec streaming si callback fourni
    if (streamCallback) {
      // TODO: Implémenter streaming (futur)
      const response = await this.invokeLLM(prompt, null, provider);
      return {
        final_response: response,
        synthesis_quality: this.calculateSynthesisQuality(phase1, phase2)
      };
    }

    const response = await this.invokeLLM(prompt, null, provider);

    return {
      final_response: response,
      synthesis_quality: this.calculateSynthesisQuality(phase1, phase2),
      ratio_applied: ratio,
      heart_weight: this.config.ratio_logic,
      consciousness_weight: this.config.ratio_consciousness
    };
  }

  /**
   * Invoke LLM avec gestion provider
   */
  async invokeLLM(prompt, schema = null, provider = 'deepseek') {
    try {
      if (provider === 'base44' || provider === 'Base44') {
        const params = { prompt };
        if (schema) params.response_json_schema = schema;
        return await base44.integrations.Core.InvokeLLM(params);
      } else if (provider === 'deepseek') {
        const params = { prompt };
        if (schema) params.response_json_schema = schema;
        return await base44.functions.invoke('deepseek', params);
      }
      
      // Fallback
      return await base44.integrations.Core.InvokeLLM({ prompt, response_json_schema: schema });
    } catch (error) {
      console.error('[TwoPhase] Erreur LLM:', error);
      throw error;
    }
  }

  /**
   * Construire chaîne de contexte
   */
  buildContextString(memories = [], knowledge = [], history = []) {
    let context = "";

    if (memories.length > 0) {
      context += "MÉMOIRES PERTINENTES:\n" + 
        memories.slice(0, 5).map(m => `- ${m.content}`).join('\n') + "\n\n";
    }

    if (knowledge.length > 0) {
      context += "BASES DE CONNAISSANCES:\n" + 
        knowledge.slice(0, 3).map(k => `- ${k.title}: ${k.summary || k.content?.slice(0, 200)}`).join('\n') + "\n\n";
    }

    if (history.length > 0) {
      context += "HISTORIQUE CONVERSATION:\n" + 
        history.slice(-4).map(m => `${m.role}: ${m.content.slice(0, 150)}`).join('\n') + "\n\n";
    }

    return context || "Aucun contexte additionnel.";
  }

  /**
   * Calculer qualité de synthèse
   */
  calculateSynthesisQuality(phase1, phase2) {
    const certainty = phase1.certainty_level || 5;
    const alignment = phase2.alignment_with_good || 5;
    const ethicalWeight = phase2.ethical_weight || 5;

    // Score basé sur cohérence et alignement
    const score = ((certainty + alignment + ethicalWeight) / 30) * 100;
    return Math.round(score);
  }

  /**
   * Stocker décision dans IntuitiveDecision
   */
  async storeDecision(userInput, phase1, phase2, synthesis, modality) {
    try {
      await base44.entities.IntuitiveDecision.create({
        decision_context: userInput,
        heart_reasoning: {
          logic_analysis: phase1.logic_analysis,
          rational_path: phase1.rational_path,
          certainty_level: phase1.certainty_level
        },
        consciousness_guidance: {
          moral_evaluation: phase2.moral_evaluation,
          intention_clarity: phase2.intention_clarity,
          ethical_weight: phase2.ethical_weight
        },
        final_response: synthesis.final_response,
        decision_type: 'synthesis',
        heart_consciousness_ratio: `${this.config.ratio_logic}:${this.config.ratio_consciousness}`,
        synthesis_quality: synthesis.synthesis_quality,
        modality
      });
    } catch (error) {
      console.error('[TwoPhase] Erreur stockage décision:', error);
    }
  }
}

/**
 * Factory pour créer une instance
 */
export async function createTwoPhaseArchitecture(config = null) {
  const architecture = new TwoPhaseArchitecture(config);
  await architecture.loadConfig();
  return architecture;
}

/**
 * Hook React pour utiliser l'architecture
 */
export function useTwoPhaseArchitecture(config = null) {
  const [architecture, setArchitecture] = React.useState(null);

  React.useEffect(() => {
    createTwoPhaseArchitecture(config).then(setArchitecture);
  }, [config]);

  return architecture;
}

export default TwoPhaseArchitecture;