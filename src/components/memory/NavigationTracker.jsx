/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Navigation & Context Tracker                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class NavigationTracker {
  static navigationHistory = [];
  static currentContext = {};

  static trackNavigation(page, metadata = {}) {
    const entry = {
      page,
      metadata,
      timestamp: new Date().toISOString(),
      duration: 0
    };

    this.navigationHistory.push(entry);
    this.currentContext = { page, metadata };

    if (this.navigationHistory.length > 1) {
      const previous = this.navigationHistory[this.navigationHistory.length - 2];
      const duration = Date.now() - new Date(previous.timestamp).getTime();
      previous.duration = duration;
    }

    if (this.navigationHistory.length > 50) {
      this.navigationHistory = this.navigationHistory.slice(-50);
    }

    this.persistNavigation();
  }

  static async persistNavigation() {
    try {
      const existing = await base44.entities.Memory.filter({
        memory_type: "navigation_history"
      });

      const data = {
        memory_type: "navigation_history",
        content: "Historique de navigation utilisateur",
        importance: 4,
        tags: ["navigation", "context"],
        context: {
          history: this.navigationHistory,
          current: this.currentContext,
          patterns: this.analyzePatterns()
        }
      };

      if (existing.length > 0) {
        await base44.entities.Memory.update(existing[0].id, data);
      } else {
        await base44.entities.Memory.create(data);
      }
    } catch (error) {
      console.error("Erreur persist navigation:", error);
    }
  }

  static analyzePatterns() {
    const pages = this.navigationHistory.map(h => h.page);
    const frequency = {};
    
    pages.forEach(page => {
      frequency[page] = (frequency[page] || 0) + 1;
    });

    const sequences = [];
    for (let i = 0; i < pages.length - 1; i++) {
      const seq = `${pages[i]}->${pages[i + 1]}`;
      sequences.push(seq);
    }

    const seqFreq = {};
    sequences.forEach(seq => {
      seqFreq[seq] = (seqFreq[seq] || 0) + 1;
    });

    return {
      page_frequency: frequency,
      sequence_frequency: seqFreq,
      most_visited: Object.entries(frequency).sort((a, b) => b[1] - a[1])[0]?.[0],
      session_length: this.navigationHistory.length
    };
  }

  static getContextualRelevance(memory, currentPage) {
    let relevance = 0;

    if (memory.tags?.includes(currentPage.toLowerCase())) {
      relevance += 0.3;
    }

    const patterns = this.analyzePatterns();
    const memoryContext = memory.context?.page || memory.context?.source;
    
    if (memoryContext && patterns.page_frequency[memoryContext]) {
      relevance += 0.2 * (patterns.page_frequency[memoryContext] / this.navigationHistory.length);
    }

    const recentPages = this.navigationHistory.slice(-5).map(h => h.page);
    if (memory.tags?.some(tag => recentPages.includes(tag))) {
      relevance += 0.2;
    }

    return Math.min(relevance, 1);
  }
}