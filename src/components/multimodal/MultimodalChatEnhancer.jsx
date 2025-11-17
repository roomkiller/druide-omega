/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Multimodal Chat Enhancer                                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ImageAnalyzer from "./ImageAnalyzer";
import VisualResponseGenerator from "./VisualResponseGenerator";
import { Image as ImageIcon, BarChart3, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MultimodalChatEnhancer({ 
  context, 
  onImageAnalyzed, 
  onVisualGenerated 
}) {
  const [activeMode, setActiveMode] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={() => setActiveMode(activeMode === "analyze" ? null : "analyze")}
          variant={activeMode === "analyze" ? "default" : "outline"}
          size="sm"
          className={activeMode === "analyze" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
        >
          <Eye className="w-4 h-4 mr-2" />
          Analyser Image
        </Button>

        <Button
          onClick={() => setActiveMode(activeMode === "generate" ? null : "generate")}
          variant={activeMode === "generate" ? "default" : "outline"}
          size="sm"
          className={activeMode === "generate" ? "bg-gradient-to-r from-blue-600 to-cyan-600" : ""}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Générer Visuel
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {activeMode === "analyze" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ImageAnalyzer onAnalysisComplete={(analysis) => {
              onImageAnalyzed?.(analysis);
              setActiveMode(null);
            }} />
          </motion.div>
        )}

        {activeMode === "generate" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <VisualResponseGenerator 
              context={context} 
              onGenerated={(visual) => {
                onVisualGenerated?.(visual);
                setActiveMode(null);
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}