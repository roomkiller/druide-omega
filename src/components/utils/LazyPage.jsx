/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Lazy Loading Wrapper with Suspense                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

const PageLoader = () => (
  <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
      <p className="text-slate-600 font-medium">Chargement...</p>
    </div>
  </div>
);

export const lazyLoadPage = (importFunc) => {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <Suspense fallback={<PageLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default lazyLoadPage;