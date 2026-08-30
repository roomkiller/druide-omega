import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Mic, MicOff, Volume2, Zap, PhoneOff, Radio } from "lucide-react";

export default function DialogueControls({
  active, isListening, isSpeaking, autonomy, setAutonomy,
  lastPressure, onOpen, onClose, onSpeakNow
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {!active ? (
        <Button
          onClick={onOpen}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg"
        >
          <Radio className="w-4 h-4 mr-2" />
          Ouvrir la salle
        </Button>
      ) : (
        <>
          <Button onClick={onClose} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
            <PhoneOff className="w-4 h-4 mr-2" />
            Fermer
          </Button>
          <Button onClick={onSpeakNow} variant="outline" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Qu'il parle maintenant
          </Button>
        </>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-slate-600">Initiative</span>
        <Switch checked={autonomy} onCheckedChange={setAutonomy} />
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full">
        <Badge variant={isListening ? "default" : "secondary"} className="text-xs">
          {isListening ? <Mic className="w-3 h-3 mr-1" /> : <MicOff className="w-3 h-3 mr-1" />}
          {isListening ? 'écoute' : 'micro au repos'}
        </Badge>
        {isSpeaking && (
          <Badge className="text-xs bg-violet-600">
            <Volume2 className="w-3 h-3 mr-1" />il parle
          </Badge>
        )}
        {lastPressure && (
          <Badge variant="outline" className="text-xs">
            pression {lastPressure.score}/10 · seuil {lastPressure.threshold}
            {lastPressure.dominant ? ` · ${lastPressure.dominant}` : ''}
            {lastPressure.spoke === false ? ' · silence choisi' : ''}
          </Badge>
        )}
      </div>
    </div>
  );
}