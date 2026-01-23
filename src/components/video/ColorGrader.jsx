/**
 * AI Color Grading & Correction
 * Applies color profiles based on scene mood
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/components/utils/LanguageContext";
import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import { toast } from "sonner";

const COLOR_PRESETS = {
  cinematic: { temp: 8, saturation: 1.2, contrast: 1.1, exposure: 0 },
  warm: { temp: 12, saturation: 1.15, contrast: 1.05, exposure: 0.2 },
  cool: { temp: 3, saturation: 1.1, contrast: 1.15, exposure: -0.1 },
  vintage: { temp: 9, saturation: 0.85, contrast: 0.95, exposure: 0.1 },
  dramatic: { temp: 5, saturation: 1.3, contrast: 1.25, exposure: -0.2 },
  vibrant: { temp: 8, saturation: 1.4, contrast: 1.2, exposure: 0.15 }
};

export default function ColorGrader({ scenes, onGradingApplied }) {
  const { language } = useLanguage();
  const [selectedPreset, setSelectedPreset] = useState("cinematic");
  const [customGrade, setCustomGrade] = useState(COLOR_PRESETS.cinematic);
  const [isApplying, setIsApplying] = useState(false);

  const applyGrading = async () => {
    setIsApplying(true);
    try {
      // Appliquer grading à chaque scène
      const gradedScenes = scenes?.map(scene => ({
        ...scene,
        colorGrade: {
          preset: selectedPreset,
          ...customGrade,
          appliedAt: new Date().toISOString()
        }
      })) || [];

      onGradingApplied?.(gradedScenes);
      toast.success(language === 'fr' ? "Grading appliqué" : "Grading applied");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Card className="bg-slate-900 border-yellow-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-400">
          <Palette className="w-5 h-5" />
          {language === 'fr' ? "Étalonnage Couleur IA" : "AI Color Grading"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Presets */}
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(COLOR_PRESETS).map(([name, values]) => (
            <button
              key={name}
              onClick={() => {
                setSelectedPreset(name);
                setCustomGrade(values);
              }}
              className={`p-2 rounded text-xs font-semibold capitalize transition-all ${
                selectedPreset === name
                  ? "bg-yellow-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Custom Controls */}
        <div className="bg-slate-800 p-3 rounded space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-2 block">
              Temperature: <span className="text-yellow-400">{customGrade.temp}K</span>
            </label>
            <Slider
              value={[customGrade.temp]}
              onValueChange={(val) => setCustomGrade({ ...customGrade, temp: val[0] })}
              min={3}
              max={12}
              step={0.5}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-2 block">
              Saturation: <span className="text-yellow-400">{customGrade.saturation.toFixed(2)}</span>
            </label>
            <Slider
              value={[customGrade.saturation]}
              onValueChange={(val) => setCustomGrade({ ...customGrade, saturation: val[0] })}
              min={0.5}
              max={1.5}
              step={0.05}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-2 block">
              Contrast: <span className="text-yellow-400">{customGrade.contrast.toFixed(2)}</span>
            </label>
            <Slider
              value={[customGrade.contrast]}
              onValueChange={(val) => setCustomGrade({ ...customGrade, contrast: val[0] })}
              min={0.8}
              max={1.5}
              step={0.05}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-2 block">
              Exposure: <span className="text-yellow-400">{customGrade.exposure.toFixed(1)}</span>
            </label>
            <Slider
              value={[customGrade.exposure]}
              onValueChange={(val) => setCustomGrade({ ...customGrade, exposure: val[0] })}
              min={-0.5}
              max={0.5}
              step={0.1}
            />
          </div>
        </div>

        <Button
          onClick={applyGrading}
          disabled={isApplying || !scenes?.length}
          className="w-full bg-yellow-600 hover:bg-yellow-700"
        >
          {isApplying 
            ? language === 'fr' ? "Application..." : "Applying..."
            : language === 'fr' ? "Appliquer étalonnage" : "Apply grading"}
        </Button>
      </CardContent>
    </Card>
  );
}