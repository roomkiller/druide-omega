import { motion } from "framer-motion";
import { Zap } from "lucide-react";

/**
 * Indicateur visuel rotatif reflétant le travail cognitif pendant les tests.
 * - Au repos : icône Zap statique
 * - En cours : triple anneau rotatif + noyau pulsé, vitesse proportionnelle à la progression
 */
export default function CognitiveSpinner({ running, progress = 0, cognitiveStats = null }) {
  if (!running) {
    return <Zap className="w-8 h-8 mx-auto text-amber-600" />;
  }

  // Plus on avance dans les tests, plus l'anneau externe tourne vite (min 2s, max 0.6s)
  const speed = Math.max(0.6, 2 - (progress / 100) * 1.4);
  const tensionActive = cognitiveStats && cognitiveStats.avgTension > 5;

  return (
    <div className="relative w-10 h-10 mx-auto flex items-center justify-center">
      {/* Anneau externe — vitesse liée à la progression */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-amber-400 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      />
      {/* Anneau moyen — rotation inverse, plus lente */}
      <motion.div
        className="absolute inset-1.5 rounded-full border-2 border-orange-400 border-b-transparent"
        animate={{ rotate: -360 }}
        transition={{ duration: speed * 1.5, repeat: Infinity, ease: "linear" }}
      />
      {/* Anneau interne — pulsation si tension élevée */}
      <motion.div
        className={`absolute inset-3 rounded-full border-2 ${tensionActive ? "border-rose-500" : "border-amber-500"}`}
        animate={tensionActive ? { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Noyau central pulsé */}
      <motion.div
        className="w-2 h-2 rounded-full bg-amber-500"
        animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}