/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Consciousness Metrics Chart                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function ConsciousnessMetricsChart({ data, metric, title, color = "#8b5cf6" }) {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">{title}</h3>
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">Aucune donnée disponible</p>
        </div>
      </Card>
    );
  }

  const latestValue = data[data.length - 1]?.[metric] || 0;
  const previousValue = data[data.length - 2]?.[metric] || latestValue;
  const change = latestValue - previousValue;
  const changePercent = previousValue !== 0 ? ((change / previousValue) * 100).toFixed(1) : 0;

  const TrendIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const trendColor = change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-slate-600";

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold" style={{ color }}>{latestValue}</span>
            <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span>{Math.abs(changePercent)}%</span>
            </div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="timestamp" 
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey={metric} 
            stroke={color} 
            strokeWidth={2}
            fill={`url(#gradient-${metric})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}