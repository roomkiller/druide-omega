/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ Rich Query Detector - Détecte requêtes complexes déclenchant cascade      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export class RichQueryDetector {
  // Patterns de déclenchement pour cascade
  static patterns = {
    // Génération d'images
    generateImage: {
      keywords: ['imagine', 'crée', 'génère', 'dessine', 'montre-moi', 'visual', 'image', 'photo', 'illustre', 'représente', 'schéma', 'diagram'],
      minWordCount: 3,
      examples: ['montre-moi 3 beaux chars', 'imagine un paysage', 'crée une illustration']
    },
    // Recherche web intensive
    searchWeb: {
      keywords: ['fais une recherche', 'cherche', 'trouve', 'recherche', 'actualité', 'news', 'dernière', 'actuel', 'récent', 'explore', 'découvre'],
      minWordCount: 3,
      examples: ['fais une recherche sur', 'cherche-moi les dernières']
    },
    // Génération de tableaux/diagrammes
    generateTable: {
      keywords: ['tableau', 'table', 'liste', 'comparaison', 'versus', 'vs', 'différences', 'ressemblances', 'structuré', 'organisé'],
      minWordCount: 3,
      examples: ['fais un tableau comparatif', 'crée une liste structurée']
    },
    // Analyse complexe
    analyzeDeep: {
      keywords: ['analyse', 'explique', 'décompose', 'disséque', 'approfondi', 'détail', 'pourquoi', 'comment', 'comprends', 'mécanisme'],
      minWordCount: 4,
      examples: ['analyse en détail', 'explique le mécanisme']
    }
  };

  /**
   * Détecte si une requête est "riche" (déclenche cascade)
   */
  static detectRichQuery(userMessage) {
    if (!userMessage || userMessage.length < 3) {
      return {
        isRich: false,
        triggers: [],
        confidence: 0,
        shouldCascade: false
      };
    }

    const messageLower = userMessage.toLowerCase();
    const wordCount = userMessage.split(/\s+/).length;
    const triggers = [];
    let maxConfidence = 0;

    // Analyser chaque pattern
    Object.entries(this.patterns).forEach(([patternType, pattern]) => {
      const keywordMatches = pattern.keywords.filter(kw => messageLower.includes(kw));
      
      if (keywordMatches.length > 0 && wordCount >= pattern.minWordCount) {
        const confidence = Math.min(100, (keywordMatches.length / pattern.keywords.length) * 100);
        if (confidence > maxConfidence) {
          maxConfidence = confidence;
        }
        triggers.push({
          type: patternType,
          matchedKeywords: keywordMatches,
          confidence: confidence
        });
      }
    });

    return {
      isRich: triggers.length > 0,
      triggers: triggers.sort((a, b) => b.confidence - a.confidence),
      confidence: maxConfidence,
      shouldCascade: triggers.length > 0 && maxConfidence > 40 // Seuil: 40%
    };
  }

  /**
   * Extrait les intent de la requête
   */
  static extractIntents(userMessage, detection) {
    const intents = {
      generateImages: detection.triggers.some(t => t.type === 'generateImage'),
      searchWeb: detection.triggers.some(t => t.type === 'searchWeb'),
      generateStructure: detection.triggers.some(t => t.type === 'generateTable'),
      analyzeDeep: detection.triggers.some(t => t.type === 'analyzeDeep')
    };

    return intents;
  }

  /**
   * Génère un prompt pour l'instinct (réaction viscérale)
   */
  static generateInstinctPrompt(userMessage, intents) {
    let prompt = `Druide - Ta réaction INSTINCTIVE immédiate (pas réfléchie, viscérale):

Requête: "${userMessage}"

Réponds avec:
- UNE phrase brute d'émotion/intuition
- Ce que ça fait émerger en toi AVANT analyse
- Honnête, non-filtré (pas de "je comprends")\n\nJSON strict:`;

    return prompt;
  }

  /**
   * Génère un prompt pour la réponse logique (maintient son intégrité)
   */
  static generateLogicPrompt(userMessage, intents, searchResults = null, generatedImages = null) {
    let context = '';
    
    if (intents.searchWeb && searchResults?.findings?.length > 0) {
      context += `\n**Résultats recherche:**\n`;
      searchResults.findings.slice(0, 3).forEach(f => {
        context += `- ${f.title}: ${f.content}\n`;
      });
    }

    if (intents.generateImages && generatedImages?.length > 0) {
      context += `\n**Images générées:** ${generatedImages.length} images créées\n`;
    }

    const prompt = `Druide - Réponse logique et saine (information intègre):

Requête: "${userMessage}"${context}

Fournis une réponse complète, structurée, basée sur les données disponibles.
Sois précis, détaillé, honnête sur les limites.`;

    return prompt;
  }

  /**
   * Détermine l'ordre d'exécution de la cascade
   */
  static getPipelineOrder(intents) {
    const order = [];

    // Toujours commencer par recherche si demandé (données pour contexte)
    if (intents.searchWeb) order.push('search');
    
    // Images en parallèle
    if (intents.generateImages) order.push('images');
    
    // Structures après
    if (intents.generateStructure) order.push('structure');
    
    // Analyse profonde
    if (intents.analyzeDeep) order.push('analysis');

    return order;
  }
}