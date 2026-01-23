import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { FrameGenerationEngine } from "./FrameGenerationEngine";
import { TransitionOptimizer } from "./TransitionOptimizer";

export default function ConsciousFrameGenerator({ sequence, onFramesAdded }) {
  const { language } = useLanguage();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [frameCount, setFrameCount] = useState(6);
  const [progress, setProgress] = useState(0);
  const [qualityMetrics, setQualityMetrics] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("");

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
    setCurrentStatus(language === 'fr' ? "Initialisation..." : "Initializing...");
    setQualityMetrics(null);

    try {
      // Créer l'engine de génération
      const engine = new FrameGenerationEngine(
        { ...sequence, metadata: { ...sequence.metadata, frameCount } },
        (progress, batchSize) => {
          setProgress(Math.round(progress));
          setCurrentStatus(language === 'fr' 
            ? `Génération en cours: ${batchSize} images/batch` 
            : `Generating: ${batchSize} images/batch`);
        }
      );

      // Générer les frames
      setCurrentStatus(language === 'fr' ? "Création des images..." : "Creating images...");
      const generatedFrames = await engine.generateAllFrames(prompt, style, frameCount);

      if (!generatedFrames || generatedFrames.length === 0) {
        throw new Error("No frames generated");
      }

      // Générer les transitions
      setCurrentStatus(language === 'fr' ? "Optimisation des transitions..." : "Optimizing transitions...");
      const transitions = TransitionOptimizer.generateTransitionMap(generatedFrames, style);

      // Analyser la qualité
      const metrics = engine.analyzeQuality(generatedFrames);
      setQualityMetrics(metrics);

      // Ajouter les frames avec transitions
      const framesWithTransitions = generatedFrames.map((frame, idx) => ({
        ...frame,
        transition: transitions[idx]
      }));

      onFramesAdded(framesWithTransitions);
      
      toast.success(language === 'fr' 
        ? `${frameCount} images générées - Continuité: ${metrics.continuity}, Qualité: ${metrics.consistency}` 
        : `${frameCount} frames generated - Continuity: ${metrics.continuity}, Quality: ${metrics.consistency}`);
      
      setPrompt("");
      setProgress(100);
      setCurrentStatus(language === 'fr' ? "Complété!" : "Complete!");
    } catch (error) {
      console.error("Erreur génération:", error);
      toast.error(`${error.message}`);
      setCurrentStatus(language === 'fr' ? "Erreur" : "Error");
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setProgress(0);
        setCurrentStatus("");
      }, 2000);
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

          {/* Frame Count */}
          <div className="space-y-3">
            <label className="text-slate-300 text-sm mb-2 block">
              {language === 'fr' ? 'Nombre d\'images à générer: ' : 'Number of frames to generate: '}
              <span className="text-purple-400 font-bold">{frameCount}</span>
            </label>
            <Slider
              value={[frameCount]}
              onValueChange={(val) => setFrameCount(val[0])}
              min={5}
              max={60}
              step={5}
              disabled={isGenerating}
            />
            <div className="space-y-1 text-xs text-slate-400">
              <p>
                {language === 'fr' 
                  ? `⏱️ Durée vidéo: ${(frameCount / 24 * 60).toFixed(1)} sec (24 FPS)` 
                  : `⏱️ Video duration: ${(frameCount / 24 * 60).toFixed(1)} sec (24 FPS)`}
              </p>
              <p>
                {language === 'fr' 
                  ? `⚡ Génération: ~${Math.ceil(frameCount / 3) * 20}s (${Math.ceil(frameCount / 3)} batches)` 
                  : `⚡ Generation: ~${Math.ceil(frameCount / 3) * 20}s (${Math.ceil(frameCount / 3)} batches)`}
              </p>
              {frameCount > 30 && (
                <p className="text-purple-400">
                  {language === 'fr' ? '✓ Max durée: ~2.5 min' : '✓ Max duration: ~2.5 min'}
                </p>
              )}
            </div>
          </div>

          {/* Progress & Status */}
          {isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{currentStatus}</span>
                <span className="font-bold text-purple-400">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}

          {/* Quality Metrics */}
          {qualityMetrics && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 p-3 rounded-lg border border-green-500/30 space-y-2">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold">{language === 'fr' ? 'Métriques' : 'Metrics'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div>📊 Frames: {qualityMetrics.frameCount}</div>
                <div>🔗 Continuité: {qualityMetrics.continuity}</div>
                <div>✓ Qualité: {qualityMetrics.consistency}</div>
                <div>⏱️ ~{qualityMetrics.avgGenerationTime / 1000}s total</div>
              </div>
            </motion.div>
          )}

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