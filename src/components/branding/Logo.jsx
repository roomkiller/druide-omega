/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Optimized Logo (Mobile/Desktop Centered)                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { motion } from "framer-motion";

export default function Logo({ 
  size = "medium", 
  animate = true,
  position = "center", // center | left | right
  showText = false
}) {
  const sizes = {
    mini: { 
      container: "w-8 h-8", 
      text: "text-xs", 
      padding: "p-1.5" 
    },
    small: { 
      container: "w-12 h-12", 
      text: "text-sm", 
      padding: "p-2" 
    },
    medium: { 
      container: "w-16 h-16", 
      text: "text-base", 
      padding: "p-3" 
    },
    large: { 
      container: "w-24 h-24", 
      text: "text-xl", 
      padding: "p-4" 
    }
  };

  const positionClasses = {
    center: "mx-auto",
    left: "mr-auto",
    right: "ml-auto"
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
    <div className={`${positionClasses[position]} ${showText ? 'flex items-center gap-3' : ''}`}>
      <motion.div
        variants={logoVariants}
        animate={animate ? "animate" : undefined}
        transition={transition}
        className={`${sizes[size].container} relative flex-shrink-0`}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-indigo-500/20 rounded-2xl blur-lg"
          style={{ transform: "translateZ(-20px)" }}
        />

        {/* Logo container */}
        <div
          className={`relative ${sizes[size].padding} bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 rounded-xl shadow-2xl flex items-center justify-center overflow-hidden`}
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-400/50 via-transparent to-transparent" />
          </div>

          {/* Logo text */}
          <div className="relative z-10 text-center">
            <div className={`${sizes[size].text} font-black text-white drop-shadow-lg leading-none tracking-tight`}>
              <div className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                DΩ
              </div>
            </div>
          </div>

          {/* Pulse animation */}
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
              className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl"
            />
          )}
        </div>
      </motion.div>

      {/* Optional text */}
      {showText && (
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Druide Omega</h1>
          <p className="text-xs sm:text-sm text-gray-500 truncate">IA Universelle Bienveillante</p>
        </div>
      )}
    </div>
  );
}