/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Memory Cache Manager (Optimized)                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Gestion optimisée du cache mémoire avec indexation                        ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export class MemoryCacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.modalityIndex = new Map();
    this.tagIndex = new Map();
    this.importanceIndex = new Map();
    this.lastUpdate = 0;
    this.cacheTimeout = 30000; // 30s
  }

  /**
   * Indexer les mémoires pour recherche rapide
   */
  indexMemories(memories) {
    if (!Array.isArray(memories)) return;

    const now = Date.now();
    this.lastUpdate = now;

    // Clear indices
    this.modalityIndex.clear();
    this.tagIndex.clear();
    this.importanceIndex.clear();
    this.memoryCache.clear();

    memories.forEach(memory => {
      if (!memory || !memory.id) return;

      // Cache principal
      this.memoryCache.set(memory.id, { ...memory, cached_at: now });

      // Index par modalité
      const modality = memory.modality || 'unknown';
      if (!this.modalityIndex.has(modality)) {
        this.modalityIndex.set(modality, []);
      }
      this.modalityIndex.get(modality).push(memory.id);

      // Index par tags
      if (Array.isArray(memory.tags)) {
        memory.tags.forEach(tag => {
          if (!tag) return;
          if (!this.tagIndex.has(tag)) {
            this.tagIndex.set(tag, []);
          }
          this.tagIndex.get(tag).push(memory.id);
        });
      }

      // Index par importance (buckets)
      const importanceBucket = Math.floor((memory.importance || 5) / 2) * 2;
      if (!this.importanceIndex.has(importanceBucket)) {
        this.importanceIndex.set(importanceBucket, []);
      }
      this.importanceIndex.get(importanceBucket).push(memory.id);
    });
  }

  /**
   * Recherche rapide par modalité
   */
  getByModality(modality, limit = 50) {
    const ids = this.modalityIndex.get(modality) || [];
    return ids.slice(0, limit).map(id => this.memoryCache.get(id)).filter(Boolean);
  }

  /**
   * Recherche rapide par tags
   */
  getByTags(tags, limit = 50) {
    if (!Array.isArray(tags) || tags.length === 0) return [];

    const matchingSets = tags.map(tag => new Set(this.tagIndex.get(tag) || []));
    const intersection = matchingSets.reduce((acc, set) => {
      return new Set([...acc].filter(id => set.has(id)));
    });

    return Array.from(intersection)
      .slice(0, limit)
      .map(id => this.memoryCache.get(id))
      .filter(Boolean);
  }

  /**
   * Recherche rapide par importance
   */
  getByImportance(minImportance, limit = 50) {
    const relevantBuckets = [];
    for (let bucket = Math.floor(minImportance / 2) * 2; bucket <= 10; bucket += 2) {
      if (this.importanceIndex.has(bucket)) {
        relevantBuckets.push(...this.importanceIndex.get(bucket));
      }
    }

    return relevantBuckets
      .slice(0, limit)
      .map(id => this.memoryCache.get(id))
      .filter(mem => mem && mem.importance >= minImportance)
      .sort((a, b) => b.importance - a.importance);
  }

  /**
   * Recherche cross-modale optimisée
   */
  getCrossModal(currentModality, query, limit = 10) {
    const queryLower = (query || '').toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3);

    const candidates = [];
    
    // Rechercher dans toutes les modalités sauf actuelle
    for (const [modality, ids] of this.modalityIndex.entries()) {
      if (modality === currentModality) continue;

      ids.forEach(id => {
        const mem = this.memoryCache.get(id);
        if (!mem) return;

        let score = 0;
        const content = (mem.content || '').toLowerCase();

        // Score par mots-clés
        queryWords.forEach(word => {
          if (content.includes(word)) score += 3;
        });

        // Score par tags
        if (Array.isArray(mem.tags)) {
          mem.tags.forEach(tag => {
            if (queryLower.includes(tag.toLowerCase())) score += 5;
          });
        }

        // Bonus importance
        score += (mem.importance || 0) * 0.5;

        if (score > 0) {
          candidates.push({ memory: mem, score });
        }
      });
    }

    return candidates
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(c => c.memory);
  }

  /**
   * Vérifier cohérence cross-modale
   */
  checkCrossModalConsistency() {
    const inconsistencies = [];
    const contentMap = new Map();

    // Détecter doublons de contenu entre modalités
    for (const memory of this.memoryCache.values()) {
      const contentKey = (memory.content || '').slice(0, 50).toLowerCase().trim();
      
      if (contentMap.has(contentKey)) {
        const existing = contentMap.get(contentKey);
        if (existing.modality !== memory.modality) {
          inconsistencies.push({
            type: 'duplicate_content',
            memories: [existing, memory],
            recommendation: 'merge_or_link'
          });
        }
      } else {
        contentMap.set(contentKey, memory);
      }
    }

    return inconsistencies;
  }

  /**
   * Vérifier si cache valide
   */
  isValid() {
    return this.lastUpdate > 0 && (Date.now() - this.lastUpdate) < this.cacheTimeout;
  }

  /**
   * Obtenir stats
   */
  getStats() {
    return {
      total_memories: this.memoryCache.size,
      modalities: this.modalityIndex.size,
      unique_tags: this.tagIndex.size,
      importance_buckets: this.importanceIndex.size,
      last_update: this.lastUpdate,
      is_valid: this.isValid()
    };
  }

  /**
   * Cleanup
   */
  clear() {
    this.memoryCache.clear();
    this.modalityIndex.clear();
    this.tagIndex.clear();
    this.importanceIndex.clear();
    this.lastUpdate = 0;
  }
}

// Singleton global
let globalCacheManager = null;

export function getMemoryCacheManager() {
  if (!globalCacheManager) {
    globalCacheManager = new MemoryCacheManager();
  }
  return globalCacheManager;
}