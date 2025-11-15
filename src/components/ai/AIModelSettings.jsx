/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - AI Model Fine-Tuning Settings                              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, RotateCcw } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DEFAULT_SETTINGS = {
  temperature: 0.7,
  max_tokens: 1500,
  top_p: 0.9,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  response_format: "structured",
  enable_web_search: true,
  enable_memory_recall: true,
  enable_kb_lookup: true,
  creativity_level: 7,
  conciseness_level: 5,
  formality_level: 5
};

export default function AIModelSettings({ onSettingsChange }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const user = await base44.auth.me();
      if (user.ai_model_settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...user.ai_model_settings });
      }
    } catch (error) {
      console.error("Erreur chargement paramètres:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await base44.auth.updateMe({
        ai_model_settings: settings
      });
      onSettingsChange?.(settings);
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getTemperatureLabel = (temp) => {
    if (temp < 0.3) return "Très Précis";
    if (temp < 0.6) return "Équilibré";
    if (temp < 0.8) return "Créatif";
    return "Très Créatif";
  };

  return (
    <Card className="p-6 bg-white border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-slate-900">Paramètres du Modèle IA</h3>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-purple-600">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Core LLM Parameters */}
        <div>
          <h4 className="font-semibold text-sm text-slate-900 mb-4">Paramètres du Modèle</h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Température</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{settings.temperature.toFixed(2)}</Badge>
                  <Badge>{getTemperatureLabel(settings.temperature)}</Badge>
                </div>
              </div>
              <Slider
                value={[settings.temperature]}
                onValueChange={([v]) => updateSetting('temperature', v)}
                min={0}
                max={1}
                step={0.05}
              />
              <p className="text-xs text-slate-500 mt-1">
                Plus bas = réponses précises et cohérentes. Plus haut = créatives et variées.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Longueur Max (tokens)</Label>
                <Badge variant="secondary">{settings.max_tokens}</Badge>
              </div>
              <Slider
                value={[settings.max_tokens]}
                onValueChange={([v]) => updateSetting('max_tokens', v)}
                min={500}
                max={4000}
                step={100}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Top P (Nucleus Sampling)</Label>
                <Badge variant="secondary">{settings.top_p.toFixed(2)}</Badge>
              </div>
              <Slider
                value={[settings.top_p]}
                onValueChange={([v]) => updateSetting('top_p', v)}
                min={0.1}
                max={1}
                step={0.05}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Pénalité de Fréquence</Label>
                <Badge variant="secondary">{settings.frequency_penalty.toFixed(2)}</Badge>
              </div>
              <Slider
                value={[settings.frequency_penalty]}
                onValueChange={([v]) => updateSetting('frequency_penalty', v)}
                min={-2}
                max={2}
                step={0.1}
              />
              <p className="text-xs text-slate-500 mt-1">
                Réduit la répétition de mots fréquents.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Pénalité de Présence</Label>
                <Badge variant="secondary">{settings.presence_penalty.toFixed(2)}</Badge>
              </div>
              <Slider
                value={[settings.presence_penalty]}
                onValueChange={([v]) => updateSetting('presence_penalty', v)}
                min={-2}
                max={2}
                step={0.1}
              />
              <p className="text-xs text-slate-500 mt-1">
                Encourage l'IA à parler de nouveaux sujets.
              </p>
            </div>
          </div>
        </div>

        {/* Response Style */}
        <div>
          <h4 className="font-semibold text-sm text-slate-900 mb-4">Style de Réponse</h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Niveau de Créativité</Label>
                <Badge variant="secondary">{settings.creativity_level}/10</Badge>
              </div>
              <Slider
                value={[settings.creativity_level]}
                onValueChange={([v]) => updateSetting('creativity_level', v)}
                min={1}
                max={10}
                step={1}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Concision</Label>
                <Badge variant="secondary">{settings.conciseness_level}/10</Badge>
              </div>
              <Slider
                value={[settings.conciseness_level]}
                onValueChange={([v]) => updateSetting('conciseness_level', v)}
                min={1}
                max={10}
                step={1}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Formalité</Label>
                <Badge variant="secondary">{settings.formality_level}/10</Badge>
              </div>
              <Slider
                value={[settings.formality_level]}
                onValueChange={([v]) => updateSetting('formality_level', v)}
                min={1}
                max={10}
                step={1}
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div>
          <h4 className="font-semibold text-sm text-slate-900 mb-4">Fonctionnalités</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Label htmlFor="web-search">Recherche Web</Label>
              <Switch
                id="web-search"
                checked={settings.enable_web_search}
                onCheckedChange={(v) => updateSetting('enable_web_search', v)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Label htmlFor="memory-recall">Rappel de Mémoires</Label>
              <Switch
                id="memory-recall"
                checked={settings.enable_memory_recall}
                onCheckedChange={(v) => updateSetting('enable_memory_recall', v)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Label htmlFor="kb-lookup">Consultation KB</Label>
              <Switch
                id="kb-lookup"
                checked={settings.enable_kb_lookup}
                onCheckedChange={(v) => updateSetting('enable_kb_lookup', v)}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}