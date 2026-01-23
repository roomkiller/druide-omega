/**
 * AI Scene Detection et Segmentation
 * Analyse les frames pour détecter les changements de scène
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Sparkles, Play } from "lucide-react";
import { toast } from "sonner";

export default function AISceneDetector({ frames, onSegmentation }) {
  const { language } = useLanguage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [segments, setSegments] = useState([]);

  const analyzeScenes = async () => {
    if (!frames || frames.length === 0) {
      toast.error(language === 'fr' ? "Aucune frame à analyser" : "No frames to analyze");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulation d'analyse - en production, utiliser LLM ou vision model
      const detectedSegments = frames.reduce((acc, frame, idx) => {
        // Détection basique de changement de scène tous les 10 frames
        if (idx % 10 === 0 || idx === 0) {
          acc.push({
            id: `scene_${acc.length}`,
            startFrame: idx,
            endFrame: Math.min(idx + 10, frames.length - 1),
            type: this.inferSceneType(idx, frames.length),
            confidence: 0.85 + Math.random() * 0.15,
            description: ""
          });
        }
        return acc;
      }, []);

      setSegments(detectedSegments);
      onSegmentation?.(detectedSegments);
      
      toast.success(language === 'fr' 
        ? `${detectedSegments.length} scènes détectées` 
        : `${detectedSegments.length} scenes detected`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const inferSceneType = (frameIdx, totalFrames) => {
    const types = ["establishing", "action", "dialog", "transition", "climax"];
    return types[Math.floor((frameIdx / totalFrames) * types.length)];
  };

  return (
    <Card className="bg-slate-900 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Sparkles className="w-5 h-5" />
          {language === 'fr' ? "Détection de Scènes IA" : "AI Scene Detection"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={analyzeScenes}
          disabled={isAnalyzing || !frames?.length}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isAnalyzing ? "Analyse..." : language === 'fr' ? "Analyser les scènes" : "Analyze scenes"}
        </Button>

        {segments.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <p className="text-xs text-slate-400">{language === 'fr' ? "Scènes détectées:" : "Detected scenes:"}</p>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {segments.map((seg) => (
                <div key={seg.id} className="bg-slate-800 p-2 rounded text-xs text-slate-300">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold capitalize">{seg.type}</span>
                    <span className="text-purple-400">{(seg.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="text-slate-400">
                    Frame {seg.startFrame} → {seg.endFrame}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}