/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Centralized Error Logger                                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from '@/api/base44Client';

class ErrorLogger {
  constructor() {
    this.buffer = [];
    this.maxBufferSize = 50;
    this.flushInterval = 10000; // 10s
    this.flushTimer = null;
    this.enabled = true;
  }

  /**
   * Log une erreur avec contexte enrichi et diagnostics avancés
   */
  async log(error, context = {}) {
    if (!this.enabled) return;

    // Diagnostics avancés
    const diagnostics = this._gatherDiagnostics(error, context);

    const errorEntry = {
      message: error.message || 'Unknown error',
      stack: this._sanitizeStack(error.stack || ''),
      severity: this._determineSeverity(error, context),
      category: context.category || 'general',
      component: context.component || 'unknown',
      user_action: context.userAction || '',
      timestamp: new Date().toISOString(),
      browser: navigator.userAgent,
      url: window.location.href,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      memory_usage: diagnostics.memory,
      network_status: diagnostics.network,
      metadata: {
        ...context.metadata,
        error_name: error.name,
        error_code: error.code,
        error_cause: error.cause,
        ...diagnostics.additional
      }
    };

    // Buffer pour batch
    this.buffer.push(errorEntry);

    // Console en dev
    if (import.meta.env.DEV) {
      console.error('[ErrorLogger]', errorEntry);
    }

    // Flush si buffer plein
    if (this.buffer.length >= this.maxBufferSize) {
      await this.flush();
    } else {
      this._scheduleFlush();
    }

    return errorEntry;
  }

  /**
   * Déterminer sévérité automatiquement
   */
  _determineSeverity(error, context) {
    if (context.severity) return context.severity;
    
    // Critiques
    if (error.name === 'SecurityError') return 'critical';
    if (error.message?.includes('quota') || error.message?.includes('memory')) return 'critical';
    
    // Erreurs
    if (error.name === 'TypeError' || error.name === 'ReferenceError') return 'error';
    if (context.category === 'api' && error.status >= 500) return 'error';
    
    // Warnings
    if (context.category === 'api' && error.status >= 400) return 'warning';
    
    return 'info';
  }

  /**
   * Flush buffer vers DB
   */
  async flush() {
    if (this.buffer.length === 0) return;

    const toFlush = [...this.buffer];
    this.buffer = [];

    try {
      // Batch insert
      await base44.entities.ErrorLog.bulkCreate(toFlush);
    } catch (err) {
      console.error('[ErrorLogger] Failed to flush:', err);
      // Réinjecter dans buffer
      this.buffer = [...toFlush, ...this.buffer].slice(0, this.maxBufferSize);
    }

    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Scheduler flush automatique
   */
  _scheduleFlush() {
    if (this.flushTimer) return;
    
    this.flushTimer = setTimeout(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Log performance warning
   */
  logPerformance(operation, duration, threshold = 1000) {
    if (duration > threshold) {
      this.log(new Error(`Slow operation: ${operation}`), {
        severity: 'warning',
        category: 'performance',
        metadata: { duration, threshold, operation }
      });
    }
  }

  /**
   * Sanitize stack trace (remove sensitive info)
   */
  _sanitizeStack(stack) {
    return stack
      .replace(/https?:\/\/[^\s]+/g, '[URL]')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
  }

  /**
   * Gather diagnostics avancés
   */
  _gatherDiagnostics(error, context) {
    const diagnostics = {
      memory: null,
      network: navigator.onLine ? 'online' : 'offline',
      additional: {}
    };

    // Memory stats (si disponible)
    if (performance.memory) {
      diagnostics.memory = {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB',
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
      };
    }

    // Performance timing
    if (window.performance && performance.timing) {
      const timing = performance.timing;
      diagnostics.additional.page_load_time = timing.loadEventEnd - timing.navigationStart;
    }

    // Local storage usage
    try {
      let storageUsed = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          storageUsed += localStorage[key].length + key.length;
        }
      }
      diagnostics.additional.storage_used = Math.round(storageUsed / 1024) + 'KB';
    } catch (e) {
      // Ignore storage access errors
    }

    return diagnostics;
  }

  /**
   * Log avec trace complète de la call stack
   */
  logWithTrace(message, context = {}) {
    const error = new Error(message);
    return this.log(error, { ...context, is_trace: true });
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flush();
  }
}

// Singleton global
let globalLogger = null;

export function getErrorLogger() {
  if (!globalLogger) {
    globalLogger = new ErrorLogger();
    
    // Intercepter erreurs globales
    window.addEventListener('error', (e) => {
      globalLogger.log(e.error, { 
        category: 'uncaught',
        severity: 'error'
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      globalLogger.log(new Error(e.reason), {
        category: 'promise',
        severity: 'error'
      });
    });
  }
  return globalLogger;
}