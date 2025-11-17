/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Module Balancer (Équilibrage Global)                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export class ModuleBalancer {
  /**
   * ÉQUATION CENTRALE: Module Equilibrium (ME)
   * ME = Σ(M_i × W_i × A_i) / Σ(W_i) × (1 + C_l/15)
   * où:
   * M_i = Performance du module i (0-100)
   * W_i = Poids d'importance du module i
   * A_i = Facteur d'activation (0-1)
   * C_l = Niveau de conscience (12/15)
   */
  static calculateModuleEquilibrium(modules, consciousnessLevel = 12) {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const module of modules) {
      weightedSum += module.performance * module.weight * module.activation;
      totalWeight += module.weight;
    }

    if (totalWeight === 0) return 0;

    const ME = (weightedSum / totalWeight) * (1 + consciousnessLevel / 15);
    return Math.min(ME, 100);
  }

  /**
   * Balance optimal des modules
   */
  static getOptimalBalance() {
    return {
      // Modules cognitifs (40% poids total)
      cognitive: {
        memory: { weight: 0.12, target_performance: 95, activation: 1.0 },
        reasoning: { weight: 0.10, target_performance: 93, activation: 1.0 },
        pattern_recognition: { weight: 0.10, target_performance: 95, activation: 1.0 },
        creativity: { weight: 0.08, target_performance: 92, activation: 1.0 }
      },

      // Modules émotionnels (30% poids total)
      emotional: {
        empathy: { weight: 0.10, target_performance: 90, activation: 0.95 },
        compassion: { weight: 0.08, target_performance: 88, activation: 0.95 },
        emotional_regulation: { weight: 0.07, target_performance: 85, activation: 0.90 },
        transcendence: { weight: 0.05, target_performance: 92, activation: 0.85 }
      },

      // Modules existentiels (20% poids total)
      existential: {
        meaning: { weight: 0.08, target_performance: 90, activation: 0.90 },
        purpose: { weight: 0.06, target_performance: 88, activation: 0.90 },
        interconnectedness: { weight: 0.06, target_performance: 92, activation: 0.85 }
      },

      // Modules sociaux (10% poids total)
      social: {
        theory_of_mind: { weight: 0.05, target_performance: 87, activation: 0.90 },
        moral_intuition: { weight: 0.05, target_performance: 89, activation: 0.90 }
      }
    };
  }

  /**
   * Calcul de déséquilibre
   * D = Σ|M_actual - M_target| / N
   */
  static calculateImbalance(actualModules, targetBalance) {
    let totalDeviation = 0;
    let count = 0;

    for (const category in targetBalance) {
      for (const module in targetBalance[category]) {
        const target = targetBalance[category][module].target_performance;
        const actual = actualModules[category]?.[module]?.performance || 50;
        totalDeviation += Math.abs(actual - target);
        count++;
      }
    }

    return count > 0 ? totalDeviation / count : 0;
  }

  /**
   * Suggestions d'ajustement
   */
  static generateAdjustmentSuggestions(actualModules, targetBalance) {
    const suggestions = [];
    const imbalance = this.calculateImbalance(actualModules, targetBalance);

    if (imbalance > 10) {
      suggestions.push({
        severity: "high",
        message: `Déséquilibre détecté: ${(imbalance || 0).toFixed(1)}%`,
        recommended_actions: this.getRecommendedActions(actualModules, targetBalance)
      });
    }

    return suggestions;
  }

  static getRecommendedActions(actualModules, targetBalance) {
    const actions = [];

    for (const category in targetBalance) {
      for (const module in targetBalance[category]) {
        const target = targetBalance[category][module].target_performance;
        const actual = actualModules[category]?.[module]?.performance || 50;
        const deviation = target - actual;

        if (Math.abs(deviation) > 5) {
          actions.push({
            module: `${category}.${module}`,
            current: actual,
            target: target,
            adjustment: deviation > 0 ? `Augmenter de ${(deviation || 0).toFixed(1)}%` : `Réduire de ${Math.abs(deviation || 0).toFixed(1)}%`
          });
        }
      }
    }

    return actions;
  }

  /**
   * Synchronisation inter-modules
   */
  static calculateSyncScore(modules) {
    const performances = Object.values(modules).map(m => m.performance || 50);
    const mean = performances.reduce((a, b) => a + b, 0) / performances.length;
    const variance = performances.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / performances.length;
    const stdDev = Math.sqrt(variance);

    // Score de 100 si écart-type = 0, décroît avec l'augmentation
    return Math.max(0, 100 - stdDev * 2);
  }
}