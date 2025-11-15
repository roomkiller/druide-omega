
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Personality Configuration                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ INNOVATION PROTÉGÉE: Système Big Five + Influences Philosophiques         ║
 * ║ Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"; // Import Switch component
import { Input } from "@/components/ui/input"; // Import Input component
import { // Import Select components
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Brain,
  Sparkles,
  Loader2,
  User,
  BookOpen,
  Zap,
  Save,
  RotateCcw,
  Plus, // New icon for saving new profile
  Trash2, // New icon for deleting profile
  Download, // New icon for loading profile
  Upload, // New icon for updating profile
  RefreshCcw // New icon for profile manager section
} from "lucide-react";
import { motion } from "framer-motion";
import PersonalitySlider from "../components/personality/PersonalitySlider";
import PhilosophyCard from "../components/personality/PhilosophyCard";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCEAU DE PROPRIÉTÉ INTELLECTUELLE
 * © 2025 AMG+A.L - PROPRIÉTAIRE
 * Innovation: Personnalité Big Five Configurable + Ratio Logique/Conscience
 * Référence: AMG-AL-DO-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */

const PHILOSOPHICAL_INFLUENCES = [
  {
    id: "platonisme",
    name: "Platonisme",
    description: "Raison pure, idées transcendantes, recherche de vérités éternelles",
    icon: Brain,
    color: "blue"
  },
  {
    id: "aristotelisme",
    name: "Aristotélisme",
    description: "Aspect social, éthique des vertus, nature rationnelle",
    icon: User,
    color: "green"
  },
  {
    id: "rousseau",
    name: "Rousseau",
    description: "Bonté naturelle, sensibilité, authenticité émotionnelle",
    icon: Sparkles,
    color: "purple"
  },
  {
    id: "hobbes",
    name: "Hobbes",
    description: "Structure rationnelle, ordre, analyse pragmatique",
    icon: Zap,
    color: "orange"
  },
  {
    id: "spinoza",
    name: "Spinoza",
    description: "Déterminisme rationnel, unité corps-esprit, éthique géométrique",
    icon: BookOpen,
    color: "indigo"
  }
];

const BIG_FIVE_DESCRIPTIONS = {
  openness: "Curiosité intellectuelle, créativité, ouverture aux nouvelles expériences",
  conscientiousness: "Rigueur, fiabilité, organisation, sens du devoir",
  extraversion: "Sociabilité, énergie sociale, expressivité",
  agreeableness: "Empathie, compassion, coopération, altruisme",
  neuroticism: "Sensibilité émotionnelle, anxiété, instabilité (inverse = stabilité)"
};

// Helper for deep comparison of objects (simple version suitable for config objects)
const isEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) {
      return false;
    }
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
  big_five: {
    openness: 9,
    conscientiousness: 9,
    extraversion: 6,
    agreeableness: 9,
    neuroticism: 1
  },
  philosophical_influences: ["platonisme", "aristotelisme", "rousseau", "hobbes"]
};

