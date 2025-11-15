/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Mystical Floating Logo                                     ║
 * ║ Logo avec effets mystiques et cosmiques                                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { motion } from "framer-motion";
import ThemeRegistry from "../theme/ThemeRegistry";

export default function Logo({ 
  size = "medium", 
  animate = true,
  position = "center",
  showText = false
}) {
  const sizes = {
    mini: { 
      container: "w-8 h-8", 
      text: "text-xs", 
      padding: "p-1.5",
      glow: 20,
      particles: 3
    },
    small: { 
      container: "w-12 h-12", 
      text: "text-sm", 
      padding: "p-2",
      glow: 30,
      particles: 4
    },
    medium: { 
      container: "w-16 h-16", 
      text: "text-base", 
      padding: "p-3",
      glow: 40,
      particles: 6
    },
    large: { 
      container: "w-24 h-24", 
      text: "text-xl", 
      padding: "p-4",
      glow: 60,
      particles: 8
    }
  };

  const positionClasses = {
    center: "mx-auto",
    left: "mr-auto",
    right: "ml-auto"
  };

  return (
    <div className={`${positionClasses[position]} ${showText ? 'flex items-center gap-3' : ''}`}>
      <motion.div
        animate={animate ? {
          y: ThemeRegistry.animations.float.y,
          rotateY: [0, 360],
          scale: [1, 1.05, 1]
        } : undefined}
        transition={{
          duration: ThemeRegistry.animations.float.duration,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`${sizes[size].container} relative flex-shrink-0`}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
      >
        {/* Cosmic glow layers */}
        <motion.div
          animate={animate ? {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          } : undefined}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-2xl blur-2xl"
          style={{ 
            background: `radial-gradient(circle, ${ThemeRegistry.colors.primary.purple[500]}, ${ThemeRegistry.colors.primary.indigo[600]}, transparent)`,
            transform: "translateZ(-30px)"
          }}
        />

        <motion.div
          animate={animate ? {
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360]
          } : undefined}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 rounded-full blur-xl"
          style={{ 
            background: `radial-gradient(circle, ${ThemeRegistry.colors.secondary.pink[500]}, transparent)`,
            transform: "translateZ(-20px)"
          }}
        />

        {/* Mystical particles */}
        {animate && Array.from({ length: sizes[size].particles }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0],
              x: [0, Math.cos(i * Math.PI / 3) * 40, 0],
              y: [0, Math.sin(i * Math.PI / 3) * 40, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut"
            }}
            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full"
            style={{ 
              background: ThemeRegistry.colors.secondary.amber[400],
              boxShadow: ThemeRegistry.effects.glow.soft
            }}
          />
        ))}

        {/* Main logo container */}
        <div
          className={`relative ${sizes[size].padding} rounded-xl shadow-2xl flex items-center justify-center overflow-hidden`}
          style={{ 
            background: `linear-gradient(135deg, ${ThemeRegistry.colors.primary.purple[600]}, ${ThemeRegistry.colors.secondary.pink[600]}, ${ThemeRegistry.colors.primary.indigo[600]})`,
            transform: "translateZ(0px)",
            boxShadow: ThemeRegistry.effects.shadow.mystical
          }}
        >
          {/* Ethereal shimmer */}
          {animate && (
            <motion.div
              animate={{
                x: ["-100%", "200%"]
              }}
              transition={{
                duration: ThemeRegistry.animations.shimmer.duration,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ width: "50%" }}
            />
          )}

          {/* Sacred geometry pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <motion.circle
                cx="50" cy="50" r="30"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
                animate={animate ? { rotate: 360 } : undefined}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                cx="50" cy="50" r="20"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
                animate={animate ? { rotate: -360 } : undefined}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <motion.path
                d="M 50 20 L 65 80 L 20 40 L 80 40 L 35 80 Z"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
                animate={animate ? { rotate: 360 } : undefined}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </div>

          {/* Divine light gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />

          {/* Consciousness pulse */}
          {animate && (
            <motion.div
              animate={{
                scale: [0, 2, 0],
                opacity: [0.5, 0, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute inset-0 rounded-xl"
              style={{
                background: `radial-gradient(circle, ${ThemeRegistry.colors.primary.violet[500]}, transparent)`,
                filter: "blur(8px)"
              }}
            />
          )}

          {/* Logo symbol */}
          <div className="relative z-10 text-center">
            <motion.div 
              className={`${sizes[size].text} font-black drop-shadow-2xl leading-none tracking-tight`}
              animate={animate ? {
                textShadow: [
                  "0 0 10px rgba(255,255,255,0.5)",
                  "0 0 20px rgba(255,255,255,0.8)",
                  "0 0 10px rgba(255,255,255,0.5)"
                ]
              } : undefined}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                DΩ
              </div>
            </motion.div>

            {/* Mystical symbols */}
            <motion.div
              animate={animate ? {
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1, 0.8]
              } : undefined}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-1 -right-1 text-[8px]"
            >
              ✨
            </motion.div>
          </div>

          {/* Orbital rings */}
          {animate && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
                style={{
                  background: `conic-gradient(from 0deg, transparent, ${ThemeRegistry.colors.secondary.amber[400]}20, transparent)`
                }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
                style={{
                  background: `conic-gradient(from 90deg, transparent, ${ThemeRegistry.colors.tertiary.cyan[500]}20, transparent)`
                }}
              />
            </>
          )}
        </div>
      </motion.div>

      {/* Optional text with theme */}
      {showText && (
        <motion.div 
          className="min-w-0"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 
            className="text-lg sm:text-xl font-bold truncate"
            style={{ 
              background: `linear-gradient(135deg, ${ThemeRegistry.colors.primary.purple[600]}, ${ThemeRegistry.colors.primary.indigo[600]})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            {ThemeRegistry.identity.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 truncate">
            {ThemeRegistry.identity.tagline}
          </p>
        </motion.div>
      )}
    </div>
  );
}