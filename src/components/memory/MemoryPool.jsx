/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Memory Pool for Cross-Modal Operations                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { getErrorLogger } from '@/components/system/ErrorLogger';

/**
 * Pool de mémoire pour opérations cross-modales
 * Gère allocation/libération efficace, évite memory leaks
 */
export class MemoryPool {
  constructor(options = {}) {
    this.maxPoolSize = options.maxPoolSize || 100 * 1024 * 1024; // 100MB
    this.pools = new Map();
    this.allocated = 0;
    this.logger = getErrorLogger();
    this.gcInterval = null;
  }

  /**
   * Initialiser pool avec GC automatique
   */
  initialize() {
    // GC toutes les 30s
    this.gcInterval = setInterval(() => {
      this.garbageCollect();
    }, 30000);
  }

  /**
   * Allouer mémoire pour une opération
   */
  allocate(operationId, data, metadata = {}) {
    const size = this._estimateSize(data);
    
    // Vérifier limite
    if (this.allocated + size > this.maxPoolSize) {
      this.garbageCollect();
      
      if (this.allocated + size > this.maxPoolSize) {
        this.logger.log(new Error('Memory pool exhausted'), {
          category: 'memory',
          severity: 'critical',
          metadata: { allocated: this.allocated, requested: size }
        });
        throw new Error('Memory pool full');
      }
    }

    // Allouer
    this.pools.set(operationId, {
      data,
      size,
      allocated_at: Date.now(),
      last_access: Date.now(),
      metadata
    });

    this.allocated += size;
    return operationId;
  }

  /**
   * Récupérer données allouées
   */
  get(operationId) {
    const entry = this.pools.get(operationId);
    if (!entry) return null;
    
    entry.last_access = Date.now();
    return entry.data;
  }

  /**
   * Libérer mémoire explicitement
   */
  free(operationId) {
    const entry = this.pools.get(operationId);
    if (!entry) return false;
    
    this.allocated -= entry.size;
    this.pools.delete(operationId);
    
    // Nullifier données pour GC natif
    entry.data = null;
    
    return true;
  }

  /**
   * Garbage Collection - supprime entrées expirées
   */
  garbageCollect() {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 min
    let collected = 0;

    for (const [id, entry] of this.pools.entries()) {
      const age = now - entry.last_access;
      
      if (age > maxAge) {
        this.allocated -= entry.size;
        this.pools.delete(id);
        entry.data = null;
        collected++;
      }
    }

    if (collected > 0) {
      console.log(`[MemoryPool] GC collected ${collected} entries, freed ${this._formatSize(this.allocated)}`);
    }
  }

  /**
   * Estimer taille données (approximatif)
   */
  _estimateSize(data) {
    if (!data) return 0;
    
    const json = JSON.stringify(data);
    return json.length * 2; // UTF-16 = 2 bytes par char
  }

  /**
   * Formater taille lisible
   */
  _formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  /**
   * Stats pool
   */
  getStats() {
    return {
      total_entries: this.pools.size,
      allocated_bytes: this.allocated,
      allocated_formatted: this._formatSize(this.allocated),
      max_pool_size: this._formatSize(this.maxPoolSize),
      utilization: ((this.allocated / this.maxPoolSize) * 100).toFixed(2) + '%'
    };
  }

  /**
   * Cleanup complet
   */
  destroy() {
    if (this.gcInterval) {
      clearInterval(this.gcInterval);
    }
    
    this.pools.clear();
    this.allocated = 0;
  }
}

// Singleton global
let globalPool = null;

export function getMemoryPool() {
  if (!globalPool) {
    globalPool = new MemoryPool();
    globalPool.initialize();
  }
  return globalPool;
}