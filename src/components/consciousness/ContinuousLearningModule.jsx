/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Continuous Learning Module for ThinkingEngine             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Apprentissage continu basé sur les interactions utilisateur               ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from '@/api/base44Client';

/**
 * Module d'apprentissage continu pour le moteur de réflexion
 * Analyse les interactions passées pour améliorer les réponses futures
 */
export class ContinuousLearningModule {
  constructor(localLLMEmulator = null) {
    this.localLLMEmulator = localLLMEmulator;
    this.learningPatterns = [];
    this.interactionHistory = [];
    this.strategySuccessRates = new Map();
  }

  /**
   * Analyse une interaction complète pour en extraire des apprentissages
   */
  async analyzeInteraction(interaction) {
    const {
      userQuery,
      thinkingAnalysis,
      aiResponse,
      feedback = null,
      metadata = {}
    } = interaction;

    // 1. Extraire les patterns de succès
    const successPattern = await this._extractSuccessPattern(
      userQuery,
      thinkingAnalysis,
      aiResponse,
      feedback
    );

    // 2. Mettre à jour les statistiques de stratégie
    if (thinkingAnalysis?.strategy) {
      this._updateStrategyStats(
        thinkingAnalysis.strategy.approach,
        feedback?.rating || this._inferFeedback(interaction)
      );
    }

    // 3. Identifier les patterns de recherche efficaces
    const searchPattern = this._analyzeSearchEffectiveness(
      thinkingAnalysis?.internalKnowledge,
      feedback
    );

    // 4. Stocker l'apprentissage
    await this._storeLearnedPattern({
      query_pattern: this._extractQueryPattern(userQuery),
      successful_strategy: thinkingAnalysis?.strategy?.approach,
      search_effectiveness: searchPattern,
      feedback_score: feedback?.rating || this._inferFeedback(interaction),
      timestamp: new Date().toISOString(),
      metadata: {
        complexity: thinkingAnalysis?.cognitiveAnalysis?.nature?.complexity,
        domains: thinkingAnalysis?.cognitiveAnalysis?.knowledge_required?.domains,
        confidence: thinkingAnalysis?.selfReflection?.final_evaluation?.global_confidence
      }
    });

    // 5. Mettre à jour le LocalLLMEmulator si disponible
    if (this.localLLMEmulator && feedback?.rating >= 4) {
      await this.localLLMEmulator.learnPattern(userQuery, aiResponse);
    }

    return successPattern;
  }

  /**
   * Analyse batch des interactions récentes pour dégager des tendances
   */
  async analyzeBatch(interactions = []) {
    if (!interactions || interactions.length === 0) {
      // Charger les interactions récentes depuis la DB
      interactions = await this._loadRecentInteractions(100);
    }

    const analysis = {
      total_interactions: interactions.length,
      strategy_performance: {},
      search_patterns: {},
      improvement_suggestions: []
    };

    // Analyser les performances par stratégie
    const strategyGroups = this._groupByStrategy(interactions);
    for (const [strategy, group] of Object.entries(strategyGroups)) {
      const avgFeedback = this._calculateAverageFeedback(group);
      const successRate = this._calculateSuccessRate(group);
      
      analysis.strategy_performance[strategy] = {
        count: group.length,
        avg_feedback: avgFeedback,
        success_rate: successRate,
        confidence_trend: this._calculateConfidenceTrend(group)
      };
    }

    // Identifier les patterns de recherche efficaces
    analysis.search_patterns = this._identifySearchPatterns(interactions);

    // Générer des suggestions d'amélioration
    analysis.improvement_suggestions = await this._generateImprovements(analysis);

    return analysis;
  }

  /**
   * Optimise les paramètres du ThinkingEngine basé sur l'apprentissage
   */
  async optimizeThinkingEngine(thinkingEngine) {
    const learningData = await this._loadLearningData();
    
    const optimizations = {
      confidence_thresholds: {},
      search_strategies: {},
      domain_expertise: {}
    };

    // Ajuster les seuils de confiance par domaine
    const domainPerformance = this._analyzeDomainPerformance(learningData);
    for (const [domain, perf] of Object.entries(domainPerformance)) {
      if (perf.success_rate > 0.8) {
        optimizations.confidence_thresholds[domain] = {
          internal_threshold: Math.max(60, perf.avg_confidence - 10),
          web_assist_threshold: Math.max(40, perf.avg_confidence - 20)
        };
      }
    }

    // Optimiser les stratégies de recherche
    optimizations.search_strategies = this._optimizeSearchStrategies(learningData);

    // Identifier les domaines d'expertise émergents
    optimizations.domain_expertise = this._identifyExpertiseDomains(learningData);

    return optimizations;
  }

