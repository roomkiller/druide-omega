import React, { useRef, useState } from "react";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Upload, Play, Trash2, Volume2 } from "lucide-react";
import { toast } from "sonner";

export default function AudioEditor({ sequence, onAudioUpdate }) {
  const { language } = useLanguage();
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Créer un blob URL pour l'aperçu
    const url = URL.createObjectURL(file);
    
    // Récupérer la durée
    const audio = new Audio(url);
    audio.onloadedmetadata = () => {
      onAudioUpdate({
        url,
        duration: audio.duration,
        volume: sequence.audio.volume,
        filename: file.name
      });
      toast.success(language === 'fr' ? 'Audio ajouté' : 'Audio added');
    };
  };

  const removeAudio = () => {
    onAudioUpdate({ url: null, duration: 0, volume: 1 });
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">{language === 'fr' ? 'Piste Audio' : 'Audio Track'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!sequence.audio.url ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-8 border-2 border-dashed border-slate-500 rounded-lg hover:border-purple-500 hover:bg-slate-600/50 transition"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-slate-300">{language === 'fr' ? 'Cliquez ou glissez un fichier audio' : 'Click or drag audio file'}</p>
              <p className="text-xs text-slate-500 mt-1">MP3, WAV, M4A</p>
            </motion.button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="bg-slate-800 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-semibold">{sequence.audio.filename}</p>
                    <p className="text-xs text-slate-400">{sequence.audio.duration.toFixed(2)}s</p>
                  </div>
                  <Button onClick={togglePlayback} className="bg-purple-600 hover:bg-purple-700" size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>

                <audio
                  ref={audioRef}
                  src={sequence.audio.url}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onEnded={() => setIsPlaying(false)}
                />

                {/* Waveform simulation */}
                <div className="bg-slate-900 h-12 rounded flex items-center px-2">
                  <div className="flex-1 flex items-center justify-center gap-1 h-8">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-sm flex-1"
                        style={{
                          height: `${Math.random() * 100}%`,
                          opacity: currentTime > (i / 20) * sequence.audio.duration ? 0.5 : 0.2
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 text-xs text-slate-400">
                  <span>{(currentTime).toFixed(2)}s</span>
                  <span className="flex-1" />
                  <span>{sequence.audio.duration.toFixed(2)}s</span>
                </div>
              </div>

              {/* Volume Control */}
              <div>
                <label className="text-slate-300 text-sm flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4" />
                  {language === 'fr' ? 'Volume' : 'Volume'}: {Math.round(sequence.audio.volume * 100)}%
                </label>
                <Slider
                  value={[sequence.audio.volume]}
                  onValueChange={(val) => onAudioUpdate({ ...sequence.audio, volume: val[0] })}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>

              <Button onClick={removeAudio} variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                {language === 'fr' ? 'Supprimer Audio' : 'Remove Audio'}
              </Button>
            </motion.div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
}