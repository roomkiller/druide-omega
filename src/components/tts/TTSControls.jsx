import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Settings } from "lucide-react";
import { useTTS } from "./useTTS";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Tooltip from "../ui/Tooltip";
import { safeToFixed, safeNumber } from "@/components/utils/SafeNumber";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";

const ELEVENLABS_VOICES = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella" },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold" },
  { id: "pqHfZKP75CvOlQylNhV4", name: "Bill" },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam" },
];

export default function TTSControls() {
  const { 
    isEnabled, 
    autoPlay, 
    useElevenLabs
  } = useTTS();

  const [localRate, setLocalRate] = useState(1);
  const [localPitch, setLocalPitch] = useState(1);
  const queryClient = useQueryClient();

  const toggleEnabled = async () => {
    const prefs = await base44.entities.TTSPreferences.list();
    if (prefs[0]) {
      await base44.entities.TTSPreferences.update(prefs[0].id, { 
        enabled: !prefs[0].enabled 
      });
    } else {
      await base44.entities.TTSPreferences.create({ 
        enabled: true,
        use_elevenlabs: true,
        elevenlabs_voice_id: "21m00Tcm4TlvDq8ikWAM"
      });
    }
    queryClient.invalidateQueries({ queryKey: ['ttsPreferences'] });
  };

  const toggleAutoPlay = async () => {
    const prefs = await base44.entities.TTSPreferences.list();
    if (prefs[0]) {
      await base44.entities.TTSPreferences.update(prefs[0].id, { 
        auto_play: !prefs[0].auto_play 
      });
      queryClient.invalidateQueries({ queryKey: ['ttsPreferences'] });
    }
  };

  const toggleElevenLabs = async () => {
    const prefs = await base44.entities.TTSPreferences.list();
    if (prefs[0]) {
      await base44.entities.TTSPreferences.update(prefs[0].id, { 
        use_elevenlabs: !prefs[0].use_elevenlabs 
      });
      queryClient.invalidateQueries({ queryKey: ['ttsPreferences'] });
    }
  };

  const updateVoice = async (voiceId) => {
    const prefs = await base44.entities.TTSPreferences.list();
    if (prefs[0]) {
      await base44.entities.TTSPreferences.update(prefs[0].id, { 
        elevenlabs_voice_id: voiceId 
      });
      queryClient.invalidateQueries({ queryKey: ['ttsPreferences'] });
    }
  };

  const updateRate = async (value) => {
    setLocalRate(value);
    const prefs = await base44.entities.TTSPreferences.list();
    if (prefs[0]) {
      await base44.entities.TTSPreferences.update(prefs[0].id, { rate: value });
      queryClient.invalidateQueries({ queryKey: ['ttsPreferences'] });
    }
  };

  const updatePitch = async (value) => {
    setLocalPitch(value);
    const prefs = await base44.entities.TTSPreferences.list();
    if (prefs[0]) {
      await base44.entities.TTSPreferences.update(prefs[0].id, { pitch: value });
      queryClient.invalidateQueries({ queryKey: ['ttsPreferences'] });
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Tooltip content={isEnabled ? "TTS activé" : "TTS désactivé"}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleEnabled}
          className={`h-8 w-8 sm:h-9 sm:w-9 ${isEnabled ? 'text-purple-600 bg-purple-50' : 'text-slate-400'}`}
        >
          {isEnabled ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </Button>
      </Tooltip>

      {isEnabled && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 sm:w-80" align="end">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm sm:text-base">Paramètres TTS</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="autoplay" className="text-xs sm:text-sm">Lecture auto</Label>
                <Switch
                  id="autoplay"
                  checked={autoPlay}
                  onCheckedChange={toggleAutoPlay}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="elevenlabs" className="text-xs sm:text-sm">
                  ElevenLabs 🎙️
                  <span className="block text-xs text-slate-500">Voix naturelle</span>
                </Label>
                <Switch
                  id="elevenlabs"
                  checked={useElevenLabs}
                  onCheckedChange={toggleElevenLabs}
                />
              </div>

              {useElevenLabs && (
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Voix ElevenLabs</Label>
                  <Select onValueChange={updateVoice} defaultValue="21m00Tcm4TlvDq8ikWAM">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choisir une voix" />
                    </SelectTrigger>
                    <SelectContent>
                      {ELEVENLABS_VOICES.map(voice => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {!useElevenLabs && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm">Vitesse: {safeToFixed(localRate, 1)}x</Label>
                    <Slider
                      value={[localRate]}
                      onValueChange={([v]) => updateRate(v)}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm">Ton: {safeToFixed(localPitch, 1)}</Label>
                    <Slider
                      value={[localPitch]}
                      onValueChange={([v]) => updatePitch(v)}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}