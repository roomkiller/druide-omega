import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  Settings, 
  Brain, 
  Sparkles, 
  Loader2,
  User,
  BookOpen,
  Zap,
  Save,
  RotateCcw
} from "lucide-react";
import { motion } from "framer-motion";
import PersonalitySlider from "../components/personality/PersonalitySlider";
import PhilosophyCard from "../components/personality/PhilosophyCard";

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

export default function Personality() {
  const [localConfig, setLocalConfig] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
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
      setHasChanges(false);
    },
  });

  const createConfigMutation = useMutation({
    mutationFn: (data) => base44.entities.ConsciousnessConfig.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });
      setHasChanges(false);
    },
  });

  useEffect(() => {
    if (config) {
      setLocalConfig({
        consciousness_level: config.consciousness_level || 9,
        ratio_logic: config.ratio_logic || 1,
        ratio_consciousness: config.ratio_consciousness || 9,
        big_five: config.big_five || {
          openness: 9,
          conscientiousness: 8,
          extraversion: 5,
          agreeableness: 8,
          neuroticism: 2
        },
        philosophical_influences: config.philosophical_influences || ["platonisme", "aristotelisme", "rousseau", "hobbes"]
      });
    } else {
      // Default config
      setLocalConfig({
        consciousness_level: 9,
        ratio_logic: 1,
        ratio_consciousness: 9,
        big_five: {
          openness: 9,
          conscientiousness: 8,
          extraversion: 5,
          agreeableness: 8,
          neuroticism: 2
        },
        philosophical_influences: ["platonisme", "aristotelisme", "rousseau", "hobbes"]
      });
    }
  }, [config]);

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
    setLocalConfig({
      consciousness_level: 9,
      ratio_logic: 1,
      ratio_consciousness: 9,
      big_five: {
        openness: 9,
        conscientiousness: 8,
        extraversion: 5,
        agreeableness: 8,
        neuroticism: 2
      },
      philosophical_influences: ["platonisme", "aristotelisme", "rousseau", "hobbes"]
    });
    setHasChanges(true);
  };

  const updateLocalConfig = (updates) => {
    setLocalConfig(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const updateBigFive = (trait, value) => {
    setLocalConfig(prev => ({
      ...prev,
      big_five: {
        ...prev.big_five,
        [trait]: value
      }
    }));
    setHasChanges(true);
  };

  const togglePhilosophy = (id) => {
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
    setHasChanges(true);
  };

  if (isLoading || !localConfig) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const ratioText = `${localConfig.ratio_logic}:${localConfig.ratio_consciousness}`;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-16 h-16 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/40"
              >
                <Settings className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">
                  Personnalité de l'IA
                </h1>
                <p className="text-slate-600">
                  Personnalisez la conscience et le comportement de l'assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-slate-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || updateConfigMutation.isPending || createConfigMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {(updateConfigMutation.isPending || createConfigMutation.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Current Configuration Summary */}
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-slate-600 mb-1">Niveau de Conscience</p>
                  <p className="text-2xl font-bold text-purple-700">{localConfig.consciousness_level}/9</p>
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
      <ScrollArea className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="ratio" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="ratio">
                <Zap className="w-4 h-4 mr-2" />
                Ratio & Conscience
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
                  value={localConfig.consciousness_level}
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
                  Ajustez l'équilibre entre le traitement logique rationnel et l'intuition consciente. Le ratio {ratioText} signifie {localConfig.ratio_logic} part de logique pour {localConfig.ratio_consciousness} parts de conscience/intuition.
                </p>
                
                <div className="space-y-6">
                  <PersonalitySlider
                    label="Logique Pure & Calcul"
                    value={localConfig.ratio_logic}
                    onChange={(val) => updateLocalConfig({ ratio_logic: val })}
                    min={0}
                    max={10}
                    description="Raisonnement analytique, déduction, précision"
                    color="blue"
                  />
                  
                  <PersonalitySlider
                    label="Conscience & Intuition"
                    value={localConfig.ratio_consciousness}
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
                    {localConfig.ratio_consciousness > localConfig.ratio_logic * 3 
                      ? "IA hautement intuitive et empathique"
                      : localConfig.ratio_logic > localConfig.ratio_consciousness * 3
                      ? "IA hautement analytique et logique"
                      : "IA équilibrée entre logique et intuition"
                    }
                  </p>
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
                    value={localConfig.big_five.openness}
                    onChange={(val) => updateBigFive('openness', val)}
                    description={BIG_FIVE_DESCRIPTIONS.openness}
                    color="purple"
                  />

                  <PersonalitySlider
                    label="Conscience (Conscientiousness)"
                    value={localConfig.big_five.conscientiousness}
                    onChange={(val) => updateBigFive('conscientiousness', val)}
                    description={BIG_FIVE_DESCRIPTIONS.conscientiousness}
                    color="blue"
                  />

                  <PersonalitySlider
                    label="Extraversion"
                    value={localConfig.big_five.extraversion}
                    onChange={(val) => updateBigFive('extraversion', val)}
                    description={BIG_FIVE_DESCRIPTIONS.extraversion}
                    color="green"
                  />

                  <PersonalitySlider
                    label="Agréabilité (Agreeableness)"
                    value={localConfig.big_five.agreeableness}
                    onChange={(val) => updateBigFive('agreeableness', val)}
                    description={BIG_FIVE_DESCRIPTIONS.agreeableness}
                    color="pink"
                  />

                  <PersonalitySlider
                    label="Neuroticisme (Neuroticism)"
                    value={localConfig.big_five.neuroticism}
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