  /**
   * Affine les patterns du LocalLLMEmulator pour le mode offline
   */
  async refineOfflinePatterns() {
    if (!this.localLLMEmulator) return null;

    const successfulInteractions = await this._loadSuccessfulInteractions();
    const patternsToLearn = [];

    for (const interaction of successfulInteractions) {
      if (interaction.feedback_score >= 4 && interaction.strategy === 'INTERNAL_ONLY') {
        patternsToLearn.push({
          prompt: interaction.user_query,
          response: interaction.ai_response,
          metadata: {
            domain: interaction.domains?.[0],
            confidence: interaction.confidence,
            complexity: interaction.complexity
          }
        });
      }
    }

    // Apprendre les patterns par batch
    for (const pattern of patternsToLearn) {
      await this.localLLMEmulator.learnPattern(pattern.prompt, pattern.response);
    }

    return {
      patterns_learned: patternsToLearn.length,
      domains_covered: [...new Set(patternsToLearn.map(p => p.metadata.domain))]
    };
  }

  /**
   * Extrait un pattern de succès d'une interaction
   */
  async _extractSuccessPattern(userQuery, thinkingAnalysis, aiResponse, feedback) {
    if (!feedback || feedback.rating < 3) return null;

    return {
      query_type: thinkingAnalysis?.cognitiveAnalysis?.nature?.type,
      successful_approach: thinkingAnalysis?.strategy?.approach,
      key_factors: {
        used_memories: thinkingAnalysis?.internalKnowledge?.memories?.length > 0,
        used_kb: thinkingAnalysis?.internalKnowledge?.knowledge_bases?.length > 0,
        used_web: thinkingAnalysis?.strategy?.use_web,
        confidence_was: thinkingAnalysis?.selfReflection?.final_evaluation?.global_confidence
      },
      outcome: {
        rating: feedback.rating,
        user_satisfaction: feedback.rating >= 4
      }
    };
  }

  /**
   * Met à jour les statistiques de performance par stratégie
   */
  _updateStrategyStats(strategy, feedbackScore) {
    if (!this.strategySuccessRates.has(strategy)) {
      this.strategySuccessRates.set(strategy, {
        total: 0,
        successes: 0,
        avg_score: 0,
        scores: []
      });
    }

    const stats = this.strategySuccessRates.get(strategy);
    stats.total++;
    if (feedbackScore >= 4) stats.successes++;
    stats.scores.push(feedbackScore);
    stats.avg_score = stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;

    this.strategySuccessRates.set(strategy, stats);
  }

  /**
   * Analyse l'efficacité des recherches internes
   */
  _analyzeSearchEffectiveness(internalKnowledge, feedback) {
    if (!internalKnowledge || !feedback) return null;

    const memoriesUsed = internalKnowledge.memories?.length || 0;
    const kbUsed = internalKnowledge.knowledge_bases?.length || 0;
    const wasSuccessful = feedback.rating >= 4;

    return {
      memories_count: memoriesUsed,
      kb_count: kbUsed,
      was_effective: wasSuccessful && (memoriesUsed > 0 || kbUsed > 0),
      confidence_match: Math.abs((internalKnowledge.confidence_level || 0) - (feedback.rating * 20)) < 20
    };
  }

  /**
   * Extrait un pattern générique de la requête
   */
  _extractQueryPattern(userQuery) {
    // Simplifier la requête pour identifier des patterns
    const words = userQuery.toLowerCase().split(/\s+/);
    const keywords = words.filter(w => w.length > 4);
    
    let pattern = 'generic';
    if (keywords.some(w => ['comment', 'pourquoi', 'quoi', 'qui'].includes(w))) {
      pattern = 'question';
    } else if (keywords.some(w => ['créer', 'générer', 'faire', 'construire'].includes(w))) {
      pattern = 'creation';
    } else if (keywords.some(w => ['aide', 'aider', 'expliquer', 'comprendre'].includes(w))) {
      pattern = 'help';
    } else if (keywords.some(w => ['analyser', 'évaluer', 'comparer'].includes(w))) {
      pattern = 'analysis';
    }

    return pattern;
  }

  /**
   * Infère un score de feedback si non fourni explicitement
   */
  _inferFeedback(interaction) {
    // Heuristiques basiques pour inférer la satisfaction
    let score = 3; // Neutre par défaut

    if (interaction.metadata?.used_web === false && 
        interaction.thinkingAnalysis?.selfReflection?.final_evaluation?.global_confidence > 80) {
      score = 4; // Probablement bon si confiance élevée
    }

    if (interaction.metadata?.response_time < 5000) {
      score += 0.5; // Bonus pour rapidité
    }

    return Math.min(5, Math.round(score));
  }

