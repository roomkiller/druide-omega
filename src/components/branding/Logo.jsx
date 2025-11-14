/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - 3D Majestic Logo Component                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { motion } from "framer-motion";

export default function Logo({ size = "medium", animate = true }) {
  const sizes = {
    small: { container: "w-10 h-10", druide: "text-xs", omega: "text-[8px]" },
    medium: { container: "w-16 h-16", druide: "text-sm", omega: "text-xs" },
    large: { container: "w-32 h-32", druide: "text-3xl", omega: "text-lg" },
    xlarge: { container: "w-48 h-48", druide: "text-5xl", omega: "text-2xl" }
  };

  const currentSize = sizes[size];

  const logoVariants = animate ? {
    initial: { rotateY: 0, scale: 1 },
    animate: {
      rotateY: [0, 5, -5, 0],
      scale: [1, 1.02, 1],
    }
  } : {};

  const transition = {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  };

  return (
    <motion.div
      variants={logoVariants}
      initial="initial"
      animate={animate ? "animate" : "initial"}
      transition={transition}
      className={`${currentSize.container} relative flex items-center justify-center`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 rounded-2xl blur-sm opacity-60" />
      
      {/* Main container with 3D effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-700 rounded-2xl shadow-2xl"
        style={{
          transform: "translateZ(10px)",
          boxShadow: "0 20px 60px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
        }}
      />

      {/* Inner glow */}
      <div 
        className="absolute inset-1 bg-gradient-to-br from-purple-500/30 via-indigo-600/30 to-transparent rounded-xl"
        style={{ transform: "translateZ(15px)" }}
      />

      {/* Text container */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center text-white font-bold leading-none"
        style={{
          transform: "translateZ(20px)",
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.8)",
          letterSpacing: "0.05em"
        }}
      >
        {/* DRUIDE text - top */}
        <motion.div
          className={`${currentSize.druide} bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent font-black tracking-wider`}
          style={{
            textShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
            filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))"
          }}
          animate={animate ? {
            textShadow: [
              "0 0 20px rgba(255, 255, 255, 0.5)",
              "0 0 30px rgba(255, 255, 255, 0.8)",
              "0 0 20px rgba(255, 255, 255, 0.5)"
            ]
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        >
          DRUIDE
        </motion.div>

        {/* Divider line */}
        <div 
          className="w-full h-px bg-gradient-to-r from-transparent via-white to-transparent my-0.5 opacity-60"
          style={{ transform: "translateZ(22px)" }}
        />

        {/* OMEGA text - bottom */}
        <motion.div
          className={`${currentSize.omega} bg-gradient-to-r from-cyan-200 via-blue-100 to-cyan-200 bg-clip-text text-transparent font-bold tracking-widest`}
          style={{
            textShadow: "0 0 15px rgba(147, 197, 253, 0.6)",
            filter: "drop-shadow(0 1px 3px rgba(0, 0, 0, 0.4))"
          }}
          animate={animate ? {
            opacity: [0.9, 1, 0.9]
          } : {}}
          transition={{ duration: 4, repeat: Infinity }}
        >
          OMEGA
        </motion.div>
      </div>

      {/* Shine effect overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl"
        style={{ transform: "translateZ(25px)" }}
        animate={animate ? {
          x: [-100, 100],
          opacity: [0, 0.3, 0]
        } : {}}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatDelay: 3
        }}
      />

      {/* Corner accents */}
      <div 
        className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-white/40 rounded-tl-lg"
        style={{ transform: "translateZ(23px)" }}
      />
      <div 
        className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-white/40 rounded-br-lg"
        style={{ transform: "translateZ(23px)" }}
      />
    </motion.div>
  );
}