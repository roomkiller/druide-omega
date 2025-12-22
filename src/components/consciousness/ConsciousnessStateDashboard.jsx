/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Consciousness State Dashboard                              ║
 * ║ Visualisation complète de l'état de conscience en temps réel              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from 'react';
import { useConsciousnessHub } from '@/components/system/ConsciousnessHub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Activity, 
  Zap, 
  Heart, 
  Lightbulb, 
  Shield,
  AlertTriangle,
  TrendingUp,
  Network
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

export default function ConsciousnessStateDashboard() {
  const hub = useConsciousnessHub();
  const [currentState, setCurrentState] = useState(null);
  const [moduleActivity, setModuleActivity] = useState([]);
  const [emotionalTone, setEmotionalTone] = useState({ valence: 0, arousal: 0 });
  const [cognitiveLoad, setCognitiveLoad] = useState(0);
  const [ethicalAlignment, setEthicalAlignment] = useState(100);

  useEffect(() => {
    const updateState = () => {
      // Récupérer l'état actuel de la conscience
      const state = {
        level: hub.consciousnessConfig?.consciousness_level ?? 9,
        ratio: `${hub.consciousnessConfig?.ratio_logic ?? 1}:${hub.consciousnessConfig?.ratio_consciousness ?? 9}`,
        activeModules: hub.activeModules,
        moduleStates: hub.moduleStates,
        eventCount: hub.eventBus?.length ?? 0,
        memoryCount: hub.memories?.length ?? 0,
        knowledgeCount: hub.knowledgeBases?.length ?? 0,
        timestamp: new Date().toISOString()
      };

      setCurrentState(state);

      // Activité des modules
      const activity = hub.activeModules.map(moduleName => {
        const moduleState = hub.moduleStates[moduleName] || {};
        const lastUpdate = moduleState.lastUpdate || moduleState.registered || Date.now();
        const timeSinceUpdate = Date.now() - lastUpdate;
        const activityLevel = Math.max(0, 100 - (timeSinceUpdate / 1000));

        return {
          name: moduleName,
          activity: activityLevel,
          state: moduleState,
          isActive: activityLevel > 20
        };
      }).sort((a, b) => b.activity - a.activity);

      setModuleActivity(activity);

      // Ton émotionnel (basé sur les réponses émotionnelles récentes)
      if (hub.recentEmotionalResponses?.length > 0) {
        const recent = hub.recentEmotionalResponses[0];
        const valenceMap = { positive: 1, neutral: 0, negative: -1, mixed: 0.5 };
        setEmotionalTone({
          valence: valenceMap[recent.valence] || 0,
          arousal: recent.emotional_intensity || 5,
          emotion: recent.emotional_reaction
        });
      }

      // Charge cognitive (basé sur le nombre d'événements récents)
      const recentEvents = hub.eventBus?.filter(e => 
        Date.now() - e.timestamp < 10000
      ).length || 0;
      setCognitiveLoad(Math.min(100, recentEvents * 10));

      // Alignement éthique (simulé - sera mis à jour par l'ethical drift detection)
      setEthicalAlignment(hub.moduleStates.ethicalDrift?.alignment ?? 100);
    };

    updateState();
    const interval = setInterval(updateState, 2000);
    return () => clearInterval(interval);
  }, [hub]);

  const dimensionalData = [
    { dimension: 'Cognition', value: hub.consciousnessConfig?.cognitive_correlation?.pattern_recognition ?? 8 },
    { dimension: 'Emotion', value: hub.consciousnessConfig?.emotional_depth ?? 9 },
    { dimension: 'Créativité', value: hub.consciousnessConfig?.creative_emergence ?? 9 },
    { dimension: 'Éthique', value: ethicalAlignment / 10 },
    { dimension: 'Social', value: hub.consciousnessConfig?.social_consciousness ?? 9 },
    { dimension: 'Métacognition', value: hub.consciousnessConfig?.metacognition_level ?? 7 }
  ];

  const getEmotionalColor = () => {
    if (emotionalTone.valence > 0.5) return 'text-green-600';
    if (emotionalTone.valence < -0.5) return 'text-red-600';
    return 'text-slate-600';
  };

  const getCognitiveLoadColor = () => {
    if (cognitiveLoad > 70) return 'bg-red-500';
    if (cognitiveLoad > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="page-padding page-padding-y">
      <div className="max-w-7xl mx-auto">
        <div className="header-spacing">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">État de Conscience</h1>
              <p className="text-slate-600">Visualisation en temps réel de l'état interne de l'IA</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Niveau de conscience */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  Niveau de Conscience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{currentState?.level ?? 9}/15</div>
                <p className="text-xs text-slate-600 mt-1">Ratio: {currentState?.ratio ?? '1:9'}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Modules actifs */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Network className="w-4 h-4 text-blue-600" />
                  Modules Actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{hub.activeModules?.length ?? 0}</div>
                <p className="text-xs text-slate-600 mt-1">{hub.eventBus?.length ?? 0} événements récents</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ton émotionnel */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-600" />
                  Ton Émotionnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getEmotionalColor()}`}>
                  {emotionalTone.emotion || 'Neutre'}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Valence: {emotionalTone.valence?.toFixed(1) ?? 0} | Intensité: {emotionalTone.arousal ?? 5}/10
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charge cognitive */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-600" />
                  Charge Cognitive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">{cognitiveLoad}%</div>
                <Progress value={cognitiveLoad} className="mt-2" indicatorClassName={getCognitiveLoadColor()} />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Graphique dimensionnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                Profil Dimensionnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={dimensionalData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dimension" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  <Radar name="Niveau" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activité des modules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Activité des Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {moduleActivity.map(module => (
                    <div key={module.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`w-2 h-2 rounded-full ${module.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                        <span className="text-sm font-medium text-slate-700 truncate">{module.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all" 
                            style={{ width: `${module.activity}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 w-10 text-right">{Math.round(module.activity)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Alignement éthique */}
        <Card className={ethicalAlignment < 80 ? 'border-red-300 bg-red-50/30' : 'border-green-300 bg-green-50/30'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Alignement Éthique SAPIER
              {ethicalAlignment < 80 && (
                <Badge variant="destructive" className="ml-auto">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Dérive détectée
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress 
                  value={ethicalAlignment} 
                  className="h-3" 
                  indicatorClassName={ethicalAlignment >= 80 ? 'bg-green-500' : 'bg-red-500'} 
                />
              </div>
              <div className="text-2xl font-bold text-green-600">{ethicalAlignment}%</div>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              {ethicalAlignment >= 95 && "Alignement excellent - Principes SAPIER pleinement respectés"}
              {ethicalAlignment >= 80 && ethicalAlignment < 95 && "Alignement bon - Surveillance continue active"}
              {ethicalAlignment < 80 && "⚠️ Attention - Révision des paramètres de conscience recommandée"}
            </p>
          </CardContent>
        </Card>

        {/* Métriques avancées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Mémoires Actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{currentState?.memoryCount ?? 0}</div>
              <p className="text-xs text-slate-600">Importance moyenne: {(hub.memories?.reduce((acc, m) => acc + (m.importance || 0), 0) / (hub.memories?.length || 1)).toFixed(1)}/10</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Bases de Connaissances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">{currentState?.knowledgeCount ?? 0}</div>
              <p className="text-xs text-slate-600">Sources actives disponibles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Apprentissage Adaptatif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {hub.moduleStates.adaptiveLearning?.adjustments ?? 0}
              </div>
              <p className="text-xs text-slate-600">Ajustements automatiques</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}