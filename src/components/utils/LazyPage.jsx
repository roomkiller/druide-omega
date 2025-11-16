/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Lazy Page Loader                                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

const LoadingFallback = () => (
  <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
    <div className="text-center">
      <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
      <p className="text-slate-600">Chargement...</p>
    </div>
  </div>
);

export function lazyLoadPage(importFunc) {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <Suspense fallback={<LoadingFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Pre-configured lazy pages
export const LazyChat = lazyLoadPage(() => import('@/pages/Chat'));
export const LazyMemory = lazyLoadPage(() => import('@/pages/Memory'));
export const LazyKnowledge = lazyLoadPage(() => import('@/pages/Knowledge'));
export const LazyConsciousness = lazyLoadPage(() => import('@/pages/Consciousness'));
export const LazyAdmin = lazyLoadPage(() => import('@/pages/Admin'));