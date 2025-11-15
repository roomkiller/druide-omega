/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Animated 3D Logo Component                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedLogo3D({ 
  size = "medium",
  animate = true,
  className = ""
}) {
  const sizeClasses = {
    small: "w-32 h-32",
    medium: "w-48 h-48",
    large: "w-64 h-64",
    xl: "w-96 h-96"
  };

  const logoUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690822fad2ea668383422834/bb9ad41a9_Logo3Dultradtail.png";

  return (
    <div className={`relative ${className}`}>
      {/* Enhanced Cosmic Glow Background with multiple layers */}
      {animate && (
        <>
          {/* Primary Glow */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: [0.45, 0, 0.55, 1]
            }}
            className="absolute inset-0 bg-gradient-radial from-purple-500/50 via-indigo-500/30 to-transparent blur-3xl"
          />
          
          {/* Secondary Glow */}
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: [0.45, 0, 0.55, 1],
              delay: 0.5
            }}
            className="absolute inset-0 bg-gradient-radial from-pink-500/40 via-purple-500/20 to-transparent blur-2xl"
          />

          {/* Tertiary Glow */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-radial from-cyan-500/30 via-indigo-500/15 to-transparent blur-2xl"
          />
        </>
      )}

      {/* Enhanced Floating Particles with better physics */}
      {animate && Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 60 + Math.random() * 40;
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            style={{
              left: "50%",
              top: "50%",
              filter: "blur(0.5px)"
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              x: [0, Math.cos(angle) * radius, 0],
              y: [0, Math.sin(angle) * radius, 0],
              opacity: [0, 1, 0.8, 0],
              scale: [0, 1.5, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: [0.22, 1, 0.36, 1]
            }}
          />
        );
      })}

      {/* Main Logo Container with enhanced 3D transform */}
      <motion.div
        animate={animate ? {
          y: [-5, -20, -5],
          rotateY: [0, 10, 0, -10, 0],
          rotateX: [0, 3, 0, -3, 0],
          rotateZ: [0, 1, 0, -1, 0]
        } : {}}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1]
        }}
        className="relative"
        style={{ 
          transformStyle: "preserve-3d",
          perspective: "1200px"
        }}
      >
        {/* Multi-layer Glow for depth */}
        {animate && (
          <>
            <motion.div
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [0.95, 1.05, 0.95],
                filter: ["blur(8px)", "blur(12px)", "blur(8px)"]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0"
            >
              <img
                src={logoUrl}
                alt="DΩ Glow Layer 1"
                className={`${sizeClasses[size]} object-contain`}
                style={{ 
                  filter: "brightness(1.8) saturate(1.8) contrast(1.2)",
                  mixBlendMode: "screen"
                }}
              />
            </motion.div>

            <motion.div
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [0.98, 1.02, 0.98],
                filter: ["blur(4px)", "blur(6px)", "blur(4px)"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3
              }}
              className="absolute inset-0"
            >
              <img
                src={logoUrl}
                alt="DΩ Glow Layer 2"
                className={`${sizeClasses[size]} object-contain`}
                style={{ 
                  filter: "brightness(1.5) saturate(1.5)",
                  mixBlendMode: "screen"
                }}
              />
            </motion.div>
          </>
        )}

        {/* Main Logo with enhanced effects */}
        <motion.img
          src={logoUrl}
          alt="Druide Omega Logo"
          className={`${sizeClasses[size]} object-contain relative z-10`}
          animate={animate ? {
            filter: [
              "brightness(1) saturate(1) contrast(1)",
              "brightness(1.2) saturate(1.4) contrast(1.1)",
              "brightness(1) saturate(1) contrast(1)"
            ]
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1]
          }}
          style={{
            filter: "drop-shadow(0 0 30px rgba(147, 51, 234, 0.8)) drop-shadow(0 0 15px rgba(236, 72, 153, 0.6))",
          }}
        />

        {/* Enhanced Rotating Rings with gradient trails */}
        {animate && (
          <>
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, transparent 0deg, rgba(147, 51, 234, 0.6) 90deg, transparent 180deg)",
                filter: "blur(1px)"
              }}
            />

            <motion.div
              animate={{
                rotate: -360,
                scale: [1.05, 0.95, 1.05],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                opacity: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
              }}
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 180deg, transparent 0deg, rgba(236, 72, 153, 0.5) 90deg, transparent 180deg)",
                filter: "blur(1px)",
                margin: "-5%"
              }}
            />

            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 90deg, transparent 0deg, rgba(99, 102, 241, 0.4) 90deg, transparent 180deg)",
                filter: "blur(2px)",
                margin: "-10%"
              }}
            />
          </>
        )}
      </motion.div>

      {/* Enhanced Energy Waves with better timing */}
      {animate && (
        <>
          <motion.div
            animate={{
              scale: [1, 3, 3],
              opacity: [0.7, 0.3, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="absolute inset-0 border-2 border-purple-500/60 rounded-full"
          />
          
          <motion.div
            animate={{
              scale: [1, 3, 3],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.8
            }}
            className="absolute inset-0 border-2 border-pink-500/50 rounded-full"
          />

          <motion.div
            animate={{
              scale: [1, 3, 3],
              opacity: [0.4, 0.15, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1],
              delay: 1.6
            }}
            className="absolute inset-0 border-2 border-indigo-500/40 rounded-full"
          />
        </>
      )}

      {/* Enhanced Shimmer Effect with rainbow gradient */}
      {animate && (
        <motion.div
          animate={{
            x: ["-200%", "200%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: [0.22, 1, 0.36, 1],
            repeatDelay: 2
          }}
          className="absolute inset-0 overflow-hidden rounded-full"
        >
          <div
            className="absolute inset-0 w-1/2 h-full"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(147,51,234,0.3), rgba(236,72,153,0.3), transparent)",
              transform: "skewX(-20deg)",
              filter: "blur(1px)"
            }}
          />
        </motion.div>
      )}

      {/* Pulsing inner glow */}
      {animate && (
        <motion.div
          animate={{
            scale: [0.8, 1, 0.8],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-radial from-white via-purple-300/50 to-transparent"
          style={{ filter: "blur(20px)" }}
        />
      )}
    </div>
  );
}