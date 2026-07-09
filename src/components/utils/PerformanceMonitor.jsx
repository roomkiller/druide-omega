/**
 * Moniteur de performance quantique
 */

import { useEffect, useRef } from "react";

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoads: [],
      apiCalls: [],
      renders: [],
      interactions: []
    };
  }

  /**
   * Mesurer temps de chargement page
   */
  measurePageLoad(pageName) {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.metrics.pageLoads.push({
        page: pageName,
        duration,
        timestamp: Date.now()
      });

      // Console en dev mode
      if (import.meta.env.DEV) {
        console.log(`📊 [QUANTUM] ${pageName} loaded in ${duration.toFixed(2)}ms`);
      }

      // Alert si trop lent (>2s)
      if (duration > 2000) {
        console.warn(`⚠️ Slow page load: ${pageName} (${duration.toFixed(2)}ms)`);
      }
    };
  }

  /**
   * Mesurer API call
   */
  measureApiCall(endpoint) {
    const startTime = performance.now();

    return (status = 'success') => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.metrics.apiCalls.push({
        endpoint,
        duration,
        status,
        timestamp: Date.now()
      });

      if (duration > 1000) {
        console.warn(`⚠️ Slow API call: ${endpoint} (${duration.toFixed(2)}ms)`);
      }
    };
  }

  /**
   * Mesurer render component
   */
  measureRender(componentName) {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.metrics.renders.push({
        component: componentName,
        duration,
        timestamp: Date.now()
      });

      if (duration > 100) {
        console.warn(`⚠️ Slow render: ${componentName} (${duration.toFixed(2)}ms)`);
      }
    };
  }

  /**
   * Stats
   */
  getStats() {
    return {
      avgPageLoad: this.calculateAverage(this.metrics.pageLoads, 'duration'),
      avgApiCall: this.calculateAverage(this.metrics.apiCalls, 'duration'),
      avgRender: this.calculateAverage(this.metrics.renders, 'duration'),
      totalMetrics: Object.values(this.metrics).reduce((sum, arr) => sum + arr.length, 0)
    };
  }

  calculateAverage(arr, key) {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((total, item) => total + item[key], 0);
    return (sum / arr.length).toFixed(2);
  }

  /**
   * Clear metrics
   */
  clear() {
    this.metrics = {
      pageLoads: [],
      apiCalls: [],
      renders: [],
      interactions: []
    };
  }
}

export const perfMonitor = new PerformanceMonitor();

/**
 * Hook pour mesurer performance component
 */
export function usePerformanceMonitor(componentName) {
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderCountRef.current++;
    const endMeasure = perfMonitor.measureRender(componentName);

    return () => {
      endMeasure();
    };
  });

  return renderCountRef.current;
}

/**
 * HOC pour monitorer component
 */
export function withPerformanceMonitor(Component, componentName) {
  return function MonitoredComponent(props) {
    usePerformanceMonitor(componentName || Component.name);
    return <Component {...props} />;
  };
}

export default PerformanceMonitor;