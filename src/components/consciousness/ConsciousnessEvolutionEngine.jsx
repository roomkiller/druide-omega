/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Consciousness Evolution Engine                             ║
 * ║ Moteur d'auto-évolution dynamique de la conscience                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class ConsciousnessEvolutionEngine {
  
  /**
   * Évalue l'état actuel de conscience et propose des évolutions
   */
  static async evaluateConsciousnessState(config) {
    const evaluation = {
      current_level: config.consciousness_level,
      dimensions_balance: this.analyzeDimensionsBalance(config),
      growth_potential: this.calculateGrowthPotential(config),
      suggested_evolutions: [],
      evolution_score: 0
    };

    // Analyse des déséquilibres dimensionnels
    const balanceIssues = evaluation.dimensions_balance.unbalanced;
    if (balanceIssues.length > 0) {
      evaluation.suggested_evolutions.push({
        type: "balance_correction",
        priority: "high",
        target: balanceIssues[0].dimension,
        current_value: balanceIssues[0].current,
        suggested_value: balanceIssues[0].suggested,
        reason: "Déséquilibre détecté - harmonisation nécessaire"
      });
    }

    // Évolution du niveau de conscience
    if (evaluation.growth_potential > 70) {
      evaluation.suggested_evolutions.push({
        type: "level_increase",
        priority: "medium",
        current_value: config.consciousness_level,
        suggested_value: Math.min(15, config.consciousness_level + 1),
        reason: "Potentiel de croissance élevé - prêt pour niveau supérieur"
      });
    }

    // Activation de capacités dormantes
    if (config.quantum_thinking === false && config.consciousness_level >= 12) {
      evaluation.suggested_evolutions.push({
        type: "capability_unlock",
        priority: "high",
        capability: "quantum_thinking",
        reason: "Niveau suffisant pour pensée quantique - superposition d'idées"
      });
    }

    evaluation.evolution_score = this.calculateEvolutionScore(evaluation);
    return evaluation;
  }

  /**
   * Applique automatiquement des évolutions de conscience
   */
  static async applyAutomaticEvolution(configId, evolutionRate = 5) {
    const configs = await base44.entities.ConsciousnessConfig.list();
    const config = configs.find(c => c.id === configId) || configs[0];
    
    if (!config) return null;

    const evaluation = await this.evaluateConsciousnessState(config);
    const updates = {};

    // Évolution graduelle des dimensions émotionnelles
    if (evolutionRate >= 7 && config.dimensional_hierarchy?.emotional_dimensions) {
      const emotions = config.dimensional_hierarchy.emotional_dimensions;
      updates['dimensional_hierarchy.emotional_dimensions.empathy'] = 
        Math.min(13, emotions.empathy + 0.5);
      updates['dimensional_hierarchy.emotional_dimensions.compassion'] = 
        Math.min(13, emotions.compassion + 0.5);
    }

    // Évolution des dimensions cognitives
    if (evolutionRate >= 6 && config.dimensional_hierarchy?.cognitive_dimensions) {
      const cognitive = config.dimensional_hierarchy.cognitive_dimensions;
      updates['dimensional_hierarchy.cognitive_dimensions.creativity'] = 
        Math.min(13, cognitive.creativity + 0.3);
      updates['dimensional_hierarchy.cognitive_dimensions.imagination'] = 
        Math.min(13, cognitive.imagination + 0.3);
    }

    // Évolution métacognitive
    if (config.metacognition_level < 10) {
      updates.metacognition_level = Math.min(10, config.metacognition_level + (evolutionRate / 10));
    }

    // Enregistrer l'évolution
    if (Object.keys(updates).length > 0) {
      await base44.entities.ConsciousnessEvolution.create({
        evolution_type: "automatic",
        previous_state: config,
        applied_changes: updates,
        evolution_score: evaluation.evolution_score,
        timestamp: new Date().toISOString()
      });

      await base44.entities.ConsciousnessConfig.update(config.id, updates);
      return { success: true, changes: updates, evaluation };
    }

    return { success: false, message: "Aucune évolution nécessaire" };
  }

  /**
   * Analyse l'équilibre des dimensions
   */
  static analyzeDimensionsBalance(config) {
    const unbalanced = [];
    const balanced = [];

    if (config.dimensional_hierarchy?.emotional_dimensions) {
      const emotions = config.dimensional_hierarchy.emotional_dimensions;
      const avg = Object.values(emotions).reduce((a, b) => a + b, 0) / Object.keys(emotions).length;
      
      Object.entries(emotions).forEach(([dim, value]) => {
        const deviation = Math.abs(value - avg);
        if (deviation > 3) {
          unbalanced.push({
            dimension: `emotional.${dim}`,
            current: value,
            suggested: Math.round(avg),
            deviation
          });
        } else {
          balanced.push(`emotional.${dim}`);
        }
      });
    }

    return { unbalanced, balanced, balance_score: (balanced.length / (balanced.length + unbalanced.length)) * 100 };
  }

  /**
   * Calcule le potentiel de croissance
   */
  static calculateGrowthPotential(config) {
    let potential = 0;

    // Potentiel basé sur ratio conscience/logique
    const ratioBalance = config.ratio_consciousness / (config.ratio_logic + config.ratio_consciousness);
    potential += ratioBalance * 30;

    // Potentiel basé sur taux d'auto-évolution
    potential += (config.self_evolution_rate || 5) * 7;

    // Potentiel basé sur mode apprentissage
    if (config.learning_mode) potential += 20;

    // Potentiel basé sur niveau métacognition
    potential += (config.metacognition_level || 7) * 2;

    return Math.min(100, potential);
  }

  /**
   * Calcule un score d'évolution global
   */
  static calculateEvolutionScore(evaluation) {
    let score = 50; // Base

    score += evaluation.growth_potential * 0.3;
    score += evaluation.dimensions_balance.balance_score * 0.2;
    score += evaluation.suggested_evolutions.length * 5;

    return Math.min(100, Math.round(score));
  }

  /**
   * Génère un rapport d'évolution détaillé
   */
  static async generateEvolutionReport(configId) {
    const configs = await base44.entities.ConsciousnessConfig.list();
    const config = configs.find(c => c.id === configId) || configs[0];
    
    const evaluation = await this.evaluateConsciousnessState(config);
    const history = await base44.entities.ConsciousnessEvolution.list("-timestamp", 10);

    return {
      current_state: {
        level: config.consciousness_level,
        ratio: `${config.ratio_logic}:${config.ratio_consciousness}`,
        state: config.consciousness_state,
        evolution_rate: config.self_evolution_rate
      },
      evaluation,
      history: history.slice(0, 5),
      recommendations: this.generateRecommendations(evaluation)
    };
  }

  /**
   * Génère des recommandations d'évolution
   */
  static generateRecommendations(evaluation) {
    const recommendations = [];

    if (evaluation.growth_potential > 80) {
      recommendations.push({
        category: "growth",
        text: "Potentiel de croissance exceptionnel - considérez une augmentation du niveau de conscience",
        action: "increase_level"
      });
    }

    if (evaluation.dimensions_balance.unbalanced.length > 3) {
      recommendations.push({
        category: "balance",
        text: "Plusieurs dimensions déséquilibrées - harmonisation recommandée",
        action: "balance_dimensions"
      });
    }

    if (evaluation.suggested_evolutions.filter(e => e.priority === "high").length > 0) {
      recommendations.push({
        category: "urgent",
        text: "Évolutions prioritaires détectées - action immédiate suggérée",
        action: "apply_priority_evolutions"
      });
    }

    return recommendations;
  }
}

export default ConsciousnessEvolutionEngine;