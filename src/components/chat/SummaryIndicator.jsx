import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function SummaryIndicator({ summaryCount = 0, onClick }) {
  if (summaryCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className="relative h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm hover:bg-indigo-50 hover:border-indigo-300"
      >
        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 mr-1 sm:mr-2" />
        <span className="hidden sm:inline">Résumés</span>
        <Badge className="ml-1 sm:ml-2 bg-indigo-100 text-indigo-700 text-xs px-1.5 py-0">
          {summaryCount}
        </Badge>
      </Button>
    </motion.div>
  );
}