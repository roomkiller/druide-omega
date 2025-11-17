/**
 * Système de cache quantique pour données
 */

class QuantumDataCache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl; // 5 minutes par défaut
    this.accessCount = new Map();
  }

  /**
   * Générer clé de cache
   */
  generateKey(prefix, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|');
    return `${prefix}:${sortedParams}`;
  }

  /**
   * Récupérer depuis cache
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;

    // Vérifier expiration
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      this.accessCount.delete(key);
      return null;
    }

    // Incrémenter compteur d'accès
    this.accessCount.set(key, (this.accessCount.get(key) || 0) + 1);

    return item.data;
  }

  /**
   * Stocker dans cache
   */
  set(key, data) {
    // Nettoyer cache si plein (LRU)
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    this.accessCount.set(key, 1);
  }

  /**
   * Éviction LRU (Least Recently Used)
   */
  evictLeastUsed() {
    let leastUsedKey = null;
    let leastUsedCount = Infinity;

    for (const [key, count] of this.accessCount.entries()) {
      if (count < leastUsedCount) {
        leastUsedCount = count;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
      this.accessCount.delete(leastUsedKey);
    }
  }

  /**
   * Invalider cache par pattern
   */
  invalidate(pattern) {
    const keysToDelete = [];
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.accessCount.delete(key);
    });
  }

  /**
   * Clear tout
   */
  clear() {
    this.cache.clear();
    this.accessCount.clear();
  }

  /**
   * Stats
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate()
    };
  }

  calculateHitRate() {
    if (this.accessCount.size === 0) return 0;
    
    const totalAccess = Array.from(this.accessCount.values()).reduce((a, b) => a + b, 0);
    return ((this.cache.size / totalAccess) * 100).toFixed(2);
  }
}

// Instance globale
export const quantumCache = new QuantumDataCache();

/**
 * Hook pour utiliser le cache
 */
export function useCachedData(key, fetchFunc, options = {}) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadData = async () => {
      // Check cache
      const cached = quantumCache.get(key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      // Fetch fresh data
      try {
        const freshData = await fetchFunc();
        quantumCache.set(key, freshData);
        setData(freshData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key]);

  return { data, loading, error };
}

export default QuantumDataCache;