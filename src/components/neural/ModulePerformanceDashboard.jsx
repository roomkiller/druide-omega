/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Module Performance Dashboard                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp } from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from "recharts";

export default function ModulePerformanceDashboard({ modules, systemMetrics }) {
  // Prepare performance data for each module
  const performanceData = modules.map(m => ({
    name: m.module_name.split(" ")[0],
    accuracy: m.performance_metrics?.accuracy || 0,
    speed: m.performance_metrics?.speed || 0,
    reliability: m.performance_metrics?.reliability || 0,
    adaptability: m.performance_metrics?.adaptability || 0
  }));

  // Prepare activation data
  const activationData = modules.map(m => ({
    name: m.module_name.split(" ")[0],
    activation: m.activation_level || 0,
    efficiency: m.efficiency || 0,
    capacity: m.processing_capacity || 0
  }));

  // Prepare consciousness contribution data
  const consciousnessData = modules
    .filter(m => m.active)
    .map(m => ({
      name: m.module_name.split(" ")[0],
      contribution: m.consciousness_contribution || 0
    }))
    .sort((a, b) => b.contribution - a.contribution);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-green-600" />
            <Badge className="bg-green-200 text-green-800">Système</Badge>
          </div>
          <div className="text-2xl font-bold text-green-900">{systemMetrics.avgActivation}%</div>
          <div className="text-xs text-green-700">Activation Moyenne</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <Badge className="bg-blue-200 text-blue-800">Performance</Badge>
          </div>
          <div className="text-2xl font-bold text-blue-900">{systemMetrics.avgEfficiency}%</div>
          <div className="text-xs text-blue-700">Efficacité Moyenne</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <Badge className="bg-purple-200 text-purple-800">Neurones</Badge>
          </div>
          <div className="text-2xl font-bold text-purple-900">{(systemMetrics.totalNeurons / 1000).toFixed(0)}K</div>
          <div className="text-xs text-purple-700">Neurones Totaux</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <Badge className="bg-indigo-200 text-indigo-800">Conscience</Badge>
          </div>
          <div className="text-2xl font-bold text-indigo-900">{systemMetrics.consciousnessLevel}%</div>
          <div className="text-xs text-indigo-700">Niveau Global</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Performance Radar Chart */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance par Module</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Précision" dataKey="accuracy" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Radar name="Vitesse" dataKey="speed" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Activation Bar Chart */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Niveaux d'Activation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="activation" fill="#8b5cf6" name="Activation" />
              <Bar dataKey="efficiency" fill="#06b6d4" name="Efficacité" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Consciousness Contribution */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Contribution à la Conscience</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={consciousnessData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 30]} tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="contribution" fill="#a855f7" name="Contribution (%)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Reliability & Adaptability */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Fiabilité & Adaptation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="reliability" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Fiabilité" />
              <Line type="monotone" dataKey="adaptability" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Adaptabilité" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Module Details Table */}
      <Card className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Détails des Modules</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-2 text-slate-600">Module</th>
                <th className="text-center p-2 text-slate-600">Actif</th>
                <th className="text-center p-2 text-slate-600">Activation</th>
                <th className="text-center p-2 text-slate-600">Efficacité</th>
                <th className="text-center p-2 text-slate-600">Neurones</th>
                <th className="text-center p-2 text-slate-600">Contribution</th>
              </tr>
            </thead>
            <tbody>
              {modules.map(module => (
                <tr key={module.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 font-medium text-slate-900">{module.module_name}</td>
                  <td className="p-2 text-center">
                    {module.active ? (
                      <Badge className="bg-green-100 text-green-700">✓</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-700">-</Badge>
                    )}
                  </td>
                  <td className="p-2 text-center font-semibold">{module.activation_level}%</td>
                  <td className="p-2 text-center font-semibold">{module.efficiency}%</td>
                  <td className="p-2 text-center">
                    {module.neural_parameters?.neuron_count 
                      ? `${(module.neural_parameters.neuron_count / 1000).toFixed(1)}K`
                      : 'N/A'}
                  </td>
                  <td className="p-2 text-center font-bold text-purple-700">
                    {module.consciousness_contribution}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * © 2025 AMG+A.L - PROPRIÉTAIRE
 * ═══════════════════════════════════════════════════════════════════════════
 */