/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Fixed Tooltip Component (No Hidden Issue)                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { createPortal } from "react-dom";

export default function Tooltip({ 
  children, 
  content, 
  position = "top",
  showIcon = false 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setIsVisible(true);
  };

  const positions = {
    top: { 
      x: coords.x,
      y: coords.y - 10,
      transform: "translate(-50%, -100%)"
    },
    bottom: { 
      x: coords.x,
      y: coords.y + 40,
      transform: "translate(-50%, 0%)"
    },
    left: { 
      x: coords.x - 10,
      y: coords.y + 20,
      transform: "translate(-100%, -50%)"
    },
    right: { 
      x: coords.x + 10,
      y: coords.y + 20,
      transform: "translate(0%, -50%)"
    }
  };

  const arrowRotations = {
    top: "rotate-180",
    bottom: "rotate-0",
    left: "rotate-90",
    right: "-rotate-90"
  };

  if (!content) return <>{children}</>;

  const tooltipContent = isVisible && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      style={{
        position: 'fixed',
        left: `${positions[position].x}px`,
        top: `${positions[position].y}px`,
        transform: positions[position].transform,
        zIndex: 999999,
        pointerEvents: 'none'
      }}
    >
      <div className="relative">
        {/* Main tooltip content */}
        <div className="bg-slate-900 text-white text-xs rounded-xl px-4 py-2.5 shadow-2xl border border-slate-700/50 backdrop-blur-sm max-w-xs whitespace-normal">
          <div className="relative z-10 font-medium leading-relaxed">{content}</div>
        </div>
        
        {/* Arrow */}
        <div 
          className="absolute"
          style={{
            top: position === 'top' ? '100%' : position === 'bottom' ? 'auto' : '50%',
            bottom: position === 'bottom' ? '100%' : 'auto',
            left: position === 'top' || position === 'bottom' ? '50%' : position === 'left' ? '100%' : 'auto',
            right: position === 'right' ? '100%' : 'auto',
            transform: position === 'top' || position === 'bottom' ? 'translateX(-50%)' : 
                       position === 'left' || position === 'right' ? 'translateY(-50%)' : 'none',
            marginTop: position === 'top' ? '-3px' : 'auto',
            marginBottom: position === 'bottom' ? '-3px' : 'auto',
            marginLeft: position === 'left' ? '-3px' : 'auto',
            marginRight: position === 'right' ? '-3px' : 'auto'
          }}
        >
          <div className={`${arrowRotations[position]}`}>
            <div 
              className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-slate-900"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <div 
        className="relative inline-flex items-center gap-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={handleMouseEnter}
        onBlur={() => setIsVisible(false)}
      >
        {children}
        
        {showIcon && (
          <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" />
        )}
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {tooltipContent}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}