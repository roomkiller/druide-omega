import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/branding/Logo";

/**
 * Avatar Druide — logo à la place du cerveau.
 * Le halo reste éteint; il s'allume seulement pendant la réflexion (thinking),
 * et le survol affiche la mention de réflexion.
 */
export default function DruideAvatar({ thinking = false, size = "sm", language = "fr" }) {
  const [hover, setHover] = useState(false);
  const box = size === "lg" ? "w-16 h-16" : "w-10 h-10 sm:w-12 sm:h-12";

  const mention = language === "en"
    ? "Druide is thinking and formulating his answer…"
    : "Druide réfléchit et formule sa réponse…";

  return (
    <div
      className={`relative flex-shrink-0 ${box} flex items-center justify-center`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {thinking && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full bg-purple-400/30 blur-md"
            animate={{ opacity: [0.25, 0.7, 0.25], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-purple-400/70"
            animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.35, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        </>
      )}

      <div className={`relative z-10 ${size === "lg" ? "" : "scale-[0.65]"}`}>
        <Logo size="mini" animate={thinking} />
      </div>

      <AnimatePresence>
        {thinking && hover && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 whitespace-nowrap rounded-xl bg-slate-900 text-white text-xs px-3 py-2 shadow-lg"
          >
            {mention}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}