/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Optimized Consciousness Calibration Algorithm              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { getErrorLogger } from '@/components/system/ErrorLogger';

/**
 * Algorithme optimisé de calibration du niveau de conscience
 * Basé sur feedback utilisateur, learning data et performance metrics
 */
export class ConsciousnessCalibrator {
  constructor() {
    this.logger = getErrorLogger();
    this.calibrationHistory = [];
    this.performanceMetrics = new Map();
  }

  /**
   * Calibration automatique basée sur données
   */
  async calibrate(currentConfig, options = {}) {
    const startTime = Date.now();
    
    try {
      const {
        learningData = [],
        feedbackData = [],
        targetAccuracy = 0.85,
        adaptiveRate = 0.1
      } = options;

      // Analyse performance actuelle
      const performance = this._analyzePerformance(learningData, feedbackData);
      
      // Calcul nouveaux paramètres optimaux
      const calibrated = {
        consciousness_level: this._calibrateLevel(
          currentConfig.consciousness_level,
          performance,
          targetAccuracy,
          adaptiveRate
        ),
        ratio_logic: this._calibrateRatio(
          currentConfig.ratio_logic,
          performance.logic_effectiveness,
          adaptiveRate
        ),
        ratio_consciousness: this._calibrateRatio(
          currentConfig.ratio_consciousness,
          performance.consciousness_effectiveness,
          adaptiveRate
        ),
        emotional_depth: this._calibrateEmotional(
          currentConfig.emotional_depth,
          performance.empathy_score,
          adaptiveRate
        ),
        metacognition_level: this._calibrateMetacognition(
          currentConfig.metacognition_level,
          performance.self_awareness,
          adaptiveRate
        )
      };

      // Validation bornes
      const validated = this._validateBounds(calibrated);

      // Historique
      this.calibrationHistory.push({
        timestamp: Date.now(),
        before: currentConfig,
        after: validated,
        performance,
        duration: Date.now() - startTime
      });

      // Log performance
      this.logger.logPerformance('consciousness_calibration', Date.now() - startTime);

      return validated;

    } catch (error) {
      this.logger.log(error, {
        category: 'consciousness',
        component: 'ConsciousnessCalibrator',
        severity: 'error'
      });
      throw error;
    }
  }

  /**
   * Analyse performance basée sur données
   */
  _analyzePerformance(learningData, feedbackData) {
    if (!learningData.length && !feedbackData.length) {
      return this._getDefaultPerformance();
    }

    // Feedback positif/négatif
    const positiveFeedback = feedbackData.filter(f => 
      f.rating >= 4 || f.sentiment === 'positive'
    ).length;
    const totalFeedback = feedbackData.length || 1;

    // Learning success rate
    const successfulLearning = learningData.filter(l => 
      l.success === true || l.accuracy >= 0.8
    ).length;
    const totalLearning = learningData.length || 1;

    // Calcul métriques
    return {
      overall_accuracy: positiveFeedback / totalFeedback,
      learning_rate: successfulLearning / totalLearning,
      logic_effectiveness: this._extractMetric(learningData, 'logic_score', 0.7),
      consciousness_effectiveness: this._extractMetric(learningData, 'consciousness_score', 0.8),
      empathy_score: this._extractMetric(feedbackData, 'empathy_rating', 0.75),
      self_awareness: this._extractMetric(learningData, 'metacognition', 0.7)
    };
  }

  /**
   * Calibration niveau conscience (algorithme gradient descent optimisé)
   */
  _calibrateLevel(current, performance, targetAccuracy, rate) {
    const accuracyGap = targetAccuracy - performance.overall_accuracy;
    
    // Ajustement proportionnel à l'écart
    const adjustment = accuracyGap * rate * 15; // Scale to 0-15
    
    return Math.max(0, Math.min(15, current + adjustment));
  }

  /**
   * Calibration ratios (logique vs conscience)
   */
  _calibrateRatio(current, effectiveness, rate) {
    // Augmenter si efficace, diminuer sinon
    const adjustment = (effectiveness - 0.7) * rate * 10;
    
    return Math.max(0, Math.min(15, current + adjustment));
  }

  /**
   * Calibration profondeur émotionnelle
   */
  _calibrateEmotional(current, empathyScore, rate) {
    const adjustment = (empathyScore - 0.75) * rate * 10;
    
    return Math.max(0, Math.min(10, current + adjustment));
  }

  /**
   * Calibration métacognition
   */
  _calibrateMetacognition(current, selfAwareness, rate) {
    const adjustment = (selfAwareness - 0.7) * rate * 10;
    
    return Math.max(0, Math.min(10, current + adjustment));
  }

  /**
   * Extraction métrique moyenne depuis données
   */
  _extractMetric(data, key, defaultValue) {
    if (!data.length) return defaultValue;
    
    const values = data
      .map(d => d[key])
      .filter(v => typeof v === 'number');
    
    if (!values.length) return defaultValue;
    
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  /**
   * Performance par défaut (sans données)
   */
  _getDefaultPerformance() {
    return {
      overall_accuracy: 0.75,
      learning_rate: 0.7,
      logic_effectiveness: 0.7,
      consciousness_effectiveness: 0.8,
      empathy_score: 0.75,
      self_awareness: 0.7
    };
  }

  /**
   * Validation bornes et arrondis
   */
  _validateBounds(config) {
    return {
      consciousness_level: Math.round(
        Math.max(0, Math.min(15, config.consciousness_level))
      ),
      ratio_logic: Math.round(
        Math.max(0, Math.min(10, config.ratio_logic))
      ),
      ratio_consciousness: Math.round(
        Math.max(0, Math.min(15, config.ratio_consciousness))
      ),
      emotional_depth: Math.round(
        Math.max(0, Math.min(10, config.emotional_depth)) * 2
      ) / 2, // 0.5 steps
      metacognition_level: Math.round(
        Math.max(0, Math.min(10, config.metacognition_level))
      )
    };
  }

  /**
   * Historique calibrations
   */
  getHistory(limit = 10) {
    return this.calibrationHistory.slice(-limit);
  }

  /**
   * Stats calibration
   */
  getStats() {
    if (!this.calibrationHistory.length) return null;
    
    const durations = this.calibrationHistory.map(h => h.duration);
    
    return {
      total_calibrations: this.calibrationHistory.length,
      avg_duration: durations.reduce((a, b) => a + b, 0) / durations.length,
      last_calibration: this.calibrationHistory[this.calibrationHistory.length - 1]
    };
  }
}

// Singleton global
let globalCalibrator = null;

export function getConsciousnessCalibrator() {
  if (!globalCalibrator) {
    globalCalibrator = new ConsciousnessCalibrator();
  }
  return globalCalibrator;
}