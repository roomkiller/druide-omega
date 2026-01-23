/**
 * Advanced Style Transfer with Blending
 * Support upload custom styles + blend multiple styles
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Upload, Palette, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

const PREDEFINED_STYLES = [
  { id: "cinematic", label: "Cinematic", emoji: "🎬", color: "from-blue-600 to-cyan-600" },
  { id: "anime", label: "Anime", emoji: "🎨", color: "from-pink-600 to-purple-600" },
  { id: "watercolor", label: "Watercolor", emoji: "🌊", color: "from-green-600 to-blue-600" },
  { id: "pixel_art", label: "Pixel Art", emoji: "⬜", color: "from-yellow-600 to-orange-600" },
  { id: "vintage_photography", label: "Vintage", emoji: "📷", color: "from-amber-700 to-yellow-700" },
  { id: "oil_painting", label: "Oil Painting", emoji: "🖼️", color: "from-red-600 to-orange-600" },
  { id: "digital_art", label: "Digital Art", emoji: "💻", color: "from-purple-600 to-pink-600" }
];

export default function AdvancedStyleTransfer({ onStyleApplied }) {
  const { language } = useLanguage();
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [customStyleUrl, setCustomStyleUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [blendIntensity, setBlendIntensity] = useState(50);

  const toggleStyle = (styleId) => {
    setSelectedStyles(prev => 
      prev.includes(styleId) 
        ? prev.filter(s => s !== styleId)
        : [...prev, styleId]
    );
  };

  const uploadCustomStyle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await base44.integrations.Core.UploadFile({ file });
      setCustomStyleUrl(response.data.file_url || response.file_url);
      toast.success(language === 'fr' ? "Style uploadé" : "Style uploaded");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const applyStyles = () => {
    if (selectedStyles.length === 0 && !customStyleUrl) {
      toast.error(language === 'fr' ? "Sélectionnez au moins un style" : "Select at least one style");
      return;
    }

    const styleConfig = {
      primary: selectedStyles[0] || "custom",
      blended: selectedStyles.length > 1 ? selectedStyles.slice(1) : [],
      customStyle: customStyleUrl,
      blendIntensity: blendIntensity / 100,
      timestamp: new Date().toISOString()
    };

    onStyleApplied?.(styleConfig);
    toast.success(language === 'fr' ? "Styles appliqués" : "Styles applied");
  };

  return (
    <Card className="bg-slate-900 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Palette className="w-5 h-5" />
          {language === 'fr' ? "Transfert de Style Avancé" : "Advanced Style Transfer"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Predefined Styles Grid */}
        <div>
          <p className="text-xs text-slate-400 mb-2">
            {language === 'fr' ? "Styles prédéfinis:" : "Predefined styles:"}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PREDEFINED_STYLES.map(style => (
              <motion.button
                key={style.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => toggleStyle(style.id)}
                className={`p-3 rounded-lg text-center text-xs transition-all ${
                  selectedStyles.includes(style.id)
                    ? `bg-gradient-to-b ${style.color} text-white`
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                <div className="text-lg mb-1">{style.emoji}</div>
                <div className="text-xs font-semibold">{style.label}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom Style Upload */}
        <div className="border border-dashed border-purple-500/30 rounded-lg p-4">
          <label className="flex flex-col items-center gap-2 cursor-pointer">
            <Upload className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-slate-400">
              {language === 'fr' ? "Uploader votre style" : "Upload custom style"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={uploadCustomStyle}
              disabled={isUploading}
              className="hidden"
            />
          </label>
          {customStyleUrl && (
            <div className="mt-2 flex items-center justify-between bg-slate-800 p-2 rounded text-xs">
              <span className="text-green-400">✓ Style custom uploadé</span>
              <button onClick={() => setCustomStyleUrl(null)} className="text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Style Blending */}
        {selectedStyles.length > 1 && (
          <div className="bg-slate-800 p-3 rounded space-y-2">
            <p className="text-xs text-slate-400">
              {language === 'fr' ? "Intensité de blend:" : "Blend intensity:"} 
              <span className="text-purple-400 ml-2">{blendIntensity}%</span>
            </p>
            <input
              type="range"
              min="0"
              max="100"
              value={blendIntensity}
              onChange={(e) => setBlendIntensity(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-slate-500">
              {language === 'fr' 
                ? `${selectedStyles.length} styles blendés` 
                : `${selectedStyles.length} styles blended`}
            </p>
          </div>
        )}

        <Button
          onClick={applyStyles}
          disabled={selectedStyles.length === 0 && !customStyleUrl}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {language === 'fr' ? "Appliquer les styles" : "Apply styles"}
        </Button>
      </CardContent>
    </Card>
  );
}