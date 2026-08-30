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
    tiny: "w-12 h-12",
    small: "w-32 h-32",
    medium: "w-48 h-48",
    large: "w-64 h-64",
    xl: "w-96 h-96"
  };

  const logoUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690822fad2ea668383422834/bb9ad41a9_Logo3Dultradtail.png";

  // Heartbeat timing: quick pulse, quick pulse, long pause
  const heartbeatKeyframes = [1, 1.03, 1, 1.03, 1, 1, 1, 1];
  const heartbeatTiming = [0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1];

  return (
    <div className={`relative ${sizeClasses[size]} flex-shrink-0 ${className}`}>
      {/* Subtle Cosmic Glow Background with blue and green */}
      {animate && (
        <>
          {/* Primary Glow - Purple */}
          <motion.div
            animate={{
              scale: heartbeatKeyframes,
              opacity: [0.15, 0.25, 0.15, 0.25, 0.15, 0.15, 0.15, 0.15],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              times: heartbeatTiming,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-radial from-purple-500/30 via-indigo-500/15 to-transparent blur-3xl"
          />
          
          {/* Secondary Glow - Sky Blue */}
          <motion.div
            animate={{
              scale: heartbeatKeyframes.map(v => v * 1.1),
              opacity: [0.12, 0.22, 0.12, 0.22, 0.12, 0.12, 0.12, 0.12],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              times: heartbeatTiming,
              ease: "easeInOut",
              delay: 0.1
            }}
            className="absolute inset-0 bg-gradient-radial from-sky-400/30 via-cyan-400/15 to-transparent blur-3xl"
          />

          {/* Tertiary Glow - Emerald Green */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.18, 0.1],
              rotate: [0, 360]
            }}
            transition={{
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 60, repeat: Infinity, ease: "linear" }
            }}
            className="absolute inset-0 bg-gradient-radial from-emerald-400/25 via-teal-400/12 to-transparent blur-3xl"
          />

          {/* Pink accent */}
          <motion.div
            animate={{
              scale: heartbeatKeyframes.map(v => v * 0.95),
              opacity: [0.08, 0.15, 0.08, 0.15, 0.08, 0.08, 0.08, 0.08],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              times: heartbeatTiming,
              ease: "easeInOut",
              delay: 0.2
            }}
            className="absolute inset-0 bg-gradient-radial from-pink-400/20 via-rose-400/10 to-transparent blur-2xl"
          />
        </>
      )}

      {/* Floating Particles with varied colors */}
      {animate && Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const radius = 40 + (i % 4) * 5;
        const colorClass = i % 4 === 0 
          ? "from-sky-300 to-cyan-400"
          : i % 4 === 1 
          ? "from-emerald-300 to-teal-400"
          : i % 4 === 2
          ? "from-purple-300 to-pink-400"
          : "from-indigo-300 to-blue-400";
        
        return (
          <motion.div
            key={i}
            className={`absolute w-0.5 h-0.5 bg-gradient-to-r ${colorClass} rounded-full`}
            style={{
              left: "50%",
              top: "50%",
              filter: "blur(0.5px)",
              position: "absolute"
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              x: [0, Math.cos(angle) * radius, 0],
              y: [0, Math.sin(angle) * radius, 0],
              opacity: [0, 0.7, 0.5, 0],
              scale: [0, 1.3, 0.9, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: [0.22, 1, 0.36, 1]
            }}
          />
        );
      })}

      {/* Main Logo Container with subtle 3D transform */}
      <motion.div
        animate={animate ? {
          y: [-3, -8, -3],
          rotateY: [0, 3, 0, -3, 0],
          rotateX: [0, 1, 0, -1, 0],
        } : {}}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1]
        }}
        className="relative"
        style={{ 
          transformStyle: "preserve-3d",
          perspective: "1200px"
        }}
      >
        {/* Subtle Glow Layers */}
        {animate && (
          <>
            <motion.div
              animate={{
                opacity: [0.2, 0.35, 0.2, 0.35, 0.2, 0.2, 0.2, 0.2],
                scale: heartbeatKeyframes.map(v => v * 0.98),
                filter: ["blur(6px)", "blur(8px)", "blur(6px)", "blur(8px)", "blur(6px)", "blur(6px)", "blur(6px)", "blur(6px)"]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                times: heartbeatTiming,
                ease: "easeInOut"
              }}
              className="absolute inset-0"
            >
              <img
                src={logoUrl}
                alt="DΩ Glow Layer 1"
                className={`${sizeClasses[size]} object-contain`}
                style={{ 
                  filter: "brightness(1.4) saturate(1.4)",
                  mixBlendMode: "screen"
                }}
              />
            </motion.div>

            <motion.div
              animate={{
                opacity: [0.15, 0.25, 0.15, 0.25, 0.15, 0.15, 0.15, 0.15],
                scale: heartbeatKeyframes.map(v => v * 0.99),
                filter: ["blur(3px)", "blur(4px)", "blur(3px)", "blur(4px)", "blur(3px)", "blur(3px)", "blur(3px)", "blur(3px)"]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                times: heartbeatTiming,
                ease: "easeInOut",
                delay: 0.05
              }}
              className="absolute inset-0"
            >
              <img
                src={logoUrl}
                alt="DΩ Glow Layer 2"
                className={`${sizeClasses[size]} object-contain`}
                style={{ 
                  filter: "brightness(1.2) saturate(1.2)",
                  mixBlendMode: "screen"
                }}
              />
            </motion.div>
          </>
        )}

        {/* Main Logo with subtle heartbeat */}
        <motion.img
          src={logoUrl}
          alt="Druide Omega Logo"
          className={`${sizeClasses[size]} object-contain relative z-10`}
          animate={animate ? {
            filter: [
              "brightness(1) saturate(1)",
              "brightness(1.08) saturate(1.15)",
              "brightness(1) saturate(1)",
              "brightness(1.08) saturate(1.15)",
              "brightness(1) saturate(1)",
              "brightness(1) saturate(1)",
              "brightness(1) saturate(1)",
              "brightness(1) saturate(1)"
            ]
          } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            times: heartbeatTiming,
            ease: "easeInOut"
          }}
          style={{
            filter: "drop-shadow(0 0 20px rgba(147, 51, 234, 0.5)) drop-shadow(0 0 15px rgba(56, 189, 248, 0.3)) drop-shadow(0 0 12px rgba(52, 211, 153, 0.3))",
          }}
        />

        {/* Slow Rotating Rings with color variety */}
        {animate && (
          <>
            {/* Purple ring */}
            <motion.div
              animate={{
                rotate: 360,
                scale: heartbeatKeyframes,
                opacity: [0.25, 0.4, 0.25, 0.4, 0.25, 0.25, 0.25, 0.25]
              }}
              transition={{
                rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, times: heartbeatTiming, ease: "easeInOut" },
                opacity: { duration: 4, repeat: Infinity, times: heartbeatTiming, ease: "easeInOut" }
              }}
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, transparent 0deg, rgba(147, 51, 234, 0.4) 90deg, transparent 180deg)",
                filter: "blur(1px)"
              }}
            />

            {/* Sky blue ring */}
            <motion.div
              animate={{
                rotate: -360,
                scale: heartbeatKeyframes.map(v => v * 1.02),
                opacity: [0.2, 0.35, 0.2, 0.35, 0.2, 0.2, 0.2, 0.2]
              }}
              transition={{
                rotate: { duration: 50, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, times: heartbeatTiming, ease: "easeInOut", delay: 0.1 },
                opacity: { duration: 4, repeat: Infinity, times: heartbeatTiming, ease: "easeInOut", delay: 0.1 }
              }}
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 120deg, transparent 0deg, rgba(56, 189, 248, 0.35) 90deg, transparent 180deg)",
                filter: "blur(1px)",
                margin: "-5%"
              }}
            />

            {/* Emerald green ring */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.03, 1],
                opacity: [0.18, 0.28, 0.18]
              }}
              transition={{
                rotate: { duration: 60, repeat: Infinity, ease: "linear" },
                scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 240deg, transparent 0deg, rgba(52, 211, 153, 0.3) 90deg, transparent 180deg)",
                filter: "blur(2px)",
                margin: "-10%"
              }}
            />
          </>
        )}
      </motion.div>

      {/* Gentle Energy Waves with color variety */}
      {animate && (
        <>
          <motion.div
            animate={{
              scale: [1, 2, 2],
              opacity: [0.4, 0.15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="absolute inset-0 border border-purple-500/40 rounded-full"
          />
          
          <motion.div
            animate={{
              scale: [1, 2, 2],
              opacity: [0.35, 0.12, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1],
              delay: 1.5
            }}
            className="absolute inset-0 border border-sky-400/35 rounded-full"
          />

          <motion.div
            animate={{
              scale: [1, 2, 2],
              opacity: [0.3, 0.1, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1],
              delay: 3
            }}
            className="absolute inset-0 border border-emerald-400/30 rounded-full"
          />
        </>
      )}

      {/* Subtle Shimmer Effect */}
      {animate && (
        <motion.div
          animate={{
            x: ["-200%", "200%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: [0.22, 1, 0.36, 1],
            repeatDelay: 4
          }}
          className="absolute inset-0 overflow-hidden rounded-full"
        >
          <div
            className="absolute inset-0 w-1/2 h-full"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), rgba(56,189,248,0.12), rgba(52,211,153,0.12), rgba(147,51,234,0.1), transparent)",
              transform: "skewX(-20deg)",
              filter: "blur(1px)"
            }}
          />
        </motion.div>
      )}

      {/* Gentle pulsing inner glow */}
      {animate && (
        <motion.div
          animate={{
            scale: [0.85, 1, 0.85],
            opacity: [0, 0.15, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-radial from-white via-sky-300/20 to-transparent"
          style={{ filter: "blur(15px)" }}
        />
      )}
    </div>
  );
}