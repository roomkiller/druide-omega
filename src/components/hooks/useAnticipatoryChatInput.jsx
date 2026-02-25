/**
 * useAnticipatoryChatInput - Hook React pour capture préemptive
 * Analyse le texte PENDANT que l'utilisateur tape
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function useAnticipatoryChatInput() {
  const [inputText, setInputText] = useState('');
  const [preloadedData, setPreloadedData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const debounceRef = useRef(null);

  // ════════════════════════════════════════════════════════════════
  // ANALYSE ANTICIPATOIRE EN TEMPS RÉEL
  // ════════════════════════════════════════════════════════════════

  const analyzeInput = useCallback(async (text) => {
    if (!text?.trim() || text.length < 3) {
      setPreloadedData(null);
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await base44.functions.invoke(
        'anticipatoryConversationEngine',
        {
          textChunk: text,
          conversationContext: { /* populated from parent */ }
        }
      );

      if (response.data?.status === 'ready') {
        setPreloadedData(response.data.preloadedData);
      }
    } catch (e) {
      console.log('Anticipatory analysis skipped');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // ════════════════════════════════════════════════════════════════
  // DEBOUNCE: On attend que l'utilisateur arrête de taper 200ms
  // ════════════════════════════════════════════════════════════════

  const handleInputChange = useCallback((value) => {
    setInputText(value);

    // Annuler l'analyse précédente si elle est en cours
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Réinitialiser données pré-chargées si l'input est vide
    if (!value?.trim()) {
      setPreloadedData(null);
      setIsAnalyzing(false);
      return;
    }

    // Nouvelle analyse après 200ms d'inactivité (seulement si suffisamment de contenu)
    debounceRef.current = setTimeout(() => {
      analyzeInput(value);
    }, 200);
  }, [analyzeInput]);

  // ════════════════════════════════════════════════════════════════
  // NETTOYAGE
  // ════════════════════════════════════════════════════════════════

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // ════════════════════════════════════════════════════════════════
  // RETOUR: Hook fournit tout ce dont on a besoin
  // ════════════════════════════════════════════════════════════════

  return {
    inputText,
    handleInputChange,
    preloadedData, // Données déjà chargées, prêtes à utiliser
    isAnalyzing,
    isReady: !!preloadedData // Le système est prêt à traiter
  };
}