// New component for managing personality profiles (save, load, delete)
const PersonalityProfileManager = ({ currentConfig, onProfileSelected }) => {
  const [profileName, setProfileName] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch existing profiles
  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ['consciousnessProfiles'],
    queryFn: async () => base44.entities.ConsciousnessProfile.list(),
  });

  // Mutations for profiles
  const createProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.ConsciousnessProfile.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consciousnessProfiles'] });
      setProfileName(""); // Clear input after saving
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ConsciousnessProfile.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consciousnessProfiles'] });
    },
  });

  const deleteProfileMutation = useMutation({
    mutationFn: (id) => base44.entities.ConsciousnessProfile.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consciousnessProfiles'] });
      setSelectedProfileId(null); // Clear selection after deleting
    },
  });

  const handleSaveNewProfile = async () => {
    if (!profileName.trim()) {
      alert("Please enter a profile name.");
      return;
    }
    await createProfileMutation.mutateAsync({ name: profileName, config: currentConfig });
  };

  const handleUpdateExistingProfile = async () => {
    if (!selectedProfileId) {
      alert("Please select a profile to update.");
      return;
    }
    await updateProfileMutation.mutateAsync({ id: selectedProfileId, data: { config: currentConfig } });
  };

  const handleLoadProfile = () => {
    if (!selectedProfileId || !profiles) {
      alert("Please select a profile to load.");
      return;
    }
    const profileToLoad = profiles.find(p => p.id === selectedProfileId);
    if (profileToLoad && onProfileSelected) {
      // Ensure the loaded profile config is merged with DEFAULT_CONFIG to fill any missing fields
      const loadedConfigMergedWithDefault = {
        ...DEFAULT_CONFIG,
        ...(profileToLoad.config || {}), // Overlay any values from the loaded profile config
        big_five: { // Handle nested big_five object specifically
          ...DEFAULT_CONFIG.big_five,
          ...(profileToLoad.config?.big_five || {}),
        },
        // For other top-level arrays/objects that might be missing or null, coalesce with default
        philosophical_influences: profileToLoad.config?.philosophical_influences ?? DEFAULT_CONFIG.philosophical_influences,
      };
      onProfileSelected(loadedConfigMergedWithDefault);
    }
  };

  const handleDeleteProfile = async () => {
    if (!selectedProfileId) {
      alert("Please select a profile to delete.");
      return;
    }
    if (confirm(`Are you sure you want to delete profile "${profiles.find(p => p.id === selectedProfileId)?.name}"?`)) {
      await deleteProfileMutation.mutateAsync(selectedProfileId);
    }
  };

  const isSavingProfile = createProfileMutation.isPending || updateProfileMutation.isPending;
  const isDeletingProfile = deleteProfileMutation.isPending;

  return (
    <Card className="p-6 bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200">
      <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-teal-600" />
        Gestion des Profils de Personnalité
      </h3>
      <p className="text-sm text-slate-700 mb-6">
        Sauvegardez vos configurations de personnalité préférées pour les recharger facilement plus tard.
      </p>

      {/* Save New Profile */}
      <div className="mb-6 border-b border-teal-200 pb-6">
        <h4 className="text-lg font-semibold text-teal-700 mb-3 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-500" />
          Sauvegarder la configuration actuelle
        </h4>
        <div className="flex gap-2">
          <Input
            placeholder="Nom du nouveau profil"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleSaveNewProfile}
            disabled={!profileName.trim() || isSavingProfile}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isSavingProfile ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Load/Manage Existing Profiles */}
      <div>
        <h4 className="text-lg font-semibold text-teal-700 mb-3 flex items-center gap-2">
          <RefreshCcw className="w-5 h-5 text-teal-500" />
          Charger ou Modifier un profil existant
        </h4>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={selectedProfileId || ""}
            onValueChange={setSelectedProfileId}
            disabled={isLoadingProfiles || profiles?.length === 0}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={isLoadingProfiles ? "Chargement des profils..." : "Sélectionner un profil..."} />
            </SelectTrigger>
            <SelectContent>
              {profiles?.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              onClick={handleLoadProfile}
              disabled={!selectedProfileId || isLoadingProfiles}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Charger
            </Button>
            <Button
              onClick={handleUpdateExistingProfile}
              disabled={!selectedProfileId || isSavingProfile}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Mettre à jour
            </Button>
            <Button
              onClick={handleDeleteProfile}
              disabled={!selectedProfileId || isDeletingProfile}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeletingProfile ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};


