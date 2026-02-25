/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ CONVERSATION NAVIGATOR - Jump Between Topics & Restore Context            ║
 * ║ Lie MindMap + ContextRestorer pour navigation thématique intelligente     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import ConversationMindMapBuilder from './ConversationMindMapBuilder';
import { ContextRestorer } from './ContextRestorer';

export class ConversationNavigator {
  constructor(mindMap, contextRestorer) {
    this.mindMap = mindMap;
    this.contextRestorer = contextRestorer;
    this.currentTheme = null;
    this.navigationHistory = [];
  }

  /**
   * Sauter à un thème spécifique (début, milieu, fin)
   * Retrouve automatiquement le contexte via ContextRestorer
   */
  jumpToTheme(targetTheme) {
    const targetNode = this.mindMap.nodes.find(n => 
      n.theme.toLowerCase().includes(targetTheme.toLowerCase())
    );

    if (!targetNode) {
      return {
        success: false,
        message: `Thème "${targetTheme}" non trouvé. Thèmes disponibles: ${this.mindMap.nodes.map(n => n.theme).join(', ')}`
      };
    }

    // Retrouver messages associés via ContextRestorer
    const relatedMessages = this.contextRestorer.findRelatedMessages(targetNode.theme, 10);

    this.navigationHistory.push({
      from: this.currentTheme,
      to: targetNode.theme,
      at: Date.now()
    });

    this.currentTheme = targetNode.theme;

    return {
      success: true,
      theme: targetNode.theme,
      depth: targetNode.depth,
      relatedMessages: relatedMessages.map(m => ({
        content: m.content.slice(0, 100),
        index: m.archivedIndex
      })),
      navigationPath: this.getPathTo(targetNode.theme)
    };
  }

  /**
   * Obtenir le chemin thématique vers un thème
   */
  getPathTo(targetTheme) {
    const targetNode = this.mindMap.nodes.find(n => n.theme === targetTheme);
    if (!targetNode) return [];

    const path = [];
    let current = this.mindMap.nodes[0]; // Root
    
    // Tracer le chemin via les transitions
    this.mindMap.timeline.forEach(trans => {
      if (trans.from === current.theme || current.theme === 'GENERAL') {
        path.push({
          theme: trans.from,
          to: trans.to,
          msg: trans.msg
        });
      }
    });

    return path;
  }

  /**
   * Obtenir tous les thèmes disponibles (navigation facile)
   */
  getAvailableThemes() {
    return this.mindMap.nodes.map(n => ({
      theme: n.theme,
      depth: n.depth,
      firstMention: n.messageIndex,
      frequency: n.frequency
    }));
  }

  /**
   * Obtenir contexte complet d'un thème (pour la réponse IA)
   */
  getThemeContext(themeName) {
    const theme = themeName || this.currentTheme;
    const messages = this.contextRestorer.findRelatedMessages(theme, 5);
    const path = this.getPathTo(theme);

    return {
      theme,
      context: messages.map(m => m.content).join('\n\n'),
      path,
      summary: `Thème "${theme}" mentionné ${messages.length}x, explorée en ${this.getDepthLevel(theme)}`
    };
  }

  /**
   * Niveau de profondeur exploratoire
   */
  getDepthLevel(theme) {
    const node = this.mindMap.nodes.find(n => n.theme === theme);
    const levels = { surface: 'surface', intermediate: 'exploration', deep: 'profondeur', meta: 'métaniveau' };
    return levels[node?.depth] || 'inconnu';
  }

  /**
   * Proposer des sauts logiques (thèmes connexes)
   */
  suggestNextJumps() {
    if (!this.currentTheme) return [];

    const currentNode = this.mindMap.nodes.find(n => n.theme === this.currentTheme);
    if (!currentNode) return [];

    // Trouver transitions depuis ce thème
    const nextTransitions = this.mindMap.timeline.filter(t => t.from === this.currentTheme);
    
    return nextTransitions.map(trans => ({
      suggestion: `Continuer vers "${trans.to}" (exploré au msg #${trans.msg})`,
      theme: trans.to,
      depth: this.mindMap.nodes.find(n => n.theme === trans.to)?.depth || 'unknown'
    })).slice(0, 3);
  }

  /**
   * Affichage de la position actuelle dans la carte
   */
  getCurrentPosition() {
    return {
      currentTheme: this.currentTheme,
      allThemes: this.mindMap.nodes.length,
      conversationDepth: Math.max(...this.mindMap.nodes.map(n => ({
        surface: 0, intermediate: 1, deep: 2, meta: 3
      }[n.depth] || 0))),
      navigationHistory: this.navigationHistory.slice(-5) // Derniers 5 sauts
    };
  }

  /**
   * Générer une "carte de navigation" lisible
   */
  generateNavigationMap() {
    let map = '╔════════════════════════════════════════╗\n';
    map += '║  NAVIGATION CONVERSATIONNELLE           ║\n';
    map += '╚════════════════════════════════════════╝\n\n';

    map += 'THÈMES DISPONIBLES:\n';
    this.mindMap.nodes.forEach((node, idx) => {
      const marker = node.theme === this.currentTheme ? '▶' : '○';
      map += `${marker} [${idx + 1}] ${node.theme} (${node.depth})\n`;
    });

    map += '\nDERNIÈRS SAUTS:\n';
    this.navigationHistory.slice(-3).forEach(nav => {
      map += `  ${nav.from || 'Début'} → ${nav.to}\n`;
    });

    return map;
  }
}

export default ConversationNavigator;