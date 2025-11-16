import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Type, 
  Contrast, 
  MousePointer, 
  Keyboard,
  Volume2,
  Save,
  Loader2,
  Check
} from "lucide-react";
import { motion } from "framer-motion";

export default function AccessibilitySettings() {
  const [settings, setSettings] = useState({
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
    largeClickTargets: false,
    keyboardNavigation: true,
    screenReaderOptimized: false,
    audioDescriptions: false,
    colorBlindMode: 'none'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const user = await base44.auth.me();
        if (user.accessibility_settings) {
          setSettings(user.accessibility_settings);
          applySettings(user.accessibility_settings);
        }
      } catch (error) {
        console.error("Erreur chargement accessibilité:", error);
      }
    };
    loadSettings();
  }, []);

  const applySettings = (newSettings) => {
    document.documentElement.style.setProperty('--text-base', `${newSettings.fontSize}px`);
    
    if (newSettings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (newSettings.reducedMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }

    if (newSettings.largeClickTargets) {
      document.body.classList.add('large-targets');
    } else {
      document.body.classList.remove('large-targets');
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      await base44.auth.updateMe({ accessibility_settings: settings });
    },
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
  };

  const handleSave = () => {
    saveMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Paramètres d'Accessibilité</h2>
            <p className="text-slate-600">Personnalisez l'interface selon vos besoins</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Taille de police */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-purple-600" />
                <Label>Taille de Police</Label>
              </div>
              <Badge>{settings.fontSize}px</Badge>
            </div>
            <Slider
              value={[settings.fontSize]}
              onValueChange={(val) => handleSettingChange('fontSize', val[0])}
              min={12}
              max={24}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-slate-600">Ajustez la taille du texte pour un meilleur confort de lecture</p>
          </div>

          {/* Contraste élevé */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Contrast className="w-5 h-5 text-purple-600" />
              <div>
                <Label>Contraste Élevé</Label>
                <p className="text-sm text-slate-600">Augmente les contrastes pour une meilleure lisibilité</p>
              </div>
            </div>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(val) => handleSettingChange('highContrast', val)}
            />
          </div>

          {/* Mouvement réduit */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <motion.div className="w-5 h-5 text-purple-600">⚡</motion.div>
              <div>
                <Label>Réduire les Animations</Label>
                <p className="text-sm text-slate-600">Minimise les mouvements et transitions</p>
              </div>
            </div>
            <Switch
              checked={settings.reducedMotion}
              onCheckedChange={(val) => handleSettingChange('reducedMotion', val)}
            />
          </div>

          {/* Cibles cliquables larges */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MousePointer className="w-5 h-5 text-purple-600" />
              <div>
                <Label>Cibles Cliquables Larges</Label>
                <p className="text-sm text-slate-600">Augmente la taille des boutons (WCAG 44x44px)</p>
              </div>
            </div>
            <Switch
              checked={settings.largeClickTargets}
              onCheckedChange={(val) => handleSettingChange('largeClickTargets', val)}
            />
          </div>

          {/* Navigation clavier */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Keyboard className="w-5 h-5 text-purple-600" />
              <div>
                <Label>Navigation au Clavier</Label>
                <p className="text-sm text-slate-600">Active les raccourcis clavier</p>
              </div>
            </div>
            <Switch
              checked={settings.keyboardNavigation}
              onCheckedChange={(val) => handleSettingChange('keyboardNavigation', val)}
            />
          </div>

          {/* Lecteur d'écran */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-purple-600" />
              <div>
                <Label>Optimisé Lecteur d'Écran</Label>
                <p className="text-sm text-slate-600">Améliore la compatibilité avec les lecteurs d'écran</p>
              </div>
            </div>
            <Switch
              checked={settings.screenReaderOptimized}
              onCheckedChange={(val) => handleSettingChange('screenReaderOptimized', val)}
            />
          </div>

          {/* Descriptions audio */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-purple-600" />
              <div>
                <Label>Descriptions Audio</Label>
                <p className="text-sm text-slate-600">Active les descriptions vocales des éléments visuels</p>
              </div>
            </div>
            <Switch
              checked={settings.audioDescriptions}
              onCheckedChange={(val) => handleSettingChange('audioDescriptions', val)}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saved ? 'Sauvegardé !' : 'Sauvegarder'}
          </Button>
          {saved && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-green-600"
            >
              ✓ Paramètres appliqués avec succès
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
}