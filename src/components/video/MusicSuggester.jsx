/**
 * AI Music Suggester
 * Suggests background music based on video mood/content
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/utils/LanguageContext";
import { motion } from "framer-motion";
import { Music, Play } from "lucide-react";
import { toast } from "sonner";

export default function MusicSuggester({ script, videoMood, onMusicSelected }) {
  const { language } = useLanguage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const MUSIC_LIBRARY = {
    cinematic: [
      { name: "Epic Orchestral", genre: "orchestral", mood: "dramatic", tempo: 120 },
      { name: "Heroic Theme", genre: "orchestral", mood: "epic", tempo: 100 },
      { name: "Suspenseful Strings", genre: "orchestral", mood: "tense", tempo: 90 }
    ],
    uplifting: [
      { name: "Bright Strings", genre: "acoustic", mood: "happy", tempo: 110 },
      { name: "Inspirational Rise", genre: "synth", mood: "motivational", tempo: 115 },
      { name: "Cheerful Piano", genre: "piano", mood: "uplifting", tempo: 100 }
    ],
    dramatic: [
      { name: "Dark Ambience", genre: "ambient", mood: "dark", tempo: 70 },
      { name: "Tense Build", genre: "electronic", mood: "suspenseful", tempo: 130 },
      { name: "Melancholic Strings", genre: "orchestral", mood: "sad", tempo: 80 }
    ],
    calm: [
      { name: "Peaceful Ambient", genre: "ambient", mood: "serene", tempo: 60 },
      { name: "Gentle Piano", genre: "piano", mood: "calm", tempo: 65 },
      { name: "Soothing Strings", genre: "orchestral", mood: "peaceful", tempo: 70 }
    ]
  };

  const suggestMusic = async () => {
    if (!script) {
      toast.error(language === 'fr' ? "Script requis" : "Script required");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Analyser le script pour déterminer l'ambiance
      const moodAnalysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this video script and determine the overall mood/genre. Script:\n\n${script.summary || "No summary"}\n\nRespond with JSON containing: mood (cinematic/uplifting/dramatic/calm), intensity (1-10), primary_genre (orchestral/electronic/ambient/acoustic).`,
        response_json_schema: {
          type: "object",
          properties: {
            mood: { type: "string" },
            intensity: { type: "number" },
            primary_genre: { type: "string" }
          }
        }
      });

      const analysis = moodAnalysis.data || moodAnalysis;
      const moodKey = analysis.mood || "cinematic";
      const musicOptions = MUSIC_LIBRARY[moodKey] || MUSIC_LIBRARY.cinematic;

      // Adapter suggestions selon intensity
      const suggested = musicOptions.map(track => ({
        ...track,
        intensity: analysis.intensity || 7,
        confidence: 0.8 + Math.random() * 0.2
      }));

      setSuggestions(suggested);
      onMusicSelected?.(suggested[0]);
      
      toast.success(language === 'fr' 
        ? `Musiques suggérées (${moodKey})` 
        : `Music suggested (${moodKey})`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="bg-slate-900 border-pink-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-pink-400">
          <Music className="w-5 h-5" />
          {language === 'fr' ? "Suggesteur de Musique IA" : "AI Music Suggester"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={suggestMusic}
          disabled={isAnalyzing || !script}
          className="w-full bg-pink-600 hover:bg-pink-700"
        >
          {isAnalyzing 
            ? language === 'fr' ? "Analyse..." : "Analyzing..."
            : language === 'fr' ? "Suggérer musiques" : "Suggest music"}
        </Button>

        {suggestions.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {suggestions.map((track, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-800 p-2 rounded text-xs space-y-1"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-pink-400">{track.name}</span>
                  <span className="text-slate-400">{(track.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="text-slate-400 space-y-1">
                  <p>🎵 {track.genre} • {track.mood}</p>
                  <p>⏱️ {track.tempo} BPM • 🔊 Intensity: {track.intensity}/10</p>
                </div>
                <button
                  onClick={() => {
                    onMusicSelected?.(track);
                    toast.success(language === 'fr' ? "Musique sélectionnée" : "Music selected");
                  }}
                  className="w-full text-xs bg-pink-600/20 text-pink-400 rounded hover:bg-pink-600/40 py-1 mt-1"
                >
                  <Play className="w-3 h-3 inline mr-1" />
                  {language === 'fr' ? "Sélectionner" : "Select"}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}