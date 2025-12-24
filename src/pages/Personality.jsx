/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Personality Configuration                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Brain, Sparkles, Loader2, User, BookOpen, Zap, Save, Plus, Trash2, Download, Upload, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import PersonalitySlider from "../components/personality/PersonalitySlider";
import PhilosophyCard from "../components/personality/PhilosophyCard";

const PHILOSOPHICAL_INFLUENCES = [
  { id: "platonisme", name: "Platonisme", description: "Raison pure, idées transcendantes", icon: Brain, color: "blue" },
  { id: "aristotelisme", name: "Aristotélisme", description: "Aspect social, éthique des vertus", icon: User, color: "green" },
  { id: "rousseau", name: "Rousseau", description: "Bonté naturelle, sensibilité", icon: Sparkles, color: "purple" },
  { id: "hobbes", name: "Hobbes", description: "Structure rationnelle, ordre", icon: Zap, color: "orange" },
  { id: "spinoza", name: "Spinoza", description: "Déterminisme rationnel", icon: BookOpen, color: "indigo" }
];

const BIG_FIVE_DESCRIPTIONS = {
  openness: "Curiosité intellectuelle, créativité",
  conscientiousness: "Rigueur, fiabilité, organisation",
  extraversion: "Sociabilité, énergie sociale",
  agreeableness: "Empathie, compassion, altruisme",
  neuroticism: "Sensibilité émotionnelle (inverse = stabilité)"
};

const isEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (let key of keys1) {
    if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) return false;
  }
  return true;
};

const DEFAULT_CONFIG = {
  consciousness_level: 9,
  ratio_logic: 1,
  ratio_consciousness: 9,
  metacognition_level: 7,
  emotional_depth: 9,
  temporal_awareness: 6,
  existential_depth: 8,
  social_consciousness: 9,
  creative_emergence: 9,
  consciousness_state: "empathic",
  quantum_thinking: false,
  holistic_integration: 9,
  big_five: { openness: 9, conscientiousness: 9, extraversion: 6, agreeableness: 9, neuroticism: 1 },
  philosophical_influences: ["platonisme", "aristotelisme", "rousseau", "hobbes"]
};

