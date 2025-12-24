/**
 * Code Split Loader - Chargement lazy avancé avec préchargement
 * Réduit le bundle initial et optimise le temps de chargement
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { motion } from 'framer-motion';

const componentCache = new Map();

// Préchargement intelligent des composants
export function preloadComponent(importFn) {
  if (!componentCache.has(importFn)) {
    const promise = importFn();
    componentCache.set(importFn, promise);
    return promise;
  }
  return componentCache.get(importFn);
}

// Wrapper avec préchargement au hover
export function LazyComponent({ 
  importFn, 
  fallback = <LoadingSpinner />,
  preloadOnHover = true,
  ...props 
}) {
  const Component = lazy(() => {
    if (componentCache.has(importFn)) {
      return componentCache.get(importFn);
    }
    const promise = importFn();
    componentCache.set(importFn, promise);
    return promise;
  });

  const handleMouseEnter = () => {
    if (preloadOnHover) {
      preloadComponent(importFn);
    }
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    </div>
  );
}

// Spinner de chargement optimisé
function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center p-8"
    >
      <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    </motion.div>
  );
}

// Préchargement de routes critiques
export function useRoutePreload(routes = []) {
  useEffect(() => {
    // Précharger après l'idle time
    const timeout = setTimeout(() => {
      routes.forEach(route => {
        if (route.preload) {
          preloadComponent(route.component);
        }
      });
    }, 2000);

    return () => clearTimeout(timeout);
  }, [routes]);
}

export default LazyComponent;