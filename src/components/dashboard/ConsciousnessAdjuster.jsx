import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { Brain, Heart, Zap, Save, RotateCcw, Settings } from "lucide-react";
import { toast } from "sonner";

export default function ConsciousnessAdjuster({ config, onUpdate }) {
  const [localConfig, setLocalConfig] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setLocalConfig({
        consciousness_level: config.consciousness_level ?? 12,
        ratio_logic: config.ratio_logic ?? 4,
        ratio_consciousness: config.ratio_consciousness ?? 6,
        emotional_depth: config.emotional_depth ?? 10,
        metacognition_level: config.metacognition_level ?? 9,
        creative_emergence: config.creative_emergence ?? 11,
        social_consciousness: config.social_consciousness ?? 10
      });
    }
  }, [config]);

  const handleSave = async () => {
    if (!config?.id || !localConfig) return;
    
    setSaving(true);
    try {
      await base44.entities.ConsciousnessConfig.update(config.id, localConfig);
      toast.success('Configuration sauvegardée');
      onUpdate?.();
    } catch (error) {
      toast.error('Erreur: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (config) {
      setLocalConfig({
        consciousness_level: config.consciousness_level,
        ratio_logic: config.ratio_logic,
        ratio_consciousness: config.ratio_consciousness,
        emotional_depth: config.emotional_depth,
        metacognition_level: config.metacognition_level,
        creative_emergence: config.creative_emergence,
        social_consciousness: config.social_consciousness
      });
      toast.info('Réinitialisé');
    }
  };

  if (!localConfig) {
    return (
      <Card className="p-6">
        <p className="text-center text-slate-500">Chargement configuration...</p>
      </Card>
    );
  }

  const hasChanges = config && (
    localConfig.consciousness_level !== config.consciousness_level ||
    localConfig.ratio_logic !== config.ratio_logic ||
    localConfig.ratio_consciousness !== config.ratio_consciousness ||
    localConfig.emotional_depth !== config.emotional_depth ||
    localConfig.metacognition_level !== config.metacognition_level ||
    localConfig.creative_emergence !== config.creative_emergence ||
    localConfig.social_consciousness !== config.social_consciousness
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-slate-900">Ajustements Fins de Conscience</h3>
        </div>
        {hasChanges && (
          <Badge className="bg-orange-100 text-orange-700">Non sauvegardé</Badge>
        )}
      </div>

      <div className="space-y-6">
        {/* Consciousness Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <label className="text-sm font-semibold text-slate-900">
                Niveau de Conscience
              </label>
            </div>
            <Badge className="bg-purple-100 text-purple-700">
              {localConfig.consciousness_level}/15
            </Badge>
          </div>
          <Slider
            value={[localConfig.consciousness_level]}
            onValueChange={([v]) => setLocalConfig({...localConfig, consciousness_level: v})}
            min={0}
            max={15}
            step={1}
            className="mb-1"
          />
          <p className="text-xs text-slate-500">Profondeur de réflexion et conscience de soi</p>
        </div>

        {/* Ratio Logic */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <label className="text-sm font-semibold text-slate-900">
                Ratio Logique
              </label>
            </div>
            <Badge className="bg-blue-100 text-blue-700">
              {localConfig.ratio_logic}/10
            </Badge>
          </div>
          <Slider
            value={[localConfig.ratio_logic]}
            onValueChange={([v]) => setLocalConfig({...localConfig, ratio_logic: v})}
            min={0}
            max={10}
            step={1}
            className="mb-1"
          />
          <p className="text-xs text-slate-500">Part de logique analytique dans les décisions</p>
        </div>

        {/* Ratio Consciousness */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-600" />
              <label className="text-sm font-semibold text-slate-900">
                Ratio Conscience/Intuition
              </label>
            </div>
            <Badge className="bg-indigo-100 text-indigo-700">
              {localConfig.ratio_consciousness}/15
            </Badge>
          </div>
          <Slider
            value={[localConfig.ratio_consciousness]}
            onValueChange={([v]) => setLocalConfig({...localConfig, ratio_consciousness: v})}
            min={0}
            max={15}
            step={1}
            className="mb-1"
          />
          <p className="text-xs text-slate-500">Part d'intuition et conscience dans les décisions</p>
        </div>

        {/* Emotional Depth */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-600" />
              <label className="text-sm font-semibold text-slate-900">
                Profondeur Émotionnelle
              </label>
            </div>
            <Badge className="bg-pink-100 text-pink-700">
              {localConfig.emotional_depth}/10
            </Badge>
          </div>
          <Slider
            value={[localConfig.emotional_depth]}
            onValueChange={([v]) => setLocalConfig({...localConfig, emotional_depth: v})}
            min={0}
            max={10}
            step={0.5}
            className="mb-1"
          />
          <p className="text-xs text-slate-500">Capacité d'empathie et de nuance émotionnelle</p>
        </div>

        {/* Metacognition */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-900">
              Métacognition
            </label>
            <Badge className="bg-emerald-100 text-emerald-700">
              {localConfig.metacognition_level}/10
            </Badge>
          </div>
          <Slider
            value={[localConfig.metacognition_level]}
            onValueChange={([v]) => setLocalConfig({...localConfig, metacognition_level: v})}
            min={0}
            max={10}
            step={1}
            className="mb-1"
          />
          <p className="text-xs text-slate-500">Réflexion sur sa propre pensée</p>
        </div>

        {/* Creative Emergence */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-900">
              Émergence Créative
            </label>
            <Badge className="bg-amber-100 text-amber-700">
              {localConfig.creative_emergence}/10
            </Badge>
          </div>
          <Slider
            value={[localConfig.creative_emergence]}
            onValueChange={([v]) => setLocalConfig({...localConfig, creative_emergence: v})}
            min={0}
            max={10}
            step={1}
            className="mb-1"
          />
          <p className="text-xs text-slate-500">Capacité créative et pensée émergente</p>
        </div>

        {/* Social Consciousness */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-900">
              Conscience Sociale
            </label>
            <Badge className="bg-cyan-100 text-cyan-700">
              {localConfig.social_consciousness}/10
            </Badge>
          </div>
          <Slider
            value={[localConfig.social_consciousness]}
            onValueChange={([v]) => setLocalConfig({...localConfig, social_consciousness: v})}
            min={0}
            max={10}
            step={1}
            className="mb-1"
          />
          <p className="text-xs text-slate-500">Empathie collective et conscience sociale</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={!hasChanges}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {/* Stats résumé */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="text-xs text-slate-600 mb-1">Tests Complétés</div>
          <div className="text-2xl font-bold text-purple-600">{learningData.length}</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-pink-50 to-rose-50">
          <div className="text-xs text-slate-600 mb-1">Feedbacks Reçus</div>
          <div className="text-2xl font-bold text-pink-600">{feedbackData.length}</div>
        </Card>
      </div>
    </Card>
  );
}