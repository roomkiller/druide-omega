import React from "react";
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
import Tooltip from "../ui/Tooltip";
import { safeToFixed, safeNumber } from "@/components/utils/SafeNumber";

export default function TTSControls() {
  const { 
    isEnabled, 
    toggleEnabled, 
    autoPlay, 
    setAutoPlay,
    rate,
    setRate,
    pitch,
    setPitch
  } = useTTS();

  const safeRate = safeNumber(rate, 1);
  const safePitch = safeNumber(pitch, 1);

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
                  onCheckedChange={setAutoPlay}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Vitesse: {safeToFixed(safeRate, 1)}x</Label>
                <Slider
                  value={[safeRate]}
                  onValueChange={([v]) => setRate(v)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Ton: {safeToFixed(safePitch, 1)}</Label>
                <Slider
                  value={[safePitch]}
                  onValueChange={([v]) => setPitch(v)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}