/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Animated 3D Logo Component                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { motion } from "framer-motion";

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
      {/* Cosmic Glow Background */}
      {animate && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-radial from-purple-500/40 via-indigo-500/20 to-transparent blur-3xl"
            style={{ transform: "translateZ(0)" }}
          />
          
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute inset-0 bg-gradient-radial from-pink-500/30 via-purple-500/15 to-transparent blur-2xl"
            style={{ transform: "translateZ(0)" }}
          />
        </>
      )}

      {/* Floating Particles */}
      {animate && Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Main Logo Container */}
      <motion.div
        animate={animate ? {
          y: [0, -15, 0],
          rotateY: [0, 5, 0, -5, 0],
          rotateX: [0, 2, 0, -2, 0],
        } : {}}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
        style={{ 
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
      >
        {/* Glow Layer */}
        {animate && (
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.98, 1.02, 0.98],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 blur-md"
          >
            <img
              src={logoUrl}
              alt="DΩ Glow"
              className={`${sizeClasses[size]} object-contain opacity-70`}
              style={{ filter: "brightness(1.5) saturate(1.5)" }}
            />
          </motion.div>
        )}

        {/* Main Logo */}
        <motion.img
          src={logoUrl}
          alt="Druide Omega Logo"
          className={`${sizeClasses[size]} object-contain relative z-10`}
          animate={animate ? {
            filter: [
              "brightness(1) saturate(1)",
              "brightness(1.2) saturate(1.3)",
              "brightness(1) saturate(1)"
            ]
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            filter: "drop-shadow(0 0 20px rgba(147, 51, 234, 0.6))"
          }}
        />

        {/* Rotating Ring */}
        {animate && (
          <>
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute inset-0 border-2 border-purple-500/30 rounded-full"
              style={{
                transform: "translateZ(-10px)"
              }}
            />

            <motion.div
              animate={{
                rotate: -360,
                scale: [1.05, 0.95, 1.05],
              }}
              transition={{
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
              }}
              className="absolute inset-0 border border-indigo-500/20 rounded-full"
              style={{
                transform: "translateZ(-5px)",
                margin: "-10px"
              }}
            />
          </>
        )}
      </motion.div>

      {/* Energy Waves */}
      {animate && (
        <>
          <motion.div
            animate={{
              scale: [1, 2.5],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute inset-0 border-2 border-purple-500/50 rounded-full"
          />
          
          <motion.div
            animate={{
              scale: [1, 2.5],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.7
            }}
            className="absolute inset-0 border-2 border-indigo-500/50 rounded-full"
          />
        </>
      )}

      {/* Shimmer Effect */}
      {animate && (
        <motion.div
          animate={{
            x: ["-200%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 2
          }}
          className="absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{
              transform: "skewX(-20deg)"
            }}
          />
        </motion.div>
      )}
    </div>
  );
}