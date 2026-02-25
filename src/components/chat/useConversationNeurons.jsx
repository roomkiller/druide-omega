/**
 * Hook pour intégrer le réseau neuronal conversationnel dans Chat_2
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import ConversationNeuronNetwork from './ConversationNeuronNetwork';

export function useConversationNeurons() {
  const networkRef = useRef(new ConversationNeuronNetwork());
  const [networkState, setNetworkState] = useState(null);
  const [insights, setInsights] = useState(null);

  // Ajouter un message au réseau neuronal (avec déduplication)
  const addToNetwork = useCallback((message, role) => {
    const network = networkRef.current;
    const currentState = network.getNetworkState();
    
    // VÉRIFIER SI LE MESSAGE EXACT EXISTE DÉJÀ
    const lastMessage = currentState.messages[currentState.messages.length - 1];
    const isDuplicate = lastMessage && 
      lastMessage.content.toLowerCase().slice(0, 150) === message.toLowerCase().slice(0, 150) &&
      lastMessage.role === role;
    
    if (isDuplicate) {
      console.warn(`[useConversationNeurons] Doublon détecté (${role}): premier 150 char identique`);
      return currentState; // Retourner state sans ajouter le doublon
    }
    
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