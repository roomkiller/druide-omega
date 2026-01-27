/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ Rich Query Detector - Détecte requêtes complexes déclenchant cascade      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export class RichQueryDetector {
  // Patterns enrichis de déclenchement pour cascade
  static patterns = {
    // ═══════════════════════════════════════════════════════════════
    // GÉNÉRATION D'IMAGES & VISUELS (enrichi)
    // ═══════════════════════════════════════════════════════════════
    generateImage: {
      keywords: [
        'imagine', 'crée', 'génère', 'dessine', 'montre-moi', 'visual', 'image', 'photo', 'illustre', 'représente', 
        'schéma', 'diagram', 'graphique', 'visuels', 'illustrations', 'concept art', 'artwork', 'sketch', 'design',
        'infographie', 'affiche', 'banner', 'logo', 'icon', 'character', 'portrait', 'paysage', 'scène', 'style',
        'aesthetic', 'vibe', 'mood board', 'ambiance visuelle', 'vision', 'perspectives', 'rendu', '3d', 'render',
        'composition', 'layout', 'mockup', 'prototype', 'interface', 'wireframe', 'storyboard', 'sequence'
      ],
      minWordCount: 2,
      examples: [
        'montre-moi 3 beaux chars',
        'imagine un paysage futuriste cyberpunk',
        'crée une illustration sur le thème de',
        'dépeins visuellement ce concept',
        'génère 5 variations de style anime'
      ],
      weightFactors: {
        numberPrefix: 1.3, // "3 images" = boost
        styleDescriptors: 1.2, // "cyberpunk", "anime", "watercolor"
        multipleRequests: 1.4 // "5 variations"
      }
    },

    // ═══════════════════════════════════════════════════════════════
    // RECHERCHE & EXPLORATION (enrichi)
    // ═══════════════════════════════════════════════════════════════
    searchWeb: {
      keywords: [
        'fais une recherche', 'cherche', 'trouve', 'recherche', 'actualité', 'news', 'dernière', 'actuel', 'récent',
        'explore', 'découvre', 'enquête', 'investigate', 'scrute', 'déniche', 'déterre', 'fouille', 'scrape',
        'scan', 'check', 'vérif', 'fact-check', 'sources', 'preuves', 'données', 'stats', 'chiffres',
        'tendance', 'trend', 'viral', 'populaire', 'buzz', 'émergent', 'breakthrough', 'cutting-edge',
        'information', 'intel', 'contexte', 'background', 'historique', 'évolution', 'timeline'
      ],
      minWordCount: 2,
      examples: [
        'fais une recherche sur les dernières avancées en IA',
        'cherche-moi les sources sur ce sujet',
        'explore les tendances actuelles en design',
        'déterre des infos sur',
        'fact-check cette affirmation avec preuves'
      ],
      contextKeywords: ['selon', 'après', 'basé sur', 'avec sources', 'preuves']
    },

    // ═══════════════════════════════════════════════════════════════
    // GÉNÉRATION DE STRUCTURES (tableaux, listes, diagrammes)
    // ═══════════════════════════════════════════════════════════════
    generateStructure: {
      keywords: [
        'tableau', 'table', 'liste', 'comparaison', 'versus', 'vs', 'différences', 'ressemblances',
        'structuré', 'organisé', 'hiérarchie', 'arborescence', 'flowchart', 'workflow', 'pipeline',
        'matrice', 'grid', 'canvas', 'blueprint', 'roadmap', 'timeline', 'gantt', 'chronologie',
        'organigramme', 'schéma', 'mind map', 'carte mentale', 'concept map', 'framework', 'architecture',
        'taxonomy', 'classification', 'catégories', 'segments', 'breakdown', 'décomposition', 'layers',
        'checklist', 'phasés', 'étapes', 'protocole', 'processus', 'système', 'structure'
      ],
      minWordCount: 2,
      examples: [
        'fais un tableau comparatif entre',
        'crée une liste structurée des points clés',
        'génère un flowchart pour le processus',
        'construis une roadmap visuelle',
        'décompose en phases avec timeline'
      ],
      structureTypes: ['matrix', 'list', 'timeline', 'flowchart', 'map', 'hierarchy', 'comparison']
    },

    // ═══════════════════════════════════════════════════════════════
    // ANALYSE APPROFONDIE & SYNTHÈSE
    // ═══════════════════════════════════════════════════════════════
    analyzeDeep: {
      keywords: [
        'analyse', 'explique', 'décompose', 'disséque', 'approfondi', 'détail', 'pourquoi', 'comment',
        'comprends', 'mécanisme', 'dissection', 'démonte', 'démantèle', 'examen', 'scrutin',
        'perspectif', 'angle', 'lens', 'point de vue', 'interprétation', 'signification', 'sens',
        'implications', 'conséquences', 'impact', 'ripple effect', 'cause-effect', 'causalité',
        'profond', 'substrat', 'essence', 'fondamental', 'racine', 'origines', 'genèse',
        'couches', 'niveaux', 'dimensions', 'facettes', 'nuances', 'subtilités'
      ],
      minWordCount: 3,
      examples: [
        'analyse en détail le mécanisme derrière',
        'explique les implications profondes de',
        'disséque ce concept sous tous ses angles',
        'démontre les couches cachées de',
        'révèle les nuances et subtilités'
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // CRÉATION TEXTUELLE & CONTENU RICHE (NOUVEAU)
    // ═══════════════════════════════════════════════════════════════
    generateContent: {
      keywords: [
        'écris', 'rédige', 'compose', 'génère', 'formule', 'articule', 'exprime',
        'histoire', 'scénario', 'narrative', 'conte', 'fable', 'épopée', 'saga',
        'article', 'essay', 'manifeste', 'déclaration', 'lettre', 'mail', 'script',
        'dialogue', 'conversation', 'monologue', 'poème', 'vers', 'prose', 'lyrique',
        'chanson', 'rap', 'slogan', 'tagline', 'pitch', 'description', 'synopsis',
        'cas d\'étude', 'exemple concret', 'anecdote', 'métaphore', 'analogie'
      ],
      minWordCount: 3,
      examples: [
        'écris une histoire courte sur',
        'compose un article détaillé',
        'génère un dialogue authentique entre',
        'crée une métaphore poétique pour',
        'formule un pitch convaincant'
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // BRAINSTORM & CRÉATION CONCEPTUELLE (NOUVEAU)
    // ═══════════════════════════════════════════════════════════════
    brainstorm: {
      keywords: [
        'brainstorm', 'idées', 'suggestions', 'alternatives', 'variations', 'angles',
        'créatif', 'innovant', 'original', 'unique', 'disruptif', 'novel', 'frontier',
        'réinvente', 'détourne', 'remix', 'fusion', 'hybrid', 'mashup', 'combo',
        'perspectives nouvelles', 'approches inattendues', 'lateral thinking', 'out-of-the-box',
        'expérimental', 'avant-garde', 'radical', 'extrême', 'limite', 'boundary-push'
      ],
      minWordCount: 2,
      examples: [
        'brainstorm 5 approches radicalement différentes',
        'donne-moi des idées créatives et innovantes',
        'réinvente ce concept de manière disruptive',
        'explore des variations extrêmes et expérimentales'
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // TRANSFORMATION & REINTERPRETATION (NOUVEAU)
    // ═══════════════════════════════════════════════════════════════
    transform: {
      keywords: [
        'transforme', 'traduis', 'adapte', 'convertis', 'transpose', 'reformule',
        'simplifie', 'complexifie', 'décode', 'encode', 'crypte', 'déchiffre',
        'para-phrase', 'résume', 'synthétise', 'dilate', 'condense', 'amplifie',
        'style', 'ton', 'voice', 'perspectif', 'reframe', 'recontextualise',
        'métaphoriquement', 'allégoriquement', 'symboliquement', 'poétiquement'
      ],
      minWordCount: 2,
      examples: [
        'transforme ce texte en style poétique',
        'traduis ce concept en langage simple',
        'réinterprète-le de façon métaphorique',
        'transpose cette idée dans un contexte différent'
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // SYNTHÈSE CROSS-MODALE (NOUVEAU)
    // ═══════════════════════════════════════════════════════════════
    crossModalSynthesis: {
      keywords: [
        'synthèse', 'fusion', 'croisement', 'intersection', 'convergence', 'merge',
        'combine', 'intègre', 'harmonise', 'unifie', 'connecte', 'lie', 'relie',
        'cartographie', 'mapping', 'corrélations', 'relations', 'patterns', 'connections',
        'holiste', 'systémique', 'complexe', 'interconnecté', 'réseau', 'ecosystem',
        'multi-dimensionnel', 'multi-layered', 'multi-faceted', 'trans-disciplinaire'
      ],
      minWordCount: 3,
      examples: [
        'fais la synthèse entre ces trois perspectives',
        'montre-moi les corrélations cachées',
        'intègre ces éléments dans une vision holiste',
        'crée une cartographie conceptuelle'
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // COMPARAISON NUANCÉE (NOUVEAU)
    // ═══════════════════════════════════════════════════════════════
    nuancedComparison: {
      keywords: [
        'compare', 'confronte', 'contraste', 'oppose', 'rapproche', 'similitudes',
        'nuances', 'subtiles', 'distinctions fines', 'grey area', 'spectrum', 'gradient',
        'avantages', 'inconvénients', 'trade-offs', 'compromis', 'tension', 'paradoxe',
        'ambiguïté', 'équilibre', 'dualité', 'dialectique', 'contradiction'
      ],
      minWordCount: 3,
      examples: [
        'compare-les en mettant en évidence les nuances',
        'montre le spectrum entre ces deux extrêmes',
        'explore les trade-offs et paradoxes',
        'souligne les subtilités souvent ignorées'
      ]
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
        shouldCascade: false,
        richness: 'minimal'
      };
    }

    const messageLower = userMessage.toLowerCase();
    const wordCount = userMessage.split(/\s+/).length;
    const triggers = [];
    let maxConfidence = 0;
    let totalRichnessScore = 0;

    // Analyser chaque pattern enrichi
    Object.entries(this.patterns).forEach(([patternType, pattern]) => {
      const keywordMatches = pattern.keywords.filter(kw => messageLower.includes(kw));
      
      if (keywordMatches.length > 0 && wordCount >= pattern.minWordCount) {
        // Calcul de confiance de base
        let confidence = Math.min(100, (keywordMatches.length / pattern.keywords.length) * 100);
        
        // Appliquer facteurs de poids si disponibles
        if (pattern.weightFactors) {
          if (pattern.weightFactors.numberPrefix && /\d+\s+(images?|chars?|items?|variations?|options?)/i.test(userMessage)) {
            confidence *= pattern.weightFactors.numberPrefix;
          }
          if (pattern.weightFactors.styleDescriptors && this.hasStyleDescriptors(userMessage)) {
            confidence *= pattern.weightFactors.styleDescriptors;
          }
          if (pattern.weightFactors.multipleRequests && /\d+\s+(versions?|approches?|alternatives?)/i.test(userMessage)) {
            confidence *= pattern.weightFactors.multipleRequests;
          }
          confidence = Math.min(100, confidence);
        }

        if (confidence > maxConfidence) {
          maxConfidence = confidence;
        }

        totalRichnessScore += confidence;

        triggers.push({
          type: patternType,
          matchedKeywords: keywordMatches,
          confidence: Math.round(confidence),
          category: this.getCategory(patternType)
        });
      }
    });

    // Détermine le niveau de richesse
    const richness = this.calculateRichness(triggers.length, maxConfidence, totalRichnessScore, wordCount);

    return {
      isRich: triggers.length > 0,
      triggers: triggers.sort((a, b) => b.confidence - a.confidence),
      confidence: Math.round(maxConfidence),
      shouldCascade: triggers.length > 0 && maxConfidence > 35,
      richness: richness,
      totalRichnessScore: Math.round(totalRichnessScore),
      triggerCount: triggers.length,
      wordCount
    };
  }

  /**
   * Détecte les descripteurs de style (anime, cyberpunk, etc)
   */
  static hasStyleDescriptors(message) {
    const styles = ['anime', 'cyberpunk', 'steampunk', 'watercolor', 'oil', 'photorealistic', 'minimalist',
                    'surreal', 'abstract', 'geometric', 'neon', 'retro', 'vintage', 'futuristic', 'baroque',
                    'gothic', 'art deco', 'bauhaus', 'illustration', 'vector', 'pixel art'];
    return styles.some(s => message.toLowerCase().includes(s));
  }

  /**
   * Catégorise les types de patterns
   */
  static getCategory(patternType) {
    const categories = {
      generateImage: 'visual',
      searchWeb: 'research',
      generateStructure: 'structure',
      analyzeDeep: 'analysis',
      generateContent: 'content',
      brainstorm: 'ideation',
      transform: 'transformation',
      crossModalSynthesis: 'synthesis',
      nuancedComparison: 'comparison'
    };
    return categories[patternType] || 'misc';
  }

  /**
   * Calcule le niveau de richesse basé sur plusieurs facteurs
   */
  static calculateRichness(triggerCount, maxConfidence, totalScore, wordCount) {
    if (triggerCount === 0) return 'minimal';
    if (triggerCount === 1 && maxConfidence < 50) return 'light';
    if (triggerCount === 1 && maxConfidence >= 50) return 'moderate';
    if (triggerCount >= 2 && totalScore < 120) return 'moderate';
    if (triggerCount >= 2 && totalScore < 180) return 'rich';
    return 'very_rich'; // Requête hautement complexe multi-intent
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