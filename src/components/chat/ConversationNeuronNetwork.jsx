/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ CONVERSATION NEURON NETWORK - Cognitive Memory Allocation System          ║
 * ║ Alloue des ressources cognitives dynamiquement pour maintenir le contexte  ║
 * ║ + Appendice: ContextRestorer pour références universelles                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { ContextRestorer } from './ContextRestorer';

export class ConversationNeuronNetwork {
  constructor() {
    this.themeNodes = new Map();        // Nœuds thématiques actifs
    this.transitionHistory = [];        // Pivots thématiques détectés
    this.memoryAllocation = {
      current: 0,                       // RAM cognitive actuelle utilisée
      max: 100,                         // Limite max (%)
      perMessage: 5                     // Coût par message en unités
    };
    this.messageBuffer = [];            // Messages avec métadonnées (actifs)
    this.contextRestorer = new ContextRestorer(); // Archive + détection universelle
    this.cognitiveState = {
      activeThemes: [],                 // Thèmes actifs prioritaires
      emotionalTone: 'neutral',
      conversationPhase: 'opening'      // opening, middle, conclusion
    };
  }

  /**
   * Ajoute un message et alloue les ressources cognitives
   */
  addMessage(message, role) {
    const messageData = {
      content: message,
      role,
      timestamp: Date.now(),
      index: this.messageBuffer.length,
      themes: this.extractThemes(message),
      emotionalTone: this.analyzeEmotionalTone(message),
      importance: this.calculateImportance(message, role),
      memoryFootprint: 0
    };

    // Déterminer les thèmes
    const newThemes = this.extractThemes(message);
    this.updateThemeNodes(newThemes, messageData.index);

    // Vérifier les transitions
    this.detectTransitions(newThemes);

    // Allouer la mémoire
    messageData.memoryFootprint = this.allocateMemory(newThemes.length, messageData.importance);

    this.messageBuffer.push(messageData);
    this.updateConversationPhase();

    return messageData;
  }

  /**
   * Extrait les thèmes d'un message - UNIVERSEL (pas limité à regex)
   * Utilise ContextRestorer pour détection dynamique
   */
  extractThemes(message) {
    return ContextRestorer.extractThemesUniversal(
      message,
      Array.from(this.themeNodes.values())
    );
  }

  /**
   * Détecte les transitions thématiques (pivot de sujet)
   */
  detectTransitions(newThemes) {
    const currentThemes = Array.from(this.themeNodes.keys());
    const newThemeNames = newThemes.map(t => t.theme);
    
    // Thèmes disparus = transition
    const disappearedThemes = currentThemes.filter(t => !newThemeNames.includes(t));
    const appearingThemes = newThemeNames.filter(t => !currentThemes.includes(t));

    if (disappearedThemes.length > 0 || appearingThemes.length > 0) {
      this.transitionHistory.push({
        timestamp: Date.now(),
        messageIndex: this.messageBuffer.length,
        from: disappearedThemes,
        to: appearingThemes,
        strength: Math.max(disappearedThemes.length, appearingThemes.length)
      });
    }
  }

