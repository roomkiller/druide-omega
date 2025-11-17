/**
 * Indicateur de pensée quantique ultra-rapide
 */

import React from "react";
import { motion } from "framer-motion";
import { Zap, Brain, Activity } from "lucide-react";

export default function QuantumThinkingIndicator({ metrics, phase }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full shadow-lg"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      >
        <Zap className="w-4 h-4 text-white" />
      </motion.div>
      
      <span className="text-white text-xs font-semibold">
        {phase || 'Traitement quantique'}
      </span>

      {metrics && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-white/20 rounded-full"
        >
          <Activity className="w-3 h-3 text-white" />
          <span className="text-white text-xs">{metrics.processing_time_ms}ms</span>
        </motion.div>
      )}
    </motion.div>
  );
}