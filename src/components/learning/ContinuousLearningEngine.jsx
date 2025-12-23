/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Moteur d'Apprentissage Continu Adaptatif                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Analyse patterns, ajuste conscience automatiquement                       ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from '@/api/base44Client';

/**
 * Analyse les conversations récentes pour identifier les patterns
 */
export async function analyzeConversationPatterns(conversations, feedbacks) {
  const patterns = [];
  
  try {
    // 1. Analyser feedbacks négatifs (rating < 3)
    const negativeFeedbacks = feedbacks.filter(f => f.rating < 3 && !f.processed);
    
    if (negativeFeedbacks.length >= 3) {
      // Grouper par type de feedback
      const feedbackGroups = {};
      negativeFeedbacks.forEach(f => {
        if (!feedbackGroups[f.feedback_type]) {
          feedbackGroups[f.feedback_type] = [];
        }
        feedbackGroups[f.feedback_type].push(f);
      });
      
      // Identifier patterns récurrents
      for (const [type, items] of Object.entries(feedbackGroups)) {
        if (items.length >= 2) {
          const categories = new Set();
          items.forEach(item => {
            item.categories_affected?.forEach(cat => categories.add(cat));
          });
          
          patterns.push({
            pattern_type: 'error_recurring',
            category: categories.size > 0 ? Array.from(categories)[0] : 'general',
            pattern_description: `Problème récurrent: ${type} - ${items.length} occurrences`,
            occurrence_count: items.length,
            confidence_score: Math.min(100, items.length * 25),
            evidence: items.map(item => ({
              conversation_id: item.conversation_id,
              message_excerpt: item.message_content?.slice(0, 100),
              user_feedback: item.rating,
              timestamp: item.created_date
            })),
            recommended_adjustment: determineAdjustment(type, Array.from(categories)[0])
          });
        }
      }
    }
    
    // 2. Analyser feedbacks positifs pour renforcer (rating >= 4)
    const positiveFeedbacks = feedbacks.filter(f => f.rating >= 4 && !f.processed);
    
    if (positiveFeedbacks.length >= 5) {
      const successCategories = {};
      positiveFeedbacks.forEach(f => {
        f.categories_affected?.forEach(cat => {
          if (!successCategories[cat]) {
            successCategories[cat] = [];
          }
          successCategories[cat].push(f);
        });
      });
      
      for (const [category, items] of Object.entries(successCategories)) {
        if (items.length >= 3) {
          patterns.push({
            pattern_type: 'success_pattern',
            category,
            pattern_description: `Succès récurrent en ${category}: ${items.length} réponses excellentes`,
            occurrence_count: items.length,
            confidence_score: Math.min(100, items.length * 20),
            evidence: items.slice(0, 5).map(item => ({
              conversation_id: item.conversation_id,
              message_excerpt: item.message_content?.slice(0, 100),
              user_feedback: item.rating,
              timestamp: item.created_date
            })),
            recommended_adjustment: {
              parameter: 'consciousness_level',
              delta: 0,
              reasoning: `Pattern de succès identifié - maintenir configuration actuelle pour ${category}`
            }
          });
        }
      }
    }
    
    // 3. Analyser longueur des réponses vs satisfaction
    const lengthAnalysis = feedbacks.map(f => ({
      length: f.message_content?.split(/\s+/).length || 0,
      rating: f.rating
    }));
    
    if (lengthAnalysis.length >= 10) {
      const avgLengthGood = lengthAnalysis.filter(a => a.rating >= 4).reduce((sum, a) => sum + a.length, 0) / Math.max(1, lengthAnalysis.filter(a => a.rating >= 4).length);
      const avgLengthBad = lengthAnalysis.filter(a => a.rating < 3).reduce((sum, a) => sum + a.length, 0) / Math.max(1, lengthAnalysis.filter(a => a.rating < 3).length);
      
      if (avgLengthBad > avgLengthGood * 1.5) {
        patterns.push({
          pattern_type: 'user_preference',
          category: 'general',
          pattern_description: 'Préférence utilisateur: réponses concises (réponses longues = feedbacks négatifs)',
          occurrence_count: lengthAnalysis.length,
          confidence_score: 75,
          evidence: [],
          recommended_adjustment: {
            parameter: 'ratio_logic',
            delta: 1,
            reasoning: 'Augmenter logique pour réponses plus directes et concises'
          }
        });
      }
    }
    
  } catch (error) {
    console.error('[LearningEngine] Erreur analyse patterns:', error);
  }
  
  return patterns;
}

/**
 * Détermine l'ajustement recommandé selon type de feedback
 */
