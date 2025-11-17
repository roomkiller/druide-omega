/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Evolution Metrics Dashboard                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { MessageSquare, Database, BookOpen, Image, GitBranch } from "lucide-react";
import { motion } from "framer-motion";

export default function EvolutionMetrics({ metrics }) {
  const metricsData = [
    {
      icon: MessageSquare,
      label: "Conversations",
      value: metrics.conversations || 0,
      points: (metrics.conversations || 0) * 2,
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: Database,
      label: "Mémoires",
      value: metrics.memories || 0,
      points: (metrics.memories || 0) * 5,
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: BookOpen,
      label: "Connaissances",
      value: metrics.knowledge || 0,
      points: (metrics.knowledge || 0) * 10,
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Image,
      label: "Créations Visuelles",
      value: metrics.visuals || 0,
      points: (metrics.visuals || 0) * 8,
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: GitBranch,
      label: "Workflows",
      value: metrics.workflows || 0,
      points: (metrics.workflows || 0) * 15,
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metricsData.map((metric, index) => {
        const Icon = metric.icon;
        
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-slate-600">{metric.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">
                      {metric.value}
                    </span>
                    <span className="text-xs text-slate-500">
                      (+{metric.points} pts)
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}