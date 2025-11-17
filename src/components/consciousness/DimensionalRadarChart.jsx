/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Dimensional Radar Chart                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function DimensionalRadarChart({ dimensions, title, maxValue = 13 }) {
  if (!dimensions || Object.keys(dimensions).length === 0) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">{title}</h3>
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">Aucune dimension disponible</p>
        </div>
      </Card>
    );
  }

  // Convertir les dimensions en format pour le radar
  const radarData = Object.entries(dimensions).map(([key, value]) => ({
    dimension: key.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    value: typeof value === 'number' ? value : 5,
    fullMark: maxValue
  }));

  // Calculer la moyenne
  const average = radarData.reduce((sum, d) => sum + d.value, 0) / radarData.length;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mt-1">{radarData.length} dimensions</p>
        </div>
        <Badge className="bg-purple-100 text-purple-700">
          Moy: {average.toFixed(1)}/{maxValue}
        </Badge>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis 
            dataKey="dimension" 
            style={{ fontSize: '11px' }}
            tick={{ fill: '#475569' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, maxValue]}
            style={{ fontSize: '10px' }}
          />
          <Radar 
            name={title}
            dataKey="value" 
            stroke="#8b5cf6" 
            fill="#8b5cf6" 
            fillOpacity={0.6}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Top dimensions */}
      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold text-slate-600">Dimensions principales:</p>
        <div className="flex flex-wrap gap-2">
          {radarData
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
            .map((d, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {d.dimension}: {d.value}
              </Badge>
            ))}
        </div>
      </div>
    </Card>
  );
}