/**
 * AI Pacing & Rhythm Adjustment
 * Ajuste automatiquement la cadence vidéo basée sur le contenu
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Zap } from "lucide-react";
import { toast } from "sonner";

export default function AIPacingAdjuster({ frames, onPacingApplied }) {
  const { language } = useLanguage();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [intensity, setIntensity] = useState(50);
  const [pacingConfig, setPacingConfig] = useState(null);

  const optimizePacing = async () => {
    if (!frames || frames.length === 0) {
      toast.error(language === 'fr' ? "Aucune frame" : "No frames");
      return;
    }

    setIsOptimizing(true);
    try {
      // Calculer pacing basé sur intensity
      const config = frames.map((frame, idx) => {
        const progress = idx / frames.length;
        
        // Logique de pacing intelligent
        let duration = 100; // ms par frame
        
        if (progress < 0.2) duration = 150; // Intro lent
        else if (progress < 0.5) duration = 100 - (intensity / 2); // Build-up
        else if (progress < 0.8) duration = 80 - (intensity / 3); // Climax rapide
        else duration = 150; // Outro lent
        
        return {
          frameIdx: idx,
          duration: Math.max(50, duration),
          framerate: 1000 / Math.max(50, duration)
        };
      });

      setPacingConfig(config);
      onPacingApplied?.(config);
      
      toast.success(language === 'fr' 
        ? "Cadence optimisée" 
        : "Pacing optimized");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsOptimizing(false);
    }
  };

  const avgFps = pacingConfig 
    ? (pacingConfig.reduce((sum, cfg) => sum + cfg.framerate, 0) / pacingConfig.length).toFixed(1)
    : "24";

  return (
    <Card className="bg-slate-900 border-blue-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Zap className="w-5 h-5" />
          {language === 'fr' ? "Ajustement de Cadence IA" : "AI Pacing Adjustment"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm text-slate-300 mb-2 block">
            {language === 'fr' ? "Intensité:" : "Intensity:"} 
            <span className="text-blue-400 font-bold ml-2">{intensity}%</span>
          </label>
          <Slider
            value={[intensity]}
            onValueChange={(val) => setIntensity(val[0])}
            min={0}
            max={100}
            step={10}
            disabled={isOptimizing}
          />
        </div>

        <Button
          onClick={optimizePacing}
          disabled={isOptimizing || !frames?.length}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isOptimizing 
            ? language === 'fr' ? "Optimisation..." : "Optimizing..."
            : language === 'fr' ? "Optimiser cadence" : "Optimize pacing"}
        </Button>

        {pacingConfig && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800 p-3 rounded text-xs space-y-2">
            <div className="text-slate-400">
              <p>⏱️ {language === 'fr' ? "FPS moyen:" : "Avg FPS:"} <span className="text-blue-400 font-bold">{avgFps}</span></p>
              <p>📊 {language === 'fr' ? "Frames optimisés:" : "Optimized frames:"} <span className="text-blue-400 font-bold">{pacingConfig.length}</span></p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}