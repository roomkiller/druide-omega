/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - 3D Logo (Mobile Optimized)                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { motion } from "framer-motion";

export default function Logo({ size = "medium", animate = true }) {
  const sizes = {
    small: { 
      container: "w-10 h-10 sm:w-12 sm:h-12", 
      text: "text-xs sm:text-sm", 
      padding: "p-1.5 sm:p-2" 
    },
    medium: { 
      container: "w-16 h-16 sm:w-24 sm:h-24", 
      text: "text-sm sm:text-lg", 
      padding: "p-2 sm:p-3" 
    },
    large: { 
      container: "w-24 h-24 sm:w-40 sm:h-40", 
      text: "text-lg sm:text-3xl", 
      padding: "p-3 sm:p-6" 
    }
  };

  const logoVariants = animate
    ? {
        animate: {
          rotateY: [0, 360],
          scale: [1, 1.05, 1]
        }
      }
    : {};

  const transition = {
    duration: 8,
    repeat: Infinity,
    ease: "linear"
  };

  return (
    <motion.div
      variants={logoVariants}
      animate={animate ? "animate" : undefined}
      transition={transition}
      className={`${sizes[size].container} relative`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-indigo-500/20 rounded-2xl sm:rounded-3xl blur-xl"
        style={{ transform: "translateZ(-20px)" }}
      />

      <div
        className={`relative ${sizes[size].padding} bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden`}
        style={{ transform: "translateZ(0px)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-400/50 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center">
          <div className={`${sizes[size].text} font-black text-white drop-shadow-lg leading-none tracking-tight`}>
            <div className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              DΩ
            </div>
          </div>
        </div>

        {animate && (
          <motion.div
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl sm:rounded-2xl"
          />
        )}
      </div>
    </motion.div>
  );
}