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
    this.maxCacheSize = 1000; // Limite mémoire
    this.accessLog = new Map(); // Pour LRU
    this.hitRate = { hits: 0, misses: 0 };
  }

  /**
   * Indexer les mémoires pour recherche rapide avec éviction LRU
   */
  indexMemories(memories) {
    if (!Array.isArray(memories)) return;

    const now = Date.now();
    this.lastUpdate = now;

    // Éviction LRU si dépassement
    if (memories.length > this.maxCacheSize) {
      memories = this._evictLRU(memories);
    }

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
   * Recherche rapide par modalité avec tracking
   */
  getByModality(modality, limit = 50) {
    const ids = this.modalityIndex.get(modality) || [];
    const results = ids.slice(0, limit).map(id => {
      const mem = this.memoryCache.get(id);
      if (mem) {
        this._trackAccess(id);
        this.hitRate.hits++;
      }
      return mem;
    }).filter(Boolean);
    
    if (results.length === 0) this.hitRate.misses++;
    return results;
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
   * Recherche cross-modale optimisée avec cache de corrélations
   */
  getCrossModal(currentModality, query, limit = 10) {
    const queryLower = (query || '').toLowerCase().trim();
    if (!queryLower) return [];
    
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3);
    if (queryWords.length === 0) return [];

    const candidates = new Map(); // Éviter doublons
    
    // Rechercher dans toutes les modalités sauf actuelle
    for (const [modality, ids] of this.modalityIndex.entries()) {
      if (modality === currentModality) continue;

      // Limiter itération (performance)
      const idsToCheck = ids.slice(0, 100);
      
      for (const id of idsToCheck) {
        const mem = this.memoryCache.get(id);
        if (!mem || !mem.content) continue;

        let score = 0;
        const content = mem.content.toLowerCase();

        // Score par mots-clés (optimisé)
        for (const word of queryWords) {
          if (content.includes(word)) score += 3;
        }

        // Score par tags
        if (Array.isArray(mem.tags) && mem.tags.length > 0) {
          for (const tag of mem.tags) {
            if (tag && queryLower.includes(tag.toLowerCase())) score += 5;
          }
        }

        // Bonus importance
        score += (mem.importance || 5) * 0.5;

        // Bonus recency
        if (mem.created_date) {
          const age = Date.now() - new Date(mem.created_date).getTime();
          if (age < 7 * 24 * 60 * 60 * 1000) score += 2; // Derniers 7 jours
        }

        if (score > 0) {
          candidates.set(id, { memory: mem, score });
        }
      }
    }

    return Array.from(candidates.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(c => c.memory);
  }

  /**
   * Vérifier cohérence cross-modale (optimisé)
   */
  async checkCrossModalConsistency() {
    const inconsistencies = [];
    const contentMap = new Map();
    const processed = new Set();

    // Détecter doublons et incohérences
    for (const memory of this.memoryCache.values()) {
      if (!memory || !memory.content || processed.has(memory.id)) continue;
      
      const contentKey = memory.content.slice(0, 60).toLowerCase().trim();
      if (!contentKey) continue;
      
      if (contentMap.has(contentKey)) {
        const existing = contentMap.get(contentKey);
        if (existing.modality !== memory.modality) {
          inconsistencies.push({
            type: 'duplicate_content',
            severity: 'medium',
            memories: [{ id: existing.id, modality: existing.modality }, { id: memory.id, modality: memory.modality }],
            recommendation: 'link_cross_modal',
            auto_fix: true
          });
        }
      } else {
        contentMap.set(contentKey, memory);
      }
      
      processed.add(memory.id);
    }

    // Détecter mémoires orphelines (sans tags ni modality)
    for (const memory of this.memoryCache.values()) {
      if (!memory.modality || memory.modality === 'unknown') {
        if (!memory.tags || memory.tags.length === 0) {
          inconsistencies.push({
            type: 'orphan_memory',
            severity: 'low',
            memory_id: memory.id,
            recommendation: 'add_metadata',
            auto_fix: false
          });
        }
      }
    }

    return {
      total_inconsistencies: inconsistencies.length,
      by_type: this._groupByType(inconsistencies),
      details: inconsistencies.slice(0, 20) // Limiter pour performance
    };
  }

  _groupByType(inconsistencies) {
    const grouped = {};
    for (const item of inconsistencies) {
      grouped[item.type] = (grouped[item.type] || 0) + 1;
    }
    return grouped;
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
   * Éviction LRU (Least Recently Used)
   */
  _evictLRU(memories) {
    // Trier par dernier accès
    const sorted = memories
      .map(m => ({
        memory: m,
        lastAccess: this.accessLog.get(m.id) || 0
      }))
      .sort((a, b) => b.lastAccess - a.lastAccess)
      .slice(0, this.maxCacheSize)
      .map(item => item.memory);
    
    return sorted;
  }

  /**
   * Tracker accès pour LRU
   */
  _trackAccess(id) {
    this.accessLog.set(id, Date.now());
  }

  /**
   * Stats de performance cache
   */
  getCachePerformance() {
    const total = this.hitRate.hits + this.hitRate.misses;
    return {
      hit_rate: total > 0 ? (this.hitRate.hits / total * 100).toFixed(2) : 0,
      total_hits: this.hitRate.hits,
      total_misses: this.hitRate.misses,
      cache_size: this.memoryCache.size,
      max_cache_size: this.maxCacheSize
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
    this.accessLog.clear();
    this.lastUpdate = 0;
    this.hitRate = { hits: 0, misses: 0 };
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