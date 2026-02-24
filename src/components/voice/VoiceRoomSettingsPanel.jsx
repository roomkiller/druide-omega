import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function VoiceRoomSettingsPanel({
  handsFreeModeEnabled,
  onHandsFreeModeChange,
  autoRestartListening,
  onAutoRestartListeningChange
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Paramètres VoiceRoom</DialogTitle>
      </DialogHeader>
      <div className="space-y-6 py-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="hands-free">Mode mains libres</Label>
            <Switch 
              id="hands-free"
              checked={handsFreeModeEnabled} 
              onCheckedChange={onHandsFreeModeChange}
            />
          </div>
          <p className="text-xs text-slate-500">Active le microphone automatiquement après chaque réponse</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-restart">Redémarrage automatique</Label>
            <Switch 
              id="auto-restart"
              checked={autoRestartListening} 
              onCheckedChange={onAutoRestartListeningChange}
            />
          </div>
          <p className="text-xs text-slate-500">Redémarre l'écoute automatiquement en fin de réponse</p>
        </div>
      </div>
    </>
  );
}