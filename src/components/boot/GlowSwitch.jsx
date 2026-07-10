import React from 'react';
import { motion } from 'framer-motion';

export default function GlowSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
      className={`w-11 h-6 rounded-full relative transition-all duration-300 flex-shrink-0 ${
        checked
          ? 'bg-cyan-500 shadow-[0_0_14px_rgba(34,211,238,0.9),0_0_32px_rgba(34,211,238,0.45)]'
          : 'bg-red-600 shadow-[0_0_14px_rgba(239,68,68,0.9),0_0_32px_rgba(239,68,68,0.45)]'
      }`}
    >
      {!checked && (
        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />
      )}
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md ${
          checked ? 'right-1' : 'left-1'
        }`}
      />
    </button>
  );
}