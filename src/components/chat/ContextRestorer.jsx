/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ CONTEXT RESTORER - Archive & Dynamic Reference Resolution                ║
 * ║ Appendice CNN: retrouve contexte ancien via détection universelle         ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export class ContextRestorer {
  constructor() {
    this.messageArchive = [];      // Messages archivés (pas supprimés)
    this.themesIndex = new Map();  // theme → [messages indices]
    this.entityIndex = new Map();  // entity → [messages indices]
  }

  /**
   * Archive un message au lieu de le supprimer
   * Maintient index pour retrouver
   */
  archiveMessage(messageData, index) {
    this.messageArchive.push({
      ...messageData,
      archivedIndex: index,
      archivedAt: Date.now()
    });

    // Indexer tous les thèmes + entités extraites
    if (messageData.themes) {
      messageData.themes.forEach(theme => {
        if (!this.themesIndex.has(theme.theme)) {
          this.themesIndex.set(theme.theme, []);
        }
        this.themesIndex.get(theme.theme).push(index);
      });
    }

    if (messageData.entities) {
      messageData.entities.forEach(entity => {
        if (!this.entityIndex.has(entity)) {
          this.entityIndex.set(entity, []);
        }
        this.entityIndex.get(entity).push(index);
      });
    }
  }

  /**
   * Retrouver messages où un thème/entité a été mentionné
   */
  findRelatedMessages(theme, limit = 3) {
    const indices = this.themesIndex.get(theme) || [];
    return indices
      .slice(-limit)
      .map(idx => this.messageArchive.find(m => m.archivedIndex === idx))
      .filter(Boolean);
  }

  /**
   * Extraire thèmes de façon UNIVERSELLE (pas regex)
   * Utilise heuristique simple + keywords dynamiques
   */
  static extractThemesUniversal(message, previousThemes = []) {
    const themes = [];
    const words = message.toLowerCase().split(/[\s,!?.;:]+/).filter(w => w.length > 3);

    // Nouns/concepts courants (heuristique simple)
    const conceptKeywords = {
      // Catégories
      'nourriture': ['fruit', 'manger', 'cuisine', 'recette', 'plat', 'boisson', 'banane', 'pomme', 'pain'],
      'art': ['peinture', 'dessin', 'couleur', 'tableau', 'artist', 'sculpture', 'musique', 'chanson'],
      'technologie': ['code', 'ordi', 'informatique', 'app', 'logiciel', 'data', 'algorithme', 'programmation'],
      'philosophie': ['sens', 'existence', 'conscience', 'vérité', 'morale', 'éthique', 'pensée'],
      'relation': ['amour', 'amitié', 'famille', 'confiance', 'relation', 'connection', 'humanité'],
      'émotion': ['joie', 'tristesse', 'peur', 'colère', 'amour', 'espoir', 'envie', 'passion'],
      'apprentissage': ['apprendre', 'étudier', 'école', 'connaissance', 'savoir', 'comprendre', 'découvrir'],
      'créativité': ['créer', 'innovation', 'imagination', 'idée', 'nouveau', 'original', 'unique']
    };

    // Matcher les concepts via keywords
    for (const [concept, keywords] of Object.entries(conceptKeywords)) {
      const hasKeyword = keywords.some(kw => message.toLowerCase().includes(kw));
      if (hasKeyword) {
        themes.push({
          theme: concept.toUpperCase(),
          category: 'inferred',
          score: 0.8,
          keywords: keywords.filter(kw => message.toLowerCase().includes(kw))
        });
      }
    }

    // Garder thèmes précédents s'ils sont toujours pertinents
    previousThemes.forEach(prev => {
      if (!themes.find(t => t.theme === prev.theme) && message.length > 50) {
        // Si message est long, assume continuation du thème
        themes.push({ ...prev, score: Math.max(0.5, prev.score - 0.2) });
      }
    });

    return themes.length > 0 ? themes : [{ theme: 'GENERAL', category: 'default', score: 0.5 }];
  }

  /**
   * Détecter si message est une REFERENCE à un sujet antérieur
   * Ex: "Et les bananes?" après avoir parlé de bananes au msg #2
   */
  detectReference(message, activeThemes) {
    const references = [];

    activeThemes.forEach(theme => {
      // Si le thème est mentionné et a un historique
      if (message.toLowerCase().includes(theme.theme.toLowerCase())) {
        const relatedMessages = this.findRelatedMessages(theme.theme, 2);
        if (relatedMessages.length > 0) {
          references.push({
            theme: theme.theme,
            relatedMessages,
            confidence: 0.9
          });
        }
      }
    });

    return references;
  }

  /**
   * Enrichir le prompt avec contexte des messages archivés
   */
  enrichPromptWithArchivedContext(prompt, references) {
    if (references.length === 0) return prompt;

    let enrichedPrompt = prompt;

    references.forEach(ref => {
      const contextBlock = ref.relatedMessages
        .map(msg => `[Msg historique] ${msg.content.slice(0, 150)}...`)
        .join('\n');

      enrichedPrompt += `\n\n[CONTEXTE ARCHIVE - ${ref.theme}]\n${contextBlock}`;
    });

    return enrichedPrompt;
  }

  /**
   * Obtenir snapshot de l'archive
   */
  getArchiveStats() {
    return {
      totalArchived: this.messageArchive.length,
      uniqueThemes: this.themesIndex.size,
      uniqueEntities: this.entityIndex.size,
      themes: Array.from(this.themesIndex.entries()).map(([theme, indices]) => ({
        theme,
        mentionCount: indices.length,
        lastMention: indices[indices.length - 1]
      }))
    };
  }
}

export default ContextRestorer;