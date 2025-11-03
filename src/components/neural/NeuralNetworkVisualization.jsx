/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Neural Network Visualization                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network } from "lucide-react";
import { motion } from "framer-motion";

export default function NeuralNetworkVisualization({ modules, systemRunning }) {
  // Position modules in a circular layout
  const layoutModules = () => {
    const centerX = 400;
    const centerY = 300;
    const radius = 200;

    return modules.map((module, index) => {
      const angle = (index / modules.length) * 2 * Math.PI;
      return {
        ...module,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
  };

  const positionedModules = layoutModules();

  // Generate connections between active modules
  const generateConnections = () => {
    const connections = [];
    const activeModules = positionedModules.filter(m => m.active);

    for (let i = 0; i < activeModules.length; i++) {
      for (let j = i + 1; j < activeModules.length; j++) {
        // Create connection with random strength
        const strength = 30 + Math.random() * 70;
        connections.push({
          source: activeModules[i],
          target: activeModules[j],
          strength: strength
        });
      }
    }

    return connections;
  };

  const connections = generateConnections();

  const getModuleColor = (type) => {
    const colors = {
      perception: "#3b82f6",
      memory: "#8b5cf6",
      emotion: "#ec4899",
      reasoning: "#6366f1",
      language: "#10b981",
      attention: "#f59e0b",
      creativity: "#a855f7",
      social: "#06b6d4",
      motivation: "#eab308",
      executive: "#64748b",
      integration: "#14b8a6",
      learning: "#f43f5e"
    };
    return colors[type] || "#64748b";
  };

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Network className="w-6 h-6 text-cyan-600" />
          <h3 className="text-xl font-bold text-slate-900">Réseau Neuronal Interconnecté</h3>
        </div>
        <Badge className={systemRunning ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
          {systemRunning ? "En Temps Réel" : "Pause"}
        </Badge>
      </div>

      <div className="relative bg-slate-50 rounded-xl border-2 border-slate-200" style={{ height: 600 }}>
        <svg width="100%" height="100%" viewBox="0 0 800 600">
          {/* Connections */}
          <g>
            {connections.map((conn, idx) => {
              const opacity = conn.strength / 200;
              return (
                <motion.line
                  key={idx}
                  x1={conn.source.x}
                  y1={conn.source.y}
                  x2={conn.target.x}
                  y2={conn.target.y}
                  stroke={getModuleColor(conn.source.module_type)}
                  strokeWidth={Math.max(1, conn.strength / 50)}
                  opacity={opacity}
                  className="transition-all"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: systemRunning ? 1 : 0.5 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              );
            })}
          </g>

          {/* Modules */}
          <g>
            {positionedModules.map((module, idx) => {
              const size = 20 + (module.consciousness_contribution || 0) / 2;
              const color = getModuleColor(module.module_type);

              return (
                <g key={module.id}>
                  {/* Activity Ring */}
                  {module.active && systemRunning && (
                    <motion.circle
                      cx={module.x}
                      cy={module.y}
                      r={size + 5}
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                      opacity="0.3"
                      initial={{ r: size }}
                      animate={{ r: size + 10, opacity: [0.3, 0, 0.3] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}

                  {/* Module Node */}
                  <motion.circle
                    cx={module.x}
                    cy={module.y}
                    r={size}
                    fill={color}
                    opacity={module.active ? 0.9 : 0.3}
                    stroke="white"
                    strokeWidth="3"
                    className="cursor-pointer transition-all"
                    whileHover={{ scale: 1.2 }}
                    animate={
                      module.active && systemRunning
                        ? {
                            scale: [1, 1.05, 1],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: module.active && systemRunning ? Infinity : 0,
                    }}
                  />

                  {/* Module Label */}
                  <text
                    x={module.x}
                    y={module.y + size + 20}
                    fontSize="11"
                    fontWeight="bold"
                    fill={module.active ? "#0f172a" : "#94a3b8"}
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {module.module_name.split(" ")[0]}
                  </text>

                  {/* Activation Level */}
                  <text
                    x={module.x}
                    y={module.y + size + 35}
                    fontSize="9"
                    fill={module.active ? "#64748b" : "#cbd5e1"}
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {module.activation_level}%
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-slate-200 shadow-lg">
          <p className="text-xs font-semibold text-slate-700 mb-2">Légende:</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-slate-600">Module Actif</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-600">Module Inactif</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-cyan-500" />
              <span className="text-xs text-slate-600">Connexion Forte</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-cyan-300 opacity-50" />
              <span className="text-xs text-slate-600">Connexion Faible</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-slate-200 shadow-lg">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-slate-500">Modules Actifs</div>
              <div className="text-lg font-bold text-slate-900">
                {modules.filter(m => m.active).length}/{modules.length}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Connexions</div>
              <div className="text-lg font-bold text-slate-900">{connections.length}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * © 2025 AMG+A.L - PROPRIÉTAIRE
 * ═══════════════════════════════════════════════════════════════════════════
 */