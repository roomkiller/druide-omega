/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Lazy Loading Wrapper for Pages                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LazyPage({ children }) {
  return (
    <Suspense fallback={<LazyPageFallback />}>
      {children}
    </Suspense>
  );
}

function LazyPageFallback() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-4"
        >
          <Loader2 className="w-12 h-12 text-purple-600" />
        </motion.div>
        <p className="text-slate-600 font-medium">Chargement...</p>
      </motion.div>
    </div>
  );
}