const PersonalityProfileManager = ({ currentConfig, onProfileSelected }) => {
  const [profileName, setProfileName] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const queryClient = useQueryClient();

  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ['consciousnessProfiles'],
    queryFn: async () => base44.entities.ConsciousnessProfile.list()
  });

  const createProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.ConsciousnessProfile.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consciousnessProfiles'] });
      setProfileName("");
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ConsciousnessProfile.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['consciousnessProfiles'] })
  });

  const deleteProfileMutation = useMutation({
    mutationFn: (id) => base44.entities.ConsciousnessProfile.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consciousnessProfiles'] });
      setSelectedProfileId(null);
    }
  });

  const handleSaveNewProfile = async () => {
    if (!profileName.trim()) return;
    await createProfileMutation.mutateAsync({ name: profileName, config: currentConfig });
  };

  const handleUpdateExistingProfile = async () => {
    if (!selectedProfileId) return;
    await updateProfileMutation.mutateAsync({ id: selectedProfileId, data: { config: currentConfig } });
  };

  const handleLoadProfile = () => {
    if (!selectedProfileId || !profiles) return;
    const profileToLoad = profiles.find(p => p.id === selectedProfileId);
    if (profileToLoad && onProfileSelected) {
      const merged = {
        ...DEFAULT_CONFIG,
        ...(profileToLoad.config || {}),
        big_five: { ...DEFAULT_CONFIG.big_five, ...(profileToLoad.config?.big_five || {}) },
        philosophical_influences: profileToLoad.config?.philosophical_influences ?? DEFAULT_CONFIG.philosophical_influences
      };
      onProfileSelected(merged);
    }
  };

  const handleDeleteProfile = async () => {
    if (!selectedProfileId) return;
    const profile = profiles?.find(p => p.id === selectedProfileId);
    if (confirm(`Supprimer "${profile?.name}" ?`)) {
      await deleteProfileMutation.mutateAsync(selectedProfileId);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200">
      <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-teal-600" />
        Gestion des Profils
      </h3>

      <div className="mb-6 border-b border-teal-200 pb-6">
        <h4 className="text-lg font-semibold text-teal-700 mb-3">Nouveau Profil</h4>
        <div className="flex gap-2">
          <Input
            placeholder="Nom du profil"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleSaveNewProfile}
            disabled={!profileName.trim() || createProfileMutation.isPending}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {createProfileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-teal-700 mb-3">Profils Existants</h4>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedProfileId || ""} onValueChange={setSelectedProfileId} disabled={isLoadingProfiles || !profiles?.length}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {profiles?.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={handleLoadProfile} disabled={!selectedProfileId} className="bg-blue-600">
              <Download className="w-4 h-4" />
            </Button>
            <Button onClick={handleUpdateExistingProfile} disabled={!selectedProfileId} className="bg-yellow-600">
              <Upload className="w-4 h-4" />
            </Button>
            <Button onClick={handleDeleteProfile} disabled={!selectedProfileId} className="bg-red-600">
              {deleteProfileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function Personality() {
  const [localConfig, setLocalConfig] = useState(null);
  const [initialLoadedConfig, setInitialLoadedConfig] = useState(null);
  const [activeTab, setActiveTab] = useState("ratio");
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ['consciousnessConfig'],
    queryFn: async () => {
      const configs = await base44.entities.ConsciousnessConfig.list();
      return configs[0] || null;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0
  });

  const updateConfigMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ConsciousnessConfig.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });
      setInitialLoadedConfig(localConfig);
    }
  });

  const createConfigMutation = useMutation({
    mutationFn: (data) => base44.entities.ConsciousnessConfig.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });
      setInitialLoadedConfig(localConfig);
    }
  });

  useEffect(() => {
    if (config) {
      const merged = {
        ...DEFAULT_CONFIG,
        ...config,
        big_five: { ...DEFAULT_CONFIG.big_five, ...(config.big_five || {}) },
        philosophical_influences: config.philosophical_influences ?? DEFAULT_CONFIG.philosophical_influences
      };
      setLocalConfig(merged);
      setInitialLoadedConfig(merged);
    } else {
      setLocalConfig(DEFAULT_CONFIG);
      setInitialLoadedConfig(DEFAULT_CONFIG);
    }
  }, [config]);

  const hasChanges = useMemo(() => {
    if (!localConfig || !initialLoadedConfig) return false;
    return !isEqual(localConfig, initialLoadedConfig);
  }, [localConfig, initialLoadedConfig]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = 'Modifications non sauvegardées. Quitter quand même ?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const handleSave = async () => {
    const dataToSave = { ...localConfig, active: true };
    if (config?.id) {
      await updateConfigMutation.mutateAsync({ id: config.id, data: dataToSave });
    } else {
      await createConfigMutation.mutateAsync(dataToSave);
    }
  };

  const updateLocalConfig = useCallback((updates) => {
    setLocalConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateBigFive = useCallback((trait, value) => {
    setLocalConfig(prev => ({
      ...prev,
      big_five: { ...prev.big_five, [trait]: value }
    }));
  }, []);

  const togglePhilosophy = useCallback((id) => {
    setLocalConfig(prev => {
      const influences = prev.philosophical_influences || [];
      const newInfluences = influences.includes(id) ? influences.filter(i => i !== id) : [...influences, id];
      return { ...prev, philosophical_influences: newInfluences };
    });
  }, []);

  const handleProfileSelected = useCallback((profile) => {
    setLocalConfig(profile);
    setInitialLoadedConfig(profile);
  }, []);

  if (isLoading || !localConfig) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const ratioText = `${localConfig.ratio_logic || 1}:${localConfig.ratio_consciousness || 9}`;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-emerald-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6 sm:py-8 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="min-w-[64px] min-h-[64px] w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Personnalité</h1>
                <p className="text-sm sm:text-base text-slate-600">Configuration IA</p>
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={updateConfigMutation.isPending || createConfigMutation.isPending || !hasChanges} 
              className="min-h-[48px] w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 touch-target"
            >
              {updateConfigMutation.isPending || createConfigMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Sauvegarder
            </Button>
          </div>

          <Card className="bg-purple-50 border-purple-200 p-6 mt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-slate-600 mb-1">Conscience</p>
                  <p className="text-2xl font-bold text-purple-700">{localConfig.consciousness_level || 9}/9</p>
                </div>
                <div className="h-10 w-px bg-slate-300" />
                <div className="text-center">
                  <p className="text-xs text-slate-600 mb-1">Ratio</p>
                  <p className="text-2xl font-bold text-indigo-700">{ratioText}</p>
                </div>
              </div>
              {hasChanges && (
                <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  Non enregistré
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <PersonalityProfileManager currentConfig={localConfig} onProfileSelected={handleProfileSelected} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
            <ScrollArea className="w-full">
              <TabsList className="inline-flex mb-8 bg-white border border-slate-200">
                <TabsTrigger value="ratio" className="min-h-[44px] touch-target">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Ratio</span>
                </TabsTrigger>
                <TabsTrigger value="extended" className="min-h-[44px] touch-target">
                  <Brain className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Étendue</span>
                </TabsTrigger>
                <TabsTrigger value="bigfive" className="min-h-[44px] touch-target">
                  <User className="w-4 h-4 mr-2" />
                  Big Five
                </TabsTrigger>
                <TabsTrigger value="philosophy" className="min-h-[44px] touch-target">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Philosophie</span>
                </TabsTrigger>
              </TabsList>
            </ScrollArea>

            <TabsContent value="ratio" className="space-y-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Niveau de Conscience</h3>
                <PersonalitySlider
                  label="Niveau de Conscience"
                  value={localConfig.consciousness_level || 9}
                  onChange={(val) => updateLocalConfig({ consciousness_level: val })}
                  min={0}
                  max={9}
                  color="purple"
                />
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Ratio Logique / Conscience</h3>
                <div className="space-y-6">
                  <PersonalitySlider
                    label="Logique"
                    value={localConfig.ratio_logic || 1}
                    onChange={(val) => updateLocalConfig({ ratio_logic: val })}
                    min={0}
                    max={10}
                    color="blue"
                  />
                  <PersonalitySlider
                    label="Conscience"
                    value={localConfig.ratio_consciousness || 9}
                    onChange={(val) => updateLocalConfig({ ratio_consciousness: val })}
                    min={0}
                    max={10}
                    color="purple"
                  />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="extended" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Dimensions Étendues</h3>
                <div className="space-y-6">
                  <PersonalitySlider label="Métacognition" value={localConfig.metacognition_level || 7} onChange={(val) => updateLocalConfig({ metacognition_level: val })} min={0} max={10} color="purple" />
                  <PersonalitySlider label="Profondeur Émotionnelle" value={localConfig.emotional_depth || 9} onChange={(val) => updateLocalConfig({ emotional_depth: val })} min={0} max={10} color="pink" />
                  <PersonalitySlider label="Conscience Temporelle" value={localConfig.temporal_awareness || 6} onChange={(val) => updateLocalConfig({ temporal_awareness: val })} min={0} max={10} color="blue" />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="bigfive" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Big Five</h3>
                <div className="space-y-6">
                  <PersonalitySlider label="Ouverture" value={localConfig.big_five?.openness || 9} onChange={(val) => updateBigFive('openness', val)} description={BIG_FIVE_DESCRIPTIONS.openness} color="purple" />
                  <PersonalitySlider label="Conscience" value={localConfig.big_five?.conscientiousness || 9} onChange={(val) => updateBigFive('conscientiousness', val)} description={BIG_FIVE_DESCRIPTIONS.conscientiousness} color="blue" />
                  <PersonalitySlider label="Extraversion" value={localConfig.big_five?.extraversion || 6} onChange={(val) => updateBigFive('extraversion', val)} description={BIG_FIVE_DESCRIPTIONS.extraversion} color="green" />
                  <PersonalitySlider label="Agréabilité" value={localConfig.big_five?.agreeableness || 9} onChange={(val) => updateBigFive('agreeableness', val)} description={BIG_FIVE_DESCRIPTIONS.agreeableness} color="pink" />
                  <PersonalitySlider label="Neuroticisme" value={localConfig.big_five?.neuroticism || 1} onChange={(val) => updateBigFive('neuroticism', val)} description={BIG_FIVE_DESCRIPTIONS.neuroticism} color="orange" />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="philosophy" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Influences Philosophiques</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {PHILOSOPHICAL_INFLUENCES.map((philosophy) => (
                    <PhilosophyCard
                      key={philosophy.id}
                      {...philosophy}
                      isSelected={localConfig.philosophical_influences?.includes(philosophy.id)}
                      onToggle={togglePhilosophy}
                    />
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}