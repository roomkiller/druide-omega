/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Quantum Lazy Loader (Ultra-Fast Loading)                   ║
 * ║ Lazy loading optimisé avec preloading intelligent                         ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Zap } from "lucide-react";

/**
 * Cache des composants chargés
 */
const componentCache = new Map();

/**
 * Skeleton Loader universel
 */
export function QuantumSkeleton({ type = "page" }) {
  const skeletons = {
    page: (
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
        <div className="h-20 bg-white/90 animate-pulse border-b border-slate-200" />
        <div className="flex-1 p-6 space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white/60 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    ),
    card: (
      <div className="p-6 bg-white rounded-xl animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
        </div>
      </div>
    ),
    list: (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl animate-pulse">
            <div className="w-12 h-12 bg-slate-200 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-3 bg-slate-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      {skeletons[type] || skeletons.page}
    </motion.div>
  );
}

/**
 * Loader quantique avec métriques
 */
export function QuantumLoader({ message = "Chargement quantique..." }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-4"
        >
          <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        <p className="text-lg font-semibold text-slate-900 mb-2">{message}</p>
        <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">{Math.round(progress)}%</p>
      </motion.div>
    </div>
  );
}

/**
 * Lazy loading avec préchargement intelligent
 */
export function lazyLoadWithPreload(importFunc, preloadDelay = 2000) {
  const LazyComponent = lazy(importFunc);
  
  // Préchargement automatique après délai
  let preloadTimer;
  const preload = () => {
    if (!componentCache.has(importFunc.toString())) {
      preloadTimer = setTimeout(() => {
        importFunc().then(module => {
          componentCache.set(importFunc.toString(), module);
        });
      }, preloadDelay);
    }
  };

  // Préchargement immédiat sur hover
  const preloadImmediate = () => {
    if (preloadTimer) clearTimeout(preloadTimer);
    if (!componentCache.has(importFunc.toString())) {
      importFunc().then(module => {
        componentCache.set(importFunc.toString(), module);
      });
    }
  };

  return {
    Component: LazyComponent,
    preload,
    preloadImmediate
  };
}

/**
 * Composant Lazy universel
 */
export function LazyPage({ loader, fallback = <QuantumLoader />, ...props }) {
  return (
    <Suspense fallback={fallback}>
      {React.createElement(loader, props)}
    </Suspense>
  );
}

/**
 * Hook pour précharger les pages
 */
export function usePreloadPages(pages = []) {
  useEffect(() => {
    const timer = setTimeout(() => {
      pages.forEach(page => {
        if (page.preload) {
          page.preload();
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [pages]);
}