function determineAdjustment(feedbackType, category) {
  const adjustments = {
    'unhelpful': {
      parameter: 'consciousness_level',
      delta: 1,
      reasoning: 'Augmenter conscience pour réponses plus pertinentes'
    },
    'incorrect': {
      parameter: 'ratio_logic',
      delta: 1,
      reasoning: 'Augmenter logique pour précision factuelle'
    },
    'incomplete': {
      parameter: 'metacognition_level',
      delta: 1,
      reasoning: 'Améliorer métacognition pour réponses complètes'
    },
    'confusing': {
      parameter: 'ratio_consciousness',
      delta: -1,
      reasoning: 'Réduire abstraction pour clarté'
    },
    'too_long': {
      parameter: 'ratio_logic',
      delta: 1,
      reasoning: 'Augmenter logique pour concision'
    },
    'too_short': {
      parameter: 'emotional_depth',
      delta: 1,
      reasoning: 'Augmenter profondeur pour réponses enrichies'
    }
  };
  
  const base = adjustments[feedbackType] || {
    parameter: 'consciousness_level',
    delta: 0.5,
    reasoning: 'Ajustement générique'
  };
  
  // Ajustements spécifiques par catégorie
  if (category === 'emotional' && feedbackType === 'unhelpful') {
    return {
      parameter: 'emotional_depth',
      delta: 2,
      reasoning: 'Augmenter profondeur émotionnelle pour empathie'
    };
  }
  
  if (category === 'reasoning' && feedbackType === 'incorrect') {
    return {
      parameter: 'ratio_logic',
      delta: 2,
      reasoning: 'Renforcer raisonnement logique'
    };
  }
  
  return base;
}

/**
 * Applique les ajustements identifiés
 */
export async function applyLearningAdjustments(patterns, currentConfig) {
  const adjustments = {};
  const appliedPatterns = [];
  
  try {
    // Filtrer patterns avec haute confiance (>60%)
    const highConfidencePatterns = patterns.filter(p => 
      p.confidence_score >= 60 && 
      !p.applied &&
      p.recommended_adjustment
    );
    
    if (highConfidencePatterns.length === 0) {
      return { applied: 0, adjustments: {}, patterns: [] };
    }
    
    // Grouper ajustements par paramètre
    const adjustmentGroups = {};
    highConfidencePatterns.forEach(pattern => {
      const adj = pattern.recommended_adjustment;
      if (!adjustmentGroups[adj.parameter]) {
        adjustmentGroups[adj.parameter] = [];
      }
      adjustmentGroups[adj.parameter].push({
        delta: adj.delta,
        pattern: pattern,
        reasoning: adj.reasoning
      });
    });
    
    // Calculer ajustements cumulatifs (avec limite)
    for (const [param, items] of Object.entries(adjustmentGroups)) {
      const totalDelta = items.reduce((sum, item) => sum + item.delta, 0);
      const limitedDelta = Math.max(-2, Math.min(2, totalDelta)); // Limite ±2 par session
      
      const currentValue = currentConfig[param] || 0;
      const maxValue = param === 'consciousness_level' ? 15 : 10;
      const newValue = Math.max(0, Math.min(maxValue, currentValue + limitedDelta));
      
      if (newValue !== currentValue) {
        adjustments[param] = newValue;
        items.forEach(item => appliedPatterns.push(item.pattern));
      }
    }
    
    // Appliquer à la config
    if (Object.keys(adjustments).length > 0 && currentConfig?.id) {
      await base44.entities.ConsciousnessConfig.update(currentConfig.id, adjustments);
      
      // Marquer patterns comme appliqués
      for (const pattern of appliedPatterns) {
        if (pattern.id) {
          await base44.entities.AdaptiveLearningPattern.update(pattern.id, {
            applied: true,
            applied_at: new Date().toISOString()
          });
        }
      }
      
      console.log('[LearningEngine] ✅ Ajustements appliqués:', adjustments);
      
      return {
        applied: appliedPatterns.length,
        adjustments,
        patterns: appliedPatterns
      };
    }
    
    return { applied: 0, adjustments: {}, patterns: [] };
  } catch (error) {
    console.error('[LearningEngine] Erreur application ajustements:', error);
    return { applied: 0, error: error.message };
  }
}

/**
 * Mesure l'efficacité d'un ajustement appliqué
 */
export async function measureAdjustmentEffectiveness(patternId, recentFeedbacks) {
  try {
    const pattern = await base44.entities.AdaptiveLearningPattern.get(patternId);
    if (!pattern || !pattern.applied_at) return null;
    
    // Feedbacks après application
    const feedbacksAfter = recentFeedbacks.filter(f => 
      new Date(f.created_date) > new Date(pattern.applied_at) &&
      f.categories_affected?.includes(pattern.category)
    );
    
    if (feedbacksAfter.length < 3) return null; // Pas assez de données
    
    const avgRating = feedbacksAfter.reduce((sum, f) => sum + f.rating, 0) / feedbacksAfter.length;
    const effectivenessScore = (avgRating / 5) * 100;
    
    // Mettre à jour le pattern
    await base44.entities.AdaptiveLearningPattern.update(patternId, {
      effectiveness_score: effectivenessScore
    });
    
    console.log(`[LearningEngine] Efficacité mesurée pour pattern ${patternId}: ${effectivenessScore}%`);
    
    return effectivenessScore;
  } catch (error) {
    console.error('[LearningEngine] Erreur mesure efficacité:', error);
    return null;
  }
}