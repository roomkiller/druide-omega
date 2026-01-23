import React, { useState } from "react";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const EFFECTS = [
  { id: "fade", label: "🎬 Fade", description: "Fondu progressif" },
  { id: "blur", label: "🌫️ Blur", description: "Flou progressif" },
  { id: "brightness", label: "☀️ Brightness", description: "Luminosité" },
  { id: "contrast", label: "🎨 Contrast", description: "Contraste" },
  { id: "saturate", label: "🌈 Saturate", description: "Saturation" },
  { id: "sepia", label: "📷 Sepia", description: "Effet sépia" },
  { id: "grayscale", label: "⚫ Grayscale", description: "Noir et blanc" },
  { id: "huerotate", label: "🔄 Hue Rotate", description: "Rotation teinte" },
];

export default function EffectsPanel({ sequence, onEffectsUpdate }) {
  const { language } = useLanguage();
  const [selectedEffectId, setSelectedEffectId] = useState(null);

  const addEffect = (effectId) => {
    const effect = EFFECTS.find(e => e.id === effectId);
    const newEffect = {
      id: Date.now(),
      type: effectId,
      intensity: 0.5,
      startFrame: 0,
      endFrame: sequence.frames.length - 1
    };
    onEffectsUpdate([...sequence.effects, newEffect]);
    setSelectedEffectId(newEffect.id);
    toast.success(language === 'fr' ? 'Effet ajouté' : 'Effect added');
  };

  const updateEffect = (effectId, updates) => {
    onEffectsUpdate(sequence.effects.map(e => e.id === effectId ? { ...e, ...updates } : e));
  };

  const removeEffect = (effectId) => {
    onEffectsUpdate(sequence.effects.filter(e => e.id !== effectId));
  };

  const selectedEffect = sequence.effects.find(e => e.id === selectedEffectId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Available Effects */}
      <Card className="bg-slate-700 border-slate-600 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-white text-sm">{language === 'fr' ? 'Effets Disponibles' : 'Available Effects'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {EFFECTS.map(effect => (
            <motion.button
              key={effect.id}
              whileHover={{ x: 5 }}
              onClick={() => addEffect(effect.id)}
              className="w-full p-3 rounded-lg bg-slate-600 hover:bg-slate-500 transition text-left"
            >
              <p className="text-white font-semibold text-sm">{effect.label}</p>
              <p className="text-xs text-slate-400">{effect.description}</p>
            </motion.button>
          ))}
        </CardContent>
      </Card>

      {/* Effects Editor */}
      <Card className="bg-slate-700 border-slate-600 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white text-sm">{language === 'fr' ? 'Effets Appliqués' : 'Applied Effects'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sequence.effects.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">{language === 'fr' ? 'Aucun effet appliqué' : 'No effects applied'}</p>
          ) : (
            <>
              {/* Effects List */}
              <div className="space-y-2">
                {sequence.effects.map(effect => (
                  <motion.button
                    key={effect.id}
                    whileHover={{ x: 5 }}
                    onClick={() => setSelectedEffectId(effect.id)}
                    className={`w-full p-3 rounded-lg transition text-left ${
                      selectedEffectId === effect.id ? 'bg-purple-600 border border-purple-500' : 'bg-slate-600 border border-slate-500'
                    }`}
                  >
                    <p className="text-white font-semibold text-sm">{EFFECTS.find(e => e.id === effect.type)?.label}</p>
                    <p className="text-xs text-slate-400">Intensité: {Math.round(effect.intensity * 100)}%</p>
                  </motion.button>
                ))}
              </div>

              {/* Effect Editor */}
              {selectedEffect && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-slate-800 rounded-lg space-y-4 border border-slate-600">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">
                      {language === 'fr' ? 'Intensité' : 'Intensity'}: {Math.round(selectedEffect.intensity * 100)}%
                    </label>
                    <Slider
                      value={[selectedEffect.intensity]}
                      onValueChange={(val) => updateEffect(selectedEffect.id, { intensity: val[0] })}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">
                      {language === 'fr' ? 'Image de Début' : 'Start Frame'}: {selectedEffect.startFrame}
                    </label>
                    <Slider
                      value={[selectedEffect.startFrame]}
                      onValueChange={(val) => updateEffect(selectedEffect.id, { startFrame: val[0] })}
                      min={0}
                      max={sequence.frames.length - 1}
                      step={1}
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">
                      {language === 'fr' ? 'Image de Fin' : 'End Frame'}: {selectedEffect.endFrame}
                    </label>
                    <Slider
                      value={[selectedEffect.endFrame]}
                      onValueChange={(val) => updateEffect(selectedEffect.id, { endFrame: val[0] })}
                      min={0}
                      max={sequence.frames.length - 1}
                      step={1}
                    />
                  </div>

                  <Button
                    onClick={() => removeEffect(selectedEffect.id)}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {language === 'fr' ? 'Supprimer' : 'Delete'}
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}