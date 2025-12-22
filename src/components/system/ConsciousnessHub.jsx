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

  // Process output through judgement module (final pipeline)
  const processOutputWithJudgement = useCallback((content, metadata = {}) => {
    try {
      const conscious = {
        id: `output_${Date.now()}`,
        content,
        metadata: {
          ...metadata,
          consciousnessLevel: consciousnessConfig?.consciousness_level ?? 9,
          timestamp: new Date().toISOString()
        }
      };

      const judgement = judge(conscious);
      
      // Publish judgement event to all modules
      publishEvent({
        type: 'OUTPUT_JUDGED',
        source: 'ConsciousnessHub',
        target: 'all',
        data: {
          original: content,
          judgement,
          calibration: judgement.calibration
        }
      });

      return judgement;
    } catch (error) {
      console.error('[ConsciousnessHub] Judgement error:', error);
      return null;
    }
  }, [consciousnessConfig, publishEvent]);

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
    
    // Judgement pipeline (final output processing)
    processOutputWithJudgement,
    
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