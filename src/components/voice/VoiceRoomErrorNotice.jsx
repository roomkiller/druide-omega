import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Avis d'incident d'écoute — discret, lisible, et toujours actionnable :
 * l'utilisateur peut relancer le micro sans recharger la page.
 */
export default function VoiceRoomErrorNotice({ message, onRetry }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2.5 max-w-sm rounded-xl border border-red-400/30 bg-red-500/15 px-3 py-2.5 shadow-lg backdrop-blur-sm"
    >
      <AlertTriangle className="w-4 h-4 text-red-300 mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs leading-snug text-red-100">{message}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="ghost"
            size="sm"
            className="mt-1.5 h-7 px-2 text-xs text-red-100 hover:bg-red-500/25"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Relancer le micro
          </Button>
        )}
      </div>
    </motion.div>
  );
}