/**
 * API Request Batcher - Optimise les requêtes API par batching
 * Regroupe plusieurs requêtes en une seule pour réduire la latence
 */

import { useCallback, useRef } from 'react';

class BatchQueue {
  constructor(batchFn, delay = 50) {
    this.batchFn = batchFn;
    this.delay = delay;
    this.queue = [];
    this.timeout = null;
  }

  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => this.flush(), this.delay);
    });
  }

  async flush() {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0);
    const requests = batch.map(item => item.request);

    try {
      const results = await this.batchFn(requests);
      
      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach(item => {
        item.reject(error);
      });
    }
  }
}

// Hook pour utiliser le batcher
export function useAPIBatcher(batchFn, delay = 50) {
  const batcherRef = useRef(null);

  if (!batcherRef.current) {
    batcherRef.current = new BatchQueue(batchFn, delay);
  }

  const enqueue = useCallback((request) => {
    return batcherRef.current.add(request);
  }, []);

  return enqueue;
}

// Exemple d'utilisation:
// const batchFetch = useAPIBatcher(async (requests) => {
//   const ids = requests.map(r => r.id);
//   const response = await base44.entities.MyEntity.filter({ id: { $in: ids } });
//   return response;
// });
// 
// const data = await batchFetch({ id: '123' });