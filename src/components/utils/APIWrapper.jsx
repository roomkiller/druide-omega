/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - API Wrapper with Retry & Timeout                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { getErrorLogger } from '@/components/system/ErrorLogger';

/**
 * Wrapper pour appels API avec retry, timeout et logging
 */
export async function apiCall(fn, options = {}) {
  const {
    retries = 3,
    timeout = 30000,
    retryDelay = 1000,
    exponentialBackoff = true,
    context = {}
  } = options;

  const logger = getErrorLogger();
  const startTime = Date.now();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Timeout wrapper
      const result = await Promise.race([
        fn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
      ]);

      // Log performance si lent
      const duration = Date.now() - startTime;
      logger.logPerformance(context.operation || 'api_call', duration);

      return result;
    } catch (error) {
      const isLastAttempt = attempt === retries;
      
      // Log erreur
      await logger.log(error, {
        category: 'api',
        component: context.component,
        severity: isLastAttempt ? 'error' : 'warning',
        metadata: {
          attempt: attempt + 1,
          total_attempts: retries + 1,
          ...context
        }
      });

      if (isLastAttempt) throw error;

      // Attendre avant retry
      const delay = exponentialBackoff 
        ? retryDelay * Math.pow(2, attempt)
        : retryDelay;
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Batch d'appels API avec concurrence limitée
 */
export async function batchApiCalls(calls, maxConcurrency = 3) {
  const results = [];
  const executing = [];

  for (const call of calls) {
    const promise = apiCall(call.fn, call.options).then(result => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });

    results.push(promise);
    executing.push(promise);

    if (executing.length >= maxConcurrency) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}