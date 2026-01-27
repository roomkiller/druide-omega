/**
 * LLM Relay Transition - Gestion intelligente du basculement entre LLMs
 * Détecte timeouts/erreurs + bascule automatique vers meilleur provider
 */

export class LLMRelayTransition {
  static providers = {
    deepseek: { name: 'deepseek', timeout: 15000, priority: 1, healthy: true, failCount: 0 },
    base44: { name: 'base44', timeout: 20000, priority: 2, healthy: true, failCount: 0 }
  };

  static responseCache = new Map(); // { key: { result, timestamp, ttl } }
  static cacheTTL = 300000; // 5 minutes

  /**
   * Obtient le provider optimal basé sur santé et performance
   */
  static getOptimalProvider() {
    const healthyProviders = Object.values(this.providers)
      .filter(p => p.healthy)
      .sort((a, b) => a.priority - b.priority);

    return healthyProviders.length > 0 
      ? healthyProviders[0] 
      : this.providers.base44; // Fallback ultime
  }

  /**
   * Crée une clé de cache unique pour une requête
   */
  static getCacheKey(prompt, schema) {
    return `${prompt.slice(0, 100)}-${JSON.stringify(schema || {}).slice(0, 50)}`;
  }

  /**
   * Récupère du cache si valide
   */
  static getFromCache(cacheKey) {
    const cached = this.responseCache.get(cacheKey);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > cached.ttl) {
      this.responseCache.delete(cacheKey);
      return null;
    }

    console.log(`[LLMRelay] Cache hit (${(age / 1000).toFixed(1)}s old)`);
    return cached.result;
  }

  /**
   * Sauvegarde dans le cache
   */
  static setCache(cacheKey, result) {
    this.responseCache.set(cacheKey, {
      result,
      timestamp: Date.now(),
      ttl: this.cacheTTL
    });
  }

  /**
   * Enveloppe une requête avec timeout + tracking
   */
  static createTimeoutPromise(promise, timeoutMs, providerName) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`${providerName} timeout après ${timeoutMs}ms`)),
          timeoutMs
        )
      )
    ]);
  }

  /**
   * Orchestre l'invocation avec relais de transition
   */
  static async invokeWithRelay(callFn, prompt, options = {}) {
    const cacheKey = this.getCacheKey(prompt, options.schema);
    
    // Vérifier cache d'abord
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const providers = [this.getOptimalProvider()];
    
    // Ajouter fallbacks
    if (this.getOptimalProvider().name === 'deepseek') {
      providers.push(this.providers.base44);
    } else {
      providers.push(this.providers.deepseek);
    }

    let lastError = null;

    for (const provider of providers) {
      try {
        console.log(`[LLMRelay] Tentative avec ${provider.name}`);
        
        const startTime = Date.now();
        const result = await this.createTimeoutPromise(
          callFn(provider.name),
          provider.timeout,
          provider.name
        );
        
        const duration = Date.now() - startTime;
        console.log(`[LLMRelay] ✓ ${provider.name} réussi en ${duration}ms`);

        // Réinitialiser compteur de fails
        provider.failCount = 0;
        provider.healthy = true;

        // Mettre en cache
        this.setCache(cacheKey, result);
        return result;

      } catch (error) {
        lastError = error;
        console.warn(`[LLMRelay] ✗ ${provider.name} échoué:`, error.message);
        
        // Incrémenter compteur fails
        provider.failCount++;
        
        // Marquer unhealthy après 2 fails consécutifs
        if (provider.failCount >= 2) {
          provider.healthy = false;
          console.warn(`[LLMRelay] ${provider.name} marqué unhealthy (${provider.failCount} fails)`);
        }

        // Si pas dernier provider, continuer
        if (provider !== providers[providers.length - 1]) {
          await new Promise(r => setTimeout(r, 300)); // Délai avant retry
          continue;
        }
      }
    }

    // Tous les providers ont échoué
    throw lastError || new Error('Tous les LLM providers ont échoué');
  }

  /**
   * Réinitialise la santé d'un provider (utile après maintenance)
   */
  static resetProvider(providerName) {
    const provider = this.providers[providerName];
    if (provider) {
      provider.healthy = true;
      provider.failCount = 0;
      console.log(`[LLMRelay] ${providerName} réinitialisé`);
    }
  }

  /**
   * Vide le cache
   */
  static clearCache() {
    this.responseCache.clear();
    console.log('[LLMRelay] Cache vidé');
  }

  /**
   * Statut actuel des providers
   */
  static getStatus() {
    return Object.entries(this.providers).reduce((acc, [key, p]) => ({
      ...acc,
      [key]: {
        healthy: p.healthy,
        failCount: p.failCount,
        timeout: p.timeout,
        priority: p.priority
      }
    }), {});
  }
}