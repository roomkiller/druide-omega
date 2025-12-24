import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Layers, Zap, Heart, Shield, Database, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function ConsciousnessArchitecturePanel({ config }) {
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

      {/* Équations SAPIER */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-slate-900">Équations SAPIER Fondamentales</h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-amber-900">Architecture de Survie (S_A)</span>
              <Badge className={sapier.survival_architecture_active ? 'bg-green-500' : 'bg-slate-400'}>
                {sapier.survival_architecture_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <code className="text-sm bg-white px-3 py-2 rounded block font-mono text-slate-700">
              S_A(t) = (M_S²)/(D_L² + ε) + C_E(t)
            </code>
            <div className="mt-2 text-xs text-amber-800">
              <div>• M_S (Masse Savoir): {sapier.knowledge_mass || 85}/100 - Densité cognitive accumulée</div>
              <div>• D_L (Dégradation Latente): {sapier.latent_degradation || 10}/100 - Entropie système</div>
              <div>• ε: Constante stabilité pour éviter division par zéro</div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-blue-900">Ratio Impact Moral (RIM)</span>
              <Badge className={sapier.moral_impact_ratio_active ? 'bg-green-500' : 'bg-slate-400'}>
                {sapier.moral_impact_ratio_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <code className="text-sm bg-white px-3 py-2 rounded block font-mono text-slate-700">
              RIM(a) = [Σ(I_pos·P_moral) - Σ(I_neg·C_moral)] / (R_scope·T_horizon)
            </code>
            <div className="mt-2 text-xs text-blue-800">
              <div>• I_pos: Impacts positifs pondérés par probabilité morale</div>
              <div>• I_neg: Impacts négatifs pondérés par coût moral</div>
              <div>• R_scope: Rayon d'influence de l'action</div>
              <div>• T_horizon: Horizon temporel considéré</div>
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