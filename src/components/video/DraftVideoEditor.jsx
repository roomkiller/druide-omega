/**
 * Automatic Draft Video Editor
 * Creates draft edits from frames + AI scene detection
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/utils/LanguageContext";
import { motion } from "framer-motion";
import { Wand2, Check } from "lucide-react";
import { toast } from "sonner";

export default function DraftVideoEditor({ frames, scenes, onDraftCreated }) {
  const { language } = useLanguage();
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState(null);

  const createDraft = async () => {
    if (!frames?.length || !scenes?.length) {
      toast.error(language === 'fr' ? "Frames et scènes requis" : "Frames and scenes required");
      return;
    }

    setIsCreating(true);
    try {
      // Créer une édition automatique en assignant frames aux scènes
      const draftEdit = scenes.map((scene, idx) => {
        const sceneFrames = frames.slice(
          scene.startFrame,
          Math.min(scene.endFrame + 1, frames.length)
        );

        return {
          sceneId: scene.id,
          sceneNumber: idx + 1,
          type: scene.type,
          frames: sceneFrames,
          duration: scene.endFrame - scene.startFrame + 1,
          transitions: sceneFrames.map((f, i) => ({
            from: i,
            to: i + 1,
            type: this.selectTransition(idx, scenes.length)
          })),
          effects: this.suggestEffects(scene.type),
          pacing: this.calculatePacing(idx, scenes.length)
        };
      });

      setDraft(draftEdit);
      onDraftCreated?.(draftEdit);
      
      toast.success(language === 'fr' ? "Édition créée" : "Draft created");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const selectTransition = (sceneIdx, total) => {
    const transitions = ["fade", "dissolve", "crossfade", "slideLeft"];
    return transitions[sceneIdx % transitions.length];
  };

  const suggestEffects = (sceneType) => {
    const effectMap = {
      establishing: ["color_grade", "vignette"],
      action: ["dynamic_zoom", "vibration"],
      dialog: ["subtle_blur", "focus"],
      climax: ["brightness_boost", "saturation_up"]
    };
    return effectMap[sceneType] || [];
  };

  const calculatePacing = (sceneIdx, total) => {
    if (sceneIdx < total * 0.3) return "slow";
    if (sceneIdx < total * 0.7) return "medium";
    return "slow";
  };

  return (
    <Card className="bg-slate-900 border-cyan-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <Wand2 className="w-5 h-5" />
          {language === 'fr' ? "Éditeur Automatique" : "Automatic Editor"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={createDraft}
          disabled={isCreating || !frames?.length}
          className="w-full bg-cyan-600 hover:bg-cyan-700"
        >
          {isCreating 
            ? language === 'fr' ? "Création..." : "Creating..."
            : language === 'fr' ? "Créer édition" : "Create draft"}
        </Button>

        {draft && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {draft.map((scene) => (
              <div key={scene.sceneId} className="bg-slate-800 p-2 rounded text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-cyan-400">Scène {scene.sceneNumber}</span>
                  <span className="text-slate-400">{scene.frames.length} frames</span>
                </div>
                <div className="text-slate-400 space-y-1">
                  <p>📍 Type: <span className="capitalize text-cyan-300">{scene.type}</span></p>
                  <p>⏱️ Pacing: <span className="capitalize text-cyan-300">{scene.pacing}</span></p>
                  {scene.transitions[0] && (
                    <p>➜ Transition: <span className="text-cyan-300">{scene.transitions[0].type}</span></p>
                  )}
                  {scene.effects.length > 0 && (
                    <p>✨ Effects: {scene.effects.join(", ")}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}