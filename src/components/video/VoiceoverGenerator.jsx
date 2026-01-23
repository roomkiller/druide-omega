/**
 * AI Voiceover Generator
 * Generates voiceovers from script using ElevenLabs
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/utils/LanguageContext";
import { motion } from "framer-motion";
import { Mic, Play, Download } from "lucide-react";
import { toast } from "sonner";

export default function VoiceoverGenerator({ script, onVoiceoverGenerated }) {
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceovers, setVoiceovers] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("21m00Tcm4TlvDq8ikWAM");

  const VOICE_OPTIONS = [
    { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", lang: "en" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Domi", lang: "en" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Belle", lang: "en" },
    { id: "XrExE9yKIg1WjnnlVkGX", name: "Elli", lang: "en" }
  ];

  const generateVoiceovers = async () => {
    if (!script?.scenes?.length) {
      toast.error(language === 'fr' ? "Script requis" : "Script required");
      return;
    }

    setIsGenerating(true);
    try {
      const generatedVoiceovers = await Promise.all(
        script.scenes
          .filter(scene => scene.narration)
          .map(async (scene) => {
            // Appel API ElevenLabs via backend pour respecter les limites CORS
            const response = await base44.functions.invoke('elevenLabsTTS', {
              text: scene.narration,
              voice_id: selectedVoice,
              scene_number: scene.sceneNumber
            });

            return {
              sceneNumber: scene.sceneNumber,
              text: scene.narration,
              audioUrl: response.data.audio_url || response.audio_url,
              duration: response.data.duration || 0
            };
          })
      );

      setVoiceovers(generatedVoiceovers);
      onVoiceoverGenerated?.(generatedVoiceovers);
      
      toast.success(language === 'fr' 
        ? `${generatedVoiceovers.length} voix générées` 
        : `${generatedVoiceovers.length} voiceovers generated`);
    } catch (error) {
      toast.error(`Voiceover error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-slate-900 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Mic className="w-5 h-5" />
          {language === 'fr' ? "Générateur de Voix IA" : "AI Voiceover Generator"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 mb-2 block">
            {language === 'fr' ? "Sélectionnez voix:" : "Select voice:"}
          </label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300"
          >
            {VOICE_OPTIONS.map(voice => (
              <option key={voice.id} value={voice.id}>{voice.name}</option>
            ))}
          </select>
        </div>

        <Button
          onClick={generateVoiceovers}
          disabled={isGenerating || !script?.scenes?.length}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isGenerating 
            ? language === 'fr' ? "Génération..." : "Generating..."
            : language === 'fr' ? "Générer voix" : "Generate voiceovers"}
        </Button>

        {voiceovers.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 max-h-64 overflow-y-auto">
            {voiceovers.map((vo) => (
              <div key={vo.sceneNumber} className="bg-slate-800 p-2 rounded text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-purple-400">Scène {vo.sceneNumber}</span>
                  <span className="text-slate-400">{vo.duration?.toFixed(1)}s</span>
                </div>
                <p className="text-slate-400 line-clamp-2">{vo.text}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      const audio = new Audio(vo.audioUrl);
                      audio.play();
                    }}
                    className="flex-1 text-xs bg-purple-600/20 text-purple-400 rounded hover:bg-purple-600/40 py-1"
                  >
                    <Play className="w-3 h-3 inline mr-1" />
                    {language === 'fr' ? "Écouter" : "Play"}
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}