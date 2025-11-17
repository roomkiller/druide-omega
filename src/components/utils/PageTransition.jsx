/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Page Transition Wrapper                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { motion } from "framer-motion";
import { LOADING_CONFIG } from "@/components/system/LoadingManager";

const pageTransition = {
  initial: { 
    opacity: 0, 
    y: 10 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: LOADING_CONFIG.fadeInDuration / 1000,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    transition: {
      duration: LOADING_CONFIG.fadeOutDuration / 1000,
      ease: "easeIn"
    }
  }
};

export default function PageTransition({ children, className = "" }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}