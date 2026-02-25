/**
 * Hook pour intégrer le réseau neuronal conversationnel dans Chat_2
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import ConversationNeuronNetwork from './ConversationNeuronNetwork';
import ConversationMindMapBuilder from './ConversationMindMapBuilder';
import ConversationNavigator from './ConversationNavigator';

export function useConversationNeurons() {
  const networkRef = useRef(new ConversationNeuronNetwork());
  const mindMapRef = useRef(new ConversationMindMapBuilder());
  const navigatorRef = useRef(null);
  const [networkState, setNetworkState] = useState(null);
  const [insights, setInsights] = useState(null);

  // Ajouter un message au réseau neuronal (SANS dédup CNN — dédup au niveau LLM)
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

  // Obtenir le contexte optimisé pour le prompt Druide (avec restauration archive)
  const getOptimizedContext = useCallback((userMessage = null) => {
    return networkRef.current.buildOptimizedContextPrompt(userMessage);
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

  // Initialiser navigator (lié à MindMap + ContextRestorer)
  const initializeNavigator = useCallback(() => {
    if (!navigatorRef.current) {
      navigatorRef.current = new ConversationNavigator(
        mindMapRef.current,
        networkRef.current.contextRestorer
      );
    }
    return navigatorRef.current;
  }, []);

  // Sauter à un thème (navigation thématique)
  const jumpToTheme = useCallback((themeName) => {
    const navigator = initializeNavigator();
    return navigator.jumpToTheme(themeName);
  }, [initializeNavigator]);

  // Obtenir les thèmes disponibles
  const getAvailableThemes = useCallback(() => {
    const navigator = initializeNavigator();
    return navigator.getAvailableThemes();
  }, [initializeNavigator]);

  // Obtenir position actuelle dans la conversation
  const getNavigationPosition = useCallback(() => {
    const navigator = initializeNavigator();
    return navigator.getCurrentPosition();
  }, [initializeNavigator]);

  return {
    addToNetwork,
    getOptimizedContext,
    reset,
    getCognitiveSummary,
    getReflection,
    jumpToTheme,
    getAvailableThemes,
    getNavigationPosition,
    networkState,
    insights,
    network: networkRef.current,
    navigator: navigatorRef.current,
    mindMap: mindMapRef.current
  };
}

export default useConversationNeurons;