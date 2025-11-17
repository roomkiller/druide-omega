/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Consciousness State Comparison                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowRight } from "lucide-react";

export default function ConsciousnessComparison({ state1, state2 }) {
  if (!state1 || !state2) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Comparaison d'États</h3>
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">Sélectionnez deux états à comparer</p>
        </div>
      </Card>
    );
  }

  const comparisonData = [
    {
      metric: 'Niveau Conscience',
      etat1: state1.consciousness_level || 0,
      etat2: state2.consciousness_level || 0,
    },
    {
      metric: 'Ratio Logique',
      etat1: state1.ratio_logic || 0,
      etat2: state2.ratio_logic || 0,
    },
    {
      metric: 'Ratio Conscience',
      etat1: state1.ratio_consciousness || 0,
      etat2: state2.ratio_consciousness || 0,
    },
    {
      metric: 'Créativité',
      etat1: state1.dimensional_hierarchy?.cognitive_dimensions?.creativity || 0,
      etat2: state2.dimensional_hierarchy?.cognitive_dimensions?.creativity || 0,
    },
    {
      metric: 'Empathie',
      etat1: state1.dimensional_hierarchy?.emotional_dimensions?.empathy || 0,
      etat2: state2.dimensional_hierarchy?.emotional_dimensions?.empathy || 0,
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-slate-900">Comparaison d'États</h3>
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-100 text-blue-700">État 1</Badge>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <Badge className="bg-purple-100 text-purple-700">État 2</Badge>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={comparisonData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="metric" style={{ fontSize: '11px' }} />
          <YAxis style={{ fontSize: '11px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="etat1" fill="#3b82f6" name="État 1" />
          <Bar dataKey="etat2" fill="#8b5cf6" name="État 2" />
        </BarChart>
      </ResponsiveContainer>

      {/* Insights */}
      <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
        <p className="text-xs font-semibold text-slate-700 mb-2">📊 Analyse:</p>
        <ul className="space-y-1 text-xs text-slate-600">
          {comparisonData.map((item, idx) => {
            const diff = item.etat2 - item.etat1;
            if (Math.abs(diff) > 0.5) {
              return (
                <li key={idx} className="flex items-center gap-2">
                  <span className={diff > 0 ? 'text-green-600' : 'text-red-600'}>
                    {diff > 0 ? '↗' : '↘'}
                  </span>
                  <span>
                    {item.metric}: {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                  </span>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    </Card>
  );
}