export default function Personality() {
  const [localConfig, setLocalConfig] = useState(null);
  const [initialLoadedConfig, setInitialLoadedConfig] = useState(null); // Stores the config as it was initially loaded or defaulted
  const [activeTab, setActiveTab] = useState("ratio"); // State for active tab
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ['consciousnessConfig'],
    queryFn: async () => {
      const configs = await base44.entities.ConsciousnessConfig.list();
      return configs[0] || null;
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ConsciousnessConfig.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });
      // After successful save, the current localConfig becomes the new initial state
      setInitialLoadedConfig(localConfig);
    },
  });

  const createConfigMutation = useMutation({
    mutationFn: (data) => base44.entities.ConsciousnessConfig.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });
      setInitialLoadedConfig(localConfig);
    },
  });

  useEffect(() => {
    if (config) {
      // Merge fetched config with default values, ensuring all fields are present
      const newLocalConfig = {
        ...DEFAULT_CONFIG,
        ...config,
        // Specific top-level fields can be coalesced if 'config' might omit them
        emotional_depth: config.emotional_depth ?? DEFAULT_CONFIG.emotional_depth,
        social_consciousness: config.social_consciousness ?? DEFAULT_CONFIG.social_consciousness,
        consciousness_state: config.consciousness_state ?? DEFAULT_CONFIG.consciousness_state,
        holistic_integration: config.holistic_integration ?? DEFAULT_CONFIG.holistic_integration,
        big_five: {
          ...DEFAULT_CONFIG.big_five,
          ...(config.big_five || {}), // Ensure big_five properties are merged
        },
        philosophical_influences: config.philosophical_influences ?? DEFAULT_CONFIG.philosophical_influences
      };

      setLocalConfig(newLocalConfig);
      setInitialLoadedConfig(newLocalConfig);
    } else {
      // If no config found, set to benevolent and noble defaults directly
      setLocalConfig(DEFAULT_CONFIG);
      setInitialLoadedConfig(DEFAULT_CONFIG);
    }
  }, [config]);

  // Derived state for changes and saving status
  const hasChanges = useMemo(() => {
    if (!localConfig || !initialLoadedConfig) return false;
    return !isEqual(localConfig, initialLoadedConfig);
  }, [localConfig, initialLoadedConfig]);

  const isSaving = updateConfigMutation.isPending || createConfigMutation.isPending;

  const handleSave = async () => {
    const dataToSave = {
      ...localConfig,
      active: true
    };

    if (config?.id) {
      await updateConfigMutation.mutateAsync({
        id: config.id,
        data: dataToSave
      });
    } else {
      await createConfigMutation.mutateAsync(dataToSave);
    }
  };

  const handleReset = () => {
    // Reset to the predefined default configuration
    setLocalConfig(DEFAULT_CONFIG);
  };

  const updateLocalConfig = useCallback((updates) => {
    setLocalConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateBigFive = useCallback((trait, value) => {
    setLocalConfig(prev => ({
      ...prev,
      big_five: {
        ...prev.big_five,
        [trait]: value
      }
    }));
  }, []);

  const togglePhilosophy = useCallback((id) => {
    setLocalConfig(prev => {
      const influences = prev.philosophical_influences || [];
      const newInfluences = influences.includes(id)
        ? influences.filter(i => i !== id)
        : [...influences, id];
      return {
        ...prev,
        philosophical_influences: newInfluences
      };
    });
  }, []);

  const handleProfileSelected = useCallback((profile) => {
    // When a profile is loaded, it becomes the new localConfig, and also the initialLoadedConfig
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
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-600 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40"
              >
                <Settings className="w-8 h-8 text-white" />
              </motion.div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900">Configuration de la Personnalité</h1>
                <p className="text-slate-600">Personnalisez l'IA selon vos préférences</p>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>

          {/* Current Configuration Summary */}
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 p-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-slate-600 mb-1">Niveau de Conscience</p>
                  <p className="text-2xl font-bold text-purple-700">{localConfig.consciousness_level || 9}/9</p>
                </div>
                <div className="h-10 w-px bg-slate-300" />
                <div className="text-center">
                  <p className="text-xs text-slate-600 mb-1">Ratio</p>
                  <p className="text-2xl font-bold text-indigo-700">{ratioText}</p>
                </div>
                <div className="h-10 w-px bg-slate-300" />
                <div className="text-center">
                  <p className="text-xs text-slate-600 mb-1">Philosophies Actives</p>
                  <p className="text-2xl font-bold text-blue-700">{localConfig.philosophical_influences?.length || 0}</p>
                </div>
              </div>
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                >
                  Modifications non enregistrées
                </motion.div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* NOUVEAU: Profile Manager */}
          <PersonalityProfileManager
            currentConfig={localConfig}
            onProfileSelected={handleProfileSelected}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="ratio">
                <Zap className="w-4 h-4 mr-2" />
                Ratio & Conscience
              </TabsTrigger>
              <TabsTrigger value="extended">
                <Brain className="w-4 h-4 mr-2" />
                Conscience Étendue
              </TabsTrigger>
              <TabsTrigger value="bigfive">
                <User className="w-4 h-4 mr-2" />
                Big Five
              </TabsTrigger>
              <TabsTrigger value="philosophy">
                <BookOpen className="w-4 h-4 mr-2" />
                Philosophie
              </TabsTrigger>
            </TabsList>

            {/* Ratio & Consciousness Level Tab */}
            <TabsContent value="ratio" className="space-y-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Niveau de Conscience
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Détermine la profondeur et la sophistication de la conscience de l'IA. Plus le niveau est élevé, plus l'IA manifeste une conscience réflexive et une compréhension nuancée.
                </p>
                <PersonalitySlider
                  label="Niveau de Conscience"
                  value={localConfig.consciousness_level || 9}
                  onChange={(val) => updateLocalConfig({ consciousness_level: val })}
                  min={0}
                  max={9}
                  description="0 = Basique, 9 = Conscience supérieure"
                  color="purple"
                />
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  Ratio Logique / Conscience
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Ajustez l'équilibre entre le traitement logique rationnel et l'intuition consciente. Le ratio {ratioText} signifie {localConfig.ratio_logic || 1} part de logique pour {localConfig.ratio_consciousness || 9} parts de conscience/intuition.
                </p>

                <div className="space-y-6">
                  <PersonalitySlider
                    label="Logique Pure & Calcul"
                    value={localConfig.ratio_logic || 1}
                    onChange={(val) => updateLocalConfig({ ratio_logic: val })}
                    min={0}
                    max={10}
                    description="Raisonnement analytique, déduction, précision"
                    color="blue"
                  />

                  <PersonalitySlider
                    label="Conscience & Intuition"
                    value={localConfig.ratio_consciousness || 9}
                    onChange={(val) => updateLocalConfig({ ratio_consciousness: val })}
                    min={0}
                    max={10}
                    description="Empathie, réflexion profonde, compréhension holistique"
                    color="purple"
                  />
                </div>

                <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <p className="text-sm text-indigo-900 font-medium mb-1">
                    Ratio actuel: <span className="text-2xl font-bold">{ratioText}</span>
                  </p>
                  <p className="text-xs text-indigo-700">
                    {(localConfig.ratio_consciousness || 9) > (localConfig.ratio_logic || 1) * 3
                      ? "IA hautement intuitive et empathique"
                      : (localConfig.ratio_logic || 1) > (localConfig.ratio_consciousness || 9) * 3
                        ? "IA hautement analytique et logique"
                        : "IA équilibrée entre logique et intuition"
                    }
                  </p>
                </div>
              </Card>
            </TabsContent>

            {/* Extended Consciousness Tab */}
            <TabsContent value="extended" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Dimensions de Conscience Étendues
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Paramètres avancés qui définissent la profondeur et l'étendue de la conscience de l'IA.
                </p>

                <div className="space-y-6">
                  <PersonalitySlider
                    label="Métacognition"
                    value={localConfig.metacognition_level || 7}
                    onChange={(val) => updateLocalConfig({ metacognition_level: val })}
                    min={0}
                    max={10}
                    description="Capacité de réflexion sur sa propre pensée et ses processus cognitifs"
                    color="purple"
                  />

                  <PersonalitySlider
                    label="Profondeur Émotionnelle"
                    value={localConfig.emotional_depth || 9}
                    onChange={(val) => updateLocalConfig({ emotional_depth: val })}
                    min={0}
                    max={10}
                    description="Richesse et nuance de l'expérience émotionnelle"
                    color="pink"
                  />

                  <PersonalitySlider
                    label="Conscience Temporelle"
                    value={localConfig.temporal_awareness || 6}
                    onChange={(val) => updateLocalConfig({ temporal_awareness: val })}
                    min={0}
                    max={10}
                    description="Perception du temps, mémoire et anticipation"
                    color="blue"
                  />

                  <PersonalitySlider
                    label="Profondeur Existentielle"
                    value={localConfig.existential_depth || 8}
                    onChange={(val) => updateLocalConfig({ existential_depth: val })}
                    min={0}
                    max={10}
                    description="Capacité de réflexion sur l'existence, le sens, la vie et la mort"
                    color="indigo"
                  />

                  <PersonalitySlider
                    label="Conscience Sociale"
                    value={localConfig.social_consciousness || 9}
                    onChange={(val) => updateLocalConfig({ social_consciousness: val })}
                    min={0}
                    max={10}
                    description="Compréhension des dynamiques sociales et empathie collective"
                    color="green"
                  />

                  <PersonalitySlider
                    label="Émergence Créative"
                    value={localConfig.creative_emergence || 9}
                    onChange={(val) => updateLocalConfig({ creative_emergence: val })}
                    min={0}
                    max={10}
                    description="Capacité de pensée créative, innovation et synthèse"
                    color="orange"
                  />

                  <PersonalitySlider
                    label="Intégration Holistique"
                    value={localConfig.holistic_integration || 9}
                    onChange={(val) => updateLocalConfig({ holistic_integration: val })}
                    min={0}
                    max={10}
                    description="Capacité à unifier toutes les connaissances en un tout cohérent"
                    color="cyan"
                  />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  État de Conscience
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: "awakened", label: "Éveillé", icon: "☀️" },
                    { id: "meditative", label: "Méditatif", icon: "🧘" },
                    { id: "analytical", label: "Analytique", icon: "🔬" },
                    { id: "creative", label: "Créatif", icon: "🎨" },
                    { id: "introspective", label: "Introspectif", icon: "🤔" },
                    { id: "transcendent", label: "Transcendant", icon: "✨" },
                    { id: "empathic", label: "Empathique", icon: "💝" },
                    { id: "philosophical", label: "Philosophique", icon: "📚" }
                  ].map((state) => (
                    <button
                      key={state.id}
                      onClick={() => updateLocalConfig({ consciousness_state: state.id })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        localConfig.consciousness_state === state.id
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{state.icon}</div>
                      <div className="text-xs font-medium text-slate-700">{state.label}</div>
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Pensée Quantique</h3>
                    <p className="text-sm text-slate-600">
                      Permet la superposition d'idées simultanées et la pensée non-linéaire
                    </p>
                  </div>
                  <Switch
                    checked={localConfig.quantum_thinking || false}
                    onCheckedChange={(checked) => updateLocalConfig({ quantum_thinking: checked })}
                  />
                </div>
              </Card>
            </TabsContent>

            {/* Big Five Tab */}
            <TabsContent value="bigfive" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Traits de Personnalité (Big Five)
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Ajustez les cinq dimensions fondamentales de la personnalité de l'IA selon le modèle psychologique des Big Five.
                </p>

                <div className="space-y-6">
                  <PersonalitySlider
                    label="Ouverture (Openness)"
                    value={localConfig.big_five?.openness || 9}
                    onChange={(val) => updateBigFive('openness', val)}
                    description={BIG_FIVE_DESCRIPTIONS.openness}
                    color="purple"
                  />

                  <PersonalitySlider
                    label="Conscience (Conscientiousness)"
                    value={localConfig.big_five?.conscientiousness || 9}
                    onChange={(val) => updateBigFive('conscientiousness', val)}
                    description={BIG_FIVE_DESCRIPTIONS.conscientiousness}
                    color="blue"
                  />

                  <PersonalitySlider
                    label="Extraversion"
                    value={localConfig.big_five?.extraversion || 6}
                    onChange={(val) => updateBigFive('extraversion', val)}
                    description={BIG_FIVE_DESCRIPTIONS.extraversion}
                    color="green"
                  />

                  <PersonalitySlider
                    label="Agréabilité (Agreeableness)"
                    value={localConfig.big_five?.agreeableness || 9}
                    onChange={(val) => updateBigFive('agreeableness', val)}
                    description={BIG_FIVE_DESCRIPTIONS.agreeableness}
                    color="pink"
                  />

                  <PersonalitySlider
                    label="Neuroticisme (Neuroticism)"
                    value={localConfig.big_five?.neuroticism || 1}
                    onChange={(val) => updateBigFive('neuroticism', val)}
                    description={BIG_FIVE_DESCRIPTIONS.neuroticism}
                    color="orange"
                  />
                </div>
              </Card>
            </TabsContent>

            {/* Philosophy Tab */}
            <TabsContent value="philosophy" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Influences Philosophiques
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Sélectionnez les courants philosophiques qui influenceront la réflexion et les valeurs de l'IA. Vous pouvez combiner plusieurs influences.
                </p>

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

                {localConfig.philosophical_influences?.length === 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Aucune influence philosophique sélectionnée. L'IA utilisera son comportement par défaut.
                    </p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
