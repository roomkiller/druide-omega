import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SummaryIndicator({ summaryCount, onClick }) {
  if (summaryCount === 0) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-full transition-colors"
    >
      <BookOpen className="w-4 h-4 text-indigo-600" />
      <span className="text-xs font-medium text-indigo-700">
        {summaryCount} {summaryCount === 1 ? 'résumé' : 'résumés'}
      </span>
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-3 h-3 text-indigo-500" />
      </motion.div>
    </motion.button>
  );
}