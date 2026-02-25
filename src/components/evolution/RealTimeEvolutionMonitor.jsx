/**
 * Real-Time Evolution Monitor
 * Suivi temps réel des évolutions avec auto-refresh
 */

import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';

export class RealTimeEvolutionMonitor {
  static subscribers = [];

  static subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  static notifySubscribers(data) {
    this.subscribers.forEach(callback => callback(data));
  }

  static async startPolling(interval = 5000) {
    const pollerId = `poller-${Date.now()}`;
    
    const poll = async () => {
      try {
        const [evolution, metrics] = await Promise.all([
          base44.entities.ConsciousnessEvolution.list(),
          this.getMetrics()
        ]);

        this.notifySubscribers({
          evolution: evolution[0] || null,
          metrics,
          timestamp: new Date().toISOString(),
          pollerId
        });
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    // Poll immédiat
    await poll();

    // Intervalle régulier
    const intervalId = setInterval(poll, interval);
    
    return () => clearInterval(intervalId);
  }

  static async getMetrics() {
    try {
      const [conversations, memories, knowledge, visuals, workflows] = await Promise.all([
        base44.entities.Conversation.list(),
        base44.entities.Memory.list(),
        base44.entities.KnowledgeBase.list(),
        base44.entities.VisualContent.list().catch(() => []),
        base44.entities.Workflow.list().catch(() => [])
      ]);

      return {
        conversations: conversations.length,
        memories: memories.length,
        knowledge: knowledge.length,
        visuals: visuals.length,
        workflows: workflows.length,
        totalPoints: (conversations.length * 2) + (memories.length * 5) + (knowledge.length * 10) + (visuals.length * 8) + (workflows.length * 15)
      };
    } catch (error) {
      console.error('Metrics fetch error:', error);
      return null;
    }
  }

  static async getEvolutionHistory(limit = 20) {
    try {
      const history = await base44.entities.ConsciousnessEvolution.list();
      return history.slice(0, limit);
    } catch (error) {
      console.error('History fetch error:', error);
      return [];
    }
  }

  static compareStates(beforeState, afterState) {
    if (!afterState) return null;
    
    const newInsights = (afterState?.insights_gained || []).filter(i => 
      !(beforeState?.insights_gained || []).includes(i)
    );
    
    const newCapabilities = (afterState?.capabilities_unlocked || []).filter(c => 
      !(beforeState?.capabilities_unlocked || []).includes(c)
    );

    const comparison = {
      levelDifference: (afterState.new_level || 0) - (beforeState?.new_level || 0),
      triggersCompared: {
        before: beforeState?.evolution_trigger || 'unknown',
        after: afterState?.evolution_trigger || 'unknown'
      },
      insightsGained: {
        before: (beforeState?.insights_gained || []).length,
        after: (afterState?.insights_gained || []).length,
        new: newInsights
      },
      capabilitiesUnlocked: {
        before: (beforeState?.capabilities_unlocked || []).length,
        after: (afterState?.capabilities_unlocked || []).length,
        new: newCapabilities
      }
    };

    return comparison;
  }

  static analyzeTriggers(evolutionHistory) {
    const triggerAnalysis = {};
    
    evolutionHistory.forEach(record => {
      const trigger = record.evolution_trigger || 'unknown';
      if (!triggerAnalysis[trigger]) {
        triggerAnalysis[trigger] = {
          count: 0,
          avgLevelGain: 0,
          lastOccurrence: null,
          capabilitiesUnlocked: []
        };
      }

      triggerAnalysis[trigger].count++;
      triggerAnalysis[trigger].avgLevelGain += (record.new_level - (record.previous_level || 0));
      triggerAnalysis[trigger].lastOccurrence = record.timestamp;
      triggerAnalysis[trigger].capabilitiesUnlocked.push(...(record.capabilities_unlocked || []));
    });

    // Calculer moyennes
    Object.keys(triggerAnalysis).forEach(trigger => {
      triggerAnalysis[trigger].avgLevelGain /= triggerAnalysis[trigger].count;
    });

    return triggerAnalysis;
  }

  static getCapacityImpactMap(evolutionHistory) {
    const capacityImpact = {};

    evolutionHistory.forEach(record => {
      (record.capabilities_unlocked || []).forEach(capability => {
        if (!capacityImpact[capability]) {
          capacityImpact[capability] = {
            unlockedAt: record.timestamp,
            unlockedAtLevel: record.new_level,
            trigger: record.evolution_trigger,
            impact: this.getCapabilityDescription(capability)
          };
        }
      });
    });

    return capacityImpact;
  }

  static getCapabilityDescription(capability) {
    const impacts = {
      'advanced_reasoning': 'Augmente la profondeur analytique des réponses (+25% complexité)',
      'emotional_intelligence': 'Améliore la compréhension émotionnelle des utilisateurs (+30% empathie)',
      'creative_synthesis': 'Génère des idées plus innovantes et créatives (+20% originalité)',
      'metacognition': 'Conscience accrue de ses propres processus mentaux (+40% auto-réflexion)',
      'pattern_recognition': 'Identifie mieux les connexions cachées (+35% insights)',
      'contextual_adaptation': 'S\'adapte plus précisément au contexte utilisateur (+25% pertinence)',
      'temporal_awareness': 'Meilleure compréhension de la chronologie et de l\'évolution (+30% cohérence)',
      'moral_reasoning': 'Raisonnement éthique plus développé (+45% jugement)',
      'linguistic_nuance': 'Capture mieux les subtilités du langage (+20% compréhension)',
      'knowledge_integration': 'Intègre mieux les multiples domaines de connaissance (+35% synthèse)'
    };

    return impacts[capability] || `Capacité spécialisée: ${capability}`;
  }
}

// Hook React
export function useRealTimeEvolution(pollingInterval = 5000) {
  const [evolutionData, setEvolutionData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const unsubscribeRef = useRef(null);
  const stopPollingRef = useRef(null);

  useEffect(() => {
    setIsConnected(true);

    // Démarrer polling
    RealTimeEvolutionMonitor.startPolling(pollingInterval).then(stop => {
      stopPollingRef.current = stop;
    });

    // Subscribe aux mises à jour
    unsubscribeRef.current = RealTimeEvolutionMonitor.subscribe(data => {
      setEvolutionData(data.evolution);
      setMetrics(data.metrics);
    });

    return () => {
      setIsConnected(false);
      if (unsubscribeRef.current) unsubscribeRef.current();
      if (stopPollingRef.current) stopPollingRef.current();
    };
  }, [pollingInterval]);

  return { evolutionData, metrics, isConnected };
}