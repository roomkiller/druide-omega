import React, { useState } from "react";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

export default function VideoSequenceBuilder({ sequence, onUpdate }) {
  const { language } = useLanguage();
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(sequence.title);

  return (
    <div className="space-y-6">
      {/* Sequence Settings */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">
            {language === 'fr' ? 'Paramètres de Séquence' : 'Sequence Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-slate-300 text-sm mb-2 block">
              {language === 'fr' ? 'Titre' : 'Title'}
            </label>
            {editingTitle ? (
              <div className="flex gap-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Button
                  onClick={() => {
                    onUpdate({ title });
                    setEditingTitle(false);
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {language === 'fr' ? 'Enregistrer' : 'Save'}
                </Button>
              </div>
            ) : (
              <motion.div
                onClick={() => setEditingTitle(true)}
                className="p-3 bg-slate-700 rounded-lg text-white cursor-pointer hover:bg-slate-600 transition"
              >
                {title}
              </motion.div>
            )}
          </div>

          {/* FPS Setting */}
          <div>
            <label className="text-slate-300 text-sm mb-3 block">
              {language === 'fr' ? `Images par seconde: ${sequence.metadata.fps}` : `Frames per second: ${sequence.metadata.fps}`}
            </label>
            <Slider
              value={[sequence.metadata.fps]}
              onValueChange={(val) => onUpdate({
                metadata: { ...sequence.metadata, fps: val[0] }
              })}
              min={12}
              max={60}
              step={1}
              className="w-full"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-slate-300 text-sm mb-3 block">
              {language === 'fr' ? `Durée: ${sequence.metadata.duration}s` : `Duration: ${sequence.metadata.duration}s`}
            </label>
            <Slider
              value={[sequence.metadata.duration]}
              onValueChange={(val) => onUpdate({
                metadata: { ...sequence.metadata, duration: val[0] }
              })}
              min={1}
              max={30}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Consciousness Level */}
          <div>
            <label className="text-slate-300 text-sm mb-3 block">
              {language === 'fr' ? `Niveau de Conscience: ${sequence.metadata.conscious_level}/15` : `Consciousness Level: ${sequence.metadata.conscious_level}/15`}
            </label>
            <Slider
              value={[sequence.metadata.conscious_level]}
              onValueChange={(val) => onUpdate({
                metadata: { ...sequence.metadata, conscious_level: val[0] }
              })}
              min={1}
              max={15}
              step={1}
              className="w-full"
            />
          </div>

          {/* Info */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="text-slate-300 text-sm">
              {language === 'fr' 
                ? `Total: ${(sequence.frames.length / sequence.metadata.fps).toFixed(1)}s de contenu`
                : `Total: ${(sequence.frames.length / sequence.metadata.fps).toFixed(1)}s of content`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}