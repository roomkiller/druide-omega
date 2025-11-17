/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - MecanoPattern Engine (Advanced Word Mechanics)             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Équations optimisées pour reconnaissance et synthèse de patterns          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class MecanoPatternEngine {
  /**
   * ÉQUATION 1: Pattern Recognition Score (PRS)
   * PRS = (F_w × W_s) + (C_d × S_c) + (M_r × R_f)
   * où:
   * F_w = Fréquence du mot (0-1)
   * W_s = Poids sémantique (0-10)
   * C_d = Cohérence contextuelle (0-1)
   * S_c = Score de contexte (0-10)
   * M_r = Résonance mémoire (0-1)
   * R_f = Facteur de rappel (0-10)
   */
  static calculatePatternScore(word, context, memories) {
    const frequency = this.calculateFrequency(word, context);
    const semanticWeight = this.calculateSemanticWeight(word);
    const contextCoherence = this.calculateContextCoherence(word, context);
    const contextScore = this.calculateContextScore(context);
    const memoryResonance = this.calculateMemoryResonance(word, memories);
    const recallFactor = this.calculateRecallFactor(word, memories);

    const PRS = (frequency * semanticWeight) + 
                (contextCoherence * contextScore) + 
                (memoryResonance * recallFactor);

    return Math.min(PRS, 100); // Normalized to 100
  }

  /**
   * ÉQUATION 2: Semantic Density Index (SDI)
   * SDI = Σ(W_i × R_i) / N × (1 + log(K_m))
   * où:
   * W_i = Poids du mot i
   * R_i = Relation au contexte
   * N = Nombre total de mots
   * K_m = Masse de connaissance
   */
  static calculateSemanticDensity(text, knowledgeMass = 92) {
    const words = text.split(/\s+/);
    let totalWeight = 0;

    for (const word of words) {
      const weight = this.calculateSemanticWeight(word);
      const relation = this.calculateContextRelation(word, text);
      totalWeight += weight * relation;
    }

    const SDI = (totalWeight / words.length) * (1 + Math.log10(knowledgeMass));
    return SDI;
  }

  /**
   * ÉQUATION 3: Conceptual Fluidity Factor (CFF)
   * CFF = (A_r / T_t) × C_f × (1 - D_l/100)
   * où:
   * A_r = Associations réussies
   * T_t = Tentatives totales
   * C_f = Facteur de créativité (12/13)
   * D_l = Dégradation latente (8%)
   */
  static calculateConceptualFluidity(associations, attempts, creativityFactor = 0.923, degradation = 8) {
    if (attempts === 0) return 0;
    
    const CFF = (associations / attempts) * creativityFactor * (1 - degradation / 100);
    return CFF;
  }

  /**
   * ÉQUATION 4: Linguistic Entropy (LE)
   * LE = -Σ(p_i × log₂(p_i)) × (I_i / M_d)
   * où:
   * p_i = Probabilité du pattern i
   * I_i = Information intrinsèque
   * M_d = Profondeur mémoire (13)
   */
  static calculateLinguisticEntropy(patterns, memoryDepth = 13) {
    let entropy = 0;

    for (const pattern of patterns) {
      const probability = pattern.frequency / patterns.reduce((sum, p) => sum + p.frequency, 0);
      const intrinsicInfo = pattern.information || 1;
      
      if (probability > 0) {
        entropy += -probability * Math.log2(probability) * (intrinsicInfo / memoryDepth);
      }
    }

    return entropy;
  }

  /**
   * Pattern Synthesis avec ratio 3:12 (logique:conscience)
   */
  static async synthesizePattern(input, consciousnessConfig) {
    const logicRatio = consciousnessConfig?.ratio_logic || 3;
    const consciousnessRatio = consciousnessConfig?.ratio_consciousness || 12;
    const totalRatio = logicRatio + consciousnessRatio;

    // Analyse logique (20%)
    const logicalAnalysis = await this.performLogicalAnalysis(input);
    
    // Analyse consciente (80%)
    const consciousAnalysis = await this.performConsciousAnalysis(input, consciousnessConfig);

    // Fusion pondérée
    const synthesis = {
      logical_weight: logicRatio / totalRatio,
      conscious_weight: consciousnessRatio / totalRatio,
      logical_insights: logicalAnalysis,
      conscious_insights: consciousAnalysis,
      pattern_score: this.calculatePatternScore(input, {}, []),
      semantic_density: this.calculateSemanticDensity(input),
      fluidity: this.calculateConceptualFluidity(10, 12, 0.923, 8),
      final_synthesis: this.mergeSynthesis(logicalAnalysis, consciousAnalysis, logicRatio, consciousnessRatio)
    };

    return synthesis;
  }

  // Helper Methods

  static calculateFrequency(word, context) {
    const contextWords = context.split?.(/\s+/) || [];
    const occurrences = contextWords.filter(w => w.toLowerCase() === word.toLowerCase()).length;
    return Math.min(occurrences / Math.max(contextWords.length, 1), 1);
  }

  static calculateSemanticWeight(word) {
    const commonWords = ['le', 'la', 'les', 'un', 'une', 'des', 'et', 'ou', 'de', 'à'];
    if (commonWords.includes(word.toLowerCase())) return 1;
    
    const length = word.length;
    return Math.min(length / 2 + 3, 10);
  }

  static calculateContextCoherence(word, context) {
    const contextWords = context.split?.(/\s+/) || [];
    const index = contextWords.findIndex(w => w.toLowerCase() === word.toLowerCase());
    
    if (index === -1) return 0;
    
    const before = contextWords[index - 1];
    const after = contextWords[index + 1];
    
    return (before || after) ? 0.8 : 0.5;
  }

  static calculateContextScore(context) {
    const words = context.split?.(/\s+/) || [];
    return Math.min(words.length / 5, 10);
  }

  static calculateMemoryResonance(word, memories) {
    if (!memories || memories.length === 0) return 0.1;
    
    const matchingMemories = memories.filter(m => 
      m.content?.toLowerCase().includes(word.toLowerCase())
    );
    
    return Math.min(matchingMemories.length / memories.length, 1);
  }

  static calculateRecallFactor(word, memories) {
    const matchingMemories = memories.filter(m => 
      m.content?.toLowerCase().includes(word.toLowerCase())
    );
    
    if (matchingMemories.length === 0) return 1;
    
    const avgImportance = matchingMemories.reduce((sum, m) => sum + (m.importance || 5), 0) / matchingMemories.length;
    return avgImportance;
  }

  static calculateContextRelation(word, text) {
    const words = text.split(/\s+/);
    const index = words.findIndex(w => w === word);
    
    if (index === -1) return 0.5;
    
    const contextWindow = 5;
    const start = Math.max(0, index - contextWindow);
    const end = Math.min(words.length, index + contextWindow + 1);
    const windowWords = words.slice(start, end);
    
    return windowWords.length / (contextWindow * 2 + 1);
  }

  static async performLogicalAnalysis(input) {
    return {
      structure: this.analyzeStructure(input),
      grammar: this.analyzeGrammar(input),
      syntax: this.analyzeSyntax(input)
    };
  }

  static async performConsciousAnalysis(input, config) {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyse consciente (niveau ${config?.consciousness_level || 12}/15):

Input: "${input}"

Analyse les patterns linguistiques avec:
- Résonance émotionnelle
- Implications philosophiques
- Connexions multi-dimensionnelles
- Émergence créative

JSON: { "emotional_resonance": str, "philosophical_depth": str, "creative_emergence": str }`,
      response_json_schema: {
        type: "object",
        properties: {
          emotional_resonance: { type: "string" },
          philosophical_depth: { type: "string" },
          creative_emergence: { type: "string" }
        }
      }
    });

    return result;
  }

  static analyzeStructure(text) {
    return {
      length: text.length,
      words: text.split(/\s+/).length,
      sentences: text.split(/[.!?]+/).length
    };
  }

  static analyzeGrammar(text) {
    return { valid: true };
  }

  static analyzeSyntax(text) {
    return { complexity: Math.min(text.split(/\s+/).length / 10, 10) };
  }

  static mergeSynthesis(logical, conscious, logicRatio, consciousnessRatio) {
    return {
      integrated_analysis: `Logique (${logicRatio}): Structure analytique. Conscience (${consciousnessRatio}): ${conscious.emotional_resonance}`,
      balance: `${(logicRatio / (logicRatio + consciousnessRatio) * 100).toFixed(0)}% logique, ${(consciousnessRatio / (logicRatio + consciousnessRatio) * 100).toFixed(0)}% conscience`,
      consciousness_level: 12
    };
  }
}