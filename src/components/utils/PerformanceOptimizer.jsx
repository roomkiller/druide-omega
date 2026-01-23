/**
 * Performance Optimizer
 * Gère optimisation images, cache, lazy loading, et metrics API
 */

import React, { useEffect, useState } from "react";

export class ImageOptimizer {
  static compress(file, quality = 0.8) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => resolve(blob),
          "image/webp",
          quality
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  static generateResponsiveVariants(imagePath) {
    const ext = imagePath.split(".").pop();
    const base = imagePath.replace(`.${ext}`, "");

    return {
      srcset: {
        "320w": `${base}-320w.${ext}`,
        "640w": `${base}-640w.${ext}`,
        "1280w": `${base}-1280w.${ext}`,
      },
      sizes: "(max-width: 640px) 100vw, 50vw",
    };
  }

  static getOptimalFormat(file) {
    if (file.type === "image/webp") return "webp";
    if (file.type === "image/jpeg") return "jpg";
    if (file.type === "image/png") return "png";
    return "jpg"; // fallback
  }
}

export class CacheManager {
  constructor(ttlSeconds = 300) {
    this.cache = new Map();
    this.ttl = ttlSeconds;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = (Date.now() - entry.timestamp) / 1000;
    if (age > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  clear() {
    this.cache.clear();
  }

  getStats() {
    return {
      entries: this.cache.size,
      memory_estimate_kb: (this.cache.size * 10),
    };
  }
}

export class APIMetrics {
  static track(endpoint, startTime) {
    const duration = Date.now() - startTime;
    const metrics = {
      endpoint,
      duration_ms: duration,
      timestamp: new Date().toISOString(),
    };

    // Store in IndexedDB pour persistence
    if (window.indexedDB) {
      const request = indexedDB.open("APIMetrics", 1);
      request.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction("metrics", "readwrite");
        tx.objectStore("metrics").add(metrics);
      };
    }

    return metrics;
  }

  static getSlowEndpoints() {
    return {
      audit: 500, // ms
      export: 3000,
      "detailed-report": 2000,
    };
  }
}

export const globalCache = new CacheManager(300);

export function useOptimizedFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeout || 10000);

    const fetchData = async () => {
      try {
        // Check cache first
        const cached = globalCache.get(url);
        if (cached) {
          setData(cached);
          setLoading(false);
          return;
        }

        const startTime = Date.now();
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`API ${response.status}`);

        const result = await response.json();
        globalCache.set(url, result);

        // Track metrics
        APIMetrics.track(url, startTime);

        setData(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [url, options.timeout]);

  return { data, loading, error };
}

export function useLazyComponent(importFn) {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const module = await importFn();
      setComponent(() => module.default);
    } catch (err) {
      console.error("Lazy load error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { Component, loading, load };
}

export default class PerformanceMonitor {
  static initPerformanceAPI() {
    if (!window.PerformanceObserver) return;

    // Monitor Largest Contentful Paint
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log("LCP:", lastEntry.renderTime || lastEntry.loadTime);
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {}

    // Monitor First Input Delay
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log("FID:", entry.processingDuration);
        });
      });
      observer.observe({ entryTypes: ["first-input"] });
    } catch (e) {}

    // Monitor Cumulative Layout Shift
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log("CLS:", clsValue);
          }
        });
      });
      observer.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {}
  }

  static getPageMetrics() {
    const navigation = performance.getEntriesByType("navigation")[0];
    return {
      dns_ms: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp_ms: navigation.connectEnd - navigation.connectStart,
      ttfb_ms: navigation.responseStart - navigation.requestStart,
      dom_interactive_ms: navigation.domInteractive - navigation.fetchStart,
      dom_complete_ms: navigation.domComplete - navigation.fetchStart,
      load_complete_ms: navigation.loadEventEnd - navigation.fetchStart,
    };
  }

  static enableResourceTiming() {
    performance.setResourceTimingBufferSize(500);
  }
}