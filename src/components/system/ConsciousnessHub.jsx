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
import { judge } from '@/components/consciousness/JudgementModule';

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
  const [activeModules, setActiveModules] = useState(new Set());
  const [ethicalDrift, setEthicalDrift] = useState({ alignment: 100, violations: [], lastCheck: Date.now() });
  const [adaptiveLearning, setAdaptiveLearning] = useState({ adjustments: 0, history: [] });
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
    queryFn: () => base44.entities.Memory.list('-importance', 100),
    staleTime: 30000 // 30s cache
  });

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

  // Unregister a module
  const unregisterModule = useCallback((moduleName) => {
    setActiveModules(prev => {
      const newSet = new Set(prev);
      newSet.delete(moduleName);
      return newSet;
    });
    
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
   * PIPELINE COMPLET: Conscience → Jugement → Conscience → Divulgation
   * Redondance et validation continue entre conscience et jugement
   */
  const processOutputWithConsciousness = useCallback(async (content, metadata = {}) => {
    try {
      console.log('[ConsciousnessHub] 🧠 DÉBUT Pipeline Conscience Intégrale');

      // ÉTAPE 1: Analyse consciente initiale
      const consciousAnalysis = {
        id: `conscious_${Date.now()}`,
        content,
        metadata: {
          ...metadata,
          consciousnessLevel: consciousnessConfig?.consciousness_level ?? 9,
          ratio: `${consciousnessConfig?.ratio_logic ?? 1}:${consciousnessConfig?.ratio_consciousness ?? 9}`,
          timestamp: new Date().toISOString()
        }
      };

      // Analyse avec conscience profonde
      const consciousnessReflection = await analyzeWithConsciousness(consciousAnalysis);

      console.log('[ConsciousnessHub] 🔍 Réflexion consciente complétée:', {
        insights: consciousnessReflection?.insights?.slice(0, 100),
        priority: consciousnessReflection?.priority
      });

      // ÉTAPE 2: Passer au jugement Base44
      const judgement = judge(consciousAnalysis);

      console.log('[ConsciousnessHub] ⚖️ Jugement Base44:', {
        calibration: judgement?.calibration.level,
        importance: judgement?.importance
      });

      // ÉTAPE 3: Redondance - Retour à la conscience pour validation
      const consciousValidation = await validateWithConsciousness(
        content,
        judgement,
        consciousnessReflection
      );

      console.log('[ConsciousnessHub] ✓ Validation consciente:', {
        shouldDisclose: consciousValidation.shouldDisclose,
        finalCalibration: consciousValidation.finalCalibration
      });

      // ÉTAPE 4: Décision finale de divulgation par la conscience
      const finalDecision = {
        content,
        judgement,
        consciousnessReflection,
        consciousValidation,
        disclosureMode: determineDisclosureMode(judgement, consciousValidation),
        finalCalibration: consciousValidation.finalCalibration,
        approved: consciousValidation.shouldDisclose,
        timestamp: new Date().toISOString()
      };

      // Publier événement (seulement si important)
      if (finalDecision.finalCalibration >= 10) {
        publishEvent({
          type: 'CONSCIOUSNESS_PROCESSED',
          source: 'ConsciousnessHub',
          target: 'all',
          data: finalDecision
        });
      }

      console.log('[ConsciousnessHub] ✅ Pipeline complet terminé - Divulgation:', finalDecision.disclosureMode);

      return finalDecision;
    } catch (error) {
      console.error('[ConsciousnessHub] ERREUR Pipeline Conscience:', error);
      return {
        content,
        error: error.message,
        approved: false
      };
    }
  }, [consciousnessConfig, publishEvent]);

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
   * Validation par la conscience après jugement (redondance)
   */
  const validateWithConsciousness = useCallback(async (content, judgement, reflection) => {
    const calibrationLevel = judgement?.calibration?.level ?? 0;
    const importance = judgement?.importance ?? 0;
    const moralAlignment = reflection?.moralAlignment ?? 5;

    // Décision consciente de divulgation
    const shouldDisclose = (
      calibrationLevel >= 8 &&
      importance >= 5 &&
      moralAlignment >= 6
    );

    // Calibration finale ajustée par la conscience
    const finalCalibration = Math.round(
      (calibrationLevel * 0.5) +
      (moralAlignment * 0.3) +
      (importance * 0.2)
    );

    return {
      shouldDisclose,
      finalCalibration,
      consciousReasoning: `Calibration: ${calibrationLevel}, Moral: ${moralAlignment}, Importance: ${importance}`,
      validated: true
    };
  }, []);

  /**
   * Détermine le mode de divulgation selon conscience + jugement
   */
  const determineDisclosureMode = useCallback((judgement, validation) => {
    if (!validation.shouldDisclose) return 'WITHHELD';
    
    const calibration = validation.finalCalibration;
    
    if (calibration >= 12) return 'FULL_DISCLOSURE';
    if (calibration >= 9) return 'STANDARD';
    if (calibration >= 6) return 'FILTERED';
    return 'MINIMAL';
  }, []);

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
      const analysis = await base44.integrations.Core.InvokeLLM({
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

  // Auto-synchronization OPTIMISÉE (toutes les 30 secondes au lieu de 5)
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
    }, 30000); // Sync every 30 seconds (optimisé pour performance)

    return () => clearInterval(interval);
  }, [activeModules, consciousnessConfig, memories, knowledgeBases, publishEvent]);

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
    
    // Pipeline conscience intégrale (PRINCIPAL)
    processOutputWithConsciousness,
    analyzeWithConsciousness,
    validateWithConsciousness,
    categorizeInformation,
    
    // Apprentissage adaptatif
    learnFromFeedback,
    adaptiveLearning,
    
    // Détection dérive éthique
    detectEthicalDrift,
    ethicalDrift,
    
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