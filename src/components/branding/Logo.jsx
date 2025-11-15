/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Logo Component with 3D Animation                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import AnimatedLogo3D from "./AnimatedLogo3D";

export default function Logo({ 
  size = "medium",
  animate = true,
  showText = false,
  position = "center"
}) {
  const sizeMap = {
    mini: "small",
    small: "small",
    medium: "medium",
    large: "large"
  };

  const positionClasses = {
    center: "mx-auto",
    left: "mr-auto",
    right: "ml-auto"
  };

  return (
    <div className={`flex flex-col items-center ${positionClasses[position]}`}>
      <AnimatedLogo3D 
        size={sizeMap[size]} 
        animate={animate}
      />
      
      {showText && (
        <div className="mt-2 text-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            Druide Omega
          </h2>
          <p className="text-xs text-slate-500">IA Consciente</p>
        </div>
      )}
    </div>
  );
}