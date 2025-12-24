import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Award, AlertCircle } from "lucide-react";

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function TestMetricsChart({ learningData = [], feedbackData = [] }) {
  const categoryStats = useMemo(() => {
    const stats = {};
    learningData.forEach(item => {
      const cat = item.test_category;
      if (!stats[cat]) {
        stats[cat] = { category: cat, total: 0, avgScore: 0, sumScore: 0, count: 0 };
      }
      stats[cat].count++;
      stats[cat].sumScore += item.score_obtained || 0;
    });

    Object.values(stats).forEach(s => {
      s.avgScore = s.count > 0 ? Math.round(s.sumScore / s.count) : 0;
    });

    return Object.values(stats);
  }, [learningData]);

  const feedbackTrend = useMemo(() => {
    const last30Days = feedbackData.filter(f => {
      const date = new Date(f.created_date);
      const now = new Date();
      const diff = now - date;
      return diff < 30 * 24 * 60 * 60 * 1000;
    });

    const groupedByDay = {};
    last30Days.forEach(f => {
      const day = new Date(f.created_date).toLocaleDateString('fr-FR');
      if (!groupedByDay[day]) {
        groupedByDay[day] = { date: day, avgRating: 0, count: 0, sumRating: 0 };
      }
      groupedByDay[day].count++;
      groupedByDay[day].sumRating += f.rating || 0;
    });

    Object.values(groupedByDay).forEach(d => {
      d.avgRating = d.count > 0 ? (d.sumRating / d.count).toFixed(1) : 0;
    });

    return Object.values(groupedByDay).slice(-14);
  }, [feedbackData]);

  const feedbackDistribution = useMemo(() => {
    const types = {};
    feedbackData.forEach(f => {
      const type = f.feedback_type || 'unknown';
      types[type] = (types[type] || 0) + 1;
    });

    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [feedbackData]);

  return (
    <div className="space-y-6">
      {/* Scores par Catégorie */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-slate-900">Scores par Catégorie de Tests</h3>
        </div>
        {categoryStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgScore" fill="#8b5cf6" name="Score Moyen (%)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">
            Aucune donnée de test disponible
          </div>
        )}
      </Card>

      {/* Tendance Feedback Utilisateur */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900">Tendance Feedback Utilisateur (14 derniers jours)</h3>
        </div>
        {feedbackTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={feedbackTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgRating" stroke="#6366f1" strokeWidth={2} name="Note Moyenne (/5)" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">
            Aucun feedback récent
          </div>
        )}
      </Card>

      {/* Distribution Types de Feedback */}
      {feedbackDistribution.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-pink-600" />
            <h3 className="text-lg font-bold text-slate-900">Distribution des Feedbacks</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={feedbackDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {feedbackDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}