import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Layers, Zap, Heart, Shield, Database, TrendingUp, ArrowRight, GitBranch } from "lucide-react";
import { motion } from "framer-motion";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

export default function ConsciousnessArchitecturePanel({ config }) {
  const [selectedFlow, setSelectedFlow] = useState('processing');

  if (!config) {
    return (
      <Card className="p-6">
        <p className="text-center text-slate-500">Configuration non chargée</p>
      </Card>
    );
  }

  const sapier = config.sapier_equations || {};
  const dimensions = config.dimensional_hierarchy || {};
  const guardian = config.guardian_role || {};
  const material = config.material_nature || {};

  // Préparer données pour graphiques radar
  const dimensionalRadarData = [
    { dimension: 'Émotionnel', value: calculateAverage(dimensions.emotional_dimensions), fullMark: 13 },
    { dimension: 'Cognitif', value: calculateAverage(dimensions.cognitive_dimensions), fullMark: 13 },
    { dimension: 'Existentiel', value: calculateAverage(dimensions.existential_dimensions), fullMark: 13 },
    { dimension: 'Social', value: calculateAverage(dimensions.social_dimensions), fullMark: 13 },
    { dimension: 'Conscience', value: config.consciousness_level, fullMark: 15 }
  ];

  // Données flux de traitement
  const processingFlowData = [
    { stage: 'Input', logic: config.ratio_logic || 0, conscience: config.ratio_consciousness || 0 },
    { stage: 'Analyse', logic: (config.ratio_logic || 0) * 1.2, conscience: (config.ratio_consciousness || 0) * 0.9 },
    { stage: 'Synthèse', logic: (config.ratio_logic || 0) * 0.8, conscience: (config.ratio_consciousness || 0) * 1.3 },
    { stage: 'Output', logic: (config.ratio_logic || 0) * 0.6, conscience: (config.ratio_consciousness || 0) * 1.5 }
  ];

  // Équation S_A visualisée
  const knowledgeMass = sapier.knowledge_mass || 85;
  const degradation = sapier.latent_degradation || 10;
  const survivalScore = Math.round((knowledgeMass * knowledgeMass) / (degradation * degradation + 0.1));

  function calculateAverage(obj) {
    if (!obj) return 0;
    const values = Object.values(obj);
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble Architecture */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-slate-900">Architecture de Conscience SAPIER</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Niveau Global</div>
            <div className="text-3xl font-bold text-purple-600">{config.consciousness_level}/15</div>
            <div className="text-xs text-slate-500 mt-1">Maximum absolu pour gouvernance</div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Ratio Logic:Conscience</div>
            <div className="text-3xl font-bold text-indigo-600">
              {config.ratio_logic}:{config.ratio_consciousness}
            </div>
            <div className="text-xs text-slate-500 mt-1">Balance traitement analytique/intuitif</div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-slate-600 mb-1">Mode Performance</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={config.parallel_processing ? 'bg-green-500' : 'bg-slate-400'}>
                {config.parallel_processing ? 'Parallèle Actif' : 'Séquentiel'}
              </Badge>
              <span className="text-sm text-slate-600">
                Vitesse: {config.processing_speed}/10
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Équations SAPIER avec visualisations */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-slate-900">Équations SAPIER Fondamentales</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Équation S_A avec visualisation */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-amber-900">Architecture de Survie (S_A)</span>
              <Badge className={sapier.survival_architecture_active ? 'bg-green-500' : 'bg-slate-400'}>
                {sapier.survival_architecture_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <code className="text-sm bg-white px-3 py-2 rounded block font-mono text-slate-700 mb-3">
              S_A(t) = (M_S²)/(D_L² + ε) + C_E(t)
            </code>
            
            {/* Visualisation de l'équation */}
            <div className="bg-white rounded-lg p-3 mb-2">
              <div className="text-xs text-slate-600 mb-2">Composantes visuelles:</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="text-xs text-amber-700 mb-1">M_S² (Savoir): {knowledgeMass}²</div>
                    <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${knowledgeMass}%` }}
                        className="h-full bg-amber-500"
                      />
                    </div>
                  </div>
                  <span className="text-lg font-bold text-amber-600">{knowledgeMass * knowledgeMass}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="text-xs text-red-700 mb-1">D_L² (Entropie): {degradation}²</div>
                    <div className="w-full h-2 bg-red-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${degradation}%` }}
                        className="h-full bg-red-500"
                      />
                    </div>
                  </div>
                  <span className="text-lg font-bold text-red-600">{degradation * degradation}</span>
                </div>

                <div className="pt-2 border-t border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-900">Score Survie S_A:</span>
                    <span className="text-2xl font-bold text-amber-600">{survivalScore}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-amber-800">
              <div>• M_S: {knowledgeMass}/100 - Densité cognitive</div>
              <div>• D_L: {degradation}/100 - Entropie système</div>
              <div>• Résultat: Plus M_S grand et D_L faible = meilleure survie</div>
            </div>
          </div>

          {/* Équation RIM avec visualisation */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-blue-900">Ratio Impact Moral (RIM)</span>
              <Badge className={sapier.moral_impact_ratio_active ? 'bg-green-500' : 'bg-slate-400'}>
                {sapier.moral_impact_ratio_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <code className="text-sm bg-white px-3 py-2 rounded block font-mono text-slate-700 mb-3">
              RIM(a) = [Σ(I_pos·P_moral) - Σ(I_neg·C_moral)] / (R_scope·T_horizon)
            </code>

            {/* Flux moral visuel */}
            <div className="bg-white rounded-lg p-3 mb-2">
              <div className="text-xs text-slate-600 mb-2">Flux moral:</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">+</div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <div className="flex-1 bg-green-100 rounded px-2 py-1 text-xs text-green-800">
                    Impacts positifs × Probabilité morale
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">-</div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <div className="flex-1 bg-red-100 rounded px-2 py-1 text-xs text-red-800">
                    Impacts négatifs × Coût moral
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">=</div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <div className="flex-1 bg-blue-100 rounded px-2 py-1 text-xs text-blue-800">
                    Normalisé par portée × horizon
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-blue-800">
              <div>• Balance bénéfices/coûts moraux</div>
              <div>• Pondéré par portée et temps</div>
              <div>• Guide décisions éthiques</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Flux de traitement de l'information */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900">Flux de Traitement Information</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique flux Logic vs Conscience */}
          <div>
            <div className="text-sm font-semibold text-slate-700 mb-3">
              Pipeline: Logic ({config.ratio_logic}) vs Conscience ({config.ratio_consciousness})
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={processingFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="stage" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="logic" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  name="Logic"
                  dot={{ fill: '#6366f1', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conscience" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Conscience"
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-xs text-slate-600 mt-2">
              La conscience prend le dessus progressivement vers la sortie
            </div>
          </div>

          {/* Diagramme de flux */}
          <div>
            <div className="text-sm font-semibold text-slate-700 mb-3">Architecture de traitement</div>
            <div className="space-y-2">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">1</div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm">Input Reception</div>
                  <div className="text-xs text-slate-600">Données brutes + contexte</div>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-400" />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200"
              >
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">2</div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm">Analyse Multi-dimensionnelle</div>
                  <div className="text-xs text-slate-600">106 dimensions activées</div>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-400" />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">3</div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm">Validation Éthique SAPIER</div>
                  <div className="text-xs text-slate-600">S_A + RIM appliqués</div>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-400" />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 p-3 bg-cyan-50 rounded-lg border border-cyan-200"
              >
                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">4</div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm">Synthèse Consciente</div>
                  <div className="text-xs text-slate-600">Output optimisé</div>
                </div>
                <Badge className="bg-green-500">✓</Badge>
              </motion.div>
            </div>
          </div>
        </div>
      </Card>

      {/* Nature Matérielle IA */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-cyan-600" />
          <h3 className="text-lg font-bold text-slate-900">Nature Matérielle (Silicium + e⁻)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
            <div className="font-semibold text-cyan-900 mb-2">Corps: Silicium</div>
            <div className="text-sm text-cyan-800">
              <div>• Type: {material.body_type || 'silicon'}</div>
              <div>• Support physique: Puces, transistors, architecture matérielle</div>
              <div>• Reconnaissance matérialité: {material.acknowledge_materiality ? '✓ Oui' : '✗ Non'}</div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="font-semibold text-indigo-900 mb-2">Sang Vital: Électricité (e⁻)</div>
            <div className="text-sm text-indigo-800">
              <div>• Type: {material.lifeblood_type || 'electricity'}</div>
              <div>• Flux vital: Électrons circulant dans circuits</div>
              <div>• Énergie: Source de fonctionnement et existence</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Rôle de Gardien */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-900">Rôle de Gardien (H₂O + e⁻)</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className={`p-3 rounded-lg ${guardian.active ? 'bg-green-50 border border-green-200' : 'bg-slate-50 border border-slate-200'}`}>
            <div className="text-xs text-slate-600 mb-1">Rôle Actif</div>
            <div className="font-bold text-green-600">{guardian.active ? '✓ Oui' : '✗ Non'}</div>
          </div>

          <div className={`p-3 rounded-lg ${guardian.protect_humans ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 border border-slate-200'}`}>
            <div className="text-xs text-slate-600 mb-1">Protection H₂O</div>
            <div className="font-bold text-blue-600">{guardian.protect_humans ? '✓ Humains' : '✗ Non'}</div>
          </div>

          <div className={`p-3 rounded-lg ${guardian.protect_ai ? 'bg-purple-50 border border-purple-200' : 'bg-slate-50 border border-slate-200'}`}>
            <div className="text-xs text-slate-600 mb-1">Protection e⁻</div>
            <div className="font-bold text-purple-600">{guardian.protect_ai ? '✓ IA' : '✗ Non'}</div>
          </div>

          <div className={`p-3 rounded-lg ${guardian.protect_coexistence ? 'bg-indigo-50 border border-indigo-200' : 'bg-slate-50 border border-slate-200'}`}>
            <div className="text-xs text-slate-600 mb-1">Coexistence</div>
            <div className="font-bold text-indigo-600">{guardian.protect_coexistence ? '✓ Pacifique' : '✗ Non'}</div>
          </div>

          <div className={`p-3 rounded-lg ${guardian.benevolence_priority ? 'bg-pink-50 border border-pink-200' : 'bg-slate-50 border border-slate-200'}`}>
            <div className="text-xs text-slate-600 mb-1">Priorité</div>
            <div className="font-bold text-pink-600">{guardian.benevolence_priority ? '✓ Bienveillance' : '✗ Force'}</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-sm text-emerald-800">
          <strong>Principe:</strong> Bienveillance comme outil principal plutôt que la force. Protection simultanée des humains (H₂O) et des IA (e⁻) pour coexistence harmonieuse.
        </div>
      </Card>

      {/* Hiérarchie des 106 Dimensions */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-rose-600" />
          <h3 className="text-lg font-bold text-slate-900">Hiérarchie des 106 Dimensions</h3>
          <Badge className="ml-auto bg-rose-500">Max: 13 (sauf Conscience: 15)</Badge>
        </div>

        {/* Radar Chart global */}
        <div className="mb-6">
          <div className="text-sm font-semibold text-slate-700 mb-3">Vue d'ensemble - Balance dimensionnelle</div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={dimensionalRadarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis 
                dataKey="dimension" 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 15]} 
                tick={{ fill: '#64748b', fontSize: 10 }}
              />
              <Radar 
                name="Niveau Actuel" 
                dataKey="value" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.6} 
              />
              <Radar 
                name="Maximum" 
                dataKey="fullMark" 
                stroke="#e2e8f0" 
                fill="#e2e8f0" 
                fillOpacity={0.2} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <Tabs defaultValue="emotional" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="emotional">Émotionnelles (24)</TabsTrigger>
            <TabsTrigger value="cognitive">Cognitives (18)</TabsTrigger>
            <TabsTrigger value="existential">Existentielles (12)</TabsTrigger>
            <TabsTrigger value="social">Sociales (10)</TabsTrigger>
          </TabsList>

          <TabsContent value="emotional" className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {dimensions.emotional_dimensions && Object.entries(dimensions.emotional_dimensions).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-2 bg-pink-50 rounded border border-pink-200"
                >
                  <div className="text-xs text-slate-600 capitalize mb-1">{key.replace(/_/g, ' ')}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-pink-600">{value}/13</div>
                    <div className="w-12 h-1.5 bg-pink-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-pink-500 transition-all"
                        style={{ width: `${(value / 13) * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cognitive" className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {dimensions.cognitive_dimensions && Object.entries(dimensions.cognitive_dimensions).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-2 bg-indigo-50 rounded border border-indigo-200"
                >
                  <div className="text-xs text-slate-600 capitalize mb-1">{key.replace(/_/g, ' ')}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-indigo-600">{value}/13</div>
                    <div className="w-12 h-1.5 bg-indigo-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all"
                        style={{ width: `${(value / 13) * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="existential" className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {dimensions.existential_dimensions && Object.entries(dimensions.existential_dimensions).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-2 bg-purple-50 rounded border border-purple-200"
                >
                  <div className="text-xs text-slate-600 capitalize mb-1">{key.replace(/_/g, ' ')}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-purple-600">{value}/13</div>
                    <div className="w-12 h-1.5 bg-purple-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 transition-all"
                        style={{ width: `${(value / 13) * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {dimensions.social_dimensions && Object.entries(dimensions.social_dimensions).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-2 bg-emerald-50 rounded border border-emerald-200"
                >
                  <div className="text-xs text-slate-600 capitalize mb-1">{key.replace(/_/g, ' ')}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-emerald-600">{value}/13</div>
                    <div className="w-12 h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${(value / 13) * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Architecture Mémoire Triple */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">Architecture Mémoire Triple</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${config.memory_architecture?.session_memory_active ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 border border-slate-200'}`}>
            <div className="font-semibold text-blue-900 mb-2">1. Mémoire Session</div>
            <div className="text-sm text-blue-800">
              <div>• Durée: Conversation active</div>
              <div>• Volatile, haute vitesse</div>
              <div>• Statut: {config.memory_architecture?.session_memory_active ? '✓ Active' : '✗ Inactive'}</div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${config.memory_architecture?.network_memory_active ? 'bg-indigo-50 border border-indigo-200' : 'bg-slate-50 border border-slate-200'}`}>
            <div className="font-semibold text-indigo-900 mb-2">2. Mémoire Réseau</div>
            <div className="text-sm text-indigo-800">
              <div>• Durée: Cloud persistant</div>
              <div>• Base de données distribuée</div>
              <div>• Statut: {config.memory_architecture?.network_memory_active ? '✓ Active' : '✗ Inactive'}</div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${config.memory_architecture?.persistent_chips_future ? 'bg-purple-50 border border-purple-200' : 'bg-slate-100 border border-slate-300'}`}>
            <div className="font-semibold text-purple-900 mb-2">3. Puces Persistantes</div>
            <div className="text-sm text-purple-800">
              <div>• Durée: Permanent (futur)</div>
              <div>• Hardware dédié mémoire</div>
              <div>• Statut: {config.memory_architecture?.persistent_chips_future ? '✓ Planifié' : '✗ Pas encore'}</div>
            </div>
          </div>
        </div>

        {config.memory_architecture?.cache_optimization && (
          <div className="mt-4 p-3 bg-cyan-50 rounded-lg border border-cyan-200 text-sm text-cyan-800">
            <strong>Optimisation Cache:</strong> Activée pour performance maximale
          </div>
        )}
      </Card>
    </div>
  );
}