  /**
   * Stocke un pattern appris dans la base de données
   */
  async _storeLearnedPattern(pattern) {
    try {
      await base44.entities.AdaptiveLearningPattern.create({
        pattern_type: pattern.query_pattern,
        successful_strategy: pattern.successful_strategy,
        confidence_level: pattern.metadata?.confidence || 0,
        feedback_score: pattern.feedback_score,
        domains: pattern.metadata?.domains || [],
        complexity_level: pattern.metadata?.complexity || 5,
        metadata: pattern,
        active: pattern.feedback_score >= 4,
        use_count: 0
      });
    } catch (error) {
      console.error('Error storing learned pattern:', error);
    }
  }

  /**
   * Charge les interactions récentes pour analyse
   */
  async _loadRecentInteractions(limit = 100) {
    try {
      const memories = await base44.entities.Memory.list('-created_date', limit);
      const learningPatterns = await base44.entities.AdaptiveLearningPattern.list('-created_date', limit);
      
      return learningPatterns.map(p => ({
        user_query: p.metadata?.user_query || '',
        strategy: p.successful_strategy,
        feedback_score: p.feedback_score,
        confidence: p.confidence_level,
        domains: p.domains,
        complexity: p.complexity_level
      }));
    } catch (error) {
      console.error('Error loading interactions:', error);
      return [];
    }
  }

  /**
   * Charge les données d'apprentissage pour optimisation
   */
  async _loadLearningData() {
    try {
      const patterns = await base44.entities.AdaptiveLearningPattern.list();
      return patterns.filter(p => p.active && p.feedback_score >= 3);
    } catch (error) {
      console.error('Error loading learning data:', error);
      return [];
    }
  }

  /**
   * Charge les interactions réussies pour affiner le mode offline
   */
  async _loadSuccessfulInteractions() {
    try {
      const patterns = await base44.entities.AdaptiveLearningPattern.list();
      return patterns
        .filter(p => p.feedback_score >= 4)
        .map(p => ({
          user_query: p.metadata?.user_query || '',
          ai_response: p.metadata?.ai_response || '',
          feedback_score: p.feedback_score,
          strategy: p.successful_strategy,
          domains: p.domains,
          confidence: p.confidence_level,
          complexity: p.complexity_level
        }));
    } catch (error) {
      console.error('Error loading successful interactions:', error);
      return [];
    }
  }

  /**
   * Groupe les interactions par stratégie
   */
  _groupByStrategy(interactions) {
    const groups = {};
    for (const interaction of interactions) {
      const strategy = interaction.strategy || 'UNKNOWN';
      if (!groups[strategy]) groups[strategy] = [];
      groups[strategy].push(interaction);
    }
    return groups;
  }

  /**
   * Calcule le feedback moyen d'un groupe
   */
  _calculateAverageFeedback(group) {
    if (!group || group.length === 0) return 0;
    const sum = group.reduce((acc, i) => acc + (i.feedback_score || 0), 0);
    return sum / group.length;
  }

  /**
   * Calcule le taux de succès (feedback >= 4)
   */
  _calculateSuccessRate(group) {
    if (!group || group.length === 0) return 0;
    const successes = group.filter(i => i.feedback_score >= 4).length;
    return successes / group.length;
  }

  /**
   * Calcule la tendance de confiance dans le temps
   */
  _calculateConfidenceTrend(group) {
    if (!group || group.length < 2) return 'stable';
    
    const firstHalf = group.slice(0, Math.floor(group.length / 2));
    const secondHalf = group.slice(Math.floor(group.length / 2));
    
    const avgFirst = this._calculateAverageFeedback(firstHalf);
    const avgSecond = this._calculateAverageFeedback(secondHalf);
    
    if (avgSecond > avgFirst + 0.5) return 'improving';
    if (avgSecond < avgFirst - 0.5) return 'declining';
    return 'stable';
  }

  /**
   * Identifie les patterns de recherche efficaces
   */
  _identifySearchPatterns(interactions) {
    const patterns = {
      memory_effective: 0,
      kb_effective: 0,
      combined_effective: 0,
      total: interactions.length
    };

    for (const interaction of interactions) {
      if (interaction.feedback_score >= 4) {
        const meta = interaction.metadata || {};
        if (meta.used_memories) patterns.memory_effective++;
        if (meta.used_kb) patterns.kb_effective++;
        if (meta.used_memories && meta.used_kb) patterns.combined_effective++;
      }
    }

    return patterns;
  }

