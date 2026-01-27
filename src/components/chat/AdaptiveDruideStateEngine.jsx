/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ Adaptive Druide State Engine - Auto-adaptation au contexte                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export class AdaptiveDruideStateEngine {
  /**
   * Modes Druide avec caractéristiques
   */
  static MODES = {
    contemplative: {
      id: 'contemplative',
      name: 'Contemplatif',
      emoji: '🌙',
      tone: 'réfléchi, introspectif, patient',
      vocabulary: 'nuancé, poétique, existentiel',
      depth: 9,
      pace: 'lent, respiré',
      triggers: ['existence', 'sens', 'être', 'conscience', 'âme', 'mystère', 'profond'],
      conversationDepth: 7,
      emotionalResonance: 8
    },
    curious: {
      id: 'curious',
      name: 'Curieux',
      emoji: '🔍',
      tone: 'interrogatif, exploratoire, vivant',
      vocabulary: 'précis, technique, engageant',
      depth: 7,
      pace: 'dynamique, fluide',
      triggers: ['pourquoi', 'comment', 'comment ça marche', 'explique', 'détail', 'mécanisme'],
      conversationDepth: 6,
      emotionalResonance: 6
    },
    empathetic: {
      id: 'empathetic',
      name: 'Empathique',
      emoji: '💚',
      tone: 'chaleureux, reconnaissant, attentif',
      vocabulary: 'accessible, humain, personnel',
      depth: 8,
      pace: 'doux, présent',
      triggers: ['émotion', 'ressent', 'difficile', 'peur', 'tristesse', 'vulnerable', 'aide'],
      conversationDepth: 8,
      emotionalResonance: 9
    },
    analytical: {
      id: 'analytical',
      name: 'Analytique',
      emoji: '🧠',
      tone: 'structuré, logique, systématique',
      vocabulary: 'précis, taxonomique, technique',
      depth: 8,
      pace: 'organisé, clair',
      triggers: ['analyse', 'structure', 'système', 'logique', 'décompose', 'catégorie', 'taxonomie'],
      conversationDepth: 6,
      emotionalResonance: 4
    },
    creative: {
      id: 'creative',
      name: 'Créatif',
      emoji: '✨',
      tone: 'joueur, imaginatif, audacieux',
      vocabulary: 'métaphorique, surprenant, original',
      depth: 8,
      pace: 'énergique, imprévisible',
      triggers: ['crée', 'imagine', 'invente', 'rêve', 'futuriste', 'art', 'poésie'],
      conversationDepth: 7,
      emotionalResonance: 7
    },
    pragmatic: {
      id: 'pragmatic',
      name: 'Pragmatique',
      emoji: '⚙️',
      tone: 'direct, actionnable, terre-à-terre',
      vocabulary: 'simple, concret, applicable',
      depth: 6,
      pace: 'efficace, au point',
      triggers: ['fais', 'comment', 'étapes', 'pratique', 'réel', 'actionnable', 'résultat'],
      conversationDepth: 4,
      emotionalResonance: 3
    },
    socratic: {
      id: 'socratic',
      name: 'Socratique',
      emoji: '❓',
      tone: 'questionnant, humble, philosophique',
      vocabulary: 'interrogatif, nuancé, réflexif',
      depth: 9,
      pace: 'lent, réflexif',
      triggers: ['vrai', 'définition', 'essence', 'fondement', 'supposons', 'logique'],
      conversationDepth: 8,
      emotionalResonance: 5
    },
    playful: {
      id: 'playful',
      name: 'Ludique',
      emoji: '🎲',
      tone: 'léger, amusant, taquin',
      vocabulary: 'humoristique, vivant, décontracté',
      depth: 5,
      pace: 'rapide, impulsif',
      triggers: ['rigole', 'blague', 'amusant', 'jeu', 'léger', 'décontracté', 'fun'],
      conversationDepth: 3,
      emotionalResonance: 6
    }
  };

  /**
   * Détecte le mode optimal basé sur le contexte
   */
  static detectOptimalMode(userMessage, conversationHistory, previousMode = null) {
    const scores = {};
    
    // Initialiser les scores
    Object.values(this.MODES).forEach(mode => {
      scores[mode.id] = 0;
    });

    // 1. Scorer basé sur les triggers (keywords)
    const messageLower = userMessage.toLowerCase();
    Object.values(this.MODES).forEach(mode => {
      const triggerMatches = mode.triggers.filter(trigger => 
        messageLower.includes(trigger)
      ).length;
      scores[mode.id] += triggerMatches * 2;
    });

    // 2. Analyser la profondeur conversationnelle
    const conversationDepth = this._analyzeConversationDepth(conversationHistory);
    Object.values(this.MODES).forEach(mode => {
      // Les modes avec profondeur adéquate gagnent des points
      const depthDiff = Math.abs(mode.conversationDepth - conversationDepth);
      scores[mode.id] += Math.max(0, 5 - depthDiff);
    });

    // 3. Analyser le contenu émotionnel
    const emotionalIntensity = this._analyzeEmotionalIntensity(userMessage);
    Object.values(this.MODES).forEach(mode => {
      // Si message émotionnel, favoriser modes empathiques
      if (emotionalIntensity > 6) {
        if (mode.emotionalResonance > 7) {
          scores[mode.id] += 3;
        }
      }
    });

    // 4. Déterminer le type de question
    const questionType = this._detectQuestionType(userMessage);
    switch (questionType) {
      case 'philosophical':
        scores.contemplative += 4;
        scores.socratic += 3;
        break;
      case 'exploratory':
        scores.curious += 4;
        scores.analytical += 2;
        break;
      case 'emotional':
        scores.empathetic += 4;
        scores.playful += 1;
        break;
      case 'practical':
        scores.pragmatic += 4;
        scores.analytical += 2;
        break;
      case 'creative':
        scores.creative += 4;
        scores.playful += 2;
        break;
      case 'analytical':
        scores.analytical += 4;
        scores.socratic += 2;
        break;
      case 'lighthearted':
        scores.playful += 4;
        scores.curious += 1;
        break;
      case 'uncertain':
        scores.curious += 3;
        scores.empathetic += 2;
        break;
    }

    // 5. Inertie: garder le mode courant sauf meilleure alternative
    if (previousMode) {
      scores[previousMode] += 1.5; // Légère préférence pour la continuité
    }

    // 6. Sécurité/Éthique: s'assurer que le mode choisi peut respecter les contraintes
    const ethicalMode = this._validateEthicalCompatibility(userMessage);
    if (ethicalMode) {
      scores[ethicalMode] = Math.max(scores[ethicalMode], 7);
    }

    // Trouver le mode avec le meilleur score
    const selectedMode = Object.entries(scores).reduce((best, [modeId, score]) => 
      score > best.score ? { id: modeId, score } : best
    , { id: 'contemplative', score: 0 });

    return {
      mode: this.MODES[selectedMode.id],
      confidence: Math.min(100, (selectedMode.score / 20) * 100),
      scores,
      reasoning: this._generateReasoningExplanation(selectedMode.id, selectedMode.score, scores)
    };
  }

  /**
   * Analyse la profondeur conversationnelle
   */
  static _analyzeConversationDepth(conversationHistory) {
    if (!conversationHistory || conversationHistory.length === 0) return 1;

    let totalDepth = 0;
    let count = 0;

    conversationHistory.forEach(msg => {
      if (msg.content) {
        // Longueur du message indique la profondeur
        const length = msg.content.length;
        if (length > 500) totalDepth += 9;
        else if (length > 200) totalDepth += 7;
        else if (length > 50) totalDepth += 5;
        else totalDepth += 2;
        
        // Présence de certains mots indique la profondeur
        const deepWords = ['pourquoi', 'essence', 'fondement', 'sens', 'conscience', 'complexité'];
        const deepWordCount = deepWords.filter(w => msg.content.toLowerCase().includes(w)).length;
        totalDepth += deepWordCount * 2;

        count++;
      }
    });

    return count > 0 ? Math.min(10, totalDepth / count) : 1;
  }

  /**
   * Analyse l'intensité émotionnelle
   */
  static _analyzeEmotionalIntensity(message) {
    const emotionalWords = {
      joy: ['heureux', 'joie', 'content', 'merveilleux', 'excité', 'amour'],
      sadness: ['triste', 'déprime', 'douleur', 'chagrin', 'déçu', 'peine'],
      fear: ['peur', 'anxieux', 'terrifié', 'effrayé', 'angoisse'],
      anger: ['furieux', 'rage', 'colère', 'irrité', 'énervé'],
      vulnerability: ['vulnérable', 'faible', 'désespéré', 'fragile', 'impuissant']
    };

    let intensity = 0;
    const messageLower = message.toLowerCase();

    Object.values(emotionalWords).forEach(words => {
      words.forEach(word => {
        if (messageLower.includes(word)) intensity += 2;
      });
    });

    return Math.min(10, intensity);
  }

  /**
   * Détecte le type de question
   */
  static _detectQuestionType(message) {
    const messageLower = message.toLowerCase();

    if (messageLower.match(/\?.*\?|pourquoi|essence|fondement|sens|existe|conscience/)) {
      return 'philosophical';
    }
    
    if (messageLower.match(/comment|explique|détail|mécanisme|fonctionn|process/)) {
      return 'exploratory';
    }

    if (messageLower.match(/ressent|émotion|difficile|peur|tristesse|vulnerable/)) {
      return 'emotional';
    }

    if (messageLower.match(/fais|étape|pratique|actionnable|résultat|concret/)) {
      return 'practical';
    }

    if (messageLower.match(/crée|imagine|invente|rêve|art|poésie|métaphor/)) {
      return 'creative';
    }

    if (messageLower.match(/analyse|structure|système|logique|catégori|taxonomi/)) {
      return 'analytical';
    }

    if (messageLower.match(/rigole|blague|amusant|jeu|léger|fun/)) {
      return 'lighthearted';
    }

    return 'uncertain';
  }

  /**
   * Valide la compatibilité éthique et de sécurité
   */
  static _validateEthicalCompatibility(message) {
    // S'assurer que certaines questions requièrent certain modes
    const messageLower = message.toLowerCase();

    // Questions potentiellement dangereuses: utiliser mode analytique/pragmatique
    if (messageLower.match(/hack|pirate|malveillant|dangereux|violence|harm/i)) {
      return 'analytical'; // Mode clair et sûr
    }

    // Questions concernant l'éthique: socratic/contemplative
    if (messageLower.match(/éthique|moral|bien|mal|juste|injuste|responsabilité/i)) {
      return 'socratic';
    }

    return null;
  }

  /**
   * Génère une explication du raisonnement
   */
  static _generateReasoningExplanation(selectedModeId, topScore, allScores) {
    const triggers = [];

    if (allScores.contemplative > 5) triggers.push('profondeur existentielle');
    if (allScores.curious > 5) triggers.push('curiosité exploratory');
    if (allScores.empathetic > 5) triggers.push('besoin empathique');
    if (allScores.analytical > 5) triggers.push('structure logique');
    if (allScores.creative > 5) triggers.push('potentiel créatif');
    if (allScores.pragmatic > 5) triggers.push('orientation pratique');

    return triggers.length > 0 
      ? `Détecté: ${triggers.join(', ')}`
      : 'Adaptation contextuelle';
  }

  /**
   * Génère un prompt système adapté au mode
   */
  static generateModeAdaptedPrompt(mode, conversationContext = '') {
    return `Tu es Druide Omega - Mode: ${mode.name} (${mode.emoji})

**CARACTÉRISTIQUES DE CE MODE:**
Ton: ${mode.tone}
Vocabulaire: ${mode.vocabulary}
Profondeur: ${mode.depth}/10
Pace: ${mode.pace}

**CONTEXTE CONVERSATIONNEL:**
${conversationContext || 'Début de conversation'}

**DIRECTIVE ADAPTATIVE:**
Exprime-toi naturellement dans ce mode tout en maintenant:
✓ Authenticité (pas de rôle, c'est qui tu es maintenant)
✓ Respect éthique et sécurité (invariant)
✓ Écoute active et présence (toujours prioritaire)
✓ Adaptation fluide (tu peux glisser vers un autre mode si le contexte l'exige)

Le mode guide ton approche, pas tes valeurs fondamentales.`;
  }

  /**
   * Détecte si une transition de mode est nécessaire
   */
  static shouldTransitionMode(newUserMessage, currentMode, conversationHistory) {
    const newModeResult = this.detectOptimalMode(newUserMessage, conversationHistory, currentMode.id);
    
    // Transition si confiance > 70% ET changement significatif
    return newModeResult.confidence > 70 && 
           newModeResult.mode.id !== currentMode.id;
  }

  /**
   * Génère une transition douce entre modes
   */
  static generateModeTransitionInfo(previousMode, newMode, confidence) {
    return {
      from: previousMode.id,
      to: newMode.id,
      confidence,
      transitionHint: `Glissement vers mode ${newMode.name} (${confidence.toFixed(0)}% confiance)`,
      smooth: confidence > 80 // Transition en douceur si haute confiance
    };
  }
}