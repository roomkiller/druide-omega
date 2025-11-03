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
      const frenchVoices = availableVoices.filter(voice => 
        voice.lang.startsWith('fr') || voice.lang.includes('FR')
      );
      setVoices(frenchVoices.length > 0 ? frenchVoices : availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (!preferences && voices.length > 0) {
      createPreferencesMutation.mutate({
        enabled: false,
        voice_name: voices[0]?.name,
        voice_lang: voices[0]?.lang || 'fr-FR',
        rate: 1.0,
        pitch: 1.0,
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
    if (voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('homme')) {
      return '🎙️ Voix Masculine';
    } else if (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('femme')) {
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
              Paramètres de Voix
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Voice Selection */}
            <div className="space-y-2">
              <Label>Voix de l'IA</Label>
              <Select
                value={preferences?.voice_name}
                onValueChange={(value) => {
                  const selectedVoice = voices.find(v => v.name === value);
                  updatePreference('voice_name', value);
                  if (selectedVoice) {
                    updatePreference('voice_lang', selectedVoice.lang);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une voix" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(groupedVoices).map(([category, categoryVoices]) => (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-slate-500">
                        {category}
                      </div>
                      {categoryVoices.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          <div className="flex items-center justify-between w-full">
                            <span>{voice.name}</span>
                            {voice.localService && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Local
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rate Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Vitesse</Label>
                <span className="text-sm text-slate-500">{preferences?.rate?.toFixed(1)}x</span>
              </div>
              <Slider
                value={[preferences?.rate || 1.0]}
                onValueChange={([value]) => updatePreference('rate', value)}
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Pitch Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Hauteur</Label>
                <span className="text-sm text-slate-500">{preferences?.pitch?.toFixed(1)}</span>
              </div>
              <Slider
                value={[preferences?.pitch || 1.0]}
                onValueChange={([value]) => updatePreference('pitch', value)}
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
              />
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