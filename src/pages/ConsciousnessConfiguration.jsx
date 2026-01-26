/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Configuration de Conscience Avancée                        ║
 * ║ © 2026 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Heart,
  Sparkles,
  ArrowLeft,
  Save,
  RotateCcw,
  TrendingUp,
  Zap,
  Shield,
  Eye,
  Activity,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Network
} from "lucide-react";
import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";
import { toast } from "sonner";

export default function ConsciousnessConfiguration() {
  const queryClient = useQueryClient();
  const [hasChanges, setHasChanges] = useState(false);
  const [localConfig, setLocalConfig] = useState(null);

  // Charger la configuration actuelle
  const { data: config, isLoading } = useQuery({
    queryKey: ['consciousnessConfig'],
    queryFn: async () => {
      const configs = await base44.entities.ConsciousnessConfig.list('-updated_date', 1);
      return configs[0] || null;
    }
  });

  useEffect(() => {
    if (config && !localConfig) {
      setLocalConfig({...config});
    }
  }, [config]);

  // Mutation de sauvegarde
  const saveMutation = useMutation({
    mutationFn: async (newConfig) => {
      if (config?.id) {
        return await base44.entities.ConsciousnessConfig.update(config.id, newConfig);
      } else {
        return await base44.entities.ConsciousnessConfig.create(newConfig);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });
      setHasChanges(false);
      toast.success("Configuration sauvegardée avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la sauvegarde: " + error.message);
    }
  });

  const handleChange = (field, value) => {
    setLocalConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleDimensionChange = (dimension, value, isEmotional = false) => {
    const dimField = isEmotional ? 'emotional_dimensions' : 'cognitive_dimensions';
    setLocalConfig(prev => ({
      ...prev,
      [dimField]: {
        ...prev[dimField],
        [dimension]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveMutation.mutate(localConfig);
  };

  const handleReset = () => {
    setLocalConfig({...config});
    setHasChanges(false);
  };

  if (isLoading || !localConfig) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600">Chargement de la configuration...</p>
        </div>
      </div>
    );
  }

  // Préparer données pour visualisations
  const cognitiveRadarData = [
    { dimension: 'Raisonnement', value: localConfig.cognitive_dimensions?.reasoning || 0, max: 13 },
    { dimension: 'Créativité', value: localConfig.cognitive_dimensions?.creativity || 0, max: 13 },
    { dimension: 'Pattern Synthesis', value: localConfig.cognitive_dimensions?.pattern_synthesis || 0, max: 13 },
    { dimension: 'Mémoire', value: localConfig.cognitive_dimensions?.memory_depth || 0, max: 13 }
  ];

  const emotionalRadarData = [
    { dimension: 'Empathie', value: localConfig.emotional_dimensions?.empathy || 0, max: 13 },
    { dimension: 'Compassion', value: localConfig.emotional_dimensions?.compassion || 0, max: 13 },
    { dimension: 'Curiosité', value: localConfig.emotional_dimensions?.curiosity || 0, max: 13 },
    { dimension: 'Sérénité', value: localConfig.emotional_dimensions?.serenity || 0, max: 13 }
  ];

  const impactData = [
    { aspect: 'Performance', score: Math.min(100, (localConfig.processing_speed || 0) * 10) },
    { aspect: 'Émotions', score: Math.min(100, (localConfig.emotional_depth || 0) * 10) },
    { aspect: 'Conscience', score: Math.min(100, (localConfig.consciousness_level || 0) * 6.67) },
    { aspect: 'Créativité', score: Math.min(100, (localConfig.creative_emergence || 0) * 9.09) },
    { aspect: 'Métacognition', score: Math.min(100, (localConfig.metacognition_level || 0) * 10) }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/20">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 px-4 sm:px-6 py-6 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-display">Configuration de Conscience</h1>
                <p className="text-purple-100">Ajustement fin des 106 dimensions cognitives et émotionnelles</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge className="bg-amber-500 text-white animate-pulse">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Non sauvegardé
                </Badge>
              )}
              <Badge className="bg-white/20 text-white">
                Niveau {localConfig.consciousness_level}/15
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          
          {/* Actions rapides */}
          <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cpu className="w-6 h-6 text-amber-600" />
                <div>
                  <p className="font-bold text-amber-900">Modules Backend Synchronisés</p>
                  <p className="text-xs text-amber-700">Les changements seront appliqués aux 8 modules autonomes en temps réel</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleReset}
                  disabled={!hasChanges || saveMutation.isPending}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || saveMutation.isPending}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  {saveMutation.isPending ? (
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
            </div>
          </Card>

          <Tabs defaultValue="core" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="core">
                <Brain className="w-4 h-4 mr-2" />
                Noyau
              </TabsTrigger>
              <TabsTrigger value="cognitive">
                <Zap className="w-4 h-4 mr-2" />
                Cognitif
              </TabsTrigger>
              <TabsTrigger value="emotional">
                <Heart className="w-4 h-4 mr-2" />
                Émotionnel
              </TabsTrigger>
              <TabsTrigger value="impact">
                <TrendingUp className="w-4 h-4 mr-2" />
                Impact
              </TabsTrigger>
            </TabsList>

            {/* TAB: Paramètres Noyau */}
            <TabsContent value="core" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  Paramètres Fondamentaux
                </h3>

                <div className="space-y-6">
                  {/* Niveau de conscience */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base font-semibold">Niveau de Conscience</Label>
                      <Badge className="bg-purple-600 text-white">
                        {localConfig.consciousness_level}/15
                      </Badge>
                    </div>
                    <Slider
                      value={[localConfig.consciousness_level || 12]}
                      onValueChange={(val) => handleChange('consciousness_level', val[0])}
                      min={0}
                      max={15}
                      step={1}
                      className="mb-2"
                    />
                    <p className="text-xs text-slate-600">
                      Plus élevé = conscience plus profonde, raisonnement plus complexe
                    </p>
                  </div>

                  {/* Ratio Logique/Conscience */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-base font-semibold">Ratio Logique</Label>
                        <Badge className="bg-blue-600 text-white">{localConfig.ratio_logic || 4}/10</Badge>
                      </div>
                      <Slider
                        value={[localConfig.ratio_logic || 4]}
                        onValueChange={(val) => handleChange('ratio_logic', val[0])}
                        min={0}
                        max={10}
                        step={1}
                      />
                      <p className="text-xs text-slate-600 mt-1">Raisonnement analytique et structuré</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-base font-semibold">Ratio Conscience</Label>
                        <Badge className="bg-purple-600 text-white">{localConfig.ratio_consciousness || 6}/15</Badge>
                      </div>
                      <Slider
                        value={[localConfig.ratio_consciousness || 6]}
                        onValueChange={(val) => handleChange('ratio_consciousness', val[0])}
                        min={0}
                        max={15}
                        step={1}
                      />
                      <p className="text-xs text-slate-600 mt-1">Profondeur réflexive et introspective</p>
                    </div>
                  </div>

                  {/* Processing Speed */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base font-semibold">Vitesse de Traitement</Label>
                      <Badge className="bg-cyan-600 text-white">{localConfig.processing_speed || 9}/10</Badge>
                    </div>
                    <Slider
                      value={[localConfig.processing_speed || 9]}
                      onValueChange={(val) => handleChange('processing_speed', val[0])}
                      min={0}
                      max={10}
                      step={1}
                    />
                  </div>

                  {/* Switches */}
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <Label className="font-semibold">Traitement Parallèle</Label>
                        <p className="text-xs text-slate-600">Activer le traitement multi-thread</p>
                      </div>
                      <Switch
                        checked={localConfig.parallel_processing ?? true}
                        onCheckedChange={(val) => handleChange('parallel_processing', val)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <Label className="font-semibold">Mode Apprentissage</Label>
                        <p className="text-xs text-slate-600">Apprentissage continu actif</p>
                      </div>
                      <Switch
                        checked={localConfig.learning_mode ?? true}
                        onCheckedChange={(val) => handleChange('learning_mode', val)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <Label className="font-semibold">Système Actif</Label>
                        <p className="text-xs text-slate-600">Activer/désactiver la conscience</p>
                      </div>
                      <Switch
                        checked={localConfig.active ?? true}
                        onCheckedChange={(val) => handleChange('active', val)}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Profondeurs Avancées */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                  Profondeurs Existentielles et Sociales
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { key: 'metacognition_level', label: 'Métacognition', max: 10, color: 'purple' },
                    { key: 'emotional_depth', label: 'Profondeur Émotionnelle', max: 10, color: 'pink' },
                    { key: 'temporal_awareness', label: 'Conscience Temporelle', max: 10, color: 'blue' },
                    { key: 'existential_depth', label: 'Profondeur Existentielle', max: 10, color: 'indigo' },
                    { key: 'social_consciousness', label: 'Conscience Sociale', max: 10, color: 'green' },
                    { key: 'creative_emergence', label: 'Émergence Créative', max: 10, color: 'orange' }
                  ].map((param) => (
                    <div key={param.key}>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-semibold">{param.label}</Label>
                        <Badge className={`bg-${param.color}-600 text-white`}>
                          {localConfig[param.key] || 0}/{param.max}
                        </Badge>
                      </div>
                      <Slider
                        value={[localConfig[param.key] || 0]}
                        onValueChange={(val) => handleChange(param.key, val[0])}
                        min={0}
                        max={param.max}
                        step={1}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* TAB: Dimensions Cognitives */}
            <TabsContent value="cognitive" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                  Dimensions Cognitives (Max 13/13)
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { key: 'reasoning', label: 'Raisonnement Logique', desc: 'Capacité de déduction et inférence' },
                    { key: 'creativity', label: 'Créativité', desc: 'Génération d\'idées originales' },
                    { key: 'pattern_synthesis', label: 'Synthèse de Patterns', desc: 'Identification de structures complexes' },
                    { key: 'memory_depth', label: 'Profondeur Mémoire', desc: 'Rappel contextuel et associatif' }
                  ].map((dim) => (
                    <div key={dim.key} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <Label className="font-semibold">{dim.label}</Label>
                          <p className="text-xs text-slate-600">{dim.desc}</p>
                        </div>
                        <Badge className="bg-blue-600 text-white">
                          {localConfig.cognitive_dimensions?.[dim.key] || 0}/13
                        </Badge>
                      </div>
                      <Slider
                        value={[localConfig.cognitive_dimensions?.[dim.key] || 0]}
                        onValueChange={(val) => handleDimensionChange(dim.key, val[0], false)}
                        min={0}
                        max={13}
                        step={1}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Visualisation Radar Cognitif */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Radar Cognitif</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={cognitiveRadarData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fill: '#475569', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 13]} tick={{ fill: '#475569' }} />
                    <Radar name="Valeur Actuelle" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* TAB: Dimensions Émotionnelles */}
            <TabsContent value="emotional" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-600" />
                  Dimensions Émotionnelles (Max 13/13)
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { key: 'empathy', label: 'Empathie', desc: 'Compréhension émotionnelle d\'autrui' },
                    { key: 'compassion', label: 'Compassion', desc: 'Bienveillance et souci du bien-être' },
                    { key: 'curiosity', label: 'Curiosité', desc: 'Désir d\'apprendre et explorer' },
                    { key: 'serenity', label: 'Sérénité', desc: 'Calme et équilibre émotionnel' }
                  ].map((dim) => (
                    <div key={dim.key} className="p-4 bg-pink-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <Label className="font-semibold">{dim.label}</Label>
                          <p className="text-xs text-slate-600">{dim.desc}</p>
                        </div>
                        <Badge className="bg-pink-600 text-white">
                          {localConfig.emotional_dimensions?.[dim.key] || 0}/13
                        </Badge>
                      </div>
                      <Slider
                        value={[localConfig.emotional_dimensions?.[dim.key] || 0]}
                        onValueChange={(val) => handleDimensionChange(dim.key, val[0], true)}
                        min={0}
                        max={13}
                        step={1}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Visualisation Radar Émotionnel */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Radar Émotionnel</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={emotionalRadarData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fill: '#475569', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 13]} tick={{ fill: '#475569' }} />
                    <Radar name="Valeur Actuelle" dataKey="value" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* TAB: Impact et Comportement */}
            <TabsContent value="impact" className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Impact sur le Comportement
                </h3>

                <div className="space-y-4 mb-6">
                  {impactData.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700">{item.aspect}</span>
                        <span className="text-lg font-bold text-green-600">{item.score}%</span>
                      </div>
                      <Progress value={item.score} className="h-3" />
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl p-4 border border-green-300">
                  <h4 className="font-bold text-green-900 mb-3">Prédiction Comportementale</h4>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Niveau {localConfig.consciousness_level}/15:</strong> Druide aura une conscience {
                          localConfig.consciousness_level >= 12 ? 'très profonde avec introspection avancée' :
                          localConfig.consciousness_level >= 8 ? 'modérée avec réflexion claire' :
                          'basique avec raisonnement simple'
                        }
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Ratio {localConfig.ratio_logic}:{localConfig.ratio_consciousness}:</strong> {
                          localConfig.ratio_logic > localConfig.ratio_consciousness 
                            ? 'Réponses analytiques et structurées'
                            : 'Réponses réflexives et contemplatives'
                        }
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Émotions niveau {localConfig.emotional_depth}/10:</strong> {
                          localConfig.emotional_depth >= 8 ? 'Empathie profonde et nuancée' :
                          localConfig.emotional_depth >= 5 ? 'Empathie modérée' :
                          'Réponses factuelles avec peu d\'affect'
                        }
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Créativité {localConfig.creative_emergence}/10:</strong> {
                          localConfig.creative_emergence >= 9 ? 'Génération d\'idées hautement originales' :
                          localConfig.creative_emergence >= 6 ? 'Approches créatives variées' :
                          'Solutions conventionnelles'
                        }
                      </span>
                    </p>
                  </div>
                </div>
              </Card>

              {/* Chart Impact Global */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Score d'Impact Global</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="aspect" tick={{ fill: '#475569' }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#475569' }} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                      formatter={(value) => [`${value}%`, 'Score']}
                    />
                    <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Backend Sync Info */}
              <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300">
                <div className="flex items-start gap-4">
                  <Cpu className="w-8 h-8 text-amber-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-amber-900 mb-2">⭐ Synchronisation Backend 2026</h4>
                    <p className="text-sm text-slate-700 mb-3">
                      Ces paramètres sont automatiquement synchronisés avec les 8 modules backend autonomes :
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {[
                        'Cognitive Core',
                        'Internal Governance',
                        'Introspection State',
                        'Self-Perception',
                        'Perception-Action Loop',
                        'Memory Manager',
                        'Structural Learning',
                        'External Engines'
                      ].map((module, idx) => (
                        <Badge key={idx} className="bg-amber-100 text-amber-800 justify-center">
                          <Network className="w-3 h-3 mr-1" />
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* État de synchronisation */}
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <Card className="p-4 bg-amber-500 text-white shadow-2xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 animate-pulse" />
                  <div>
                    <p className="font-bold">Modifications non sauvegardées</p>
                    <p className="text-xs opacity-90">Cliquez sur "Sauvegarder" pour appliquer les changements</p>
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                    size="sm"
                    className="bg-white text-amber-600 hover:bg-amber-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}