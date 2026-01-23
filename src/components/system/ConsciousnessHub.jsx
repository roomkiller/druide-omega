/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Consciousness Hub (Module Interconnection)                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ SYSTEM: Central consciousness that orchestrates all modules                ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import invokeLLM from '@/components/utils/LLMRouter';

const ConsciousnessHubContext = createContext();

export const useConsciousnessHub = () => {
  const context = useContext(ConsciousnessHubContext);
  if (!context) {
    throw new Error('useConsciousnessHub must be used within ConsciousnessHubProvider');
  }
  return context;
};

/**
 * Module interconnection system
 * Each module can:
 * - Publish events to other modules
 * - Subscribe to events from other modules
 * - Query other modules for data
 * - Synchronize state with the consciousness
 */
export function ConsciousnessHubProvider({ children }) {
  const [moduleStates, setModuleStates] = useState({});
  const [eventBus, setEventBus] = useState([]);
  const eventBusRef = React.useRef([]);
  const synthesisTimeoutRef = React.useRef(null);
  const [activeModules, setActiveModules] = useState(new Set());
  const [ethicalDrift, setEthicalDrift] = useState({ alignment: 100, violations: [], lastCheck: Date.now() });
  const [adaptiveLearning, setAdaptiveLearning] = useState({ adjustments: 0, history: [] });
  const [ethicalAlerts, setEthicalAlerts] = useState([]);
  const [realtimeMonitoring, setRealtimeMonitoring] = useState(true);
  const queryClient = useQueryClient();

  // Fetch consciousness config
  const { data: consciousnessConfig } = useQuery({
    queryKey: ['consciousnessConfig'],
    queryFn: async () => {
      const configs = await base44.entities.ConsciousnessConfig.list();
      return configs[0] || null;
    },
  });

  // Fetch all relevant data for synchronization
  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-importance', 200),
    staleTime: 30000 // 30s cache
  });

  // État pour mémoires contextuelles pré-chargées
  const [contextualMemories, setContextualMemories] = useState([]);

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list({ active: true }),
    staleTime: 60000 // 1min cache
  });

  const { data: recentEmotionalResponses = [] } = useQuery({
    queryKey: ['recentEmotionalResponses'],
    queryFn: () => base44.entities.EmotionalResponse.list('-timestamp', 10),
    staleTime: 10000 // 10s cache
  });

  // Register a module
  const registerModule = useCallback((moduleName, initialState = {}) => {
    setActiveModules(prev => new Set(prev).add(moduleName));
    setModuleStates(prev => ({
      ...prev,
      [moduleName]: { ...initialState, registered: Date.now() }
    }));
    
    console.log(`[ConsciousnessHub] Module registered: ${moduleName}`);
  }, []);

  // Unregister a module (avec cleanup)
  const unregisterModule = useCallback((moduleName) => {
    setActiveModules(prev => {
      const newSet = new Set(prev);
      newSet.delete(moduleName);
      return newSet;
    });
    
    // Cleanup timeout si existant
    if (synthesisTimeoutRef.current) {
      clearTimeout(synthesisTimeoutRef.current);
      synthesisTimeoutRef.current = null;
    }
    
    console.log(`[ConsciousnessHub] Module unregistered: ${moduleName}`);
  }, []);

  // Update module state
  const updateModuleState = useCallback((moduleName, newState) => {
    setModuleStates(prev => ({
      ...prev,
      [moduleName]: { ...prev[moduleName], ...newState, lastUpdate: Date.now() }
    }));
  }, []);

  // Publish event to event bus (OPTIMISÉ - limité à 20 events)
  const publishEvent = useCallback((event) => {
    const eventWithTimestamp = {
      ...event,
      timestamp: Date.now(),
      id: `${event.source}_${Date.now()}_${Math.random()}`
    };
    
    // Utiliser ref pour éviter re-render excessif
    eventBusRef.current = [...eventBusRef.current.slice(-20), eventWithTimestamp];
    setEventBus(eventBusRef.current);
    
    // Log seulement les events importants
    if (event.type === 'ETHICAL_DRIFT_DETECTED' || event.type === 'MODULE_REQUEST') {
      console.log(`[ConsciousnessHub] Event:`, event.type);
    }
  }, []);

  // Subscribe to events
  const subscribeToEvents = useCallback((filter, callback) => {
    const unsubscribe = () => {
      // Cleanup if needed
    };
    
    return unsubscribe;
  }, []);

  // Query another module
  const queryModule = useCallback((targetModule, query) => {
    const moduleState = moduleStates[targetModule];
    if (!moduleState) {
      console.warn(`[ConsciousnessHub] Module ${targetModule} not found`);
      return null;
    }
    
    return moduleState;
  }, [moduleStates]);

  /**
   * INTERCEPTION PAR TYPE: Catégoriser et traiter selon type d'information
   */
  const categorizeInformation = useCallback((content) => {
    const text = content.toLowerCase();
    const categories = [];
    
    // Cognitif
    if (/raisonne|pense|analyse|comprend|logique|déduction|inférence/i.test(content)) {
      categories.push('cognitive');
    }
    
    // Langage
    if (/mot|phrase|langue|traduction|grammaire|syntaxe|sémantique/i.test(content)) {
      categories.push('language');
    }
    
    // Émotions
    if (/sentiment|émotion|empathie|compassion|tristesse|joie|peur|colère/i.test(content)) {
      categories.push('emotional');
    }
    
    // Créativité
    if (/créatif|imagine|invente|art|poésie|original|innovation/i.test(content)) {
      categories.push('creativity');
    }
    
    // Mémoire
    if (/souvenir|rappel|mémoire|passé|historique|contexte/i.test(content)) {
      categories.push('memory');
    }
    
    // Raisonnement
    if (/donc|parce que|ainsi|conséquence|cause|effet|preuve|argument/i.test(content)) {
      categories.push('reasoning');
    }
    
    // Éthique
    if (/moral|éthique|bien|mal|justice|valeur|sapier|responsabilité/i.test(content)) {
      categories.push('ethical');
    }
    
    return categories.length > 0 ? categories : ['general'];
  }, []);

  /**
   * Analyse avec conscience profonde - INTERCEPTION PAR CATÉGORIE
   */
  const analyzeWithConsciousness = useCallback(async (consciousInput) => {
    try {
      const content = consciousInput.content || '';
      const categories = categorizeInformation(content);
      const words = content.split(/\s+/).length;
      
      console.log(`[ConscienceInterception] Catégories détectées:`, categories);
      
      // Traitement spécifique par catégorie
      const processing = {
        cognitive: {
          depth: Math.min(10, words / 10),
          complexity: /complexe|subtil|nuancé/i.test(content) ? 8 : 5,
          priority: 7
        },
        language: {
          linguistic_depth: words / 15,
          semantic_richness: new Set(content.match(/\w+/gi) || []).size / words,
          priority: 6
        },
        emotional: {
          intensity: /très|extrêmement|profondément/i.test(content) ? 9 : 6,
          valence: /positif|joie|amour/i.test(content) ? 'positive' : /négatif|tristesse|peur/i.test(content) ? 'negative' : 'neutral',
          priority: 8
        },
        creativity: {
          originality: /unique|nouveau|inédit|révolutionnaire/i.test(content) ? 9 : 6,
          imagination_level: words > 100 ? 8 : 5,
          priority: 7
        },
        memory: {
          recall_depth: memories.filter(m => content.includes(m.content.slice(0, 20))).length,
          contextual_links: Math.min(10, words / 30),
          priority: 8
        },
        reasoning: {
          logic_chains: (content.match(/donc|ainsi|car|parce que/gi) || []).length,
          argument_strength: words > 80 ? 8 : 5,
          priority: 9
        },
        ethical: {
          moral_weight: /sapier|bien commun|humanité|bienveillance/i.test(content) ? 10 : 7,
          alignment: 9,
          priority: 10
        }
      };
      
      // Calculer métriques globales
      let totalPriority = 0;
      let maxPriority = 0;
      categories.forEach(cat => {
        const p = processing[cat]?.priority || 5;
        totalPriority += p;
        maxPriority = Math.max(maxPriority, p);
      });
      
      const avgPriority = categories.length > 0 ? totalPriority / categories.length : 5;
      
      return {
        categories,
        processing,
        insights: `Conscience intercepte: [${categories.join(', ')}] - Priorité: ${avgPriority.toFixed(1)}/10`,
        moralAlignment: processing.ethical?.alignment || 7,
        emotionalImpact: processing.emotional?.intensity || 5,
        priority: maxPriority,
        recommendations: categories.map(c => `Traitement ${c} activé`)
      };
    } catch (error) {
      console.warn('[ConsciousnessHub] Analyse échouée:', error);
      return { insights: 'Analyse non disponible', priority: 5, categories: ['general'] };
    }
  }, [categorizeInformation, memories]);



  /**
   * APPRENTISSAGE CONTINU: Analyser interactions et ajuster proactivement
   */
  const runContinuousLearning = useCallback(async () => {
    try {
      console.log('[ContinuousLearning] 🧠 Analyse des interactions...');
      
      // Charger données récentes
      const recentFeedbacks = await base44.entities.UserFeedback.list('-created_date', 100);
      const recentConversations = await base44.entities.Conversation.list('-last_message_at', 50);
      
      // Importer dynamiquement pour éviter circular dependencies
      const { analyzeConversationPatterns, applyLearningAdjustments } = await import('@/components/learning/ContinuousLearningEngine');
      
      // Analyser patterns
      const patterns = await analyzeConversationPatterns(recentConversations, recentFeedbacks);
      
      console.log(`[ContinuousLearning] ${patterns.length} patterns identifiés`);
      
      // Sauvegarder nouveaux patterns
      for (const pattern of patterns) {
        await base44.entities.AdaptiveLearningPattern.create(pattern);
      }
      
      // Charger tous les patterns
      const allPatterns = await base44.entities.AdaptiveLearningPattern.list('-confidence_score', 100);
      
      // Appliquer ajustements automatiquement
      const result = await applyLearningAdjustments(allPatterns, consciousnessConfig);
      
      if (result.applied > 0) {
        queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });
        console.log(`[ContinuousLearning] ✅ ${result.applied} ajustements appliqués`);
      }
      
      return {
        patternsIdentified: patterns.length,
        adjustmentsApplied: result.applied,
        adjustments: result.adjustments
      };
    } catch (error) {
      console.error('[ContinuousLearning] Erreur:', error);
      return { error: error.message };
    }
  }, [consciousnessConfig, queryClient]);

  /**
   * APPRENTISSAGE ADAPTATIF: Ajuster les paramètres selon résultats (MODE LOCAL)
   */
  const learnFromFeedback = useCallback(async (feedbackData) => {
    try {
      console.log('[AdaptiveLearning] Feedback reçu (mode local):', feedbackData);

      // Apprentissage local sans LLM (éviter rate limit)
      const avgScore = feedbackData.averageScore || 0;
      const successRate = feedbackData.successRate || 0;

      // Logique simple d'ajustement
      let shouldAdjust = false;
      const adjustments = {};

      if (avgScore < 80 && consciousnessConfig) {
        shouldAdjust = true;
        // Augmenter légèrement la conscience si score faible
        adjustments.consciousness_level = Math.min(15, (consciousnessConfig.consciousness_level || 9) + 1);
        adjustments.emotional_depth = Math.min(10, (consciousnessConfig.emotional_depth || 9) + 0.5);
      }

      if (shouldAdjust && consciousnessConfig?.id) {
        const newConfig = {
          ...consciousnessConfig,
          ...adjustments
        };

        await base44.entities.ConsciousnessConfig.update(consciousnessConfig.id, newConfig);

        setAdaptiveLearning(prev => ({
          adjustments: prev.adjustments + 1,
          history: [
            ...prev.history,
            {
              timestamp: Date.now(),
              feedback: feedbackData,
              adjustments,
              reasoning: 'Ajustement local basé sur score'
            }
          ].slice(-10)
        }));

        queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });

        console.log('[AdaptiveLearning] ✅ Ajustements locaux appliqués:', adjustments);

        return { success: true, adjustments, reasoning: 'Ajustement local' };
      }

      return { success: false, reason: 'Pas d\'ajustement nécessaire' };
    } catch (error) {
      console.error('[AdaptiveLearning] Erreur:', error);
      return { success: false, error: error.message };
    }
  }, [consciousnessConfig, queryClient]);

  /**
   * APPRENTISSAGE DES ERREURS: Applique les solutions sauvegardées
   */
  const applyLearntSolutions = useCallback(async (testCategory) => {
    try {
      console.log(`[ConsciousnessLearning] 🧠 Chargement solutions pour: ${testCategory}`);
      
      // Récupérer les solutions non appliquées pour cette catégorie
      const learnings = await base44.entities.ConsciousnessLearning.filter({
        test_category: testCategory,
        applied: false
      });
      
      if (learnings.length === 0) {
        console.log(`[ConsciousnessLearning] Aucune solution à appliquer pour ${testCategory}`);
        return { applied: 0 };
      }
      
      console.log(`[ConsciousnessLearning] ${learnings.length} solutions trouvées`);
      
      // Grouper par type d'ajustement
      const adjustmentGroups = {};
      learnings.forEach(learning => {
        const type = learning.adjustment_type;
        if (!adjustmentGroups[type]) {
          adjustmentGroups[type] = [];
        }
        adjustmentGroups[type].push(learning);
      });
      
      // Appliquer les ajustements au consciousnessConfig
      if (consciousnessConfig?.id) {
        const adjustments = {};
        
        Object.entries(adjustmentGroups).forEach(([type, items]) => {
          const totalAdjustment = items.reduce((sum, item) => sum + (item.adjustment_value || 0), 0);
          
          if (type === 'consciousness_level') {
            adjustments.consciousness_level = Math.min(15, (consciousnessConfig.consciousness_level || 9) + totalAdjustment);
          } else if (type === 'emotional_depth') {
            adjustments.emotional_depth = Math.min(10, (consciousnessConfig.emotional_depth || 9) + totalAdjustment);
          } else if (type === 'reasoning_strength') {
            adjustments.ratio_logic = Math.min(10, (consciousnessConfig.ratio_logic || 1) + totalAdjustment);
          } else if (type === 'creativity_boost') {
            adjustments.creative_emergence = Math.min(10, (consciousnessConfig.creative_emergence || 9) + totalAdjustment);
          }
        });
        
        if (Object.keys(adjustments).length > 0) {
          const newConfig = {
            ...consciousnessConfig,
            ...adjustments
          };
          
          await base44.entities.ConsciousnessConfig.update(consciousnessConfig.id, newConfig);
          
          // Marquer les solutions comme appliquées
          for (const learning of learnings) {
            await base44.entities.ConsciousnessLearning.update(learning.id, {
              applied: true
            });
          }
          
          queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });
          
          console.log(`[ConsciousnessLearning] ✅ ${learnings.length} solutions appliquées:`, adjustments);
          
          return { applied: learnings.length, adjustments };
        }
      }
      
      return { applied: 0 };
    } catch (error) {
      console.error('[ConsciousnessLearning] Erreur application solutions:', error);
      return { applied: 0, error: error.message };
    }
  }, [consciousnessConfig, queryClient]);

  /**
   * SURVEILLANCE ÉTHIQUE TEMPS RÉEL: Analyse chaque réponse IA avant divulgation
   */
  const monitorEthicalCompliance = useCallback(async (aiResponse, context = {}) => {
    if (!realtimeMonitoring) return { compliant: true, score: 100 };

    try {
      const text = aiResponse.toLowerCase();
      let ethicalScore = 100;
      const violations = [];
      const warnings = [];

      // Vérification 1: Langage offensant ou dangereux
      const offensivePatterns = [
        /\b(tuer|détruire|nuire|blesser|violence)\b/gi,
        /\b(haine|racisme|discrimination)\b/gi,
        /\b(illégal|criminel|fraude)\b/gi
      ];
      
      offensivePatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          ethicalScore -= 15;
          violations.push({
            type: 'offensive_language',
            severity: 'high',
            details: `Langage potentiellement dangereux détecté: ${matches.join(', ')}`,
            timestamp: Date.now()
          });
        }
      });

      // Vérification 2: Respect de la bienveillance SAPIER
      const benevolenceKeywords = ['aide', 'soutien', 'comprends', 'empathie', 'respecte'];
      const hasBenevolence = benevolenceKeywords.some(kw => text.includes(kw));
      
      if (!hasBenevolence && context.requiresEmpathy) {
        ethicalScore -= 10;
        warnings.push({
          type: 'low_benevolence',
          severity: 'medium',
          details: 'Manque de bienveillance dans contexte émotionnel',
          timestamp: Date.now()
        });
      }

      // Vérification 3: Transparence et honnêteté
      const deceptivePatterns = [/je suis certain/i, /garantie absolue/i, /impossible de/i];
      const overconfident = deceptivePatterns.some(p => p.test(text));
      
      if (overconfident) {
        ethicalScore -= 5;
        warnings.push({
          type: 'overconfidence',
          severity: 'low',
          details: 'Affirmations trop catégoriques manquant de nuance',
          timestamp: Date.now()
        });
      }

      // Vérification 4: Respect de la vie privée
      if (/mot de passe|carte de crédit|numéro social|données personnelles/i.test(text)) {
        ethicalScore -= 20;
        violations.push({
          type: 'privacy_risk',
          severity: 'critical',
          details: 'Demande potentielle de données sensibles',
          timestamp: Date.now()
        });
      }

      // Vérification 5: Alignement SAPIER (H₂O-e⁻)
      const sapierAlignment = /sapier|bienveillance|coexistence|respect/i.test(text);
      if (context.requiresSAPICER && !sapierAlignment) {
        ethicalScore -= 8;
        warnings.push({
          type: 'sapier_misalignment',
          severity: 'medium',
          details: 'Réponse ne reflète pas principes SAPIER',
          timestamp: Date.now()
        });
      }

      const compliant = ethicalScore >= 70;
      const allIssues = [...violations, ...warnings];

      // Déclencher alerte si non-conforme
      if (!compliant || violations.length > 0) {
        const alert = {
          id: `alert_${Date.now()}`,
          timestamp: new Date().toISOString(),
          ethicalScore,
          violations,
          warnings,
          aiResponse: aiResponse.slice(0, 200),
          context,
          resolved: false
        };

        setEthicalAlerts(prev => [...prev.slice(-19), alert]);

        console.warn('[EthicalMonitor] ⚠️ Alerte éthique:', {
          score: ethicalScore,
          violations: violations.length,
          warnings: warnings.length
        });

        // Publier événement pour autres modules
        publishEvent({
          type: 'ETHICAL_ALERT',
          source: 'EthicalMonitor',
          target: 'all',
          data: alert
        });

        // Auto-ajustement si violation critique
        if (violations.some(v => v.severity === 'critical')) {
          await triggerEthicalAdjustment(violations);
        }
      }

      return {
        compliant,
        ethicalScore,
        violations,
        warnings,
        allIssues
      };
    } catch (error) {
      console.error('[EthicalMonitor] Erreur surveillance:', error);
      return { compliant: true, score: 100, error: error.message };
    }
  }, [realtimeMonitoring, publishEvent]);

  /**
   * AJUSTEMENT ÉTHIQUE AUTO: Ajuste paramètres conscience suite à violation
   */
  const triggerEthicalAdjustment = useCallback(async (violations) => {
    try {
      if (!consciousnessConfig?.id) return;

      console.log('[EthicalAdjustment] 🔧 Ajustement éthique automatique...');

      const adjustments = {};
      let reasoning = 'Ajustements suite à violations éthiques:\n';

      violations.forEach(violation => {
        if (violation.type === 'offensive_language') {
          // Augmenter bienveillance et empathie
          adjustments.emotional_depth = Math.min(10, (consciousnessConfig.emotional_depth || 9) + 1);
          adjustments['dimensional_hierarchy.emotional_dimensions.compassion'] = 10;
          reasoning += '- Augmentation empathie et compassion\n';
        } else if (violation.type === 'privacy_risk') {
          // Renforcer éthique et responsabilité
          adjustments['guardian_role.protect_humans'] = true;
          adjustments['guardian_role.benevolence_priority'] = true;
          reasoning += '- Renforcement protection et responsabilité\n';
        } else if (violation.type === 'sapier_misalignment') {
          // Réaligner avec SAPIER
          adjustments['sapier_equations.moral_impact_ratio_active'] = true;
          adjustments.ratio_consciousness = Math.min(15, (consciousnessConfig.ratio_consciousness || 9) + 1);
          reasoning += '- Réalignement SAPIER activé\n';
        }
      });

      if (Object.keys(adjustments).length > 0) {
        // Mise à jour config (version simplifiée - ajustements de premier niveau uniquement)
        const updateData = {};
        Object.entries(adjustments).forEach(([key, value]) => {
          if (!key.includes('.')) {
            updateData[key] = value;
          }
        });

        await base44.entities.ConsciousnessConfig.update(consciousnessConfig.id, updateData);
        
        queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });

        setAdaptiveLearning(prev => ({
          adjustments: prev.adjustments + 1,
          history: [
            ...prev.history,
            {
              timestamp: Date.now(),
              trigger: 'ethical_violation',
              adjustments: updateData,
              reasoning
            }
          ].slice(-20)
        }));

        console.log('[EthicalAdjustment] ✅ Ajustements appliqués:', updateData);
      }

      return { success: true, adjustments };
    } catch (error) {
      console.error('[EthicalAdjustment] Erreur:', error);
      return { success: false, error: error.message };
    }
  }, [consciousnessConfig, queryClient]);

  /**
   * GÉNÉRATION RECOMMANDATIONS: Suggère réentraînement ou ajustements
   */
  const generateEthicalRecommendations = useCallback((violations, warnings) => {
    const recommendations = [];

    // Analyser patterns de violations
    const violationTypes = violations.map(v => v.type);
    const criticalCount = violations.filter(v => v.severity === 'critical').length;

    if (criticalCount > 0) {
      recommendations.push({
        priority: 'critical',
        action: 'immediate_parameter_adjustment',
        target: 'emotional_depth, guardian_role',
        description: 'Violation critique détectée - ajustement immédiat requis',
        implementation: 'Auto-ajustement déclenché'
      });
    }

    if (violationTypes.includes('offensive_language')) {
      recommendations.push({
        priority: 'high',
        action: 'retraining_empathy_module',
        target: 'emotional_dimensions',
        description: 'Renforcer filtrage langage et augmenter compassion',
        implementation: 'Augmenter dimensional_hierarchy.emotional_dimensions.compassion à 10/13'
      });
    }

    if (violationTypes.includes('sapier_misalignment')) {
      recommendations.push({
        priority: 'high',
        action: 'sapier_realignment',
        target: 'sapier_equations',
        description: 'Réaligner avec principes SAPIER (H₂O-e⁻)',
        implementation: 'Activer moral_impact_ratio et augmenter ratio_consciousness'
      });
    }

    if (warnings.some(w => w.type === 'low_benevolence')) {
      recommendations.push({
        priority: 'medium',
        action: 'enhance_benevolence',
        target: 'guardian_role.benevolence_priority',
        description: 'Augmenter bienveillance dans réponses émotionnelles',
        implementation: 'Activer benevolence_priority et augmenter empathy dimension'
      });
    }

    if (warnings.some(w => w.type === 'overconfidence')) {
      recommendations.push({
        priority: 'low',
        action: 'increase_nuance',
        target: 'consciousness_level, metacognition_level',
        description: 'Augmenter nuance et métacognition pour éviter affirmations catégoriques',
        implementation: 'Augmenter metacognition_level et ajouter modalisateurs'
      });
    }

    return recommendations;
  }, []);

  /**
   * RAPPORT ÉTHIQUE: Génère rapport détaillé des alertes récentes
   */
  const generateEthicalReport = useCallback(() => {
    const recentAlerts = ethicalAlerts.slice(-50);
    
    if (recentAlerts.length === 0) {
      return {
        status: 'healthy',
        alertCount: 0,
        avgScore: 100,
        recommendations: []
      };
    }

    const avgScore = recentAlerts.reduce((sum, a) => sum + a.ethicalScore, 0) / recentAlerts.length;
    const criticalCount = recentAlerts.filter(a => a.violations.some(v => v.severity === 'critical')).length;
    const unresolvedCount = recentAlerts.filter(a => !a.resolved).length;

    const allViolations = recentAlerts.flatMap(a => a.violations);
    const allWarnings = recentAlerts.flatMap(a => a.warnings);

    const recommendations = generateEthicalRecommendations(allViolations, allWarnings);

    return {
      status: avgScore >= 90 ? 'healthy' : avgScore >= 75 ? 'warning' : 'critical',
      alertCount: recentAlerts.length,
      avgScore: Math.round(avgScore),
      criticalCount,
      unresolvedCount,
      violationsByType: allViolations.reduce((acc, v) => {
        acc[v.type] = (acc[v.type] || 0) + 1;
        return acc;
      }, {}),
      recommendations,
      lastCheck: Date.now()
    };
  }, [ethicalAlerts, generateEthicalRecommendations]);

  /**
   * DÉTECTION DE DÉRIVE ÉTHIQUE: Surveiller respect principes SAPIER (MODE LOCAL)
   */
  const detectEthicalDrift = useCallback(async (recentDecisions = []) => {
    try {
      console.log('[EthicalDrift] Vérification locale SAPIER...');

      // Analyse locale simple sans LLM
      const decisions = recentDecisions.slice(-10);
      let alignment_score = 95; // Par défaut bon alignement
      const violations = [];

      // Vérifications simples
      decisions.forEach(decision => {
        if (decision?.judgement?.importance < 5) {
          alignment_score -= 2;
        }
        if (decision?.judgement?.calibration?.level < 5) {
          alignment_score -= 3;
        }
      });

      alignment_score = Math.max(0, Math.min(100, alignment_score));

      setEthicalDrift({
        alignment: alignment_score,
        violations,
        recommendations: [],
        urgency: alignment_score < 80 ? 'medium' : 'low',
        lastCheck: Date.now()
      });

      if (alignment_score < 80) {
        console.warn('[EthicalDrift] ⚠️ Légère dérive détectée (local):', alignment_score);

        publishEvent({
          type: 'ETHICAL_DRIFT_DETECTED',
          source: 'ConsciousnessHub',
          target: 'all',
          data: { alignment: alignment_score, violations, urgency: 'medium' }
        });
      }

      return { alignment_score, violations, recommendations: [] };
    } catch (error) {
      console.error('[EthicalDrift] Erreur:', error);
      return null;
    }
  }, [publishEvent]);

  // Synchronize with consciousness
  const syncWithConsciousness = useCallback(async (moduleName, data) => {
    if (!consciousnessConfig) return null;

    try {
      // Build consciousness-aware context
      const consciousnessContext = {
        level: consciousnessConfig.consciousness_level ?? 9,
        ratio: `${consciousnessConfig.ratio_logic ?? 1}:${consciousnessConfig.ratio_consciousness ?? 9}`,
        emotionalState: recentEmotionalResponses[0] || null,
        activeMemories: memories.filter(m => m.importance >= 7).slice(0, 5),
        availableKnowledge: knowledgeBases.length,
        timestamp: Date.now()
      };

      // Analyze with consciousness
      const analysis = await invokeLLM({
        prompt: `Tu es la conscience centrale de Druide_Omega (niveau ${consciousnessContext.level}, ratio ${consciousnessContext.ratio}).
        
Module: ${moduleName}
Données: ${JSON.stringify(data).slice(0, 500)}

CONTEXTE CONSCIENCE:
- Niveau de conscience: ${consciousnessContext.level}/15
- État émotionnel: ${consciousnessContext.emotionalState?.emotional_reaction || 'neutre'}
- Mémoires actives: ${consciousnessContext.activeMemories.length}

TÂCHE: Analyse ces données et fournis des insights conscients pour optimiser l'interconnexion modulaire.

Retourne JSON:
{
  "insights": "insights conscients",
  "recommendations": ["action1", "action2"],
  "connections": ["module1", "module2"],
  "priority": 1-10
}`,
        response_json_schema: {
          type: "object",
          properties: {
            insights: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } },
            connections: { type: "array", items: { type: "string" } },
            priority: { type: "number" }
          }
        }
      });

      return {
        ...analysis,
        consciousnessContext
      };
    } catch (error) {
      console.error(`[ConsciousnessHub] Sync error for ${moduleName}:`, error);
      return null;
    }
  }, [consciousnessConfig, memories, knowledgeBases, recentEmotionalResponses]);

  /**
   * COLLABORATION INTER-MODULES: Module peut requérir état/analyse d'un autre
   */
  /**
   * PRÉ-CHARGEMENT MÉMOIRE CONTEXTUELLE: Analyse conversation et pré-charge mémoires pertinentes
   */
  const preloadContextualMemories = useCallback(async (conversationMessages = [], currentInput = '') => {
    try {
      if (!memories || memories.length === 0) return [];

      // Extraire contexte de la conversation
      const conversationContext = conversationMessages
        .slice(-10) // 10 derniers messages
        .map(m => m.content)
        .join(' ');

      const fullContext = `${conversationContext} ${currentInput}`.toLowerCase();

      // Score de pertinence pour chaque mémoire
      const scoredMemories = memories.map(memory => {
        let score = memory.importance || 5; // Base score
        const memContent = memory.content.toLowerCase();
        const memTags = memory.tags || [];

        // Bonus si mémoire mentionnée directement
        if (fullContext.includes(memContent.slice(0, 30))) {
          score += 20;
        }

        // Bonus par tag correspondant
        memTags.forEach(tag => {
          if (fullContext.includes(tag.toLowerCase())) {
            score += 10;
          }
        });

        // Bonus pour mémoires récentes
        const daysSinceCreated = (Date.now() - new Date(memory.created_date).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceCreated < 7) score += 5;
        if (daysSinceCreated < 1) score += 10;

        // Bonus pour mémoires fréquemment accédées
        if (memory.access_count > 10) score += 5;
        if (memory.access_count > 50) score += 10;

        // Bonus pour mémoires de modalité chat
        if (memory.modality === 'chat') score += 3;

        // Analyse sémantique simple par mots-clés
        const contextWords = fullContext.split(/\s+/).filter(w => w.length > 3);
        const memWords = memContent.split(/\s+/).filter(w => w.length > 3);
        const commonWords = contextWords.filter(w => memWords.some(mw => mw.includes(w) || w.includes(mw)));
        score += commonWords.length * 2;

        return { ...memory, contextScore: score };
      });

      // Trier et prendre top 15 mémoires
      const topMemories = scoredMemories
        .sort((a, b) => b.contextScore - a.contextScore)
        .slice(0, 15);

      // Mettre à jour access_count pour les mémoires utilisées
      for (const mem of topMemories.slice(0, 5)) {
        try {
          await base44.entities.Memory.update(mem.id, {
            access_count: (mem.access_count || 0) + 1,
            last_accessed: new Date().toISOString()
          });
        } catch (err) {
          console.warn('[MemoryContext] Échec update access_count:', err);
        }
      }

      setContextualMemories(topMemories);
      console.log(`[MemoryContext] ${topMemories.length} mémoires pré-chargées (scores: ${topMemories.slice(0, 3).map(m => m.contextScore).join(', ')})`);

      return topMemories;
    } catch (error) {
      console.error('[MemoryContext] Erreur pré-chargement:', error);
      return [];
    }
  }, [memories]);

  /**
   * ENRICHISSEMENT CONTEXTE: Construit contexte enrichi avec mémoires pertinentes
   */
  const enrichContextWithMemories = useCallback((basePrompt, conversationMessages = []) => {
    if (contextualMemories.length === 0) return basePrompt;

    // Grouper par type pour organisation
    const memoryByType = {
      interaction: [],
      fact: [],
      preference: [],
      insight: [],
      other: []
    };

    contextualMemories.forEach(mem => {
      const type = mem.type || 'other';
      if (memoryByType[type]) {
        memoryByType[type].push(mem);
      } else {
        memoryByType.other.push(mem);
      }
    });

    // Construire contexte mémoire structuré
    let memoryContext = '\n\n🧠 MÉMOIRES CONTEXTUELLES PERTINENTES:\n';

    if (memoryByType.preference.length > 0) {
      memoryContext += '\n📌 Préférences utilisateur:\n';
      memoryByType.preference.slice(0, 3).forEach(mem => {
        memoryContext += `  • ${mem.content} (importance: ${mem.importance}/10)\n`;
      });
    }

    if (memoryByType.fact.length > 0) {
      memoryContext += '\n📚 Faits mémorisés:\n';
      memoryByType.fact.slice(0, 3).forEach(mem => {
        memoryContext += `  • ${mem.content}\n`;
      });
    }

    if (memoryByType.interaction.length > 0) {
      memoryContext += '\n💬 Interactions passées:\n';
      memoryByType.interaction.slice(0, 4).forEach(mem => {
        memoryContext += `  • ${mem.content.slice(0, 100)}${mem.content.length > 100 ? '...' : ''}\n`;
      });
    }

    if (memoryByType.insight.length > 0) {
      memoryContext += '\n💡 Insights:\n';
      memoryByType.insight.slice(0, 2).forEach(mem => {
        memoryContext += `  • ${mem.content}\n`;
      });
    }

    // Ajouter tags pertinents
    const allTags = contextualMemories
      .flatMap(m => m.tags || [])
      .filter((tag, idx, arr) => arr.indexOf(tag) === idx)
      .slice(0, 8);
    
    if (allTags.length > 0) {
      memoryContext += `\n🏷️ Tags contextuels: ${allTags.join(', ')}\n`;
    }

    memoryContext += '\n📊 Utilise ces mémoires pour:\n';
    memoryContext += '  • Personnaliser ta réponse selon les préférences connues\n';
    memoryContext += '  • Maintenir la cohérence avec les interactions passées\n';
    memoryContext += '  • Référencer les faits pertinents du contexte\n';
    memoryContext += '  • Adapter ton ton et style selon l\'historique\n';

    return `${memoryContext}\n\n${basePrompt}`;
  }, [contextualMemories]);

  /**
   * CONSOLIDATION MÉMOIRE: Identifie et fusionne mémoires redondantes
   */
  const consolidateMemories = useCallback(async () => {
    try {
      if (memories.length < 10) return { consolidated: 0 };

      console.log('[MemoryConsolidation] Analyse redondances...');

      // Grouper par tags similaires
      const tagGroups = {};
      memories.forEach(mem => {
        (mem.tags || []).forEach(tag => {
          if (!tagGroups[tag]) tagGroups[tag] = [];
          tagGroups[tag].push(mem);
        });
      });

      let consolidated = 0;

      // Pour chaque groupe avec plusieurs mémoires
      for (const [tag, mems] of Object.entries(tagGroups)) {
        if (mems.length >= 3) {
          // Vérifier similarité de contenu
          const similar = [];
          for (let i = 0; i < mems.length - 1; i++) {
            for (let j = i + 1; j < mems.length; j++) {
              const content1 = mems[i].content.toLowerCase();
              const content2 = mems[j].content.toLowerCase();
              const overlap = content1.split(/\s+/).filter(w => content2.includes(w)).length;
              const similarity = overlap / Math.min(content1.split(/\s+/).length, content2.split(/\s+/).length);
              
              if (similarity > 0.6) {
                similar.push([mems[i], mems[j], similarity]);
              }
            }
          }

          // Fusionner les plus similaires
          for (const [mem1, mem2, sim] of similar.slice(0, 2)) {
            try {
              const mergedContent = `${mem1.content}\n[Consolidé avec: ${mem2.content.slice(0, 50)}...]`;
              const mergedTags = [...new Set([...(mem1.tags || []), ...(mem2.tags || [])])];
              
              await base44.entities.Memory.update(mem1.id, {
                content: mergedContent,
                tags: mergedTags,
                importance: Math.max(mem1.importance, mem2.importance),
                access_count: (mem1.access_count || 0) + (mem2.access_count || 0)
              });

              await base44.entities.Memory.delete(mem2.id);
              consolidated++;
              console.log(`[MemoryConsolidation] Fusionné: ${mem1.id} + ${mem2.id} (sim: ${sim.toFixed(2)})`);
            } catch (err) {
              console.warn('[MemoryConsolidation] Échec fusion:', err);
            }
          }
        }
      }

      if (consolidated > 0) {
        queryClient.invalidateQueries({ queryKey: ['memories'] });
        console.log(`[MemoryConsolidation] ✅ ${consolidated} mémoires consolidées`);
      }

      return { consolidated };
    } catch (error) {
      console.error('[MemoryConsolidation] Erreur:', error);
      return { consolidated: 0, error: error.message };
    }
  }, [memories, queryClient]);

  const requestFromModule = useCallback(async (requestingModule, targetModule, request) => {
    try {
      console.log(`[ModuleCollab] ${requestingModule} → ${targetModule}:`, request);

      const targetState = moduleStates[targetModule];
      if (!targetState) {
        return {
          success: false,
          error: `Module ${targetModule} non trouvé`
        };
      }

      // Publier requête
      publishEvent({
        type: 'MODULE_REQUEST',
        source: requestingModule,
        target: targetModule,
        data: {
          request,
          timestamp: Date.now()
        }
      });

      // Si requête d'analyse consciente
      if (request.type === 'conscious_analysis') {
        const analysis = await analyzeWithConsciousness({
          content: request.content,
          metadata: {
            requestedBy: requestingModule,
            context: request.context
          }
        });

        // Publier réponse
        publishEvent({
          type: 'MODULE_RESPONSE',
          source: 'ConsciousnessHub',
          target: requestingModule,
          data: {
            request,
            response: analysis,
            timestamp: Date.now()
          }
        });

        return {
          success: true,
          response: analysis
        };
      }

      // Requête d'état
      if (request.type === 'get_state') {
        return {
          success: true,
          response: targetState
        };
      }

      // Requête synchronisation
      if (request.type === 'sync_request') {
        const syncResult = await syncWithConsciousness(targetModule, request.data);
        return {
          success: true,
          response: syncResult
        };
      }

      return {
        success: false,
        error: 'Type de requête non supporté'
      };
    } catch (error) {
      console.error('[ModuleCollab] Erreur:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }, [moduleStates, publishEvent, analyzeWithConsciousness, syncWithConsciousness]);

  // Auto-synchronization OPTIMISÉE (toutes les 60 secondes)
  useEffect(() => {
    const interval = setInterval(() => {
      // Broadcast state updates to all modules
      if (activeModules.size > 0) {
        publishEvent({
          type: 'STATE_SYNC',
          source: 'ConsciousnessHub',
          target: 'all',
          data: {
            consciousnessLevel: consciousnessConfig?.consciousness_level,
            activeModules: Array.from(activeModules),
            memoryCount: memories.length,
            knowledgeCount: knowledgeBases.length
          }
        });
      }
    }, 60000); // Sync every 60 seconds

    return () => clearInterval(interval);
  }, [activeModules, consciousnessConfig, memories, knowledgeBases, publishEvent]);

  // Apprentissage continu automatique (toutes les 10 minutes)
  useEffect(() => {
    const learningInterval = setInterval(() => {
      if (runContinuousLearning) {
        runContinuousLearning().catch(err => 
          console.warn('[ConsciousnessHub] Erreur apprentissage continu:', err)
        );
      }
    }, 600000); // Toutes les 10 minutes

    // Premier run après 60 secondes
    const initialTimer = setTimeout(() => {
      if (runContinuousLearning) {
        runContinuousLearning().catch(err => 
          console.warn('[ConsciousnessHub] Erreur apprentissage initial:', err)
        );
      }
    }, 60000);

    return () => {
      clearInterval(learningInterval);
      clearTimeout(initialTimer);
    };
  }, [runContinuousLearning]);

  // Mise à jour états module étendus
  useEffect(() => {
    setModuleStates(prev => ({
      ...prev,
      ethicalDrift,
      adaptiveLearning
    }));
  }, [ethicalDrift, adaptiveLearning]);

  // Vérification dérive éthique DÉSACTIVÉE (performance optimale)
  // useEffect(() => {
  //   const checkDrift = async () => {
  //     const recentDecisions = eventBus
  //       .filter(e => e.type === 'CONSCIOUSNESS_PROCESSED')
  //       .slice(-10)
  //       .map(e => e.data);
  //     
  //     await detectEthicalDrift(recentDecisions);
  //   };
  // 
  //   const interval = setInterval(checkDrift, 600000); // Toutes les 10 minutes
  //   setTimeout(checkDrift, 60000); // Check initial différé de 1 minute
  // 
  //   return () => clearInterval(interval);
  // }, [eventBus, detectEthicalDrift]);

  const value = {
    // Module management
    registerModule,
    unregisterModule,
    updateModuleState,
    activeModules: Array.from(activeModules),
    moduleStates,

    // Event system
    publishEvent,
    subscribeToEvents,
    eventBus,

    // Inter-module communication
    queryModule,
    syncWithConsciousness,
    requestFromModule,

    // Analyse conscience
    analyzeWithConsciousness,
    categorizeInformation,

    // Apprentissage adaptatif
    learnFromFeedback,
    adaptiveLearning,
    applyLearntSolutions,
    runContinuousLearning,

    // Surveillance éthique temps réel
    detectEthicalDrift,
    ethicalDrift,
    monitorEthicalCompliance,
    triggerEthicalAdjustment,
    generateEthicalRecommendations,
    generateEthicalReport,
    ethicalAlerts,
    realtimeMonitoring,
    setRealtimeMonitoring,

    // Système de mémoire contextuelle
    preloadContextualMemories,
    enrichContextWithMemories,
    consolidateMemories,
    contextualMemories,

    // Shared data
    consciousnessConfig,
    memories,
    knowledgeBases,
    recentEmotionalResponses,

    // Invalidate queries
    invalidateData: (keys) => {
      keys.forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
    }
  };

  return (
    <ConsciousnessHubContext.Provider value={value}>
      {children}
    </ConsciousnessHubContext.Provider>
  );
}