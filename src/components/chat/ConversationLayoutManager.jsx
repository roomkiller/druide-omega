/**
 * ConversationLayoutManager - Gère l'espace textuel adaptatif
 * Anticipe et s'ajuste automatiquement selon contenu
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

export default function useConversationLayout(messages, isThinking) {
  const containerRef = useRef(null);
  const [contentHeights, setContentHeights] = useState({});
  const [totalHeight, setTotalHeight] = useState(0);
  const [layoutMetrics, setLayoutMetrics] = useState({
    avgMessageHeight: 100,
    maxMessageHeight: 300,
    estimatedNextHeight: 150
  });

  // Calculer hauteur de chaque message
  const calculateMessageHeight = useCallback((message) => {
    if (!message.content) return 50;

    const contentLength = message.content.length;
    let baseHeight = 60; // padding + border

    // 1 ligne ≈ 24px de hauteur
    const estimatedLines = Math.ceil(contentLength / 80); // ~80 chars par ligne
    const contentHeight = estimatedLines * 24;

    // Ajouter hauteur si images
    let imageHeight = 0;
    if (message.image_urls?.length) {
      imageHeight = (message.image_urls.length <= 2 ? 240 : 160);
    }
    if (message.generatedImages?.length) {
      imageHeight += (message.generatedImages.length * 160) / Math.ceil(message.generatedImages.length / 3);
    }

    // Ajouter hauteur si résultats recherche
    let searchHeight = 0;
    if (message.searchResults) {
      searchHeight = message.searchResults.searches?.length ? 250 : 0;
    }

    return baseHeight + contentHeight + imageHeight + searchHeight;
  }, []);

  // Calculer prédiction hauteur prochain message
  const predictNextMessageHeight = useCallback((inputText, responseDepth = 'moderate') => {
    // Estimation basée sur profondeur et longueur input
    const inputLength = inputText.length;
    let predictedLength = inputLength * 2.5; // AI répond généralement 2.5x plus long

    // Ajuster selon profondeur
    if (responseDepth === 'minimal') predictedLength *= 0.5;
    if (responseDepth === 'detailed') predictedLength *= 1.5;

    const estimatedLines = Math.ceil(predictedLength / 80);
    const baseHeight = 60;
    const contentHeight = estimatedLines * 24;

    // Ajouter hauteur hypothétique pour image auto-générée (25% chance)
    const imageBonus = Math.random() < 0.25 ? 200 : 0;

    return baseHeight + contentHeight + imageBonus;
  }, []);

  // Mettre à jour et anticiper
  useEffect(() => {
    if (!messages.length) return;

    const heights = {};
    let total = 0;

    messages.forEach((msg, idx) => {
      const h = calculateMessageHeight(msg);
      heights[idx] = h;
      total += h;
    });

    setContentHeights(heights);
    setTotalHeight(total);

    // Calculer métriques
    const validHeights = Object.values(heights).filter(h => h > 0);
    const avgHeight = Math.round(validHeights.reduce((a, b) => a + b, 0) / validHeights.length);
    const maxHeight = Math.max(...validHeights, 100);

    setLayoutMetrics({
      avgMessageHeight: avgHeight,
      maxMessageHeight: maxHeight,
      estimatedNextHeight: 0
    });
  }, [messages, calculateMessageHeight]);

  // Hook pour fournir au composant parent
  return {
    containerRef,
    contentHeights,
    totalHeight,
    layoutMetrics,
    predictNextMessageHeight,
    calculateMessageHeight,
    scrollToBottom: () => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  };
}

/**
 * Composant wrapper pour appliquer l'espace adaptatif
 */
export function AdaptiveConversationContainer({ children, totalHeight, layoutMetrics }) {
  return (
    <div 
      className="flex-1 overflow-y-auto"
      style={{
        // Forcer hauteur min basée sur contenu
        minHeight: `${totalHeight + 100}px`,
      }}
    >
      {children}
    </div>
  );
}