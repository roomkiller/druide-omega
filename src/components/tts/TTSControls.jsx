import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Settings, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function TTSControls() {
  const [voices, setVoices] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: preferences } = useQuery({
    queryKey: ['ttsPreferences'],
    queryFn: async () => {
      const prefs = await base44.entities.TTSPreferences.list();
      return prefs[0] || null;
    },
  });

  const createPreferencesMutation = useMutation({
    mutationFn: (data) => base44.entities.TTSPreferences.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ttsPreferences'] });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TTSPreferences.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ttsPreferences'] });
    },
  });

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      
      // Filter and sort French voices, prioritizing male voices
      const frenchVoices = availableVoices.filter(voice => 
        voice.lang.startsWith('fr') || voice.lang.includes('FR')
      );
      
      // Separate male and female voices
      const maleVoices = frenchVoices.filter(voice => 
        voice.name.toLowerCase().includes('male') || 
        voice.name.toLowerCase().includes('homme') ||
        voice.name.toLowerCase().includes('thomas') ||
        voice.name.toLowerCase().includes('daniel') ||
        voice.name.toLowerCase().includes('paul') ||
        voice.name.toLowerCase().includes('marc') ||
        !voice.name.toLowerCase().includes('female') && 
        !voice.name.toLowerCase().includes('femme')
      );
      
      const femaleVoices = frenchVoices.filter(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('femme')
      );
      
      // Prioritize male voices first, then female
      const sortedVoices = [...maleVoices, ...femaleVoices];
      
      setVoices(sortedVoices.length > 0 ? sortedVoices : availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (!preferences && voices.length > 0) {
      // Find the best male French voice
      const preferredVoice = voices.find(v => 
        (v.name.toLowerCase().includes('thomas') || 
         v.name.toLowerCase().includes('daniel') ||
         v.name.toLowerCase().includes('male') ||
         v.name.toLowerCase().includes('homme')) &&
        (v.lang.startsWith('fr') || v.lang.includes('FR'))
      ) || voices[0];

      createPreferencesMutation.mutate({
        enabled: false,
        voice_name: preferredVoice.name,
        voice_lang: preferredVoice.lang || 'fr-FR',
        rate: 0.9, // Slightly slower for a softer sound
        pitch: 0.95, // Slightly lower pitch for male voice
        auto_play: false
      });
    }
  }, [voices, preferences]);

  const toggleTTS = () => {
    if (!preferences) return;
    
    const newEnabled = !preferences.enabled;
    updatePreferencesMutation.mutate({
      id: preferences.id,
      data: { ...preferences, enabled: newEnabled }
    });
  };

  const updatePreference = (key, value) => {
    if (!preferences) return;
    
    updatePreferencesMutation.mutate({
      id: preferences.id,
      data: { ...preferences, [key]: value }
    });
  };

  const getVoiceCategory = (voice) => {
    const name = voice.name.toLowerCase();
    if (name.includes('male') && !name.includes('female') || 
        name.includes('homme') ||
        name.includes('thomas') ||
        name.includes('daniel') ||
        name.includes('paul') ||
        name.includes('marc')) {
      return '🎙️ Voix Masculine (Recommandé)';
    } else if (name.includes('female') || name.includes('femme')) {
      return '🎤 Voix Féminine';
    }
    return '🔊 Autres Voix';
  };

  const groupedVoices = voices.reduce((groups, voice) => {
    const category = getVoiceCategory(voice);
    if (!groups[category]) groups[category] = [];
    groups[category].push(voice);
    return groups;
  }, {});

  // Sort groups to put male voices first
  const sortedGroupedVoices = Object.entries(groupedVoices).sort((a, b) => {
    if (a[0].includes('Masculine')) return -1;
    if (b[0].includes('Masculine')) return 1;
    return 0;
  });

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={preferences?.enabled ? "default" : "outline"}
        size="sm"
        onClick={toggleTTS}
        className={preferences?.enabled 
          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" 
          : "border-purple-200 hover:bg-purple-50"
        }
      >
        {preferences?.enabled ? (
          <>
            <Volume2 className="w-4 h-4 mr-2" />
            Voix Active
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 mr-2" />
            Voix Désactivée
          </>
        )}
      </Button>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="border-purple-200 hover:bg-purple-50">
            <Settings className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-purple-600" />
              Paramètres de Voix - Configuration Homme Douce
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Voice Selection */}
            <div className="space-y-2">
              <Label>Voix de l'IA (Masculine Recommandée)</Label>
              <Select
                value={preferences?.voice_name}
                onValueChange={(value) => {
                  const selectedVoice = voices.find(v => v.name === value);
                  updatePreference('voice_name', value);
                  if (selectedVoice) {
                    updatePreference('voice_lang', selectedVoice.lang);
                    // Auto-adjust pitch for male voices
                    if (getVoiceCategory(selectedVoice).includes('Masculine')) {
                      updatePreference('pitch', 0.95);
                    }
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une voix" />
                </SelectTrigger>
                <SelectContent>
                  {sortedGroupedVoices.map(([category, categoryVoices]) => (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-slate-500">
                        {category}
                      </div>
                      {categoryVoices.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          <div className="flex items-center justify-between w-full">
                            <span>{voice.name}</span>
                            <div className="flex items-center gap-2 ml-2">
                              {voice.localService && (
                                <Badge variant="outline" className="text-xs">
                                  Local
                                </Badge>
                              )}
                              {getVoiceCategory(voice).includes('Masculine') && (
                                <Badge className="text-xs bg-green-100 text-green-700">
                                  Recommandé
                                </Badge>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 mt-1">
                💡 Les voix masculines offrent un ton plus doux et chaleureux
              </p>
            </div>

            {/* Rate Control - Optimized for softness */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Vitesse (Plus lente = Plus douce)</Label>
                <span className="text-sm text-slate-500">{preferences?.rate?.toFixed(2)}x</span>
              </div>
              <Slider
                value={[preferences?.rate || 0.9]}
                onValueChange={([value]) => updatePreference('rate', value)}
                min={0.5}
                max={1.5}
                step={0.05}
                className="w-full"
              />
              <p className="text-xs text-slate-500">
                Recommandé: 0.85 - 0.95 pour une voix douce et posée
              </p>
            </div>

            {/* Pitch Control - Optimized for male voice */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Hauteur (Plus basse = Plus masculine)</Label>
                <span className="text-sm text-slate-500">{preferences?.pitch?.toFixed(2)}</span>
              </div>
              <Slider
                value={[preferences?.pitch || 0.95]}
                onValueChange={([value]) => updatePreference('pitch', value)}
                min={0.7}
                max={1.3}
                step={0.05}
                className="w-full"
              />
              <p className="text-xs text-slate-500">
                Recommandé: 0.90 - 1.00 pour une voix masculine naturelle
              </p>
            </div>

            {/* Preset buttons */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Préréglages :</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updatePreference('rate', 0.9);
                    updatePreference('pitch', 0.95);
                  }}
                  className="text-xs"
                >
                  🎙️ Voix Douce (Recommandé)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updatePreference('rate', 0.85);
                    updatePreference('pitch', 0.90);
                  }}
                  className="text-xs"
                >
                  🌙 Voix Apaisante
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updatePreference('rate', 1.0);
                    updatePreference('pitch', 1.0);
                  }}
                  className="text-xs"
                >
                  ⚡ Voix Dynamique
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updatePreference('rate', 0.95);
                    updatePreference('pitch', 0.85);
                  }}
                  className="text-xs"
                >
                  🎬 Voix Grave
                </Button>
              </div>
            </div>

            {/* Auto Play */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Lecture automatique</Label>
                <p className="text-xs text-slate-500">
                  Lire automatiquement les nouvelles pensées
                </p>
              </div>
              <Switch
                checked={preferences?.auto_play || false}
                onCheckedChange={(checked) => updatePreference('auto_play', checked)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setSettingsOpen(false)}>
              <Check className="w-4 h-4 mr-2" />
              Terminé
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}