/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Enhanced Tooltip Component                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";

export default function Tooltip({ 
  children, 
  content, 
  position = "top",
  showIcon = false 
}) {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-3",
    left: "right-full top-1/2 -translate-y-1/2 mr-3",
    right: "left-full top-1/2 -translate-y-1/2 ml-3"
  };

  const arrowPositions = {
    top: "top-full left-1/2 -translate-x-1/2 -mt-[3px]",
    bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-[3px]",
    left: "left-full top-1/2 -translate-y-1/2 -ml-[3px]",
    right: "right-full top-1/2 -translate-y-1/2 -mr-[3px]"
  };

  const arrowRotations = {
    top: "rotate-180",
    bottom: "rotate-0",
    left: "rotate-90",
    right: "-rotate-90"
  };

  if (!content) return <>{children}</>;

  return (
    <div 
      className="relative inline-flex items-center gap-1"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      
      {showIcon && (
        <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" />
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute ${positions[position]} z-[9999] pointer-events-none`}
            style={{ pointerEvents: 'none' }}
          >
            <div className="relative">
              {/* Main tooltip content */}
              <div className="bg-slate-900 text-white text-xs rounded-xl px-4 py-2.5 shadow-2xl border border-slate-700/50 backdrop-blur-sm max-w-xs whitespace-normal">
                <div className="relative z-10 font-medium leading-relaxed">{content}</div>
              </div>
              
              {/* Arrow */}
              <div className={`absolute ${arrowPositions[position]} w-0 h-0`}>
                <div className={`${arrowRotations[position]}`}>
                  <div 
                    className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-slate-900"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}