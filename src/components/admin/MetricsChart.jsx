/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Real-time Metrics Chart                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import SafeChart from "@/components/charts/SafeChart";

export default function MetricsChart({ title, data, dataKey, color = "#8b5cf6", unit = "", showTrend = true }) {
  // Guard: vérifier que data est valide
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        <div className="flex items-center justify-center h-[200px] text-slate-400">
          Aucune donnée disponible
        </div>
      </Card>
    );
  }

  const calculateTrend = () => {
    if (data.length < 2) return 0;
    const latest = data[data.length - 1]?.[dataKey];
    const previous = data[data.length - 2]?.[dataKey];
    if (typeof latest !== 'number' || typeof previous !== 'number' || previous === 0) return 0;
    return ((latest - previous) / previous) * 100;
  };

  const trend = calculateTrend();
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-slate-600";

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">{title}</h3>
        {showTrend && data.length > 1 && (
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>

      <SafeChart minHeight={200}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="timestamp" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                try {
                  return new Date(value).toLocaleTimeString();
                } catch {
                  return value;
                }
              }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}${unit}`}
            />
            <Tooltip 
              formatter={(value) => [`${value}${unit}`, dataKey]}
              labelFormatter={(label) => {
                try {
                  return new Date(label).toLocaleString();
                } catch {
                  return label;
                }
              }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </SafeChart>
    </Card>
  );
}