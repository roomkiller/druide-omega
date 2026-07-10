/**
 * DRUIDE_OMEGA - Flux mémoriel
 * Les mémoires créées par le moteur au fil du temps, par type.
 */
import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Database } from 'lucide-react';

const TYPES = [
  { key: 'interaction', label: 'Interactions', color: '#3b82f6' },
  { key: 'insight', label: 'Insights', color: '#8b5cf6' },
  { key: 'fact', label: 'Faits', color: '#10b981' },
  { key: 'preference', label: 'Préférences', color: '#f59e0b' }
];

export default function MemoryFlux() {
  const { data: memories = [], isLoading } = useQuery({
    queryKey: ['memoryFlux'],
    queryFn: () => base44.entities.Memory.list('-created_date', 300)
  });

  // Regrouper par jour (30 derniers jours)
  const byDay = {};
  memories.forEach(m => {
    const day = new Date(m.created_date).toISOString().slice(0, 10);
    if (!byDay[day]) byDay[day] = {};
    byDay[day][m.type] = (byDay[day][m.type] || 0) + 1;
  });

  const points = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([day, counts]) => ({
      day: new Date(day + 'T12:00:00').toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' }),
      ...Object.fromEntries(TYPES.map(t => [t.key, counts[t.key] || 0]))
    }));

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = Object.values(byDay[today] || {}).reduce((a, b) => a + b, 0);

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-1">
        <Database className="w-5 h-5 text-emerald-600" />
        <h3 className="font-semibold text-slate-900">Flux mémoriel</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Chaque interaction avec DruideCore crée des mémoires — voici le rythme réel de mémorisation.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-700">{memories.length}</div>
          <div className="text-xs text-emerald-600">Mémoires (300 dernières)</div>
        </div>
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{todayCount}</div>
          <div className="text-xs text-blue-600">Aujourd'hui</div>
        </div>
        <div className="rounded-xl bg-purple-50 border border-purple-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">{new Set(memories.map(m => m.type)).size}</div>
          <div className="text-xs text-purple-600">Types actifs</div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-slate-400">Chargement...</div>
      ) : points.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-500">Aucune mémoire enregistrée.</div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              {TYPES.map(t => (
                <Area
                  key={t.key}
                  type="monotone"
                  dataKey={t.key}
                  name={t.label}
                  stackId="1"
                  stroke={t.color}
                  fill={t.color}
                  fillOpacity={0.35}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}