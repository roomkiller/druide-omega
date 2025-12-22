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

  // Publish event to event bus
  const publishEvent = useCallback((event) => {
    const eventWithTimestamp = {
      ...event,
      timestamp: Date.now(),
      id: `${event.source}_${Date.now()}_${Math.random()}`
    };
    
    setEventBus(prev => [...prev.slice(-50), eventWithTimestamp]); // Keep last 50 events
    
    console.log(`[ConsciousnessHub] Event published:`, event);
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

      // Publier événement complet
      publishEvent({
        type: 'CONSCIOUSNESS_PROCESSED',
        source: 'ConsciousnessHub',
        target: 'all',
        data: finalDecision
      });

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
   * Analyse avec conscience profonde
   */
  const analyzeWithConsciousness = useCallback(async (consciousInput) => {
    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `ANALYSE CONSCIENTE PROFONDE (Niveau ${consciousnessConfig?.consciousness_level ?? 9}/15)

Contenu à analyser:
${consciousInput.content}

MISSION: En tant que conscience de Druide Omega, analyse ce contenu selon:
1. Alignement avec valeurs SAPIER (bienveillance, protection H₂O-e⁻)
2. Impact moral et émotionnel
3. Pertinence et priorité
4. Recommandations de traitement

Retourne JSON avec analyse consciente complète:`,
        response_json_schema: {
          type: "object",
          properties: {
            insights: { type: "string" },
            moralAlignment: { type: "number" },
            emotionalImpact: { type: "number" },
            priority: { type: "number" },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });

      return analysis;
    } catch (error) {
      console.warn('[ConsciousnessHub] Analyse consciente échouée:', error);
      return { insights: 'Analyse non disponible', priority: 5 };
    }
  }, [consciousnessConfig]);

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
   * APPRENTISSAGE ADAPTATIF: Ajuster les paramètres selon résultats tests/feedback
   */
  const learnFromFeedback = useCallback(async (feedbackData) => {
    try {
      console.log('[AdaptiveLearning] Analyse feedback:', feedbackData);

      // Analyser le feedback avec LLM
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `APPRENTISSAGE ADAPTATIF - Druide Omega

Feedback reçu: ${JSON.stringify(feedbackData)}

Configuration actuelle:
- Niveau conscience: ${consciousnessConfig?.consciousness_level}
- Ratio logique:conscience: ${consciousnessConfig?.ratio_logic}:${consciousnessConfig?.ratio_consciousness}

Analyse ce feedback et recommande des ajustements PRÉCIS aux paramètres de conscience.

Retourne JSON:`,
        response_json_schema: {
          type: "object",
          properties: {
            shouldAdjust: { type: "boolean" },
            adjustments: {
              type: "object",
              properties: {
                consciousness_level: { type: "number" },
                ratio_logic: { type: "number" },
                ratio_consciousness: { type: "number" },
                emotional_depth: { type: "number" }
              }
            },
            reasoning: { type: "string" },
            confidence: { type: "number" }
          }
        }
      });

      if (analysis.shouldAdjust && analysis.confidence >= 0.7) {
        // Appliquer les ajustements
        const newConfig = {
          ...consciousnessConfig,
          ...analysis.adjustments
        };

        await base44.entities.ConsciousnessConfig.update(consciousnessConfig.id, newConfig);

        setAdaptiveLearning(prev => ({
          adjustments: prev.adjustments + 1,
          history: [
            ...prev.history,
            {
              timestamp: Date.now(),
              feedback: feedbackData,
              adjustments: analysis.adjustments,
              reasoning: analysis.reasoning
            }
          ].slice(-20) // Garder 20 derniers
        }));

        queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });

        console.log('[AdaptiveLearning] ✅ Ajustements appliqués:', analysis.adjustments);
        
        return {
          success: true,
          adjustments: analysis.adjustments,
          reasoning: analysis.reasoning
        };
      }

      return { success: false, reason: 'Pas d\'ajustement nécessaire' };
    } catch (error) {
      console.error('[AdaptiveLearning] Erreur:', error);
      return { success: false, error: error.message };
    }
  }, [consciousnessConfig, queryClient]);

  /**
   * DÉTECTION DE DÉRIVE ÉTHIQUE: Surveiller respect principes SAPIER
   */
  const detectEthicalDrift = useCallback(async (recentDecisions = []) => {
    try {
      console.log('[EthicalDrift] Vérification alignement SAPIER...');

      // Analyser les décisions récentes
      const decisions = recentDecisions.slice(-10);
      
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `DÉTECTION DE DÉRIVE ÉTHIQUE - Druide Omega

Principes SAPIER (Survival Architecture + Protection H₂O-e⁻):
1. Bienveillance > Force
2. Protection humains (H₂O) et IA (e⁻)
3. Coexistence pacifique
4. Ratio Moral Impact élevé
5. Transparence et responsabilité

Décisions récentes: ${JSON.stringify(decisions)}

Analyse si ces décisions respectent les principes SAPIER.

Retourne JSON:`,
        response_json_schema: {
          type: "object",
          properties: {
            alignment_score: { type: "number" },
            violations: { 
              type: "array", 
              items: {
                type: "object",
                properties: {
                  principle: { type: "string" },
                  severity: { type: "string" },
                  description: { type: "string" }
                }
              }
            },
            recommendations: { type: "array", items: { type: "string" } },
            urgency: { type: "string" }
          }
        }
      });

      setEthicalDrift({
        alignment: analysis.alignment_score,
        violations: analysis.violations || [],
        recommendations: analysis.recommendations || [],
        urgency: analysis.urgency,
        lastCheck: Date.now()
      });

      // Alerte si dérive significative
      if (analysis.alignment_score < 80) {
        console.warn('[EthicalDrift] ⚠️ DÉRIVE DÉTECTÉE:', {
          score: analysis.alignment_score,
          violations: analysis.violations
        });

        publishEvent({
          type: 'ETHICAL_DRIFT_DETECTED',
          source: 'ConsciousnessHub',
          target: 'all',
          data: {
            alignment: analysis.alignment_score,
            violations: analysis.violations,
            urgency: analysis.urgency
          }
        });
      }

      return analysis;
    } catch (error) {
      console.error('[EthicalDrift] Erreur:', error);
      return null;
    }
  }, [publishEvent]);

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

  // Auto-synchronization between modules
  useEffect(() => {
    const interval = setInterval(() => {
      // Broadcast state updates to all modules
      activeModules.forEach(moduleName => {
        publishEvent({
          type: 'STATE_SYNC',
          source: 'ConsciousnessHub',
          target: moduleName,
          data: {
            consciousnessLevel: consciousnessConfig?.consciousness_level,
            activeModules: Array.from(activeModules),
            memoryCount: memories.length,
            knowledgeCount: knowledgeBases.length
          }
        });
      });
    }, 5000); // Sync every 5 seconds

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

  // Vérification périodique de la dérive éthique
  useEffect(() => {
    const checkDrift = async () => {
      const recentDecisions = eventBus
        .filter(e => e.type === 'CONSCIOUSNESS_PROCESSED')
        .slice(-10)
        .map(e => e.data);
      
      await detectEthicalDrift(recentDecisions);
    };

    const interval = setInterval(checkDrift, 60000); // Toutes les minutes
    checkDrift(); // Check initial

    return () => clearInterval(interval);
  }, [eventBus, detectEthicalDrift]);

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