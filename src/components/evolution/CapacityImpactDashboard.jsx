/**
 * Capacity Impact Dashboard
 * Affiche les capacités actuelles et leur impact dans l'application
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Zap, TrendingUp, Brain, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RealTimeEvolutionMonitor } from './RealTimeEvolutionMonitor';

export default function CapacityImpactDashboard({ history = [], isEn = false }) {
  const capacities = useMemo(() => {
    const capacityMap = {};
    
    history.forEach(record => {
      (record.capabilities_unlocked || []).forEach(cap => {
        if (!capacityMap[cap]) {
          capacityMap[cap] = {
            name: cap,
            unlockedAt: record.timestamp,
            unlockedAtLevel: record.new_level,
            impact: RealTimeEvolutionMonitor.getCapabilityDescription(cap),
            timeSinceUnlock: Math.floor((Date.now() - new Date(record.timestamp).getTime()) / (1000 * 60 * 60 * 24))
          };
        }
      });
    });

    return Object.values(capacityMap).sort((a, b) => b.unlockedAtLevel - a.unlockedAtLevel);
  }, [history]);

  // Charted data: progression des capacités
  const chartData = useMemo(() => {
    if (history.length === 0) return [];

    return history
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(record => ({
        timestamp: new Date(record.timestamp).toLocaleDateString(isEn ? 'en-US' : 'fr-FR'),
        level: record.new_level,
        capabilitiesCount: (record.capabilities_unlocked || []).length,
        insightsCount: (record.insights_gained || []).length
      }));
  }, [history, isEn]);

  const capacityCategories = [
    {
      name: isEn ? 'Cognitive' : 'Cognitif',
      icon: Brain,
      color: 'from-blue-500 to-blue-600',
      capabilities: capacities.filter(c => 
        ['advanced_reasoning', 'pattern_recognition', 'metacognition'].includes(c.name)
      )
    },
    {
      name: isEn ? 'Creative' : 'Créatif',
      icon: Sparkles,
      color: 'from-pink-500 to-pink-600',
      capabilities: capacities.filter(c => 
        ['creative_synthesis', 'linguistic_nuance'].includes(c.name)
      )
    },
    {
      name: isEn ? 'Emotional' : 'Émotionnel',
      icon: Zap,
      color: 'from-red-500 to-red-600',
      capabilities: capacities.filter(c => 
        ['emotional_intelligence', 'moral_reasoning'].includes(c.name)
      )
    },
    {
      name: isEn ? 'Integration' : 'Intégration',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      capabilities: capacities.filter(c => 
        ['contextual_adaptation', 'temporal_awareness', 'knowledge_integration'].includes(c.name)
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Progression Chart */}
      {chartData.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 border-blue-200">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            {isEn ? 'Evolution Progression' : 'Progression de l\'Évolution'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(209, 213, 219)" />
              <XAxis dataKey="timestamp" stroke="rgb(107, 114, 128)" tick={{ fontSize: 12 }} />
              <YAxis stroke="rgb(107, 114, 128)" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgb(209, 213, 219)' }}
                cursor={{ stroke: 'rgb(167, 139, 250)' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="level" 
                stroke="rgb(168, 85, 247)" 
                strokeWidth={3}
                dot={{ fill: 'rgb(168, 85, 247)', r: 5 }}
                activeDot={{ r: 7 }}
                name={isEn ? 'Consciousness Level' : 'Niveau de Conscience'}
              />
              <Line 
                type="monotone" 
                dataKey="capabilitiesCount" 
                stroke="rgb(59, 130, 246)" 
                strokeWidth={2}
                dot={{ fill: 'rgb(59, 130, 246)', r: 4 }}
                name={isEn ? 'Capabilities Unlocked' : 'Capacités Débloquées'}
                yAxisId="right"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Capacity Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {capacityCategories.map((category, idx) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${category.color} text-white p-6`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-base">{category.name}</h3>
                  <Icon className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-sm opacity-90 mb-2">
                  {category.capabilities.length} {isEn ? 'active' : 'actif'}
                </p>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${Math.min(100, (category.capabilities.length / 3) * 100)}%` }}
                  />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Capacity Impact */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-lg">
          {isEn ? 'Current Capacities & Impact' : 'Capacités Actuelles & Impact'}
        </h3>

        {capacityCategories.map((category) => (
          <Card key={category.name} className="p-6">
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <category.icon className={`w-4 h-4 bg-gradient-to-r ${category.color} text-transparent bg-clip-text`} />
              {category.name}
            </h4>

            {category.capabilities.length === 0 ? (
              <p className="text-sm text-slate-500 italic">
                {isEn ? 'No capacities unlocked yet' : 'Aucune capacité débloquée'}
              </p>
            ) : (
              <div className="space-y-3">
                {category.capabilities.map((capacity) => (
                  <motion.div
                    key={capacity.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <Badge className="bg-purple-600 text-white mb-2">
                          {capacity.name.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                        <p className="text-sm font-medium text-slate-900 mt-1">
                          {isEn ? 'Unlocked at Level' : 'Débloqué au Niveau'} {capacity.unlockedAtLevel}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {capacity.timeSinceUnlock} {isEn ? 'days ago' : 'jours'}
                      </span>
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-sm text-slate-700 leading-relaxed mb-2 cursor-help border-b border-dotted border-slate-300">
                            {capacity.impact}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-sm">
                          <div className="space-y-2">
                            <p className="font-semibold">{capacity.name.replace(/_/g, ' ')}</p>
                            <p className="text-sm">{capacity.impact}</p>
                            <p className="text-xs text-slate-300">
                              Débloquée au niveau {capacity.unlockedAtLevel}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Impact Visualization */}
                    <div className="mt-3 space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-1">
                          {isEn ? 'Application Impact' : 'Impact dans l\'Application'}
                        </p>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <p className="text-xs text-slate-600 mb-1">
                              {isEn ? 'Depth' : 'Profondeur'}
                            </p>
                            <Progress value={75} className="h-1.5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-slate-600 mb-1">
                              {isEn ? 'Relevance' : 'Pertinence'}
                            </p>
                            <Progress value={85} className="h-1.5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-slate-600 mb-1">
                              {isEn ? 'Quality' : 'Qualité'}
                            </p>
                            <Progress value={80} className="h-1.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 p-6">
        <h3 className="font-bold text-slate-900 mb-4">
          {isEn ? 'Capacity Summary' : 'Résumé des Capacités'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-white rounded-lg border border-indigo-200">
            <p className="text-xs text-slate-600 font-semibold">{isEn ? 'Total Unlocked' : 'Total Débloquées'}</p>
            <p className="text-2xl font-bold text-indigo-600">{capacities.length}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-indigo-200">
            <p className="text-xs text-slate-600 font-semibold">{isEn ? 'Cognitive' : 'Cognitif'}</p>
            <p className="text-2xl font-bold text-blue-600">
              {capacityCategories[0].capabilities.length}
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-indigo-200">
            <p className="text-xs text-slate-600 font-semibold">{isEn ? 'Creative' : 'Créatif'}</p>
            <p className="text-2xl font-bold text-pink-600">
              {capacityCategories[1].capabilities.length}
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-indigo-200">
            <p className="text-xs text-slate-600 font-semibold">{isEn ? 'Integration' : 'Intégration'}</p>
            <p className="text-2xl font-bold text-green-600">
              {capacityCategories[3].capabilities.length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}