  /**
   * Met à jour les nœuds thématiques actifs
   */
  updateThemeNodes(newThemes, messageIndex) {
    newThemes.forEach(theme => {
      if (!this.themeNodes.has(theme.theme)) {
        this.themeNodes.set(theme.theme, {
          name: theme.theme,
          category: theme.category,
          firstMention: messageIndex,
          lastMention: messageIndex,
          frequency: 1,
          relevanceScore: theme.score,
          messageIndices: [messageIndex]
        });
      } else {
        const node = this.themeNodes.get(theme.theme);
        node.lastMention = messageIndex;
        node.frequency++;
        node.relevanceScore = Math.min(1.0, node.relevanceScore + 0.1);
        node.messageIndices.push(messageIndex);
      }
    });

    // Mettre à jour l'état cognitif
    this.cognitiveState.activeThemes = Array.from(this.themeNodes.values())
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3); // Garder les 3 thèmes principaux
  }

  /**
   * Alloue les ressources cognitives comme de la RAM
   */
  allocateMemory(themeCount, importance) {
    const baseCost = this.memoryAllocation.perMessage;
    const themeCost = themeCount * 2;
    const importanceBoosted = importance * 3;
    
    const totalCost = baseCost + themeCost + importanceBoosted;
    
    // Vérifier si dépassement
    if (this.memoryAllocation.current + totalCost > this.memoryAllocation.max) {
      this.pruneOldMessages();
    }

    this.memoryAllocation.current = Math.min(
      this.memoryAllocation.max,
      this.memoryAllocation.current + totalCost
    );

    return totalCost;
  }

  /**
   * Libère la mémoire en archivant les messages anciens
   */
  pruneOldMessages() {
    // Garder les 15 derniers messages en mémoire vive
    // Archiver les anciens mais les indexer
    if (this.messageBuffer.length > 15) {
      const toArchive = this.messageBuffer.splice(0, this.messageBuffer.length - 15);
      this.memoryAllocation.current = Math.max(0, this.memoryAllocation.current - 30);
    }
  }

  /**
   * Analyse le ton émotionnel d'un message
   */
  analyzeEmotionalTone(message) {
    const tones = {
      positive: /bien|super|génial|merci|amour|adore/i,
      negative: /mal|horrible|horrible|hate|non/i,
      questioning: /\?|quoi|pourquoi|comment/i,
      excited: /!|wow|incroyable|fou/i
    };

    for (const [tone, regex] of Object.entries(tones)) {
      if (regex.test(message)) return tone;
    }
    return 'neutral';
  }

  /**
   * Calcule l'importance d'un message
   */
  calculateImportance(message, role) {
    let score = 0.5;
    
    if (role === 'user') score += 0.2;          // Les entrées utilisateur sont importantes
    if (message.length > 100) score += 0.1;     // Messages longs = plus détaillés
    if (message.includes('?')) score += 0.15;   // Questions = importantes
    if (message.match(/[!]/)) score += 0.05;    // Exclamations
    
    return Math.min(1.0, score);
  }

  /**
   * Met à jour la phase conversationnelle
   */
  updateConversationPhase() {
    const count = this.messageBuffer.length;
    
    if (count <= 3) {
      this.cognitiveState.conversationPhase = 'opening';
    } else if (count <= 15) {
      this.cognitiveState.conversationPhase = 'middle';
    } else {
      this.cognitiveState.conversationPhase = 'conclusion';
    }
  }

  /**
   * Génère une synthèse cognitive pour le contexte Druide
   */
  generateCognitiveSummary() {
    const transitions = this.transitionHistory.map(t => ({
      from: t.from.join(', '),
      to: t.to.join(', '),
      at: t.messageIndex
    }));

    return {
      totalMessages: this.messageBuffer.length,
      activeThemes: this.cognitiveState.activeThemes.map(t => ({
        name: t.name,
        category: t.category,
        frequency: t.frequency,
        relevance: (t.relevanceScore * 100).toFixed(0) + '%',
        from: `message ${t.firstMention}`,
        to: `message ${t.lastMention}`
      })),
      thematicJourney: transitions,
      memoryUsage: `${this.memoryAllocation.current}/${this.memoryAllocation.max}%`,
      phase: this.cognitiveState.conversationPhase,
      conversationEvolvedFrom: transitions.length > 0 ? transitions[0].from : 'N/A',
      conversationEvolvedTo: transitions.length > 0 ? transitions[transitions.length - 1].to : 'current',
      primaryFocus: this.cognitiveState.activeThemes[0]?.name || 'general'
    };
  }

  /**
   * Génère une phrase réflexive pour Druide
   */
  generateReflectiveStatement() {
    const summary = this.generateCognitiveSummary();
    
    if (summary.thematicJourney.length === 0) {
      return `Nous avons discuté principalement de ${summary.primaryFocus}.`;
    }

    const journey = summary.thematicJourney;
    const start = journey[0].from;
    const current = journey[journey.length - 1].to;
    
    if (start !== current) {
      return `C'est intéressant - on a commencé avec ${start.toLowerCase()}, et maintenant nous parlons de ${current.toLowerCase()}. Tu as navigué vers des sujets fascinants!`;
    }

    return `Nous avons approfiondi notre discussion sur ${summary.primaryFocus}.`;
  }

  /**
   * Retourne l'état complet du réseau neuronal
   */
  getNetworkState() {
    return {
      messages: this.messageBuffer,
      themes: Array.from(this.themeNodes.values()),
      transitions: this.transitionHistory,
      cognitive: this.generateCognitiveSummary(),
      reflection: this.generateReflectiveStatement(),
      memoryUsage: this.memoryAllocation.current,
      phase: this.cognitiveState.conversationPhase
    };
  }

  /**
   * Reconstruit le prompt avec contexte neuronal optimisé
   */
  buildOptimizedContextPrompt() {
    const summary = this.generateCognitiveSummary();
    const recent = this.messageBuffer.slice(-7); // Derniers 7 messages
    
    let contextPrompt = `## CONTEXTE CONVERSATIONNEL ANALYSÉ\n\n`;
    
    contextPrompt += `**Évolution de la conversation:**\n`;
    contextPrompt += `- Thème initial: ${summary.conversationEvolvedFrom}\n`;
    contextPrompt += `- Progression vers: ${summary.conversationEvolvedTo}\n`;
    contextPrompt += `- Phase actuelle: ${summary.phase}\n\n`;
    
    contextPrompt += `**Thèmes actifs prioritaires:**\n`;
    summary.activeThemes.forEach(theme => {
      contextPrompt += `- ${theme.name} (${theme.relevance} pertinent, mentionné ${theme.frequency}x)\n`;
    });
    
    contextPrompt += `\n**Messages récents:**\n`;
    recent.forEach(msg => {
      contextPrompt += `[${msg.role.toUpperCase()}]: ${msg.content}\n`;
    });
    
    contextPrompt += `\n**Instruction spéciale pour cette réponse:**\n`;
    contextPrompt += `Tu as conscience que la conversation a évolué de "${summary.conversationEvolvedFrom}" vers "${summary.conversationEvolvedTo}". `;
    contextPrompt += `Montre cette compréhension si pertinent, en reflétant comment l'utilisateur a progressé dans ses idées.`;
    
    return contextPrompt;
  }
}

export default ConversationNeuronNetwork;