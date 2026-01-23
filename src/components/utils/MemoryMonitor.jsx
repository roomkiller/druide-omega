/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Memory Monitor & Leak Detector                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { getErrorLogger } from '@/components/system/ErrorLogger';
import { getMemoryPool } from '@/components/memory/MemoryPool';

/**
 * Moniteur de mémoire et détecteur de fuites
 */
export class MemoryMonitor {
  constructor() {
    this.logger = getErrorLogger();
    this.snapshots = [];
    this.alertThreshold = 0.9; // 90% utilisation
    this.monitorInterval = null;
  }

  /**
   * Démarrer monitoring
   */
  start(intervalMs = 60000) {
    this.monitorInterval = setInterval(() => {
      this.checkMemory();
    }, intervalMs);
  }

  /**
   * Check mémoire et alerter si nécessaire
   */
  checkMemory() {
    if (!performance.memory) {
      console.warn('[MemoryMonitor] performance.memory not available');
      return;
    }

    const snapshot = {
      timestamp: Date.now(),
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
      utilization: performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit
    };

    this.snapshots.push(snapshot);

    // Garder dernières 10 minutes
    if (this.snapshots.length > 10) {
      this.snapshots.shift();
    }

    // Alerter si seuil dépassé
    if (snapshot.utilization > this.alertThreshold) {
      this.logger.log(new Error('High memory usage detected'), {
        category: 'memory',
        severity: 'warning',
        metadata: {
          used_mb: Math.round(snapshot.used / 1024 / 1024),
          limit_mb: Math.round(snapshot.limit / 1024 / 1024),
          utilization: (snapshot.utilization * 100).toFixed(2) + '%'
        }
      });

      // Forcer GC du pool
      const pool = getMemoryPool();
      pool.garbageCollect();
    }

    // Détecter fuite (croissance continue)
    this.detectLeak();
  }

  /**
   * Détection de fuite mémoire
   */
  detectLeak() {
    if (this.snapshots.length < 5) return;

    // Analyser tendance sur 5 derniers snapshots
    const recent = this.snapshots.slice(-5);
    const growthRates = [];

    for (let i = 1; i < recent.length; i++) {
      const growth = (recent[i].used - recent[i-1].used) / recent[i-1].used;
      growthRates.push(growth);
    }

    const avgGrowth = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;

    // Si croissance constante > 5% par minute
    if (avgGrowth > 0.05) {
      this.logger.log(new Error('Potential memory leak detected'), {
        category: 'memory',
        severity: 'critical',
        metadata: {
          avg_growth_rate: (avgGrowth * 100).toFixed(2) + '%',
          snapshots: recent.length
        }
      });
    }
  }

  /**
   * Stats mémoire
   */
  getStats() {
    if (!performance.memory) return null;

    const pool = getMemoryPool();
    
    return {
      heap: {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB',
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + 'MB',
        utilization: ((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100).toFixed(2) + '%'
      },
      pool: pool.getStats(),
      snapshots_count: this.snapshots.length
    };
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
  }
}

// Singleton
let globalMonitor = null;

export function getMemoryMonitor() {
  if (!globalMonitor) {
    globalMonitor = new MemoryMonitor();
    globalMonitor.start();
  }
  return globalMonitor;
}