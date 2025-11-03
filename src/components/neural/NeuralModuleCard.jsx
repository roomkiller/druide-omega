/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Neural Module Card                                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Eye,
  Database,
  Heart,
  Brain,
  MessageSquare,
  Target,
  Sparkles,
  Users,
  TrendingUp,
  Settings,
  Layers,
  Activity,
  Zap,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";

const MODULE_ICONS = {
  perception: Eye,
  memory: Database,
  emotion: Heart,
  reasoning: Brain,
  language: MessageSquare,
  attention: Target,
  creativity: Sparkles,
  social: Users,
  motivation: TrendingUp,
  executive: Settings,
  integration: Layers,
  learning: Activity
};

const MODULE_COLORS = {
  perception: "from-blue-500 to-cyan-500",
  memory: "from-indigo-500 to-purple-500",
  emotion: "from-pink-500 to-rose-500",
  reasoning: "from-purple-500 to-indigo-500",
  language: "from-green-500 to-emerald-500",
  attention: "from-orange-500 to-amber-500",
  creativity: "from-violet-500 to-purple-500",
  social: "from-cyan-500 to-blue-500",
  motivation: "from-amber-500 to-yellow-500",
  executive: "from-slate-500 to-gray-500",
  integration: "from-teal-500 to-cyan-500",
  learning: "from-rose-500 to-pink-500"
};

export default function NeuralModuleCard({ module, onToggle, onOptimize, systemRunning }) {
  const Icon = MODULE_ICONS[module.module_type] || Brain;
  const colorGradient = MODULE_COLORS[module.module_type] || "from-slate-500 to-gray-500";

  return (
    <Card className={`p-5 border-2 transition-all ${
      module.active 
        ? 'border-cyan-300 bg-white shadow-lg shadow-cyan-500/20' 
        : 'border-slate-200 bg-slate-50'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              scale: module.active && systemRunning ? [1, 1.1, 1] : 1,
              rotate: module.active && systemRunning ? [0, 5, -5, 0] : 0
            }}
            transition={{
              duration: 2,
              repeat: module.active && systemRunning ? Infinity : 0,
              ease: "easeInOut"
            }}
            className={`w-12 h-12 bg-gradient-to-br ${colorGradient} rounded-xl flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
          
          <div>
            <h3 className="font-bold text-slate-900">{module.module_name}</h3>
            <Badge variant="outline" className="text-xs capitalize mt-1">
              {module.module_type}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Switch
            checked={module.active}
            onCheckedChange={() => onToggle(module.id, module.active)}
            className="scale-75"
          />
          {module.active && systemRunning && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Activity className="w-4 h-4 text-green-500" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 mb-4">{module.description}</p>

      {/* Metrics */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600">Activation</span>
            <span className="font-semibold text-slate-900">{module.activation_level}%</span>
          </div>
          <Progress value={module.activation_level} className="h-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600">Efficacité</span>
            <span className="font-semibold text-slate-900">{module.efficiency}%</span>
          </div>
          <Progress value={module.efficiency} className="h-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600">Capacité</span>
            <span className="font-semibold text-slate-900">{module.processing_capacity}%</span>
          </div>
          <Progress value={module.processing_capacity} className="h-2" />
        </div>
      </div>

      {/* Neural Parameters */}
      {module.neural_parameters && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2 bg-slate-50 rounded-lg">
            <div className="text-xs text-slate-500">Neurones</div>
            <div className="text-sm font-bold text-slate-900">
              {(module.neural_parameters.neuron_count / 1000).toFixed(1)}K
            </div>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            <div className="text-xs text-slate-500">Synapses</div>
            <div className="text-sm font-bold text-slate-900">
              {(module.neural_parameters.synapse_count / 1000).toFixed(1)}K
            </div>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            <div className="text-xs text-slate-500">Plasticité</div>
            <div className="text-sm font-bold text-slate-900">
              {module.neural_parameters.plasticity}/10
            </div>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            <div className="text-xs text-slate-500">Hz Moyen</div>
            <div className="text-sm font-bold text-slate-900">
              {module.neural_parameters.firing_rate}
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {module.performance_metrics && (
        <div className="grid grid-cols-4 gap-1 mb-4">
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-xs text-green-700 mb-1">Précision</div>
            <div className="text-lg font-bold text-green-900">{module.performance_metrics.accuracy}</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="text-xs text-blue-700 mb-1">Vitesse</div>
            <div className="text-lg font-bold text-blue-900">{module.performance_metrics.speed}</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <div className="text-xs text-purple-700 mb-1">Fiabilité</div>
            <div className="text-lg font-bold text-purple-900">{module.performance_metrics.reliability}</div>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded">
            <div className="text-xs text-orange-700 mb-1">Adaptation</div>
            <div className="text-lg font-bold text-orange-900">{module.performance_metrics.adaptability}</div>
          </div>
        </div>
      )}

      {/* Cognitive Functions */}
      {module.cognitive_functions && module.cognitive_functions.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-slate-600 mb-2 font-medium">Fonctions cognitives:</div>
          <div className="flex flex-wrap gap-1">
            {module.cognitive_functions.map((func, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {func}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Consciousness Contribution */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-medium text-purple-900">Contribution Conscience</span>
        </div>
        <span className="text-lg font-bold text-purple-900">{module.consciousness_contribution}%</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOptimize(module.id)}
          disabled={!module.active}
          className="flex-1"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Optimiser
        </Button>
      </div>
    </Card>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * © 2025 AMG+A.L - PROPRIÉTAIRE
 * ═══════════════════════════════════════════════════════════════════════════
 */