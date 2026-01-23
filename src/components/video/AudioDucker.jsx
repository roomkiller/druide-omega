/**
 * Intelligent Audio Ducking
 * Automatically adjusts volume for voiceovers and music
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/components/utils/LanguageContext";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { toast } from "sonner";

export default function AudioDucker({ audioTracks, voiceovers, onDuckingApplied }) {
  const { language } = useLanguage();
  const [musicReduction, setMusicReduction] = useState(40);
  const [voiceBoost, setVoiceBoost] = useState(20);
  const [isApplying, setIsApplying] = useState(false);
  const [duckingResult, setDuckingResult] = useState(null);

  const applyDucking = async () => {
    if (!audioTracks && !voiceovers) {
      toast.error(language === 'fr' ? "Audio/voix requis" : "Audio/voiceover required");
      return;
    }

    setIsApplying(true);
    try {
      // Créer automations de ducking pour chaque voiceover
      const duckingAutomation = voiceovers?.map((vo, idx) => ({
        voiceoverIndex: idx,
        sceneNumber: vo.sceneNumber,
        duration: vo.duration,
        musicReduction: musicReduction / 100,
        voiceBoost: voiceBoost / 100,
        startTime: vo.sceneNumber * 2,
        envelope: {
          attack: 0.05,
          release: 0.1
        }
      })) || [];

      // Appliquer aussi à la piste musicale principale
      const adjustedMusic = audioTracks?.map(track => ({
        ...track,
        ducking: {
          enabled: true,
          reduction: musicReduction / 100,
          automation: duckingAutomation
        }
      })) || [];

      setDuckingResult({
        trackCount: adjustedMusic.length,
        voiceoverCount: voiceovers?.length || 0,
        musicReduction: musicReduction,
        voiceBoost: voiceBoost
      });

      onDuckingApplied?.({
        music: adjustedMusic,
        voiceovers: voiceovers,
        automation: duckingAutomation
      });

      toast.success(language === 'fr' ? "Ducking appliqué" : "Ducking applied");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Card className="bg-slate-900 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Volume2 className="w-5 h-5" />
          {language === 'fr' ? "Ducking Audio Intelligent" : "Intelligent Audio Ducking"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 mb-2 block">
            {language === 'fr' ? "Réduction musique:" : "Music reduction:"} 
            <span className="text-purple-400 ml-2">{musicReduction}%</span>
          </label>
          <Slider
            value={[musicReduction]}
            onValueChange={(val) => setMusicReduction(val[0])}
            min={0}
            max={100}
            step={5}
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-2 block">
            {language === 'fr' ? "Amplification voix:" : "Voice boost:"} 
            <span className="text-purple-400 ml-2">+{voiceBoost}dB</span>
          </label>
          <Slider
            value={[voiceBoost]}
            onValueChange={(val) => setVoiceBoost(val[0])}
            min={0}
            max={50}
            step={5}
          />
        </div>

        <div className="text-xs text-slate-500 bg-slate-800 p-2 rounded space-y-1">
          <p>📊 {language === 'fr' ? "Ratio final:" : "Final ratio:"} 1:{(musicReduction / (100 - musicReduction)).toFixed(1)}</p>
          <p>🔊 {language === 'fr' ? "Gain voix:" : "Voice gain:"} +{voiceBoost}dB</p>
        </div>

        <Button
          onClick={applyDucking}
          disabled={isApplying || (!audioTracks && !voiceovers)}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isApplying 
            ? language === 'fr' ? "Application..." : "Applying..."
            : language === 'fr' ? "Appliquer ducking" : "Apply ducking"}
        </Button>

        {duckingResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800 p-2 rounded text-xs space-y-1 text-slate-300">
            <p>🎵 {duckingResult.trackCount} piste(s) audio</p>
            <p>🎤 {duckingResult.voiceoverCount} voix appliquées</p>
            <p>✓ Ducking configuré avec succès</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}