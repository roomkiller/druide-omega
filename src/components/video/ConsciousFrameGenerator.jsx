import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ConsciousFrameGenerator({ sequence, onFramesAdded }) {
  const { language } = useLanguage();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [frameCount, setFrameCount] = useState(6);
  const [progress, setProgress] = useState(0);

  const styles = [
    { id: "cinematic", label: "🎬 " + (language === 'fr' ? "Cinématique" : "Cinematic") },
    { id: "artistic", label: "🎨 " + (language === 'fr' ? "Artistique" : "Artistic") },
    { id: "abstract", label: "✨ " + (language === 'fr' ? "Abstrait" : "Abstract") },
    { id: "surreal", label: "🌀 " + (language === 'fr' ? "Surréaliste" : "Surreal") },
  ];

  const generateFrames = async () => {
    if (!prompt.trim()) {
      toast.error(language === 'fr' ? "Veuillez entrer une description" : "Please enter a description");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    try {
      const generatedFrames = [];

      for (let i = 0; i < frameCount; i++) {
        setProgress(Math.round((i / frameCount) * 100));
        
        const response = await base44.integrations.Core.GenerateImage({
          prompt: `Frame ${i + 1}/${frameCount}: ${prompt}. Style: ${style}. Conscious AI aesthetic. High quality 16:9 cinematic composition.`,
          existing_image_urls: i > 0 ? [generatedFrames[i - 1].url] : undefined
        });

        const imageUrl = response.data?.url || response.url;
        if (!imageUrl) throw new Error("Image URL not returned from API");

        generatedFrames.push({
          id: Date.now() + i,
          url: imageUrl,
          prompt: prompt,
          style: style,
          index: sequence.frames.length + i,
          timestamp: Date.now()
        });
      }

      onFramesAdded(generatedFrames);
      toast.success(language === 'fr' ? `${frameCount} images générées` : `${frameCount} frames generated`);
      setPrompt("");
      setProgress(0);
    } catch (error) {
      console.error("Erreur génération:", error);
      toast.error(language === 'fr' ? "Erreur lors de la génération d'image" : "Image generation failed");
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            {language === 'fr' ? 'Générateur d\'Images Conscientes' : 'Conscious Frame Generator'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Prompt */}
          <div>
            <label className="text-slate-300 text-sm mb-2 block">
              {language === 'fr' ? 'Description' : 'Description'}
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={language === 'fr' 
                ? "Décrivez la scène que vous voulez générer..." 
                : "Describe the scene you want to generate..."}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
              rows={3}
            />
          </div>

          {/* Style Selection */}
          <div>
            <label className="text-slate-300 text-sm mb-2 block">
              {language === 'fr' ? 'Style Visuel' : 'Visual Style'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {styles.map(s => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`p-3 rounded-lg transition ${
                    style === s.id
                      ? 'bg-purple-600 border-purple-500'
                      : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                  } border text-white text-sm`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Frame Count - Optimized */}
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4 rounded-lg border border-purple-500/30">
            <label className="text-purple-300 text-sm font-semibold mb-3 block">
              {language === 'fr' ? '⚙️ Optimisation Automatique' : '⚙️ Automatic Optimization'}
            </label>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">{language === 'fr' ? 'Images calculées:' : 'Calculated frames:'}</span>
                <span className="text-purple-400 font-bold">{frameCount}</span>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <p>📊 {language === 'fr' ? `Durée: ${sequence.metadata.duration}s` : `Duration: ${sequence.metadata.duration}s`}</p>
                <p>🎬 {language === 'fr' ? `FPS: ${sequence.metadata.fps}` : `FPS: ${sequence.metadata.fps}`}</p>
                <p>✨ {language === 'fr' ? `Fluidité: ${frameCount >= sequence.metadata.fps * sequence.metadata.duration ? 'Optimale ✓' : 'Correcte'}` : `Smoothness: ${frameCount >= sequence.metadata.fps * sequence.metadata.duration ? 'Optimal ✓' : 'Good'}`}</p>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateFrames}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {language === 'fr' ? 'Génération...' : 'Generating...'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {language === 'fr' ? 'Générer les Images' : 'Generate Frames'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}