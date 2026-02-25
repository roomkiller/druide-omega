/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ CONVERSATION MIND MAP BUILDER - Ultra-Light Backend Flow Tracking         ║
 * ║ Génère une carte mentale ASCII minimaliste du flux conversationnel        ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export class ConversationMindMapBuilder {
  constructor() {
    this.nodes = [];        // Nœuds thématiques
    this.edges = [];        // Connexions entre nœuds
    this.timeline = [];     // Chronologie des transitions
  }

  /**
   * Ajouter un nœud thématique
   */
  addNode(theme, messageIndex, emotional_tone = 'neutral') {
    const nodeId = `node_${this.nodes.length}`;
    this.nodes.push({
      id: nodeId,
      theme: theme.toUpperCase().slice(0, 20),
      messageIndex,
      tone: emotional_tone,
      frequency: 1,
      depth: this.calculateDepth(messageIndex)
    });
    return nodeId;
  }

  /**
   * Connecter deux thèmes (transition)
   */
  addTransition(fromTheme, toTheme, messageIndex) {
    const fromNode = this.nodes.find(n => n.theme === fromTheme.toUpperCase().slice(0, 20));
    const toNode = this.nodes.find(n => n.theme === toTheme.toUpperCase().slice(0, 20));

    if (fromNode && toNode) {
      this.edges.push({
        from: fromNode.id,
        to: toNode.id,
        atMessage: messageIndex,
        strength: 1
      });
      this.timeline.push({ from: fromTheme, to: toTheme, msg: messageIndex });
    }
  }

  /**
   * Calculer profondeur basée sur index du message
   */
  calculateDepth(messageIndex) {
    if (messageIndex < 5) return 'surface';
    if (messageIndex < 15) return 'intermediate';
    if (messageIndex < 30) return 'deep';
    return 'meta';
  }

  /**
   * Générer carte mentale ASCII minimaliste
   */
  generateASCIMindMap() {
    if (this.nodes.length === 0) return '(Aucun thème détecté)';

    let map = '';
    const rootNode = this.nodes[0];

    // Centre
    map += `                    [${rootNode.theme}]\n`;
    map += `                         |\n`;

    // Branches principales
    const branches = this.nodes.slice(1, 5);
    branches.forEach((node, idx) => {
      const connector = idx < branches.length - 1 ? '├─' : '└─';
      const depth_icon = {
        'surface': '●',
        'intermediate': '◐',
        'deep': '◑',
        'meta': '◒'
      }[node.depth] || '●';

      map += `                    ${connector}[${depth_icon} ${node.theme}]\n`;
    });

    return map;
  }

  /**
   * Générer timeline textuelle des transitions
   */
  generateTimeline() {
    if (this.timeline.length === 0) return '(Aucune transition)';

    let timeline = 'FLUX CONVERSATIONNEL:\n';
    this.timeline.forEach((trans, idx) => {
      timeline += `${idx + 1}. "${trans.from}" → "${trans.to}" (msg #${trans.msg})\n`;
    });
    return timeline;
  }

  /**
   * Représentation structurée JSON légère
   */
  toJSON() {
    return {
      nodes: this.nodes.map(n => ({
        theme: n.theme,
        depth: n.depth,
        freq: n.frequency
      })),
      transitions: this.timeline.map(t => ({
        from: t.from.slice(0, 15),
        to: t.to.slice(0, 15),
        msg: t.msg
      })),
      stats: {
        uniqueThemes: this.nodes.length,
        transitions: this.timeline.length,
        deepestPhase: Math.max(...this.nodes.map(n => ({
          surface: 0, intermediate: 1, deep: 2, meta: 3
        }[n.depth] || 0)))
      }
    };
  }

  /**
   * Affichage formaté pour logging/debugging
   */
  toString() {
    return `
╔════════════════════════════════════════╗
║    CONVERSATION MIND MAP              ║
╚════════════════════════════════════════╝

${this.generateASCIMindMap()}

${this.generateTimeline()}

STATISTIQUES:
- Thèmes uniques: ${this.nodes.length}
- Transitions détectées: ${this.timeline.length}
- Profondeur max: ${Math.max(...this.nodes.map(n => ({surface: 0, intermediate: 1, deep: 2, meta: 3}[n.depth] || 0)))}
    `;
  }
}

export default ConversationMindMapBuilder;