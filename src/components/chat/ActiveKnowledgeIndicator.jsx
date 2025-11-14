import React from "react";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Tooltip from "../ui/Tooltip";

export default function ActiveKnowledgeIndicator({ knowledgeBases = [] }) {
  const activeKBs = knowledgeBases.filter(kb => kb.active && kb.status === 'ready');
  
  if (activeKBs.length === 0) return null;

  return (
    <Tooltip content={`${activeKBs.length} source(s) active(s): ${activeKBs.map(kb => kb.title).join(', ')}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Badge className="bg-green-50 text-green-700 border-green-200 px-2 sm:px-3 py-1 text-xs flex items-center gap-1 sm:gap-1.5">
          <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">{activeKBs.length} KB</span>
          <span className="sm:hidden">{activeKBs.length}</span>
          <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600" />
        </Badge>
      </motion.div>
    </Tooltip>
  );
}