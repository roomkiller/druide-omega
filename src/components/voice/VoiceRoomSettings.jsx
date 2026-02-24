import React, { useState } from "react";
import { useTTS } from "@/components/tts/useTTS";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { safeToFixed } from "@/components/utils/SafeNumber";

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

export default function VoiceRoomSettings({ 
  handsFreeModeEnabled, 
  onHandsFreeModeChange,
  autoRestartListening,
  onAutoRestartListeningChange,
  t
}) {
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
    <>
      <DialogHeader>
        <DialogTitle>Paramètres VoiceRoom</DialogTitle>
      </DialogHeader>
      <div className="space-y-6 py-4 max-h-96 overflow-y-auto">
        {/* Hands-Free Mode */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="hands-free-mode" className="text-sm">
              Mode mains libres
            </Label>
            <p className="text-xs text-slate-500">
              Démarrage automatique du microphone
            </p>
          </div>
          <Switch
            id="hands-free-mode"
            checked={handsFreeModeEnabled}
            onCheckedChange={onHandsFreeModeChange}
          />
        </div>

        {/* Auto Restart Listening */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-restart-listening" className="text-sm">
              Redémarrage automatique
            </Label>
            <p className="text-xs text-slate-500">
              Relancer l'écoute après chaque réponse
            </p>
          </div>
          <Switch
            id="auto-restart-listening"
            checked={autoRestartListening}
            onCheckedChange={onAutoRestartListeningChange}
          />
        </div>

        <Separator />

        {/* TTS Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Synthèse Vocale (TTS)</h3>

          {/* TTS Enable/Disable */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="tts-enabled" className="text-sm">
                Activer TTS
              </Label>
              <p className="text-xs text-slate-500">
                Lecture vocale des réponses
              </p>
            </div>
            <Switch
              id="tts-enabled"
              checked={isEnabled}
              onCheckedChange={toggleEnabled}
            />
          </div>

          {isEnabled && (
            <>
              {/* Auto Play */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="tts-autoplay" className="text-sm">
                    Lecture automatique
                  </Label>
                  <p className="text-xs text-slate-500">
                    Jouer automatiquement les réponses
                  </p>
                </div>
                <Switch
                  id="tts-autoplay"
                  checked={autoPlay}
                  onCheckedChange={toggleAutoPlay}
                />
              </div>

              <Separator />

              {/* ElevenLabs Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="elevenlabs" className="text-sm">
                    ElevenLabs 🎙️
                  </Label>
                  <p className="text-xs text-slate-500">
                    Voix naturelle haute qualité
                  </p>
                </div>
                <Switch
                  id="elevenlabs"
                  checked={useElevenLabs}
                  onCheckedChange={toggleElevenLabs}
                />
              </div>

              {useElevenLabs ? (
                /* ElevenLabs Voice Selection */
                <div className="space-y-2">
                  <Label className="text-sm">Voix ElevenLabs</Label>
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
              ) : (
                /* Native TTS Controls */
                <>
                  <div className="space-y-2">
                    <Label className="text-sm">
                      Vitesse: {safeToFixed(localRate, 1)}x
                    </Label>
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
                    <Label className="text-sm">
                      Ton: {safeToFixed(localPitch, 1)}
                    </Label>
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
            </>
          )}
        </div>
      </div>
    </>
  );
}