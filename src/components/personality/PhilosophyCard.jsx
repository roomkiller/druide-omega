import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function PhilosophyCard({ 
  id,
  name, 
  description, 
  icon: Icon, 
  color,
  isSelected,
  onToggle 
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onToggle(id)}
      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
        isSelected 
          ? `border-${color}-500 bg-gradient-to-br from-${color}-50 to-${color}-100/50 shadow-lg shadow-${color}-100`
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
          isSelected 
            ? `bg-gradient-to-br from-${color}-500 to-${color}-600 shadow-lg`
            : 'bg-slate-100'
        }`}>
          <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold ${isSelected ? `text-${color}-900` : 'text-slate-900'}`}>
              {name}
            </h3>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`w-5 h-5 rounded-full bg-${color}-500 flex items-center justify-center`}
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.button>
  );
}