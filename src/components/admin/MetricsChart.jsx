/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Real-time Metrics Chart                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MetricsChart({ title, data, dataKey, color = "#8b5cf6", unit = "", showTrend = true }) {
  const calculateTrend = () => {
    if (!data || data.length < 2) return 0;
    const latest = data[data.length - 1][dataKey];
    const previous = data[data.length - 2][dataKey];
    return ((latest - previous) / previous) * 100;
  };

  const trend = calculateTrend();
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-slate-600";

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">{title}</h3>
        {showTrend && data && data.length > 0 && (
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}${unit}`}
          />
          <Tooltip 
            formatter={(value) => [`${value}${unit}`, dataKey]}
            labelFormatter={(label) => new Date(label).toLocaleString()}
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
    </Card>
  );
}