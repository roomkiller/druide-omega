/**
 * Lazy Page Component optimisé
 */

import React, { Suspense, lazy, useEffect } from "react";
import { QuantumLoader, QuantumSkeleton } from "./QuantumLazyLoader";
import { perfMonitor } from "./PerformanceMonitor";

const pageCache = new Map();

export function createLazyPage(importFunc, options = {}) {
  const {
    fallback = <QuantumLoader />,
    preload = false,
    skeleton = "page"
  } = options;

  // Créer lazy component
  const LazyComponent = lazy(() => {
    const endMeasure = perfMonitor.measurePageLoad('LazyPage');
    
    return importFunc().then(module => {
      endMeasure();
      return module;
    });
  });

  // Préchargement si demandé
  if (preload) {
    setTimeout(() => {
      importFunc().then(module => {
        pageCache.set(importFunc.toString(), module);
      });
    }, 100);
  }

  return function LazyPageWrapper(props) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

export default function LazyPage({ loader, fallback, skeleton = "page", ...props }) {
  const finalFallback = fallback || <QuantumSkeleton type={skeleton} />;

  return (
    <Suspense fallback={finalFallback}>
      {React.createElement(loader, props)}
    </Suspense>
  );
}