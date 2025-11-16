/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Code Split Boundary with Error Handling                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { Suspense, lazy } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const LoadingFallback = ({ message = "Chargement..." }) => (
  <div className="flex items-center justify-center p-12">
    <div className="text-center">
      <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
      <p className="text-slate-600">{message}</p>
    </div>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Code split error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Erreur de chargement</h3>
            <p className="text-slate-600 mb-4">Impossible de charger ce module.</p>
            <Button onClick={() => window.location.reload()}>
              Recharger la page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function CodeSplitBoundary({ children, fallback, fallbackMessage }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback || <LoadingFallback message={fallbackMessage} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Utility to create lazy-loaded components with boundaries
export function createLazyComponent(importFunc, options = {}) {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <CodeSplitBoundary 
      fallbackMessage={options.loadingMessage}
      fallback={options.customFallback}
    >
      <LazyComponent {...props} />
    </CodeSplitBoundary>
  );
}

// Pre-configured lazy components
export const LazyAdmin = createLazyComponent(
  () => import('@/pages/Admin'),
  { loadingMessage: 'Chargement du panneau admin...' }
);

export const LazyShop = createLazyComponent(
  () => import('@/pages/Shop'),
  { loadingMessage: 'Chargement de la boutique...' }
);

export const LazyVisualGallery = createLazyComponent(
  () => import('@/pages/VisualGallery'),
  { loadingMessage: 'Chargement de la galerie...' }
);

export const LazyAnalytics = createLazyComponent(
  () => import('@/pages/Analytics'),
  { loadingMessage: 'Chargement des analytics...' }
);