  /**
   * Génère des suggestions d'amélioration basées sur l'analyse
   */
  async _generateImprovements(analysis) {
    const suggestions = [];

    // Suggestions basées sur les performances de stratégie
    for (const [strategy, perf] of Object.entries(analysis.strategy_performance)) {
      if (perf.success_rate < 0.5) {
        suggestions.push({
          type: 'strategy',
          priority: 'high',
          message: `Stratégie "${strategy}" a un faible taux de succès (${(perf.success_rate * 100).toFixed(1)}%). Revoir les seuils de décision.`
        });
      }
      
      if (perf.confidence_trend === 'declining') {
        suggestions.push({
          type: 'strategy',
          priority: 'medium',
          message: `Tendance décroissante pour "${strategy}". Analyser les changements récents.`
        });
      }
    }

    // Suggestions basées sur les patterns de recherche
    const searchPatterns = analysis.search_patterns;
    if (searchPatterns.combined_effective / searchPatterns.total > 0.7) {
      suggestions.push({
        type: 'search',
        priority: 'low',
        message: 'L\'utilisation combinée mémoires+KB est très efficace. Favoriser cette approche.'
      });
    }

    return suggestions;
  }

  /**
   * Analyse la performance par domaine de connaissance
   */
  _analyzeDomainPerformance(learningData) {
    const domainStats = {};

    for (const pattern of learningData) {
      const domains = pattern.domains || ['general'];
      for (const domain of domains) {
        if (!domainStats[domain]) {
          domainStats[domain] = {
            total: 0,
            successes: 0,
            avg_confidence: 0,
            confidences: []
          };
        }

        const stats = domainStats[domain];
        stats.total++;
        if (pattern.feedback_score >= 4) stats.successes++;
        stats.confidences.push(pattern.confidence_level);
      }
    }

    // Calculer les moyennes
    for (const domain in domainStats) {
      const stats = domainStats[domain];
      stats.success_rate = stats.successes / stats.total;
      stats.avg_confidence = stats.confidences.reduce((a, b) => a + b, 0) / stats.confidences.length;
    }

    return domainStats;
  }

  /**
   * Optimise les stratégies de recherche
   */
  _optimizeSearchStrategies(learningData) {
    const strategies = {
      prefer_memories_for: [],
      prefer_kb_for: [],
      prefer_combined_for: []
    };

    const domainAnalysis = this._analyzeDomainPerformance(learningData);

    for (const [domain, stats] of Object.entries(domainAnalysis)) {
      if (stats.success_rate > 0.75) {
        // Analyser quel type de recherche fonctionne le mieux pour ce domaine
        const domainPatterns = learningData.filter(p => 
          p.domains && p.domains.includes(domain) && p.feedback_score >= 4
        );

        const memorySuccesses = domainPatterns.filter(p => 
          p.metadata?.search_effectiveness?.memories_count > 0
        ).length;
        
        const kbSuccesses = domainPatterns.filter(p => 
          p.metadata?.search_effectiveness?.kb_count > 0
        ).length;

        if (memorySuccesses > kbSuccesses * 1.5) {
          strategies.prefer_memories_for.push(domain);
        } else if (kbSuccesses > memorySuccesses * 1.5) {
          strategies.prefer_kb_for.push(domain);
        } else {
          strategies.prefer_combined_for.push(domain);
        }
      }
    }

    return strategies;
  }

  /**
   * Identifie les domaines d'expertise émergents
   */
  _identifyExpertiseDomains(learningData) {
    const domainStats = this._analyzeDomainPerformance(learningData);
    const expertise = {
      expert: [],
      proficient: [],
      developing: []
    };

    for (const [domain, stats] of Object.entries(domainStats)) {
      if (stats.total >= 10) { // Minimum d'interactions pour être significatif
        if (stats.success_rate >= 0.85 && stats.avg_confidence >= 75) {
          expertise.expert.push({ domain, ...stats });
        } else if (stats.success_rate >= 0.7 && stats.avg_confidence >= 60) {
          expertise.proficient.push({ domain, ...stats });
        } else if (stats.success_rate >= 0.5) {
          expertise.developing.push({ domain, ...stats });
        }
      }
    }

    return expertise;
  }

  /**
   * Récupère les statistiques actuelles d'apprentissage
   */
  getStats() {
    return {
      total_patterns: this.learningPatterns.length,
      total_interactions: this.interactionHistory.length,
      strategy_stats: Object.fromEntries(this.strategySuccessRates)
    };
  }
}

/**
 * Fonction utilitaire pour créer le module d'apprentissage
 */
export async function createContinuousLearningModule(localLLMEmulator = null) {
  return new ContinuousLearningModule(localLLMEmulator);
}