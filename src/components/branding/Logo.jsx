/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Professional 3D Logo Component                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { motion } from "framer-motion";

export default function Logo({ size = "medium", animate = true }) {
  const sizes = {
    nav: { container: "w-20 h-20", druide: "text-base", omega: "text-[10px]", padding: "p-2.5" },
    small: { container: "w-12 h-12", druide: "text-xs", omega: "text-[8px]", padding: "p-2" },
    medium: { container: "w-20 h-20", druide: "text-base", omega: "text-xs", padding: "p-3" },
    large: { container: "w-32 h-32", druide: "text-3xl", omega: "text-lg", padding: "p-4" },
    xlarge: { container: "w-48 h-48", druide: "text-5xl", omega: "text-2xl", padding: "p-6" }
  };

  const currentSize = sizes[size];

  const logoVariants = animate ? {
    initial: { rotateY: 0, scale: 1 },
    animate: {
      rotateY: [0, 3, -3, 0],
      scale: [1, 1.01, 1],
    }
  } : {};

  const transition = {
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut"
  };

  return (
    <motion.div
      variants={logoVariants}
      initial="initial"
      animate={animate ? "animate" : "initial"}
      transition={transition}
      className={`${currentSize.container} relative flex items-center justify-center flex-shrink-0`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 rounded-2xl blur-lg opacity-50" />
      
      {/* Main container */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-700 rounded-2xl shadow-xl"
        style={{
          transform: "translateZ(10px)",
          boxShadow: "0 10px 40px rgba(139, 92, 246, 0.4)"
        }}
      />

      {/* Inner subtle highlight */}
      <div 
        className="absolute inset-2 bg-gradient-to-br from-purple-400/20 via-indigo-500/20 to-transparent rounded-xl"
        style={{ transform: "translateZ(15px)" }}
      />

      {/* Text container */}
      <div 
        className={`relative z-10 ${currentSize.padding} flex flex-col items-center justify-center text-white font-bold leading-none w-full h-full`}
        style={{
          transform: "translateZ(20px)",
          textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
          letterSpacing: "0.05em"
        }}
      >
        {/* DRUIDE */}
        <div
          className={`${currentSize.druide} bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent font-black tracking-wider`}
        >
          DRUIDE
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/60 to-transparent my-0.5" />

        {/* OMEGA */}
        <div
          className={`${currentSize.omega} bg-gradient-to-r from-cyan-200 via-blue-100 to-cyan-200 bg-clip-text text-transparent font-bold tracking-widest`}
        >
          OMEGA
        </div>
      </div>

      {/* Subtle shine effect */}
      {animate && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-2xl"
          style={{ transform: "translateZ(25px)" }}
          animate={{
            x: [-50, 50],
            opacity: [0, 0.2, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatDelay: 4
          }}
        />
      )}
    </motion.div>
  );
}