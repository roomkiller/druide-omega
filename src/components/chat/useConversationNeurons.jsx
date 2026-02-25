/**
 * Hook pour intégrer le réseau neuronal conversationnel dans Chat_2
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import ConversationNeuronNetwork from './ConversationNeuronNetwork';

export function useConversationNeurons() {
  const networkRef = useRef(new ConversationNeuronNetwork());
  const [networkState, setNetworkState] = useState(null);
  const [insights, setInsights] = useState(null);

  // Ajouter un message au réseau neuronal
  const addToNetwork = useCallback((message, role) => {
    const network = networkRef.current;
    network.addMessage(message, role);
    
    const state = network.getNetworkState();
    setNetworkState(state);

    // Générer les insights après 7+ messages
    if (state.messages.length >= 7) {
      const insight = {
        reflection: state.reflection,
        journey: state.cognitive.thematicJourney,
        themes: state.cognitive.activeThemes,
        memoryUsage: state.cognitive.memoryUsage,
        phase: state.cognitive.phase
      };
      setInsights(insight);
    }

    return state;
  }, []);

  // Obtenir le contexte optimisé pour le prompt Druide
  const getOptimizedContext = useCallback(() => {
    return networkRef.current.buildOptimizedContextPrompt();
  }, []);

  // Réinitialiser le réseau
  const reset = useCallback(() => {
    networkRef.current = new ConversationNeuronNetwork();
    setNetworkState(null);
    setInsights(null);
  }, []);

  // Obtenir la synthèse cognitive
  const getCognitiveSummary = useCallback(() => {
    return networkRef.current.generateCognitiveSummary();
  }, []);

  // Obtenir la déclaration réflexive
  const getReflection = useCallback(() => {
    return networkRef.current.generateReflectiveStatement();
  }, []);

  return {
    addToNetwork,
    getOptimizedContext,
    reset,
    getCognitiveSummary,
    getReflection,
    networkState,
    insights,
    network: networkRef.current
  };
}

export default useConversationNeurons;