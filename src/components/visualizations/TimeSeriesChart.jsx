/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Interactive Time Series Chart                              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from "recharts";
import { useVisualizationOptimization } from "./BaseVisualization";

export default function TimeSeriesChart({ data, title, metrics, type = "line" }) {
  // Optimisation: downsampling si trop de données
  const optimizedData = useVisualizationOptimization(data, [type]);
  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;

    return (
      <Card className="p-3 shadow-lg border-slate-200">
        <p className="text-xs font-semibold text-slate-900 mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-600">{entry.name}:</span>
            <span className="text-xs font-bold" style={{ color: entry.color }}>
              {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </span>
          </div>
        ))}
      </Card>
    );
  };

  const renderChart = useMemo(() => {
    const commonProps = {
      data: optimizedData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };

    const ChartComponent = type === "area" ? AreaChart : type === "bar" ? BarChart : LineChart;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 12 }}
            stroke="#64748b"
          />
          <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: 12 }}
            iconType="circle"
          />
          <Brush 
            dataKey="timestamp" 
            height={30} 
            stroke="#6366f1"
            fill="#f1f5f9"
          />
          
          {metrics.map((metric, i) => {
            const color = colors[i % colors.length];
            
            if (type === "area") {
              return (
                <Area
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  name={metric.label}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              );
            } else if (type === "bar") {
              return (
                <Bar
                  key={metric.key}
                  dataKey={metric.key}
                  name={metric.label}
                  fill={color}
                />
              );
            } else {
              return (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  name={metric.label}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              );
            }
          })}
        </ChartComponent>
      </ResponsiveContainer>
    );
  }, [optimizedData, metrics, type]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">{title}</h3>
        <Badge variant="secondary">
          {data.length} points {optimizedData.length !== data.length && `(${optimizedData.length} displayed)`}
        </Badge>
      </div>
      {renderChart}
    </Card>
  );
}